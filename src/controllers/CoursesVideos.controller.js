const CoursesVideos = require('../models/CoursesVideos.model');
const fs = require('fs').promises;
const path = require('path');

// Crear registro de video
const createVideo = async (req, res) => {
    try {
        const video = new CoursesVideos(req.body);
        await video.save();
        res.status(201).json({ message: 'Video creado exitosamente', video });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el video', detail: error.message });
    }
};

// Obtener todos los videos de un curso
const getVideosByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const videos = await CoursesVideos.find({ courses: courseId })
            .populate('courses')
            .populate({
                path: 'coursesSectionsLessons',
                populate: {
                    path: 'coursessections'
                }
            })
            .sort({ createdAt: -1 });
        res.json({ message: 'Videos obtenidos', items: videos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener videos', detail: error.message });
    }
};

// Obtener videos gratuitos de preview de un curso
const getFreePreviewVideos = async (req, res) => {
    try {
        const { courseId } = req.params;
        const videos = await CoursesVideos.find({ 
            courses: courseId, 
            isFreePreview: true,
            status: 'ready' 
        })
            .populate('courses')
            .sort({ createdAt: -1 });
        res.json({ message: 'Videos de preview obtenidos', items: videos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener videos de preview', detail: error.message });
    }
};

// Obtener un video por ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await CoursesVideos.findById(id)
            .populate('courses')
            .populate({
                path: 'coursesSectionsLessons',
                populate: {
                    path: 'coursessections'
                }
            });
        
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        
        res.json({ message: 'Video encontrado', video });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el video', detail: error.message });
    }
};

// Actualizar metadata del video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses, ...updateFields } = req.body;
        
        const video = await CoursesVideos.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        
        // Validar que el curso coincida
        if (String(video.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este video' });
        }
        
        const updated = await CoursesVideos.findByIdAndUpdate(
            id, 
            { ...updateFields, updatedAt: Date.now() }, 
            { new: true }
        );
        
        res.json({ message: 'Video actualizado', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el video', detail: error.message });
    }
};

// Eliminar video
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { courses } = req.body;
        
        const video = await CoursesVideos.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        
        // Validar que el curso coincida
        if (String(video.courses) !== String(courses)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este video' });
        }
        
        // Si es almacenamiento local, eliminar archivo físico
        if (video.videoProvider === 'local' && video.videoPath) {
            try {
                const videoFullPath = path.join(__dirname, '../../', video.videoPath);
                await fs.unlink(videoFullPath);
            } catch (err) {
                console.error('Error al eliminar archivo de video:', err);
                // Continuar con la eliminación del registro aunque el archivo no exista
            }
        }
        
        await CoursesVideos.findByIdAndDelete(id);
        res.json({ message: 'Video eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el video', detail: error.message });
    }
};

// Obtener URL de streaming del video (para control de acceso)
const getVideoStreamUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await CoursesVideos.findById(id);
        
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        
        if (video.status !== 'ready') {
            return res.status(400).json({ message: 'Video aún no está disponible' });
        }
        
        // Aquí implementarías la lógica de validación de acceso
        // Por ejemplo, verificar si el usuario está inscrito en el curso
        // o si es un video de preview gratuito
        
        let streamUrl = '';
        
        if (video.videoProvider === 'vimeo' && video.videoId) {
            // Para Vimeo, podrías generar una URL firmada si tienes configurado
            streamUrl = video.videoUrl || `https://player.vimeo.com/video/${video.videoId}`;
        } else if (video.videoProvider === 'local' && video.videoPath) {
            // Para videos locales, servir a través de tu servidor con control de acceso
            streamUrl = `/api/videos/stream/${video._id}`;
        } else if (video.videoUrl) {
            streamUrl = video.videoUrl;
        }
        
        res.json({ 
            message: 'URL de streaming obtenida', 
            streamUrl,
            video: {
                title: video.title,
                duration: video.duration,
                thumbnail: video.thumbnail
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener URL de streaming', detail: error.message });
    }
};

module.exports = {
    createVideo,
    getVideosByCourse,
    getFreePreviewVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideoStreamUrl
};
