const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotesByUserAndCourse,
  updateNote,
  deleteNote
} = require('../controllers/UserCoursesNotes.controller');
const auth = require('../middlewares/authorization');

// Crear una nota
router.post('/create', createNote);
// Obtener notas de un usuario para un curso
router.post('/user', getNotesByUserAndCourse);
// Actualizar una nota
router.put('/update/:id', auth, updateNote);
// Eliminar una nota
router.delete('/delete/:id', auth, deleteNote);

module.exports = router;
