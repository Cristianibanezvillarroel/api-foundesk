const express = require('express'),
router = express.Router(),
{ getUser, postUser, login } = require('../controllers/User.controller')

router.get('/', getUser)
router.post('/signup', postUser)
router.post('/login', login)

module.exports = router