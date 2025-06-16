const CoursesSectionsItems = require('../models/CoursesSectionsItems.model')

const express = require('express'),
router = express.Router(),
blogRouter = require('./Blog.router'),
blogCategoriesRouter = require('./BlogCategories.router'),
customerTestimonialsRouter = require('./CustomerTestimonials.router'),
teacherTestimonialsRouter = require('./TeacherTestimonials.router'),
trainerTestimonialsRouter = require('./TrainerTestimonials.router'),
coursesCategoriesRouter = require('./CoursesCategories.router'),
coursesCategoriesDetailRouter = require('./CoursesCategoriesDetail.router'),
coursesRouter = require('./Courses.router'),
customerDiaryRouter = require('./CustomerDiary.router'),
userRouter = require('./User.router'),
coursesLearnItemsRouter = require('./CoursesLearnItems.router'),
coursesSectionsRouter = require('./CoursesSections.router'),
coursesSectionsItemsRouter = require('./CoursesSectionsItems.router'),
teacherRouter = require('./Teacher.router'),
mercadopagoRouter = require('./MercadoPago.router'),
userCoursesRouter = require('./UserCourses.router')

router.use('/blog', blogRouter)
router.use('/blogcategories', blogCategoriesRouter)
router.use('/customertestimonials', customerTestimonialsRouter)
router.use('/teachertestimonials', teacherTestimonialsRouter)
router.use('/trainertestimonials', trainerTestimonialsRouter)
router.use('/coursescategories', coursesCategoriesRouter)
router.use('/coursescategoriesdetail', coursesCategoriesDetailRouter)
router.use('/courses', coursesRouter)
router.use('/courseslearnitems', coursesLearnItemsRouter)
router.use('/coursessections', coursesSectionsRouter)
router.use('/coursessectionsitems', coursesSectionsItemsRouter)
router.use('/teacher', teacherRouter)
router.use('/customerdiary', customerDiaryRouter)
router.use('/user', userRouter)
router.use('/mercadopago', mercadopagoRouter)
router.use('/usercourses', userCoursesRouter)

module.exports = router;