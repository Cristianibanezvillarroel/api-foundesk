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
    coursessectionslessons: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSectionsLessons',
        required: true
    },
    minutesConsumed: { type: Number, default: 0 },
    lastPositionSeconds: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    status: { type: Boolean, default: true },
    updatedAt: {type: Date, default: Date.now}
}, { collection: 'usercoursesprogress' });

// Índice único para evitar duplicados
usercoursesprogressSchema.index({ user: 1, coursessectionslessons: 1 }, { unique: true });

const UserCoursesProgress = mongoose.model('UserCoursesProgress', usercoursesprogressSchema)
module.exports = UserCoursesProgress;