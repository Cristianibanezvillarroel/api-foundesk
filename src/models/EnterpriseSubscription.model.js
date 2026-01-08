// models/EnterpriseSubscription.model.js
const mongoose = require('mongoose')

const enterpriseSubscriptionSchema = new mongoose.Schema({

  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enterprise',
    required: true,
    index: true
  },

  // 📦 Plan contratado (igual que UserSubscription)
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },

  // 👥 Licencias
  maxSeats: {
    type: Number,
    required: true
  },

  usedSeats: {
    type: Number,
    default: 0
  },

  // 💰 Facturación
  price: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'CLP'
  },

  billingPeriod: {
    type: String,
    enum: ['monthly','yearly'],
    default: 'yearly'
  },

  status: {
    type: String,
    enum: ['active','paused','expired','canceled'],
    default: 'active'
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: Date

}, { timestamps: true, collection: 'enterprisesubscriptions' })

module.exports = mongoose.model(
  'EnterpriseSubscription',
  enterpriseSubscriptionSchema
)
