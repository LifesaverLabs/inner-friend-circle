const fs = require('fs');
const path = require('path');

// Italian translations for all missing sections
const italianTranslations = {
  "landing": {
    "features": {
      "dataLiberation": {
        "title": "I Tuoi Dati, La Tua Scelta",
        "description": "Esporta tutti i tuoi dati in qualsiasi momento. Conforme al GDPR con gestione completa del consenso, eliminazione account e portabilità dei dati."
      },
      "nayborNetwork": {
        "title": "Rete Naybor",
        "description": "Costruisci resilienza comunitaria con vicini fidati. Accesso SOS rapido, contatti di emergenza condivisi e aiuto reciproco."
      },
      "globalReach": {
        "title": "23 Lingue",
        "description": "Internazionalizzazione completa con supporto RTL per arabo, urdu ed ebraico. Disponibile nella tua lingua madre."
      }
    }
  },
  "auth": {
    "toasts": {
      "signOutError": "Disconnessione fallita",
      "signOutSuccess": "Disconnessione effettuata con successo"
    }
  },
  "actions": {
    "refresh": "Aggiorna",
    "retry": "Riprova",
    "share": "Condividi",
    "sharing": "Condivisione...",
    "selectAll": "Seleziona tutto",
    "clear": "Cancella",
    "copy": "Copia",
    "print": "Stampa",
    "saving": "Salvataggio..."
  },
  "emptyState": {
    "noPostsYet": "Ancora nessun post",
    "noFriendsYet": {
      "core": "Ancora nessun amico nel nucleo",
      "inner": "Ancora nessun amico nella cerchia interna",
      "outer": "Ancora nessun amico nella cerchia esterna"
    },
    "noPostsDescription": {
      "core": "I tuoi amici del nucleo non hanno ancora condiviso nulla. Sii il primo a condividere qualcosa!",
      "inner": "I tuoi amici della cerchia interna non hanno ancora condiviso nulla. Sii il primo a condividere qualcosa!",
      "outer": "I tuoi amici della cerchia esterna non hanno ancora condiviso nulla. Sii il primo a condividere qualcosa!"
    },
    "getStarted": {
      "core": "Inizia aggiungendo fino a 5 amici al tuo Nucleo.",
      "inner": "Inizia aggiungendo fino a 15 amici alla tua Cerchia Interna.",
      "outer": "Inizia aggiungendo fino a 150 amici alla tua Cerchia Esterna."
    },
    "addToSee": {
      "core": "Aggiungi fino a 5 amici per vedere i loro post qui.",
      "inner": "Aggiungi fino a 15 amici per vedere i loro post qui.",
      "outer": "Aggiungi fino a 150 amici per vedere i loro post qui."
    },
    "addFriends": {
      "core": "Aggiungi Amici al Nucleo",
      "inner": "Aggiungi Amici alla Cerchia Interna",
      "outer": "Aggiungi Amici alla Cerchia Esterna"
    },
    "createPost": "Crea un Post",
    "noParasoicalsYet": "Ancora nessun parasociale",
    "noAcquaintedYet": "Ancora nessun conoscente",
    "noRoleModelsYet": "Ancora nessun modello di riferimento",
    "noNayborsYet": "Ancora nessun vicino",
    "addParasocialsHint": "Aggiungi creatori, celebrità o personaggi che segui",
    "acquaintedHint": "Gli amici vengono riclassificati qui per mancanza di contatto nel tempo",
    "roleModelsHint": "Aggiungi persone le cui storie di vita ti ispirano a essere buono, migliore, il migliore",
    "nayborsHint": "Presentati ai tuoi vicini e aggiungili qui",
    "addToCircleHint": "Aggiungi qualcuno alla tua cerchia più stretta"
  },
  "labels": {
    "phone": "Numero di Telefono",
    "notes": "Note",
    "handle": "Handle"
  },
  "dashboard": {
    "title": "Le Tue Cerchie Interne",
    "subtitle": "Cura e tendi alle tue relazioni più strette",
    "loading": "Caricamento delle tue cerchie...",
    "tend": "Cura",
    "share": "Condividi",
    "localStorageHint": "💡 Le tue liste sono salvate localmente. Crea un account per sincronizzare tra dispositivi e abilitare la corrispondenza reciproca.",
    "dunbarDisclaimer": "Nota: Questi limiti di livello ispirati a Dunbar sono soggetti a modifiche con l'evoluzione della scienza della coscienza comunitaria. Modifiche future potrebbero includere regole dove certi conteggi di livello influenzano altri — ad esempio, le connessioni parasociali potrebbero ridurre la tua capacità di amici esterni consentita.",
    "toasts": {
      "addedFriend": "Aggiunto {{name}} alla tua cerchia {{tier}}",
      "movedFriend": "Spostato {{name}} in {{tier}}",
      "moveError": "Impossibile spostare l'amico",
      "removedFriend": "Rimosso {{name}} dalle tue liste",
      "addedReserved": "Aggiunto gruppo riservato a {{tier}}",
      "reservedError": "Impossibile aggiungere gruppo riservato",
      "updatedReserved": "Gruppo riservato aggiornato",
      "removedReserved": "Gruppo riservato rimosso",
      "imported": "Importato {{count}} amico",
      "imported_plural": "Importati {{count}} amici",
      "skippedDuplicates": "Saltato {{count}} duplicato",
      "skippedDuplicates_plural": "Saltati {{count}} duplicati",
      "dataLiberation": "I tuoi dati ti appartengono. Esporta in qualsiasi momento per portarli altrove."
    }
  },
  "mission": {
    "title": "Tempo Reale, Non Tempo Pubblicitario",
    "description": "Vinciamo quando lasci il nostro sito — per condividere momenti reali con le persone che contano di più.",
    "learnMore": "Scopri di più...",
    "showLess": "Mostra meno",
    "inspiration": "La nostra ispirazione? Questa classica pubblicità Dentyne Ice — il promemoria perfetto che i momenti migliori accadono quando posi il telefono e ti presenti:",
    "videoTitle": "Dentyne Ice - Tempo Reale",
    "quote": "\"Crea Tempo Reale\" — questo è l'ideale. Quando la distanza vi separa, ti aiuteremo a colmarla con videochiamate. Ma ricorda sempre: niente batte esserci di persona.",
    "features": {
      "spark": {
        "title": "Avvia Videochiamate",
        "description": "Quando sei lontano, un click ti connette"
      },
      "tend": {
        "title": "Cura le Tue Cerchie",
        "description": "Promemoria per contattare prima che le connessioni svaniscano"
      },
      "pull": {
        "title": "Avvicina",
        "description": "Sposta connessioni significative in orbite più strette"
      }
    }
  },
  "tierSection": {
    "reserve": "Riserva",
    "reservedCount": "{{count}} Riservati",
    "link": "Collega",
    "followCreator": "Segui Creatore",
    "addRoleModel": "Aggiungi Modello",
    "add": "Aggiungi"
  },
  "tending": {
    "title": "Cura le Tue Cerchie",
    "markDescription": "Segna i tuoi amici {{tier}} che non hai contattato {{period}}",
    "peopleCount": "{{count}} persona",
    "peopleCount_plural": "{{count}} persone",
    "noFriendsInTier": "Ancora nessun amico in questo livello",
    "checkInstruction": "✓ Seleziona quelli che non hai contattato abbastanza:",
    "noPhone": "nessun telefono",
    "call": "Chiama",
    "maybeLater": "Forse Dopo",
    "doneTending": "Cura Completata",
    "finish": "Fine",
    "mobileHint": "Le azioni di contatto funzionano meglio su dispositivi mobili",
    "reconnect": {
      "title": "È Ora di Riconnettersi",
      "description": "Questi amici potrebbero usare un po' del tuo tempo"
    },
    "toasts": {
      "allTended": "Fantastico! Hai curato tutte le tue cerchie 🌱",
      "noPhone": "Nessun numero di telefono per {{name}}",
      "connecting": "Connessione con {{name}} tramite {{method}}",
      "rememberReachOut": "Ricorda di contattare presto! 💛",
      "friendsWaiting": "{{count}} amico in attesa di sentirti",
      "friendsWaiting_plural": "{{count}} amici in attesa di sentirti"
    }
  },
  "nayborSOS": {
    "steps": {
      "category": "Di che tipo di aiuto hai bisogno?",
      "contacts": "Scegli i vicini da contattare"
    },
    "critical": "Critico",
    "emergencyWarning": "Per emergenze pericolose per la vita, chiama prima il 118",
    "suggestedActions": "Azioni suggerite:",
    "addDetails": "Aggiungi dettagli (opzionale)",
    "describePlaceholder": "Descrivi la tua situazione...",
    "includeLocation": "Includi informazioni sulla posizione",
    "chooseNaybors": "Scegli Vicini",
    "chooseNayborsAria": "Continua per scegliere i vicini da contattare",
    "nayborsSelected": "{{count}} vicino selezionato",
    "nayborsSelected_plural": "{{count}} vicini selezionati",
    "copyMessage": "Copia messaggio",
    "messageAll": "Invia a Tutti ({{count}})",
    "contacted": "Contattato {{count}} vicino",
    "contacted_plural": "Contattati {{count}} vicini",
    "toasts": {
      "messageCopied": "Messaggio copiato negli appunti",
      "noNayborsSelected": "Nessun vicino con numero di telefono selezionato"
    }
  },
  "callActions": {
    "startKall": "Avvia una chiamata",
    "kallNow": "Chiama {{name}} ora",
    "scheduleKall": "Programma una chiamata",
    "scheduleWith": "Programma con {{name}}",
    "sharedServices": "Servizi condivisi:",
    "theirPreferences": "Le loro preferenze:",
    "noMethods": "Nessun metodo di contatto disponibile",
    "requestInfo": "Richiedi info contatto",
    "toasts": {
      "connecting": "Connessione tramite {{service}}",
      "openService": "Apri {{service}} per connetterti"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "Resta Connesso",
        "description": "Aggiungi i tuoi metodi di contatto così gli amici possono raggiungerti facilmente."
      },
      "channels": {
        "title": "Aggiungi i Tuoi Canali",
        "description": "Quali app di videochiamata e messaggistica usi?"
      },
      "complete": {
        "title": "Tutto Pronto!",
        "description": "I tuoi amici ora possono avviare o programmare chiamate con te."
      }
    },
    "skipForNow": "Salta per ora",
    "getStarted": "Inizia",
    "service": "Servizio",
    "yourContactInfo": "Le Tue Info {{service}}",
    "spontaneous": "Spontaneo",
    "scheduled": "Programmato",
    "addMethod": "Aggiungi Metodo",
    "continue": "Continua",
    "methodsAdded": "Hai aggiunto {{count}} metodo di contatto",
    "methodsAdded_plural": "Hai aggiunto {{count}} metodi di contatto",
    "publicProfile": "Profilo Pubblico",
    "privateProfile": "Profilo Privato",
    "publicProfileHint": "Chiunque può trovarti tramite il tuo handle",
    "privateProfileHint": "Solo gli amici confermati possono vedere il tuo profilo",
    "addMore": "Aggiungi Altri",
    "saving": "Salvataggio...",
    "completeSetup": "Completa Configurazione",
    "toasts": {
      "enterContactInfo": "Inserisci le informazioni di contatto",
      "saveFailed": "Salvataggio metodi di contatto fallito"
    }
  },
  "keysShared": {
    "addressHelp": "Questo indirizzo sarà condiviso con i soccorritori quando i tuoi vicini richiedono aiuto per tuo conto.",
    "address": "Indirizzo",
    "addressPlaceholder": "Via Roma 123",
    "unitNumber": "Numero Interno/App",
    "unitPlaceholder": "Int. 4B",
    "entryInstructions": "Istruzioni Speciali di Accesso",
    "instructionsPlaceholder": "Il tastierino è a destra della porta, suonare due volte...",
    "instructionsHint": "Includi tutti i dettagli che i soccorritori dovrebbero sapere per accedere alla tua casa",
    "keyType": "Tipo di Accesso",
    "keyTypes": {
      "physical": "Chiave Fisica",
      "digital": "Codice Digitale",
      "both": "Entrambi"
    },
    "digitalCodeType": "Tipo di Codice",
    "codeTypes": {
      "keypad": "Tastierino Porta",
      "smart_lock": "App Serratura Smart",
      "garage": "Codice Garage",
      "other": "Altro"
    },
    "notes": "Note (opzionale)",
    "notesPlaceholder": "La chiave è sotto il vaso blu...",
    "confirmKeyHolder": "Conferma",
    "currentKeyHolders": "Detentori di Chiavi Attuali",
    "selectNaybors": "Aggiungi un vicino che ha accesso:",
    "noNaybors": "Aggiungi prima i vicini per condividere le chiavi con loro",
    "allNayborsAssigned": "Tutti i tuoi vicini sono stati assegnati",
    "optionalScenarios": "Permessi di Ingresso Opzionali",
    "optionalScenariosHelp": "Puoi scegliere se i vicini possono entrare per questi scenari.",
    "mandatoryScenariosHelp": "Questi scenari pericolosi per la vita o critici per la sicurezza permettono sempre l'ingresso. Non possono essere disabilitati perché proteggono la vita, l'integrità fisica e gli esseri umani innocenti dal trauma.",
    "scenarios": {
      "cardiac_arrest": {
        "name": "Arresto Cardiaco",
        "description": "Infarto o arresto cardiaco improvviso — ogni secondo conta"
      },
      "choking": {
        "name": "Soffocamento",
        "description": "Emergenza soffocamento — vie aeree bloccate, serve aiuto immediato"
      },
      "drowning": {
        "name": "Annegamento",
        "description": "Annegamento in piscina, vasca da bagno o altra acqua"
      },
      "anaphylaxis": {
        "name": "Shock Anafilattico",
        "description": "Grave reazione allergica da puntura d'ape, cibo, farmaco"
      },
      "elderly_fall": {
        "name": "Caduta Anziano",
        "description": "Persona anziana caduta, incapace di alzarsi, possibilmente ferita"
      },
      "fire": {
        "name": "Incendio",
        "description": "Incendio rilevato — minaccia per vita, integrità, tessuti, chiunque immobilizzato o addormentato"
      },
      "gas_leak": {
        "name": "Fuga di Gas",
        "description": "Fuga di gas rilevata — rischio esplosione/avvelenamento"
      },
      "carbon_monoxide": {
        "name": "Monossido di Carbonio",
        "description": "Allarme rilevatore CO — killer silenzioso, occupanti potrebbero essere incoscienti"
      },
      "childhood_corporal": {
        "name": "Punizione Corporale su Minori",
        "description": "Bambino che avvisa i vicini di punizione corporale. La ricerca mostra che l'intervento della comunità previene la violenza futura."
      },
      "take10_spiral": {
        "name": "Spirale di Urla Take 10",
        "description": "Urla domestiche in escalation inaccettabile. Necessario intervento di de-escalation."
      },
      "bedroom_consent": {
        "name": "Conflitto di Consenso in Camera",
        "description": "Rilevata emergenza conflitto di consenso in camera — intervento immediato richiesto"
      },
      "medical_other": {
        "name": "Altra Emergenza Medica",
        "description": "Altra emergenza medica che richiede ingresso in casa"
      },
      "intruder_check": {
        "name": "Controllo Intruso",
        "description": "Controllo per sospetto intruso quando non puoi rispondere"
      },
      "welfare_check": {
        "name": "Controllo Benessere",
        "description": "Controllo benessere generale quando non rispondi per un periodo prolungato"
      },
      "flooding": {
        "name": "Allagamento/Perdita d'Acqua",
        "description": "Perdita d'acqua o allagamento — prevenzione danni alla proprietà (non pericoloso per la vita)"
      }
    },
    "yourAddress": "Il Tuo Indirizzo",
    "noAddressSet": "Nessun indirizzo impostato",
    "unit": "Interno",
    "keyHoldersSummary": "{{count}} vicino/i hanno le chiavi",
    "keyHoldersSummary_plural": "{{count}} vicini hanno le chiavi",
    "noKeyHolders": "Nessun detentore di chiavi assegnato",
    "permissionsSummary": "Permessi di Ingresso",
    "mandatoryCount": "{{count}}",
    "mandatoryLabel": "obbligatori (sempre permessi)",
    "optionalCount": "{{count}}",
    "optionalLabel": "opzionali abilitati",
    "reviewWarning": "Salvando queste impostazioni, autorizzi i tuoi vicini designati ad entrare in casa tua durante gli scenari di emergenza selezionati. Assicurati di fidarti di queste persone per l'accesso alla tua casa.",
    "toasts": {
      "keyHolderAdded": "Detentore di chiavi aggiunto",
      "keyHolderRemoved": "Detentore di chiavi rimosso",
      "saved": "Preferenze chiavi condivise salvate"
    }
  },
  "reserved": {
    "spotsCount_plural": "{{count}} Posti Riservati",
    "spotsLabel_plural": "posti riservati"
  },
  "addLinkedFriend": {
    "title": "Aggiungi Amico Collegato a {{tier}}",
    "description": "Trova qualcuno tramite le sue informazioni di contatto per richiedere una connessione.",
    "findBy": "Trova per",
    "enterUsernameHint": "Inserisci il loro username esattamente come l'hanno impostato",
    "enterContactHint": "Inserisci il loro {{type}} esattamente come l'hanno registrato",
    "errors": {
      "noUserHandle": "Nessun utente trovato con quell'handle. Assicurati che abbiano un account e abbiano impostato il loro handle.",
      "noUserContact": "Nessun utente trovato con quel {{type}}. Potrebbero non averlo ancora aggiunto al loro profilo.",
      "searchError": "Si è verificato un errore durante la ricerca. Riprova.",
      "connectionFailed": "Invio richiesta di connessione fallito"
    },
    "userFound": "Utente Trovato",
    "showCircleLevel": "Mostra livello cerchia",
    "circleVisibleHint": "Vedranno che li hai aggiunti come {{tier}}",
    "circleHiddenHint": "Non vedranno a quale cerchia li hai aggiunti",
    "sendRequest": "Invia Richiesta di Connessione",
    "privacyNote": "Vedranno solo le informazioni di contatto che hai usato per trovarli fino a quando non accettano. Una volta accettato, entrambi vedrete i reciproci metodi di contatto completi.",
    "serviceTypes": {
      "phone": "Numero di Telefono",
      "email": "Indirizzo Email",
      "handle": "Handle Utente",
      "signal": "Signal",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "facetime": "FaceTime"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "Usiamo i cookie",
      "description": "Usiamo i cookie per migliorare la tua esperienza. I cookie essenziali sono necessari per il funzionamento dell'app.",
      "learnMore": "Scopri di più",
      "customize": "Personalizza",
      "customizeAria": "Personalizza preferenze cookie",
      "essentialOnly": "Solo Essenziali",
      "essentialOnlyAria": "Accetta solo cookie essenziali",
      "acceptAll": "Accetta Tutti",
      "acceptAllAria": "Accetta tutti i cookie",
      "settingsTitle": "Preferenze Cookie",
      "settingsDescription": "Scegli quali tipi di cookie vuoi permettere. I cookie essenziali sono sempre abilitati poiché necessari per il funzionamento del sito.",
      "savePreferences": "Salva Preferenze",
      "required": "Richiesto",
      "essential": {
        "title": "Cookie Essenziali",
        "description": "Necessari per funzionalità base del sito come autenticazione e sicurezza."
      },
      "functional": {
        "title": "Cookie Funzionali",
        "description": "Ricordano le tue preferenze come impostazioni lingua e personalizzazioni UI."
      },
      "analytics": {
        "title": "Cookie Analitici",
        "description": "Ci aiutano a capire come i visitatori usano il sito per migliorare l'esperienza."
      },
      "marketing": {
        "title": "Cookie Marketing",
        "description": "Usati per fornire pubblicità rilevante e tracciare l'efficacia delle campagne."
      }
    },
    "settings": {
      "cookiePreferences": "Preferenze Cookie",
      "cookieDescription": "Gestisci quali tipi di cookie ci permetti di usare.",
      "consentHistory": "Storico Consensi",
      "consentHistoryDescription": "Visualizza e gestisci i tuoi record di consenso.",
      "consentGiven": "Consenso dato il",
      "consentVersion": "Versione termini",
      "noConsent": "Nessun record di consenso trovato. Accetta la policy sui cookie.",
      "withdrawConsent": "Revoca Consenso",
      "withdrawWarning": "Revocare il consenso resetterà le tue preferenze cookie e potrebbe limitare alcune funzionalità. Sei sicuro?",
      "confirmWithdraw": "Sì, Revoca Consenso",
      "dataRights": "I Tuoi Diritti sui Dati",
      "dataRightsDescription": "Secondo il GDPR, hai il diritto di accedere, esportare ed eliminare i tuoi dati.",
      "exportData": "Esporta i Miei Dati",
      "exportDescription": "Scarica tutti i tuoi dati in un formato portabile",
      "deleteAccount": "Elimina il Mio Account",
      "deleteDescription": "Elimina permanentemente il tuo account e tutti i dati"
    },
    "deletion": {
      "title": "Elimina il Tuo Account",
      "description": "Questo eliminerà permanentemente il tuo account e tutti i dati associati.",
      "warningTitle": "Attenzione: Non può essere annullato",
      "warningDescription": "Una volta eliminato, il tuo account e tutti i dati saranno rimossi permanentemente. Assicurati di esportare i tuoi dati prima se vuoi conservarli.",
      "whatDeleted": "Cosa sarà eliminato:",
      "deletedItems": {
        "profile": "Il tuo profilo e informazioni personali",
        "connections": "Tutte le tue connessioni amici e cerchie",
        "posts": "Tutti i tuoi post e contenuti condivisi",
        "preferences": "Le tue preferenze e impostazioni",
        "keysShared": "Le tue impostazioni di accesso emergenza Chiavi Condivise"
      },
      "gracePeriodTitle": "Periodo di Grazia di 30 Giorni",
      "gracePeriodDescription": "Il tuo account sarà programmato per l'eliminazione tra {{days}} giorni. Puoi annullare l'eliminazione durante questo periodo accedendo.",
      "exportFirst": "Esportare i tuoi dati prima dell'eliminazione?",
      "exportData": "Esporta Dati",
      "exported": "Dati Esportati",
      "continue": "Continua all'Eliminazione",
      "confirmTitle": "Conferma Eliminazione Account",
      "confirmDescription": "Questa è la tua conferma finale. Verifica la tua identità per procedere.",
      "typeEmail": "Digita la tua email per confermare: {{email}}",
      "emailMismatch": "L'email non corrisponde al tuo account",
      "reasonLabel": "Motivo per cui te ne vai",
      "reasonPlaceholder": "Aiutaci a migliorare condividendo perché te ne vai...",
      "understandConsequences": "Capisco che il mio account e tutti i dati saranno eliminati permanentemente dopo il periodo di grazia, e questa azione non può essere annullata.",
      "deleting": "Programmazione eliminazione...",
      "confirmDelete": "Elimina il Mio Account",
      "scheduledTitle": "Eliminazione Programmata",
      "scheduledDescription": "Il tuo account è stato programmato per l'eliminazione.",
      "scheduledDate": "Il tuo account sarà eliminato permanentemente il:",
      "cancelInfo": "Per annullare l'eliminazione, accedi semplicemente al tuo account prima della data programmata."
    },
    "age": {
      "title": "Verifica Età",
      "description": "Dobbiamo verificare la tua età per rispettare le normative sulla privacy.",
      "whyTitle": "Perché lo chiediamo",
      "whyDescription": "Secondo il GDPR, gli utenti sotto i {{age}} anni richiedono il consenso dei genitori per creare un account.",
      "birthYearLabel": "In che anno sei nato?",
      "selectYear": "Seleziona anno",
      "privacyNote": "Conserviamo solo il tuo anno di nascita per motivi di conformità.",
      "minorTitle": "Consenso Genitoriale Richiesto",
      "minorDescription": "Gli utenti sotto i {{age}} anni richiedono il consenso dei genitori. Chiedi a un genitore o tutore di aiutarti a creare un account.",
      "parentalRequired": "Consenso Genitoriale Richiesto",
      "verify": "Verifica Età"
    }
  },
  "admin": {
    "dispatch": {
      "title": "Verifica Account Dispatch",
      "searchPlaceholder": "Cerca per organizzazione, email o nome contatto...",
      "filters": {
        "all": "Tutti gli Account"
      },
      "noAccounts": "Nessun account trovato corrispondente ai tuoi criteri",
      "accessDenied": {
        "title": "Accesso Negato",
        "description": "Non hai il permesso di accedere al pannello di verifica dispatch."
      },
      "actions": {
        "verify": "Verifica",
        "reject": "Rifiuta",
        "suspend": "Sospendi"
      },
      "success": {
        "verify": "Account verificato con successo",
        "reject": "Account rifiutato",
        "suspend": "Account sospeso"
      },
      "errors": {
        "fetchFailed": "Recupero account fallito",
        "actionFailed": "Azione fallita. Riprova."
      },
      "detail": {
        "description": "Rivedi i dettagli dell'organizzazione e i documenti di verifica",
        "organization": "Dettagli Organizzazione",
        "name": "Nome",
        "type": "Tipo",
        "jurisdictions": "Giurisdizioni",
        "legal": "Informazioni Legali",
        "taxId": "Codice Fiscale",
        "insurance": "Compagnia Assicurativa",
        "policyNumber": "Numero Polizza",
        "registeredAgent": "Agente Registrato",
        "contact": "Informazioni di Contatto",
        "contactName": "Nome Contatto",
        "contactEmail": "Email",
        "contactPhone": "Telefono",
        "status": "Stato Account",
        "verificationStatus": "Stato",
        "createdAt": "Data Richiesta",
        "rejectionReason": "Motivo Rifiuto"
      },
      "confirm": {
        "verifyTitle": "Verificare Account?",
        "verifyDescription": "Questo concederà all'organizzazione l'accesso alle informazioni dell'Albero Chiavi Porta dei residenti durante le emergenze.",
        "rejectTitle": "Rifiutare Account?",
        "rejectDescription": "Fornisci un motivo per il rifiuto. Questo sarà condiviso con l'organizzazione.",
        "suspendTitle": "Sospendere Account?",
        "suspendDescription": "Questo revocherà immediatamente l'accesso dell'organizzazione. Fornisci un motivo.",
        "reason": "Motivo",
        "reasonPlaceholder": "Spiega perché questo account viene rifiutato/sospeso...",
        "processing": "Elaborazione..."
      }
    }
  },
  "dev": {
    "label": "Dev",
    "panelTitle": "Pannello Dev",
    "mode": "Modalità Sviluppo",
    "authStatus": "Stato Auth",
    "notLoggedIn": "Non connesso",
    "authActions": "Azioni Auth",
    "refreshButton": "Aggiorna",
    "clearApp": "Cancella App",
    "clearAll": "Cancella Tutto",
    "forceSignOut": "Disconnessione Forzata",
    "toasts": {
      "clearStorage": "Cancellate {{count}} chiavi localStorage dell'app",
      "clearAll": "Cancellati tutti localStorage e sessionStorage",
      "signOut": "Disconnessione forzata e storage auth cancellato",
      "signOutFailed": "Disconnessione forzata fallita",
      "refreshed": "Sessione aggiornata",
      "refreshFailed": "Aggiornamento sessione fallito"
    },
    "forceLogout": "Logout Forzato",
    "storageActions": "Azioni Storage",
    "storageInspector": "Ispettore Storage",
    "noStorageData": "Nessun dato localStorage",
    "chars": "caratteri",
    "tips": {
      "title": "Suggerimenti",
      "sessions": "Le sessioni persistono tra ricaricamenti pagina",
      "clearApp": "Usa \"Cancella Dati App\" per resettare le liste amici",
      "forceLogout": "Usa \"Logout Forzato\" per cancellare completamente lo stato auth"
    }
  },
  "contactMethods": {
    "title": "Metodi di Contatto",
    "subtitle": "Aggiungi i tuoi servizi preferiti di videochiamata e messaggistica così gli amici possono raggiungerti",
    "addButton": "Aggiungi Metodo di Contatto",
    "addButtonCompact": "Aggiungi",
    "addDialogTitle": "Aggiungi Metodo di Contatto",
    "addDialogDescription": "Aggiungi un modo per i tuoi amici di raggiungerti per videochiamate",
    "serviceLabel": "Servizio",
    "contactInfoLabel": "Le Tue Info {{service}}",
    "labelOptional": "Etichetta (opzionale)",
    "labelPlaceholder": "es. Personale, Lavoro, Casa",
    "labelHint": "Ti aiuta a identificare tra più account sullo stesso servizio",
    "availableFor": "Disponibile per",
    "spontaneousKalls": "Chiamate Spontanee",
    "spontaneousTooltip": "Videochiamate istantanee, drop-in quando gli amici vogliono connettersi subito",
    "scheduledKalls": "Chiamate Programmate",
    "scheduledTooltip": "Videoriunioni pianificate organizzate in anticipo per un orario specifico",
    "addMethod": "Aggiungi Metodo",
    "dragToReorder": "Trascina per riordinare",
    "dragReorderHint": "Trascina per riordinare la priorità. #1 è il tuo metodo preferito.",
    "noSpontaneousMethods": "Nessun metodo di chiamata spontanea aggiunto",
    "noScheduledMethods": "Nessun metodo di chiamata programmata aggiunto"
  },
  "post": {
    "voiceNote": "Nota Vocale",
    "audioUnavailable": "Audio non disponibile",
    "callInvitation": "Invito a Chiamata",
    "joinCall": "Partecipa",
    "meetupInvitation": "Invito a Incontro",
    "location": "Posizione: {{name}}",
    "rsvpYes": "Confermo Sì",
    "rsvpMaybe": "Forse",
    "nearbyMessage": "Sono nelle vicinanze!",
    "lifeUpdate": "Aggiornamento di Vita",
    "call": "Chiama",
    "addContactInfo": "Aggiungi Info Contatto",
    "addContactInfoTooltip": "Aggiungi informazioni di contatto per {{name}}",
    "callViaHighFidelity": "Chiama tramite {{method}} (alta fedeltà)",
    "addMoreContactInfo": "Aggiungi altre info contatto",
    "usePhoneRecommendation": "Per migliori risultati, usa il telefono per le chiamate",
    "voiceReplyTooltip": "Invia una risposta vocale (alta fedeltà)",
    "meetupTooltip": "Programma un incontro (alta fedeltà)",
    "commentTooltip": "Aggiungi un commento",
    "likeTooltip": "Mi piace questo post",
    "likeTooltipHighFidelity": "Mi piace (considera un'interazione più significativa)",
    "shareTooltip": "Condividi",
    "toasts": {
      "noContact": "Nessuna informazione di contatto disponibile",
      "contactFailed": "Impossibile avviare il contatto",
      "noContactPerson": "Nessuna informazione di contatto disponibile per questa persona"
    },
    "callVia": "Chiama tramite {{method}}",
    "voiceReply": "Risposta Vocale",
    "meetup": "Incontro",
    "comment": "Commenta",
    "like": "Mi Piace",
    "selectContactMethod": "Seleziona metodo di contatto",
    "warningPlatform": "Attenzione: la piattaforma potrebbe avere problemi di sorveglianza",
    "currentlySelected": "Attualmente selezionato",
    "dontShowMonth": "Non mostrare per 1 mese",
    "warningSilenced": "Avvisi {{method}} silenziati fino al mese prossimo",
    "connectingVia": "Connessione tramite {{method}}"
  },
  "parasocial": {
    "creatorDashboard": "Dashboard Creatore",
    "shareContent": "Condividi Contenuto",
    "shareNewContent": "Condividi Nuovo Contenuto",
    "shareDescription": "Condividi un link con i tuoi follower parasociali",
    "noContentShared": "Ancora nessun contenuto condiviso",
    "noContentHint": "Condividi link per interagire con i tuoi follower",
    "title": "Titolo",
    "titlePlaceholder": "Cosa stai condividendo?",
    "url": "URL",
    "urlPlaceholder": "https://...",
    "description": "Descrizione",
    "descriptionPlaceholder": "Breve descrizione (opzionale)",
    "deleteTitle": "Eliminare questa condivisione?",
    "deleteDescription": "Questo rimuoverà il link dai feed dei tuoi follower.",
    "clicks": "{{count}} click",
    "clicks_plural": "{{count}} click",
    "engagement": "{{percent}}% engagement",
    "toasts": {
      "titleAndUrlRequired": "Titolo e URL sono obbligatori",
      "invalidUrl": "Inserisci un URL valido",
      "sharedContent": "Contenuto condiviso con i tuoi follower!",
      "deleted": "Condivisione eliminata"
    }
  },
  "profileSettings": {
    "title": "Impostazioni Profilo",
    "description": "Gestisci il tuo profilo e preferenze di contatto",
    "tabs": {
      "profile": "Profilo",
      "contact": "Contatto",
      "creator": "Creatore"
    },
    "displayName": "Nome Visualizzato",
    "displayNamePlaceholder": "Il tuo nome",
    "handle": "Handle",
    "handlePlaceholder": "tuo_handle",
    "handleHint": "3-30 caratteri. Solo lettere, numeri e underscore.",
    "publicProfile": "Il Tuo Profilo Pubblico",
    "publicProfileLabel": "Profilo Pubblico",
    "privateProfileLabel": "Profilo Privato",
    "publicDescription": "Chiunque può vedere la tua pagina profilo",
    "privateDescription": "Solo tu e gli amici confermati possono vedere il tuo profilo",
    "parasocialMode": "Modalità Personalità Parasociale",
    "parasocialModeDescription": "Abilita questo se sei una figura pubblica, creatore o celebrità che vuole ricevere connessioni parasociali dai fan e condividere contenuti con loro.",
    "parasocialModeHint": "Quando abilitato, altri utenti possono aggiungerti alla loro cerchia Parasociali e vedere i contenuti che condividi. Salva il tuo profilo per applicare questa modifica.",
    "saveProfile": "Salva Profilo",
    "saveSettings": "Salva Impostazioni",
    "toasts": {
      "updated": "Profilo aggiornato",
      "updateFailed": "Aggiornamento profilo fallito",
      "linkCopied": "Link copiato!"
    }
  },
  "editFriend": {
    "title": "Modifica Contatto",
    "description": "Aggiorna le informazioni di contatto per {{name}}",
    "namePlaceholder": "Nome dell'amico",
    "emailPlaceholder": "amico@esempio.com",
    "preferredContactMethod": "Metodo di Contatto Preferito",
    "selectContactMethod": "Scegli come raggiungerlo",
    "notesPlaceholder": "Qualsiasi nota su questa persona...",
    "saveChanges": "Salva Modifiche"
  },
  "followCreator": {
    "title": "Segui un Creatore",
    "description": "Cerca creatori verificati da seguire e vedere i loro contenuti nel tuo feed.",
    "searchLabel": "Cerca per nome o handle",
    "searchPlaceholder": "@handle_creatore o Nome Creatore",
    "creatorModeHint": "Solo gli utenti che hanno abilitato la Modalità Creatore appariranno nei risultati di ricerca.",
    "toasts": {
      "following": "Ora segui {{name}}",
      "alreadyFollowing": "Stai già seguendo questo creatore",
      "followFailed": "Impossibile seguire"
    },
    "errors": {
      "searching": "Si è verificato un errore durante la ricerca.",
      "noCreators": "Nessun creatore trovato corrispondente a quella ricerca. Potrebbero non aver ancora abilitato la modalità creatore.",
      "noCreatorsFound": "Nessun creatore trovato corrispondente a quella ricerca."
    }
  },
  "dispatch": {
    "validation": {
      "organizationNameRequired": "Il nome dell'organizzazione è obbligatorio",
      "jurisdictionRequired": "È richiesta almeno una giurisdizione",
      "taxIdRequired": "Il codice fiscale è obbligatorio",
      "insuranceRequired": "Il nome della compagnia assicurativa è obbligatorio",
      "policyRequired": "Il numero di polizza è obbligatorio",
      "agentNameRequired": "Il nome dell'agente registrato è obbligatorio",
      "agentContactRequired": "Il contatto dell'agente registrato è obbligatorio",
      "contactNameRequired": "Il nome del contatto primario è obbligatorio",
      "invalidEmail": "Inserisci un indirizzo email valido",
      "invalidPhone": "Inserisci un numero di telefono valido",
      "passwordMin": "La password deve essere di almeno 8 caratteri",
      "passwordMatch": "Le password devono corrispondere",
      "termsRequired": "Devi accettare i termini"
    }
  },
  "privacy": {
    "title": "Informativa sulla Privacy",
    "lastUpdated": "Ultimo aggiornamento: 1 gennaio 2025",
    "philosophy": {
      "title": "La Nostra Filosofia sulla Privacy",
      "description": "InnerFriend è costruito su una premessa fondamentale: le tue relazioni sono tue. Non siamo un social network che monetizza la tua attenzione o vende i tuoi dati. Siamo uno strumento che ti aiuta a mantenere connessioni significative con le persone che contano di più."
    },
    "dataCollection": {
      "title": "Dati Che Raccogliamo",
      "intro": "Raccogliamo solo ciò che è necessario per fornire il servizio:",
      "items": {
        "account": "Informazioni Account: Email e password (criptata) quando crei un account",
        "friends": "Liste Amici: I nomi e le informazioni di contatto opzionali delle persone che aggiungi",
        "connections": "Dati di Connessione: Metadati di corrispondenza reciproca se scegli di abilitarlo",
        "preferences": "Preferenze: Le tue impostazioni app come lingua e preferenze di notifica"
      }
    },
    "localStorage": {
      "title": "Prima il Locale",
      "description": "Di default, le tue liste amici sono memorizzate solo sul tuo dispositivo. Non tocchiamo mai i nostri server a meno che tu non scelga di creare un account per funzionalità come la sincronizzazione tra dispositivi o la corrispondenza reciproca."
    },
    "noSelling": {
      "title": "Non Vendiamo Mai i Tuoi Dati",
      "description": "I tuoi dati non sono in vendita. Punto. Non li condividiamo con inserzionisti, broker di dati o terze parti per scopi di marketing."
    },
    "gdprRights": {
      "title": "I Tuoi Diritti (Conformità GDPR)",
      "intro": "Hai il controllo completo sui tuoi dati:",
      "items": {
        "access": "Accesso: Esporta tutti i tuoi dati in qualsiasi momento in un formato portabile",
        "deletion": "Eliminazione: Elimina il tuo account e tutti i dati associati con un clic",
        "rectification": "Rettifica: Aggiorna o correggi qualsiasi tua informazione",
        "portability": "Portabilità: Porta i tuoi dati verso altri social network compatibili con Dunbar"
      }
    },
    "security": {
      "title": "Sicurezza",
      "description": "Usiamo la crittografia standard del settore per i dati in transito e a riposo. Le password sono hashate e non vengono mai memorizzate in testo semplice."
    },
    "contact": {
      "title": "Contatti",
      "description": "Domande sulla privacy? Contattaci a privacy@lifesaverlabs.org"
    }
  },
  "terms": {
    "title": "Termini di Servizio",
    "lastUpdated": "Ultimo aggiornamento: 1 gennaio 2025",
    "introduction": {
      "title": "Introduzione",
      "description": "Benvenuto su InnerFriend. Usando il nostro servizio, accetti questi termini. Li abbiamo mantenuti semplici e leggibili."
    },
    "service": {
      "title": "Il Servizio",
      "description": "InnerFriend ti aiuta a mantenere relazioni significative fornendo strumenti per organizzare e curare le tue cerchie sociali. Non siamo una piattaforma social — non ospitiamo contenuti pubblici né facilitiamo connessioni pubbliche."
    },
    "responsibilities": {
      "title": "Le Tue Responsabilità",
      "intro": "Usando InnerFriend, accetti di:",
      "items": {
        "accurate": "Fornire informazioni accurate quando crei un account",
        "secure": "Mantenere sicure le tue credenziali di accesso",
        "privacy": "Rispettare la privacy delle persone che aggiungi alle tue liste",
        "lawful": "Usare il servizio solo per scopi legittimi"
      }
    },
    "intellectualProperty": {
      "title": "Proprietà Intellettuale",
      "description": "InnerFriend è open source sotto licenza MIT. I tuoi dati ti appartengono — ne mantieni la piena proprietà."
    },
    "liability": {
      "title": "Limitazione di Responsabilità",
      "description": "InnerFriend è fornito \"così com'è\" senza garanzie. Non siamo responsabili per eventuali danni derivanti dal tuo uso del servizio."
    },
    "termination": {
      "title": "Risoluzione",
      "description": "Puoi eliminare il tuo account in qualsiasi momento. Ci riserviamo il diritto di terminare gli account che violano questi termini."
    },
    "changes": {
      "title": "Modifiche ai Termini",
      "description": "Potremmo aggiornare questi termini occasionalmente. Ti avviseremo di modifiche significative via email o attraverso l'app."
    },
    "contact": {
      "title": "Contatti",
      "description": "Domande? Contattaci a support@lifesaverlabs.org"
    }
  }
};

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Update Italian locale
const localePath = path.join(__dirname, '../public/locales/it/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, italianTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: it');
console.log('Done! Italian translations applied.');
