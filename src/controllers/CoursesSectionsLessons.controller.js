const CoursesSectionsLessons = require('../models/CoursesSectionsLessons.model')

const getCoursesSectionsLessons = async (req, res) => {
    try {
        const resp = await CoursesSectionsLessons.find()
            .populate({
                path: 'coursessections',
                populate: [
                    { path: 'courses' }
                ]
            })
            .sort({ createdAt: 1 });

        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesSectionsLessons found',
                items: []
            });
        }
        return res.json([{
            message: 'CoursesSectionsLessons',
            items: resp
        }])
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener lecciones por sección
const getCoursesSectionsLessonsBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const resp = await CoursesSectionsLessons.find({ coursessections: sectionId })
            .populate({
                path: 'coursessections',
                populate: [{ path: 'courses' }]
            })
            .sort({ createdAt: 1 });
        
        return res.json({
            message: 'CoursesSectionsLessons by section',
            items: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener lección por ID
const getCoursesSectionsLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await CoursesSectionsLessons.findById(id)
            .populate({
                path: 'coursessections',
                populate: [{ path: 'courses' }]
            });
        
        if (!resp) {
            return res.status(404).json({
                message: 'CoursesSectionsLesson not found'
            });
        }

        return res.json({
            message: 'CoursesSectionsLesson found',
            detail: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Crear lección
const createCoursesSectionsLesson = async (req, res) => {
    try {
        const { coursessections, name, overview, minutes } = req.body;

        if (!coursessections || !name) {
            return res.status(400).json({
                message: 'Section ID y nombre son requeridos'
            });
        }

        const lesson = new CoursesSectionsLessons({
            coursessections,
            name,
            overview: overview || '',
            minutes: minutes || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await lesson.save();

        const populated = await CoursesSectionsLessons.findById(lesson._id)
            .populate({
                path: 'coursessections',
                populate: [{ path: 'courses' }]
            });

        return res.status(201).json({
            message: 'CoursesSectionsLesson created',
            detail: populated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating CoursesSectionsLesson',
            detail: error.message
        })
    }
}

// Actualizar lección
const updateCoursesSectionsLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, overview, minutes } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Nombre es requerido'
            });
        }

        const updated = await CoursesSectionsLessons.findByIdAndUpdate(
            id,
            { 
                name, 
                overview,
                minutes,
                updatedAt: new Date()
            },
            { new: true }
        ).populate({
            path: 'coursessections',
            populate: [{ path: 'courses' }]
        });

        if (!updated) {
            return res.status(404).json({
                message: 'CoursesSectionsLesson not found'
            });
        }

        return res.json({
            message: 'CoursesSectionsLesson updated',
            detail: updated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating CoursesSectionsLesson',
            detail: error.message
        })
    }
}

// Eliminar lección
const deleteCoursesSectionsLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await CoursesSectionsLessons.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'CoursesSectionsLesson not found'
            });
        }

        return res.json({
            message: 'CoursesSectionsLesson deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting CoursesSectionsLesson',
            detail: error.message
        })
    }
}

module.exports = {
    getCoursesSectionsLessons,
    getCoursesSectionsLessonsBySection,
    getCoursesSectionsLessonById,
    createCoursesSectionsLesson,
    updateCoursesSectionsLesson,
    deleteCoursesSectionsLesson
}