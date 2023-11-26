const express = require('express'),
router = express.Router(),
{ getCourses } = require('../controllers/Courses.controller')

router.get('/', getCourses)

module.exports = router