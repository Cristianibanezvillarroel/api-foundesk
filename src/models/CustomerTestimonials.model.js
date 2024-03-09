const mongoose = require('mongoose')

const customertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    id_courses: {type: String},
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