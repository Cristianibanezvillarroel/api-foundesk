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
coursesContentCategoriesRouter = require('./CoursesContentCategories.router'),
coursesContentItemsRouter = require('./CoursesContentItems.router'),
teacherRouter = require('./Teacher.router'),
mercadopagoRouter = require('./MercadoPago.router')

router.use('/blog', blogRouter)
router.use('/blogcategories', blogCategoriesRouter)
router.use('/customertestimonials', customerTestimonialsRouter)
router.use('/teachertestimonials', teacherTestimonialsRouter)
router.use('/trainertestimonials', trainerTestimonialsRouter)
router.use('/coursescategories', coursesCategoriesRouter)
router.use('/coursescategoriesdetail', coursesCategoriesDetailRouter)
router.use('/courses', coursesRouter)
router.use('/courseslearnitems', coursesLearnItemsRouter)
router.use('/coursescontentcategories', coursesContentCategoriesRouter)
router.use('/coursescontentitems', coursesContentItemsRouter)
router.use('/teacher', teacherRouter)
router.use('/customerdiary', customerDiaryRouter)
router.use('/user', userRouter)
router.use('/mercadopago', mercadopagoRouter)

module.exports = router;