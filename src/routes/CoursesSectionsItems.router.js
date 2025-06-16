const express = require('express'),
router = express.Router(),
{ getCoursesSectionsItems } = require('../controllers/CoursesSectionsItems.controller')

router.get('/', getCoursesSectionsItems)

module.exports = router