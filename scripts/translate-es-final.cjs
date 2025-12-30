const fs = require('fs');
const path = require('path');

// FINAL Spanish translations for ALL remaining English strings
const spanishTranslations = {
  "emptyStates": {
    "noAcquaintedYet": "Aún no hay primos conocidos",
    "noRoleModelsYet": "Aún no hay modelos a seguir",
    "noNayborsYet": "Aún no hay vecinos",
    "addParasocialsHint": "Añade creadores, celebridades o figuras que sigues",
    "roleModelsHint": "Añade personas cuyas historias de vida te inspiran a ser bueno, mejor, el mejor",
    "acquaintedHint": "Los amigos se reclasifican aquí por falta de contacto con el tiempo",
    "nayborsHint": "Preséntate a tus vecinos y añádelos aquí",
    "addToCircleHint": "Añade a alguien a tu círculo más cercano"
  },
  "nayborSOS": {
    "contacted_plural": "Contactados {{count}} vecinos",
    "toasts": {
      "messageCopied": "Mensaje copiado al portapapeles",
      "noNayborsSelected": "No hay vecinos con números de teléfono seleccionados"
    }
  },
  "callActions": {
    "kallNow": "Llamar a {{name}} ahora",
    "scheduleKall": "Programar una llamada",
    "scheduleWith": "Programar con {{name}}",
    "sharedServices": "Servicios compartidos:",
    "theirPreferences": "Sus preferencias:",
    "requestInfo": "Solicitar información de contacto",
    "toasts": {
      "connecting": "Conectando vía {{service}}",
      "openService": "Abrir {{service}} para conectar"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "Mantente Conectado",
        "description": "Añade tus métodos de contacto para que tus amigos puedan contactarte fácilmente."
      },
      "channels": {
        "description": "¿Qué aplicaciones de videollamada y mensajería usas?"
      }
    },
    "service": "Servicio",
    "spontaneous": "Espontánea",
    "scheduled": "Programada",
    "continue": "Continuar",
    "methodsAdded": "Has añadido {{count}} método de contacto",
    "methodsAdded_plural": "Has añadido {{count}} métodos de contacto",
    "publicProfile": "Perfil Público",
    "privateProfile": "Perfil Privado",
    "saving": "Guardando...",
    "toasts": {
      "enterContactInfo": "Por favor ingresa la información de contacto",
      "saveFailed": "Error al guardar los métodos de contacto"
    }
  },
  "dev": {
    "forceLogout": "Forzar Cierre de Sesión",
    "storageActions": "Acciones de Almacenamiento",
    "storageInspector": "Inspector de Almacenamiento",
    "noStorageData": "Sin datos de almacenamiento local",
    "chars": "caracteres",
    "tips": {
      "title": "Consejos",
      "sessions": "Las sesiones persisten entre recargas de página",
      "clearApp": "Usa \"Limpiar Datos de la App\" para restablecer listas de amigos",
      "forceLogout": "Usa \"Forzar Cierre de Sesión\" para limpiar completamente el estado de autenticación"
    }
  },
  "addLinkedFriend": {
    "errors": {
      "connectionFailed": "Error al enviar la solicitud de conexión"
    }
  },
  "gdpr": {
    "cookies": {
      "customizeAria": "Personalizar preferencias de cookies"
    }
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

console.log('Spanish translations (FINAL) completed successfully!');
