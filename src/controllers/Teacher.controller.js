const Teacher = require('../models/Teacher.model')
const User = require('../models/User.model')
const Course = require('../models/Courses.model')
const transporter = require('../config/email')

const getTeacher = async (req, res) => {
  try {
    const resp = await Teacher.find()
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

    return res.json([{
      message: 'Teacher',
      items: resp
    }])
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      detail: error.message
    })
  }
}

// Obtener teacher específico por user (nuevo)
const getTeacherByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id

    if (!userId) {
      return res.status(400).json({
        message: 'Falta user id'
      })
    }

    const teacher = await Teacher.findOne({ user: userId })
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

    if (!teacher) {
      return res.status(404).json({
        message: 'No existe solicitud de instructor para este usuario'
      })
    }

    return res.json({
      message: 'Teacher encontrado',
      detail: teacher
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      detail: error.message
    })
  }
}

// Obtener teacher por ID (para TeacherDetailAdmin)
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params

    const teacher = await Teacher.findById(id)
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher no encontrado'
      })
    }

    return res.json({
      message: 'Teacher encontrado',
      detail: teacher
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      detail: error.message
    })
  }
}

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

    let userDoc = await User.findById(user)
    console.log("userDoc:", userDoc);
    if (!userDoc) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    // Buscar por user correctamente
    const teacher = await Teacher.findOne({ user })
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

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
      expectations
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

      // Agregar rol instructor si no lo tiene
      if (!userDoc.role.includes('instructor')) {
        userDoc.role.push('instructor')
      }

      await userDoc.save() // ahora sí es documento Mongoose
      await teacher.save()

      const mailResult = await transporter.sendMail({
        from: `"Foundesk" <${process.env.MAIL_USER}>`,
        to: userDoc.email,
        subject: "🔐 Solicitud para Instructor - Foundesk",
        html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hola ${teacher.name}.</h2>
                    <p>Hemos recibido tu solicitud para participar como instructor en Foundesk, la primera suite de cursos online on-demand de Chile para la administración y marketing del emprendedor.</p>
                    <p>Has señalado que deseas participar en el área de ${teacher.categorie.categorie} y particularmente para dictar el curso ${teacher.courseName}.</p>

                    <p style="margin-top: 20px;">
                        Te estaremos comunicando a la brevedad para agendar una reunión y revisar detalles para esto.
                        Es importante que revises la suites del intructor que se ha disponibilizado en tu cuenta.
                        Allí encontrarás información relevante sobre el proceso y los próximos pasos a seguir.
                        Es posible que debas completar algunos datos adicionales o subir documentos para avanzar en el proceso de validación.
                        También podrás revisar el estado de tu solicitud y cualquier comentario que el equipo de Foundesk pueda tener para ti.
                        Esto lo podrás revisar en la sección Inbox de tu cuenta.
                        Y recuerda que puedes contactarnos en cualquier momento si tienes dudas o necesitas asistencia adicional.
                    </p>

                    <p style="margin-top: 20px;">
                        ¡Gracias por tu interés en ser parte de Foundesk como instructor!
                        Te recordamos que juntos podemos construir una comunidad de aprendizaje sólida y enriquecedora para todos nuestros usuarios.
                        Dispones de 72 horas para modificar los datos ingresados en tu solicitud desde la fecha de este correo.
                    </p>

                    <p style="margin-top: 20px;">
                        Si necesitas modificar algún dato de tu solicitud, puedes hacerlo ingresando a tu cuenta de Foundesk a través del siguiente enlace:
                    </p>

                    <a href="${process.env.FRONTEND_URL}/login" 
                       style="background: #0066ff; color: white; padding: 12px 20px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Ingresar a Foundesk
                    </a>

                    <p style="margin-top: 20px;">
                        Si usted no realizó esta solicitud, favorignore este correo.
                    </p>

                    <p>
                        Le saluda atentamente,<br/>
                        El equipo de Foundesk.
                    </p>
                </div>
            `,
      });


      // Buscar por user correctamente
      const teacherReturn = await Teacher.findOne({ user })
        .populate([
          { path: 'categorie' },
          { path: 'user' }
        ])

      return res.json({
        message: 'Solicitud enviada correctamente.',
        detail: teacherReturn
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
      if (!userDoc.role.includes('instructor')) {
        userDoc.role.push('instructor')
      }

      await userDoc.save()
      await teacher.save();

      // Buscar por user nuevamente para populate completo
      const teacherReturn = await Teacher.findOne({ user })
        .populate([
          { path: 'categorie' },
          { path: 'user' }
        ])

      return res.json({
        message: 'Solicitud actualizada correctamente.',
        detail: teacherReturn
      });
    }

  } catch (error) {
    return res.json({ message: 'Error al crear/actualizar solicitud', detail: error.message })
  }
}

const uploadTeacherFiles = async (req, res) => {
  try {
    const user = req.user;               // debería ser el ID ya decodificado del token
    const userDoc = await User.findById(user);

    if (!userDoc) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Construir objeto de actualización solo con archivos que se subieron
    const updateData = {};

    if (req.uploadedFiles?.cv?.[0]) {
      updateData.cv = req.uploadedFiles.cv[0].path;
    }

    if (req.uploadedFiles?.photo?.[0]) {
      updateData.photo = req.uploadedFiles.photo[0].path;
    }

    // Verificar que al menos un archivo fue subido
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No se proporcionaron archivos para subir"
      });
    }

    const teacherReturn = await Teacher.findOneAndUpdate(
      { user: userDoc._id },
      updateData,
      { new: true }                      // IMPORTANTE: te devuelve el doc actualizado
    )
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ]);

    if (!teacherReturn) {
      return res.status(404).json({
        message: "No existe solicitud de teacher asociada al usuario"
      });
    }

    return res.json({
      message: "Archivos subidos correctamente",
      detail: teacherReturn
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Actualizar mensaje (PATCH para cambiar updateAt)
const updateTeacherTimes = async (req, res) => {
  try {
    const { teacherId } = req.params

    const updated = await Teacher.findByIdAndUpdate(
      { _id: teacherId },
      { updatedAt: new Date() },
      { new: true }
    )
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

    if (!updated) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    return res.json({
      message: 'Teacher updated',
      detail: updated
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      detail: error.message
    })
  }
}

// Actualizar mensaje (PATCH para cambiar isConfirmed)
const updateTeacherConfirm = async (req, res) => {
  try {
    const { teacherId } = req.params

    const updated = await Teacher.findByIdAndUpdate(
      { _id: teacherId },
      { isConfirmed: true },
      { new: true }
    )
      .populate([
        { path: 'categorie' },
        { path: 'user' }
      ])

    if (!updated) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    return res.json({
      message: 'Teacher confirmed',
      detail: updated
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      detail: error.message
    })
  }
}

const teacherCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const courses = await Course.find({ teacher: teacherId })
      .populate([
        { path: 'categorie' },
        {
          path: 'teacher',
          populate: { path: 'user' }
        }
      ])

    return res.json({
      message: 'Cursos obtenidos correctamente',
      detail: courses
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener cursos',
      detail: error.message
    });
  }
}

// Descargar archivos de teacher con validación de permisos
const downloadTeacherFile = async (req, res) => {

  const fs = require('fs');
  const path = require('path');

  try {
    const { fileType } = req.params; // 'cv' o 'photo'
    const userId = req.user; // del middleware auth

    // Validar tipo de archivo
    if (!['cv', 'photo'].includes(fileType)) {
      return res.status(400).json({ message: 'Tipo de archivo no válido' });
    }

    // Buscar el teacher del usuario autenticado
    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json({ message: 'No se encontró solicitud de teacher' });
    }

    // Obtener la ruta del archivo
    const filePath = teacher[fileType];

    if (!filePath) {
      return res.status(404).json({ message: `No hay ${fileType} disponible` });
    }

    // Normalizar la ruta (convertir barras de Windows a formato universal si es necesario)
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Extraer el nombre del archivo de la ruta normalizada
    const fileName = path.basename(normalizedPath);
    const fileExt = path.extname(fileName).toLowerCase();

    // Verificar que el archivo existe (path.resolve maneja ambos formatos)
    const fullPath = path.resolve(normalizedPath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }

    // Detectar MIME type basado en la extensión
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };

    const mimeType = mimeTypes[fileExt] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    // Enviar el archivo
    return res.sendFile(fullPath);

  } catch (error) {
    return res.status(500).json({
      message: 'Error al descargar archivo',
      detail: error.message
    });
  }
}

module.exports = {
  getTeacher,
  getTeacherByUser,
  getTeacherById,
  teacherRequest,
  uploadTeacherFiles,
  updateTeacherTimes,
  updateTeacherConfirm,
  teacherCourses,
  downloadTeacherFile
}