const express = require('express'),
router = express.Router(),
{
    getCoursesSectionsLessons,
    getCoursesSectionsLessonsBySection,
    getCoursesSectionsLessonById,
    createCoursesSectionsLesson,
    updateCoursesSectionsLesson,
    deleteCoursesSectionsLesson
} = require('../controllers/CoursesSectionsLessons.controller'),
auth = require('../middlewares/authorization');

router.get('/', getCoursesSectionsLessons)
router.get('/section/:sectionId', auth, getCoursesSectionsLessonsBySection)
router.get('/:id', auth, getCoursesSectionsLessonById)
router.post('/create', auth, createCoursesSectionsLesson)
router.patch('/update/:id', auth, updateCoursesSectionsLesson)
router.delete('/delete/:id', auth, deleteCoursesSectionsLesson)

module.exports = router