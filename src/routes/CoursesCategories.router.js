const express = require('express'),
router = express.Router(),
{ getCoursesCategories } = require('../controllers/CoursesCategories.controller')

router.get('/', getCoursesCategories)

module.exports = router