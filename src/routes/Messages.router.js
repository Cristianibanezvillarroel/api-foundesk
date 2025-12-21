const express = require('express'),
router = express.Router(),
auth = require('../middlewares/authorization'),
{ getMessages, getMessagesByUser, getMessagesById, createMessage, getMessageThread, updateMessageStatus } = require('../controllers/Messages.controller')

router.get('/', getMessages)
router.get('/user/:userId', getMessagesByUser)
router.get('/:id', getMessagesById)
router.post('/create', auth, createMessage)
router.get('/thread/:id', auth, getMessageThread)
router.patch('/update/:id', auth, updateMessageStatus)

module.exports = router