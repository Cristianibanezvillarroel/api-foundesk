const mongoose = require('mongoose')

const coursessectionslessonsSchema = new mongoose.Schema({
    coursessections: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSections',
        required: true
    },
    name: {type: String},
    overview: {type: String},
    minutes: {type: Number},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursessectionslessons'})

const CoursesSectionsLessons = mongoose.model('CoursesSectionsLessons', coursessectionslessonsSchema)
module.exports = CoursesSectionsLessons