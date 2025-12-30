const fs = require('fs');
const path = require('path');

// Complete Spanish translations for ALL remaining English strings - Part 3
const spanishTranslations = {
  "labels": {
    "email": "Correo Electrónico"
  },
  "contactOptions": {
    "callVia": "Llamar vía {{method}}",
    "voiceReply": "Respuesta de Voz",
    "meetup": "Encuentro",
    "comment": "Comentar",
    "like": "Me gusta",
    "selectContactMethod": "Seleccionar método de contacto",
    "warningPlatform": "Advertencia: la plataforma puede tener preocupaciones de vigilancia",
    "currentlySelected": "Actualmente seleccionado",
    "dontShowMonth": "No mostrar durante 1 mes",
    "warningSilenced": "Advertencias de {{method}} silenciadas hasta el próximo mes",
    "connectingVia": "Conectando vía {{method}}"
  },
  "contactMethods": {
    "title": "Métodos de Contacto",
    "subtitle": "Añade tus servicios preferidos de videollamada y mensajería para que tus amigos puedan contactarte",
    "addButton": "Añadir Método de Contacto",
    "addButtonCompact": "Añadir",
    "addDialogTitle": "Añadir Método de Contacto",
    "addDialogDescription": "Añade una forma para que tus amigos te contacten para videollamadas",
    "serviceLabel": "Servicio",
    "contactInfoLabel": "Tu información de contacto de {{service}}",
    "labelOptional": "Etiqueta (opcional)",
    "labelPlaceholder": "ej., Personal, Trabajo, Casa",
    "labelHint": "Te ayuda a identificar entre varias cuentas en el mismo servicio",
    "availableFor": "Disponible para",
    "spontaneousKalls": "Llamadas Espontáneas",
    "spontaneousTooltip": "Videollamadas instantáneas cuando los amigos quieren conectar ahora mismo",
    "scheduledKalls": "Llamadas Programadas",
    "scheduledTooltip": "Reuniones de video planificadas con anticipación para una hora específica",
    "dragToReorder": "Arrastra para reordenar",
    "dragReorderHint": "Arrastra para reordenar prioridad. #1 es tu método preferido.",
    "noSpontaneousMethods": "Aún no hay métodos de llamada espontánea añadidos",
    "noScheduledMethods": "Aún no hay métodos de llamada programada añadidos",
    "guidance": {
      "example": "Ejemplo",
      "tip": "Consejo"
    }
  },
  "gdpr": {
    "cookies": {
      "essentialOnlyAria": "Aceptar solo cookies esenciales",
      "acceptAll": "Aceptar Todas",
      "acceptAllAria": "Aceptar todas las cookies",
      "settingsTitle": "Preferencias de Cookies",
      "settingsDescription": "Elige qué tipos de cookies quieres permitir. Las cookies esenciales siempre están habilitadas ya que son necesarias para el funcionamiento del sitio.",
      "savePreferences": "Guardar Preferencias",
      "required": "Requerido",
      "essential": {
        "title": "Cookies Esenciales",
        "description": "Requeridas para la funcionalidad básica del sitio como autenticación y seguridad."
      },
      "functional": {
        "title": "Cookies Funcionales",
        "description": "Recuerdan tus preferencias como configuración de idioma y personalizaciones de interfaz."
      },
      "analytics": {
        "title": "Cookies de Análisis",
        "description": "Nos ayudan a entender cómo los visitantes usan nuestro sitio para mejorar la experiencia."
      },
      "marketing": {
        "title": "Cookies de Marketing",
        "description": "Usadas para entregar anuncios relevantes y rastrear la efectividad de campañas."
      }
    }
  },
  "dev": {
    "devTools": "Herramientas de Desarrollo",
    "resetData": "Restablecer Datos",
    "clearCache": "Limpiar Caché",
    "exportLogs": "Exportar Registros",
    "debugMode": "Modo Depuración",
    "testNotifications": "Probar Notificaciones",
    "simulateError": "Simular Error",
    "title": "Modo Desarrollador",
    "description": "Herramientas y diagnósticos para desarrollo",
    "databaseInfo": "Información de Base de Datos",
    "connectedTo": "Conectado a",
    "connectionStatus": "Estado de Conexión",
    "connected": "Conectado",
    "disconnected": "Desconectado",
    "userInfo": "Información del Usuario",
    "userId": "ID de Usuario",
    "email": "Correo",
    "createdAt": "Creado",
    "lastSignIn": "Último Inicio de Sesión",
    "cacheInfo": "Información de Caché",
    "clearAllCache": "Limpiar Toda la Caché",
    "cacheCleared": "Caché limpiada exitosamente",
    "actions": "Acciones",
    "resetAllData": "Restablecer Todos los Datos",
    "resetWarning": "Esto eliminará todos los datos locales. ¿Estás seguro?",
    "dataReset": "Datos restablecidos exitosamente",
    "featureFlags": "Banderas de Características",
    "enableAll": "Habilitar Todas",
    "disableAll": "Deshabilitar Todas"
  },
  "addLinkedFriend": {
    "title": "Añadir Amigo Vinculado",
    "searchUsers": "Buscar usuarios",
    "noResults": "No se encontraron resultados",
    "sendRequest": "Enviar Solicitud",
    "requestSent": "Solicitud enviada",
    "alreadyLinked": "Ya vinculado",
    "pendingRequest": "Solicitud pendiente",
    "searchPlaceholder": "Buscar por nombre o correo electrónico",
    "linkFriend": "Vincular Amigo",
    "linking": "Vinculando...",
    "errors": {
      "searchFailed": "Error en la búsqueda",
      "requestFailed": "Error al enviar la solicitud",
      "userNotFound": "Usuario no encontrado",
      "alreadyConnected": "Ya estás conectado con este usuario",
      "selfLink": "No puedes vincularte a ti mismo",
      "generic": "Algo salió mal. Por favor intenta de nuevo."
    }
  },
  "post": {
    "createPost": "Crear Publicación",
    "newPost": "Nueva Publicación",
    "shareThoughts": "Comparte tus pensamientos...",
    "addPhoto": "Añadir Foto",
    "addVideo": "Añadir Video",
    "postTo": "Publicar en",
    "selectTier": "Seleccionar Nivel",
    "publish": "Publicar",
    "publishing": "Publicando...",
    "editPost": "Editar Publicación",
    "deletePost": "Eliminar Publicación",
    "confirmDelete": "¿Estás seguro de que quieres eliminar esta publicación?",
    "postDeleted": "Publicación eliminada",
    "postCreated": "Publicación creada",
    "postUpdated": "Publicación actualizada",
    "noPostsYet": "Aún no hay publicaciones",
    "startSharing": "Comienza a compartir con tus círculos",
    "likePost": "Me gusta",
    "commentOnPost": "Comentar",
    "sharePost": "Compartir",
    "viewComments": "Ver comentarios",
    "hideComments": "Ocultar comentarios",
    "addComment": "Añadir comentario",
    "writeComment": "Escribe un comentario...",
    "submitComment": "Enviar",
    "deleteComment": "Eliminar comentario",
    "editComment": "Editar comentario"
  }
};

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Read existing Spanish translations
const esPath = path.join(__dirname, '..', 'public', 'locales', 'es', 'common.json');
const existing = JSON.parse(fs.readFileSync(esPath, 'utf8'));

// Merge with new translations
const merged = deepMerge(existing, spanishTranslations);

// Write back
fs.writeFileSync(esPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');

console.log('Spanish translations (part 3) completed successfully!');
console.log('Updated sections: labels, contactOptions, contactMethods, gdpr.cookies, dev, addLinkedFriend, post');
