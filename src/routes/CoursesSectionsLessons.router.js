const express = require('express'),
router = express.Router(),
{ getCoursesSectionsLessons } = require('../controllers/CoursesSectionsLessons.controller')

router.get('/', getCoursesSectionsLessons)

module.exports = router