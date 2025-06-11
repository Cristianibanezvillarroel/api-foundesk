const Courses = require('../models/Courses.model')

const getCourses = async (req, res) => {
    try {
        const resp = await Courses.find()
            .populate([
                    { path: 'categorie' },
                    { path: 'teacher' }
                ]);

        return res.json([{
            message: 'Courses',
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
    getCourses
}