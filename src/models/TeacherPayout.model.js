const mongoose = require('mongoose')

const teacherpayoutSchema = new mongoose.Schema({

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },

  period: { type: String, required: true }, // "2025-03"

  amount: { type: Number, required: true },

  breakdown: {
    subscription: { type: Number, default: 0 },
    oneTimeSales: { type: Number, default: 0 },
    mentoring: { type: Number, default: 0 }
  },

  details: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
    minutes: Number,
    revenue: Number
  }],

  status: {
    type: String,
    enum: ['pending','approved','paid'],
    default: 'pending'
  },

  paidAt: Date

}, { timestamps: true, collection: 'teacherpayout' })

const TeacherPayout = mongoose.model('TeacherPayout', teacherpayoutSchema)
module.exports = TeacherPayout