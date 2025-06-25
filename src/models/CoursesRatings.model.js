const mongoose = require('mongoose')

const coursesratingsSchema = new mongoose.Schema({
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
    rating: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'coursesratings'})

const CoursesRatings = mongoose.model('CoursesRatings', coursesratingsSchema)
module.exports = CoursesRatings