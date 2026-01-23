const express = require('express')
const router = express.Router()
const {
  getAllVersions,
  getActiveVersion,
  getVersionById,
  createVersion,
  updateVersion,
  activateVersion,
  deleteVersion
} = require('../controllers/DocMainPrinciples.controller')
const auth = require('../middlewares/authorization')

// Rutas públicas (para obtener versión activa - usada por instructores)
router.get('/active', getActiveVersion)

// Rutas protegidas (solo administradores)
router.get('/', auth, getAllVersions)
router.get('/:id', auth, getVersionById)
router.post('/', auth, createVersion)
router.patch('/:id', auth, updateVersion)
router.patch('/:id/activate', auth, activateVersion)
router.delete('/:id', auth, deleteVersion)

module.exports = router
