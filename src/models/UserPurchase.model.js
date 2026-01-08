const mongoose = require('mongoose')

const userpurchaseSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    default: null,
    index: true
  },

  offering: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseOffering',
    required: true
  },

  accessType: {
    type: String,
    enum: ['free','one_time','subscription','enterprise'],
    required: true
  },

  pricePaid: {
    type: Number,
    default: 0
  },

  currency: {
    type: String,
    default: 'CLP'
  },

  paymentProvider: {
    type: String,
    enum: ['stripe','mercadopago','manual','none'],
    default: 'none'
  },

  paymentReference: {
    type: String
  },

  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
    default: null
  },

  enterpriseAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enterprise',
    default: null
  },

  status: {
    type: String,
    enum: ['active','revoked','refunded'],
    default: 'active'
  },

  grantedAt: {
    type: Date,
    default: Date.now
  },

  revokedAt: Date

}, { timestamps: true, collection: 'userpurchase' })

userpurchaseSchema.index(
  { user: 1, course: 1 },
  { partialFilterExpression: { course: { $ne: null } } }
)

userpurchaseSchema.index(
  { user: 1, subscription: 1 },
  { partialFilterExpression: { subscription: { $ne: null } } }
)

userpurchaseSchema.index(
  { user: 1, enterpriseAccount: 1 },
  { partialFilterExpression: { enterpriseAccount: { $ne: null } } }
)


module.exports = mongoose.model(
  'UserPurchase',
  userpurchaseSchema
)
