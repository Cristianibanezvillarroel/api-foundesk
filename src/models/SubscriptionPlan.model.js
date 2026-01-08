const mongoose = require('mongoose')

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Starter, Pro, Team
  price: { type: Number, required: true },
  currency: { type: String, default: 'CLP' },

  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'yearly'
  },

  accessRules: {
    maxCoursesPerMonth: Number, // null = ilimitado
    mentoringIncluded: { type: Boolean, default: false },
    liveSessionsIncluded: { type: Boolean, default: false }
  },

  status: {
    type: String,
    enum: ['active','inactive'],
    default: 'active'
  }
}, { collection: 'subscriptionplan' })

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema)
module.exports = SubscriptionPlan