const fs = require('fs');
const path = require('path');

// Complete Spanish translations for ALL remaining English strings
const spanishTranslations = {
  "keysShared": {
    "addressPlaceholder": "123 Calle Principal",
    "unitNumber": "Número de Unidad/Apt",
    "unitPlaceholder": "Apt 4B",
    "entryInstructions": "Instrucciones Especiales de Entrada",
    "instructionsPlaceholder": "El teclado está a la derecha de la puerta, toque dos veces...",
    "instructionsHint": "Incluya cualquier detalle que los respondedores deban saber sobre el acceso a su hogar",
    "keyType": "Tipo de Acceso",
    "keyTypes": {
      "physical": "Llave Física",
      "digital": "Código Digital",
      "both": "Ambos"
    },
    "digitalCodeType": "Tipo de Código",
    "codeTypes": {
      "keypad": "Teclado de Puerta",
      "smart_lock": "App de Cerradura Inteligente",
      "garage": "Código de Garaje",
      "other": "Otro"
    },
    "notesPlaceholder": "La llave está debajo de la maceta azul...",
    "confirmKeyHolder": "Confirmar",
    "currentKeyHolders": "Portadores de Llaves Actuales",
    "selectNaybors": "Añadir un vecino que tenga acceso:",
    "noNaybors": "Primero añade vecinos para compartir llaves con ellos",
    "allNayborsAssigned": "Todos tus vecinos han sido asignados",
    "optionalScenariosHelp": "Puedes elegir si los vecinos pueden entrar para estos escenarios.",
    "scenarios": {
      "cardiac_arrest": {
        "name": "Paro Cardíaco",
        "description": "Ataque cardíaco o paro cardíaco súbito — cada segundo cuenta"
      },
      "choking": {
        "name": "Asfixia",
        "description": "Emergencia por asfixia — vía aérea bloqueada, necesita ayuda inmediata"
      },
      "drowning": {
        "name": "Ahogamiento",
        "description": "Ahogamiento en piscina, bañera u otra agua"
      },
      "anaphylaxis": {
        "name": "Choque Anafiláctico",
        "description": "Reacción alérgica severa por picadura de abeja, alimento, medicamento"
      },
      "elderly_fall": {
        "name": "Caída de Anciano",
        "description": "Persona mayor caída, incapaz de levantarse, posiblemente herida"
      },
      "fire": {
        "name": "Incendio",
        "description": "Incendio detectado — amenaza para la vida, extremidades, tejidos, cualquier persona inmovilizada o dormida"
      },
      "gas_leak": {
        "name": "Fuga de Gas",
        "description": "Fuga de gas detectada — riesgo de explosión/envenenamiento"
      },
      "carbon_monoxide": {
        "name": "Monóxido de Carbono",
        "description": "Alarma de detector de CO — asesino silencioso, los ocupantes pueden estar inconscientes"
      },
      "childhood_corporal": {
        "name": "Castigo Corporal Infantil",
        "description": "Niño alertando a vecinos sobre castigo corporal. La investigación muestra que la intervención comunitaria previene la violencia futura."
      },
      "take10_spiral": {
        "name": "Espiral de Gritos Take 10",
        "description": "Gritos domésticos escalando inaceptablemente. Se necesita intervención de desescalada."
      },
      "bedroom_consent": {
        "name": "Conflicto de Consentimiento en Dormitorio",
        "description": "Conflicto de consentimiento en dormitorio detectado — se requiere intervención inmediata"
      },
      "medical_other": {
        "name": "Otra Emergencia Médica",
        "description": "Otra emergencia médica que requiere entrada al hogar"
      },
      "intruder_check": {
        "name": "Verificación de Intruso",
        "description": "Verificar sospecha de intruso cuando no puedes responder"
      },
      "welfare_check": {
        "name": "Verificación de Bienestar",
        "description": "Verificación general de bienestar cuando no respondes por un período prolongado"
      },
      "flooding": {
        "name": "Inundación/Fuga de Agua",
        "description": "Fuga de agua o inundación — prevención de daños a la propiedad (no amenaza la vida)"
      }
    },
    "yourAddress": "Tu Dirección",
    "noAddressSet": "No hay dirección configurada",
    "unit": "Unidad",
    "keyHoldersSummary": "{{count}} vecino(s) tienen llaves",
    "keyHoldersSummary_plural": "{{count}} vecinos tienen llaves",
    "permissionsSummary": "Permisos de Entrada",
    "mandatoryLabel": "obligatorios (siempre permitidos)",
    "optionalLabel": "opcionales habilitados",
    "reviewWarning": "Al guardar estas configuraciones, autorizas a tus vecinos designados a entrar a tu hogar durante los escenarios de emergencia seleccionados. Asegúrate de confiar en estas personas con acceso a tu hogar.",
    "toasts": {
      "keyHolderAdded": "Portador de llave añadido",
      "keyHolderRemoved": "Portador de llave eliminado",
      "saved": "Preferencias de llaves compartidas guardadas"
    }
  },
  "gdpr": {
    "settings": {
      "title": "Configuración de Privacidad",
      "description": "Gestiona tus datos y preferencias de privacidad.",
      "cookiePreferences": "Preferencias de Cookies",
      "cookieDescription": "Gestiona cómo usamos cookies para la autenticación y funcionalidad del servicio.",
      "functionalCookies": "Cookies Funcionales",
      "functionalDescription": "Requeridas para funcionalidad básica (inicio de sesión, preferencias)",
      "analyticsCookies": "Cookies de Análisis",
      "analyticsDescription": "No usamos cookies de análisis de terceros",
      "marketingCookies": "Cookies de Marketing",
      "marketingDescription": "No usamos cookies de marketing ni publicidad",
      "savePreferences": "Guardar Preferencias",
      "consentHistory": "Historial de Consentimiento",
      "consentHistoryDescription": "Ver y gestionar tus registros de consentimiento.",
      "consentGiven": "Consentimiento dado el",
      "consentVersion": "Versión de términos",
      "noConsent": "No se encontró registro de consentimiento. Por favor acepte la política de cookies.",
      "withdrawConsent": "Retirar Consentimiento",
      "withdrawWarning": "Retirar el consentimiento restablecerá sus preferencias de cookies y puede limitar algunas funciones. ¿Está seguro?",
      "confirmWithdraw": "Sí, Retirar Consentimiento",
      "dataRights": "Sus Derechos de Datos",
      "dataRightsDescription": "Bajo GDPR, tiene derecho a acceder, exportar y eliminar sus datos.",
      "exportData": "Exportar Mis Datos",
      "exportDescription": "Descargar todos sus datos en un formato portátil",
      "deleteAccount": "Eliminar Mi Cuenta",
      "deleteDescription": "Eliminar permanentemente su cuenta y todos los datos"
    },
    "deletion": {
      "title": "Eliminar Tu Cuenta",
      "description": "Esto eliminará permanentemente tu cuenta y todos los datos asociados.",
      "warningTitle": "Advertencia: Esto no se puede deshacer",
      "warningDescription": "Una vez eliminada, tu cuenta y todos los datos serán removidos permanentemente. Asegúrate de exportar tus datos primero si quieres conservarlos.",
      "whatDeleted": "Lo que se eliminará:",
      "deletedItems": {
        "profile": "Tu perfil e información personal",
        "connections": "Todas tus conexiones de amigos y círculos",
        "posts": "Todas tus publicaciones y contenido compartido",
        "preferences": "Tus preferencias y configuraciones",
        "keysShared": "Tu configuración de acceso de emergencia de Llaves Compartidas"
      },
      "gracePeriodTitle": "Período de Gracia de 30 Días",
      "gracePeriodDescription": "Tu cuenta será programada para eliminación en {{days}} días. Puedes cancelar la eliminación durante este período iniciando sesión.",
      "exportFirst": "¿Exportar tus datos antes de la eliminación?",
      "exportData": "Exportar Datos",
      "exported": "Datos Exportados",
      "continue": "Continuar a Eliminación",
      "confirmTitle": "Confirmar Eliminación de Cuenta",
      "confirmDescription": "Esta es tu confirmación final. Por favor verifica tu identidad para continuar.",
      "typeEmail": "Escribe tu correo electrónico para confirmar: {{email}}",
      "emailMismatch": "El correo electrónico no coincide con tu cuenta",
      "reasonLabel": "Razón para irte",
      "reasonPlaceholder": "Ayúdanos a mejorar compartiendo por qué te vas...",
      "understandConsequences": "Entiendo que mi cuenta y todos los datos serán eliminados permanentemente después del período de gracia, y esta acción no se puede deshacer.",
      "deleting": "Programando eliminación...",
      "confirmDelete": "Eliminar Mi Cuenta",
      "scheduledTitle": "Eliminación Programada",
      "scheduledDescription": "Tu cuenta ha sido programada para eliminación.",
      "scheduledDate": "Tu cuenta será eliminada permanentemente el:",
      "cancelInfo": "Para cancelar la eliminación, simplemente inicia sesión en tu cuenta antes de la fecha programada."
    },
    "age": {
      "title": "Verificación de Edad",
      "description": "Necesitamos verificar tu edad para cumplir con las regulaciones de privacidad.",
      "whyTitle": "Por qué preguntamos",
      "whyDescription": "Bajo GDPR, los usuarios menores de {{age}} años requieren consentimiento parental para crear una cuenta.",
      "birthYearLabel": "¿En qué año naciste?",
      "selectYear": "Seleccionar año",
      "privacyNote": "Solo almacenamos tu año de nacimiento para fines de cumplimiento.",
      "minorTitle": "Se Requiere Consentimiento Parental",
      "minorDescription": "Los usuarios menores de {{age}} requieren consentimiento parental. Por favor pide a un padre o tutor que te ayude a crear una cuenta.",
      "parentalRequired": "Se Requiere Consentimiento Parental",
      "verify": "Verificar Edad"
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

console.log('Spanish translations (part 2) completed successfully!');
console.log('Updated sections: keysShared (scenarios, keyTypes, codeTypes, toasts), gdpr (settings, deletion, age)');
