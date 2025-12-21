const mongoose = require('mongoose')

const coursessectionsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    name: {type: String},
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursessections'})

const CoursesSections = mongoose.model('CoursesSections', coursessectionsSchema)
module.exports = CoursesSections