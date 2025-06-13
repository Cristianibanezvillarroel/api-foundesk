const CoursesContentItems = require('../models/CoursesContentItems.model')

const getCoursesContentItems = async (req, res) => {
    try {
        const resp = await CoursesContentItems.find()
            .populate({
                path: 'coursescontentcategories',
                populate: [
                    { path: 'courses' }
                ]
            });

        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No CoursesContentItems found'
            });
        }
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