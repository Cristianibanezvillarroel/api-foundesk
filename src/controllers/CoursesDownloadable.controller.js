const CoursesDownloadable = require('../models/CoursesDownloadable.model');

// Crear un recurso descargable para un curso
const createDownloadable = async (req, res) => {
    try {
        const downloadable = new CoursesDownloadable(req.body);
        await downloadable.save();
        res.status(201).json({ message: 'Recurso descargable creado exitosamente', downloadable });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el recurso descargable', detail: error.message });
    }
};

// Obtener un recurso descargable por ID
const getDownloadableById = async (req, res) => {
    try {
        const { id } = req.params;
        const downloadable = await CoursesDownloadable.findById(id).populate('courses');
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        res.json({ message: 'Recurso descargable encontrado', downloadable });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el recurso descargable', detail: error.message });
    }
};

// Actualizar un recurso descargable
const updateDownloadable = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses, ...updateFields } = req.body;
        const downloadable = await CoursesDownloadable.findById(id);
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        if (String(downloadable.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este recurso' });
        }
        const updated = await CoursesDownloadable.findByIdAndUpdate(id, { ...updateFields, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Recurso descargable actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el recurso descargable', detail: error.message });
    }
};

// Eliminar un recurso descargable
const deleteDownloadable = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses } = req.body;
        const downloadable = await CoursesDownloadable.findById(id);
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        if (String(downloadable.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este recurso' });
        }
        await CoursesDownloadable.findByIdAndDelete(id);
        res.json({ message: 'Recurso descargable eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el recurso descargable', detail: error.message });
    }
};

module.exports = {
    createDownloadable,
    getDownloadableById,
    updateDownloadable,
    deleteDownloadable
};
