const express = require('express'),
router = express.Router(),
{ postUser, login, updateUser, updatePassword, verifyUser } = require('../controllers/User.controller'),
auth = require('../middlewares/authorization')

router.post('/signup', postUser)
router.post('/login', login)
router.put('/update', auth, updateUser)
router.post('/updatepassword', auth, updatePassword)
router.get('/verify', auth, verifyUser)

module.exports = router