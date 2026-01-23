const mongoose = require('mongoose')

/**
 * Modelo para almacenar y versionar el contenido genérico del contrato base
 * que será utilizado como plantilla para los contratos individuales de instructores
 */
const docMainContractSchema = new mongoose.Schema({

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

  // Contenido de las cláusulas del contrato (array ordenado)
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
    },
    hasVariables: {
      type: Boolean,
      default: false
    },
    variables: [{
      type: String,
      enum: ['COMMISSION', 'SETTLEMENT_DAYS', 'TERMINATION_DAYS']
    }]
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
  collection: 'docmaincontract',
  timestamps: true 
})

// Índices
docMainContractSchema.index({ version: 1 })
docMainContractSchema.index({ status: 1 })
docMainContractSchema.index({ versionDate: -1 })

// Método estático para obtener la versión activa
docMainContractSchema.statics.getActiveVersion = async function() {
  return await this.findOne({ status: 'active' }).sort({ versionDate: -1 })
}

// Método estático para obtener todas las versiones activas y archivadas
docMainContractSchema.statics.getAllVersions = async function() {
  return await this.find().sort({ versionDate: -1 })
}

// Método para activar una versión (desactivando las demás)
docMainContractSchema.methods.activate = async function() {
  // Marcar todas las versiones activas como superseded
  await this.constructor.updateMany(
    { status: 'active' },
    { status: 'superseded' }
  )
  
  // Activar esta versión
  this.status = 'active'
  return await this.save()
}

const DocMainContract = mongoose.model('DocMainContract', docMainContractSchema)
module.exports = DocMainContract
