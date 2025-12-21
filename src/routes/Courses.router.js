const express = require('express'),
router = express.Router(),
{ getCourses, getCoursesById, coursesCreate, coursesUpdate, coursesDelete, uploadCourseFiles, downloadCourseFile } = require('../controllers/Courses.controller'),
auth = require('../middlewares/authorization'),
fileUploadProcessor = require('../middlewares/fileUploadProcessor');

router.get('/', getCourses)
router.get('/:id', getCoursesById)
router.post('/create', coursesCreate)
router.patch('/update/:id', coursesUpdate)
router.delete('/delete/:id', coursesDelete)
router.post('/upload-course-files', auth, fileUploadProcessor, uploadCourseFiles)
router.get('/files/:courseId', downloadCourseFile) // Ruta pública - las imágenes de cursos son contenido promocional

module.exports = router