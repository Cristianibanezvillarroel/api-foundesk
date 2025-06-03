const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const secret = process.env.SECRET_JWT
const secret = "opciones"

const userSchema = new mongoose.Schema({
    email: {type: String},
    name: {type: String},
    password: {type: String},
    address: {type: String},
    city: {type: String},
    country: {type: String},
    lastname: {type: String},
    phone: {type: String} 
}, {collection: 'user'})

userSchema.methods.hashPassword = function(password){
    this.password = bcrypt.hashSync(password, 16)
}

userSchema.methods.generateJWT = function(){
    return jwt.sign({userId: this._id}, secret)
}

userSchema.methods.onSignUpGenerateJWT = function(){
    return {
        userId: this._id,
        token: this.generateJWT
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User