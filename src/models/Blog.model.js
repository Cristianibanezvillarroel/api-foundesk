const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    imagen: {type: String},
    idItem: {type: Number},
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogCategories',
        required: true
    },
}, {collection: 'blog'})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog