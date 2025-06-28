const mongoose = require('mongoose');

const usercoursesprogressSchema = new mongoose.Schema({
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
    coursessectionsitems: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSectionsItems',
        required: true
    },
    status: { type: Boolean, default: true },
    updatedAt: {type: Date, default: Date.now}
}, { collection: 'usercoursesprogress' });

const UserCoursesProgress = mongoose.model('UserCoursesProgress', usercoursesprogressSchema)
module.exports = UserCoursesProgress;