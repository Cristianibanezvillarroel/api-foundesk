const mongoose = require('mongoose')

const coursessectionsitemsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    coursessections: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSections',
        required: true
    },
    name: {type: String},
    minutes: {type: Number}
}, {collection: 'coursessectionsitems'})

const CoursesSectionsItems = mongoose.model('CoursesSectionsItems', coursessectionsitemsSchema)
module.exports = CoursesSectionsItems