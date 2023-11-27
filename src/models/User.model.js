const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {type: String},
    name: {type: String},
    password: {type: String},
    idItem: {type: Number}
}, {collection: 'user'})

const User = mongoose.model('User', userSchema)
module.exports = User