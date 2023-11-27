const mongoose = require('mongoose')

const customerdiarySchema = new mongoose.Schema({
    email: {type: String},
    name: {type: String},
    phone: {type: String},
    schedule: {type: String},
    date: {type: String},
    status: {type: Number},
    idItem: {type: Number}
}, {collection: 'customerdiary'})

const CustomerDiary = mongoose.model('CustomerDiary', customerdiarySchema)
module.exports = CustomerDiary