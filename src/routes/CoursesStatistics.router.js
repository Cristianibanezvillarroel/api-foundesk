const express = require('express');
const router = express.Router();
const {
    getCoursesStatistics,
    getCoursesStatisticsById,
    getCoursesStatisticsByCourse,
    createCoursesStatistics,
    updateCoursesStatistics,
    deleteCoursesStatistics
} = require('../controllers/CoursesStatistics.controller');

// GET todas las estadísticas de cursos
router.get('/', getCoursesStatistics);

// GET estadísticas por ID
router.get('/:id', getCoursesStatisticsById);

// GET estadísticas por courseId
router.get('/course/:courseId', getCoursesStatisticsByCourse);

// POST crear nuevas estadísticas
router.post('/create', createCoursesStatistics);

// PATCH actualizar estadísticas
router.patch('/update/:id', updateCoursesStatistics);

// DELETE eliminar estadísticas
router.delete('/delete/:id', deleteCoursesStatistics);

module.exports = router;
