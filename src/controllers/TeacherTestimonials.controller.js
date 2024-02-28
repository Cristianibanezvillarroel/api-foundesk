const TeacherTestimonials = require('../models/TeacherTestimonials.model')

const getTeacherTestimonials = async (req, res) => {
    try {
        const resp = await TeacherTestimonials.find()
        return res.json([{
            message: 'TeacherTestimonials',
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
    getTeacherTestimonials
}