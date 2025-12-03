const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String },
    career: { type: String },
    careerinstitution: { type: String },
    postgraduate: { type: String },
    postgraduateinstitution: { type: String },
    experience: { type: Number },
    jobtitle: { type: String },
    company: { type: String },
    rating: { type: Number },
    ratings: { type: Number },
    students: { type: Number },
    courses: { type: Number },
    review: { type: String },
    image: { type: String },
    isConfirmed: { type: Boolean, default: false },
    courseName: { type: String },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    descriptionCourse: { type: String },
    motives: { type: String },
    expectations: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'teacher' })

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher