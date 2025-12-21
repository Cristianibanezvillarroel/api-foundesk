const mongoose = require('mongoose')

const coursesSchema = new mongoose.Schema({
    idItem: {type: Number},
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    title: {type: String},
    slug: {type: String},
    price: {type: Number},
    description: {type: String},
    descriptionAdd: {type: String},
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    imagecourse: {type: String},
    prerequisites: {type: String},
    targetaudience: {type: String}
}, {collection: 'courses'})

const Courses = mongoose.model('Courses', coursesSchema)
module.exports = Courses