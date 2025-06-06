const UserCourses = require('../models/UserCourses.model')

// Asociar un usuario a un curso
const enrollUserInCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        const alreadyEnrolled = await UserCourses.findOne({ user: userId, course: courseId })
        if (alreadyEnrolled) {
            return res.json({ message: 'El usuario ya está inscrito en este curso.' })
        }
        const enrollment = new UserCourses({ user: userId, course: courseId })
        await enrollment.save()
        res.json({ message: 'Usuario inscrito en el curso exitosamente.', enrollment })
    } catch (error) {
        res.status(500).json({ message: 'Error al inscribir usuario en curso', detail: error.message })
    }
}

// Obtener todos los cursos de un usuario
const getCoursesByUser = async (req, res) => {
    try {
        const { userId } = req.params
        const courses = await UserCourses.find({ user: userId }).populate('course')
        res.json({ courses })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cursos del usuario', detail: error.message })
    }
}

// Obtener todos los usuarios de un curso
const getUsersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const users = await UserCourses.find({ course: courseId }).populate('user')
        res.json({ users })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios del curso', detail: error.message })
    }
}

module.exports = {
    enrollUserInCourse,
    getCoursesByUser,
    getUsersByCourse
}
