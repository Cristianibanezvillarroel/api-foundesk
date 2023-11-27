const express = require('express'),
router = express.Router(),
{ getCustomerDiary, postCustomerDiary } = require('../controllers/CustomerDiary.controller')

router.get('/', getCustomerDiary)
router.post('/', postCustomerDiary)

module.exports = router