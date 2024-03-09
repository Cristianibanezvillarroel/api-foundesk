const CoursesContentCategories = require('../models/CoursesContentCategories.model')

const getCoursesContentCategories = async (req, res) => {
    try {
        const resp = await CoursesContentCategories.find()
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