const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncementsByCourse,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/TeacherAnnouncements.controller');
const auth = require('../middlewares/authorization');

// Crear un anuncio
router.post('/create', createAnnouncement);
// Obtener anuncios de un curso
router.post('/course', getAnnouncementsByCourse);
// Actualizar un anuncio
router.put('/update/:id', auth, updateAnnouncement);
// Eliminar un anuncio
router.delete('/delete/:id', auth, deleteAnnouncement);

module.exports = router;
