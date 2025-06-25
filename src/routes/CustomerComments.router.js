const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByAnnouncement,
  updateComment,
  deleteComment
} = require('../controllers/CustomerComments.controller');
const auth = require('../middlewares/authorization');

// Crear un comentario
router.post('/create', createComment);
// Obtener comentarios por anuncio
router.post('/announcement', getCommentsByAnnouncement);
// Actualizar un comentario
router.put('/update/:id', auth, updateComment);
// Eliminar un comentario
router.delete('/delete/:id', auth, deleteComment);

module.exports = router;
