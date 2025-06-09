const UserCourses = require('../models/UserCourses.model')

// Asociar un usuario a un curso
const enrollUserInCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        const alreadyEnrolled = await UserCourses.findOne({ user: userId, courses: courseId })
        if (alreadyEnrolled) {
            return res.json({ message: 'El usuario ya está inscrito en este curso.' })
        }
        const enrollment = new UserCourses({ user: userId, courses: courseId })
        await enrollment.save()
        res.json({ message: 'Usuario inscrito en el curso exitosamente.', enrollment })
    } catch (error) {
        res.status(500).json({ message: 'Error al inscribir usuario en curso', detail: error.message })
    }
}

// Obtener todos los cursos de un usuario (userId por body)
const getCoursesByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const resp = await UserCourses.find({ user: userId })
            .populate({
                path: 'courses',
                populate: [
                    { path: 'categorie' },
                    { path: 'teacher' }
                ]
            });
        return res.json([{
            message: 'CoursesByUser',
            items: resp
        }]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cursos del usuario', detail: error.message });
    }
}

// Obtener todos los usuarios de un curso (courseId por body)
const getUsersByCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const resp = await UserCourses.find({ courses: courseId }).populate('user');
        return res.json([{
            message: 'UsersByCourse',
            items: resp
        }]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios del curso', detail: error.message });
    }
}

module.exports = {
    enrollUserInCourse,
    getCoursesByUser,
    getUsersByCourse
}
