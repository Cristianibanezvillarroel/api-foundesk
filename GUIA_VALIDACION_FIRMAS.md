# Guía de Validación de Firmas de Documentos

## Resumen de cambios implementados

Se ha implementado un sistema completo de validación de firmas digitales para los documentos firmados por instructores, garantizando la integridad tanto del archivo PDF como del acuerdo subyacente.

---

## 1. Cambios en el Modelo (`TeacherSignedDocument.model.js`)

### Antes:
```javascript
agreementData: {
  type: mongoose.Schema.Types.Mixed
}
```

### Después:
```javascript
agreementData: {
  html: { type: String, required: true },
  teacherId: { type: String, required: true },
  rut: { type: String, required: true },
  acceptedAt: { type: Date, required: true },
  documentVersion: { type: String, required: true }
}
```

**¿Por qué este cambio?**
- ✅ **Tipificación fuerte**: Ahora cada campo tiene su tipo específico
- ✅ **Validación automática**: Mongoose valida automáticamente los datos
- ✅ **Documentación clara**: Se sabe exactamente qué contiene `agreementData`
- ✅ **Reconstrucción confiable**: Permite regenerar el hash del acuerdo de forma consistente

---

## 2. Cambios en el Controller (`TeacherSignedDocument.controller.js`)

### A) Guardado de `agreementData`

**Problema anterior**: Se generaba `agreementData` para crear el hash pero **NO se guardaba en la BD**.

**Solución implementada**: Ahora se guarda el objeto completo:

```javascript
// 2. Preparar agreementData para guardado
const agreementData = {
  html,
  teacherId: teacher,
  rut: signature.rut,
  acceptedAt: signature.acceptedAt,
  documentVersion
};

// 3. Crear el registro en la BD
const document = new TeacherSignedDocument({
  teacher,
  documentType,
  documentVersion,
  documentHash: hash,
  agreementHash,
  agreementData, // ⬅️ Ahora se guarda
  pdfPath: filePath,
  signature: { ... },
  metadata: { ... },
  status: 'active'
});
```

### B) Nueva función: `validateDocumentSignature`

Esta función valida **DOS niveles de integridad**:

#### **Nivel 1: `documentHash` (Integridad del PDF)**
- Lee el archivo PDF del disco
- Calcula su hash SHA256 actual
- Compara con el `documentHash` almacenado
- Si no coincide → El PDF fue modificado

#### **Nivel 2: `agreementHash` (Integridad del Acuerdo)**
- Reconstruye el `agreementData` desde la BD
- Genera el hash SHA256 del acuerdo
- Compara con el `agreementHash` almacenado  
- Si no coincide → Los datos del acuerdo fueron alterados

---

## 3. Endpoint de Validación

### **GET** `/api/teacher-signed-documents/validate/:id`

**Autenticación**: Requiere token JWT (middleware `auth`)

**Parámetros**:
- `id`: ID del documento a validar

**Respuesta exitosa (200)**:
```json
{
  "message": "La firma del documento es válida - Integridad verificada",
  "signatureValidation": "valid",
  "documentHashValid": true,
  "agreementHashValid": true,
  "overallValid": true,
  "errors": [],
  "storedDocumentHash": "abc123...",
  "currentDocumentHash": "abc123...",
  "storedAgreementHash": "def456...",
  "currentAgreementHash": "def456...",
  "document": {
    "id": "674abc123...",
    "documentType": "teacher_principles",
    "documentVersion": "1.0",
    "teacher": "673def456...",
    "signature": { ... },
    "status": "active",
    "createdAt": "2025-12-30T10:00:00.000Z"
  }
}
```

**Respuesta con error (422)**:
```json
{
  "message": "La firma del documento NO es válida - Se detectaron inconsistencias",
  "signatureValidation": "invalid",
  "documentHashValid": false,
  "agreementHashValid": true,
  "overallValid": false,
  "errors": [
    "El hash del documento PDF no coincide - el archivo ha sido modificado"
  ],
  "storedDocumentHash": "abc123...",
  "currentDocumentHash": "xyz789...",
  "storedAgreementHash": "def456...",
  "currentAgreementHash": "def456...",
  "document": { ... }
}
```

