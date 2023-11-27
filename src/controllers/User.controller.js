const User = require('../models/User.model')

const getUser = async (req, res) => {
    try {
        const resp = await User.find()
        return res.json([{
            message: 'User',
            items: resp
        }])

    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })

    }
}

const postUser = async (req, res) => {
    try {
        const { email, name, password, idItem } = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({
                message: "Su cuenta de usuario ya se encuentra registrada en Foundesk."
            })
        }
        const User = new User(req.body)
        await User.save()
        return res.json({
            message: "Se ha registrado exitosamente su cuenta en Foundesk."
        })
    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

module.exports = {
    getUser,
    postUser
}