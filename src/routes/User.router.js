const express = require('express'),
router = express.Router(),
{ getUser, postUser } = require('../controllers/User.controller')

router.get('/', getUser)
router.post('/', postUser)

module.exports = router