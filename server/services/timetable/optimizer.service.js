// services/timetable/optimizer.service.js
const { execPythonScript } = require('./pythonExecutor.service');
const conflictService = require('./conflict.service');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const path = require('path');

const optimizeTimetable = async (schedule, conflicts, optimizationCriteria) => {
    try {
        // Prepare input for optimization script
        const input = {
            schedule,
            conflicts,
            criteria: optimizationCriteria || {
                teacher_balance: true,
                room_utilization: true,
                student_breaks: true
            }
        };

        // Execute optimization script
        const result = await execPythonScript(
            path.join(__dirname, '../../python_models/models/optimizer.py'),
            input
        );

        if (!result || !result.optimized_schedule) {
            throw new Error('Optimization failed - invalid result');
        }

        // Check for new conflicts after optimization
        const newConflicts = conflictService.detectConflicts(result.optimized_schedule);

        logger.info(`Optimized timetable - ${newConflicts.length} conflicts remaining`);

        return {
            schedule: result.optimized_schedule,
            conflicts: newConflicts,
            improvements: result.improvements || []
        };

    } catch (error) {
        logger.error(`Optimization error: ${error.message}`);
        throw new ApiError(500, 'Failed to optimize timetable');
    }
};

const balanceTeacherLoad = (schedule, teachers) => {
    try {
        // Calculate current load
        const teacherLoad = {};
        teachers.forEach(teacher => {
            teacherLoad[teacher._id] = 0;
        });

        for (const day in schedule) {
            for (const period in schedule[day]) {
                const assignment = schedule[day][period];
                if (assignment && assignment.teacher) {
                    teacherLoad[assignment.teacher]++;
                }
            }
        }

        // Find imbalances
        const loads = Object.values(teacherLoad);
        const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
        const imbalances = [];

        for (const [teacherId, load] of Object.entries(teacherLoad)) {
            if (load > avgLoad * 1.3) {
                imbalances.push({
                    teacher: teacherId,
                    current: load,
                    recommended: Math.floor(avgLoad)
                });
            }
        }

        return imbalances;

    } catch (error) {
        logger.error(`Teacher load balance error: ${error.message}`);
        throw new ApiError(500, 'Failed to balance teacher load');
    }
};

const optimizeRoomUtilization = (schedule) => {
    try {
        // Calculate current utilization
        const roomUsage = {};
        let totalPeriods = 0;

        for (const day in schedule) {
            for (const period in schedule[day]) {
                totalPeriods++;
                const assignment = schedule[day][period];
                if (assignment && assignment.room) {
                    roomUsage[assignment.room] = (roomUsage[assignment.room] || 0) + 1;
                }
            }
        }

        // Identify underutilized rooms
        const recommendations = [];
        const avgUtilization = totalPeriods / Object.keys(roomUsage).length;

        for (const [room, used] of Object.entries(roomUsage)) {
            if (used < avgUtilization * 0.7) {
                recommendations.push({
                    room,
                    utilization: (used / totalPeriods) * 100,
                    recommended: Math.round(avgUtilization * 1.1)
                });
            }
        }

        return recommendations;

    } catch (error) {
        logger.error(`Room optimization error: ${error.message}`);
        throw new ApiError(500, 'Failed to optimize room utilization');
    }
};

module.exports = {
    optimizeTimetable,
    balanceTeacherLoad,
    optimizeRoomUtilization
};