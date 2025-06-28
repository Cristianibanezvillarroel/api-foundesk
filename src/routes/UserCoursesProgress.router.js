const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createProgress,
    getProgressByCourse,
    updateProgress
} = require('../controllers/UserCoursesProgress.controller');

// Crear un progreso
router.post('/create', auth, createProgress);
// Obtener todos los progresos de un curso
router.post('/course/', getProgressByCourse); // :courseId por body
// Actualizar un progreso
router.put('/update/', auth, updateProgress); // :id por body

module.exports = router;
