const mongoose = require('mongoose')

const usercoursesnotesSchema = new mongoose.Schema({
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
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'usercoursesnotes'})

const UserCoursesNotes = mongoose.model('UserCoursesNotes', usercoursesnotesSchema)
module.exports = UserCoursesNotes