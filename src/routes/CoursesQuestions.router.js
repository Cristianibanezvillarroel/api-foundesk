const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByCourse
} = require('../controllers/CoursesQuestions.controller');

// Crear una pregunta
router.post('/create', createQuestion);
// Obtener todas las preguntas de un curso
router.get('/course/:courseId', getQuestionsByCourse);
// Actualizar una pregunta
router.put('/update/:id', auth, updateQuestion);
// Eliminar una pregunta
router.delete('/delete/:id', auth, deleteQuestion);

module.exports = router;
