const mongoose = require('mongoose')

const teachertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    nombre: {type: String},
    descripcion: {type: String},
    autor: {type: String},
    cargo: {type: String},
    imagen: {type: String}
}, {collection: 'teachertestimonials'})

const TeacherTestimonials = mongoose.model('TeacherTestimonials', teachertestimonialsSchema)
module.exports = TeacherTestimonials