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
mercadopagoRouter = require('./MercadoPago.router')

router.use('/blog', blogRouter)
router.use('/blogcategories', blogCategoriesRouter)
router.use('/customertestimonials', customerTestimonialsRouter)
router.use('/teachertestimonials', teacherTestimonialsRouter)
router.use('/trainertestimonials', trainerTestimonialsRouter)
router.use('/coursescategories', coursesCategoriesRouter)
router.use('/coursescategoriesdetail', coursesCategoriesDetailRouter)
router.use('/courses', coursesRouter)
router.use('/customerdiary', customerDiaryRouter)
router.use('/user', userRouter)
router.use('/mercadopago', mercadopagoRouter)

module.exports = router;