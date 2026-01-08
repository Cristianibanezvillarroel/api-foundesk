const Enterprise = require('../models/Enterprise.model')
const EnterpriseUser = require('../models/EnterpriseUser.model')

// Crear una nueva empresa
const createEnterprise = async (req, res) => {
    try {
        const userId = req.user
        const { name, taxId, billingEmail, slug } = req.body

        console.log('Usuario ID:', userId)
        console.log('Datos recibidos:', { name, taxId, billingEmail, slug })

        // Validaciones
        if (!name || !taxId || !billingEmail || !slug) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos'
            })
        }

        // Verificar si el slug ya existe
        const existingSlug = await Enterprise.findOne({ slug })
        if (existingSlug) {
            return res.status(400).json({
                message: 'El slug ya está en uso por otra empresa'
            })
        }

        // Crear la empresa
        const enterprise = new Enterprise({
            name,
            slug,
            taxId,
            billingEmail,
            adminUser: userId,
            status: 'active'
        })

        console.log('Empresa antes de guardar:', enterprise)
        await enterprise.save()
        console.log('Empresa guardada con ID:', enterprise._id)

        // Crear el registro de EnterpriseUser como admin
        const enterpriseUser = new EnterpriseUser({
            enterprise: enterprise._id,
            user: userId,
            role: 'admin',
            status: 'active',
            activatedAt: new Date()
        })

        await enterpriseUser.save()
        console.log('EnterpriseUser guardado con ID:', enterpriseUser._id)

        const populatedEnterprise = await Enterprise.findById(enterprise._id)
            .populate('adminUser', 'name lastname email')

        return res.json({
            message: 'Empresa creada exitosamente',
            detail: populatedEnterprise
        })
    } catch (error) {
        console.error('Error en createEnterprise:', error)
        return res.status(500).json({
            message: 'Error al crear empresa',
            detail: error.message
        })
    }
}

// Obtener todas las empresas
const getAllEnterprises = async (req, res) => {
    try {
        const enterprises = await Enterprise.find({ status: 'active' })
            .populate('adminUser', 'name lastname email')
            .sort({ createdAt: -1 })

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

// Obtener una empresa por ID
const getEnterpriseById = async (req, res) => {
    try {
        const { enterpriseId } = req.params

        const enterprise = await Enterprise.findById(enterpriseId)
            .populate('adminUser', 'name lastname email')

        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada'
            })
        }

        return res.json({
            message: 'Empresa obtenida',
            detail: enterprise
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener empresa',
            detail: error.message
        })
    }
}

// Actualizar empresa
const updateEnterprise = async (req, res) => {
    try {
        const { enterpriseId } = req.params
        const userId = req.user._id
        const updateData = req.body

        const enterprise = await Enterprise.findById(enterpriseId)

        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada'
            })
        }

        // Verificar que el usuario es admin de la empresa
        const enterpriseUser = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: userId,
            role: 'admin',
            status: 'active'
        })

        if (!enterpriseUser) {
            return res.status(403).json({
                message: 'No tienes permisos para actualizar esta empresa'
            })
        }

        // Actualizar empresa
        Object.assign(enterprise, updateData)
        await enterprise.save()

        const updatedEnterprise = await Enterprise.findById(enterpriseId)
            .populate('adminUser', 'name lastname email')

        return res.json({
            message: 'Empresa actualizada exitosamente',
            detail: updatedEnterprise
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar empresa',
            detail: error.message
        })
    }
}

// Cambiar estado de empresa
const updateEnterpriseStatus = async (req, res) => {
    try {
        const { enterpriseId } = req.params
        const { status } = req.body
        const userId = req.user._id

        const enterprise = await Enterprise.findById(enterpriseId)

        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada'
            })
        }

        // Verificar que el usuario es admin de la empresa
        const enterpriseUser = await EnterpriseUser.findOne({
            enterprise: enterpriseId,
            user: userId,
            role: 'admin',
            status: 'active'
        })

        if (!enterpriseUser) {
            return res.status(403).json({
                message: 'No tienes permisos para cambiar el estado de esta empresa'
            })
        }

        enterprise.status = status
        await enterprise.save()

        return res.json({
            message: 'Estado de empresa actualizado',
            detail: enterprise
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar estado',
            detail: error.message
        })
    }
}

module.exports = {
    createEnterprise,
    getAllEnterprises,
    getEnterpriseById,
    updateEnterprise,
    updateEnterpriseStatus
}
