const mongoose = require('mongoose')

const courseslearnitemsSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    description: {type: String}
}, {collection: 'courseslearnitems'})

const CoursesLearnItems = mongoose.model('CoursesLearnItems', courseslearnitemsSchema)
module.exports = CoursesLearnItems