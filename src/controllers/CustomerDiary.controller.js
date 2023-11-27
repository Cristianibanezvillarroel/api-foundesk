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

module.exports = {
    getCustomerDiary
}