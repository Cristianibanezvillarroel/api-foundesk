const CoursesLearnItems = require('../models/CoursesLearnItems.model')

const getCoursesLearnItems = async (req, res) => {
    try {
        const resp = await CoursesLearnItems.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesLearnItems found'
            });
        }
        return res.json([{
            message: 'CoursesLearnItems',
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
    getCoursesLearnItems
}