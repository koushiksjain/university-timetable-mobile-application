// routes/teacher.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getTimetable,
  getClassSchedule,
  findAvailableTeachers,
  bookAppointment,
  getPersonalTimetable,
  getPersonalWeekTimetable
} = require('../controllers/teacher/timetable.controller');
const {
  getDashboardData
} = require('../controllers/teacher/dashboard.controller');
const validate = require('../middleware/validate');
// const {
//   availabilitySchema
// } = require('../validations/teacher.validation');

// Apply teacher role middleware to all routes
router.use(authenticate, requireRole('teacher'));

// Timetable access
router.post('/timetable', getPersonalTimetable);
router.post('/week_timetable', getPersonalWeekTimetable);
// router.put('/availability', validate(availabilitySchema), updateAvailability);

// Class management
// router.get('/classes/:id', getClassDetails);
// router.get('/classes/:id/students', getStudentList);

// // Dashboard
// router.get('/dashboard', getDashboardData);

module.exports = router;