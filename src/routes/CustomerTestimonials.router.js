const express = require('express'),
router = express.Router(),
{ getCustomerTestimonials } = require('../controllers/CustomerTestimonials.controller')

router.get('/', getCustomerTestimonials)

module.exports = router