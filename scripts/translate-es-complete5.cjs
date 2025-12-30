const fs = require('fs');
const path = require('path');

// Complete Spanish translations for ALL remaining English strings - Part 5
const spanishTranslations = {
  "emptyStates": {
    "acquaintedHint": "Los amigos se reclasifican aquí por falta de contacto con el tiempo",
    "addToCircleHint": "Añade a alguien a tu círculo más cercano"
  },
  "nayborSOS": {
    "messageCopied": "Mensaje copiado al portapapeles"
  },
  "onboarding": {
    "steps": {
      "stayConnected": {
        "title": "Mantente Conectado"
      }
    },
    "skipForNow": "Omitir por ahora",
    "publicProfileHint": "Cualquiera puede encontrarte por tu identificador",
    "errors": {
      "saveFailed": "Error al guardar los métodos de contacto"
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

console.log('Spanish translations (part 5) completed successfully!');
