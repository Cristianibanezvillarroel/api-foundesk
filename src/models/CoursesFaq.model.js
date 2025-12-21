const mongoose = require('mongoose')

const coursesFaqSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    coursesSectionsLessons: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSectionsLessons',
        required: false,
        default: null
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {collection: 'coursesfaq'})

const CoursesFaq = mongoose.model('CoursesFaq', coursesFaqSchema)
module.exports = CoursesFaq
