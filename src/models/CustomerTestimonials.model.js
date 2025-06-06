const mongoose = require('mongoose')

const customertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    nombre: {type: String},
    descripcion: {type: String},
    autor: {type: String},
    cargo: {type: String},
    imagen: {type: String},
    calificacion: {type: Number},
    timestamp: {type: Date}
}, {collection: 'customertestimonials'})

const CustomerTestimonials = mongoose.model('CustomerTestimonials', customertestimonialsSchema)
module.exports = CustomerTestimonials