const mongoose = require('mongoose')

const coursesconsumptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },

  minutesConsumed: { type: Number, default: 0 },
  lastActivityAt: Date
}, { collection: 'coursesconsumption' })

const CoursesConsumption = mongoose.model('CoursesConsumption', coursesconsumptionSchema)
module.exports = CoursesConsumption