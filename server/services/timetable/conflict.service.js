// services/timetable/conflict.service.js
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

const detectConflicts = (schedule) => {
    try {
        const conflicts = [];
        const teacherAssignments = {};
        const roomAssignments = {};
        const studentConflicts = {};

        // Iterate through each day and period
        for (const [day, periods] of Object.entries(schedule)) {
            for (const [period, assignment] of Object.entries(periods)) {
                if (!assignment) continue;

                const { teacher, room, subject, studentGroup } = assignment;

                // Check teacher conflicts
                const teacherKey = `${teacher}_${day}_${period}`;
                if (teacherAssignments[teacherKey]) {
                    conflicts.push({
                        type: 'teacher',
                        teacher,
                        day,
                        period,
                        conflictWith: teacherAssignments[teacherKey],
                        message: `Teacher ${teacher} double booked for ${day} ${period}`
                    });
                } else {
                    teacherAssignments[teacherKey] = subject;
                }

                // Check room conflicts
                const roomKey = `${room}_${day}_${period}`;
                if (roomAssignments[roomKey]) {
                    conflicts.push({
                        type: 'room',
                        room,
                        day,
                        period,
                        conflictWith: roomAssignments[roomKey],
                        message: `Room ${room} double booked for ${day} ${period}`
                    });
                } else {
                    roomAssignments[roomKey] = subject;
                }

                // Check student group conflicts (simplified)
                if (studentGroup) {
                    const groupKey = `${studentGroup}_${day}_${period}`;
                    if (studentConflicts[groupKey]) {
                        conflicts.push({
                            type: 'student',
                            studentGroup,
                            day,
                            period,
                            conflictWith: studentConflicts[groupKey],
                            message: `Student group ${studentGroup} has overlapping classes`
                        });
                    } else {
                        studentConflicts[groupKey] = subject;
                    }
                }
            }
        }

        logger.info(`Detected ${conflicts.length} conflicts in schedule`);
        return conflicts;

    } catch (error) {
        logger.error(`Conflict detection error: ${error.message}`);
        throw new ApiError(500, 'Failed to detect conflicts');
    }
};

const resolveConflict = (schedule, conflict, resolution) => {
    try {
        const { day, period } = conflict;
        const updatedSchedule = { ...schedule };

        switch (resolution.action) {
            case 'reschedule':
                // Move the conflicting assignment to a new slot
                if (!updatedSchedule[resolution.newDay]) {
                    updatedSchedule[resolution.newDay] = {};
                }
                updatedSchedule[resolution.newDay][resolution.newPeriod] = 
                    updatedSchedule[day][period];
                delete updatedSchedule[day][period];
                break;

            case 'reassign':
                // Assign a different teacher/room
                updatedSchedule[day][period] = {
                    ...updatedSchedule[day][period],
                    [resolution.resourceType]: resolution.newValue
                };
                break;

            case 'cancel':
                // Remove the assignment
                delete updatedSchedule[day][period];
                break;

            default:
                throw new ApiError(400, 'Invalid resolution action');
        }

        // Recheck for new conflicts after resolution
        const newConflicts = detectConflicts(updatedSchedule);

        return {
            schedule: updatedSchedule,
            newConflicts,
            resolvedConflict: conflict
        };

    } catch (error) {
        logger.error(`Conflict resolution error: ${error.message}`);
        throw new ApiError(500, 'Failed to resolve conflict');
    }
};

module.exports = {
    detectConflicts,
    resolveConflict
};