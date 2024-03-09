const express = require('express'),
router = express.Router(),
{ getCoursesContentCategories } = require('../controllers/CoursesContentCategories.controller')

router.get('/', getCoursesContentCategories)

module.exports = router