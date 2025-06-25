const mongoose = require('mongoose')

const coursesquestionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    title: {type: String},
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursesquestions'})

const CoursesQuestions = mongoose.model('CoursesQuestions', coursesquestionsSchema)
module.exports = CoursesQuestions