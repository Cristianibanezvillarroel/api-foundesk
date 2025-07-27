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
const getProgressByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const progress = await UserCoursesProgress.find({ user: userId }).populate(['user', 'courses', 'coursessectionslessons']);
        res.json({ message: 'Progresos encontrados', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los progresos', detail: error.message });
    }
};

// Actualizar un progreso
const updateProgress = async (req, res) => {
    try {
        const { user, courses, coursessectionslessons, status } = req.body;
        const progressDoc = await UserCoursesProgress.findOne({user: user, courses: courses, coursessectionslessons: coursessectionslessons});
        if (!progressDoc) {
            return res.status(404).json({ message: 'Progreso no encontrado' });
        }
        if (String(progressDoc.user) !== String(user)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este progreso' });
        }
        const updated = await UserCoursesProgress.findOneAndUpdate({ user, courses, coursessectionslessons },{ status, updatedAt: Date.now() },{ new: true });
        res.json({ message: 'Progreso actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el progreso', detail: error.message });
    }
};

// Actualizar o crear un progreso
const updateOrCreateProgress = async (req, res) => {
    try {
        const { user, courses, coursessectionslessons, status } = req.body;
        // Busca si ya existe el progreso
        let progressDoc = await UserCoursesProgress.findOne({ user, courses, coursessectionslessons });
        if (progressDoc) {
            // Si existe, actualiza
            progressDoc.status = status;
            progressDoc.updatedAt = Date.now();
            await progressDoc.save();
            return res.json({ message: 'Progreso actualizado', progress: progressDoc });
        } else {
            // Si no existe, crea
            progressDoc = new UserCoursesProgress({ user, courses, coursessectionslessons, status });
            await progressDoc.save();
            return res.status(201).json({ message: 'Progreso creado', progress: progressDoc });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar/crear el progreso', detail: error.message });
    }
};


module.exports = {
    createProgress,
    getProgressByUser,
    updateProgress,
    updateOrCreateProgress
};
