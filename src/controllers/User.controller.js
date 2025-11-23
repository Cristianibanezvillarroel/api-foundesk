const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const transporter = require('../config/email')

const postUser = async (req, res) => {

    try {

        console.log('POST /user req.body:', req.body); // <-- Aquí revisas lo que llega
    
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({
                message: "Usted ya tiene una cuenta de usuario activada en Foundesk. Ingrese a la plataforma en la seccion de Login."
            })
        }

        console.log("estamos en la api");
        console.log(req.body);
        const user = new User(req.body)
        user.hashPassword(password)
        await user.save()

        const userFind = await User.findOne({ email })
        return res.json({
            message: "Su cuenta se ha creado exitosamente. Ingrese a la plataforma en la seccion de Login.",
            detail: { user: userFind, token: userFind.generateJWT() }
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
    console.log("====[RESET PASSWORD REQUEST]====");
    try {
        const { email } = req.body
        console.log(`[1] Email recibido desde frontend: ${email}`);
        const user = await User.findOne({ email })
        console.log(`[2] ¿Usuario encontrado?: ${!!user}`);
        if (!user) {
            console.log("[2.1] Usuario NO existe — pero enviamos respuesta genérica.");
            return res.json({
                message: "Si el correo existe, enviaremos instrucciones para restablecer su contraseña."
            })
        }

        // Generar token seguro
        const token = crypto.randomBytes(32).toString('hex')
        console.log(`[3] Token generado: ${token}`);
        // Guardar token y expiración de 1 hora
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()
        console.log("[4] Token guardado en BD correctamente.");

        // Aquí luego enviarás el correo: 
        // ejemplo: https://app.foundesk.cl/reset-password?token=xxxx

       // URL para el frontend
        const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password-confirm?token=${token}`;
        console.log(`[5] URL generada para reset: ${resetUrl}`);

        // Mostrar configuración SMTP
        console.log("---- SMTP CONFIG ----");
        console.log(`MAIL_USER: ${process.env.MAIL_USER}`);
        console.log(`MAIL_PASS (primeros 3 chars): ${process.env.MAIL_PASS?.substring(0,3)}***`);
        console.log("----------------------");

        // Enviar el correo
        console.log("[6] Intentando enviar el correo...");
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

        console.log("[7] Resultado de sendMail:");
        console.log(mailResult);

        console.log("====[RESET PASSWORD COMPLETADO OK]====");

        return res.json({
            message: "Revise su correo para continuar con el proceso de recuperación.",
            detail: { token } // <--- puedes removerlo después en producción
        })

    } catch (error) {
        console.error("====[ERROR EN RESET PASSWORD]====");
        console.error(error);
        console.error("=================================");

        return res.json({ message: "Error", detail: error.message })
    }
}

// ---------------------------------------
// Confirmar el reset de contraseña
// ---------------------------------------
const requestResetPasswordConfirm = async (req, res) => {
    try {
        const { token, newPassword } = req.body

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



module.exports = {
    postUser,
    login,
    updateUser,
    updatePassword,
    verifyUser,
    requestResetPassword,
    requestResetPasswordConfirm
}