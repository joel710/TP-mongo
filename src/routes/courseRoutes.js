const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.post('/:courseId/enroll/:studentId', courseController.enrollStudent);
router.get('/:id/students', courseController.getCourseStudents);
router.post('/:courseId/students/:studentId/grade', courseController.addGrade);

module.exports = router;
