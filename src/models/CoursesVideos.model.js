const mongoose = require('mongoose')

const coursesVideosSchema = new mongoose.Schema({
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    coursesSectionsLessons: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesSectionsLessons',
        required: false,
        default: null
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // Para almacenamiento externo (Vimeo, AWS S3, etc.)
    videoProvider: {
        type: String,
        enum: ['vimeo', 's3', 'local'],
        default: 'local'
    },
    videoId: {
        type: String, // ID del video en el proveedor (ej: Vimeo ID)
        required: false
    },
    videoUrl: {
        type: String, // URL del video
        required: false
    },
    // Para almacenamiento local (ruta del archivo)
    videoPath: {
        type: String,
        required: false
    },
    // Información del video
    duration: {
        type: Number, // Duración en segundos
        default: 0
    },
    fileSize: {
        type: Number, // Tamaño en bytes
        default: 0
    },
    thumbnail: {
        type: String, // URL del thumbnail/poster
        required: false
    },
    // Video gratuito de preview del curso
    isFreePreview: {
        type: Boolean,
        default: false
    },
    // Estado del procesamiento
    status: {
        type: String,
        enum: ['uploading', 'processing', 'ready', 'error'],
        default: 'uploading'
    },
    // Calidades disponibles
    qualities: [{
        type: String,
        enum: ['360p', '480p', '720p', '1080p', '1440p', '4k']
    }],
    // Metadata adicional
    originalFilename: {
        type: String
    },
    mimeType: {
        type: String
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {collection: 'coursesvideos'})

// Índices para búsquedas eficientes
coursesVideosSchema.index({ courses: 1 });
coursesVideosSchema.index({ coursesSectionsLessons: 1 });
coursesVideosSchema.index({ isFreePreview: 1 });

const CoursesVideos = mongoose.model('CoursesVideos', coursesVideosSchema)
module.exports = CoursesVideos
