const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createProgress,
    getProgressByUser,
    updateProgress,
    updateOrCreateProgress
} = require('../controllers/UserCoursesProgress.controller');

// Crear un progreso
router.post('/create', auth, createProgress);
// Obtener todos los progresos de un curso
router.post('/user/', getProgressByUser); // :userId por body
// Actualizar un progreso
router.put('/update/', auth, updateProgress); // :id por body
// Actualizar un progreso
router.put('/updateorcreate/', auth, updateOrCreateProgress); // :campos por body

module.exports = router;
