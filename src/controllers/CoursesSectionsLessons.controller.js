const CoursesSectionsLessons = require('../models/CoursesSectionsLessons.model')

const getCoursesSectionsLessons = async (req, res) => {
    try {
        const resp = await CoursesSectionsLessons.find()
            .populate({
                path: 'coursessections',
                populate: [
                    { path: 'courses' }
                ]
            });

        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesSectionsLessons found'
            });
        }
        return res.json([{
            message: 'CoursesSectionsLessons',
            items: resp
        }])
    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })

    }
}

module.exports = {
    getCoursesSectionsLessons
}