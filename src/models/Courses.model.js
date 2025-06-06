const mongoose = require('mongoose')
const CoursesCategories = require('./CoursesCategories.model')
const Teacher = require('./Teacher.model')
const { required } = require('nodemon/lib/config')

const coursesSchema = new mongoose.Schema({
    idItem: {type: Number},
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CoursesCategories,
        required: true
    },
    tipo: {type: String},
    title: {type: String},
    author: {type: String},
    price: {type: Number},
    description: {type: String},
    descriptionAdd: {type: String},
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Teacher,
        required: true
    },
    imagen: {type: String}
}, {collection: 'courses'})

const Courses = mongoose.model('Courses', coursesSchema)
module.exports = Courses