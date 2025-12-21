const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const fileUploadProcessor = require('../middlewares/fileUploadProcessor');
const {
    createDownloadable,
    getDownloadableById,
    getDownloadablesByCourse,
    updateDownloadable,
    deleteDownloadable,
    uploadDownloadable,
    downloadFile
} = require('../controllers/CoursesDownloadable.controller');

// Crear un recurso descargable con upload de archivo
router.post('/upload', auth, fileUploadProcessor, uploadDownloadable);
// Crear un recurso descargable
router.post('/create', auth, createDownloadable);
// Obtener todos los recursos descargables de un curso
router.get('/course/:courseId', auth, getDownloadablesByCourse);
// Descargar un archivo
router.get('/download/:id', auth, downloadFile);
// Obtener un recurso descargable por ID
router.get('/:id', auth, getDownloadableById);
// Actualizar un recurso descargable
router.put('/update/:id', auth, fileUploadProcessor, updateDownloadable);
// Eliminar un recurso descargable
router.delete('/delete/:id', auth, deleteDownloadable);

module.exports = router;
