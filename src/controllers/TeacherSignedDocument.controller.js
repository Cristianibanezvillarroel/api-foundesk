const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const { generateSHA256 } = require('../utils/hash')
const TeacherSignedDocument = require('../models/TeacherSignedDocument.model')

// Ruta absoluta para almacenamiento de documentos legales
// IMPORTANTE: Esta ruta debe estar FUERA del proyecto para no perderse en actualizaciones
const LEGAL_STORAGE_PATH = process.env.LEGAL_STORAGE_PATH || path.join(process.cwd(), 'storage', 'legal')

// ============================================
// FUNCIÓN AUXILIAR: Generar hash de firma individual
// ============================================
/**
 * Genera un hash SHA-256 único para una firma específica
 * @param {Object} signatureData - Datos de la firma
 * @returns {String} Hash SHA-256 de la firma
 */
const generateSignatureHash = (signatureData) => {
  const signatureString = JSON.stringify({
    fullName: signatureData.fullName,
    rut: signatureData.rut,
    acceptedAt: signatureData.acceptedAt,
    role: signatureData.role
  })
  return generateSHA256(signatureString)
}

// ============================================
// FUNCIÓN AUXILIAR: Generar PDF firmado
// ============================================
const generateSignedPDF = async ({
  html,
  teacherId,
  documentType,
  documentVersion,
  signature,
  signatures // Array de firmas para soporte multi-firma
}) => {
  let browser = null

  try {
    // Asegurar que el directorio existe
    if (!fs.existsSync(LEGAL_STORAGE_PATH)) {
      fs.mkdirSync(LEGAL_STORAGE_PATH, { recursive: true })
    }

    // 1. Determinar qué firmas usar (compatibilidad con formato antiguo)
    const signaturesArray = signatures || (signature ? [signature] : [])
    
    if (signaturesArray.length === 0) {
      throw new Error('Se requiere al menos una firma para generar el PDF')
    }

    // 2. Crear agreementData con todas las firmas
    const agreementData = JSON.stringify({
      html,
      teacherId,
      documentVersion,
      signatures: signaturesArray.map(sig => ({
        fullName: sig.fullName,
        rut: sig.rut,
        acceptedAt: sig.acceptedAt,
        role: sig.role
      }))
    })

    // 3. Generar el hash del acuerdo (Este es el que irá en el Footer)
    const agreementHash = generateSHA256(agreementData)

    // Validar que el hash se generó correctamente
    if (!agreementHash) {
      throw new Error('No se pudo generar el hash del acuerdo')
    }

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--single-process' // Útil en ambientes con recursos limitados
      ],
      executablePath: process.env.CHROME_PATH || puppeteer.executablePath(),
      ignoreDefaultArgs: ['--disable-extensions']
    })

    const page = await browser.newPage()
    
    // Configurar timeout más largo para la página
    page.setDefaultNavigationTimeout(60000)
    page.setDefaultTimeout(60000)
    
    // Aumentar timeout y usar waitUntil más permisivo para evitar timeout
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    })
    
    // Pequeño delay para asegurar que el contenido está listo
    await new Promise(resolve => setTimeout(resolve, 1000))

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate: `
    <div style="font-size: 8px; width: 100%; text-align: center; color: #555; font-family: sans-serif; border-top: 1px solid #ccc; padding-top: 5px;">
      Documento firmado electrónicamente en Foundesk.cl <br />
      <b>ID de Verificación (Hash):</b> ${agreementHash} <br />
      <b>Firmas:</b> ${signaturesArray.map(sig => `${sig.role.toUpperCase()} (${sig.rut})`).join(' | ')} <br />
      <b>Fecha Generación PDF:</b> ${new Date().toLocaleString('es-CL')}
    </div>`,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm'
      }
    })

    const hash = generateSHA256(pdfBuffer)
    const timestamp = Date.now()
    const fileName = `${documentType}_v${documentVersion}_${teacherId}_${timestamp}.pdf`
    const filePath = path.join(LEGAL_STORAGE_PATH, fileName)

    fs.writeFileSync(filePath, pdfBuffer)

    return {
      filePath,
      fileName,
      hash,
      agreementHash
    }
  } catch (error) {
    throw new Error(`Error generando PDF: ${error.message}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// ============================================
// CREATE: Crear documento firmado (Genera PDF + Guarda en BD)
// ============================================
const createTeacherSignedDocument = async (req, res) => {
  let generatedFilePath = null

  try {

    // Obtener la IP real del cliente
    // req.headers['x-forwarded-for'] es usado cuando pasas por Nginx
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      req.ip;

    const {
      html,
      teacher,
      documentType,
      documentVersion,
      signature,
      metadata,
      status
    } = req.body

    // Validaciones básicas
    if (!html || !teacher || !documentType || !documentVersion) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: html, teacher, documentType, documentVersion'
      })
    }

    // Si hay firma, validarla
    if (signature) {
      if (!signature.fullName || !signature.rut || !signature.acceptedAt) {
        return res.status(400).json({
          message: 'La firma debe incluir: fullName, rut, acceptedAt'
        })
      }
    }

    // Verificar si ya existe un documento activo del mismo tipo para este instructor
    const existingDoc = await TeacherSignedDocument.findOne({
      teacher,
      documentType,
      status: 'active'
    })

    if (existingDoc) {
      // Validar versión del documento
      if (existingDoc.documentVersion === documentVersion) {
        // Si la versión es la misma, no permitir firmar de nuevo
        return res.status(409).json({
          message: `Ya existe un documento firmado para la versión ${documentVersion}. No se puede volver a firmar el mismo documento.`,
          existingDocument: {
            _id: existingDoc._id,
            documentVersion: existingDoc.documentVersion,
            signedAt: existingDoc.signature.acceptedAt
          }
        })
      }

      // Si la versión del frontend es superior, marcar el anterior como superseded
      if (parseFloat(documentVersion) > parseFloat(existingDoc.documentVersion)) {
        await TeacherSignedDocument.updateOne(
          { _id: existingDoc._id },
          { $set: { status: 'superseded' } }
        );
      } else {
        // Si la versión del frontend es inferior a la existente
        return res.status(400).json({
          message: `La versión ${documentVersion} es inferior a la versión activa ${existingDoc.documentVersion}. No se puede firmar una versión anterior.`,
          currentVersion: existingDoc.documentVersion
        })
      }
    }

    // 1. Generar el PDF con firma (puede ser admin o instructor según tipo de documento)
    let filePath, fileName, hash, agreementHash
    
    if (signature) {
      // Determinar el rol según el tipo de documento
      let signatureRole = 'admin' // Por defecto admin
      let documentStatus = 'pending_teacher_signature' // Por defecto espera firma del teacher
      
      // Para documentos de principios, el instructor firma directamente
      if (documentType === 'teacher_principles') {
        signatureRole = 'instructor'
        documentStatus = 'active' // Ya está activo con una sola firma
        
        // Marcar documentos anteriores del mismo tipo como superseded
        await TeacherSignedDocument.updateMany(
          { 
            teacher,
            documentType: 'teacher_principles',
            status: 'active'
          },
          { $set: { status: 'superseded' } }
        )
      }
      
      // Crear objeto de firma con hash individual
      const documentSignature = {
        fullName: signature.fullName,
        rut: signature.rut,
        acceptedAt: signature.acceptedAt,
        role: signature.role || signatureRole,
        signatureHash: generateSignatureHash({
          fullName: signature.fullName,
          rut: signature.rut,
          acceptedAt: signature.acceptedAt,
          role: signature.role || signatureRole
        }),
        ip: clientIp,
        userAgent: req.headers['user-agent']
      }

      // Documento con firma: generar PDF completo
      const pdfData = await generateSignedPDF({
        html,
        teacherId: teacher,
        documentType,
        documentVersion,
        signatures: [documentSignature] // Array con la firma
      })
      filePath = pdfData.filePath
      fileName = pdfData.fileName
      hash = pdfData.hash
      agreementHash = pdfData.agreementHash
      generatedFilePath = filePath

      // Validar que todos los valores necesarios fueron generados
      if (!agreementHash) {
        throw new Error('El agreementHash no fue generado correctamente')
      }
      if (!hash) {
        throw new Error('El hash del documento no fue generado correctamente')
      }

      console.log('Document generated with signature:', {
        documentHash: hash,
        agreementHash,
        fileName,
        role: signatureRole,
        signatureHash: documentSignature.signatureHash
      })
    } else {
      // Documento sin firma (pending): generar hash temporal del HTML
      hash = generateSHA256(html)
      const timestamp = Date.now()
      fileName = `${documentType}_v${documentVersion}_${teacher}_${timestamp}_pending.pdf`
      filePath = path.join(LEGAL_STORAGE_PATH, fileName)
      
      // Generar PDF temporal sin firma
      const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process'
        ],
        executablePath: process.env.CHROME_PATH || puppeteer.executablePath()
      })
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
      })
      fs.writeFileSync(filePath, pdfBuffer)
      await browser.close()
      
      generatedFilePath = filePath
    }

    // 2. Preparar agreementData para guardado (solo si hay firma)
    let agreementData = null
    if (signature) {
      agreementData = {
        html,
        teacherId: teacher,
        documentVersion,
        signatures: [{
          fullName: signature.fullName,
          rut: signature.rut,
          acceptedAt: signature.acceptedAt,
          role: signature.role || (documentType === 'teacher_principles' ? 'instructor' : 'admin')
        }]
      }
    }

    // 3. Crear el registro en la BD
    const documentData = {
      teacher,
      documentType,
      documentVersion,
      documentHash: hash,
      html, // Guardar HTML para regenerar PDF al firmar
      pdfPath: filePath,
      metadata: {
        ...metadata,
        ip: clientIp,
        userAgent: req.headers['user-agent']
      },
      status: status || (signature ? 
        (documentType === 'teacher_principles' ? 'active' : 'pending_teacher_signature') 
        : 'pending')
    }

    // Agregar campos opcionales solo si existen
    if (agreementHash) documentData.agreementHash = agreementHash
    if (agreementData) documentData.agreementData = agreementData
    if (signature) {
      // Determinar el rol según el tipo de documento
      const signatureRole = signature.role || (documentType === 'teacher_principles' ? 'instructor' : 'admin')
      
      // Guardar firma en el array signatures
      documentData.signatures = [{
        fullName: signature.fullName,
        rut: signature.rut,
        acceptedAt: new Date(signature.acceptedAt),
        role: signatureRole,
        signatureHash: generateSignatureHash({
          fullName: signature.fullName,
          rut: signature.rut,
          acceptedAt: signature.acceptedAt,
          role: signatureRole
        }),
        ip: clientIp,
        userAgent: req.headers['user-agent']
      }]
    }

    const document = new TeacherSignedDocument(documentData)
    await document.save()

    // Populate para devolver información completa
    await document.populate('teacher')

    res.status(201).json({
      message: 'Documento firmado creado exitosamente',
      document,
      fileName
    })

  } catch (error) {
    // Rollback: Si falló el guardado en BD, eliminar el PDF generado
    if (generatedFilePath && fs.existsSync(generatedFilePath)) {
      try {
        fs.unlinkSync(generatedFilePath)
      } catch (unlinkError) {
        console.error('Error eliminando archivo tras fallo:', unlinkError)
      }
    }

    res.status(500).json({
      message: 'Error al crear el documento firmado',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener todos los documentos firmados
// ============================================
const getTeacherSignedDocuments = async (req, res) => {
  try {
    const { status, documentType } = req.query

    // Construir filtro dinámico
    const filter = {}
    if (status) filter.status = status
    if (documentType) filter.documentType = documentType

    const documents = await TeacherSignedDocument.find(filter)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      message: 'Documentos firmados encontrados',
      count: documents.length,
      documents
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener documentos firmados',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener un documento firmado por ID
// ============================================
const getTeacherSignedDocumentById = async (req, res) => {
  try {
    const { id } = req.params
    const document = await TeacherSignedDocument.findById(id)
      .populate('teacher', 'name email rut')

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    res.json({
      message: 'Documento firmado encontrado',
      document
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el documento firmado',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener documentos firmados por instructor
// ============================================
const getTeacherSignedDocumentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params
    const { status } = req.query

    const filter = { teacher: teacherId }
    if (status) filter.status = status

    const documents = await TeacherSignedDocument.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      message: 'Documentos del instructor encontrados',
      count: documents.length,
      documents
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener documentos del instructor',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener el documento activo más reciente por instructor y tipo
// ============================================
const getActiveDocumentByTeacherAndType = async (req, res) => {
  try {
    const { teacherId, documentType } = req.params

    const document = await TeacherSignedDocument.findOne({
      teacher: teacherId,
      documentType,
      status: 'active'
    })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })

    if (!document) {
      return res.status(404).json({
        message: 'No se encontró documento activo para este instructor y tipo'
      })
    }

    res.json({
      message: 'Documento activo encontrado',
      document
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener documento activo',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener el documento pendiente de firma por instructor y tipo
// ============================================
const getPendingDocumentByTeacherAndType = async (req, res) => {
  try {
    const { teacherId, documentType } = req.params

    const document = await TeacherSignedDocument.findOne({
      teacher: teacherId,
      documentType,
      status: 'pending_teacher_signature'
    })
      .populate('teacher', 'name email rut')
      .sort({ createdAt: -1 })

    if (!document) {
      return res.status(404).json({
        message: 'No se encontró documento pendiente de firma para este instructor y tipo'
      })
    }

    res.json({
      message: 'Documento pendiente de firma encontrado',
      document
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener documento pendiente',
      detail: error.message
    })
  }
}

// ============================================
// READ: Obtener documentos firmados por tipo
// ============================================
const getTeacherSignedDocumentsByType = async (req, res) => {
  try {
    const { documentType } = req.params
    const { status } = req.query

    const filter = { documentType }
    if (status) filter.status = status

    const documents = await TeacherSignedDocument.find(filter)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      message: 'Documentos por tipo encontrados',
      count: documents.length,
      documents
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener documentos por tipo',
      detail: error.message
    })
  }
}

// ============================================
// READ: Descargar PDF del documento
// ============================================
const downloadTeacherSignedDocument = async (req, res) => {
  try {
    const { id } = req.params
    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    if (!fs.existsSync(document.pdfPath)) {
      return res.status(404).json({
        message: 'El archivo PDF no existe en el servidor'
      })
    }

    const fileName = path.basename(document.pdfPath)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    const fileStream = fs.createReadStream(document.pdfPath)
    fileStream.pipe(res)

  } catch (error) {
    res.status(500).json({
      message: 'Error al descargar el documento',
      detail: error.message
    })
  }
}

// ============================================
// UPDATE: Actualizar metadatos de un documento firmado
// ============================================
const updateTeacherSignedDocument = async (req, res) => {
  try {
    const { id } = req.params
    const { metadata } = req.body

    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    // Solo permitir actualizar metadata, no campos críticos
    if (metadata) {
      document.metadata = { ...document.metadata, ...metadata }
      await document.save()
    }

    await document.populate('teacher', 'name email')

    res.json({
      message: 'Metadatos del documento actualizados',
      document
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el documento firmado',
      detail: error.message
    })
  }
}

// ============================================
// UPDATE: Cambiar estado de un documento
// ============================================
const updateTeacherSignedDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, reason } = req.body

    if (!['active', 'superseded', 'revoked'].includes(status)) {
      return res.status(400).json({
        message: 'Estado inválido. Debe ser: active, superseded o revoked'
      })
    }

    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    // Si se revoca, requerir razón
    if (status === 'revoked' && !reason) {
      return res.status(400).json({
        message: 'Se requiere una razón para revocar un documento'
      })
    }

    const previousStatus = document.status
    document.status = status

    // Guardar razón en metadata si se proporciona
    if (reason) {
      document.metadata = {
        ...document.metadata,
        statusChangeReason: reason,
        statusChangedAt: new Date(),
        previousStatus
      }
    }

    await document.save()
    await document.populate('teacher', 'name email')

    res.json({
      message: `Estado del documento cambiado de ${previousStatus} a ${status}`,
      document
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al cambiar el estado del documento',
      detail: error.message
    })
  }
}

// ============================================
// UPDATE: Firmar documento (agregar firma del instructor)
// ============================================
/**
 * Firmar un documento pendiente
 * Agrega la firma del instructor (segunda firma) a un documento previamente firmado por admin
 */
const signTeacherDocument = async (req, res) => {
  let newPdfPath = null
  
  try {
    const { id } = req.params
    const { signature, status, metadata } = req.body

    // Obtener la IP real del cliente
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      req.ip

    // Validar que se proporcione la firma
    if (!signature || !signature.fullName || !signature.rut || !signature.acceptedAt) {
      return res.status(400).json({
        message: 'Datos de firma incompletos. Se requiere: fullName, rut, acceptedAt'
      })
    }

    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    if (!document.html) {
      return res.status(400).json({
        message: 'No se puede firmar este documento porque no tiene el HTML original almacenado'
      })
    }

    // Validar que exista al menos una firma previa (admin)
    if (!document.signatures || document.signatures.length === 0) {
      return res.status(400).json({
        message: 'Este documento no tiene firma del administrador. Debe ser creado primero por un admin.'
      })
    }

    // Crear objeto de firma del instructor con hash individual
    const instructorSignature = {
      fullName: signature.fullName,
      rut: signature.rut,
      acceptedAt: signature.acceptedAt,
      role: 'instructor',
      signatureHash: generateSignatureHash({
        fullName: signature.fullName,
        rut: signature.rut,
        acceptedAt: signature.acceptedAt,
        role: 'instructor'
      }),
      ip: clientIp,
      userAgent: req.headers['user-agent']
    }

    // Combinar firmas existentes con la nueva firma del instructor
    const allSignatures = [...document.signatures, instructorSignature]

    // Regenerar el PDF con TODAS las firmas (admin + instructor)
    const { filePath, fileName, hash, agreementHash } = await generateSignedPDF({
      html: document.html,
      teacherId: document.teacher.toString(),
      documentType: document.documentType,
      documentVersion: document.documentVersion,
      signatures: allSignatures // Array con ambas firmas
    })

    newPdfPath = filePath

    // Eliminar PDF temporal anterior
    if (document.pdfPath && fs.existsSync(document.pdfPath)) {
      try {
        fs.unlinkSync(document.pdfPath)
      } catch (err) {
        console.error('Error eliminando PDF temporal:', err)
      }
    }

    // Preparar agreementData actualizado con ambas firmas
    const agreementData = {
      html: document.html,
      teacherId: document.teacher.toString(),
      documentVersion: document.documentVersion,
      signatures: allSignatures.map(sig => ({
        fullName: sig.fullName,
        rut: sig.rut,
        acceptedAt: sig.acceptedAt,
        role: sig.role
      }))
    }

    // Actualizar documento con ambas firmas
    document.signatures = allSignatures
    document.status = status || 'active'
    document.pdfPath = filePath
    document.documentHash = hash
    document.agreementHash = agreementHash
    document.agreementData = agreementData

    // Actualizar metadata con información de la firma del instructor
    if (metadata) {
      document.metadata = {
        ...document.metadata,
        ...metadata,
        instructorSignedAt: signature.acceptedAt
      }
    }

    await document.save()
    await document.populate('teacher', 'name email')

    console.log('Document signed with instructor signature:', {
      documentHash: hash,
      agreementHash,
      adminSignatureHash: allSignatures[0].signatureHash,
      instructorSignatureHash: instructorSignature.signatureHash,
      totalSignatures: allSignatures.length
    })

    res.json({
      message: 'Documento firmado exitosamente por el instructor',
      document
    })
  } catch (error) {
    // Si hubo error y se generó un PDF nuevo, eliminarlo
    if (newPdfPath && fs.existsSync(newPdfPath)) {
      try {
        fs.unlinkSync(newPdfPath)
      } catch (err) {
        console.error('Error eliminando PDF en rollback:', err)
      }
    }
    
    res.status(500).json({
      message: 'Error al firmar el documento',
      detail: error.message
    })
  }
}

// ============================================
// DELETE: Eliminar un documento firmado (con archivo físico)
// ============================================
const deleteTeacherSignedDocument = async (req, res) => {
  try {
    const { id } = req.params
    const { force } = req.query // ?force=true para eliminación definitiva

    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    // Prevenir eliminación de documentos activos sin force
    if (document.status === 'active' && force !== 'true') {
      return res.status(403).json({
        message: 'No se puede eliminar un documento activo. Use ?force=true para forzar la eliminación o cambie el estado primero.'
      })
    }

    // Eliminar archivo físico si existe
    if (document.pdfPath && fs.existsSync(document.pdfPath)) {
      try {
        fs.unlinkSync(document.pdfPath)
      } catch (fileError) {
        console.error('Error eliminando archivo físico:', fileError)
        // Continuar con la eliminación del registro aunque falle el archivo
      }
    }

    await TeacherSignedDocument.findByIdAndDelete(id)

    res.json({
      message: 'Documento firmado eliminado exitosamente',
      deletedId: id
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el documento firmado',
      detail: error.message
    })
  }
}

// ============================================
// UTILIDAD: Validar firma del documento (hash + agreementHash + firmas individuales)
// ============================================
const validateDocumentSignature = async (req, res) => {
  try {
    const { id } = req.params
    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    if (!fs.existsSync(document.pdfPath)) {
      return res.status(404).json({
        message: 'El archivo PDF no existe en el servidor',
        signatureValidation: 'file_missing'
      })
    }

    const validationResults = {
      documentHashValid: false,
      agreementHashValid: false,
      signaturesValid: [],
      allSignaturesValid: false,
      overallValid: false,
      errors: [],
      warnings: []
    }

    // 1. Validar documentHash (integridad del PDF)
    try {
      const fileBuffer = fs.readFileSync(document.pdfPath)
      const currentDocumentHash = generateSHA256(fileBuffer)
      validationResults.documentHashValid = currentDocumentHash === document.documentHash
      validationResults.storedDocumentHash = document.documentHash
      validationResults.currentDocumentHash = currentDocumentHash

      if (!validationResults.documentHashValid) {
        validationResults.errors.push('El hash del documento PDF no coincide - el archivo ha sido modificado')
      }
    } catch (error) {
      validationResults.errors.push(`Error al validar documentHash: ${error.message}`)
    }

    // 2. Validar cada firma individual
    try {
      if (!document.signatures || document.signatures.length === 0) {
        validationResults.warnings.push('No hay firmas registradas en el documento')
      } else {
        // Validar cada firma
        for (let i = 0; i < document.signatures.length; i++) {
          const signature = document.signatures[i]
          const signatureResult = {
            index: i,
            role: signature.role,
            fullName: signature.fullName,
            rut: signature.rut,
            acceptedAt: signature.acceptedAt,
            storedHash: signature.signatureHash,
            valid: false
          }

          try {
            // Regenerar el hash de esta firma
            const reconstructedHash = generateSignatureHash({
              fullName: signature.fullName,
              rut: signature.rut,
              acceptedAt: signature.acceptedAt,
              role: signature.role
            })

            signatureResult.regeneratedHash = reconstructedHash
            signatureResult.valid = reconstructedHash === signature.signatureHash

            if (!signatureResult.valid) {
              validationResults.errors.push(
                `Firma ${signature.role} (${signature.fullName}): Hash no coincide - datos modificados`
              )
            }
          } catch (err) {
            signatureResult.error = err.message
            validationResults.errors.push(
              `Error validando firma ${signature.role}: ${err.message}`
            )
          }

          validationResults.signaturesValid.push(signatureResult)
        }

        // Verificar que todas las firmas sean válidas
        validationResults.allSignaturesValid = validationResults.signaturesValid.every(s => s.valid)
      }
    } catch (error) {
      validationResults.errors.push(`Error al validar firmas individuales: ${error.message}`)
    }

    // 3. Validar agreementHash (integridad del acuerdo con TODAS las firmas)
    try {
      if (!document.agreementData) {
        validationResults.errors.push('No se encontró agreementData en el documento')
      } else {
        // Reconstruir el agreementData tal como se generó
        // Si tiene múltiples firmas, usar el nuevo formato
        let reconstructedAgreementData
        
        if (document.agreementData.signatures && document.agreementData.signatures.length > 0) {
          // Formato nuevo con array de firmas
          reconstructedAgreementData = JSON.stringify({
            html: document.agreementData.html,
            teacherId: document.agreementData.teacherId,
            documentVersion: document.agreementData.documentVersion,
            signatures: document.agreementData.signatures.map(sig => ({
              fullName: sig.fullName,
              rut: sig.rut,
              acceptedAt: sig.acceptedAt,
              role: sig.role
            }))
          })
        } else {
          // Formato antiguo (compatibilidad hacia atrás)
          reconstructedAgreementData = JSON.stringify({
            html: document.agreementData.html,
            teacherId: document.agreementData.teacherId,
            rut: document.agreementData.rut,
            acceptedAt: document.agreementData.acceptedAt,
            documentVersion: document.agreementData.documentVersion
          })
        }

        const currentAgreementHash = generateSHA256(reconstructedAgreementData)
        validationResults.agreementHashValid = currentAgreementHash === document.agreementHash
        validationResults.storedAgreementHash = document.agreementHash
        validationResults.currentAgreementHash = currentAgreementHash

        if (!validationResults.agreementHashValid) {
          validationResults.errors.push('El hash del acuerdo no coincide - los datos del acuerdo han sido modificados')
        }
      }
    } catch (error) {
      validationResults.errors.push(`Error al validar agreementHash: ${error.message}`)
    }

    // 4. Validación general
    validationResults.overallValid = 
      validationResults.documentHashValid && 
      validationResults.agreementHashValid && 
      validationResults.allSignaturesValid

    // Mensaje detallado
    let message
    if (validationResults.overallValid) {
      const signatureCount = document.signatures?.length || 0
      message = `✓ Documento válido - ${signatureCount} firma(s) verificada(s) - Integridad confirmada`
    } else {
      message = '✗ Documento inválido - Se detectaron inconsistencias en las firmas'
    }

    const responseStatus = validationResults.overallValid ? 200 : 422

    res.status(responseStatus).json({
      message,
      signatureValidation: validationResults.overallValid ? 'valid' : 'invalid',
      ...validationResults,
      document: {
        id: document._id,
        documentType: document.documentType,
        documentVersion: document.documentVersion,
        teacher: document.teacher,
        signatures: document.signatures,
        status: document.status,
        createdAt: document.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al validar la firma del documento',
      detail: error.message
    })
  }
}

// ============================================
// UTILIDAD: Verificar integridad del documento (hash)
// ============================================
const verifyDocumentIntegrity = async (req, res) => {
  try {
    const { id } = req.params
    const document = await TeacherSignedDocument.findById(id)

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' })
    }

    if (!fs.existsSync(document.pdfPath)) {
      return res.status(404).json({
        message: 'El archivo PDF no existe en el servidor',
        integrity: 'file_missing'
      })
    }

    // Leer el archivo y calcular su hash actual
    const fileBuffer = fs.readFileSync(document.pdfPath)
    const currentHash = generateSHA256(fileBuffer)

    const isValid = currentHash === document.documentHash

    res.json({
      message: isValid ? 'El documento es íntegro' : 'El documento ha sido modificado',
      integrity: isValid ? 'valid' : 'invalid',
      storedHash: document.documentHash,
      currentHash,
      document: {
        id: document._id,
        documentType: document.documentType,
        documentVersion: document.documentVersion,
        createdAt: document.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al verificar integridad del documento',
      detail: error.message
    })
  }
}

// ============================================
// EXPORTS
// ============================================
module.exports = {
  // Funciones auxiliares (disponibles para uso interno)
  generateSignedPDF,
  generateSignatureHash,

  // CRUD Operations
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

  // Utilidades
  validateDocumentSignature,
  verifyDocumentIntegrity
}
