const CoursesCategoriesDetail = require('../models/CoursesCategoriesDetail.model')

const getCoursesCategoriesDetail = async (req, res) => {
    try {
        const resp = await CoursesCategoriesDetail.find()
        return res.json([{
            message: 'CoursesCategoriesDetail',
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
    getCoursesCategoriesDetail
}