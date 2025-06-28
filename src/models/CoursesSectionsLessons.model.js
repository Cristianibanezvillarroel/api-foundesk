const mongoose = require('mongoose')

const coursessectionslessonsSchema = new mongoose.Schema({
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
}, {collection: 'coursessectionslessons'})

const CoursesSectionsLessons = mongoose.model('CoursesSectionsLessons', coursessectionslessonsSchema)
module.exports = CoursesSectionsLessons