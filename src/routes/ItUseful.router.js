const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createItUseful,
    getItUsefulByUserAndFaq,
    updateItUseful,
    deleteItUseful
} = require('../controllers/ItUseful.controller');

// Crear un registro de utilidad
router.post('/create', createItUseful);
// Obtener un registro de utilidad por user y faq
router.get('/user/:userId/faq/:faqId', getItUsefulByUserAndFaq);
// Actualizar un registro de utilidad
router.put('/update/:id', auth, updateItUseful);
// Eliminar un registro de utilidad
router.delete('/delete/:id', auth, deleteItUseful);

module.exports = router;
