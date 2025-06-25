const mongoose = require('mongoose')

const itusefulSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    faq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faq',
        required: true
    },
    useful: {type: Number, required: true, default: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'ituseful'})

const ItUseful = mongoose.model('ItUseful', itusefulSchema)
module.exports = ItUseful