---

## 4. Diferencia entre endpoints de validación

### **`/verify/:id`** (Anterior)
- Solo verifica la integridad del **archivo PDF**
- Valida que el PDF no haya sido modificado físicamente
- Útil para auditorías rápidas de archivos

### **`/validate/:id`** (Nuevo) ⭐
- Valida **PDF + Acuerdo**
- Verifica dos capas de seguridad
- Es la opción **más completa y recomendada**
- Detecta modificaciones tanto en el archivo como en los datos

---

## 5. Ejemplo de uso en frontend

```javascript
// Validar firma completa de un documento
const validateSignature = async (documentId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/teacher-signed-documents/validate/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.overallValid) {
      console.log('✅ Firma válida:', data.message);
      return true;
    } else {
      console.error('❌ Firma inválida:', data.errors);
      return false;
    }
  } catch (error) {
    console.error('Error al validar firma:', error);
    return false;
  }
};
```

---

## 6. Casos de uso

### ✅ Auditoría legal
Verificar que un documento firmado no ha sido alterado desde su firma original.

### ✅ Validación antes de procesos críticos
Antes de pagar a un instructor o renovar un contrato, validar que los documentos firmados son auténticos.

### ✅ Detección de manipulación
Si alguien modifica el PDF o los datos en la BD, el sistema lo detectará inmediatamente.

### ✅ Cumplimiento normativo
Demostrar ante auditorías que los documentos tienen integridad criptográfica.

---

## 7. Flujo completo de validación

```
1. Usuario solicita validación → GET /validate/:id
                 ↓
2. Sistema busca documento en BD
                 ↓
3. Lee archivo PDF del disco
                 ↓
4. Calcula hash actual del PDF → Compara con documentHash
                 ↓
5. Reconstruye agreementData desde BD
                 ↓
6. Calcula hash del acuerdo → Compara con agreementHash
                 ↓
7. Devuelve resultado con ambas validaciones
```

---

## 8. Consideraciones de seguridad

### ✅ Ventajas del sistema implementado:
- **Hash SHA256**: Algoritmo criptográfico fuerte
- **Doble validación**: PDF + datos del acuerdo
- **Inmutabilidad**: Cualquier modificación invalida la firma
- **Auditoría completa**: Se registra IP, user agent y metadatos

### ⚠️ Recomendaciones adicionales:
1. **Backups**: Mantener copias de seguridad de los PDFs en almacenamiento seguro
2. **Logs**: Registrar todos los accesos a documentos firmados
3. **Acceso restringido**: Solo administradores deberían poder revocar documentos
4. **Monitoreo**: Alertar si se detectan validaciones fallidas

---

## 9. Testing recomendado

### Test 1: Validación exitosa
```bash
curl -X GET "http://localhost:3000/api/teacher-signed-documents/validate/674abc123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Modificar PDF manualmente
1. Localizar el PDF en `storage/legal/`
2. Editar el archivo con un editor de texto
3. Ejecutar validación → Debería fallar en `documentHashValid`

### Test 3: Modificar BD
1. Cambiar el campo `agreementData.html` en MongoDB
2. Ejecutar validación → Debería fallar en `agreementHashValid`

---

## 10. Resumen de archivos modificados

| Archivo | Cambio |
|---------|--------|
| `TeacherSignedDocument.model.js` | Tipificación fuerte de `agreementData` |
| `TeacherSignedDocument.controller.js` | Guardado de `agreementData` + función `validateDocumentSignature` |
| `TeacherSignedDocument.router.js` | Nueva ruta `/validate/:id` |

---

## ✅ Conclusión

El sistema ahora cuenta con:
- ✅ Validación completa de firmas digitales
- ✅ Integridad verificable del PDF y del acuerdo
- ✅ Tipificación robusta en el modelo
- ✅ Endpoint RESTful documentado
- ✅ Detección automática de manipulaciones

**Próximos pasos sugeridos**:
1. Implementar interfaz en el frontend para mostrar validación
2. Agregar notificaciones automáticas si se detectan documentos inválidos
3. Crear logs de auditoría para todas las validaciones
4. Implementar firma digital con certificados X.509 (opcional, nivel avanzado)
