const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {
    createFaq,
    getFaqsByCourse,
    getActiveFaqsByCourse,
    getFaqById,
    updateFaq,
    deleteFaq,
    reorderFaqs
} = require('../controllers/CoursesFaq.controller');

// Crear una FAQ
router.post('/create', auth, createFaq);

// Obtener todas las FAQs de un curso (teacher)
router.get('/course/:courseId', auth, getFaqsByCourse);

// Obtener FAQs activas de un curso (estudiantes)
router.get('/active/course/:courseId', getActiveFaqsByCourse);

// Obtener una FAQ por ID
router.get('/:id', auth, getFaqById);

// Actualizar una FAQ
router.put('/update/:id', auth, updateFaq);

// Eliminar una FAQ
router.delete('/delete/:id', auth, deleteFaq);

// Reordenar FAQs
router.post('/reorder', auth, reorderFaqs);

module.exports = router;
