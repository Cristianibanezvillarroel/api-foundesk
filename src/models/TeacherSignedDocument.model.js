const mongoose = require('mongoose')

const teachersigneddocumentSchema = new mongoose.Schema({

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
    index: true
  },

  documentType: {
    type: String,
    enum: [
      'teacher_principles',
      'teacher_contract'
    ],
    required: true
  },

  documentVersion: {
    type: String,
    required: true // ej: "1.0", "2.1"
  },

  documentHash: {
    type: String,
    required: true,
    index: true
  },

  html: {
    type: String
    // Guardamos el HTML para poder regenerar el PDF cuando se firme
  },

  pdfPath: {
    type: String,
    required: true
  },

  signatures: [{
    fullName: { type: String, required: true },
    rut: { type: String, required: true },
    acceptedAt: { type: Date, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'instructor', 'superadmin'],
      required: true 
    },
    signatureHash: { type: String, required: true }, // Hash SHA-256 de la firma individual
    ip: String,
    userAgent: String
  }],

  metadata: {
    ip: String,
    userAgent: String,
    statusChangeReason: String,
    statusChangedAt: Date,
    contractDate: {
      day: Number,
      month: String,
      year: Number
    },
    foundeskRut: String,
    foundeskRepresentative: String,
    foundeskAddress: String,
    instructorFullName: String,
    instructorRut: String,
    instructorAddress: String,
    commissionPercentage: Number,
    poolCommissionPercentage: Number,
    settlementDays: Number,
    terminationNoticeDays: Number,
    filledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filledAt: Date,
    previousStatus: { type: String, enum: ['active', 'superseded', 'revoked']}
  },

  agreementData: {
    html: { type: String },
    teacherId: { type: String },
    documentVersion: { type: String },
    signatures: [{
      fullName: String,
      rut: String,
      acceptedAt: Date,
      role: String
    }]
  },

  status: {
    type: String,
    enum: ['pending', 'pending_teacher_signature', 'signed', 'active', 'superseded', 'revoked', 'rejected'],
    default: 'pending'
  },

  agreementHash: {
    type: String,
    index: true
  }, // El que se imprimió en el PDF

}, {
  timestamps: true,
  collection: 'teachersigneddocument'
})

teachersigneddocumentSchema.index({
  teacher: 1,
  documentType: 1,
  documentVersion: 1
})

module.exports = mongoose.model(
  'TeacherSignedDocument',
  teachersigneddocumentSchema
)
