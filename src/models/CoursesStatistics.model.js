const mongoose = require('mongoose')

const coursesStatisticsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    hours: { type: Number, default: 0 },
    resources: { type: Number, default: 0 },
    faqs: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    assessments: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'coursesstatistics' })

const CoursesStatistics = mongoose.model('CoursesStatistics', coursesStatisticsSchema)
module.exports = CoursesStatistics