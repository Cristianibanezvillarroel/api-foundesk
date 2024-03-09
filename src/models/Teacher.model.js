const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    id_user: {type: String},
    name: {type: String},
    imagen: {type: String},
    pregrado: {type: String},
    institucion_pregrado: {type: String},
    postgrado: {type: String},
    institucion_postgrado: {type: String},
    experiencia: {type: Number},
    cargo: {type: String},
    empresa: {type: String},
    calificacion: {type: Number},
    valoraciones: {type: Number},
    estudiantes: {type: Number},
    cursos: {type: Number},
    resena: {type: String}
}, {collection: 'teacher'})

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher