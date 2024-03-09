const mongoose = require('mongoose')

const coursescontentcategoriesSchema = new mongoose.Schema({
    id_courses: {type: String},
    name: {type: String}
}, {collection: 'coursescontentcategories'})

const CoursesContentCategories = mongoose.model('CoursesContentCategories', coursescontentcategoriesSchema)
module.exports = CoursesContentCategories