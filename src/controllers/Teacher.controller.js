const Teacher = require('../models/Teacher.model')

const getTeacher = async (req, res) => {
    try {
        const resp = await Teacher.find()
        return res.json([{
            message: 'Teacher',
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
    getTeacher
}