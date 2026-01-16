const User = require('../models/User.model')
const EnterpriseUser = require('../models/EnterpriseUser.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const transporter = require('../config/email')
const path = require('path')
const fs = require('fs')

const postUser = async (req, res) => {

    try {

        const { email, password, enterpriseId } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({
                message: "Usted ya tiene una cuenta de usuario activada en Foundesk. Ingrese a la plataforma en la seccion de Login."
            })
        }

        const user = new User(req.body)
        user.hashPassword(password)

        // Generar token seguro
        const token = crypto.randomBytes(32).toString('hex')
        // Guardar token y expiración de 1 hora
        user.confirmUserToken = token
        user.confirmUserExpires = Date.now() + 3600000

        await user.save()

        // Si se proporciona un enterpriseId, crear el registro en EnterpriseUser
        if (enterpriseId) {
            try {
                const enterpriseUser = new EnterpriseUser({
                    enterprise: enterpriseId,
                    user: user._id,
                    role: 'member',
                    status: 'invited',
                    invitedAt: new Date()
                })
                await enterpriseUser.save()
                console.log(`Usuario ${user.email} asignado a la empresa ${enterpriseId}`)
            } catch (enterpriseError) {
                console.error('Error al asignar usuario a empresa:', enterpriseError)
                // No detenemos el flujo si falla la asignación a empresa
            }
        }

        const pin = await confirmUser(user)

        // URL para el frontend

        // Enviar el correo
        const mailResult = await transporter.sendMail({
            from: `"Foundesk" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "🔐 Confirmación de cuenta - Foundesk",
            html: `
            <div style="font-family: Arial; padding: 24px; color: #333;">
                <h2>Bienvenido a Foundesk</h2>
                <p>Tu PIN de confirmación es:</p>

                <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;
                            padding: 12px; background: #f4f4f4; width: fit-content;
                            border-radius: 6px; margin-bottom: 20px;">
                    ${pin}
                </div>

                <p>Ingresa este PIN en el siguiente enlace:</p>

                <a href="${process.env.FRONTEND_URL}/confirm?token=${token}"
                    style="background: #0066ff; color: #fff; padding: 14px 24px;
                            text-decoration: none; border-radius: 8px;">
                    Confirmar cuenta
                </a>

                <p style="margin-top: 20px; font-size: 14px; color: #777;">
                    Este enlace y PIN expirarán en 1 hora.<br>
                    Si no creaste una cuenta, ignora este correo.
                </p>
            </div>
            `,
        });

        const userFind = await User.findOne({ email })
        return res.json({
            message: "Su cuenta se ha creado exitosamente. Revise su correo para continuar con la confirmación de su cuenta.",
            detail: { pin: pin }
            //detail: { user: userFind, token: userFind.generateJWT(), pin }
        })
    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userFind = await User.findOne({ email })
        if (!userFind) {
            return res.json({
                message: "usuario no encontrado"
            })
        }

        // Nuevo: verificar que la cuenta esté confirmada
        if (!userFind.isConfirmed) {
            return res.json({
                message: "Cuenta no confirmada"
            })
        }

        const isCorrectPassword = bcrypt.compareSync(password, userFind.password)
        if (!isCorrectPassword) {
            return res.json({
                message: "error de password"
            })
        }
        return res.json({
            message: "OK",
            detail: { user: userFind, token: userFind.generateJWT() }
        })
    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

const updateUser = async (req, res) => {

    const newData = req.body

    try {

        const resp = await User.findByIdAndUpdate(
            req.user,
            newData,
            { new: true }
        ).select("-password")

        res.json({
            detail: { user: resp }
        })

    } catch (error) {
        return res.json({
            message: "Error",
            detail: error
        })
    }
}

const updatePassword = async (req, res) => {
    try {

        const { email, password, newpassword, id } = req.body

        const userFind = await User.findOne({ email })
        if (!userFind) {
            return res.json({
                message: "usuario no encontrado"
            })
        }
        const isCorrectPassword = bcrypt.compareSync(password, userFind.password)
        if (!isCorrectPassword) {
            return res.json({
                message: "error: la contraseña actual ingresada no es correcta."
            })
        }

        userFind.hashPassword(newpassword)
        await userFind.save()
        return res.json({
            message: "OK"
        })

    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

const verifyUser = async (req, res) => {

    try {

        const user = await User.findById(req.user).select('-password')
        res.json({ user })

    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error",
            error
        })
    }
}

const requestResetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                message: "Si el correo existe, enviaremos instrucciones para restablecer su contraseña."
            })
        }

        // Generar token seguro
        const token = crypto.randomBytes(32).toString('hex')
        // Guardar token y expiración de 1 hora
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        // Aquí luego enviarás el correo: 
        // ejemplo: https://app.foundesk.cl/reset-password?token=xxxx

        // URL para el frontend
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password-confirm?token=${token}`;

        // Enviar el correo
        const mailResult = await transporter.sendMail({
            from: `"Foundesk" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "🔐 Recuperación de contraseña - Foundesk",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Hemos recibido una solicitud para restablecer su contraseña.</p>
                    <p>Para continuar, haga clic en el siguiente enlace:</p>

                    <a href="${resetUrl}" 
                       style="background: #0066ff; color: white; padding: 12px 20px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Restablecer contraseña
                    </a>

                    <p style="margin-top: 20px;">
                        Si usted no solicitó este cambio, ignore este correo.
                    </p>

                    <p>Este enlace expirará en 1 hora.</p>
                </div>
            `,
        });

        return res.json({
            message: "Revise su correo para continuar con el proceso de recuperación.",
            detail: { token } // <--- puedes removerlo después en producción
        })

    } catch (error) {
        return res.json({ message: "Error", detail: error.message })
    }
}

// ---------------------------------------
// Confirmar el reset de contraseña
// ---------------------------------------
const requestResetPasswordConfirm = async (req, res) => {
    try {
        const { token } = req.body
        const newPassword = req.body.newPassword || req.body.password;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // token vigente
        })

        if (!user) {
            return res.json({
                message: "El enlace para restablecer la contraseña es inválido o ha expirado."
            })
        }
        // Guardar nueva contraseña usando tu método
        user.hashPassword(newPassword)

        // Limpiar token para evitar reuso
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        await user.save()

        const resetUrl = `${process.env.FRONTEND_URL}/login`;

        // Enviar el correo
        const mailResult = await transporter.sendMail({
            from: `"Foundesk" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "🔐 Cambio de contraseña exitoso - Foundesk",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Confirmación de cambio de contraseña</h2>
                    <p>Hemos recibido una solicitud para modificar su contraseña.</p>
                    <p>Y su contraseña ha sido modificada exitosamente. Para ingresar a Foundesk, haga clic en el siguiente enlace:</p>

                    <a href="${resetUrl}" 
                       style="background: #0066ff; color: white; padding: 12px 20px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Ingresar a Foundesk
                    </a>

                    <p style="margin-top: 20px;">
                        Si usted no solicitó esta modificación, ignore este correo.
                    </p>

                    <p>Este enlace expirará en 1 hora.</p>
                </div>
            `,
        });

        return res.json({
            message: "Su contraseña ha sido actualizada exitosamente. Le hemos enviado un correo de notificación de este cambio realizado."
        })

    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

const confirmUser = async (user) => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString()
    user.confirmUserPin = pin
    user.confirmUserExpires = Date.now() + 3600 * 1000 // 1 hora
    await user.save()
    return pin
}

const confirmUserPin = async (req, res) => {
    try {
        const { token, pin } = req.body
        if (!token || !pin) {
            return res.status(400).json({ message: 'Faltan token o pin' })
        }
        const user = await User.findOne({
            confirmUserToken: token,
            confirmUserPin: pin,
            confirmUserExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: 'Pin o token inválido o expirado' })
        }

        // marcar usuario como confirmado (opcional: agregar campo confirmed)
        user.confirmUserPin = null
        user.confirmUserToken = null
        user.confirmUserExpires = null
        user.role = user.role || 'student' // ya definido
        // si quieres un flag:
        user.isConfirmed = true
        await user.save()

        return res.json({
            message: 'Cuenta confirmada correctamente. Ahora ya puede acceder a Foundesk. Será redirigido en 5 segundos para comenzar a disfrutar de su aprendizaje con Foundesk.',
            detail: { user: user, token: user.generateJWT() }
        })

    } catch (err) {
        return res.status(500).json({ message: 'Error', detail: err.message })
    }
}


