// models/EnterpriseUser.model.js
const mongoose = require('mongoose')

const enterpriseuserSchema = new mongoose.Schema({

  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enterprise',
    required: true,
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  role: {
    type: String,
    enum: ['admin','manager','member'],
    default: 'member'
  },

  status: {
    type: String,
    enum: ['active','invited','disabled'],
    default: 'invited'
  },

  invitedAt: Date,
  activatedAt: Date

}, { timestamps: true, collection: 'enterpriseuser' })

enterpriseuserSchema.index({ enterprise: 1, user: 1 }, { unique: true })

const EnterpriseUser = mongoose.model('EnterpriseUser', enterpriseuserSchema)
module.exports = EnterpriseUser