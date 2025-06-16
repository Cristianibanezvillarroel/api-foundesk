const express = require('express'),
router = express.Router(),
{ getCoursesSections } = require('../controllers/CoursesSections.controller')

router.get('/', getCoursesSections)

module.exports = router