const mongoose = require('mongoose')

const coursesdownloadableSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    coursesSectionsLessons: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSectionsLessons',
        default: null
    },
    title: {type: String},
    description: {type: String},
    route: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursesdownloadable'})

const CoursesDownloadable = mongoose.model('CoursesDownloadable', coursesdownloadableSchema)
module.exports = CoursesDownloadable