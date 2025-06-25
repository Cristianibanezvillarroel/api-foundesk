const CustomerComments = require('../models/CustomerComments.model');

// Crear un comentario
const createComment = async (req, res) => {
    try {
        const comment = new CustomerComments(req.body);
        await comment.save();
        res.status(201).json({ message: 'Comentario creado exitosamente', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario', detail: error.message });
    }
};

// Obtener comentarios por anuncio de profesor, con populate de user
const getCommentsByAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.body;
        const comments = await CustomerComments.find({ teacherannouncements: announcementId })
            .populate('user');
        res.json({ message: 'Comentarios encontrados', comments });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios', detail: error.message });
    }
};

// Actualizar un comentario
const updateComment = async (req, res) => {
    try {
        const { description, user } = req.body;
        const { id } = req.params;
        const comment = await CustomerComments.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        if (String(comment.user) !== String(user)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este comentario' });
        }
        const updated = await CustomerComments.findByIdAndUpdate(
            id,
            { description, updatedAt: Date.now() },
            { new: true }
        );
        res.json({ message: 'Comentario actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el comentario', detail: error.message });
    }
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const comment = await CustomerComments.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        if (String(comment.user) !== String(user)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
        }
        await CustomerComments.findByIdAndDelete(id);
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el comentario', detail: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByAnnouncement,
    updateComment,
    deleteComment
};
