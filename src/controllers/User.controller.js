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
    try {
        const newData = req.body
        const resp = await User.findByIdAndUpdate(
            newData.id,
            { $set: newData },
            { new: true }
        )
        return res.json({
            message: "User updated successfully"
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
        
        const { email, password, newpassword, id} = req.body
        
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

module.exports = {
    getUser,
    postUser,
    login,
    updateUser,
    updatePassword
}