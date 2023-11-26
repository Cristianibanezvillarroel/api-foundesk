const express = require('express'),
router = express.Router(),
{ getCoursesCategoriesDetail } = require('../controllers/CoursesCategoriesDetail.controller')

router.get('/', getCoursesCategoriesDetail)

module.exports = router