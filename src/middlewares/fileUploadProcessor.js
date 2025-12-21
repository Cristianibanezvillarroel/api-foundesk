const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Función para generar hash y estructura de carpetas
const generateFolderPath = (userId, baseFolder) => {
  const hash = crypto.createHash('md5').update(userId.toString()).digest('hex');
  const folderPath = path.join(baseFolder, hash[0], hash[1], hash[2]);
  
  // Crear carpetas recursivamente si no existen
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  return folderPath;
};

// Directorios donde se guardarán los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Validar que req.user esté disponible (viene del middleware auth)
    if (!req.user) {
      return cb(new Error("Usuario no autenticado"), null);
    }

    const userId = req.user;
    let folderPath;

    try {
      if (file.fieldname === 'cv') {
        folderPath = generateFolderPath(userId, 'uploads/cv');
      } else if (file.fieldname === 'photo') {
        folderPath = generateFolderPath(userId, 'uploads/photo');
      } else if (file.fieldname === 'imagecourse') {
        folderPath = generateFolderPath(userId, 'uploads/imagecourse');
      } else if (file.fieldname === 'downloadable') {
        folderPath = generateFolderPath(userId, 'uploads/downloadable');
      } else {
        return cb(new Error("Campo de archivo no permitido"), null);
      }

      // Guardar la ruta en req para uso posterior
      if (!req.uploadPaths) req.uploadPaths = {};
      req.uploadPaths[file.fieldname] = folderPath;

      cb(null, folderPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + path.extname(file.originalname);
    
    // Guardar el nombre de archivo en req para uso posterior
    if (!req.uploadFilenames) req.uploadFilenames = {};
    req.uploadFilenames[file.fieldname] = filename;
    
    cb(null, filename);
  }
});

// Validación de tipo y peso:
function fileFilter(req, file, cb) {

  if (file.fieldname === 'cv') {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error("El CV debe ser un PDF"));
    }
  }

  if (file.fieldname === 'photo') {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error("La foto debe ser JPG o PNG"));
    }
  }

  if (file.fieldname === 'imagecourse') {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error("La imagen del curso debe ser JPG o PNG"));
    }
  }

  if (file.fieldname === 'downloadable') {
    // Permitir múltiples tipos para downloadable
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.ms-excel', // XLS
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'application/vnd.ms-powerpoint', // PPT
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
      'application/zip', // ZIP
      'application/x-rar-compressed', // RAR
      'application/vnd.rar', // RAR alternativo
      'image/jpeg',
      'image/png'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Los recursos deben ser PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, JPG o PNG"));
    }
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: function (req, file, cb) {
      // No se permite aquí, se resuelve abajo
      cb(null, true);
    }
  }
}).fields([
  { name: 'cv', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'imagecourse', maxCount: 1 },
  { name: 'downloadable', maxCount: 10 }
]);

// Middleware final que aplica límites por tipo
module.exports = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    // Validación de tamaño por tipo de archivo (solo si hay archivos)
    if (req.files) {
      if (req.files.cv && req.files.cv[0].size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "El CV no debe superar los 2 MB" });
      }

      if (req.files.photo && req.files.photo[0].size > 1 * 1024 * 1024) {
        return res.status(400).json({ message: "La foto no debe superar 1 MB" });
      }

      if (req.files.imagecourse && req.files.imagecourse[0].size > 1 * 1024 * 1024) {
        return res.status(400).json({ message: "La imagen del curso no debe superar 1 MB" });
      }

      if (req.files.downloadable) {
        for (let file of req.files.downloadable) {
          if (file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: "Los archivos descargables no deben superar 2 MB cada uno" });
          }
        }
      }

      // Agregar información de rutas completas al request
      req.uploadedFiles = {};
      Object.keys(req.files).forEach(fieldname => {
        req.uploadedFiles[fieldname] = req.files[fieldname].map(file => ({
          path: file.path.replace(/\\/g, '/'), // Normalizar rutas de Windows a formato universal
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname
        }));
      });
    }
    next();
  });
}