const Teacher = require('../models/Teacher.model')

const teacherRequest = async (req, res) => {

  const user = req.user;

  try {
    const {
      courseName,
      categorie,
      descriptionCourse,
      jobtitle,
      company,
      career,
      careerinstitution,
      postgraduate,
      postgraduateinstitution,
      review,
      motives,
      expectations
    } = req.body

    if (!user) {
      return res.json({ message: 'Falta user id' })
    }
    if (!courseName || !categorie) {
      return res.json({ message: 'Falta nombre de curso o categoría.' })
    }

    // Buscar por user correctamente
    let teacher = await Teacher.findOne({ user })

    // Datos normalizados para almacenar en subdocumento request
    const requestData = {
      courseName,
      categorie,
      descriptionCourse,
      jobtitle,
      company,
      career,
      careerinstitution,
      postgraduate,
      postgraduateinstitution,
      review,
      motives,
      expectations,
      createdAt: new Date()
    }

    if (!teacher) {
      // Crear nuevo documento teacher con la solicitud
      teacher = new Teacher({
        user,
        isConfirmed: false,
        courseName,
        categorie,
        descriptionCourse,
        jobtitle,
        company,
        career,
        careerinstitution,
        postgraduate,
        postgraduateinstitution,
        review,
        motives,
        expectations,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      await teacher.save()

      return res.json({
        message: 'Solicitud enviada correctamente.',
        detail: { user: user }
      })
    } else {
      // Asignar los campos del requestData directamente al modelo
      Object.assign(teacher, requestData);

      // Mantener isConfirmed o inicializar en false si viene null/undefined
      if (teacher.isConfirmed === undefined || teacher.isConfirmed === null) {
        teacher.isConfirmed = false;
      }

      // Actualizar fecha de modificación
      teacher.updatedAt = new Date();

      // Guardar cambios
      await teacher.save();

      return res.json({
        message: 'Solicitud actualizada correctamente.',
        detail: { user }
      });
    }

  } catch (error) {
    return res.json({ message: 'Error al crear/actualizar solicitud', detail: error.message })
  }
}

module.exports = {
  teacherRequest
}