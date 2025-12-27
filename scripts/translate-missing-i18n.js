import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Comprehensive translation script for all missing i18n keys
 * Covers: dispatch, gdpr, keysShared, emptyState, admin, dashboard, tending,
 * nayborSOS, contactMethods, addLinkedFriend, onboarding, mission, callActions,
 * post, dev, landing, auth, privacy, terms
 */

const translations = {
  // Spanish
  es: {
    dispatch: {
      validation: {
        organizationNameRequired: "Se requiere el nombre de la organización",
        jurisdictionRequired: "Se requiere al menos una jurisdicción",
        taxIdRequired: "Se requiere un ID fiscal válido",
        insuranceCarrierRequired: "Se requiere el asegurador",
        policyNumberRequired: "Se requiere el número de póliza",
        registeredAgentNameRequired: "Se requiere el nombre del agente registrado",
        registeredAgentContactRequired: "Se requiere el contacto del agente registrado",
        contactNameRequired: "Se requiere el nombre del contacto",
        validEmailRequired: "Se requiere un correo electrónico válido",
        validPhoneRequired: "Se requiere un teléfono válido",
        passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
        mustAcceptTerms: "Debes aceptar los términos",
        passwordsMustMatch: "Las contraseñas no coinciden"
      }
    },
    privacy: {
      philosophy: {
        title: "Nuestra Filosofía de Privacidad Primero",
        description: "Inner Friend Circle está construido por Lifesaver Labs con la privacidad como principio fundamental. Creemos que tus relaciones son profundamente personales y tratamos tus datos con el respeto que merecen. Solo recopilamos lo necesario para proporcionar el servicio y nunca vendemos tus datos a terceros."
      },
      dataCollection: {
        title: "Qué Datos Recopilamos",
        accountInfo: {
          title: "Información de la Cuenta",
          description: "Dirección de correo electrónico y contraseña (con hash seguro) para autenticación. Nombre para mostrar opcional."
        },
        friendData: {
          title: "Datos de Amigos",
          description: "Nombres, información de contacto (correo, teléfono), notas y clasificaciones de nivel que creas. Esto se almacena para proporcionar la funcionalidad principal del servicio."
        },
        emergencyData: {
          title: "Datos de Acceso de Emergencia (Llaves Compartidas)",
          description: "Si usas la función Llaves Compartidas, almacenamos tu dirección, información de portadores de llaves y preferencias de acceso de emergencia. Estos datos son especialmente sensibles y están protegidos en consecuencia."
        },
        usageData: {
          title: "Datos de Uso",
          description: "Podemos recopilar información básica de uso para mejorar el servicio, pero no usamos herramientas de análisis o seguimiento de terceros."
        }
      },
      dataUsage: {
        title: "Cómo Usamos Tus Datos",
        provide: "Para proporcionar y mantener el servicio Inner Friend Circle",
        matching: "Para habilitar la coincidencia mutua cuando tú y otro usuario se incluyen mutuamente",
        emergency: "Para facilitar la coordinación de emergencia con vecinos si habilitas Llaves Compartidas",
        notifications: "Para enviarte notificaciones importantes del servicio (nunca marketing)",
        improve: "Para mejorar y desarrollar nuevas funciones"
      },
      dataStorage: {
        title: "Almacenamiento y Seguridad de Datos",
        description: "Tus datos se almacenan de forma segura usando Supabase, un proveedor de infraestructura confiable. Todos los datos están encriptados en tránsito (HTTPS/TLS) y en reposo. Implementamos seguridad a nivel de fila para asegurar que solo puedas acceder a tus propios datos."
      },
      rights: {
        title: "Tus Derechos (GDPR y Liberación de Datos)",
        access: {
          title: "Derecho de Acceso y Exportación",
          description: "Puedes exportar todos tus datos en cualquier momento en formato JSON portátil. Usa la función de Exportación en tu panel. Tus datos te pertenecen."
        },
        deletion: {
          title: "Derecho de Eliminación",
          description: "Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento desde Configuración. La eliminación es permanente y se propaga a todos tus datos."
        },
        rectification: {
          title: "Derecho de Rectificación",
          description: "Puedes editar tus datos en cualquier momento a través de la interfaz de la aplicación."
        },
        object: {
          title: "Derecho de Oposición",
          description: "Puedes optar por no participar en funciones específicas como compartir con trabajadores de emergencia para datos de Llaves Compartidas."
        }
      },
      thirdParties: {
        title: "Servicios de Terceros",
        supabase: {
          name: "Supabase",
          description: "Nuestro proveedor de base de datos y autenticación. Procesan datos en nuestro nombre bajo estrictos acuerdos de procesamiento de datos."
        },
        noTracking: "No usamos ninguna red publicitaria, rastreadores de redes sociales ni servicios de análisis de terceros."
      },
      cookies: {
        title: "Cookies y Almacenamiento Local",
        description: "Solo usamos cookies/almacenamiento local esenciales para la gestión de sesiones de autenticación. No usamos cookies de seguimiento, cookies publicitarias ni cookies no esenciales."
      },
      children: {
        title: "Privacidad de Menores",
        description: "Inner Friend Circle no está destinado a niños menores de 13 años. No recopilamos intencionalmente información personal de niños menores de 13 años."
      },
      retention: {
        title: "Retención de Datos",
        description: "Retenemos tus datos mientras tu cuenta esté activa. Cuando eliminas tu cuenta, todos los datos asociados se eliminan permanentemente en 30 días."
      },
      contact: {
        title: "Contáctanos",
        description: "Para preguntas relacionadas con la privacidad o para ejercer tus derechos, contáctanos en:",
        email: "Correo electrónico",
        github: "GitHub"
      },
      changes: {
        title: "Cambios a Esta Política",
        description: "Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva política en esta página."
      }
    },
    terms: {
      introduction: {
        title: "1. Introducción",
        description: "Bienvenido a Inner Friend Circle, un servicio proporcionado por Lifesaver Labs. Al acceder o usar nuestro servicio, aceptas estar sujeto a estos Términos de Servicio."
      },
      service: {
        title: "2. Descripción del Servicio",
        description: "Inner Friend Circle es una herramienta de gestión de relaciones que prioriza la privacidad y te ayuda a mantener conexiones significativas basadas en la investigación del número de Dunbar.",
        features: {
          tiers: "Organización de amigos en niveles significativos (Core, Inner, Outer, Naybor, etc.)",
          matching: "Coincidencia mutua opcional para descubrir amistades recíprocas",
          keysShared: "Coordinación de acceso de emergencia Llaves Compartidas para vecinos",
          dataExport: "Funciones de exportación y portabilidad de datos"
        }
      },
      userAccounts: {
        title: "3. Cuentas de Usuario",
        description: "Eres responsable de proteger las credenciales de tu cuenta y de cualquier actividad o acción bajo tu cuenta."
      },
      acceptableUse: {
        title: "4. Uso Aceptable",
        intro: "Aceptas no usar el servicio para:",
        prohibited: {
          harm: "Almacenar información sobre otros sin su conocimiento de maneras que podrían dañarlos",
          harassment: "Participar en acoso, hostigamiento o vigilancia de otros",
          laws: "Violar cualquier ley o regulación aplicable",
          unauthorized: "Intentar obtener acceso no autorizado a los datos de otros usuarios",
          misuse: "Usar las funciones de emergencia para propósitos no emergentes",
          impersonate: "Suplantar a otros o tergiversar tu identidad"
        }
      },
      userContent: {
        title: "5. Contenido del Usuario",
        description: "Conservas la propiedad de todo el contenido que creas dentro del servicio. No reclamamos propiedad sobre tus datos."
      },
      keysShared: {
        title: "6. Llaves Compartidas y Funciones de Emergencia",
        description: "La función Llaves Compartidas te permite designar vecinos de confianza que tienen acceso a tu hogar en emergencias.",
        points: {
          risks: "Reconoces que compartir información de llaves/acceso conlleva riesgos inherentes",
          trust: "Eres responsable de asegurarte de confiar en los vecinos que designas",
          liability: "No somos responsables de las acciones tomadas por tus portadores de llaves designados",
          emergencyWorkers: "Si habilitas el compartir con trabajadores de emergencia, las cuentas de despacho verificadas pueden acceder a tu información",
          disable: "Puedes deshabilitar el compartir con trabajadores de emergencia en cualquier momento"
        }
      },
      dataLiberation: {
        title: "7. Liberación de Datos",
        description: "Creemos que tus datos te pertenecen. Tienes derecho a exportar todos tus datos en cualquier momento. Nunca retendremos tus datos como rehén."
      },
      privacy: {
        title: "8. Privacidad",
        description: "Tu uso del servicio también se rige por nuestra Política de Privacidad, que se incorpora a estos Términos por referencia."
      },
      intellectualProperty: {
        title: "9. Propiedad Intelectual",
        description: "Inner Friend Circle es software de código abierto. El código fuente está disponible bajo los términos de su licencia de código abierto."
      },
      liability: {
        title: "10. Limitación de Responsabilidad",
        description: "EL SERVICIO SE PROPORCIONA \"TAL CUAL\" SIN GARANTÍAS DE NINGÚN TIPO.",
        includes: "Esto incluye, pero no se limita a, daños derivados de: acciones tomadas por tus portadores de llaves designados, retrasos en respuesta de emergencia, pérdida de datos o interrupciones del servicio."
      },
      indemnification: {
        title: "11. Indemnización",
        description: "Aceptas indemnizar y mantener indemne a Lifesaver Labs de cualquier reclamación, daño o gasto derivado de tu uso del servicio."
      },
      termination: {
        title: "12. Terminación",
        description: "Puedes terminar tu cuenta en cualquier momento eliminándola a través de Configuración."
      },
      changes: {
        title: "13. Cambios a los Términos",
        description: "Nos reservamos el derecho de modificar estos Términos en cualquier momento."
      },
      governingLaw: {
        title: "14. Ley Aplicable",
        description: "Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables."
      },
      severability: {
        title: "15. Divisibilidad",
        description: "Si alguna disposición de estos Términos se considera inaplicable o inválida, esa disposición se limitará o eliminará en la medida mínima necesaria."
      },
      contact: {
        title: "16. Contacto",
        description: "Para preguntas sobre estos Términos, contáctanos en:",
        email: "Correo electrónico",
        github: "GitHub"
      }
    },
    emptyState: {
      noPostsYet: "Aún no hay publicaciones",
      noFriendsYet: {
        core: "Aún no hay amigos centrales",
        inner: "Aún no hay amigos en el círculo interno",
        outer: "Aún no hay amigos en el círculo externo"
      },
      noPostsDescription: {
        core: "Tus amigos centrales aún no han compartido nada. ¡Sé el primero en publicar!",
        inner: "Tus amigos del círculo interno aún no han compartido nada.",
        outer: "Tus amigos del círculo externo aún no han compartido nada."
      },
      getStarted: {
        core: "Comienza agregando hasta 5 amigos a tu círculo Core.",
        inner: "Comienza agregando hasta 15 amigos a tu círculo Inner.",
        outer: "Comienza agregando hasta 150 amigos a tu círculo Outer."
      },
      addToSee: {
        core: "Agrega hasta 5 amigos para ver sus publicaciones aquí.",
        inner: "Agrega hasta 15 amigos para ver sus publicaciones aquí.",
        outer: "Agrega hasta 150 amigos para ver sus publicaciones aquí."
      },
      addFriends: {
        core: "Agregar Amigos Core",
        inner: "Agregar Amigos del Círculo Interno",
        outer: "Agregar Amigos del Círculo Externo"
      },
      createPost: "Crear una Publicación",
      noParasoicalsYet: "Aún no hay parasociales"
    },
    mission: {
      title: "Tiempo Real, No Tiempo de Anuncios",
      description: "Ganamos cuando sales de nuestro sitio — para compartir momentos reales con las personas que más importan.",
      learnMore: "Saber más...",
      showLess: "Mostrar menos",
      inspiration: "¿Nuestra inspiración? Este clásico comercial de Dentyne Ice — el recordatorio perfecto de que los mejores momentos suceden cuando dejas el teléfono y te presentas:",
      videoTitle: "Dentyne Ice - Face Time",
      quote: "\"Haz Tiempo Real\" — ese es el ideal. Cuando la distancia te separa, te ayudaremos a cerrarla con videollamadas. Pero siempre recuerda: nada supera estar ahí.",
      features: {
        spark: {
          title: "Iniciar Videollamadas",
          description: "Cuando estás lejos, un clic te conecta"
        },
        tend: {
          title: "Cuida Tus Círculos",
          description: "Recordatorios para comunicarte antes de que las conexiones se desvanezcan"
        },
        pull: {
          title: "Acerca Más",
          description: "Mueve conexiones significativas a órbitas más cercanas"
        }
      }
    },
    dashboard: {
      title: "Tu Círculo de Amigos",
      subtitle: "Gestiona tus relaciones significativas",
      addFriend: "Agregar Amigo",
      export: "Exportar",
      import: "Importar",
      settings: "Configuración",
      viewFeed: "Ver Feed",
      tendCircles: "Cuidar Círculos",
      quickStats: "Estadísticas Rápidas",
      totalFriends: "Total de Amigos",
      emptySlots: "Espacios Disponibles",
      lastTended: "Último Cuidado"
    },
    tending: {
      title: "Cuida Tus Círculos",
      markDescription: "Marca a tus amigos {{tier}} con los que no te has conectado {{period}}",
      periods: {
        core: "esta semana",
        inner: "estas dos semanas",
        outer: "estos dos meses"
      },
      peopleCount: "{{count}} persona",
      peopleCount_plural: "{{count}} personas",
      noFriendsInTier: "Aún no hay amigos en este nivel",
      checkInstruction: "✓ Marca a los que no has hablado suficiente:",
      noPhone: "sin teléfono",
      call: "Llamar",
      maybeLater: "Quizás Después",
      doneTending: "Listo",
      finish: "Terminar",
      mobileHint: "Las acciones de contacto funcionan mejor en dispositivos móviles",
      reconnect: {
        title: "Hora de Reconectar",
        description: "Estos amigos podrían usar algo de tu tiempo"
      },
      toasts: {
        allTended: "¡Increíble! Has cuidado todos tus círculos 🌱",
        noPhone: "No hay número de teléfono para {{name}}",
        connecting: "Conectando con {{name}} vía {{method}}",
        rememberReachOut: "¡Recuerda comunicarte pronto! 💛",
        friendsWaiting: "{{count}} amigo esperando saber de ti",
        friendsWaiting_plural: "{{count}} amigos esperando saber de ti"
      }
    },
    nayborSOS: {
      title: "Naybor SOS™",
      steps: {
        category: "¿Qué tipo de ayuda necesitas?",
        contacts: "Elige vecinos para contactar"
      },
      critical: "Crítico",
      criticalUrgency: "Urgencia crítica",
      emergencyWarning: "Para emergencias que amenazan la vida, llama al 911 primero",
      suggestedActions: "Acciones sugeridas:",
      addDetails: "Agregar detalles (opcional)",
      describePlaceholder: "Describe tu situación...",
      includeLocation: "Incluir información de ubicación",
      chooseNaybors: "Elegir Vecinos",
      chooseNayborsAria: "Continuar para elegir vecinos a contactar",
      nayborsSelected: "{{count}} vecino seleccionado",
      nayborsSelected_plural: "{{count}} vecinos seleccionados"
    },
    gdpr: {
      title: "Verificación de Edad",
      description: "Inner Friend Circle está diseñado para usuarios mayores de 13 años.",
      ageQuestion: "¿Tienes 13 años o más?",
      confirmAge: "Sí, tengo 13 años o más",
      underAge: "No, tengo menos de 13 años",
      underAgeMessage: "Lo sentimos, Inner Friend Circle no está disponible para usuarios menores de 13 años.",
      parentalConsent: "Si estás entre 13 y 16 años, es posible que necesites el consentimiento de tus padres según las leyes de tu país.",
      learnMore: "Más información sobre nuestras prácticas de privacidad",
      accept: "Acepto",
      decline: "Rechazar",
      consentRequired: "Se requiere consentimiento",
      consentDescription: "Para usar Inner Friend Circle, debes aceptar nuestra Política de Privacidad y Términos de Servicio.",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio"
    },
    keysShared: {
      title: "Llaves Compartidas",
      description: "Comparte de forma segura el acceso de emergencia a tu hogar con vecinos de confianza",
      setup: "Configurar Llaves Compartidas",
      enabled: "Llaves Compartidas Habilitado",
      disabled: "Llaves Compartidas Deshabilitado",
      addKeyHolder: "Agregar Portador de Llaves",
      editKeyHolder: "Editar Portador de Llaves",
      removeKeyHolder: "Eliminar Portador de Llaves",
      keyHolders: "Portadores de Llaves",
      noKeyHolders: "Aún no hay portadores de llaves",
      emergencyAccess: "Acceso de Emergencia",
      emergencyAccessDescription: "Permitir que trabajadores de emergencia verificados accedan a tu información",
      address: "Dirección",
      entryCode: "Código de Entrada",
      specialInstructions: "Instrucciones Especiales",
      trustLevel: "Nivel de Confianza",
      high: "Alto",
      medium: "Medio",
      low: "Bajo"
    },
    addLinkedFriend: {
      title: "Agregar Amigo Vinculado a {{tier}}",
      description: "Encuentra a alguien por su información de contacto para solicitar una conexión.",
      findBy: "Buscar por",
      enterUsernameHint: "Ingresa su nombre de usuario exactamente como lo configuraron",
      enterContactHint: "Ingresa su {{type}} exactamente como lo registraron",
      search: "Buscar",
      searching: "Buscando...",
      noResults: "No se encontraron resultados",
      userFound: "¡Usuario encontrado!",
      sendRequest: "Enviar Solicitud",
      requestSent: "¡Solicitud Enviada!",
      errors: {
        notFound: "No se encontró ningún usuario con esa información",
        alreadyConnected: "Ya estás conectado con este usuario",
        requestPending: "Ya tienes una solicitud pendiente con este usuario"
      }
    },
    onboarding: {
      welcome: "Bienvenido a Inner Friend Circle",
      welcomeDescription: "Vamos a configurar tus círculos de amigos",
      step1: "Agregar Amigos Core",
      step1Description: "Comienza con tus 5 relaciones más cercanas",
      step2: "Expandir Tu Círculo",
      step2Description: "Agrega amigos a tus círculos Inner y Outer",
      step3: "Conoce a Tus Vecinos",
      step3Description: "Construye tu red de vecinos para emergencias",
      skip: "Saltar por ahora",
      next: "Siguiente",
      finish: "Comenzar"
    },
    callActions: {
      startCall: "Iniciar Llamada",
      scheduleCall: "Programar Llamada",
      sendMessage: "Enviar Mensaje",
      viewProfile: "Ver Perfil",
      callNow: "Llamar Ahora",
      videoCall: "Videollamada",
      voiceCall: "Llamada de Voz"
    },
    post: {
      createPost: "Crear Publicación",
      whatOnMind: "¿Qué tienes en mente?",
      shareWith: "Compartir con",
      addPhoto: "Agregar Foto",
      addVideo: "Agregar Video",
      post: "Publicar",
      posting: "Publicando...",
      deletePost: "Eliminar Publicación",
      editPost: "Editar Publicación",
      likePost: "Me gusta",
      commentOnPost: "Comentar"
    },
    landing: {
      features: {
        dataLiberation: {
          title: "Tus Datos, Tu Manera",
          description: "Exporta todos tus datos en cualquier momento. Cumple con GDPR con control total sobre tu información."
        },
        nayborNetwork: {
          title: "Red de Vecinos",
          description: "Construye resiliencia comunitaria con vecinos de confianza. Llaves Compartidas y Naybor SOS™ te mantienen conectado cuando más importa."
        },
        globalReach: {
          title: "23 Idiomas",
          description: "Internacionalización completa con soporte RTL para árabe, hebreo y urdu."
        }
      }
    },
    admin: {
      title: "Panel de Administración",
      users: "Usuarios",
      accounts: "Cuentas",
      settings: "Configuración",
      logs: "Registros",
      dispatch: {
        title: "Cuentas de Despacho",
        pending: "Pendientes",
        verified: "Verificadas",
        rejected: "Rechazadas",
        suspended: "Suspendidas"
      }
    },
    dev: {
      label: "Dev",
      panelTitle: "Panel de Desarrollo",
      mode: "Modo de Desarrollo",
      authStatus: "Estado de Autenticación",
      notLoggedIn: "No conectado",
      clearData: "Limpiar Datos",
      resetApp: "Restablecer Aplicación"
    },
    auth: {
      toasts: {
        signOutError: "Error al cerrar sesión",
        signOutSuccess: "Sesión cerrada exitosamente"
      }
    }
  },

  // German
  de: {
    dispatch: {
      validation: {
        organizationNameRequired: "Organisationsname ist erforderlich",
        jurisdictionRequired: "Mindestens ein Zuständigkeitsbereich ist erforderlich",
        taxIdRequired: "Gültige Steuer-ID erforderlich",
        insuranceCarrierRequired: "Versicherungsträger erforderlich",
        policyNumberRequired: "Policennummer erforderlich",
        registeredAgentNameRequired: "Name des eingetragenen Vertreters erforderlich",
        registeredAgentContactRequired: "Kontakt des eingetragenen Vertreters erforderlich",
        contactNameRequired: "Kontaktname erforderlich",
        validEmailRequired: "Gültige E-Mail erforderlich",
        validPhoneRequired: "Gültige Telefonnummer erforderlich",
        passwordMinLength: "Passwort muss mindestens 8 Zeichen haben",
        mustAcceptTerms: "Sie müssen die Bedingungen akzeptieren",
        passwordsMustMatch: "Passwörter stimmen nicht überein"
      }
    },
    privacy: {
      philosophy: {
        title: "Unsere Datenschutz-First-Philosophie",
        description: "Inner Friend Circle wird von Lifesaver Labs mit Datenschutz als Kernprinzip entwickelt. Wir glauben, dass Ihre Beziehungen zutiefst persönlich sind, und behandeln Ihre Daten mit dem gebührenden Respekt."
      },
      dataCollection: {
        title: "Welche Daten wir sammeln",
        accountInfo: {
          title: "Kontoinformationen",
          description: "E-Mail-Adresse und Passwort (sicher gehasht) zur Authentifizierung. Optionaler Anzeigename."
        },
        friendData: {
          title: "Freundesdaten",
          description: "Namen, Kontaktinformationen, Notizen und Tier-Klassifizierungen, die Sie erstellen."
        },
        emergencyData: {
          title: "Notfallzugangsdaten (Keys Shared)",
          description: "Wenn Sie die Keys Shared-Funktion nutzen, speichern wir Ihre Adresse, Schlüsselhalter-Informationen und Notfallzugangseinstellungen."
        },
        usageData: {
          title: "Nutzungsdaten",
          description: "Wir können grundlegende Nutzungsinformationen sammeln, verwenden aber keine Drittanbieter-Analyse-Tools."
        }
      },
      dataUsage: {
        title: "Wie wir Ihre Daten verwenden",
        provide: "Um den Inner Friend Circle-Dienst bereitzustellen und zu warten",
        matching: "Um gegenseitiges Matching zu ermöglichen",
        emergency: "Um die Notfall-Nachbarschaftskoordination zu erleichtern",
        notifications: "Um Ihnen wichtige Servicebenachrichtigungen zu senden (niemals Marketing)",
        improve: "Um neue Funktionen zu verbessern und zu entwickeln"
      },
      dataStorage: {
        title: "Datenspeicherung & Sicherheit",
        description: "Ihre Daten werden sicher mit Supabase gespeichert. Alle Daten sind während der Übertragung und im Ruhezustand verschlüsselt."
      },
      rights: {
        title: "Ihre Rechte (DSGVO & Datenbefreiung)",
        access: {
          title: "Recht auf Zugang & Export",
          description: "Sie können alle Ihre Daten jederzeit im portablen JSON-Format exportieren."
        },
        deletion: {
          title: "Recht auf Löschung",
          description: "Sie können Ihr Konto und alle zugehörigen Daten jederzeit löschen."
        },
        rectification: {
          title: "Recht auf Berichtigung",
          description: "Sie können Ihre Daten jederzeit über die Anwendungsoberfläche bearbeiten."
        },
        object: {
          title: "Widerspruchsrecht",
          description: "Sie können bestimmte Funktionen wie die Freigabe für Notfallhelfer ablehnen."
        }
      },
      thirdParties: {
        title: "Drittanbieterdienste",
        supabase: {
          name: "Supabase",
          description: "Unser Datenbank- und Authentifizierungsanbieter."
        },
        noTracking: "Wir verwenden keine Werbenetzwerke, Social-Media-Tracker oder Drittanbieter-Analysedienste."
      },
      cookies: {
        title: "Cookies & Lokaler Speicher",
        description: "Wir verwenden nur essentielle Cookies für die Sitzungsverwaltung."
      },
      children: {
        title: "Datenschutz für Kinder",
        description: "Inner Friend Circle ist nicht für Kinder unter 13 Jahren bestimmt."
      },
      retention: {
        title: "Datenspeicherung",
        description: "Wir speichern Ihre Daten, solange Ihr Konto aktiv ist."
      },
      contact: {
        title: "Kontaktieren Sie uns",
        description: "Für datenschutzbezogene Fragen kontaktieren Sie uns unter:",
        email: "E-Mail",
        github: "GitHub"
      },
      changes: {
        title: "Änderungen an dieser Richtlinie",
        description: "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren."
      }
    },
    terms: {
      introduction: {
        title: "1. Einführung",
        description: "Willkommen bei Inner Friend Circle, einem Dienst von Lifesaver Labs."
      },
      service: {
        title: "2. Dienstbeschreibung",
        description: "Inner Friend Circle ist ein datenschutzorientiertes Beziehungsmanagement-Tool.",
        features: {
          tiers: "Organisation von Freunden in bedeutungsvolle Ebenen",
          matching: "Optionales gegenseitiges Matching",
          keysShared: "Keys Shared Notfallzugangskoordination",
          dataExport: "Datenexport und Portabilitätsfunktionen"
        }
      },
      userAccounts: {
        title: "3. Benutzerkonten",
        description: "Sie sind für den Schutz Ihrer Kontoanmeldedaten verantwortlich."
      },
      acceptableUse: {
        title: "4. Akzeptable Nutzung",
        intro: "Sie stimmen zu, den Dienst nicht zu nutzen für:",
        prohibited: {
          harm: "Speichern von Informationen über andere ohne deren Wissen",
          harassment: "Stalking, Belästigung oder Überwachung anderer",
          laws: "Verletzung geltender Gesetze",
          unauthorized: "Unbefugten Zugriff auf Daten anderer",
          misuse: "Missbrauch von Notfallfunktionen",
          impersonate: "Identitätsdiebstahl"
        }
      },
      userContent: {
        title: "5. Benutzerinhalte",
        description: "Sie behalten das Eigentum an allen Inhalten, die Sie erstellen."
      },
      keysShared: {
        title: "6. Keys Shared & Notfallfunktionen",
        description: "Die Keys Shared-Funktion ermöglicht es Ihnen, vertrauenswürdige Nachbarn zu benennen.",
        points: {
          risks: "Sie erkennen an, dass das Teilen von Schlüsselinformationen Risiken birgt",
          trust: "Sie sind dafür verantwortlich, Ihren designierten Nachbarn zu vertrauen",
          liability: "Wir haften nicht für Handlungen Ihrer Schlüsselhalter",
          emergencyWorkers: "Verifizierte Einsatzkräfte können auf Ihre Informationen zugreifen",
          disable: "Sie können die Freigabe jederzeit deaktivieren"
        }
      },
      dataLiberation: {
        title: "7. Datenbefreiung",
        description: "Wir glauben, dass Ihre Daten Ihnen gehören."
      },
      privacy: {
        title: "8. Datenschutz",
        description: "Ihre Nutzung unterliegt auch unserer Datenschutzrichtlinie."
      },
      intellectualProperty: {
        title: "9. Geistiges Eigentum",
        description: "Inner Friend Circle ist Open-Source-Software."
      },
      liability: {
        title: "10. Haftungsbeschränkung",
        description: "DER DIENST WIRD \"WIE BESEHEN\" OHNE GARANTIEN BEREITGESTELLT.",
        includes: "Dies umfasst Schäden durch Schlüsselhalter, Notfallverzögerungen, Datenverlust."
      },
      indemnification: {
        title: "11. Freistellung",
        description: "Sie stimmen zu, Lifesaver Labs schadlos zu halten."
      },
      termination: {
        title: "12. Kündigung",
        description: "Sie können Ihr Konto jederzeit kündigen."
      },
      changes: {
        title: "13. Änderungen der Bedingungen",
        description: "Wir behalten uns das Recht vor, diese Bedingungen zu ändern."
      },
      governingLaw: {
        title: "14. Anwendbares Recht",
        description: "Diese Bedingungen unterliegen dem anwendbaren Recht."
      },
      severability: {
        title: "15. Salvatorische Klausel",
        description: "Wenn eine Bestimmung ungültig ist, bleiben die übrigen in Kraft."
      },
      contact: {
        title: "16. Kontakt",
        description: "Bei Fragen kontaktieren Sie uns unter:",
        email: "E-Mail",
        github: "GitHub"
      }
    },
    emptyState: {
      noPostsYet: "Noch keine Beiträge",
      noFriendsYet: {
        core: "Noch keine Core-Freunde",
        inner: "Noch keine Inner Circle-Freunde",
        outer: "Noch keine Outer Circle-Freunde"
      },
      noPostsDescription: {
        core: "Ihre Core-Freunde haben noch nichts geteilt.",
        inner: "Ihre Inner Circle-Freunde haben noch nichts geteilt.",
        outer: "Ihre Outer Circle-Freunde haben noch nichts geteilt."
      },
      getStarted: {
        core: "Beginnen Sie mit bis zu 5 Freunden in Ihrem Core.",
        inner: "Beginnen Sie mit bis zu 15 Freunden in Ihrem Inner Circle.",
        outer: "Beginnen Sie mit bis zu 150 Freunden in Ihrem Outer Circle."
      },
      addToSee: {
        core: "Fügen Sie bis zu 5 Freunde hinzu, um ihre Beiträge zu sehen.",
        inner: "Fügen Sie bis zu 15 Freunde hinzu, um ihre Beiträge zu sehen.",
        outer: "Fügen Sie bis zu 150 Freunde hinzu, um ihre Beiträge zu sehen."
      },
      addFriends: {
        core: "Core-Freunde hinzufügen",
        inner: "Inner Circle-Freunde hinzufügen",
        outer: "Outer Circle-Freunde hinzufügen"
      },
      createPost: "Beitrag erstellen",
      noParasoicalsYet: "Noch keine Parasoziale"
    },
    mission: {
      title: "Echte Zeit, keine Werbezeit",
      description: "Wir gewinnen, wenn Sie unsere Seite verlassen — um echte Momente mit den wichtigsten Menschen zu teilen.",
      learnMore: "Mehr erfahren...",
      showLess: "Weniger anzeigen",
      inspiration: "Unsere Inspiration? Dieser klassische Dentyne Ice-Werbespot.",
      videoTitle: "Dentyne Ice - Face Time",
      quote: "\"Echte Zeit machen\" — das ist das Ideal.",
      features: {
        spark: {
          title: "Videoanrufe starten",
          description: "Wenn Sie getrennt sind, verbindet Sie ein Klick"
        },
        tend: {
          title: "Pflegen Sie Ihre Kreise",
          description: "Erinnerungen, sich zu melden, bevor Verbindungen verblassen"
        },
        pull: {
          title: "Näher ziehen",
          description: "Bedeutungsvolle Verbindungen in engere Umlaufbahnen bringen"
        }
      }
    },
    dashboard: {
      title: "Ihr Freundeskreis",
      subtitle: "Verwalten Sie Ihre bedeutungsvollen Beziehungen",
      addFriend: "Freund hinzufügen",
      export: "Exportieren",
      import: "Importieren",
      settings: "Einstellungen",
      viewFeed: "Feed anzeigen",
      tendCircles: "Kreise pflegen",
      quickStats: "Schnellstatistik",
      totalFriends: "Gesamt Freunde",
      emptySlots: "Freie Plätze",
      lastTended: "Zuletzt gepflegt"
    },
    tending: {
      title: "Pflegen Sie Ihre Kreise",
      markDescription: "Markieren Sie Ihre {{tier}}-Freunde, mit denen Sie sich {{period}} nicht verbunden haben",
      periods: {
        core: "diese Woche",
        inner: "diese zwei Wochen",
        outer: "diese zwei Monate"
      },
      peopleCount: "{{count}} Person",
      peopleCount_plural: "{{count}} Personen",
      noFriendsInTier: "Noch keine Freunde in dieser Stufe",
      checkInstruction: "✓ Markieren Sie die, mit denen Sie nicht genug gesprochen haben:",
      noPhone: "keine Telefonnummer",
      call: "Anrufen",
      maybeLater: "Vielleicht später",
      doneTending: "Fertig gepflegt",
      finish: "Beenden",
      mobileHint: "Kontaktaktionen funktionieren am besten auf Mobilgeräten",
      reconnect: {
        title: "Zeit zum Wiederverbinden",
        description: "Diese Freunde könnten etwas von Ihrer Zeit gebrauchen"
      },
      toasts: {
        allTended: "Erstaunlich! Sie haben alle Ihre Kreise gepflegt 🌱",
        noPhone: "Keine Telefonnummer für {{name}}",
        connecting: "Verbindung mit {{name}} über {{method}}",
        rememberReachOut: "Denken Sie daran, sich bald zu melden! 💛",
        friendsWaiting: "{{count}} Freund wartet darauf, von Ihnen zu hören",
        friendsWaiting_plural: "{{count}} Freunde warten darauf, von Ihnen zu hören"
      }
    },
    nayborSOS: {
      title: "Naybor SOS™",
      steps: {
        category: "Welche Art von Hilfe brauchen Sie?",
        contacts: "Wählen Sie Nachbarn zum Kontaktieren"
      },
      critical: "Kritisch",
      criticalUrgency: "Kritische Dringlichkeit",
      emergencyWarning: "Bei lebensbedrohlichen Notfällen zuerst 112 anrufen",
      suggestedActions: "Vorgeschlagene Aktionen:",
      addDetails: "Details hinzufügen (optional)",
      describePlaceholder: "Beschreiben Sie Ihre Situation...",
      includeLocation: "Standortinformationen einschließen",
      chooseNaybors: "Nachbarn wählen",
      chooseNayborsAria: "Weiter zur Auswahl der Nachbarn",
      nayborsSelected: "{{count}} Nachbar ausgewählt",
      nayborsSelected_plural: "{{count}} Nachbarn ausgewählt"
    },
    gdpr: {
      title: "Altersverifizierung",
      description: "Inner Friend Circle ist für Benutzer ab 13 Jahren gedacht.",
      ageQuestion: "Sind Sie 13 Jahre oder älter?",
      confirmAge: "Ja, ich bin 13 oder älter",
      underAge: "Nein, ich bin unter 13",
      underAgeMessage: "Leider ist Inner Friend Circle nicht für Benutzer unter 13 Jahren verfügbar.",
      parentalConsent: "Wenn Sie zwischen 13 und 16 Jahre alt sind, benötigen Sie möglicherweise elterliche Zustimmung.",
      learnMore: "Mehr über unsere Datenschutzpraktiken erfahren",
      accept: "Akzeptieren",
      decline: "Ablehnen",
      consentRequired: "Zustimmung erforderlich",
      consentDescription: "Um Inner Friend Circle zu nutzen, müssen Sie unsere Datenschutzrichtlinie und Nutzungsbedingungen akzeptieren.",
      privacyPolicy: "Datenschutzrichtlinie",
      termsOfService: "Nutzungsbedingungen"
    },
    keysShared: {
      title: "Keys Shared",
      description: "Teilen Sie sicher den Notfallzugang zu Ihrem Zuhause mit vertrauenswürdigen Nachbarn",
      setup: "Keys Shared einrichten",
      enabled: "Keys Shared aktiviert",
      disabled: "Keys Shared deaktiviert",
      addKeyHolder: "Schlüsselhalter hinzufügen",
      editKeyHolder: "Schlüsselhalter bearbeiten",
      removeKeyHolder: "Schlüsselhalter entfernen",
      keyHolders: "Schlüsselhalter",
      noKeyHolders: "Noch keine Schlüsselhalter",
      emergencyAccess: "Notfallzugang",
      emergencyAccessDescription: "Verifizierte Notfallhelfer können auf Ihre Informationen zugreifen",
      address: "Adresse",
      entryCode: "Zugangscode",
      specialInstructions: "Besondere Anweisungen",
      trustLevel: "Vertrauensstufe",
      high: "Hoch",
      medium: "Mittel",
      low: "Niedrig"
    },
    addLinkedFriend: {
      title: "Verknüpften Freund zu {{tier}} hinzufügen",
      description: "Finden Sie jemanden über seine Kontaktdaten.",
      findBy: "Suchen nach",
      enterUsernameHint: "Geben Sie den Benutzernamen genau ein",
      enterContactHint: "Geben Sie {{type}} genau wie registriert ein",
      search: "Suchen",
      searching: "Suche...",
      noResults: "Keine Ergebnisse gefunden",
      userFound: "Benutzer gefunden!",
      sendRequest: "Anfrage senden",
      requestSent: "Anfrage gesendet!",
      errors: {
        notFound: "Kein Benutzer mit diesen Informationen gefunden",
        alreadyConnected: "Sie sind bereits mit diesem Benutzer verbunden",
        requestPending: "Sie haben bereits eine ausstehende Anfrage"
      }
    },
    onboarding: {
      welcome: "Willkommen bei Inner Friend Circle",
      welcomeDescription: "Lassen Sie uns Ihre Freundeskreise einrichten",
      step1: "Core-Freunde hinzufügen",
      step1Description: "Beginnen Sie mit Ihren 5 engsten Beziehungen",
      step2: "Erweitern Sie Ihren Kreis",
      step2Description: "Fügen Sie Freunde zu Inner und Outer hinzu",
      step3: "Kennen Sie Ihre Nachbarn",
      step3Description: "Bauen Sie Ihr Nachbarschaftsnetzwerk für Notfälle auf",
      skip: "Vorerst überspringen",
      next: "Weiter",
      finish: "Starten"
    },
    callActions: {
      startCall: "Anruf starten",
      scheduleCall: "Anruf planen",
      sendMessage: "Nachricht senden",
      viewProfile: "Profil anzeigen",
      callNow: "Jetzt anrufen",
      videoCall: "Videoanruf",
      voiceCall: "Sprachanruf"
    },
    post: {
      createPost: "Beitrag erstellen",
      whatOnMind: "Was beschäftigt Sie?",
      shareWith: "Teilen mit",
      addPhoto: "Foto hinzufügen",
      addVideo: "Video hinzufügen",
      post: "Posten",
      posting: "Wird gepostet...",
      deletePost: "Beitrag löschen",
      editPost: "Beitrag bearbeiten",
      likePost: "Gefällt mir",
      commentOnPost: "Kommentieren"
    },
    landing: {
      features: {
        dataLiberation: {
          title: "Ihre Daten, Ihre Art",
          description: "Exportieren Sie alle Ihre Daten jederzeit. DSGVO-konform mit voller Kontrolle."
        },
        nayborNetwork: {
          title: "Nachbarnetzwerk",
          description: "Bauen Sie Gemeinschaftsresilienz mit vertrauenswürdigen Nachbarn auf."
        },
        globalReach: {
          title: "23 Sprachen",
          description: "Volle Internationalisierung mit RTL-Unterstützung."
        }
      }
    },
    admin: {
      title: "Admin-Panel",
      users: "Benutzer",
      accounts: "Konten",
      settings: "Einstellungen",
      logs: "Protokolle",
      dispatch: {
        title: "Einsatzkonten",
        pending: "Ausstehend",
        verified: "Verifiziert",
        rejected: "Abgelehnt",
        suspended: "Gesperrt"
      }
    },
    dev: {
      label: "Dev",
      panelTitle: "Entwickler-Panel",
      mode: "Entwicklungsmodus",
      authStatus: "Auth-Status",
      notLoggedIn: "Nicht angemeldet",
      clearData: "Daten löschen",
      resetApp: "App zurücksetzen"
    },
    auth: {
      toasts: {
        signOutError: "Abmeldung fehlgeschlagen",
        signOutSuccess: "Erfolgreich abgemeldet"
      }
    }
  },

  // French
  fr: {
    dispatch: {
      validation: {
        organizationNameRequired: "Le nom de l'organisation est requis",
        jurisdictionRequired: "Au moins une juridiction est requise",
        taxIdRequired: "Numéro fiscal valide requis",
        insuranceCarrierRequired: "Assureur requis",
        policyNumberRequired: "Numéro de police requis",
        registeredAgentNameRequired: "Nom de l'agent enregistré requis",
        registeredAgentContactRequired: "Contact de l'agent enregistré requis",
        contactNameRequired: "Nom du contact requis",
        validEmailRequired: "Email valide requis",
        validPhoneRequired: "Téléphone valide requis",
        passwordMinLength: "Le mot de passe doit contenir au moins 8 caractères",
        mustAcceptTerms: "Vous devez accepter les conditions",
        passwordsMustMatch: "Les mots de passe ne correspondent pas"
      }
    },
    privacy: {
      philosophy: {
        title: "Notre Philosophie Vie Privée d'Abord",
        description: "Inner Friend Circle est construit par Lifesaver Labs avec la vie privée comme principe fondamental."
      },
      dataCollection: {
        title: "Quelles Données Nous Collectons",
        accountInfo: {
          title: "Informations du Compte",
          description: "Adresse email et mot de passe (haché de manière sécurisée) pour l'authentification."
        },
        friendData: {
          title: "Données des Amis",
          description: "Noms, informations de contact, notes et classifications de niveau que vous créez."
        },
        emergencyData: {
          title: "Données d'Accès d'Urgence (Keys Shared)",
          description: "Si vous utilisez Keys Shared, nous stockons votre adresse et les informations des détenteurs de clés."
        },
        usageData: {
          title: "Données d'Utilisation",
          description: "Nous pouvons collecter des informations d'utilisation basiques mais n'utilisons pas d'outils d'analyse tiers."
        }
      },
      dataUsage: {
        title: "Comment Nous Utilisons Vos Données",
        provide: "Pour fournir et maintenir le service Inner Friend Circle",
        matching: "Pour permettre la correspondance mutuelle",
        emergency: "Pour faciliter la coordination d'urgence avec les voisins",
        notifications: "Pour vous envoyer des notifications importantes (jamais de marketing)",
        improve: "Pour améliorer et développer de nouvelles fonctionnalités"
      },
      dataStorage: {
        title: "Stockage et Sécurité des Données",
        description: "Vos données sont stockées de manière sécurisée avec Supabase."
      },
      rights: {
        title: "Vos Droits (RGPD & Libération des Données)",
        access: {
          title: "Droit d'Accès et d'Export",
          description: "Vous pouvez exporter toutes vos données à tout moment."
        },
        deletion: {
          title: "Droit de Suppression",
          description: "Vous pouvez supprimer votre compte et toutes les données associées."
        },
        rectification: {
          title: "Droit de Rectification",
          description: "Vous pouvez modifier vos données à tout moment."
        },
        object: {
          title: "Droit d'Opposition",
          description: "Vous pouvez vous opposer à certaines fonctionnalités."
        }
      },
      thirdParties: {
        title: "Services Tiers",
        supabase: {
          name: "Supabase",
          description: "Notre fournisseur de base de données et d'authentification."
        },
        noTracking: "Nous n'utilisons aucun réseau publicitaire ni service d'analyse tiers."
      },
      cookies: {
        title: "Cookies et Stockage Local",
        description: "Nous utilisons uniquement des cookies essentiels pour la gestion des sessions."
      },
      children: {
        title: "Vie Privée des Enfants",
        description: "Inner Friend Circle n'est pas destiné aux enfants de moins de 13 ans."
      },
      retention: {
        title: "Conservation des Données",
        description: "Nous conservons vos données tant que votre compte est actif."
      },
      contact: {
        title: "Nous Contacter",
        description: "Pour les questions relatives à la vie privée, contactez-nous à :",
        email: "Email",
        github: "GitHub"
      },
      changes: {
        title: "Modifications de Cette Politique",
        description: "Nous pouvons mettre à jour cette politique de temps en temps."
      }
    },
    terms: {
      introduction: {
        title: "1. Introduction",
        description: "Bienvenue sur Inner Friend Circle, un service fourni par Lifesaver Labs."
      },
      service: {
        title: "2. Description du Service",
        description: "Inner Friend Circle est un outil de gestion des relations axé sur la vie privée.",
        features: {
          tiers: "Organisation des amis en niveaux significatifs",
          matching: "Correspondance mutuelle optionnelle",
          keysShared: "Coordination d'accès d'urgence Keys Shared",
          dataExport: "Fonctionnalités d'export et de portabilité des données"
        }
      },
      userAccounts: {
        title: "3. Comptes Utilisateur",
        description: "Vous êtes responsable de la protection de vos identifiants."
      },
      acceptableUse: {
        title: "4. Utilisation Acceptable",
        intro: "Vous acceptez de ne pas utiliser le service pour :",
        prohibited: {
          harm: "Stocker des informations sur d'autres sans leur connaissance",
          harassment: "Harcèlement ou surveillance d'autrui",
          laws: "Violer les lois applicables",
          unauthorized: "Accès non autorisé aux données d'autres utilisateurs",
          misuse: "Mauvaise utilisation des fonctionnalités d'urgence",
          impersonate: "Usurpation d'identité"
        }
      },
      userContent: {
        title: "5. Contenu Utilisateur",
        description: "Vous conservez la propriété de tout le contenu que vous créez."
      },
      keysShared: {
        title: "6. Keys Shared & Fonctionnalités d'Urgence",
        description: "Keys Shared vous permet de désigner des voisins de confiance.",
        points: {
          risks: "Vous reconnaissez que le partage d'informations de clés comporte des risques",
          trust: "Vous êtes responsable de faire confiance aux voisins que vous désignez",
          liability: "Nous ne sommes pas responsables des actions de vos détenteurs de clés",
          emergencyWorkers: "Les comptes de dispatch vérifiés peuvent accéder à vos informations",
          disable: "Vous pouvez désactiver le partage à tout moment"
        }
      },
      dataLiberation: {
        title: "7. Libération des Données",
        description: "Nous croyons que vos données vous appartiennent."
      },
      privacy: {
        title: "8. Vie Privée",
        description: "Votre utilisation est également régie par notre Politique de Confidentialité."
      },
      intellectualProperty: {
        title: "9. Propriété Intellectuelle",
        description: "Inner Friend Circle est un logiciel open-source."
      },
      liability: {
        title: "10. Limitation de Responsabilité",
        description: "LE SERVICE EST FOURNI \"TEL QUEL\" SANS GARANTIE.",
        includes: "Cela inclut les dommages causés par les détenteurs de clés, les retards d'urgence, la perte de données."
      },
      indemnification: {
        title: "11. Indemnisation",
        description: "Vous acceptez d'indemniser Lifesaver Labs."
      },
      termination: {
        title: "12. Résiliation",
        description: "Vous pouvez résilier votre compte à tout moment."
      },
      changes: {
        title: "13. Modifications des Conditions",
        description: "Nous nous réservons le droit de modifier ces conditions."
      },
      governingLaw: {
        title: "14. Loi Applicable",
        description: "Ces conditions sont régies par la loi applicable."
      },
      severability: {
        title: "15. Divisibilité",
        description: "Si une disposition est invalide, les autres restent en vigueur."
      },
      contact: {
        title: "16. Contact",
        description: "Pour les questions, contactez-nous à :",
        email: "Email",
        github: "GitHub"
      }
    },
    emptyState: {
      noPostsYet: "Pas encore de publications",
      noFriendsYet: {
        core: "Pas encore d'amis Core",
        inner: "Pas encore d'amis Inner Circle",
        outer: "Pas encore d'amis Outer Circle"
      },
      noPostsDescription: {
        core: "Vos amis Core n'ont encore rien partagé.",
        inner: "Vos amis Inner Circle n'ont encore rien partagé.",
        outer: "Vos amis Outer Circle n'ont encore rien partagé."
      },
      getStarted: {
        core: "Commencez par ajouter jusqu'à 5 amis dans votre Core.",
        inner: "Commencez par ajouter jusqu'à 15 amis dans votre Inner Circle.",
        outer: "Commencez par ajouter jusqu'à 150 amis dans votre Outer Circle."
      },
      addToSee: {
        core: "Ajoutez jusqu'à 5 amis pour voir leurs publications ici.",
        inner: "Ajoutez jusqu'à 15 amis pour voir leurs publications ici.",
        outer: "Ajoutez jusqu'à 150 amis pour voir leurs publications ici."
      },
      addFriends: {
        core: "Ajouter des Amis Core",
        inner: "Ajouter des Amis Inner Circle",
        outer: "Ajouter des Amis Outer Circle"
      },
      createPost: "Créer une Publication",
      noParasoicalsYet: "Pas encore de parasociaux"
    },
    mission: {
      title: "Du Vrai Temps, Pas du Temps Pub",
      description: "Nous gagnons quand vous quittez notre site — pour partager de vrais moments avec les personnes qui comptent le plus.",
      learnMore: "En savoir plus...",
      showLess: "Afficher moins",
      inspiration: "Notre inspiration ? Cette publicité classique de Dentyne Ice.",
      videoTitle: "Dentyne Ice - Face Time",
      quote: "\"Faites du Vrai Temps\" — c'est l'idéal.",
      features: {
        spark: {
          title: "Lancer des Appels Vidéo",
          description: "Quand vous êtes séparés, un clic vous connecte"
        },
        tend: {
          title: "Entretenez Vos Cercles",
          description: "Des rappels pour rester en contact avant que les liens ne s'effacent"
        },
        pull: {
          title: "Rapprochez-vous",
          description: "Déplacez les connexions significatives vers des orbites plus proches"
        }
      }
    },
    dashboard: {
      title: "Votre Cercle d'Amis",
      subtitle: "Gérez vos relations significatives",
      addFriend: "Ajouter un Ami",
      export: "Exporter",
      import: "Importer",
      settings: "Paramètres",
      viewFeed: "Voir le Fil",
      tendCircles: "Entretenir les Cercles",
      quickStats: "Stats Rapides",
      totalFriends: "Total d'Amis",
      emptySlots: "Places Disponibles",
      lastTended: "Dernier Entretien"
    },
    tending: {
      title: "Entretenez Vos Cercles",
      markDescription: "Marquez vos amis {{tier}} que vous n'avez pas contactés {{period}}",
      periods: {
        core: "cette semaine",
        inner: "ces deux semaines",
        outer: "ces deux mois"
      },
      peopleCount: "{{count}} personne",
      peopleCount_plural: "{{count}} personnes",
      noFriendsInTier: "Pas encore d'amis à ce niveau",
      checkInstruction: "✓ Cochez ceux à qui vous n'avez pas assez parlé :",
      noPhone: "pas de téléphone",
      call: "Appeler",
      maybeLater: "Peut-être Plus Tard",
      doneTending: "Entretien Terminé",
      finish: "Terminer",
      mobileHint: "Les actions de contact fonctionnent mieux sur mobile",
      reconnect: {
        title: "C'est l'Heure de Reconnecter",
        description: "Ces amis ont besoin de votre temps"
      },
      toasts: {
        allTended: "Incroyable ! Vous avez entretenu tous vos cercles 🌱",
        noPhone: "Pas de numéro de téléphone pour {{name}}",
        connecting: "Connexion avec {{name}} via {{method}}",
        rememberReachOut: "N'oubliez pas de reprendre contact bientôt ! 💛",
        friendsWaiting: "{{count}} ami attend de vos nouvelles",
        friendsWaiting_plural: "{{count}} amis attendent de vos nouvelles"
      }
    },
    nayborSOS: {
      title: "Naybor SOS™",
      steps: {
        category: "De quel type d'aide avez-vous besoin ?",
        contacts: "Choisissez les voisins à contacter"
      },
      critical: "Critique",
      criticalUrgency: "Urgence critique",
      emergencyWarning: "Pour les urgences vitales, appelez le 15 d'abord",
      suggestedActions: "Actions suggérées :",
      addDetails: "Ajouter des détails (optionnel)",
      describePlaceholder: "Décrivez votre situation...",
      includeLocation: "Inclure les informations de localisation",
      chooseNaybors: "Choisir les Voisins",
      chooseNayborsAria: "Continuer pour choisir les voisins à contacter",
      nayborsSelected: "{{count}} voisin sélectionné",
      nayborsSelected_plural: "{{count}} voisins sélectionnés"
    },
    gdpr: {
      title: "Vérification d'Âge",
      description: "Inner Friend Circle est conçu pour les utilisateurs de 13 ans et plus.",
      ageQuestion: "Avez-vous 13 ans ou plus ?",
      confirmAge: "Oui, j'ai 13 ans ou plus",
      underAge: "Non, j'ai moins de 13 ans",
      underAgeMessage: "Désolé, Inner Friend Circle n'est pas disponible pour les utilisateurs de moins de 13 ans.",
      parentalConsent: "Si vous avez entre 13 et 16 ans, vous pourriez avoir besoin du consentement parental.",
      learnMore: "En savoir plus sur nos pratiques de confidentialité",
      accept: "Accepter",
      decline: "Refuser",
      consentRequired: "Consentement requis",
      consentDescription: "Pour utiliser Inner Friend Circle, vous devez accepter notre Politique de Confidentialité et nos Conditions d'Utilisation.",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation"
    },
    keysShared: {
      title: "Keys Shared",
      description: "Partagez de manière sécurisée l'accès d'urgence à votre domicile avec des voisins de confiance",
      setup: "Configurer Keys Shared",
      enabled: "Keys Shared Activé",
      disabled: "Keys Shared Désactivé",
      addKeyHolder: "Ajouter un Détenteur de Clé",
      editKeyHolder: "Modifier le Détenteur de Clé",
      removeKeyHolder: "Supprimer le Détenteur de Clé",
      keyHolders: "Détenteurs de Clés",
      noKeyHolders: "Pas encore de détenteurs de clés",
      emergencyAccess: "Accès d'Urgence",
      emergencyAccessDescription: "Permettre aux agents d'urgence vérifiés d'accéder à vos informations",
      address: "Adresse",
      entryCode: "Code d'Entrée",
      specialInstructions: "Instructions Spéciales",
      trustLevel: "Niveau de Confiance",
      high: "Élevé",
      medium: "Moyen",
      low: "Faible"
    },
    addLinkedFriend: {
      title: "Ajouter un Ami Lié à {{tier}}",
      description: "Trouvez quelqu'un par ses coordonnées.",
      findBy: "Rechercher par",
      enterUsernameHint: "Entrez le nom d'utilisateur exactement",
      enterContactHint: "Entrez le {{type}} exactement comme enregistré",
      search: "Rechercher",
      searching: "Recherche...",
      noResults: "Aucun résultat trouvé",
      userFound: "Utilisateur trouvé !",
      sendRequest: "Envoyer la Demande",
      requestSent: "Demande Envoyée !",
      errors: {
        notFound: "Aucun utilisateur trouvé avec ces informations",
        alreadyConnected: "Vous êtes déjà connecté avec cet utilisateur",
        requestPending: "Vous avez déjà une demande en attente"
      }
    },
    onboarding: {
      welcome: "Bienvenue sur Inner Friend Circle",
      welcomeDescription: "Configurons vos cercles d'amis",
      step1: "Ajouter des Amis Core",
      step1Description: "Commencez par vos 5 relations les plus proches",
      step2: "Élargissez Votre Cercle",
      step2Description: "Ajoutez des amis à Inner et Outer",
      step3: "Connaissez Vos Voisins",
      step3Description: "Construisez votre réseau de voisinage pour les urgences",
      skip: "Passer pour l'instant",
      next: "Suivant",
      finish: "Commencer"
    },
    callActions: {
      startCall: "Démarrer l'Appel",
      scheduleCall: "Planifier un Appel",
      sendMessage: "Envoyer un Message",
      viewProfile: "Voir le Profil",
      callNow: "Appeler Maintenant",
      videoCall: "Appel Vidéo",
      voiceCall: "Appel Vocal"
    },
    post: {
      createPost: "Créer une Publication",
      whatOnMind: "Qu'avez-vous en tête ?",
      shareWith: "Partager avec",
      addPhoto: "Ajouter une Photo",
      addVideo: "Ajouter une Vidéo",
      post: "Publier",
      posting: "Publication...",
      deletePost: "Supprimer la Publication",
      editPost: "Modifier la Publication",
      likePost: "J'aime",
      commentOnPost: "Commenter"
    },
    landing: {
      features: {
        dataLiberation: {
          title: "Vos Données, Votre Façon",
          description: "Exportez toutes vos données à tout moment. Conforme au RGPD."
        },
        nayborNetwork: {
          title: "Réseau de Voisins",
          description: "Construisez la résilience communautaire avec des voisins de confiance."
        },
        globalReach: {
          title: "23 Langues",
          description: "Internationalisation complète avec support RTL."
        }
      }
    },
    admin: {
      title: "Panneau d'Administration",
      users: "Utilisateurs",
      accounts: "Comptes",
      settings: "Paramètres",
      logs: "Journaux",
      dispatch: {
        title: "Comptes de Dispatch",
        pending: "En Attente",
        verified: "Vérifiés",
        rejected: "Refusés",
        suspended: "Suspendus"
      }
    },
    dev: {
      label: "Dev",
      panelTitle: "Panneau de Développement",
      mode: "Mode Développement",
      authStatus: "État d'Auth",
      notLoggedIn: "Non connecté",
      clearData: "Effacer les Données",
      resetApp: "Réinitialiser l'App"
    },
    auth: {
      toasts: {
        signOutError: "Échec de la déconnexion",
        signOutSuccess: "Déconnexion réussie"
      }
    }
  }
};

// Deep merge function
function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key] && typeof target[key] === 'object') {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

// Apply translations to each locale
const localesDir = path.join(__dirname, '../public/locales');

for (const [locale, trans] of Object.entries(translations)) {
  const localePath = path.join(localesDir, locale, 'common.json');

  try {
    const currentData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    const mergedData = deepMerge(currentData, trans);
    fs.writeFileSync(localePath, JSON.stringify(mergedData, null, 2) + '\n');
    console.log(`Updated: ${locale}`);
  } catch (error) {
    console.error(`Error updating ${locale}:`, error.message);
  }
}

console.log('\nDone! Missing i18n keys applied to es, de, fr.');
console.log('NOTE: Additional languages need to be added to this script.');
