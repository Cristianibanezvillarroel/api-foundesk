const mongoose = require('mongoose')

const coursescategoriesSchema = new mongoose.Schema({
    categoria: {type: String},
    idItem: {type: Number}
}, {collection: 'coursescategories'})

const CoursesCategories = mongoose.model('CoursesCategories', coursescategoriesSchema)
module.exports = CoursesCategories;