const CoursesRatings = require('../models/CoursesRatings.model');

// Crear una calificación para un curso
const createRating = async (req, res) => {
    try {
        const rating = new CoursesRatings(req.body);
        await rating.save();
        res.status(201).json({ message: 'Calificación creada exitosamente', rating });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la calificación', detail: error.message });
    }
};

// Obtener todas las calificaciones de un curso
const getRatingsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const ratings = await CoursesRatings.find({ courses: courseId }).populate(['user', 'courses']);
        res.json({ message: 'Calificaciones encontradas', ratings });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las calificaciones', detail: error.message });
    }
};

// Actualizar una calificación
const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, courses, rating: newRating } = req.body;
        const ratingDoc = await CoursesRatings.findById(id);
        if (!ratingDoc) {
            return res.status(404).json({ message: 'Calificación no encontrada' });
        }
        if (String(ratingDoc.user) !== String(user) || String(ratingDoc.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta calificación' });
        }
        const updated = await CoursesRatings.findByIdAndUpdate(id, { rating: newRating, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Calificación actualizada', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la calificación', detail: error.message });
    }
};

// Eliminar una calificación
const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, courses } = req.body;
        const ratingDoc = await CoursesRatings.findById(id);
        if (!ratingDoc) {
            return res.status(404).json({ message: 'Calificación no encontrada' });
        }
        if (String(ratingDoc.user) !== String(user) || String(ratingDoc.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta calificación' });
        }
        await CoursesRatings.findByIdAndDelete(id);
        res.json({ message: 'Calificación eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la calificación', detail: error.message });
    }
};

module.exports = {
    createRating,
    getRatingsByCourse,
    updateRating,
    deleteRating
};
