const CoursesCategories = require('../models/CoursesCategories.model')

const getCoursesCategories = async (req, res) => {
    try {
        const resp = await CoursesCategories.find()
        return res.json([{
            message: 'CoursesCategories',
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
    getCoursesCategories
}