const express = require('express')
const router = express.Router()
const { 
    getSubscriptionPlans, 
    getSubscriptionPlanById,
    createSubscriptionPlan, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan,
    getActiveSubscriptionPlans
} = require('../controllers/SubscriptionPlan.controller')
const auth = require('../middlewares/authorization')

// Rutas públicas
router.get('/active', getActiveSubscriptionPlans)

// Rutas protegidas (requieren autenticación)
router.get('/', auth, getSubscriptionPlans)
router.get('/:id', auth, getSubscriptionPlanById)
router.post('/', auth, createSubscriptionPlan)
router.put('/:id', auth, updateSubscriptionPlan)
router.delete('/:id', auth, deleteSubscriptionPlan)

module.exports = router
