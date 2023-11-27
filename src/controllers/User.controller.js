const User = require('../models/User.model')
const bcrypt = require('bcrypt')

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
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({
                message: "Usted ya tiene una cuenta de usuario activada en Foundesk. Ingrese a la plataforma en la seccion de Login."
            })
        }
        const user = new User(req.body)
        user.hashPassword(password)
        await user.save()
        return res.json({
            message: "Su cuenta se ha creado exitosamente. Ingrese a la plataforma en la seccion de Login."
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
        const isCorrectPassword = bcrypt.compare(password, userFind.password)
        if(isCorrectPassword){
            return res.json({
                message: "OK",
                detail: {user: userFind, token: userFind.generateJWT()}
            })
        }
    } catch (error) {
        return res.json({
            message: "Error",
            detail: error.message
        })
    }
}

module.exports = {
    getUser,
    postUser,
    login
}