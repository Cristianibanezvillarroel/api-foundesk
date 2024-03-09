const express = require('express'),
router = express.Router(),
{ getCoursesContentItems } = require('../controllers/CoursesContentItems.controller')

router.get('/', getCoursesContentItems)

module.exports = router