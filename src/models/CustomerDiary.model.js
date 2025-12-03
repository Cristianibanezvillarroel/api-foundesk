const mongoose = require('mongoose')
const { create } = require('./User.model')

const customerdiarySchema = new mongoose.Schema({
    email: {type: String},
    name: {type: String},
    phone: {type: String},
    schedule: {type: String},
    date: {type: String},
    status: {type: Number},
    idItem: {type: Number},
    comments: {type: String},
    interesIn: {type: String, default: ""},
    channel: {type: String, default: ""},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'customerdiary'})

const CustomerDiary = mongoose.model('CustomerDiary', customerdiarySchema)
module.exports = CustomerDiary