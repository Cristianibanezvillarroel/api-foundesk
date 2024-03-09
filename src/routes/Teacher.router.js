const express = require('express'),
router = express.Router(),
{ getTeacher } = require('../controllers/Teacher.controller')

router.get('/', getTeacher)

module.exports = router