const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },    
    title: {type: String},
    descriptionshort: {type: String},
    descriptionlarge: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'faq'})

const Faq = mongoose.model('Faq', faqSchema)
module.exports = Faq