const express = require('express'),
router = express.Router(),
{ 
    getCoursesSections,
    getCoursesSectionsByCourse,
    getCoursesSectionById,
    createCoursesSection,
    updateCoursesSection,
    deleteCoursesSection
} = require('../controllers/CoursesSections.controller'),
auth = require('../middlewares/authorization');

router.get('/', getCoursesSections)
router.get('/course/:courseId', auth, getCoursesSectionsByCourse)
router.get('/:id', auth, getCoursesSectionById)
router.post('/create', auth, createCoursesSection)
router.patch('/update/:id', auth, updateCoursesSection)
router.delete('/delete/:id', auth, deleteCoursesSection)

module.exports = router