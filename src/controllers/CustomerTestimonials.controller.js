const CustomerTestimonials = require('../models/CustomerTestimonials.model')

const getCustomerTestimonials = async (req, res) => {
    try {
        const resp = await CustomerTestimonials.find()
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