// routes/coordinator.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getDepartmentDetails,
  updateDepartment,
  manageDepartmentResources
} = require('../controllers/coordinator/department.controller');
const {
  collectTeacherPreferences,
  getDepartmentPreferences,
  validatePreferences
} = require('../controllers/coordinator/preference.controller');
const {
  addTeacher,
  getDepartmentTeachers,
  updateTeacher,
  assignSubjects
} = require('../controllers/coordinator/teacher.controller');
const {
  generateTimetable,
  approveTimetable,
  publishTimetable,
  getDepartmentTimetables,
  resolveConflict
} = require('../controllers/coordinator/timetable.controller');
const validate = require('../middleware/validate');
const {
  departmentSchema,
  resourceSchema,
  preferenceSchema,
  teacherSchema,
  subjectSchema,
  timetableSchema,
  conflictSchema
} = require('../validations/coordinator.validation');

// Apply coordinator role middleware to all routes
router.use(authenticate, requireRole('coordinator'));

// Department management
router.get('/department', getDepartmentDetails);
router.put('/department', validate(departmentSchema), updateDepartment);
router.post('/department/resources', validate(resourceSchema), manageDepartmentResources);

// Preference collection
router.post('/preferences', validate(preferenceSchema), collectTeacherPreferences);
router.get('/preferences', getDepartmentPreferences);
router.get('/preferences/validate', validatePreferences);

// Teacher management
router.post('/teachers', validate(teacherSchema), addTeacher);
router.get('/teachers', getDepartmentTeachers);
router.put('/teachers/:id', validate(teacherSchema), updateTeacher);
router.post('/teachers/:id/subjects', validate(subjectSchema), assignSubjects);

// Timetable management
router.post('/timetables/generate', validate(timetableSchema), generateTimetable);
router.put('/timetables/:id/approve', approveTimetable);
router.put('/timetables/:id/publish', publishTimetable);
router.get('/timetables', getDepartmentTimetables);
router.put('/timetables/:id/conflicts/:conflictId', validate(conflictSchema), resolveConflict);

module.exports = router;