const mongoose = require('mongoose')
const { use } = require('react')

const customertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    description: {type: String},
    image: {type: String},
    rating: {type: Number},
    timestamp: {type: Date},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {collection: 'customertestimonials'})

const CustomerTestimonials = mongoose.model('CustomerTestimonials', customertestimonialsSchema)
module.exports = CustomerTestimonials