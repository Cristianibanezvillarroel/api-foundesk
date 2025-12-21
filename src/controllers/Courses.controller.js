const Courses = require('../models/Courses.model')

const getCourses = async (req, res) => {
    try {
        const resp = await Courses.find()
            .populate([
                    { path: 'categorie' },
                    { path: 'teacher',
                        populate: { path: 'user' }
                     }
                ]);

        return res.json([{
            message: 'Courses',
            items: resp
        }])
    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })
        
    }
}

const coursesCreate = async (req, res) => {
    try {
        const { title, description, descriptionAdd, categorie, teacher, imagecourse, prerequisites, targetaudience } = req.body;  

        const course = new Courses({
            title,
            slug,
            description,
            descriptionAdd,
            categorie,
            teacher,
            imagecourse,
            prerequisites,
            target
        })

        await course.save()

        return res.json({
            message: 'Course created',
            detail: course  
        })

    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const getCoursesById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await Courses.findById(id)
            .populate([
                { path: 'categorie' },
                { path: 'teacher', populate: { path: 'user' } }
            ]);

        if (!resp) {
            return res.json({
                message: 'Course not found'
            })
        }

        return res.json({
            message: 'Course found',
            detail: resp
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const coursesUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, descriptionAdd, categorie, teacher, imagecourse, prerequisites, targetaudience } = req.body;

        const updated = await Courses.findByIdAndUpdate(
            id,
            {
                title,
                description,
                descriptionAdd,
                categorie,
                teacher,
                imagecourse,
                prerequisites,
                targetaudience
            },
            { new: true }
        ).populate([
            { path: 'categorie' },
            { path: 'teacher', populate: { path: 'user' } }
        ]);

        if (!updated) {
            return res.json({
                message: 'Course not found'
            })
        }

        return res.json({
            message: 'Course updated',
            detail: updated
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const coursesDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Courses.findByIdAndDelete(id);

        if (!deleted) {
            return res.json({
                message: 'Course not found'
            })
        }

        return res.json({
            message: 'Course deleted'
        })
    } catch (error) {
        return res.json({
            message: 'Error',
            detail: error.message
        })
    }
}

const uploadCourseFiles = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ 
                message: "Se requiere courseId para subir archivos al curso" 
            });
        }

        // Verificar que el curso existe
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                message: "Curso no encontrado" 
            });
        }

        // Construir objeto de actualización solo con archivos que se subieron
        const updateData = {};

        if (req.uploadedFiles?.imagecourse?.[0]) {
            updateData.imagecourse = req.uploadedFiles.imagecourse[0].path;
        }

        // Verificar que al menos un archivo fue subido
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No se proporcionaron archivos para subir"
            });
        }

        const courseUpdated = await Courses.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        )
        .populate([
            { path: 'categorie' },
            { path: 'teacher', populate: { path: 'user' } }
        ]);

        return res.json({
            message: "Archivos subidos correctamente",
            detail: courseUpdated
        });

    } catch (err) {
        return res.status(500).json({ 
            message: "Error al subir archivos del curso",
            detail: err.message 
        });
    }
}

const downloadCourseFile = async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        const { courseId } = req.params;

        // Buscar el curso
        const course = await Courses.findById(courseId);

        if (!course) {
            return res.status(404).json({ 
                message: 'Curso no encontrado' 
            });
        }

        // Obtener la ruta del archivo de imagen
        const filePath = course.imagecourse;

        if (!filePath) {
            return res.status(404).json({ 
                message: 'No hay imagen disponible para este curso' 
            });
        }

        // Normalizar la ruta (convertir barras de Windows a formato universal si es necesario)
        const normalizedPath = filePath.replace(/\\/g, '/');

        // Extraer el nombre del archivo de la ruta original
        const fileName = path.basename(normalizedPath);
        const fileExt = path.extname(fileName).toLowerCase();

        // Verificar que el archivo existe (path.resolve maneja ambos formatos)
        const fullPath = path.resolve(normalizedPath);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ 
                message: 'Archivo no encontrado en el servidor' 
            });
        }

        // Detectar MIME type basado en la extensión
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        };

        const mimeType = mimeTypes[fileExt] || 'application/octet-stream';

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        // Enviar el archivo
        return res.sendFile(fullPath);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al descargar archivo',
            detail: error.message
        });
    }
}

module.exports = {
    getCourses,
    getCoursesById,
    coursesCreate,
    coursesUpdate,
    coursesDelete,
    uploadCourseFiles,
    downloadCourseFile
}