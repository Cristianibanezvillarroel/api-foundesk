const UserCoursesProgress = require('../models/UserCoursesProgress.model');

// Crear un progress para una seccion de items del curso
const createProgress = async (req, res) => {
    try {
        const progress = new UserCoursesProgress(req.body);
        await progress.save();
        res.status(201).json({ message: 'Progreso agregado exitosamente', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el progreso', detail: error.message });
    }
};

// Obtener todos los progresos de un curso
const getProgressByCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        const progress = await UserCoursesProgress.find({ user: userId, courses: courseId }).populate(['user', 'courses', 'coursessectionsitems']);
        res.json({ message: 'Progresos encontrados', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los progresos', detail: error.message });
    }
};

// Actualizar un progreso
const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, coursessectionsitems, status } = req.body;
        const progressDoc = await UserCoursesProgress.findById(id);
        if (!progressDoc) {
            return res.status(404).json({ message: 'Progreso no encontrado' });
        }
        if (String(progressDoc.user) !== String(user) || String(progressDoc.coursessectionsitems) !== String(coursessectionsitems)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este progreso' });
        }
        const updated = await UserCoursesProgress.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Progreso actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el progreso', detail: error.message });
    }
};


module.exports = {
    createProgress,
    getProgressByCourse,
    updateProgress
};
