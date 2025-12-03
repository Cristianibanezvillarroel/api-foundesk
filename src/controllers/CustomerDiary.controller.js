const CustomerDiary = require('../models/CustomerDiary.model')
const transporter = require('../config/email')

const getCustomerDiary = async (req, res) => {
    try {
        const resp = await CustomerDiary.find()
        return res.json([{
            message: 'CustomerDiary',
            items: resp
        }])

    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })

    }
}

const postCustomerDiary = async (req, res) => {
    try {
        const { email } = req.body
        const existingEmailDiary = await CustomerDiary.findOne({email})
        if(existingEmailDiary){
            return res.json({
                message: "Su email ya tiene registrada una agenda de llamado de parte de Foundesk."
            })
        }

        const customerDiary = new CustomerDiary(req.body)
        await customerDiary.save()

        // Enviar el correo
        const mailResult = await transporter.sendMail({
            from: `"Foundesk" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "📅 Confirmación de registro de agenda - Foundesk",
            html: `
            <div style="font-family: Arial; padding: 24px; color: #333;">
                <h2>Hola ${customerDiary.name} . Gracias por contactar a Foundesk</h2>
                <p>Tu agenda de confirmación es:</p>

                <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;
                            padding: 12px; background: #f4f4f4; width: fit-content;
                            border-radius: 6px; margin-bottom: 20px;">
                    ${customerDiary.date} a las ${customerDiary.schedule} y me interesa para ${customerDiary.interesIn} .
                </div>

                <p>Confirmaremos la agenda unos minutos antes vía whatsapp al numero ${customerDiary.phone} y utilizaremos ${customerDiary.channel} para realizar la demostración como nos has solicitado.</p>

                <p>Te invitamos a que mientras tanto puedes seguir conociendo más sobre nuestros cursos en el siguiente enlace.</p>

                <a href="${process.env.FRONTEND_URL}/#/courses"
                    style="background: #0066ff; color: #fff; padding: 14px 24px;
                            text-decoration: none; border-radius: 8px;">
                    Ver Cursos
                </a>

                <p style="margin-top: 20px; font-size: 14px; color: #777;">
                    Este enlace no expirará.<br>
                    Si no solicitaste esta agenda, ignora este correo.
                </p>
            </div>
            `,
        });

        return res.json({
            message: "Se ha agendado exitosamente su contacto. Un ejecutivo de Foundesk lo contactara en el dia y horario que usted ha señalado."
        })
    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

module.exports = {
    getCustomerDiary,
    postCustomerDiary
}