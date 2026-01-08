const mongoose = require('mongoose')

const usersubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },

  startedAt: {type: Date, default: Date.now},
  expiresAt: {type: Date, default: null},

  status: {
    type: String,
    enum: ['active','paused','cancelled','expired', 'invited'],
    default: 'active'
  }
}, { collection: 'usersubscription' })

const UserSubscription = mongoose.model('UserSubscription', usersubscriptionSchema)
module.exports = UserSubscription