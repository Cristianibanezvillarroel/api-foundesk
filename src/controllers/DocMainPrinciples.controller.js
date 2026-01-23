const DocMainPrinciples = require('../models/DocMainPrinciples.model')

/**
 * Obtener todas las versiones de la Declaración de Principios
 */
const getAllVersions = async (req, res) => {
  try {
    const versions = await DocMainPrinciples.find()
      .populate('createdBy', 'name lastname email')
      .populate('updatedBy', 'name lastname email')
      .sort({ versionDate: -1 })

    return res.json({
      message: 'Versiones obtenidas exitosamente',
      items: versions
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener versiones',
      detail: error.message
    })
  }
}

/**
 * Obtener la versión activa de la Declaración de Principios
 */
const getActiveVersion = async (req, res) => {
  try {
    const activeVersion = await DocMainPrinciples.findOne({ status: 'active' })
      .populate('createdBy', 'name lastname email')
      .populate('updatedBy', 'name lastname email')
      .sort({ versionDate: -1 })

    if (!activeVersion) {
      return res.status(404).json({
        message: 'No hay versión activa de la Declaración de Principios',
        detail: null
      })
    }

    return res.json({
      message: 'Versión activa obtenida exitosamente',
      detail: activeVersion
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener versión activa',
      detail: error.message
    })
  }
}

/**
 * Obtener una versión específica por ID
 */
const getVersionById = async (req, res) => {
  try {
    const { id } = req.params

    const version = await DocMainPrinciples.findById(id)
      .populate('createdBy', 'name lastname email')
      .populate('updatedBy', 'name lastname email')

    if (!version) {
      return res.status(404).json({
        message: 'Versión no encontrada',
        detail: null
      })
    }

    return res.json({
      message: 'Versión obtenida exitosamente',
      detail: version
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener versión',
      detail: error.message
    })
  }
}

/**
 * Crear una nueva versión de la Declaración de Principios
 */
const createVersion = async (req, res) => {
  try {
    const {
      version,
      description,
      clauses,
      notes
    } = req.body

    // Validar que no exista ya una versión con el mismo número
    const existingVersion = await DocMainPrinciples.findOne({ version })
    if (existingVersion) {
      return res.status(400).json({
        message: 'Ya existe una versión con ese número',
        detail: null
      })
    }

    // Crear la nueva versión
    const newVersion = new DocMainPrinciples({
      version,
      description,
      clauses: clauses || [],
      notes,
      status: 'draft',
      createdBy: req.user?._id
    })

    await newVersion.save()

    return res.status(201).json({
      message: 'Versión creada exitosamente',
      detail: newVersion
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear versión',
      detail: error.message
    })
  }
}

/**
 * Actualizar una versión existente
 */
const updateVersion = async (req, res) => {
  try {
    const { id } = req.params
    const {
      version,
      description,
      clauses,
      notes,
      status
    } = req.body

    console.log('📝 UPDATE PRINCIPLES VERSION - Clauses received:', {
      clausesType: Array.isArray(clauses) ? 'array' : typeof clauses,
      clausesLength: clauses?.length,
      hasClauses: !!clauses
    })

    const existingVersion = await DocMainPrinciples.findById(id)
    if (!existingVersion) {
      return res.status(404).json({
        message: 'Versión no encontrada',
        detail: null
      })
    }

    // No permitir editar versiones activas
    if (existingVersion.status === 'active' && status !== 'active') {
      return res.status(400).json({
        message: 'No se puede modificar el estado de una versión activa. Use la función de activar/desactivar.',
        detail: null
      })
    }

    // Actualizar campos
    if (version) existingVersion.version = version
    if (description) existingVersion.description = description
    if (clauses !== undefined) existingVersion.clauses = clauses
    if (notes !== undefined) existingVersion.notes = notes
    if (status) existingVersion.status = status
    existingVersion.updatedBy = req.user?._id

    await existingVersion.save()

    return res.json({
      message: 'Versión actualizada exitosamente',
      detail: existingVersion
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar versión',
      detail: error.message
    })
  }
}

/**
 * Activar una versión específica (y desactivar las demás)
 */
const activateVersion = async (req, res) => {
  try {
    const { id } = req.params

    const version = await DocMainPrinciples.findById(id)
    if (!version) {
      return res.status(404).json({
        message: 'Versión no encontrada',
        detail: null
      })
    }

    // Usar el método activate del modelo
    await version.activate()

    return res.json({
      message: 'Versión activada exitosamente',
      detail: version
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al activar versión',
      detail: error.message
    })
  }
}

/**
 * Eliminar una versión (solo si no está activa)
 */
const deleteVersion = async (req, res) => {
  try {
    const { id } = req.params

    const version = await DocMainPrinciples.findById(id)
    if (!version) {
      return res.status(404).json({
        message: 'Versión no encontrada',
        detail: null
      })
    }

    if (version.status === 'active') {
      return res.status(400).json({
        message: 'No se puede eliminar una versión activa',
        detail: null
      })
    }

    await DocMainPrinciples.findByIdAndDelete(id)

    return res.json({
      message: 'Versión eliminada exitosamente',
      detail: null
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar versión',
      detail: error.message
    })
  }
}

module.exports = {
  getAllVersions,
  getActiveVersion,
  getVersionById,
  createVersion,
  updateVersion,
  activateVersion,
  deleteVersion
}
