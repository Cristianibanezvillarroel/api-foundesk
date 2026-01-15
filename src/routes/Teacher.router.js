const express = require('express'),
router = express.Router(),
{ getTeacher, getTeacherByUser, getTeacherById, teacherRequest, uploadTeacherFiles, updateTeacherTimes, updateTeacherConfirm, teacherCourses, downloadTeacherFile, updateTeacherContract, getTeacherContract, deleteTeacherPhoto } = require('../controllers/Teacher.controller'),
auth = require('../middlewares/authorization'),
fileUploadProcessor = require('../middlewares/fileUploadProcessor');

router.get('/', getTeacher)
router.get('/teacher/:userId', getTeacherByUser)
router.get('/:id', getTeacherById)
router.post('/create', auth, teacherRequest)
router.post('/upload-teacher-files', auth, fileUploadProcessor, uploadTeacherFiles)
router.get('/files/:fileType/:teacherId', auth, downloadTeacherFile)
router.delete('/photo', auth, deleteTeacherPhoto)
router.patch('/update-teacher-times/:teacherId', auth, updateTeacherTimes)
router.patch('/update-teacher-confirm/:teacherId', auth, updateTeacherConfirm)
router.get('/courses/:teacherId', auth, teacherCourses)
router.patch('/contract/:teacherId', auth, updateTeacherContract)
router.get('/contract/:teacherId', auth, getTeacherContract)

module.exports = router