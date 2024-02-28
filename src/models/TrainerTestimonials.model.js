const mongoose = require('mongoose')

const trainertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    nombre: {type: String},
    descripcion: {type: String},
    autor: {type: String},
    cargo: {type: String},
    imagen: {type: String}
}, {collection: 'trainertestimonials'})

const TrainerTestimonials = mongoose.model('TrainerTestimonials', trainertestimonialsSchema)
module.exports = TrainerTestimonials