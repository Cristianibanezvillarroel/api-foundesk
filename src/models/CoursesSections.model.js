const mongoose = require('mongoose')

const coursessectionsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    name: {type: String}
}, {collection: 'coursessections'})

const CoursesSections = mongoose.model('CoursesSections', coursessectionsSchema)
module.exports = CoursesSections