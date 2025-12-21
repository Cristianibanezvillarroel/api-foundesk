const express = require('express');
const router = express.Router();
const {
    createVideo,
    getVideosByCourse,
    getFreePreviewVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideoStreamUrl
} = require('../controllers/CoursesVideos.controller');
const auth = require('../middlewares/authorization');

// Crear video (con auth)
router.post('/create', auth, createVideo);

// Obtener todos los videos de un curso (con auth)
router.get('/course/:courseId', auth, getVideosByCourse);

// Obtener videos de preview gratuitos (sin auth - público)
router.get('/preview/course/:courseId', getFreePreviewVideos);

// Obtener video por ID (con auth)
router.get('/:id', auth, getVideoById);

// Actualizar video (con auth)
router.put('/update/:id', auth, updateVideo);

// Eliminar video (con auth)
router.delete('/delete/:id', auth, deleteVideo);

// Obtener URL de streaming (con validación de acceso)
router.get('/stream/:id', getVideoStreamUrl);

module.exports = router;
