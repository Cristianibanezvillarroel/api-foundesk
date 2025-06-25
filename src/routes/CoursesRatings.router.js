const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createRating,
    updateRating,
    deleteRating,
    getRatingsByCourse
} = require('../controllers/CoursesRatings.controller');

// Crear una calificación
router.post('/create', createRating);
// Obtener todas las calificaciones de un curso
router.get('/course/:courseId', getRatingsByCourse);
// Actualizar una calificación
router.put('/update/:id', auth, updateRating);
// Eliminar una calificación
router.delete('/delete/:id', auth, deleteRating);

module.exports = router;
