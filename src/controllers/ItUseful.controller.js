const ItUseful = require('../models/ItUseful.model');

// Crear un registro de utilidad para una FAQ
const createItUseful = async (req, res) => {
    try {
        const itUseful = new ItUseful(req.body);
        await itUseful.save();
        res.status(201).json({ message: 'Registro de utilidad creado exitosamente', itUseful });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el registro de utilidad', detail: error.message });
    }
};

// Obtener un registro de utilidad por user y faq
const getItUsefulByUserAndFaq = async (req, res) => {
    try {
        const { userId, faqId } = req.params;
        const itUseful = await ItUseful.findOne({ user: userId, faq: faqId }).populate(['user', 'faq']);
        if (!itUseful) {
            return res.status(404).json({ message: 'Registro de utilidad no encontrado' });
        }
        res.json({ message: 'Registro de utilidad encontrado', itUseful });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro de utilidad', detail: error.message });
    }
};

// Actualizar un registro de utilidad
const updateItUseful = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, faq, useful } = req.body;
        const itUsefulDoc = await ItUseful.findById(id);
        if (!itUsefulDoc) {
            return res.status(404).json({ message: 'Registro de utilidad no encontrado' });
        }
        if (String(itUsefulDoc.user) !== String(user) || String(itUsefulDoc.faq) !== String(faq)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este registro' });
        }
        const updated = await ItUseful.findByIdAndUpdate(id, { useful, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Registro de utilidad actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro de utilidad', detail: error.message });
    }
};

// Eliminar un registro de utilidad
const deleteItUseful = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, faq } = req.body;
        const itUsefulDoc = await ItUseful.findById(id);
        if (!itUsefulDoc) {
            return res.status(404).json({ message: 'Registro de utilidad no encontrado' });
        }
        if (String(itUsefulDoc.user) !== String(user) || String(itUsefulDoc.faq) !== String(faq)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este registro' });
        }
        await ItUseful.findByIdAndDelete(id);
        res.json({ message: 'Registro de utilidad eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro de utilidad', detail: error.message });
    }
};

module.exports = {
    createItUseful,
    getItUsefulByUserAndFaq,
    updateItUseful,
    deleteItUseful
};
