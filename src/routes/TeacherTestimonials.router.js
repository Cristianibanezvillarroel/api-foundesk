const express = require('express'),
router = express.Router(),
{ getTeacherTestimonials } = require('../controllers/TeacherTestimonials.controller')

router.get('/', getTeacherTestimonials)

module.exports = router