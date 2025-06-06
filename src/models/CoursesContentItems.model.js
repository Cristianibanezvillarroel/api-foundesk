const mongoose = require('mongoose')

const coursescontentitemsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    coursescontentcategories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesContentCategories',
        required: true
    },
    name: {type: String},
    minutes: {type: Number}
}, {collection: 'coursescontentitems'})

const CoursesContentItems = mongoose.model('CoursesContentItems', coursescontentitemsSchema)
module.exports = CoursesContentItems