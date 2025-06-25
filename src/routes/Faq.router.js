const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createFaq,
    getAllFaqs,
    updateFaq,
    deleteFaq
} = require('../controllers/Faq.controller');

// Crear una FAQ
router.post('/create', createFaq);
// Obtener todas las FAQ
router.get('/all', getAllFaqs);
// Actualizar una FAQ
router.put('/update/:id', auth, updateFaq);
// Eliminar una FAQ
router.delete('/delete/:id', auth, deleteFaq);

module.exports = router;
