const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    career: { type: String },
    careerinstitution: { type: String },
    postgraduate: { type: String },
    postgraduateinstitution: { type: String },
    experience: { type: Number },
    jobtitle: { type: String },
    company: { type: String },
    rating: { type: Number },
    ratings: { type: Number },
    students: { type: Number },
    courses: { type: Number },
    review: { type: String },
    isConfirmed: { type: Boolean, default: false },
    courseName: { type: String },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoursesCategories',
        required: true
    },
    descriptionCourse: { type: String },
    newCategory: { type: String },
    motives: { type: String },
    expectations: { type: String },
    cv: { type: String },
    photo: { type: String },
    // Datos del contrato
    contract: {
        // Fecha del contrato
        contractDate: { 
            day: { type: Number },
            month: { type: String },
            year: { type: Number }
        },
        // Datos de Foundesk
        foundeskRut: { type: String },
        foundeskRepresentative: { type: String },
        foundeskAddress: { type: String },
        // Datos del Instructor
        instructorFullName: { type: String },
        instructorRut: { type: String },
        instructorAddress: { type: String },
        // Términos económicos
        commissionPercentage: { type: Number }, // Porcentaje comisión venta individual
        poolCommissionPercentage: { type: Number }, // Porcentaje comisión pool
        settlementDays: { type: Number }, // Días para liquidación mensual
        // Términos de terminación
        terminationNoticeDays: { type: Number }, // Días de preaviso para término
        // Control
        isContractFilled: { type: Boolean, default: false },
        filledBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        filledAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'teacher' })

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher