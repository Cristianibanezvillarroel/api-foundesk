const CoursesQuestions = require('../models/CoursesQuestions.model');

// Crear una pregunta para un curso
const createQuestion = async (req, res) => {
    try {
        const question = new CoursesQuestions(req.body);
        await question.save();
        res.status(201).json({ message: 'Pregunta creada exitosamente', question });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la pregunta', detail: error.message });
    }
};

// Obtener todas las preguntas de un curso
const getQuestionsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const questions = await CoursesQuestions.find({ courses: courseId }).populate(['user', 'courses']);
        res.json({ message: 'Preguntas encontradas', questions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las preguntas', detail: error.message });
    }
};

// Actualizar una pregunta
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, courses, title, description } = req.body;
        const questionDoc = await CoursesQuestions.findById(id);
        if (!questionDoc) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }
        if (String(questionDoc.user) !== String(user) || String(questionDoc.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta pregunta' });
        }
        const updated = await CoursesQuestions.findByIdAndUpdate(id, { title, description, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Pregunta actualizada', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la pregunta', detail: error.message });
    }
};

// Eliminar una pregunta
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, courses } = req.body;
        const questionDoc = await CoursesQuestions.findById(id);
        if (!questionDoc) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }
        if (String(questionDoc.user) !== String(user) || String(questionDoc.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta pregunta' });
        }
        await CoursesQuestions.findByIdAndDelete(id);
        res.json({ message: 'Pregunta eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la pregunta', detail: error.message });
    }
};

module.exports = {
    createQuestion,
    getQuestionsByCourse,
    updateQuestion,
    deleteQuestion
};
