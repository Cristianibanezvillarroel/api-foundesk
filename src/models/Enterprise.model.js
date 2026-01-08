// models/Enterprise.model.js
const mongoose = require('mongoose')

const enterpriseSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true
  },

  taxId: {                 // RUT en Chile
    type: String
  },

  billingEmail: {
    type: String
  },

  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  status: {
    type: String,
    enum: ['active','suspended','cancelled'],
    default: 'active'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true, collection: 'enterprise' })

const Enterprise = mongoose.model('Enterprise', enterpriseSchema)
module.exports = Enterprise