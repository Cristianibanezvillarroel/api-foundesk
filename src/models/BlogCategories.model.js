const mongoose = require('mongoose')

const blogcategoriesSchema = new mongoose.Schema({
    categoria: {type: String},
    idItem : {type: Number}
}, {collection: 'blogcategories'})

const BlogCategories = mongoose.model('BlogCategories', blogcategoriesSchema)
module.exports = BlogCategories;