const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Make sure these imports are correct and the functions exist
const {
  getStudentTimetable,
  getClassDetails
} = require('../controllers/student/timetable.controller'); // Adjust path if needed

const validate = require('../middleware/validate');
const {
  timetableQuerySchema,
  appointmentSchema
} = require('../validations/student.validation');

// Apply student role middleware to all routes
router.use(authenticate, requireRole('student'));

// Fix these route definitions - ensure each handler is a function
router.get('/timetable', validate(timetableQuerySchema), getStudentTimetable);
router.get('/class-schedule', getClassDetails);
// router.get('/teachers/available', findAvailableTeachers);
// router.post('/appointments', validate(appointmentSchema), bookAppointment);
// router.get('/dashboard', getDashboardData);

module.exports = router;