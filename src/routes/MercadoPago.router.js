const express = require('express'),
router = express.Router(),
{ postMercadoPago } = require('../controllers/MercadoPago.controller')

router.post('/checkout', postMercadoPago)

module.exports = router