const CoursesSections = require('../models/CoursesSections.model')

const getCoursesSections = async (req, res) => {
    try {
        const resp = await CoursesSections.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesSections found'
            });
        }
        return res.json([{
            message: 'CoursesSections',
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
    getCoursesSections
}