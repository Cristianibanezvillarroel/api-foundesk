const CoursesDownloadable = require('../models/CoursesDownloadable.model');
const fs = require('fs');

// Crear un recurso descargable para un curso
const createDownloadable = async (req, res) => {
    try {
        const downloadable = new CoursesDownloadable(req.body);
        await downloadable.save();
        res.status(201).json({ message: 'Recurso descargable creado exitosamente', downloadable });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el recurso descargable', detail: error.message });
    }
};

// Obtener un recurso descargable por ID
const getDownloadableById = async (req, res) => {
    try {
        const { id } = req.params;
        const downloadable = await CoursesDownloadable.findById(id)
        .populate('courses')
        .populate('coursesSectionsLessons');
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        res.json({ message: 'Recurso descargable encontrado', downloadable });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el recurso descargable', detail: error.message });
    }
};

// Actualizar un recurso descargable
const updateDownloadable = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses, ...updateFields } = req.body;
        const downloadable = await CoursesDownloadable.findById(id);
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        if (String(downloadable.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este recurso' });
        }
        const updated = await CoursesDownloadable.findByIdAndUpdate(id, { ...updateFields, updatedAt: Date.now() }, { new: true });
        res.json({ message: 'Recurso descargable actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el recurso descargable', detail: error.message });
    }
};

// Eliminar un recurso descargable
const deleteDownloadable = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses } = req.body;
        const downloadable = await CoursesDownloadable.findById(id);
        if (!downloadable) {
            return res.status(404).json({ message: 'Recurso descargable no encontrado' });
        }
        if (String(downloadable.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este recurso' });
        }
        await CoursesDownloadable.findByIdAndDelete(id);
        res.json({ message: 'Recurso descargable eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el recurso descargable', detail: error.message });
    }
};

// Obtener todos los recursos descargables de un curso
const getDownloadablesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const downloadables = await CoursesDownloadable.find({ courses: courseId })
            .populate('courses')
            .populate({
                path: 'coursesSectionsLessons',
                populate: {
                    path: 'coursessections',
                    model: 'CoursesSections'
                }
            })
            .sort({ createdAt: -1 });
        res.json({ message: 'Recursos descargables obtenidos', items: downloadables });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener recursos descargables', detail: error.message });
    }
};

// Upload handler para crear recurso con archivo
const uploadDownloadable = async (req, res) => {
    try {
        // Verificar que se haya subido un archivo usando el middleware
        if (!req.uploadedFiles || !req.uploadedFiles.downloadable || req.uploadedFiles.downloadable.length === 0) {
            return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
        }

        const uploadedFile = req.uploadedFiles.downloadable[0];
        const { courses, title, description, coursesSectionsLessons } = req.body;

        const downloadable = new CoursesDownloadable({
            courses,
            title,
            description,
            route: uploadedFile.path,
            coursesSectionsLessons: coursesSectionsLessons || null
        });

        await downloadable.save();
        res.status(201).json({ message: 'Recurso descargable creado exitosamente', downloadable });
    } catch (error) {
        // Eliminar archivo si falla el guardado
        if (req.uploadedFiles && req.uploadedFiles.downloadable) {
            const uploadedFile = req.uploadedFiles.downloadable[0];
            if (uploadedFile && fs.existsSync(uploadedFile.path)) {
                fs.unlinkSync(uploadedFile.path);
            }
        }
        res.status(500).json({ message: 'Error al crear el recurso descargable', detail: error.message });
    }
};

// Descargar un archivo descargable
const downloadFile = async (req, res) => {
    const path = require('path');

    try {
        const { id } = req.params;

        // Buscar el recurso descargable
        const downloadable = await CoursesDownloadable.findById(id);

        if (!downloadable) {
            return res.status(404).json({ 
                message: 'Recurso descargable no encontrado' 
            });
        }

        // Obtener la ruta del archivo
        const filePath = downloadable.route;

        if (!filePath) {
            return res.status(404).json({ 
                message: 'No hay archivo disponible' 
            });
        }

        // Normalizar la ruta
        const normalizedPath = filePath.replace(/\\/g, '/');

        // Extraer el nombre del archivo
        const fileName = path.basename(normalizedPath);
        const fileExt = path.extname(fileName).toLowerCase();

        // Verificar que el archivo existe
        const fullPath = path.resolve(normalizedPath);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ 
                message: 'Archivo no encontrado en el servidor' 
            });
        }

        // Detectar MIME type basado en la extensión
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.zip': 'application/zip',
            '.rar': 'application/x-rar-compressed',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        };

        const mimeType = mimeTypes[fileExt] || 'application/octet-stream';

        // Usar el título del downloadable como nombre de archivo si está disponible
        const downloadFileName = downloadable.title 
            ? `${downloadable.title}${fileExt}` 
            : fileName;

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);

        // Enviar el archivo
        return res.sendFile(fullPath);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al descargar archivo',
            detail: error.message
        });
    }
};

module.exports = {
    createDownloadable,
    getDownloadableById,
    getDownloadablesByCourse,
    updateDownloadable,
    deleteDownloadable,
    uploadDownloadable,
    downloadFile
};
