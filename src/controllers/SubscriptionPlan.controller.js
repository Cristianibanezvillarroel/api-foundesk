const SubscriptionPlan = require('../models/SubscriptionPlan.model')

// Obtener todos los planes de suscripción
const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 })
        
        return res.json({
            message: 'Planes obtenidos',
            detail: plans
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener planes',
            detail: error.message
        })
    }
}

// Obtener un plan por ID
const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params
        
        const plan = await SubscriptionPlan.findById(id)
        
        if (!plan) {
            return res.status(404).json({
                message: 'Plan no encontrado'
            })
        }
        
        return res.json({
            message: 'Plan obtenido',
            detail: plan
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener plan',
            detail: error.message
        })
    }
}

// Crear un nuevo plan de suscripción
const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, currency, billingCycle, accessRules, status } = req.body
        
        // Validaciones
        if (!name || price === undefined) {
            return res.status(400).json({
                message: 'El nombre y precio son obligatorios'
            })
        }
        
        // Verificar si ya existe un plan con el mismo nombre
        const existingPlan = await SubscriptionPlan.findOne({ name })
        if (existingPlan) {
            return res.status(400).json({
                message: 'Ya existe un plan con ese nombre'
            })
        }
        
        const newPlan = new SubscriptionPlan({
            name,
            price,
            currency: currency || 'CLP',
            billingCycle: billingCycle || 'yearly',
            accessRules: accessRules || {},
            status: status || 'active'
        })
        
        await newPlan.save()
        
        return res.status(201).json({
            message: 'Plan creado exitosamente',
            detail: newPlan
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear plan',
            detail: error.message
        })
    }
}

// Actualizar un plan de suscripción
const updateSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, currency, billingCycle, accessRules, status } = req.body
        
        const plan = await SubscriptionPlan.findById(id)
        
        if (!plan) {
            return res.status(404).json({
                message: 'Plan no encontrado'
            })
        }
        
        // Verificar si el nuevo nombre ya existe en otro plan
        if (name && name !== plan.name) {
            const existingPlan = await SubscriptionPlan.findOne({ name, _id: { $ne: id } })
            if (existingPlan) {
                return res.status(400).json({
                    message: 'Ya existe otro plan con ese nombre'
                })
            }
        }
        
        // Actualizar campos
        if (name) plan.name = name
        if (price !== undefined) plan.price = price
        if (currency) plan.currency = currency
        if (billingCycle) plan.billingCycle = billingCycle
        if (accessRules !== undefined) plan.accessRules = accessRules
        if (status) plan.status = status
        
        await plan.save()
        
        return res.json({
            message: 'Plan actualizado exitosamente',
            detail: plan
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar plan',
            detail: error.message
        })
    }
}

// Eliminar un plan de suscripción
const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params
        
        const plan = await SubscriptionPlan.findById(id)
        
        if (!plan) {
            return res.status(404).json({
                message: 'Plan no encontrado'
            })
        }
        
        await SubscriptionPlan.findByIdAndDelete(id)
        
        return res.json({
            message: 'Plan eliminado exitosamente'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar plan',
            detail: error.message
        })
    }
}

// Obtener planes activos
const getActiveSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ status: 'active' }).sort({ price: 1 })
        
        return res.json({
            message: 'Planes activos obtenidos',
            detail: plans
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener planes activos',
            detail: error.message
        })
    }
}

module.exports = {
    getSubscriptionPlans,
    getSubscriptionPlanById,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    getActiveSubscriptionPlans
}
