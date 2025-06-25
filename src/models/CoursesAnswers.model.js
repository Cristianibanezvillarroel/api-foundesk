const mongoose = require('mongoose')

const coursesanswersSchema = new mongoose.Schema({
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
    coursesquestions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesQuestions',
        required: true
    },
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursesanswers'})

const CoursesAnswers = mongoose.model('CoursesAnswers', coursesanswersSchema)
module.exports = CoursesAnswers