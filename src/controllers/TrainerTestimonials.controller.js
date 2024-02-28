const TrainerTestimonials = require('../models/TrainerTestimonials.model')

const getTrainerTestimonials = async (req, res) => {
    try {
        const resp = await TrainerTestimonials.find()
        return res.json([{
            message: 'TrainerTestimonials',
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
    getTrainerTestimonials
}