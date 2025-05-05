// routes/student.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getTimetable,
  getClassSchedule,
  findAvailableTeachers,
  bookAppointment
} = require('../controllers/student/timetable.controller');
const {
  getDashboardData
} = require('../controllers/student/dashboard.controller');
const validate = require('../middleware/validate');
const {
  timetableQuerySchema,
  appointmentSchema
} = require('../validations/student.validation');

// Apply student role middleware to all routes
router.use(authenticate, requireRole('student'));

// Timetable access
router.get('/timetable', validate(timetableQuerySchema), getTimetable);
router.get('/class-schedule', getClassSchedule);

// Teacher availability
router.get('/teachers/available', findAvailableTeachers);
router.post('/appointments', validate(appointmentSchema), bookAppointment);

// Dashboard
router.get('/dashboard', getDashboardData);

module.exports = router;