const express = require('express'),
router = express.Router(),
{ getUser, postUser, login, updateUser, updatePassword } = require('../controllers/User.controller')

router.get('/', getUser)
router.post('/signup', postUser)
router.post('/login', login)
router.post('/update', updateUser)
router.post('/updatepassword', updatePassword)

module.exports = router