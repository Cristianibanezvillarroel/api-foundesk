const mongoose = require('mongoose')

const coursesofferingSchema = new mongoose.Schema({

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },

  // Tipo de oferta
  accessType: {
    type: String,
    enum: ['free', 'one_time', 'subscription', 'enterprise', 'mentoring'],
    required: true
  },

  // Comercial
  price: { type: Number }, // null si es subscription
  currency: { type: String, default: 'CLP' },

  // Suscripción: planes válidos
  subscriptionPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan'
    }
  ],

  // Ventana comercial
  salesWindow: {
    start: Date,
    end: Date
  },

  // Estado operativo
  status: {
    type: String,
    enum: ['active', 'paused', 'suspended', 'archived'],
    default: 'active'
  },

  // Métricas económicas
  metrics: {
    enrollments: { type: Number, default: 0 },
    revenueGross: { type: Number, default: 0 }
  }

}, { collection: 'coursesoffering' })

const CoursesOffering = mongoose.model('CoursesOffering', coursesofferingSchema)
module.exports = CoursesOffering