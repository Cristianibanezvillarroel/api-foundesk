const Messages = require('../models/Messages.model')

const getMessages = async (req, res) => {
    try {
        const resp = await Messages.find()
            .populate([
                { path: 'courses' },
                { path: 'user' }
            ])

        return res.json([{
            message: 'Messages',
            items: resp
        }])
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener mensajes "varios"" por user (nuevo)
const getMessagesByUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?._id

        if (!userId) {
            return res.status(400).json({
                message: 'Falta user id'
            })
        }

        // Buscar mensajes donde userId es userFrom o userTo
        const messages = await Messages.find({
            $or: [
                { userFrom: userId },
                { userTo: userId }
            ]
        })
            .populate('userFrom', 'name lastname email photo')
            .populate('userTo', 'name lastname email photo')
            .populate('course', 'title _id')
            .sort({ date: -1 }) // ordenar por fecha descendente (más recientes primero)

        if (!messages || messages.length === 0) {
            return res.status(200).json({
                message: 'No existen mensajes para este usuario',
                detail: []
            })
        }

        return res.json({
            message: 'Mensajes encontrados',
            detail: messages
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Obtener teacher por ID (para TeacherDetailAdmin)
const getMessagesById = async (req, res) => {
    try {
        const { id } = req.params

        const messages = await Messages.findById(id)
            .populate('userFrom', 'name lastname email photo')
            .populate('userTo', 'name lastname email photo')
            .populate('course', 'title _id')

        if (!messages) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        return res.json({
            message: 'Usuario encontrado',
            detail: messages
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

/**
 * Crear mensaje (POST /v1/messages)
 * Body esperado: { subject, body, userFrom, userTo, course?, parentMessageId?, status?, department?, date? }
 */
const createMessage = async (req, res) => {

    const user = req.user;

    try {
        const {
            subject,
            body,
            userFrom,
            userTo,
            course,
            parentMessageId,
            status = 'unread',
            department = 'inbox',
            date
        } = req.body

        // Validaciones básicas
        if (!userFrom || !userTo) {
            return res.status(400).json({ message: 'userFrom and userTo are required' })
        }
        if (!subject && !body) {
            return res.status(400).json({ message: 'subject or body is required' })
        }

        const payload = {
            subject: subject || '',
            body: body || '',
            userFrom,
            userTo,
            status,
            department,
            date: date ? new Date(date) : new Date(),
            parentMessageId: parentMessageId || null // null si es raíz
        }

        if (course) payload.course = course

        const message = new Messages(payload)
        await message.save()

        // Poblado para respuesta útil
        const populated = await Messages.findById(message._id)
            .populate('userFrom', 'name lastname email photo')
            .populate('userTo', 'name lastname email photo')
            .populate('course', 'title _id') // ajustar campos según modelo Course

        return res.status(201).json({
            message: 'Message created',
            detail: populated,
            user: user
        })
    } catch (error) {
        console.error('createMessage error', error)
        return res.status(500).json({
            message: 'Error creating message',
            detail: error.message
        })
    }
}

// Obtener hilo de mensajes (respuestas de un mensaje principal)
const getMessageThread = async (req, res) => {
    try {
        const { id } = req.params

        const replies = await Messages.find({ parentMessageId: id })
            .populate('userFrom', 'name lastname email photo')
            .populate('userTo', 'name lastname email photo')
            .populate('course', 'title _id')
            .sort({ date: 1 }) // más antiguos primero

        return res.json({
            message: 'Thread retrieved',
            detail: replies
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

// Actualizar mensaje (PATCH para cambiar status)
const updateMessageStatus = async (req, res) => {
    console.log('✅ Controlador Update Message INICIADO.') // <-- AÑADIR ESTO
    try {
        const { id } = req.params
        const { status } = req.body

        if (!['read', 'unread'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const updated = await Messages.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        )
            .populate('userFrom', 'name lastname email photo')
            .populate('userTo', 'name lastname email photo')

        if (!updated) {
            return res.status(404).json({ message: 'Message not found' })
        }

        return res.json({
            message: 'Message updated',
            detail: updated
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error',
            detail: error.message
        })
    }
}

module.exports = {
    getMessages,
    getMessagesByUser,
    getMessagesById,
    getMessageThread,
    createMessage,
    updateMessageStatus
}