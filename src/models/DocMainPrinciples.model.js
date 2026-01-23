const mongoose = require('mongoose')

/**
 * Modelo para almacenar y versionar la Declaración de Principios del Instructor
 * que será utilizada como plantilla para los documentos individuales de instructores
 */
const docMainPrinciplesSchema = new mongoose.Schema({

  // Información de versión
  version: {
    type: String,
    required: true,
    unique: true
  },

  versionDate: {
    type: Date,
    default: Date.now,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  // Estado del documento
  status: {
    type: String,
    enum: ['draft', 'active', 'superseded', 'archived'],
    default: 'draft'
  },

  // Contenido de los principios (array ordenado, puntos 1-5)
  clauses: [{
    clauseNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],

  // Auditoría
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  notes: {
    type: String
  }

}, { 
  collection: 'docmainprinciples',
  timestamps: true 
})

// Índices
docMainPrinciplesSchema.index({ version: 1 })
docMainPrinciplesSchema.index({ status: 1 })
docMainPrinciplesSchema.index({ versionDate: -1 })

// Método estático para obtener la versión activa
docMainPrinciplesSchema.statics.getActiveVersion = async function() {
  return await this.findOne({ status: 'active' }).sort({ versionDate: -1 })
}

// Método estático para obtener todas las versiones
docMainPrinciplesSchema.statics.getAllVersions = async function() {
  return await this.find().sort({ versionDate: -1 })
}

// Método para activar una versión (desactivando las demás)
docMainPrinciplesSchema.methods.activate = async function() {
  // Marcar todas las versiones activas como superseded
  await this.constructor.updateMany(
    { status: 'active' },
    { status: 'superseded' }
  )
  
  // Activar esta versión
  this.status = 'active'
  return await this.save()
}

const DocMainPrinciples = mongoose.model('DocMainPrinciples', docMainPrinciplesSchema)
module.exports = DocMainPrinciples
