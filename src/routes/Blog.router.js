const express = require('express'),
router = express.Router(),
{ getBlog } = require('../controllers/Blog.controller')

router.get('/', getBlog)

module.exports = router