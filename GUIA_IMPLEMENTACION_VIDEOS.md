# 📹 Guía de Implementación de Videos para Cursos

## ⚠️ IMPORTANTE: Esta es una implementación básica inicial

La gestión actual almacena referencias a videos, pero para producción necesitarás implementar una solución profesional de almacenamiento y streaming.

---

## 🎯 Opciones de Implementación Recomendadas

### Opción 1: VIMEO PRO (Recomendado para empezar) ⭐

**Por qué Vimeo:**
- Transcodificación automática a múltiples calidades
- Player embebido profesional y customizable
- Control de privacidad (videos privados, protegidos con dominio)
- Sin publicidad
- Estadísticas básicas de visualización
- API robusta y bien documentada
- CDN global incluido

**Implementación:**

```javascript
// 1. Instalar SDK de Vimeo
npm install @vimeo/vimeo

// 2. Configurar en backend (api-foundesk)
const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// 3. Upload desde backend
client.upload(
  filePath,
  {
    'name': videoTitle,
    'description': videoDescription,
    'privacy': {
      'view': 'disable', // Privado por defecto
      'embed': 'whitelist', // Solo en tu dominio
      'download': false
    }
  },
  function (uri) {
    const vimeoId = uri.split('/').pop();
    // Guardar vimeoId en tu BD
  },
  function (bytesUploaded, bytesTotal) {
    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
    console.log(percentage + '% uploaded');
  },
  function (error) {
    console.log('Error: ' + error);
  }
);

// 4. Embed en frontend
<iframe 
  src={`https://player.vimeo.com/video/${vimeoId}?h=${hash}&title=0&byline=0&portrait=0`}
  width="640" 
  height="360" 
  frameBorder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowFullScreen
/>
```

**Costo:** ~$20/mes (Plan Pro) - 5TB almacenamiento, 1TB ancho de banda/mes

---

### Opción 2: AWS S3 + CloudFront (Para escala empresarial)

**Ventajas:**
- Control total
- Escalabilidad ilimitada
- Integración con otros servicios AWS
- Precio variable según uso

**Desventajas:**
- Complejidad técnica alta
- Requiere configurar transcodificación (AWS MediaConvert)
- Requiere configurar streaming (HLS/DASH)
- Más costoso en tiempo de desarrollo

**Implementación básica:**

```javascript
// 1. Instalar AWS SDK
npm install aws-sdk

// 2. Configurar S3
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

// 3. Upload
const uploadToS3 = async (file) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: `videos/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private'
  };
  
  return await s3.upload(params).promise();
};

// 4. Generar URL firmada (expira en 1 hora)
const getSignedUrl = (key) => {
  return s3.getSignedUrl('getObject', {
    Bucket: 'your-bucket-name',
    Key: key,
    Expires: 3600 // 1 hora
  });
};
```

**Costo:** Variable - ~$0.023/GB almacenamiento + $0.085/GB transferencia

---

### Opción 3: Cloudinary Video

**Ventajas:**
- Muy fácil de implementar
- Transformaciones automáticas
- CDN incluido
- Buena documentación

```javascript
// 1. Instalar
npm install cloudinary

// 2. Configurar
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Upload
const uploadResult = await cloudinary.uploader.upload(filePath, {
  resource_type: 'video',
  folder: 'courses',
  public_id: `video-${Date.now()}`
});

// 4. Embed
<video controls>
  <source 
    src={cloudinary.url(publicId, { 
      resource_type: 'video',
      quality: 'auto',
      format: 'auto'
    })}
  />
</video>
```

**Costo:** Plan gratuito limitado, luego desde $99/mes

---

## 📋 Especificaciones Técnicas Recomendadas

### Validaciones de Video

```javascript
const VIDEO_VALIDATION = {
  // Formatos aceptados
  formats: {
    allowed: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    recommended: 'mp4' // H.264 codec
  },
  
  // Tamaño de archivo
  fileSize: {
    min: 1 * 1024 * 1024, // 1MB mínimo
    max: 5 * 1024 * 1024 * 1024, // 5GB máximo (ajustar según plan)
    recommended: 2 * 1024 * 1024 * 1024 // 2GB recomendado
  },
  
  // Duración
  duration: {
    min: 120, // 2 minutos
    max: 10800, // 3 horas
    recommended: { min: 300, max: 3600 } // 5-60 minutos por lección
  },
  
  // Resolución
  resolution: {
    min: { width: 1280, height: 720 }, // 720p mínimo
    recommended: { width: 1920, height: 1080 }, // 1080p
    max: { width: 3840, height: 2160 } // 4K
  },
  
  // Calidad
  bitrate: {
    min: 2000, // 2 Mbps
    recommended: 5000, // 5 Mbps
    max: 10000 // 10 Mbps
  },
  
  // Códecs recomendados
  codecs: {
    video: 'H.264',
    audio: 'AAC'
  }
};
```

### Middleware de Validación (Backend)

```javascript
// middlewares/videoValidation.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de video no permitido. Usa MP4, MOV, AVI o WEBM'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024 // 5GB
  }
});

module.exports = upload;
```

---

## 🔒 Seguridad y Control de Acceso

### 1. URLs Firmadas (Signed URLs)

```javascript
// Generar URL con token temporal
const generateSignedUrl = (videoId, expiresIn = 3600) => {
  const token = jwt.sign(
    { videoId, type: 'video-access' },
    process.env.JWT_SECRET,
    { expiresIn }
  );
  
  return `/api/videos/stream/${videoId}?token=${token}`;
};

// Middleware de verificación
const verifyVideoAccess = async (req, res, next) => {
  const { token } = req.query;
  const { id } = req.params;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.videoId !== id) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    // Verificar si usuario tiene acceso al curso
    const hasAccess = await checkUserCourseAccess(req.user.id, decoded.courseId);
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a este curso' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirado o inválido' });
  }
};
```

