const CoursesStatistics = require('../models/CoursesStatistics.model')

const getCoursesStatistics = async (req, res) => {
    try {
        const resp = await CoursesStatistics.find()
            .populate('course'); // Populate para obtener detalles del curso relacionado

        return res.json([{
            message: 'Courses Statistics',
            items: resp
        }])
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const getCoursesStatisticsById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await CoursesStatistics.findById(id)
            .populate('course');

        if (!resp) {
            return res.json({
                message: 'Courses Statistics not found'
            })
        }

        return res.json({
            message: 'Courses Statistics found',
            detail: resp
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const getCoursesStatisticsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const resp = await CoursesStatistics.findOne({ courses: courseId })
            .populate('courses');

        if (!resp) {
            return res.json({
                message: 'Courses Statistics not found for this course'
            })
        }

        return res.json({
            message: 'Courses Statistics found',
            detail: resp
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const createCoursesStatistics = async (req, res) => {
    try {
        const { course, hours, resources, faqs, rating, assessments, students } = req.body;

        const coursesStatistics = new CoursesStatistics({
            course,
            hours,
            resources,
            faqs,
            rating,
            assessments,
            students
        })

        await coursesStatistics.save()

        return res.json({
            message: 'Courses Statistics created',
            detail: coursesStatistics
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const updateCoursesStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const { hours, resources, faqs, rating, assessments, students } = req.body;

        const updated = await CoursesStatistics.findByIdAndUpdate(
            id,
            {
                hours,
                resources,
                faqs,
                rating,
                assessments,
                students,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('course');

        if (!updated) {
            return res.json({
                message: 'Courses Statistics not found'
            })
        }

        return res.json({
            message: 'Courses Statistics updated',
            detail: updated
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const deleteCoursesStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CoursesStatistics.findByIdAndDelete(id);

        if (!deleted) {
            return res.json({
                message: 'Courses Statistics not found'
            })
        }

        return res.json({
            message: 'Courses Statistics deleted'
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

module.exports = {
    getCoursesStatistics,
    getCoursesStatisticsById,
    getCoursesStatisticsByCourse,
    createCoursesStatistics,
    updateCoursesStatistics,
    deleteCoursesStatistics
}