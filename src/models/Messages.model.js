const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
  number: { type: String },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: 'unread' }, // p.ej. 'unread'|'read'|'archived'
  department: { type: String },
  date: { type: Date, default: Date.now },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    default: null
  },
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages',
    default: null,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'messages' })

const Messages = mongoose.model('Messages', messagesSchema)
module.exports = Messages