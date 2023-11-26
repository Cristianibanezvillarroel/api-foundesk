const mongoose = require('mongoose')

const customertestimonialsSchema = new mongoose.Schema({
    idItem: {type: Number},
    nombre: {type: String},
    descripcion: {type: String},
    autor: {type: String},
    cargo: {type: String},
    imagen: {type: String}
}, {collection: 'customertestimonials'})

const CustomerTestimonials = mongoose.model('CustomerTestimonials', customertestimonialsSchema)
module.exports = CustomerTestimonials