const CoursesAnswers = require('../models/CoursesAnswers.model');

// Crear una respuesta para una pregunta de curso
const createAnswer = async (req, res) => {
    try {
        const answer = new CoursesAnswers(req.body);
        await answer.save();
        res.status(201).json({ message: 'Respuesta creada exitosamente', answer });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la respuesta', detail: error.message });
    }
};

// Obtener todas las respuestas de un curso
const getAnswersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const answers = await CoursesAnswers.find({ courses: courseId }).populate(['user', 'courses', 'coursesquestions']);
        res.json({ message: 'Respuestas encontradas', answers });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las respuestas', detail: error.message });
    }
};

// Actualizar una respuesta
const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, coursesquestions, description } = req.body;
        const answerDoc = await CoursesAnswers.findById(id);
        if (!answerDoc) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        if (String(answerDoc.user) !== String(user) || String(answerDoc.coursesquestions) !== String(coursesquestions)) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta respuesta' });
        }
        const updated = await CoursesAnswers.findByIdAndUpdate(id, { description, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Respuesta actualizada', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la respuesta', detail: error.message });
    }
};

// Eliminar una respuesta
const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, coursesquestions } = req.body;
        const answerDoc = await CoursesAnswers.findById(id);
        if (!answerDoc) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        if (String(answerDoc.user) !== String(user) || String(answerDoc.coursesquestions) !== String(coursesquestions)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta respuesta' });
        }
        await CoursesAnswers.findByIdAndDelete(id);
        res.json({ message: 'Respuesta eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la respuesta', detail: error.message });
    }
};

module.exports = {
    createAnswer,
    getAnswersByCourse,
    updateAnswer,
    deleteAnswer
};
