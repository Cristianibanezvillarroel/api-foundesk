const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createDownloadable,
    getDownloadableById,
    updateDownloadable,
    deleteDownloadable
} = require('../controllers/CoursesDownloadable.controller');

// Crear un recurso descargable
router.post('/create', createDownloadable);
// Obtener un recurso descargable por ID
router.get('/:id', getDownloadableById);
// Actualizar un recurso descargable
router.put('/update/:id', auth, updateDownloadable);
// Eliminar un recurso descargable
router.delete('/delete/:id', auth, deleteDownloadable);

module.exports = router;
