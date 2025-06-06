const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')

const coursescategoriesdetailSchema = new mongoose.Schema({
    idItem: {type: Number},
    cantidad: {type: Number},
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    resena: {type: String},
    description: {type: String},
    imagenicono: {type: String},
    imagenpublicidad: {type: String},
    calificacion: {type: Number},
    reproducciones: {type: Number}
}, {collection: 'coursescategoriesdetail'})

const CoursesCategoriesDetail = mongoose.model('CoursesCategoriesDetail', coursescategoriesdetailSchema)
module.exports = CoursesCategoriesDetail