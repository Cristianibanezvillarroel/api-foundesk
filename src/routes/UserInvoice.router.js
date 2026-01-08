const express = require('express'),
router = express.Router(),
{ createOrUpdateUserInvoice, getUserInvoice, deleteUserInvoice } = require('../controllers/UserInvoice.controller'),
auth = require('../middlewares/authorization')

router.post('/create-or-update', auth, createOrUpdateUserInvoice)
router.get('/', auth, getUserInvoice)
router.delete('/', auth, deleteUserInvoice)

module.exports = router
