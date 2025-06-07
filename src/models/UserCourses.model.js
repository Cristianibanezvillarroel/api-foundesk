const mongoose = require('mongoose')

const userCoursesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courses: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    enrolledAt: { type: Date, default: Date.now }
}, { collection: 'usercourses' })

const UserCourses = mongoose.model('UserCourses', userCoursesSchema)
module.exports = UserCourses
