const mongoose = require('mongoose')

const teachercontractSchema = new mongoose.Schema({

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },

  revenueShare: {
    type: Number,
    default: 60
  },

  validFrom: {type: Date, default: Date.now},
  validTo: {type: Date, default: Date.now},

  allowedAccessTypes: [{
    type: String,
    enum: ['free', 'one_time','subscription','enterprise','mentoring']
  }],

  status: {
    type: String,
    enum: ['active','expired','terminated'],
    default: 'active'
  }

}, { collection: 'teachercontract' })

const TeacherContract = mongoose.model('TeacherContract', teachercontractSchema)
module.exports = TeacherContract