const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const transporter = require('../config/email')

const postUser = async (req, res) => {

    try {

        const { email, password } = req.body
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

                <a href="${process.env.FRONTEND_URL}/#/confirm?token=${token}"
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
                message: "error de password"
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
        const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password-confirm?token=${token}`;

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
        return res.json({
            message: "Su contraseña ha sido actualizada exitosamente."
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

        return res.json({ message: 'Cuenta confirmada correctamente. Ahora ya puede acceder a Foundesk. Haga clic en Ingresar de la parte superior y comience a disfrutar de su aprendizaje con Foundesk.' })
    } catch (err) {
        return res.status(500).json({ message: 'Error', detail: err.message })
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
    confirmUserPin
}