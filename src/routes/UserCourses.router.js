const express = require('express');
const router = express.Router();
const {
  enrollUserInCourse,
  getCoursesByUser,
  getUsersByCourse
} = require('../controllers/UserCourses.controller');

// Inscribir usuario en curso
router.post('/enroll', enrollUserInCourse);

// Obtener todos los cursos de un usuario (userId por body)
router.post('/user', getCoursesByUser);

// Obtener todos los usuarios de un curso (courseId por body)
router.post('/courses', getUsersByCourse);

module.exports = router;
