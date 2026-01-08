const express = require('express'),
router = express.Router(),
{
  createTeacherSignedDocument,
  getTeacherSignedDocuments,
  getTeacherSignedDocumentById,
  getTeacherSignedDocumentsByTeacher,
  getTeacherSignedDocumentsByType,
  getActiveDocumentByTeacherAndType,
  getPendingDocumentByTeacherAndType,
  downloadTeacherSignedDocument,
  updateTeacherSignedDocument,
  updateTeacherSignedDocumentStatus,
  signTeacherDocument,
  deleteTeacherSignedDocument,
  validateDocumentSignature,
  verifyDocumentIntegrity
} = require('../controllers/TeacherSignedDocument.controller'),
auth = require('../middlewares/authorization');

// ============================================
// CREATE: Crear documento firmado
// ============================================
router.post('/create', auth, createTeacherSignedDocument)

// ============================================
// READ: Obtener documentos
// ============================================
// Obtener todos los documentos (con filtros opcionales por query)
router.get('/', auth, getTeacherSignedDocuments)

// Obtener documento por ID
router.get('/:id', auth, getTeacherSignedDocumentById)

// Obtener documentos por instructor
router.get('/teacher/:teacherId', auth, getTeacherSignedDocumentsByTeacher)

// Obtener documentos por tipo
router.get('/type/:documentType', auth, getTeacherSignedDocumentsByType)

// Obtener documento activo por instructor y tipo
router.get('/active/:teacherId/:documentType', auth, getActiveDocumentByTeacherAndType)

// Obtener documento pendiente de firma por instructor y tipo
router.get('/pending/:teacherId/:documentType', auth, getPendingDocumentByTeacherAndType)

// Descargar PDF del documento
router.get('/download/:id', auth, downloadTeacherSignedDocument)

// ============================================
// UPDATE: Actualizar documentos
// ============================================
// Actualizar metadatos de un documento
router.patch('/update/:id', auth, updateTeacherSignedDocument)

// Firmar un documento pendiente (agregar firma del instructor)
router.patch('/sign/:id', auth, signTeacherDocument)

// Cambiar estado de un documento
router.patch('/status/:id', auth, updateTeacherSignedDocumentStatus)

// ============================================
// DELETE: Eliminar documento
// ============================================
router.delete('/delete/:id', auth, deleteTeacherSignedDocument)

// ============================================
// UTILIDADES
// ============================================
// Validar firma del documento (hash + agreementHash)
router.get('/validate/:id', auth, validateDocumentSignature)

// Verificar integridad del documento (hash)
router.get('/verify/:id', auth, verifyDocumentIntegrity)

module.exports = router
