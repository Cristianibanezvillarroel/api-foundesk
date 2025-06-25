const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createAnswer,
    getAnswersByCourse,
    updateAnswer,
    deleteAnswer
} = require('../controllers/CoursesAnswers.controller');

// Crear una respuesta
router.post('/create', createAnswer);
// Obtener todas las respuestas de un curso
router.get('/course/:courseId', getAnswersByCourse);
// Actualizar una respuesta
router.put('/update/:id', auth, updateAnswer);
// Eliminar una respuesta
router.delete('/delete/:id', auth, deleteAnswer);

module.exports = router;
