const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {type: String},
    image: {type: String},
    career: {type: String},
    careerinstitution: {type: String},
    postgraduate: {type: String},
    postgraduateinstitution: {type: String},
    experience: {type: Number},
    jobtitle: {type: String},
    company: {type: String},
    rating: {type: Number},
    ratings: {type: Number},
    students: {type: Number},
    courses: {type: Number},
    review: {type: String}
}, {collection: 'teacher'})

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher