const express = require('express'),
router = express.Router(),
{ postUser, login, updateUser, updatePassword, verifyUser, requestResetPassword, requestResetPasswordConfirm, confirmUserPin } = require('../controllers/User.controller'),
auth = require('../middlewares/authorization')

console.log('Entrando a user.router.js');

router.post('/signup', postUser)
router.post('/confirm', confirmUserPin)
router.post('/login', login)
router.put('/update', auth, updateUser)
router.post('/updatepassword', auth, updatePassword)
router.get('/verify', auth, verifyUser)
router.post('/reset-password', requestResetPassword)
router.post('/reset-password-confirm', requestResetPasswordConfirm)

module.exports = router