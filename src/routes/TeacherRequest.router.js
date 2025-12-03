const express = require('express'),
router = express.Router(),
{ teacherRequest } = require('../controllers/TeacherRequest.controller'),
auth = require('../middlewares/authorization')

// POST /teacher/request
router.post('/create', auth, teacherRequest)

module.exports = router