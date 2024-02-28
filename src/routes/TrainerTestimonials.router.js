const express = require('express'),
router = express.Router(),
{ getTrainerTestimonials } = require('../controllers/TrainerTestimonials.controller')

router.get('/', getTrainerTestimonials)

module.exports = router