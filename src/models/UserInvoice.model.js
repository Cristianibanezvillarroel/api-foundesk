const mongoose = require('mongoose')

const userInvoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invoiceType: {
        type: String,
        enum: ['boleta', 'factura'],
        default: 'boleta',
        required: true
    },
    // Datos para Boleta (persona natural)
    name: { type: String },
    lastname: { type: String },
    rut: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    
    // Datos adicionales para Factura (empresa)
    businessName: { type: String },
    businessRut: { type: String },
    businessAddress: { type: String },
    businessCity: { type: String },
    businessCountry: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'userinvoice' })

// Middleware para actualizar updatedAt en cada modificación
userInvoiceSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('UserInvoice', userInvoiceSchema)
