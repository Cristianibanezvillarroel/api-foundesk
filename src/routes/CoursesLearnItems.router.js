const express = require('express'),
router = express.Router(),
{ 
    getCoursesLearnItems, 
    getCoursesLearnItemsByCourse,
    getCoursesLearnItemById,
    createCoursesLearnItem, 
    updateCoursesLearnItem, 
    deleteCoursesLearnItem 
} = require('../controllers/CoursesLearnItems.controller'),
auth = require('../middlewares/authorization');

router.get('/', getCoursesLearnItems)
router.get('/course/:courseId', auth, getCoursesLearnItemsByCourse)
router.get('/:id', auth, getCoursesLearnItemById)
router.post('/create', auth, createCoursesLearnItem)
router.patch('/update/:id', auth, updateCoursesLearnItem)
router.delete('/delete/:id', auth, deleteCoursesLearnItem)

module.exports = router