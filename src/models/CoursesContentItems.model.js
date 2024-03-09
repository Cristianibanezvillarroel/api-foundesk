const mongoose = require('mongoose')

const coursescontentitemsSchema = new mongoose.Schema({
    id_courses: {type: String},
    id_courses_content_categories: {type: String},
    name: {type: String},
    minutes: {type: Number}
}, {collection: 'coursescontentitems'})

const CoursesContentItems = mongoose.model('CoursesContentItems', coursescontentitemsSchema)
module.exports = CoursesContentItems