const express = require('express');
const router = express.Router();
const {
    createTeacherComment,
    getTeacherComments,
    updateTeacherComment,
    deleteTeacherComment
} = require('../controllers/TeacherComments.controller');
const auth = require('../middlewares/authorization');

// Crear un comentario de profesor
router.post('/create', createTeacherComment);

// Obtener todos los comentarios de profesor
router.get('/customer', getTeacherComments);

// Actualizar un comentario de profesor
router.put('/update/:id', auth, updateTeacherComment);

// Eliminar un comentario de profesor
router.delete('/delete/:id', auth, deleteTeacherComment);

module.exports = router;
