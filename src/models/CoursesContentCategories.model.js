const mongoose = require('mongoose')
const Courses = require('./Courses.model')

const coursescontentcategoriesSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Courses,
        required: true
    },
    name: {type: String}
}, {collection: 'coursescontentcategories'})

const CoursesContentCategories = mongoose.model('CoursesContentCategories', coursescontentcategoriesSchema)
module.exports = CoursesContentCategories