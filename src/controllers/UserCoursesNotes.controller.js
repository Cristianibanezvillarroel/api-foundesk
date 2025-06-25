const UserCoursesNotes = require('../models/UserCoursesNotes.model');

// Crear una nota para un usuario en un curso
const createNote = async (req, res) => {
    try {
        const note = new UserCoursesNotes(req.body);
        await note.save();
        res.status(201).json({ message: 'Nota creada exitosamente', note });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la nota', detail: error.message });
    }
};

// Obtener todas las notas de un usuario para un curso
const getNotesByUserAndCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        const notes = await UserCoursesNotes.find({ user: userId, course: courseId });
        res.json({ message: 'Notas encontradas', notes });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notas', detail: error.message });
    }
};

// Actualizar una nota
const updateNote = async (req, res) => {
    try {
        const { content, user, courses } = req.body;
        const { id } = req.params;
        const note = await UserCoursesNotes.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }
        if ((user && String(note.user) !== String(user)) || (courses && String(note.courses) !== String(courses))) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta nota' });
        }
        const updatedNote = await UserCoursesNotes.findByIdAndUpdate(id, { content }, { new: true });
        res.json({ message: 'Nota actualizada', note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la nota', detail: error.message });
    }
};

// Eliminar una nota
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, courses } = req.body;
        const note = await UserCoursesNotes.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }
        if ((user && String(note.user) !== String(user)) || (courses && String(note.courses) !== String(courses))) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta nota' });
        }
        await UserCoursesNotes.findByIdAndDelete(id);
        res.json({ message: 'Nota eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la nota', detail: error.message });
    }
};

module.exports = {
    createNote,
    getNotesByUserAndCourse,
    updateNote,
    deleteNote
};
