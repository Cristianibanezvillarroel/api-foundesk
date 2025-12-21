const TeacherAnnouncements = require('../models/TeacherAnnouncements.model');

// Crear un anuncio de profesor
const createAnnouncement = async (req, res) => {
    try {
        const announcement = new TeacherAnnouncements(req.body);
        await announcement.save();
        res.status(201).json({ message: 'Anuncio creado exitosamente', announcement });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el anuncio', detail: error.message });
    }
};

// Obtener todos los anuncios de un curso
const getAnnouncementsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const announcements = await TeacherAnnouncements.find({ courses: courseId })
            .populate({
                path: 'courses',
                populate: { path: 'teacher' }
            })
            .sort({ createdAt: -1 });
        res.json({ message: 'Anuncios encontrados', items: announcements });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener anuncios', detail: error.message });
    }
};

// Actualizar un anuncio
const updateAnnouncement = async (req, res) => {
    try {
        const { title, description, courses } = req.body;
        const { id } = req.params;
        
        const announcement = await TeacherAnnouncements.findById(id).populate({
            path: 'courses',
            populate: { path: 'teacher' }
        });
        
        if (!announcement) {
            return res.status(404).json({ message: 'Anuncio no encontrado' });
        }
        
        // Validar que el curso enviado coincida con el curso del anuncio
        if (String(announcement.courses._id) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este anuncio' });
        }
        
        const updated = await TeacherAnnouncements.findByIdAndUpdate(
            id,
            { title, description, updatedAt: Date.now() },
            { new: true }
        );
        
        res.json({ message: 'Anuncio actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el anuncio', detail: error.message });
    }
};

// Eliminar un anuncio
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses } = req.body;
        
        const announcement = await TeacherAnnouncements.findById(id).populate({
            path: 'courses',
            populate: { path: 'teacher' }
        });
        
        if (!announcement) {
            return res.status(404).json({ message: 'Anuncio no encontrado' });
        }
        
        // Validar que el curso enviado coincida con el curso del anuncio
        if (String(announcement.courses._id) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este anuncio' });
        }
        
        await TeacherAnnouncements.findByIdAndDelete(id);
        res.json({ message: 'Anuncio eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el anuncio', detail: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncementsByCourse,
    updateAnnouncement,
    deleteAnnouncement
};
