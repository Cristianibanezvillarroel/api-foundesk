const express = require('express'),
router = express.Router(),
{ postUser, login, updateUser, updatePassword, verifyUser, requestResetPassword, requestResetPasswordConfirm, confirmUserPin, getStaffUsers, updateUserIsStaff, updateUserIsStaffDefault, getStaffByUser, updateUserParentUserId, uploadUserFiles, downloadUserFile, deleteUserFiles, getUserByEmail } = require('../controllers/User.controller'),
auth = require('../middlewares/authorization'),
fileUploadProcessor = require('../middlewares/fileUploadProcessor')

router.post('/signup', postUser)
router.post('/confirm', confirmUserPin)
router.post('/login', login)
router.put('/update', auth, updateUser)
router.post('/updatepassword', auth, updatePassword)
router.get('/verify', auth, verifyUser)
router.post('/reset-password', requestResetPassword)
router.post('/reset-password-confirm', requestResetPasswordConfirm)
router.get('/staff', auth, getStaffUsers)
router.put('/staff/is-staff', auth, updateUserIsStaff)
router.put('/staff/is-staff-default', auth, updateUserIsStaffDefault)
router.get('/staff/:userId', auth, getStaffByUser)
router.put('/staff/parent-user', auth, updateUserParentUserId)
router.post('/upload-files', auth, fileUploadProcessor, uploadUserFiles)
router.get('/files/:fileType', auth, downloadUserFile)
router.delete('/files/:fileType', auth, deleteUserFiles)
router.get('/search-by-email', auth, getUserByEmail)

module.exports = router