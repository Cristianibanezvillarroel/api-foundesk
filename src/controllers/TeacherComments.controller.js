const TeacherComments = require('../models/TeacherComments.model');

// Crear un comentario de profesor
const createTeacherComment = async (req, res) => {
    try {
        const comment = new TeacherComments(req.body);
        await comment.save();
        res.status(201).json({ message: 'Comentario de profesor creado exitosamente', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario de profesor', detail: error.message });
    }
};

// Obtener comentarios de profesor con populate de customercomments y teacher usando array de paths
const getTeacherComments = async (req, res) => {
    try {
        const comments = await TeacherComments.find()
            .populate([
                { path: 'customercomments' },
                { path: 'teacher' }
            ]);
        res.json({ message: 'Comentarios de profesor encontrados', comments });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios de profesor', detail: error.message });
    }
};

// Actualizar un comentario de profesor
const updateTeacherComment = async (req, res) => {
    try {
        const { description, teacher } = req.body;
        const { id } = req.params;
        const comment = await TeacherComments.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        if (String(comment.teacher) !== String(teacher)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este comentario' });
        }
        const updated = await TeacherComments.findByIdAndUpdate(
            id,
            { description, updatedAt: Date.now() },
            { new: true }
        );
        res.json({ message: 'Comentario de profesor actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el comentario de profesor', detail: error.message });
    }
};

// Eliminar un comentario de profesor
const deleteTeacherComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { teacher } = req.body;
        const comment = await TeacherComments.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        if (String(comment.teacher) !== String(teacher)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
        }
        await TeacherComments.findByIdAndDelete(id);
        res.json({ message: 'Comentario de profesor eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el comentario de profesor', detail: error.message });
    }
};

module.exports = {
    createTeacherComment,
    getTeacherComments,
    updateTeacherComment,
    deleteTeacherComment
};
