const CustomerDiary = require('../models/CustomerDiary.model')

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
        return res.json({
            message: "Se ha agendado exitosamente su llamada. Un ejecutivo de Foundesk lo contactara en el dia y horario que usted ha señalado."
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