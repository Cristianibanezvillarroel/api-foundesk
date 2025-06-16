const CoursesSectionsItems = require('../models/CoursesSectionsItems.model')

const getCoursesSectionsItems = async (req, res) => {
    try {
        const resp = await CoursesSectionsItems.find()
            .populate({
                path: 'coursessections',
                populate: [
                    { path: 'courses' }
                ]
            });

        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesSectionsItems found'
            });
        }
        return res.json([{
            message: 'CoursesSectionsItems',
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
    getCoursesSectionsItems
}