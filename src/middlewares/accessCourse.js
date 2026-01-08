const CoursesOffering = require('../models/CoursesOffering')
const UserSubscription = require('../models/UserSubscription')
const UserCoursesPurchase = require('../models/UserCoursesPurchase')
const EnterpriseUser = require('../models/EnterpriseUser')

module.exports = async function accessCourse(req, res, next) {
  try {
    const { courseId } = req.params
    const user = req.user

    const offerings = await CoursesOffering.find({
      course: courseId,
      status: 'active'
    })

    if (!offerings.length) {
      return res.status(403).json({ message: 'Curso no disponible' })
    }

    for (const offering of offerings) {

      // 🔓 Free
      if (offering.accessType === 'free') {
        return next()
      }

      // 💰 Compra única
      if (offering.accessType === 'one_time') {
        const purchased = await UserCoursesPurchase.exists({
          user: user._id,
          course: courseId
        })
        if (purchased) return next()
      }

      // 🔁 Suscripción
      if (offering.accessType === 'subscription') {
        const subscription = await UserSubscription.findOne({
          user: user._id,
          status: 'active'
        })

        if (
          subscription &&
          (
            !offering.subscriptionPlans?.length ||
            offering.subscriptionPlans.includes(subscription.plan)
          )
        ) {
          return next()
        }
      }

      // 🏢 Enterprise
      if (offering.accessType === 'enterprise') {
        const enterpriseUser = await EnterpriseUser.findOne({
          user: user._id,
          status: 'active'
        })
        if (enterpriseUser) return next()
      }
    }

    // ❌ Ningún offering aplicó
    return res.status(403).json({ message: 'No tienes acceso a este curso' })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error de validación de acceso' })
  }
}