// ---------------------------------------
// Obtener usuarios staff (@foundesk.cl)
// ---------------------------------------
const getStaffUsers = async (req, res) => {
    try {
        const staffUsers = await User.find({
            email: { $regex: '@foundesk\\.cl$', $options: 'i' }
        }).select('-password').sort({ createdAt: -1 })

        return res.json({
            message: "OK",
            detail: staffUsers
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener usuarios staff",
            detail: error.message
        })
    }
}

// ---------------------------------------
// Actualizar isStaff de un usuario
// ---------------------------------------
const updateUserIsStaff = async (req, res) => {
    try {
        const { userId, isStaff } = req.body

        const user = await User.findByIdAndUpdate(
            userId,
            { isStaff },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        return res.json({
            message: "Estado de staff actualizado",
            detail: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar isStaff",
            detail: error.message
        })
    }
}

// ---------------------------------------
// Actualizar isStaffDefault de un usuario
// ---------------------------------------
const updateUserIsStaffDefault = async (req, res) => {
    try {
        const { userId } = req.body

        // Primero, poner todos en false
        await User.updateMany(
            { email: { $regex: '@foundesk\\.cl$', $options: 'i' } },
            { isStaffDefault: false }
        )

        // Luego, poner el seleccionado en true
        const user = await User.findByIdAndUpdate(
            userId,
            { isStaffDefault: true },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        return res.json({
            message: "Usuario staff por defecto actualizado",
            detail: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar isStaffDefault",
            detail: error.message
        })
    }
}


// ---------------------------------------
// Obtener staff asignado por userId
// ---------------------------------------
const getStaffByUser = async (req, res) => {
    try {
        const { userId } = req.params

        // Buscar el usuario
        let user = await User.findById(userId).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        // Si ya tiene parentUserId, devolver ese usuario
        if (user.parentUserId) {
            const parentUser = await User.findById(user.parentUserId).select('-password')
            return res.json({
                message: "OK",
                detail: parentUser
            })
        }

        // Si no tiene parentUserId, buscar el usuario con isStaffDefault: true
        const defaultStaff = await User.findOne({ isStaffDefault: true }).select('-password')

        if (!defaultStaff) {
            return res.status(404).json({
                message: "No hay usuario staff por defecto configurado"
            })
        }

        // Asignar el defaultStaff como parentUserId
        user.parentUserId = defaultStaff._id
        await user.save()

        return res.json({
            message: "OK",
            detail: defaultStaff
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener staff",
            detail: error.message
        })
    }
}


// ---------------------------------------
// Actualizar parentUserId de un usuario
// ---------------------------------------
const updateUserParentUserId = async (req, res) => {
    try {
        const { userId, parentUserId } = req.body

        const user = await User.findByIdAndUpdate(
            userId,
            { parentUserId },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        return res.json({
            message: "Staff asignado actualizado",
            detail: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar staff asignado",
            detail: error.message
        })
    }
}

// Subir archivos de usuario (CV, foto)
const uploadUserFiles = async (req, res) => {
    try {
        const userId = req.user

        if (!userId) {
            return res.status(400).json({ message: 'Usuario no identificado' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // req.files contiene los archivos subidos gracias a multer
        const updates = {}

        if (req.files.cv && req.files.cv[0]) {
            updates.cv = req.files.cv[0].path
        }

        if (req.files.photo && req.files.photo[0]) {
            updates.photo = req.files.photo[0].path
        }

        // Actualizar solo los campos que fueron enviados
        Object.assign(user, updates)
        user.updatedAt = Date.now()

        await user.save()

        const updatedUser = await User.findById(userId).select('-password')

        return res.json({
            message: 'Archivos subidos correctamente',
            detail: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al subir archivos',
            detail: error.message
        })
    }
}

// Descargar archivo de usuarioconst getUserByEmail = async (req, res) => {
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query

        if (!email) {
            return res.status(400).json({
                message: 'Email es requerido'
            })
        }

        const user = await User.findOne({ email }).select('-password')

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
                found: false
            })
        }

        return res.json({
            message: 'Usuario encontrado',
            found: true,
            detail: user
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al buscar usuario',
            detail: error.message
        })
    }
}

const downloadUserFile = async (req, res) => {
    try {
        const userId = req.user
        const { fileType } = req.params

        if (!userId) {
            return res.status(400).json({ message: 'Usuario no identificado' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Obtener la ruta del archivo según el tipo
        let filePath
        if (fileType === 'cv') {
            filePath = user.cv
        } else if (fileType === 'photo') {
            filePath = user.photo
        } else {
            return res.status(400).json({ message: 'Tipo de archivo no válido' })
        }

        if (!filePath) {
            return res.status(404).json({ message: 'Archivo no encontrado en la base de datos' })
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
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        }

        const mimeType = mimeTypes[fileExt] || 'application/octet-stream'

        res.setHeader('Content-Type', mimeType)
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)

        return res.sendFile(fullPath)
    } catch (error) {
        return res.status(500).json({
            message: 'Error al descargar archivo',
            detail: error.message
        })
    }
}

// Descargar archivo de usuario por ID (para ver fotos de otros usuarios)
const downloadUserFileById = async (req, res) => {
    try {
        const { userId, fileType } = req.params

        if (!userId) {
            return res.status(400).json({ message: 'ID de usuario requerido' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Obtener la ruta del archivo según el tipo
        let filePath
        if (fileType === 'cv') {
            filePath = user.cv
        } else if (fileType === 'photo') {
            filePath = user.photo
        } else {
            return res.status(400).json({ message: 'Tipo de archivo no válido' })
        }

        if (!filePath) {
            return res.status(404).json({ message: 'Archivo no encontrado en la base de datos' })
        }

        // Normalizar la ruta
        const normalizedPath = filePath.replace(/\\/g, '/');
        const fileName = path.basename(normalizedPath);
        const fileExt = path.extname(fileName).toLowerCase();
        const fullPath = path.resolve(normalizedPath);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }

        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        }

        const mimeType = mimeTypes[fileExt] || 'application/octet-stream'

        res.setHeader('Content-Type', mimeType)
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)

        return res.sendFile(fullPath)
    } catch (error) {
        return res.status(500).json({
            message: 'Error al descargar archivo',
            detail: error.message
        })
    }
}

// Eliminar archivo de usuario
const deleteUserFiles = async (req, res) => {
    try {
        const userId = req.user
        const { fileType } = req.params

        if (!userId) {
            return res.status(400).json({ message: 'Usuario no identificado' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Obtener la ruta del archivo según el tipo
        let filePath
        if (fileType === 'cv') {
            filePath = user.cv
        } else if (fileType === 'photo') {
            filePath = user.photo
        } else {
            return res.status(400).json({ message: 'Tipo de archivo no válido' })
        }

        if (!filePath) {
            return res.status(404).json({ message: 'Archivo no encontrado en la base de datos' })
        }

        // Normalizar la ruta
        const normalizedPath = filePath.replace(/\\/g, '/');
        const fullPath = path.resolve(normalizedPath);

        // Eliminar el archivo físico si existe
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath)
        }

        // Actualizar el usuario removiendo la referencia al archivo
        const updates = {}
        if (fileType === 'cv') {
            updates.cv = null
        } else if (fileType === 'photo') {
            updates.photo = null
        }

        Object.assign(user, updates)
        user.updatedAt = Date.now()
        await user.save()

        const updatedUser = await User.findById(userId).select('-password')

        return res.json({
            message: 'Archivo eliminado correctamente',
            detail: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar archivo',
            detail: error.message
        })
    }
}


module.exports = {
    postUser,
    login,
    updateUser,
    updatePassword,
    verifyUser,
    requestResetPassword,
    requestResetPasswordConfirm,
    confirmUser,
    confirmUserPin,
    getStaffUsers,
    updateUserIsStaff,
    updateUserIsStaffDefault,
    getStaffByUser,
    updateUserParentUserId,
    uploadUserFiles,
    downloadUserFile,
    downloadUserFileById,
    deleteUserFiles,
    getUserByEmail
}