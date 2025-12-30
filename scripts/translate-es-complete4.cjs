const fs = require('fs');
const path = require('path');

// Complete Spanish translations for ALL remaining English strings - Part 4
const spanishTranslations = {
  "emptyStates": {
    "noAcquaintedYet": "Aún no hay primos conocidos",
    "noRoleModelsYet": "Aún no hay modelos a seguir",
    "noNayborsYet": "Aún no hay vecinos",
    "addParasocialsHint": "Añade creadores, celebridades o figuras que sigues",
    "roleModelsHint": "Añade personas cuyas historias de vida te inspiran a ser bueno, mejor, el mejor",
    "addToCircleHint": "Añade a alguien a tu círculo más cercano"
  },
  "intro": {
    "dataLiberation": "Tus datos te pertenecen. Exporta en cualquier momento para llevarlos a otro lugar."
  },
  "nayborSOS": {
    "messageCopied": "Mensaje copiado al portapapeles",
    "noNayborsSelected": "No hay vecinos con números de teléfono seleccionados"
  },
  "callActions": {
    "startKall": "Iniciar una llamada",
    "noMethods": "No hay métodos de contacto disponibles",
    "openService": "Abrir {{service}} para conectar"
  },
  "onboarding": {
    "steps": {
      "contactMethods": {
        "description": "Añade tus métodos de contacto para que tus amigos puedan contactarte fácilmente."
      },
      "channels": {
        "title": "Añade Tus Canales"
      },
      "complete": {
        "title": "¡Todo Listo!",
        "description": "Tus amigos ahora pueden iniciar o programar llamadas contigo."
      }
    },
    "yourContactInfo": "Tu información de contacto de {{service}}",
    "addMethod": "Añadir Método",
    "privateProfileHint": "Solo los amigos confirmados pueden ver tu perfil",
    "addMore": "Añadir Más",
    "errors": {
      "enterContactInfo": "Por favor ingresa la información de contacto"
    }
  },
  "keysShared": {
    "addressHelp": "Esta dirección será compartida con los respondedores de emergencia cuando tus vecinos soliciten ayuda en tu nombre."
  },
  "contactOptions": {
    "callVia": "Llamar vía {{method}}",
    "selectContactMethod": "Seleccionar método de contacto",
    "warningPlatform": "Advertencia: la plataforma puede tener preocupaciones de vigilancia"
  },
  "addLinkedFriend": {
    "errors": {
      "noUserHandle": "No se encontró usuario con ese identificador. Asegúrate de que tengan una cuenta y hayan configurado su identificador.",
      "noUserContact": "No se encontró usuario con ese {{type}}. Es posible que aún no lo hayan añadido a su perfil.",
      "searchError": "Ocurrió un error al buscar. Por favor intenta de nuevo."
    },
    "showCircleLevel": "Mostrar nivel de círculo"
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

console.log('Spanish translations (part 4) completed successfully!');
console.log('Updated sections: emptyStates, intro, nayborSOS, callActions, onboarding, keysShared, contactOptions, addLinkedFriend');
