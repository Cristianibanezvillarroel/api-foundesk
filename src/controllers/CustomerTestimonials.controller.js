const CustomerTestimonials = require('../models/CustomerTestimonials.model')

const getCustomerTestimonials = async (req, res) => {
    try {
        const resp = await CustomerTestimonials.find().populate('courses');
        if (!resp || resp.length === 0) {
            return res.json({
                message: 'No testimonials found'
            });
        }
        return res.json([{
            message: 'CustomerTestimonials',
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
    getCustomerTestimonials
}