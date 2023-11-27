const express = require('express'),
router = express.Router(),
{ getCustomerDiary } = require('../controllers/CustomerDiary.controller')

router.get('/', getCustomerDiary)

module.exports = router