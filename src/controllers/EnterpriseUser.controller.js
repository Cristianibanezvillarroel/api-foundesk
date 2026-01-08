const EnterpriseUser = require('../models/EnterpriseUser.model')
const Enterprise = require('../models/Enterprise.model')
const User = require('../models/User.model')
const Course = require('../models/Courses.model')

// Asignar un usuario a un curso dentro de la empresa
const assignUserToCourse = async (req, res) => {
    try {
        const assignerUserId = req.user // Usuario que asigna (viene de auth)
        const { assignedUserId, courseId, enterpriseId } = req.body

        // Validaciones
        if (!assignedUserId || !courseId || !enterpriseId) {
            return res.status(400).json({
                message: 'Se requiere el ID del usuario asignado, el ID del curso y el ID de la empresa'
            })
        }

        // Verificar que la empresa existe
        const enterprise = await Enterprise.findById(enterpriseId)
        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada'
            })
        }

        // Verificar que el asignador pertenece a la empresa como admin o manager
        const assignerEnterpriseUser = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: assignerUserId,
            role: { $in: ['admin', 'manager'] },
            status: 'active'
        })

        if (!assignerEnterpriseUser) {
            return res.status(403).json({
                message: 'No tienes permisos para asignar usuarios en esta empresa'
            })
        }

        // Verificar que el usuario asignado existe
        const assignedUser = await User.findById(assignedUserId)
        if (!assignedUser) {
            return res.status(404).json({
                message: 'Usuario asignado no encontrado'
            })
        }

        // Verificar o crear el usuario en la empresa
        let assignedEnterpriseUser = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: assignedUserId
        })

        if (!assignedEnterpriseUser) {
            // Crear el usuario en la empresa si no existe
            assignedEnterpriseUser = new EnterpriseUser({
                enterprise: enterpriseId,
                user: assignedUserId,
                role: 'member',
                status: 'active',
                activatedAt: new Date()
            })
            await assignedEnterpriseUser.save()
        }

        // Verificar que el curso existe
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({
                message: 'Curso no encontrado'
            })
        }

        // Aquí podrías agregar la lógica para asignar el curso al usuario
        // Por ahora, simplemente confirmamos que el usuario está en la empresa
        
        const populatedAssignment = await EnterpriseUser.findById(assignedEnterpriseUser._id)
            .populate('user', 'name lastname email')
            .populate('enterprise', 'name')

        return res.json({
            message: 'Usuario asignado a la empresa exitosamente',
            detail: {
                enterpriseUser: populatedAssignment,
                courseId: courseId
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al asignar usuario',
            detail: error.message
        })
    }
}

// Obtener usuarios de la empresa
const getEnterpriseUsers = async (req, res) => {
    try {
        const userId = req.user
        const { enterpriseId } = req.query

        if (!enterpriseId) {
            return res.status(400).json({
                message: 'Se requiere el ID de la empresa'
            })
        }

        // Verificar que el usuario pertenece a la empresa
        const userEnterprise = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: userId,
            status: 'active'
        })

        if (!userEnterprise) {
            return res.status(403).json({
                message: 'No tienes acceso a esta empresa'
            })
        }

        const users = await EnterpriseUser.find({ 
            enterprise: enterpriseId,
            status: { $in: ['active', 'invited'] }
        })
            .populate('user', 'name lastname email photo')
            .sort({ createdAt: -1 })

        return res.json({
            message: 'Usuarios obtenidos',
            detail: users
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener usuarios',
            detail: error.message
        })
    }
}

// Obtener empresas del usuario
const getUserEnterprises = async (req, res) => {
    try {
        const userId = req.user

        const enterpriseUsers = await EnterpriseUser.find({ 
            user: userId,
            status: 'active'
        })
            .populate('enterprise', 'name slug status')
            .sort({ createdAt: -1 })

        const enterprises = enterpriseUsers.map(eu => ({
            ...eu.enterprise.toObject(),
            userRole: eu.role
        }))

        return res.json({
            message: 'Empresas obtenidas',
            detail: enterprises
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener empresas',
            detail: error.message
        })
    }
}

// Eliminar un usuario de la empresa
const removeUserFromEnterprise = async (req, res) => {
    try {
        const { enterpriseUserId } = req.params
        const requestUserId = req.user._id

        const enterpriseUser = await EnterpriseUser.findById(enterpriseUserId)

        if (!enterpriseUser) {
            return res.status(404).json({
                message: 'Usuario de empresa no encontrado'
            })
        }

        // Verificar que quien elimina es admin o manager de la empresa
        const requesterEnterprise = await EnterpriseUser.findOne({
            enterprise: enterpriseUser.enterprise,
            user: requestUserId,
            role: { $in: ['admin', 'manager'] },
            status: 'active'
        })

        if (!requesterEnterprise) {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar usuarios de esta empresa'
            })
        }

        await EnterpriseUser.findByIdAndDelete(enterpriseUserId)

        return res.json({
            message: 'Usuario eliminado de la empresa exitosamente'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar usuario',
            detail: error.message
        })
    }
}

// Actualizar rol de usuario en empresa
const updateUserRole = async (req, res) => {
    try {
        const { enterpriseUserId } = req.params
        const { role } = req.body
        const requestUserId = req.user._id

        const enterpriseUser = await EnterpriseUser.findById(enterpriseUserId)

        if (!enterpriseUser) {
            return res.status(404).json({
                message: 'Usuario de empresa no encontrado'
            })
        }

        // Verificar que quien actualiza es admin de la empresa
        const requesterEnterprise = await EnterpriseUser.findOne({
            enterprise: enterpriseUser.enterprise,
            user: requestUserId,
            role: 'admin',
            status: 'active'
        })

        if (!requesterEnterprise) {
            return res.status(403).json({
                message: 'Solo los administradores pueden cambiar roles'
            })
        }

        enterpriseUser.role = role
        await enterpriseUser.save()

        const updatedUser = await EnterpriseUser.findById(enterpriseUserId)
            .populate('user', 'name lastname email')
            .populate('enterprise', 'name')

        return res.json({
            message: 'Rol actualizado exitosamente',
            detail: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar rol',
            detail: error.message
        })
    }
}

// Obtener métricas de la empresa
const getEnterpriseMetrics = async (req, res) => {
    try {
        const userId = req.user._id
        const { enterpriseId } = req.query

        if (!enterpriseId) {
            return res.status(400).json({
                message: 'Se requiere el ID de la empresa'
            })
        }

        // Verificar acceso a la empresa
        const userEnterprise = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: userId,
            status: 'active'
        })

        if (!userEnterprise) {
            return res.status(403).json({
                message: 'No tienes acceso a esta empresa'
            })
        }

        // Obtener métricas
        const totalUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            status: { $in: ['active', 'invited'] }
        })

        const activeUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            status: 'active'
        })

        const invitedUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            status: 'invited'
        })

        const adminUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            role: 'admin',
            status: 'active'
        })

        const managerUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            role: 'manager',
            status: 'active'
        })

        const memberUsers = await EnterpriseUser.countDocuments({ 
            enterprise: enterpriseId,
            role: 'member',
            status: 'active'
        })

        return res.json({
            message: 'Métricas obtenidas',
            detail: {
                totalUsers,
                activeUsers,
                invitedUsers,
                adminUsers,
                managerUsers,
                memberUsers
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener métricas',
            detail: error.message
        })
    }
}

module.exports = {
    assignUserToCourse,
    getEnterpriseUsers,
    getUserEnterprises,
    removeUserFromEnterprise,
    updateUserRole,
    getEnterpriseMetrics
}
