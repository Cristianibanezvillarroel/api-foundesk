const express = require('express'),
router = express.Router(),
{ getCoursesLearnItems } = require('../controllers/CoursesLearnItems.controller')

router.get('/', getCoursesLearnItems)

module.exports = router