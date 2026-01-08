const UserInvoice = require('../models/UserInvoice.model')

// Crear o actualizar datos de facturación
const createOrUpdateUserInvoice = async (req, res) => {
    const user = req.user;
  try {
    const userId = user
    const {
      invoiceType,
      name,
      lastname,
      rut,
      email,
      phone,
      address,
      city,
      country,
      businessName,
      businessRut,
      businessAddress,
      businessCity,
      businessCountry
    } = req.body

    // Validaciones básicas
    if (!invoiceType || (invoiceType !== 'boleta' && invoiceType !== 'factura')) {
      return res.status(400).json({
        message: 'Tipo de facturación inválido'
      })
    }

    // Buscar si ya existe registro para este usuario
    let userInvoice = await UserInvoice.findOne({ userId })

    if (userInvoice) {
      // Actualizar existente
      Object.assign(userInvoice, {
        invoiceType,
        name,
        lastname,
        rut,
        email,
        phone,
        address,
        city,
        country,
        businessName,
        businessRut,
        businessAddress,
        businessCity,
        businessCountry,
        updatedAt: Date.now()
      })
    } else {
      // Crear nuevo
      userInvoice = new UserInvoice({
        userId,
        invoiceType,
        name,
        lastname,
        rut,
        email,
        phone,
        address,
        city,
        country,
        businessName,
        businessRut,
        businessAddress,
        businessCity,
        businessCountry
      })
    }

    await userInvoice.save()

    return res.json({
      message: 'Datos de facturación guardados exitosamente',
      detail: userInvoice
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al guardar datos de facturación',
      detail: error.message
    })
  }
}

// Obtener datos de facturación del usuario
const getUserInvoice = async (req, res) => {
  try {
    const userId = req.user

    const userInvoice = await UserInvoice.findOne({ userId })

    if (!userInvoice) {
      return res.status(404).json({
        message: 'No se encontraron datos de facturación',
        detail: null
      })
    }

    return res.json({
      message: 'Datos de facturación obtenidos',
      detail: userInvoice
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener datos de facturación',
      detail: error.message
    })
  }
}

// Eliminar datos de facturación
const deleteUserInvoice = async (req, res) => {
  try {
    const userId = req.user._id

    const result = await UserInvoice.findOneAndDelete({ userId })

    if (!result) {
      return res.status(404).json({
        message: 'No se encontraron datos de facturación para eliminar'
      })
    }

    return res.json({
      message: 'Datos de facturación eliminados exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar datos de facturación',
      detail: error.message
    })
  }
}

module.exports = {
  createOrUpdateUserInvoice,
  getUserInvoice,
  deleteUserInvoice
}
