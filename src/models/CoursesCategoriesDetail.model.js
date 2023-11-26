const mongoose = require('mongoose')

const coursescategoriesdetailSchema = new mongoose.Schema({
    idItem: {type: Number},
    cantidad: {type: Number},
    categoria: {type: String},
    resena: {type: String},
    description: {type: String},
    imagenicono: {type: String},
    imagenpublicidad: {type: String},
    calificacion: {type: Number},
    reproducciones: {type: Number}
}, {collection: 'coursescategoriesdetail'})

const CoursesCategoriesDetail = mongoose.model('CoursesCategoriesDetail', coursescategoriesdetailSchema)
module.exports = CoursesCategoriesDetail