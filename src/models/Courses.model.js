const mongoose = require('mongoose')

const coursesSchema = new mongoose.Schema({

    // Identidad
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    descriptionAdd: { type: String },

    // Académico
    level: {
        type: String,
        enum: ['introductory', 'intermediate', 'advanced', 'expert'],
        default: 'introductory'
    },
    learningObjectives: [{ type: String }],
    prerequisites: { type: String },
    targetaudience: { type: String },
    estimatedDuration: { type: Number }, // minutos

    // Relaciones
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    // Media
    imagecourse: { type: String },

    // Estado académico
    status: {
        type: String,
        enum: ['draft', 'review', 'approved', 'deprecated'],
        default: 'draft'
    },

    // Métricas (cacheadas)
    metrics: {
        ratingAvg: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 }
    },

    // Versionado
    version: { type: Number, default: 1 },
    supersedes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    },

    //timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    //en revision
    idItem: { type: Number },
    price: { type: Number },

}, { collection: 'courses' })

const Courses = mongoose.model('Courses', coursesSchema)
module.exports = Courses