const CoursesSections = require('../models/CoursesSections.model')

const getCoursesSections = async (req, res) => {
    try {
        const resp = await CoursesSections.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesSections found',
                items: []
            });
        }
        return res.json([{
            message: 'CoursesSections',
            items: resp
        }])
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener secciones por curso
const getCoursesSectionsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const resp = await CoursesSections.find({ courses: courseId })
            .populate('courses')
            .sort({ createdAt: 1 });
        
        return res.json({
            message: 'CoursesSections by course',
            items: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener sección por ID
const getCoursesSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await CoursesSections.findById(id).populate('courses');
        
        if (!resp) {
            return res.status(404).json({
                message: 'CoursesSection not found'
            });
        }

        return res.json({
            message: 'CoursesSection found',
            detail: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Crear sección
const createCoursesSection = async (req, res) => {
    try {
        const { courses, name, description } = req.body;

        if (!courses || !name) {
            return res.status(400).json({
                message: 'Course ID y nombre son requeridos'
            });
        }

        const section = new CoursesSections({
            courses,
            name,
            description: description || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await section.save();

        const populated = await CoursesSections.findById(section._id).populate('courses');

        return res.status(201).json({
            message: 'CoursesSection created',
            detail: populated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating CoursesSection',
            detail: error.message
        })
    }
}

// Actualizar sección
const updateCoursesSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Nombre es requerido'
            });
        }

        const updated = await CoursesSections.findByIdAndUpdate(
            id,
            { 
                name, 
                description,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('courses');

        if (!updated) {
            return res.status(404).json({
                message: 'CoursesSection not found'
            });
        }

        return res.json({
            message: 'CoursesSection updated',
            detail: updated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating CoursesSection',
            detail: error.message
        })
    }
}

// Eliminar sección
const deleteCoursesSection = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await CoursesSections.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'CoursesSection not found'
            });
        }

        return res.json({
            message: 'CoursesSection deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting CoursesSection',
            detail: error.message
        })
    }
}

module.exports = {
    getCoursesSections,
    getCoursesSectionsByCourse,
    getCoursesSectionById,
    createCoursesSection,
    updateCoursesSection,
    deleteCoursesSection
}