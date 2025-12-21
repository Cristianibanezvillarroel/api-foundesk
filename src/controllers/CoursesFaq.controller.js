const CoursesFaq = require('../models/CoursesFaq.model');

// Crear una FAQ para un curso
const createFaq = async (req, res) => {
    try {
        const faq = new CoursesFaq(req.body);
        await faq.save();
        res.status(201).json({ message: 'FAQ creada exitosamente', faq });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la FAQ', detail: error.message });
    }
};

// Obtener todas las FAQs de un curso
const getFaqsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const faqs = await CoursesFaq.find({ courses: courseId })
            .populate('courses')
            .populate({
                path: 'coursesSectionsLessons',
                populate: {
                    path: 'coursessections'
                }
            })
            .sort({ order: 1, createdAt: 1 });
        res.json({ message: 'FAQs obtenidas', items: faqs });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener FAQs', detail: error.message });
    }
};

// Obtener FAQs activas de un curso (para estudiantes)
const getActiveFaqsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const faqs = await CoursesFaq.find({ courses: courseId, isActive: true })
            .populate('courses')
            .sort({ order: 1, createdAt: 1 });
        res.json({ message: 'FAQs activas obtenidas', items: faqs });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener FAQs activas', detail: error.message });
    }
};

// Obtener una FAQ por ID
const getFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await CoursesFaq.findById(id)
            .populate('courses')
            .populate({
                path: 'coursesSectionsLessons',
                populate: {
                    path: 'coursessections'
                }
            });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }
        res.json({ message: 'FAQ encontrada', faq });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la FAQ', detail: error.message });
    }
};

// Actualizar una FAQ
const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses, ...updateFields } = req.body;
        
        const faq = await CoursesFaq.findById(id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }
        
        if (String(faq.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta FAQ' });
        }
        
        const updated = await CoursesFaq.findByIdAndUpdate(
            id, 
            { ...updateFields, updatedAt: Date.now() }, 
            { new: true }
        );
        res.json({ message: 'FAQ actualizada', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la FAQ', detail: error.message });
    }
};

// Eliminar una FAQ
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses } = req.body;
        
        const faq = await CoursesFaq.findById(id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }
        
        if (String(faq.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta FAQ' });
        }
        
        await CoursesFaq.findByIdAndDelete(id);
        res.json({ message: 'FAQ eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la FAQ', detail: error.message });
    }
};

// Reordenar FAQs
const reorderFaqs = async (req, res) => {
    try {
        const { faqs } = req.body; // Array de { id, order }
        
        if (!Array.isArray(faqs)) {
            return res.status(400).json({ message: 'Se requiere un array de FAQs' });
        }
        
        const updatePromises = faqs.map(item => 
            CoursesFaq.findByIdAndUpdate(item.id, { order: item.order, updatedAt: Date.now() })
        );
        
        await Promise.all(updatePromises);
        res.json({ message: 'FAQs reordenadas exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reordenar FAQs', detail: error.message });
    }
};

module.exports = {
    createFaq,
    getFaqsByCourse,
    getActiveFaqsByCourse,
    getFaqById,
    updateFaq,
    deleteFaq,
    reorderFaqs
};
