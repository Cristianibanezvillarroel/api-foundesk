const CoursesContentItems = require('../models/CoursesContentItems.model')

const getCoursesContentItems = async (req, res) => {
    try {
        const resp = await CoursesContentItems.find()
        return res.json([{
            message: 'CoursesContentItems',
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
    getCoursesContentItems
}