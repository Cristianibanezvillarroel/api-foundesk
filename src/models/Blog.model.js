const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    tipo: {type: String},
    title: {type: String},
    description: {type: String},
    imagen: {type: String}
}, {collection: 'blog'})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog