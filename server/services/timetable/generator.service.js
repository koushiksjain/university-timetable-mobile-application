// services/timetable/generator.service.js
const { execPythonScript } = require('./pythonExecutor.service');
const conflictService = require('./conflict.service');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const path = require('path');

const generateTimetable = async (input) => {
    try {
        const { subjects, teachers, preferences, algorithm = 'genetic' } = input;

        // Prepare data for Python script
        const pythonInput = {
            subjects: subjects.map(subj => ({
                id: subj._id.toString(),
                name: subj.name,
                code: subj.code,
                hours_per_week: subj.hoursPerWeek,
                is_lab: subj.isLab,
                teacher_preferences: subj.teacherPreferences || []
            })),
            teachers: teachers.map(teacher => ({
                id: teacher._id.toString(),
                name: `${teacher.firstName} ${teacher.lastName}`,
                max_hours: teacher.maxHoursPerWeek || 20,
                qualifications: teacher.qualifications || [],
                subject_competencies: teacher.subjects.map(s => s.toString())
            })),
            preferences: preferences.map(pref => ({
                teacher_id: pref.teacher._id.toString(),
                preferred_days: pref.preferredDays,
                preferred_periods: pref.preferredPeriods,
                unavailable_days: pref.unavailableDays,
                unavailable_periods: pref.unavailablePeriods,
                max_continuous_classes: pref.maxContinuousClasses,
                min_gap_between_classes: pref.minGapBetweenClasses
            })),
            constraints: {
                max_classes_per_day: 6,
                min_classes_per_day: 3,
                max_continuous_classes: 3,
                lunch_break: { start: '12:00', end: '13:00' }
            },
            algorithm
        };

        // Execute Python script
        const result = await execPythonScript(
            path.join(__dirname, '../../python_models/models/timetable_generator.py'),
            pythonInput
        );

        if (!result || !result.schedule) {
            throw new Error('Python script returned invalid result');
        }

        // Detect conflicts
        const conflicts = conflictService.detectConflicts(result.schedule);

        // Prepare stats
        const stats = {
            teacher_utilization: calculateUtilization(result.schedule, teachers.length),
            room_utilization: calculateRoomUtilization(result.schedule),
            constraints_satisfied: conflicts.length === 0
        };

        logger.info(`Generated timetable with ${conflicts.length} conflicts`);

        return {
            schedule: result.schedule,
            conflicts,
            stats
        };

    } catch (error) {
        logger.error(`Timetable generation error: ${error.message}`);
        throw new ApiError(500, 'Failed to generate timetable');
    }
};

const calculateUtilization = (schedule, teacherCount) => {
    const teacherHours = {};
    let totalPossibleHours = 0;

    for (const [day, periods] of Object.entries(schedule)) {
        for (const [period, assignment] of Object.entries(periods)) {
            if (assignment && assignment.teacher) {
                teacherHours[assignment.teacher] = (teacherHours[assignment.teacher] || 0) + 1;
                totalPossibleHours++;
            }
        }
    }

    const avgUtilization = Object.keys(teacherHours).length > 0
        ? (Object.values(teacherHours).reduce((a, b) => a + b, 0) / (teacherCount * 30)) * 100
        : 0;

    return {
        average: avgUtilization,
        by_teacher: teacherHours
    };
};

const calculateRoomUtilization = (schedule) => {
    const roomHours = {};
    let totalPeriods = 0;

    for (const [day, periods] of Object.entries(schedule)) {
        for (const [period, assignment] of Object.entries(periods)) {
            totalPeriods++;
            if (assignment && assignment.room) {
                roomHours[assignment.room] = (roomHours[assignment.room] || 0) + 1;
            }
        }
    }

    const utilization = {};
    for (const [room, hours] of Object.entries(roomHours)) {
        utilization[room] = (hours / totalPeriods) * 100;
    }

    return utilization;
};

module.exports = {
    generateTimetable
};