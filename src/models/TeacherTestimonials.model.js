const mongoose = require('mongoose')

const teachertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    description: {type: String},
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
}, {collection: 'teachertestimonials'})

const TeacherTestimonials = mongoose.model('TeacherTestimonials', teachertestimonialsSchema)
module.exports = TeacherTestimonials