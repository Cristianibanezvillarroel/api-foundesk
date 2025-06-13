const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')

const coursescategoriesdetailSchema = new mongoose.Schema({
    idItem: {type: Number},
    quantity: {type: Number},
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    review: {type: String},
    description: {type: String},
    imageicon: {type: String},
    rating: {type: mongoose.Schema.Types.Decimal128},
    students: {type: Number}
}, {collection: 'coursescategoriesdetail'})

const CoursesCategoriesDetail = mongoose.model('CoursesCategoriesDetail', coursescategoriesdetailSchema)
module.exports = CoursesCategoriesDetail