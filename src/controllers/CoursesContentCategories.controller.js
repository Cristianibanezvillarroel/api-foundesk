const CoursesContentCategories = require('../models/CoursesContentCategories.model')

const getCoursesContentCategories = async (req, res) => {
    try {
        const resp = await CoursesContentCategories.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesContentCategories found'
            });
        }
        return res.json([{
            message: 'CoursesContentCategories',
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
    getCoursesContentCategories
}