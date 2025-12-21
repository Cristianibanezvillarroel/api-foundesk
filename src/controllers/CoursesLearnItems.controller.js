const CoursesLearnItems = require('../models/CoursesLearnItems.model')

const getCoursesLearnItems = async (req, res) => {
    try {
        const resp = await CoursesLearnItems.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesLearnItems found',
                items: []
            });
        }
        return res.json([{
            message: 'CoursesLearnItems',
            items: resp
        }])
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener items de aprendizaje por courseId
const getCoursesLearnItemsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const resp = await CoursesLearnItems.find({ courses: courseId }).populate('courses');
        
        return res.json({
            message: 'CoursesLearnItems by course',
            items: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener item de aprendizaje por ID
const getCoursesLearnItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await CoursesLearnItems.findById(id).populate('courses');
        
        if (!resp) {
            return res.status(404).json({
                message: 'CoursesLearnItem not found'
            });
        }

        return res.json({
            message: 'CoursesLearnItem found',
            detail: resp
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Crear item de aprendizaje
const createCoursesLearnItem = async (req, res) => {
    try {
        const { courses, description } = req.body;

        if (!courses || !description) {
            return res.status(400).json({
                message: 'Course ID y descripción son requeridos'
            });
        }

        const learnItem = new CoursesLearnItems({
            courses,
            description
        });

        await learnItem.save();

        const populated = await CoursesLearnItems.findById(learnItem._id).populate('courses');

        return res.status(201).json({
            message: 'CoursesLearnItem created',
            detail: populated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating CoursesLearnItem',
            detail: error.message
        })
    }
}

// Actualizar item de aprendizaje
const updateCoursesLearnItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                message: 'Descripción es requerida'
            });
        }

        const updated = await CoursesLearnItems.findByIdAndUpdate(
            id,
            { description },
            { new: true }
        ).populate('courses');

        if (!updated) {
            return res.status(404).json({
                message: 'CoursesLearnItem not found'
            });
        }

        return res.json({
            message: 'CoursesLearnItem updated',
            detail: updated
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating CoursesLearnItem',
            detail: error.message
        })
    }
}

// Eliminar item de aprendizaje
const deleteCoursesLearnItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await CoursesLearnItems.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'CoursesLearnItem not found'
            });
        }

        return res.json({
            message: 'CoursesLearnItem deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting CoursesLearnItem',
            detail: error.message
        })
    }
}

module.exports = {
    getCoursesLearnItems,
    getCoursesLearnItemsByCourse,
    getCoursesLearnItemById,
    createCoursesLearnItem,
    updateCoursesLearnItem,
    deleteCoursesLearnItem
}