const express = require('express'),
router = express.Router(),
{ createEnterprise, getAllEnterprises, getEnterpriseById, updateEnterprise, updateEnterpriseStatus } = require('../controllers/Enterprise.controller'),
auth = require('../middlewares/authorization')

router.post('/create', auth, createEnterprise)
router.get('/', auth, getAllEnterprises)
router.get('/:enterpriseId', auth, getEnterpriseById)
router.put('/:enterpriseId', auth, updateEnterprise)
router.patch('/:enterpriseId/status', auth, updateEnterpriseStatus)

module.exports = router
