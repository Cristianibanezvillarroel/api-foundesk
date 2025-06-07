const express = require('express');
const router = express.Router();
const {
  enrollUserInCourse,
  getCoursesByUser,
  getUsersByCourse
} = require('../controllers/UserCourses.controller');

// Inscribir usuario en curso
router.post('/enroll', enrollUserInCourse);

// Obtener todos los cursos de un usuario
router.get('/user/:userId', getCoursesByUser);

// Obtener todos los usuarios de un curso
router.get('/course/:courseId', getUsersByCourse);

module.exports = router;
