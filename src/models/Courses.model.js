const mongoose = require('mongoose')

const coursesSchema = new mongoose.Schema({
    idItem: {type: Number},
    categoria: {type: String},
    tipo: {type: String},
    title: {type: String},
    author: {type: String},
    price: {type: String},
    description: {type: String},
    imagen: {type: String}
}, {collection: 'courses'})

const Courses = mongoose.model('Courses', coursesSchema)
module.exports = Courses