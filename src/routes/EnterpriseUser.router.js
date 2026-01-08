const express = require('express'),
router = express.Router(),
{ assignUserToCourse, getEnterpriseUsers, getUserEnterprises, removeUserFromEnterprise, updateUserRole, getEnterpriseMetrics } = require('../controllers/EnterpriseUser.controller'),
auth = require('../middlewares/authorization')

router.post('/assign', auth, assignUserToCourse)
router.get('/users', auth, getEnterpriseUsers)
router.get('/my-enterprises', auth, getUserEnterprises)
router.delete('/:enterpriseUserId', auth, removeUserFromEnterprise)
router.patch('/:enterpriseUserId/role', auth, updateUserRole)
router.get('/metrics', auth, getEnterpriseMetrics)

module.exports = router
