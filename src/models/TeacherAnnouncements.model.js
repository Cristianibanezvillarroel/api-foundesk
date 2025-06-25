const mongoose = require('mongoose')

const teacherannouncementsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    title: {type: String},
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'teacherannouncements'})

const TeacherAnnouncements = mongoose.model('TeacherAnnouncements', teacherannouncementsSchema)
module.exports = TeacherAnnouncements