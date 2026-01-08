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
userInvoiceRouter = require('./UserInvoice.router'),
coursesLearnItemsRouter = require('./CoursesLearnItems.router'),
coursesSectionsRouter = require('./CoursesSections.router'),
coursesSectionsLessonsRouter = require('./CoursesSectionsLessons.router'),
teacherRouter = require('./Teacher.router'),
mercadopagoRouter = require('./MercadoPago.router'),
userCoursesRouter = require('./UserCourses.router'),
userCoursesNotesRouter = require('./UserCoursesNotes.router'),
teacherAnnouncementsRouter = require('./TeacherAnnouncements.router'),
customerCommentsRouter = require('./CustomerComments.router'),
teacherCommentsRouter = require('./TeacherComments.router'),
coursesDownloadableRouter = require('./CoursesDownloadable.router'),
coursesVideosRouter = require('./CoursesVideos.router'),
coursesFaqRouter = require('./CoursesFaq.router'),
coursesRatingsRouter = require('./CoursesRatings.router'),
coursesQuestionsRouter = require('./CoursesQuestions.router'),
coursesAnswersRouter = require('./CoursesAnswers.router'),
faqRouter = require('./Faq.router'),
itUsefulRouter = require('./ItUseful.router'),
userCoursesProgressRouter = require('./UserCoursesProgress.router'),
messagesRouter = require('./Messages.router'),
coursesStatisticsRouter = require('./CoursesStatistics.router'),
teacherSignedDocumentRouter = require('./TeacherSignedDocument.router'),
enterpriseUserRouter = require('./EnterpriseUser.router'),
enterpriseRouter = require('./Enterprise.router'),
subscriptionPlanRouter = require('./SubscriptionPlan.router');

// Definir las rutas y sus controladores
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
router.use('/coursessectionslessons', coursesSectionsLessonsRouter)
router.use('/teacher', teacherRouter)
router.use('/customerdiary', customerDiaryRouter)
router.use('/user', userRouter)
router.use('/userinvoice', userInvoiceRouter)
router.use('/mercadopago', mercadopagoRouter)
router.use('/usercourses', userCoursesRouter)
router.use('/usercoursesnotes', userCoursesNotesRouter)
router.use('/teacherannouncements', teacherAnnouncementsRouter)
router.use('/customercomments', customerCommentsRouter)
router.use('/teachercomments', teacherCommentsRouter)
router.use('/coursesdownloadable', coursesDownloadableRouter)
router.use('/coursesvideos', coursesVideosRouter)
router.use('/coursesfaq', coursesFaqRouter);
router.use('/coursesratings', coursesRatingsRouter)
router.use('/coursesquestions', coursesQuestionsRouter)
router.use('/coursesanswers', coursesAnswersRouter)
router.use('/faq', faqRouter)
router.use('/ituseful', itUsefulRouter)
router.use('/usercoursesprogress', userCoursesProgressRouter)
router.use('/messages', messagesRouter);
router.use('/coursesstatistics', coursesStatisticsRouter);
router.use('/teachersigneddocument', teacherSignedDocumentRouter);
router.use('/enterpriseuser', enterpriseUserRouter);
router.use('/enterprise', enterpriseRouter);
router.use('/subscriptionplan', subscriptionPlanRouter);


module.exports = router;