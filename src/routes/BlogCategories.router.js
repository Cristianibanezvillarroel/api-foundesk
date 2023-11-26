const express = require('express'),
router = express.Router(),
{ getBlogCategories } = require('../controllers/BlogCategories.controller')

router.get('/', getBlogCategories)

module.exports = router