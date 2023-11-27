const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {type: String},
    name: {type: String},
    password: {type: String},
    idItem: {type: Number}
}, {collection: 'user'})

userSchema.methods.hashPassword = function(password){
    this.password = bcrypt.hashSync(password, 16)
}

const User = mongoose.model('User', userSchema)
module.exports = User