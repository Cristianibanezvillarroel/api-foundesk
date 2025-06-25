const mongoose = require('mongoose')

const teachercommentsSchema = new mongoose.Schema({
    customercomments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomerComments',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'teachercomments'})

const TeacherComments = mongoose.model('TeacherComments', teachercommentsSchema)
module.exports = TeacherComments