### 2. Prevención de Descarga Directa

- Usar streaming en lugar de descarga directa
- Deshabilitar botón de descarga en player
- Configurar headers HTTP apropiados:

```javascript
res.setHeader('Content-Type', 'video/mp4');
res.setHeader('Content-Disposition', 'inline'); // No permitir descarga
res.setHeader('Cache-Control', 'private, max-age=3600');
res.setHeader('X-Content-Type-Options', 'nosniff');
```

### 3. Watermarking (Marca de Agua)

Para prevenir piratería, puedes agregar watermark con:
- Nombre del usuario
- Email del usuario  
- Fecha de acceso

Esto se puede hacer con servicios como Vimeo Pro o mediante procesamiento de video.

---

## 📊 Monitoring y Analytics

### Eventos a Trackear

```javascript
const VIDEO_EVENTS = {
  // Eventos básicos
  STARTED: 'video_started',
  PAUSED: 'video_paused',
  RESUMED: 'video_resumed',
  COMPLETED: 'video_completed',
  
  // Progreso
  PROGRESS_25: 'video_progress_25',
  PROGRESS_50: 'video_progress_50',
  PROGRESS_75: 'video_progress_75',
  PROGRESS_90: 'video_progress_90',
  
  // Calidad
  QUALITY_CHANGED: 'video_quality_changed',
  
  // Errores
  ERROR: 'video_error',
  BUFFERING: 'video_buffering'
};
```

### Implementación en Frontend

```javascript
const trackVideoEvent = (event, videoId, data = {}) => {
  // Enviar a tu analytics (Google Analytics, Mixpanel, etc.)
  apiWrapper.post('/analytics/video', {
    event,
    videoId,
    timestamp: Date.now(),
    ...data
  });
};

// En el player
videoRef.current.addEventListener('play', () => {
  trackVideoEvent(VIDEO_EVENTS.STARTED, videoId);
});

videoRef.current.addEventListener('timeupdate', () => {
  const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
  
  if (progress >= 25 && !milestones.progress25) {
    trackVideoEvent(VIDEO_EVENTS.PROGRESS_25, videoId);
    setMilestones(prev => ({ ...prev, progress25: true }));
  }
});
```

---

## 🚀 Roadmap de Implementación

### Fase 1: MVP (Actual)
- ✅ Modelo de datos básico
- ✅ CRUD de metadata
- ✅ Referencia a videos externos (URL)
- ⚠️ Sin procesamiento de video

### Fase 2: Integración con Vimeo
- [ ] Configurar cuenta Vimeo Pro
- [ ] Implementar upload a Vimeo desde backend
- [ ] Guardar vimeoId en base de datos
- [ ] Embed player de Vimeo en frontend
- [ ] Control de privacidad

### Fase 3: Control de Acceso
- [ ] Middleware de autenticación para videos
- [ ] Verificación de inscripción al curso
- [ ] URLs firmadas con expiración
- [ ] Logs de acceso

### Fase 4: Analytics
- [ ] Tracking de visualizaciones
- [ ] Progreso de video por usuario
- [ ] Reportes para instructores
- [ ] Engagement metrics

### Fase 5: Optimización
- [ ] CDN para delivery global
- [ ] Streaming adaptativo
- [ ] Subtítulos/captions
- [ ] Múltiples idiomas audio

---

## 💰 Comparación de Costos (Estimado)

| Servicio | Plan Inicio | Almacenamiento | Bandwidth | Transcodificación |
|----------|------------|----------------|-----------|-------------------|
| Vimeo Pro | $20/mes | 5TB | 1TB/mes | ✅ Incluida |
| AWS S3+CF | Variable | $0.023/GB | $0.085/GB | ❌ Adicional (~$0.015/min) |
| Cloudinary | $99/mes | 250GB | 250GB/mes | ✅ Incluida |
| Mux | $0.005/min | S3 aparte | $0.005/min | ✅ Incluida |

**Recomendación inicial:** Vimeo Pro por simplicidad y costo predecible.

---

## 📝 Checklist de Implementación

### Backend
- [x] Modelo CoursesVideos
- [x] Controller con CRUD
- [x] Router con auth middleware
- [ ] Integración con servicio de video (Vimeo/S3)
- [ ] Middleware de validación de archivos
- [ ] Generación de URLs firmadas
- [ ] Webhook para procesar videos
- [ ] Limpieza de archivos temporales

### Frontend
- [x] Servicio API
- [ ] Componente TeacherCoursesVideo
- [ ] Upload con progress bar
- [ ] Preview de video
- [ ] Player embebido
- [ ] Vinculación con lecciones
- [ ] Gestión de video de preview gratuito

### Seguridad
- [ ] Validación de formatos
- [ ] Límites de tamaño
- [ ] Rate limiting en uploads
- [ ] Sanitización de filenames
- [ ] Control de acceso por curso
- [ ] Prevención de hotlinking

### UX
- [ ] Indicador de progreso de upload
- [ ] Estados de procesamiento
- [ ] Thumbnails automáticos
- [ ] Reproductor responsive
- [ ] Controles de velocidad de reproducción
- [ ] Marcadores de tiempo

---

## 🔗 Referencias Útiles

- [Vimeo API Docs](https://developer.vimeo.com/)
- [AWS S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [Video.js Player](https://videojs.com/)
- [HLS.js for Streaming](https://github.com/video-dev/hls.js/)
- [FFmpeg for Processing](https://ffmpeg.org/)

---

**Última actualización:** Diciembre 2025
