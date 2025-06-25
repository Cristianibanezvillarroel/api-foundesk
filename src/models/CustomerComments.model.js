const mongoose = require('mongoose')

const customercommentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherannouncements: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherAnnouncements',
        required: true
    },
    description: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'customercomments'})

const CustomerComments = mongoose.model('CustomerComments', customercommentsSchema)
module.exports = CustomerComments