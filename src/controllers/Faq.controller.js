const Faq = require('../models/Faq.model');

// Crear una FAQ
const createFaq = async (req, res) => {
    try {
        const faq = new Faq(req.body);
        await faq.save();
        res.status(201).json({ message: 'FAQ creada exitosamente', faq });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la FAQ', detail: error.message });
    }
};

// Obtener todas las FAQ
const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find().populate('user');
        res.json({ message: 'FAQs encontradas', faqs });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las FAQs', detail: error.message });
    }
};

// Actualizar una FAQ
const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, title, descriptionshort, descriptionlarge } = req.body;
        const faqDoc = await Faq.findById(id);
        if (!faqDoc) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }
        if (String(faqDoc.user) !== String(user)) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta FAQ' });
        }
        const updated = await Faq.findByIdAndUpdate(id, { title, descriptionshort, descriptionlarge, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'FAQ actualizada', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la FAQ', detail: error.message });
    }
};

// Eliminar una FAQ
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const faqDoc = await Faq.findById(id);
        if (!faqDoc) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }
        if (String(faqDoc.user) !== String(user)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta FAQ' });
        }
        await Faq.findByIdAndDelete(id);
        res.json({ message: 'FAQ eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la FAQ', detail: error.message });
    }
};

module.exports = {
    createFaq,
    getAllFaqs,
    updateFaq,
    deleteFaq
};
