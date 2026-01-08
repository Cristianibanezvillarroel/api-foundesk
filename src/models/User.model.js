const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "opciones"

const userSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    lastname: { type: String },
    phone: { type: String },
    role: {
        type: [String],
        enum: ['student', 'instructor', 'entrepreneur', 'admin', 'superadmin'],
        default: ['student'],
        required: true
    },
    photo: { type: String },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    confirmUserToken: { type: String, default: null },
    confirmUserPin: { type: String, default: null },
    confirmUserExpires: { type: Date, default: null },
    isConfirmed: { type: Boolean, default: false },
    isStaff: { type: Boolean, default: false },
    isStaffDefault: { type: Boolean, default: false },
    parentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'user' })

userSchema.methods.hashPassword = function (password) {
    this.password = bcrypt.hashSync(password, 10)
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({ userId: this._id }, secret)
}

userSchema.methods.onSignUpGenerateJWT = function () {
    return {
        userId: this._id,
        token: this.generateJWT
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User