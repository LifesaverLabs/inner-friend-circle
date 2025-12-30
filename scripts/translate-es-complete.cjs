const fs = require('fs');
const path = require('path');

// Complete Spanish translations for all remaining English strings
const spanishTranslations = {
  "labels": {
    "phone": "Número de Teléfono",
    "notes": "Notas",
    "handle": "Usuario"
  },
  "emptyStates": {
    "noAcquaintedCousins": "Aún no hay primos conocidos",
    "noRoleModels": "Aún no hay modelos a seguir",
    "noNaybors": "Aún no hay vecinos",
    "addHintAcquaintedCousins": "Añade personas que ves regularmente pero conoces casualmente.",
    "addHintRoleModels": "Añade creadores e influencers cuyo contenido valoras.",
    "addHintNaybors": "Añade vecinos que pueden ser recursos en una emergencia."
  },
  "reserved": {
    "spotsCount_plural": "{{count}} lugares",
    "spotsLabel_plural": "lugares"
  },
  "dashboard": {
    "loading": "Cargando tus círculos...",
    "tend": "Cuidar",
    "share": "Compartir",
    "nurtureYourRelationships": "Nutre tus relaciones más cercanas",
    "shareWithYourCircle": "Comparte con tu círculo",
    "welcomeMessage": "Bienvenido a tu Círculo Íntimo de Amigos",
    "getStartedMessage": "Comienza añadiendo personas a tus círculos usando los botones de abajo.",
    "viewAll": "Ver Todo",
    "recentActivity": "Actividad Reciente",
    "noRecentActivity": "Sin actividad reciente",
    "connectionsOverview": "Resumen de Conexiones"
  },
  "tierSection": {
    "reserve": "Reservar",
    "link": "Vincular",
    "followCreator": "Seguir Creador",
    "addRoleModel": "Añadir Modelo a Seguir",
    "add": "Añadir"
  },
  "nayborSOS": {
    "copyMessage": "Copiar mensaje",
    "messageAll": "Mensaje a Todos",
    "contacted": "Contactado"
  },
  "callActions": {
    "startCall": "Iniciar una llamada",
    "scheduleCall": "Programar una llamada",
    "callNow": "Llamar Ahora",
    "videoCall": "Videollamada",
    "audioCall": "Llamada de Audio"
  },
  "onboarding": {
    "welcome": "Bienvenido",
    "welcomeTitle": "Bienvenido a Inner Friend Circle",
    "welcomeSubtitle": "Conecta con las personas que más importan",
    "getStarted": "Comenzar",
    "setupProfile": "Configurar Perfil",
    "addFirstFriend": "Añade tu Primer Amigo",
    "exploreTiers": "Explora los Niveles",
    "completeSetup": "Completar Configuración",
    "skip": "Omitir",
    "next": "Siguiente",
    "back": "Atrás",
    "finish": "Finalizar",
    "stepOf": "Paso {{current}} de {{total}}",
    "profileSetup": "Configuración de Perfil",
    "enterName": "Ingresa tu nombre",
    "uploadPhoto": "Subir foto",
    "tierExplanation": "Entendiendo los Niveles",
    "coreDescription": "Tus 5 personas más cercanas - familia inmediata y mejores amigos",
    "innerDescription": "Tu círculo íntimo de 15 amigos cercanos",
    "outerDescription": "Tu círculo externo de 50 buenos amigos",
    "nayborDescription": "Vecinos y conexiones comunitarias"
  },
  "keysShared": {
    "title": "Llaves Compartidas",
    "subtitle": "Sistema de acceso de emergencia para vecinos",
    "description": "Comparte el acceso de emergencia a tu hogar con vecinos de confianza",
    "addKeyHolder": "Añadir Portador de Llave",
    "keyHolders": "Portadores de Llaves",
    "noKeyHolders": "Aún no hay portadores de llaves",
    "addFirst": "Añade tu primer portador de llave",
    "accessLevel": "Nivel de Acceso",
    "fullAccess": "Acceso Completo",
    "limitedAccess": "Acceso Limitado",
    "emergencyOnly": "Solo Emergencias",
    "keyLocation": "Ubicación de la Llave",
    "accessCode": "Código de Acceso",
    "notes": "Notas",
    "lastUpdated": "Última actualización",
    "remove": "Eliminar",
    "edit": "Editar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "confirmRemove": "¿Confirmar eliminación?",
    "removeWarning": "Esta acción no se puede deshacer",
    "success": {
      "added": "Portador de llave añadido exitosamente",
      "updated": "Portador de llave actualizado",
      "removed": "Portador de llave eliminado"
    },
    "errors": {
      "addFailed": "Error al añadir portador de llave",
      "updateFailed": "Error al actualizar",
      "removeFailed": "Error al eliminar"
    },
    "shareWithEmergencyWorkers": "Compartir con trabajadores de emergencia",
    "emergencyWorkersDescription": "Permite que cuentas de despacho verificadas accedan a tu información en emergencias",
    "emergencyWorkersEnabled": "Los trabajadores de emergencia pueden acceder a tu información",
    "emergencyWorkersDisabled": "Los trabajadores de emergencia no pueden acceder a tu información",
    "doorKeyTree": "Árbol de Llaves de Puerta",
    "doorKeyTreeDescription": "Sistema visual de tus portadores de llaves y sus relaciones"
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
    "postUpdated": "Publicación actualizada"
  },
  "contactMethods": {
    "phone": "Teléfono",
    "email": "Correo Electrónico",
    "sms": "SMS",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "signal": "Signal",
    "messenger": "Messenger",
    "instagram": "Instagram",
    "twitter": "Twitter",
    "snapchat": "Snapchat",
    "discord": "Discord",
    "slack": "Slack",
    "linkedin": "LinkedIn",
    "facetime": "FaceTime",
    "zoom": "Zoom",
    "googleMeet": "Google Meet",
    "teams": "Microsoft Teams",
    "skype": "Skype",
    "inPerson": "En Persona",
    "other": "Otro",
    "selectMethod": "Seleccionar Método",
    "preferredMethod": "Método Preferido",
    "addMethod": "Añadir Método",
    "removeMethod": "Eliminar Método"
  },
  "dev": {
    "devTools": "Herramientas de Desarrollo",
    "resetData": "Restablecer Datos",
    "clearCache": "Limpiar Caché",
    "exportLogs": "Exportar Registros",
    "debugMode": "Modo Depuración",
    "testNotifications": "Probar Notificaciones",
    "simulateError": "Simular Error"
  },
  "addLinkedFriend": {
    "title": "Añadir Amigo Vinculado",
    "searchUsers": "Buscar usuarios",
    "noResults": "No se encontraron resultados",
    "sendRequest": "Enviar Solicitud",
    "requestSent": "Solicitud enviada",
    "alreadyLinked": "Ya vinculado",
    "pendingRequest": "Solicitud pendiente",
    "errors": {
      "searchFailed": "Error en la búsqueda",
      "requestFailed": "Error al enviar la solicitud",
      "userNotFound": "Usuario no encontrado",
      "alreadyConnected": "Ya estás conectado con este usuario"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "Aviso de Cookies",
      "description": "Usamos cookies esenciales para la autenticación y funcionalidad del servicio. No usamos cookies de seguimiento ni publicidad.",
      "accept": "Aceptar",
      "decline": "Rechazar",
      "learnMore": "Saber Más",
      "essentialOnly": "Solo Esenciales",
      "managePreferences": "Gestionar Preferencias"
    },
    "dataRequest": {
      "title": "Solicitud de Datos",
      "description": "Puedes solicitar una copia de todos tus datos o solicitar la eliminación de tu cuenta.",
      "downloadData": "Descargar Mis Datos",
      "deleteAccount": "Eliminar Cuenta",
      "processing": "Procesando tu solicitud..."
    },
    "consent": {
      "title": "Tu Consentimiento",
      "description": "Al usar este servicio, aceptas nuestros términos y política de privacidad.",
      "withdraw": "Retirar Consentimiento"
    }
  },
  "dispatch": {
    "registration": {
      "pageTitle": "Registro de Despacho de Emergencia",
      "pageDescription": "Registre su organización de servicios de emergencia para acceder a la información del Árbol de Llaves de Puerta durante emergencias.",
      "alreadyRegistered": "¿Ya está registrado? Iniciar sesión",
      "infoTitle": "Lo que necesitará:",
      "infoPoint1": "Información legal de la organización (ID fiscal, seguro)",
      "infoPoint2": "Datos de contacto del agente registrado",
      "infoPoint3": "Información del contacto principal",
      "steps": {
        "organization": {
          "title": "Información de la Organización",
          "description": "Cuéntenos sobre su organización de servicios de emergencia"
        },
        "legal": {
          "title": "Responsabilidad Legal",
          "description": "Proporcione información legal y de seguros para verificación"
        },
        "contact": {
          "title": "Contacto Principal",
          "description": "Designe un contacto principal para su organización"
        },
        "account": {
          "title": "Configuración de Cuenta",
          "description": "Cree las credenciales de su cuenta de despacho"
        },
        "review": {
          "title": "Revisar y Enviar",
          "description": "Revise su información antes de enviar"
        }
      },
      "fields": {
        "organizationName": "Nombre de la Organización",
        "organizationType": "Tipo de Organización",
        "organizationCode": "Código de Organización",
        "jurisdictions": "Jurisdicciones Atendidas",
        "taxId": "ID Fiscal / EIN",
        "insuranceCarrier": "Compañía de Seguros",
        "policyNumber": "Número de Póliza",
        "registeredAgentName": "Nombre del Agente Registrado",
        "registeredAgentContact": "Contacto del Agente Registrado",
        "primaryContactName": "Nombre del Contacto Principal",
        "primaryContactEmail": "Correo del Contacto Principal",
        "primaryContactPhone": "Teléfono del Contacto Principal",
        "dispatchCenterPhone": "Teléfono del Centro de Despacho (24/7)",
        "dispatchCenterAddress": "Dirección del Centro de Despacho",
        "password": "Contraseña",
        "confirmPassword": "Confirmar Contraseña"
      },
      "placeholders": {
        "organizationName": "Departamento de Policía de la Ciudad",
        "organizationCode": "ej., NYPD, LAFD",
        "jurisdiction": "Añadir jurisdicción (ciudad, condado, estado)",
        "taxId": "XX-XXXXXXX",
        "insuranceCarrier": "Nombre de la compañía de seguros",
        "policyNumber": "Número de póliza",
        "registeredAgentName": "Nombre legal completo",
        "registeredAgentContact": "Teléfono o correo electrónico",
        "primaryContactName": "Nombre completo",
        "primaryContactEmail": "despacho@ejemplo.gov",
        "dispatchCenterAddress": "123 Calle Principal, Ciudad, Estado",
        "password": "Mínimo 8 caracteres",
        "confirmPassword": "Vuelva a ingresar la contraseña"
      },
      "hints": {
        "organizationCode": "Código interno del departamento (opcional)",
        "password": "Use una contraseña segura con al menos 8 caracteres"
      },
      "optionalFields": "Información Opcional",
      "legalNotice": "Esta información se utilizará para verificación y responsabilidad legal. Todos los datos están sujetos a auditoría.",
      "terms": {
        "agree": "Acepto los",
        "termsOfService": "Términos de Servicio de Emergencias",
        "and": "y",
        "privacyPolicy": "Política de Manejo de Datos",
        "dataProcessing": "Entiendo que las solicitudes de acceso serán registradas y auditadas."
      },
      "review": {
        "organization": "Organización",
        "legal": "Información Legal",
        "contact": "Información de Contacto",
        "verificationTitle": "Proceso de Verificación",
        "verificationDescription": "Su solicitud será revisada por nuestro equipo. Recibirá un correo electrónico cuando su cuenta sea verificada o si se necesita información adicional."
      },
      "submitting": "Enviando...",
      "submit": "Enviar Solicitud",
      "success": "¡Solicitud enviada exitosamente! Recibirá un correo electrónico cuando sea verificado.",
      "errors": {
        "emailExists": "Ya existe una cuenta con este correo electrónico",
        "generic": "Error al enviar la solicitud. Por favor intente de nuevo."
      },
      "footer": {
        "questions": "¿Preguntas sobre el proceso de verificación?"
      }
    },
    "login": {
      "title": "Inicio de Sesión de Cuenta de Despacho",
      "subtitle": "Inicie sesión para acceder al Panel de Despacho de Emergencia",
      "fields": {
        "email": "Correo Electrónico",
        "password": "Contraseña"
      },
      "placeholders": {
        "email": "despacho@ejemplo.gov",
        "password": "Su contraseña"
      },
      "validation": {
        "invalidEmail": "Por favor ingrese una dirección de correo electrónico válida",
        "passwordRequired": "La contraseña es requerida"
      },
      "button": "Iniciar Sesión",
      "submitting": "Iniciando sesión...",
      "success": "¡Bienvenido de nuevo!",
      "verificationNote": "Solo las cuentas de despacho verificadas pueden acceder a la información de residentes. Las cuentas pendientes tienen acceso limitado.",
      "noAccount": "¿No tiene una cuenta?",
      "register": "Registre su organización",
      "forgotPassword": "¿Olvidó su contraseña?",
      "errors": {
        "invalidCredentials": "Correo electrónico o contraseña inválidos",
        "suspended": "Esta cuenta ha sido suspendida. Contacte a soporte para asistencia.",
        "generic": "Error al iniciar sesión. Por favor intente de nuevo."
      }
    },
    "dashboard": {
      "signOut": "Cerrar Sesión",
      "verificationPending": {
        "title": "Verificación de Cuenta Pendiente",
        "description": "La solicitud de su organización está siendo revisada. Recibirá un correo electrónico cuando sea verificado. El acceso completo a la búsqueda de residentes solo está disponible después de la verificación."
      },
      "verificationRejected": {
        "title": "Verificación de Cuenta Rechazada",
        "description": "La solicitud de su organización no fue aprobada. Por favor contacte a soporte para más información."
      },
      "search": {
        "title": "Búsqueda de Residentes",
        "placeholder": "Ingrese dirección para buscar...",
        "addressLabel": "Dirección",
        "button": "Buscar",
        "verificationRequired": "La búsqueda solo está disponible para cuentas verificadas",
        "anonymous": "Residente Anónimo",
        "keysAvailable": "Llaves Disponibles",
        "requestAccess": "Solicitar Acceso"
      },
      "recentRequests": {
        "title": "Solicitudes de Acceso Recientes",
        "empty": "Aún no hay solicitudes de acceso"
      },
      "status": {
        "pending": "Pendiente",
        "approved": "Aprobado",
        "denied": "Denegado",
        "expired": "Expirado"
      },
      "accountInfo": {
        "title": "Información de la Cuenta",
        "organization": "Organización",
        "type": "Tipo",
        "status": "Estado"
      },
      "quickActions": {
        "title": "Acciones Rápidas",
        "apiKeys": "Gestionar Claves API",
        "accessLogs": "Ver Registros de Acceso"
      },
      "requestDialog": {
        "title": "Solicitar Acceso al Árbol de Llaves de Puerta",
        "description": "Proporcione detalles de emergencia y base legal para acceder a la información del portador de llaves del residente.",
        "emergencyScenario": "Escenario de Emergencia",
        "selectScenario": "Seleccione tipo de emergencia",
        "emergencyDescription": "Descripción de la Emergencia",
        "descriptionPlaceholder": "Describa la situación de emergencia...",
        "legalBasis": "Base Legal para el Acceso",
        "selectLegalBasis": "Seleccione base legal",
        "caseNumber": "Número de Caso / Incidente",
        "caseNumberPlaceholder": "ej., INC-2024-12345",
        "officerName": "Nombre del Oficial Solicitante",
        "officerNamePlaceholder": "Nombre completo",
        "badgeNumber": "Número de Placa",
        "badgePlaceholder": "Opcional",
        "legalWarning": "Todas las solicitudes de acceso son registradas y auditadas. El acceso no autorizado puede resultar en suspensión de cuenta y acciones legales.",
        "submitting": "Enviando...",
        "submit": "Enviar Solicitud de Acceso"
      },
      "requestSubmitted": "Solicitud de acceso enviada exitosamente",
      "errors": {
        "requiredFields": "Por favor complete todos los campos requeridos",
        "requestFailed": "Error al enviar la solicitud de acceso"
      }
    }
  },
  "admin": {
    "dispatch": {
      "searchPlaceholder": "Buscar por organización, correo electrónico o nombre de contacto...",
      "filters": {
        "all": "Todas las Cuentas"
      },
      "noAccounts": "No se encontraron cuentas que coincidan con sus criterios",
      "accessDenied": {
        "title": "Acceso Denegado",
        "description": "No tiene permiso para acceder al panel de verificación de despacho."
      },
      "actions": {
        "verify": "Verificar",
        "reject": "Rechazar",
        "suspend": "Suspender"
      },
      "success": {
        "verify": "Cuenta verificada exitosamente",
        "reject": "Cuenta rechazada",
        "suspend": "Cuenta suspendida"
      },
      "errors": {
        "fetchFailed": "Error al obtener las cuentas",
        "actionFailed": "Acción fallida. Por favor intente de nuevo."
      },
      "detail": {
        "description": "Revise los detalles de la organización y documentos de verificación",
        "organization": "Detalles de la Organización",
        "name": "Nombre",
        "type": "Tipo",
        "jurisdictions": "Jurisdicciones",
        "legal": "Información Legal",
        "taxId": "ID Fiscal",
        "insurance": "Compañía de Seguros",
        "policyNumber": "Número de Póliza",
        "registeredAgent": "Agente Registrado",
        "contact": "Información de Contacto",
        "contactName": "Nombre del Contacto",
        "contactEmail": "Correo Electrónico",
        "contactPhone": "Teléfono",
        "status": "Estado de la Cuenta",
        "verificationStatus": "Estado",
        "createdAt": "Fecha de Solicitud",
        "rejectionReason": "Motivo de Rechazo"
      },
      "confirm": {
        "verifyTitle": "¿Verificar Cuenta?",
        "verifyDescription": "Esto otorgará a la organización acceso a la información del Árbol de Llaves de Puerta de los residentes durante emergencias.",
        "rejectTitle": "¿Rechazar Cuenta?",
        "rejectDescription": "Por favor proporcione un motivo de rechazo. Esto se compartirá con la organización.",
        "suspendTitle": "¿Suspender Cuenta?",
        "suspendDescription": "Esto revocará inmediatamente el acceso de la organización. Por favor proporcione un motivo.",
        "reason": "Motivo",
        "reasonPlaceholder": "Explique por qué esta cuenta está siendo rechazada/suspendida...",
        "processing": "Procesando..."
      }
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

console.log('Spanish translations completed successfully!');
console.log('Updated sections: labels, emptyStates, reserved, dashboard, tierSection, nayborSOS, callActions, onboarding, keysShared, post, contactMethods, dev, addLinkedFriend, gdpr, dispatch (registration, login, dashboard), admin.dispatch');
