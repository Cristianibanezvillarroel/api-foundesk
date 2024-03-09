const mongoose = require('mongoose')

const courseslearnitemsSchema = new mongoose.Schema({
    id_courses: {type: String},
    description: {type: String}
}, {collection: 'courseslearnitems'})

const CoursesLearnItems = mongoose.model('CoursesLearnItems', courseslearnitemsSchema)
module.exports = CoursesLearnItems