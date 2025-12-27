import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New translations for tierFeed, sunsetNudge, parasocialFeed, nayborVideo, and contactImport.sources
const translations = {
  // Arabic
  ar: {
    tierFeed: {
      toasts: {
        addContactInfo: "أضف معلومات الاتصال لـ {{name}} للتواصل",
        noContactInfo: "لا توجد معلومات اتصال لـ {{name}}",
        dontShowMonth: "لا تظهر لمدة شهر واحد",
        warningSilenced: "تم إيقاف تحذيرات {{method}} حتى الشهر القادم",
        connecting: "جاري الاتصال بـ {{name}} عبر {{method}}",
        planMeetup: "تواصل مع {{name}} لترتيب لقاء",
        markedConnected: "تم تحديد {{name}} كمتصل"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "جدولة مكالمة",
        sendVoiceNote: "إرسال رسالة صوتية",
        planMeetup: "تخطيط لقاء"
      },
      dateOptions: {
        today: "اليوم",
        yesterday: "أمس",
        twoDaysAgo: "قبل يومين",
        threeDaysAgo: "قبل 3 أيام",
        oneWeekAgo: "قبل أسبوع",
        twoWeeksAgo: "قبل أسبوعين"
      }
    },
    parasocialFeed: {
      new: "جديد",
      from: "من {{name}}",
      seen: "مشاهَد",
      unseen: "غير مشاهَد",
      unknownCreator: "منشئ غير معروف"
    },
    nayborVideo: {
      title: "ألن تكون جاري؟",
      clickToWatch: "انقر للمشاهدة على يوتيوب",
      blocked: "هل الفيديو محظور من قبل شبكتك؟",
      learnMore: "اعرف المزيد",
      iframeTitle: "ألن تكون جاري؟ - السيد روجرز"
    },
    contactImport: {
      sources: {
        contactPicker: "جهات اتصال الهاتف",
        vcard: "ملف vCard",
        csv: "ملف CSV"
      }
    },
    feed: {
      loading: "جاري تحميل الخلاصة...",
      errorLoadFeed: "فشل تحميل الخلاصة",
      retryLoadFeed: "إعادة محاولة تحميل الخلاصة"
    },
    nudge: {
      timeToReconnect: "حان وقت إعادة التواصل",
      friendsNeedAttention: "{{count}} صديق يحتاج إعادة تواصل",
      neverContacted: "لم يتم التواصل أبداً",
      daysSinceContact: "مضى {{days}} يوم منذ آخر تواصل",
      connected: "متصل"
    },
    accessibility: {
      selected: "محدد",
      nudge: {
        friendsList: "الأصدقاء الذين يحتاجون إعادة تواصل",
        actionGroup: "إجراءات لـ {{name}}",
        actionButton: "{{action}} مع {{name}}",
        connectedButton: "تحديد {{name}} كمتصل اليوم",
        selectDateButton: "اختر متى تواصلت مع {{name}}",
        dismissButton: "تجاهل التذكير لـ {{name}}"
      }
    }
  },

  // German
  de: {
    tierFeed: {
      toasts: {
        addContactInfo: "Kontaktinfo für {{name}} hinzufügen",
        noContactInfo: "Keine Kontaktinformationen für {{name}}",
        dontShowMonth: "Für 1 Monat nicht anzeigen",
        warningSilenced: "{{method}} Warnungen bis nächsten Monat stummgeschaltet",
        connecting: "Verbindung mit {{name}} über {{method}}",
        planMeetup: "Kontaktiere {{name}} für ein Treffen",
        markedConnected: "{{name}} als verbunden markiert"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Anruf planen",
        sendVoiceNote: "Sprachnachricht senden",
        planMeetup: "Treffen planen"
      },
      dateOptions: {
        today: "Heute",
        yesterday: "Gestern",
        twoDaysAgo: "Vor 2 Tagen",
        threeDaysAgo: "Vor 3 Tagen",
        oneWeekAgo: "Vor 1 Woche",
        twoWeeksAgo: "Vor 2 Wochen"
      }
    },
    parasocialFeed: {
      new: "Neu",
      from: "von {{name}}",
      seen: "Gesehen",
      unseen: "Ungesehen",
      unknownCreator: "Unbekannter Ersteller"
    },
    nayborVideo: {
      title: "Wärst du mein Nachbar?",
      clickToWatch: "Klicken um auf YouTube anzusehen",
      blocked: "Video von deinem Netzwerk blockiert?",
      learnMore: "Mehr erfahren",
      iframeTitle: "Wärst du mein Nachbar? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Telefonkontakte",
        vcard: "vCard-Datei",
        csv: "CSV-Datei"
      }
    },
    feed: {
      loading: "Feed wird geladen...",
      errorLoadFeed: "Feed konnte nicht geladen werden",
      retryLoadFeed: "Feed-Ladung wiederholen"
    },
    nudge: {
      timeToReconnect: "Zeit sich wieder zu verbinden",
      friendsNeedAttention: "{{count}} Freunde brauchen Kontakt",
      neverContacted: "Nie kontaktiert",
      daysSinceContact: "{{days}} Tage seit letztem Kontakt",
      connected: "Verbunden"
    },
    accessibility: {
      selected: "Ausgewählt",
      nudge: {
        friendsList: "Freunde die Kontakt brauchen",
        actionGroup: "Aktionen für {{name}}",
        actionButton: "{{action}} mit {{name}}",
        connectedButton: "{{name}} als heute verbunden markieren",
        selectDateButton: "Wähle wann du dich mit {{name}} verbunden hast",
        dismissButton: "Erinnerung für {{name}} verwerfen"
      }
    }
  },

  // Spanish
  es: {
    tierFeed: {
      toasts: {
        addContactInfo: "Añadir información de contacto de {{name}}",
        noContactInfo: "Sin información de contacto para {{name}}",
        dontShowMonth: "No mostrar durante 1 mes",
        warningSilenced: "Advertencias de {{method}} silenciadas hasta el próximo mes",
        connecting: "Conectando con {{name}} vía {{method}}",
        planMeetup: "Contacta a {{name}} para planear un encuentro",
        markedConnected: "{{name}} marcado como conectado"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Programar llamada",
        sendVoiceNote: "Enviar nota de voz",
        planMeetup: "Planear encuentro"
      },
      dateOptions: {
        today: "Hoy",
        yesterday: "Ayer",
        twoDaysAgo: "Hace 2 días",
        threeDaysAgo: "Hace 3 días",
        oneWeekAgo: "Hace 1 semana",
        twoWeeksAgo: "Hace 2 semanas"
      }
    },
    parasocialFeed: {
      new: "Nuevo",
      from: "de {{name}}",
      seen: "Visto",
      unseen: "No visto",
      unknownCreator: "Creador desconocido"
    },
    nayborVideo: {
      title: "¿Serías mi vecino?",
      clickToWatch: "Clic para ver en YouTube",
      blocked: "¿Video bloqueado por tu red?",
      learnMore: "Saber más",
      iframeTitle: "¿Serías mi vecino? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Contactos del teléfono",
        vcard: "Archivo vCard",
        csv: "Archivo CSV"
      }
    },
    feed: {
      loading: "Cargando feed...",
      errorLoadFeed: "Error al cargar el feed",
      retryLoadFeed: "Reintentar cargar el feed"
    },
    nudge: {
      timeToReconnect: "Hora de reconectar",
      friendsNeedAttention: "{{count}} amigos necesitan atención",
      neverContacted: "Nunca contactado",
      daysSinceContact: "{{days}} días desde el último contacto",
      connected: "Conectado"
    },
    accessibility: {
      selected: "Seleccionado",
      nudge: {
        friendsList: "Amigos que necesitan reconexión",
        actionGroup: "Acciones para {{name}}",
        actionButton: "{{action}} con {{name}}",
        connectedButton: "Marcar {{name}} como conectado hoy",
        selectDateButton: "Selecciona cuándo te conectaste con {{name}}",
        dismissButton: "Descartar recordatorio para {{name}}"
      }
    }
  },

  // French
  fr: {
    tierFeed: {
      toasts: {
        addContactInfo: "Ajouter les coordonnées de {{name}}",
        noContactInfo: "Pas d'informations de contact pour {{name}}",
        dontShowMonth: "Ne pas afficher pendant 1 mois",
        warningSilenced: "Avertissements {{method}} désactivés jusqu'au mois prochain",
        connecting: "Connexion avec {{name}} via {{method}}",
        planMeetup: "Contacter {{name}} pour planifier une rencontre",
        markedConnected: "{{name}} marqué comme connecté"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Planifier un appel",
        sendVoiceNote: "Envoyer une note vocale",
        planMeetup: "Planifier une rencontre"
      },
      dateOptions: {
        today: "Aujourd'hui",
        yesterday: "Hier",
        twoDaysAgo: "Il y a 2 jours",
        threeDaysAgo: "Il y a 3 jours",
        oneWeekAgo: "Il y a 1 semaine",
        twoWeeksAgo: "Il y a 2 semaines"
      }
    },
    parasocialFeed: {
      new: "Nouveau",
      from: "de {{name}}",
      seen: "Vu",
      unseen: "Non vu",
      unknownCreator: "Créateur inconnu"
    },
    nayborVideo: {
      title: "Veux-tu être mon voisin ?",
      clickToWatch: "Cliquez pour regarder sur YouTube",
      blocked: "Vidéo bloquée par votre réseau ?",
      learnMore: "En savoir plus",
      iframeTitle: "Veux-tu être mon voisin ? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Contacts du téléphone",
        vcard: "Fichier vCard",
        csv: "Fichier CSV"
      }
    },
    feed: {
      loading: "Chargement du fil...",
      errorLoadFeed: "Échec du chargement du fil",
      retryLoadFeed: "Réessayer de charger le fil"
    },
    nudge: {
      timeToReconnect: "Temps de se reconnecter",
      friendsNeedAttention: "{{count}} amis ont besoin d'attention",
      neverContacted: "Jamais contacté",
      daysSinceContact: "{{days}} jours depuis le dernier contact",
      connected: "Connecté"
    },
    accessibility: {
      selected: "Sélectionné",
      nudge: {
        friendsList: "Amis qui ont besoin de reconnexion",
        actionGroup: "Actions pour {{name}}",
        actionButton: "{{action}} avec {{name}}",
        connectedButton: "Marquer {{name}} comme connecté aujourd'hui",
        selectDateButton: "Sélectionnez quand vous vous êtes connecté avec {{name}}",
        dismissButton: "Ignorer le rappel pour {{name}}"
      }
    }
  },

  // Hebrew
  he: {
    tierFeed: {
      toasts: {
        addContactInfo: "הוסף פרטי קשר של {{name}}",
        noContactInfo: "אין פרטי קשר עבור {{name}}",
        dontShowMonth: "אל תציג למשך חודש",
        warningSilenced: "אזהרות {{method}} הושתקו עד החודש הבא",
        connecting: "מתחבר ל-{{name}} דרך {{method}}",
        planMeetup: "צור קשר עם {{name}} לתכנן פגישה",
        markedConnected: "{{name}} סומן כמחובר"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "תזמן שיחה",
        sendVoiceNote: "שלח הודעה קולית",
        planMeetup: "תכנן פגישה"
      },
      dateOptions: {
        today: "היום",
        yesterday: "אתמול",
        twoDaysAgo: "לפני יומיים",
        threeDaysAgo: "לפני 3 ימים",
        oneWeekAgo: "לפני שבוע",
        twoWeeksAgo: "לפני שבועיים"
      }
    },
    parasocialFeed: {
      new: "חדש",
      from: "מאת {{name}}",
      seen: "נצפה",
      unseen: "לא נצפה",
      unknownCreator: "יוצר לא ידוע"
    },
    nayborVideo: {
      title: "האם תהיה השכן שלי?",
      clickToWatch: "לחץ לצפייה ביוטיוב",
      blocked: "וידאו חסום על ידי הרשת שלך?",
      learnMore: "למד עוד",
      iframeTitle: "האם תהיה השכן שלי? - מר רוג'רס"
    },
    contactImport: {
      sources: {
        contactPicker: "אנשי קשר בטלפון",
        vcard: "קובץ vCard",
        csv: "קובץ CSV"
      }
    },
    feed: {
      loading: "טוען עדכונים...",
      errorLoadFeed: "נכשל בטעינת העדכונים",
      retryLoadFeed: "נסה שוב לטעון עדכונים"
    },
    nudge: {
      timeToReconnect: "זמן להתחבר מחדש",
      friendsNeedAttention: "{{count}} חברים צריכים תשומת לב",
      neverContacted: "מעולם לא יצרתי קשר",
      daysSinceContact: "{{days}} ימים מאז הקשר האחרון",
      connected: "מחובר"
    },
    accessibility: {
      selected: "נבחר",
      nudge: {
        friendsList: "חברים שצריכים חיבור מחדש",
        actionGroup: "פעולות עבור {{name}}",
        actionButton: "{{action}} עם {{name}}",
        connectedButton: "סמן את {{name}} כמחובר היום",
        selectDateButton: "בחר מתי התחברת עם {{name}}",
        dismissButton: "התעלם מהתזכורת עבור {{name}}"
      }
    }
  },

  // Hindi
  hi: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} की संपर्क जानकारी जोड़ें",
        noContactInfo: "{{name}} के लिए कोई संपर्क जानकारी नहीं",
        dontShowMonth: "1 महीने तक न दिखाएं",
        warningSilenced: "{{method}} चेतावनियां अगले महीने तक बंद",
        connecting: "{{method}} के माध्यम से {{name}} से जुड़ रहे हैं",
        planMeetup: "मिलने की योजना बनाने के लिए {{name}} से संपर्क करें",
        markedConnected: "{{name}} को जुड़ा हुआ चिह्नित किया गया"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "कॉल शेड्यूल करें",
        sendVoiceNote: "वॉयस नोट भेजें",
        planMeetup: "मिलने की योजना बनाएं"
      },
      dateOptions: {
        today: "आज",
        yesterday: "कल",
        twoDaysAgo: "2 दिन पहले",
        threeDaysAgo: "3 दिन पहले",
        oneWeekAgo: "1 सप्ताह पहले",
        twoWeeksAgo: "2 सप्ताह पहले"
      }
    },
    parasocialFeed: {
      new: "नया",
      from: "{{name}} से",
      seen: "देखा गया",
      unseen: "नहीं देखा",
      unknownCreator: "अज्ञात निर्माता"
    },
    nayborVideo: {
      title: "क्या तुम मेरे पड़ोसी बनोगे?",
      clickToWatch: "यूट्यूब पर देखने के लिए क्लिक करें",
      blocked: "वीडियो आपके नेटवर्क द्वारा अवरुद्ध?",
      learnMore: "और जानें",
      iframeTitle: "क्या तुम मेरे पड़ोसी बनोगे? - मिस्टर रोजर्स"
    },
    contactImport: {
      sources: {
        contactPicker: "फोन संपर्क",
        vcard: "vCard फाइल",
        csv: "CSV फाइल"
      }
    },
    feed: {
      loading: "फीड लोड हो रहा है...",
      errorLoadFeed: "फीड लोड करने में विफल",
      retryLoadFeed: "फीड पुनः लोड करें"
    },
    nudge: {
      timeToReconnect: "फिर से जुड़ने का समय",
      friendsNeedAttention: "{{count}} दोस्तों को ध्यान चाहिए",
      neverContacted: "कभी संपर्क नहीं किया",
      daysSinceContact: "अंतिम संपर्क के बाद {{days}} दिन",
      connected: "जुड़ा हुआ"
    },
    accessibility: {
      selected: "चयनित",
      nudge: {
        friendsList: "जिन दोस्तों को पुनः कनेक्ट करना है",
        actionGroup: "{{name}} के लिए कार्रवाई",
        actionButton: "{{name}} के साथ {{action}}",
        connectedButton: "{{name}} को आज जुड़ा हुआ चिह्नित करें",
        selectDateButton: "चुनें कि आपने {{name}} से कब जुड़े",
        dismissButton: "{{name}} के लिए अनुस्मारक खारिज करें"
      }
    }
  },

  // Italian
  it: {
    tierFeed: {
      toasts: {
        addContactInfo: "Aggiungi informazioni di contatto per {{name}}",
        noContactInfo: "Nessuna informazione di contatto per {{name}}",
        dontShowMonth: "Non mostrare per 1 mese",
        warningSilenced: "Avvisi {{method}} silenziati fino al mese prossimo",
        connecting: "Connessione con {{name}} tramite {{method}}",
        planMeetup: "Contatta {{name}} per pianificare un incontro",
        markedConnected: "{{name}} contrassegnato come connesso"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Programma chiamata",
        sendVoiceNote: "Invia nota vocale",
        planMeetup: "Pianifica incontro"
      },
      dateOptions: {
        today: "Oggi",
        yesterday: "Ieri",
        twoDaysAgo: "2 giorni fa",
        threeDaysAgo: "3 giorni fa",
        oneWeekAgo: "1 settimana fa",
        twoWeeksAgo: "2 settimane fa"
      }
    },
    parasocialFeed: {
      new: "Nuovo",
      from: "da {{name}}",
      seen: "Visto",
      unseen: "Non visto",
      unknownCreator: "Creatore sconosciuto"
    },
    nayborVideo: {
      title: "Vuoi essere il mio vicino?",
      clickToWatch: "Clicca per guardare su YouTube",
      blocked: "Video bloccato dalla tua rete?",
      learnMore: "Scopri di più",
      iframeTitle: "Vuoi essere il mio vicino? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Contatti del telefono",
        vcard: "File vCard",
        csv: "File CSV"
      }
    },
    feed: {
      loading: "Caricamento feed...",
      errorLoadFeed: "Caricamento feed fallito",
      retryLoadFeed: "Riprova a caricare il feed"
    },
    nudge: {
      timeToReconnect: "Tempo di riconnettersi",
      friendsNeedAttention: "{{count}} amici hanno bisogno di attenzione",
      neverContacted: "Mai contattato",
      daysSinceContact: "{{days}} giorni dall'ultimo contatto",
      connected: "Connesso"
    },
    accessibility: {
      selected: "Selezionato",
      nudge: {
        friendsList: "Amici che hanno bisogno di riconnettersi",
        actionGroup: "Azioni per {{name}}",
        actionButton: "{{action}} con {{name}}",
        connectedButton: "Segna {{name}} come connesso oggi",
        selectDateButton: "Seleziona quando ti sei connesso con {{name}}",
        dismissButton: "Ignora promemoria per {{name}}"
      }
    }
  },

  // Japanese
  ja: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}}の連絡先情報を追加",
        noContactInfo: "{{name}}の連絡先情報がありません",
        dontShowMonth: "1ヶ月間表示しない",
        warningSilenced: "{{method}}の警告を来月まで無効化",
        connecting: "{{method}}で{{name}}に接続中",
        planMeetup: "{{name}}に連絡して会う予定を立てる",
        markedConnected: "{{name}}を接続済みとしてマーク"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "通話を予約",
        sendVoiceNote: "ボイスメモを送信",
        planMeetup: "会う予定を立てる"
      },
      dateOptions: {
        today: "今日",
        yesterday: "昨日",
        twoDaysAgo: "2日前",
        threeDaysAgo: "3日前",
        oneWeekAgo: "1週間前",
        twoWeeksAgo: "2週間前"
      }
    },
    parasocialFeed: {
      new: "新着",
      from: "{{name}}から",
      seen: "既読",
      unseen: "未読",
      unknownCreator: "不明な作成者"
    },
    nayborVideo: {
      title: "私の隣人になってくれますか？",
      clickToWatch: "YouTubeで見るにはクリック",
      blocked: "ネットワークによってブロックされていますか？",
      learnMore: "詳しく見る",
      iframeTitle: "私の隣人になってくれますか？ - ミスターロジャース"
    },
    contactImport: {
      sources: {
        contactPicker: "電話の連絡先",
        vcard: "vCardファイル",
        csv: "CSVファイル"
      }
    },
    feed: {
      loading: "フィードを読み込み中...",
      errorLoadFeed: "フィードの読み込みに失敗しました",
      retryLoadFeed: "フィードの読み込みを再試行"
    },
    nudge: {
      timeToReconnect: "再接続の時間です",
      friendsNeedAttention: "{{count}}人の友達が注意を必要としています",
      neverContacted: "連絡したことがない",
      daysSinceContact: "最後の連絡から{{days}}日",
      connected: "接続済み"
    },
    accessibility: {
      selected: "選択済み",
      nudge: {
        friendsList: "再接続が必要な友達",
        actionGroup: "{{name}}のアクション",
        actionButton: "{{name}}と{{action}}",
        connectedButton: "{{name}}を今日接続済みとしてマーク",
        selectDateButton: "{{name}}といつ接続したか選択",
        dismissButton: "{{name}}のリマインダーを却下"
      }
    }
  },

  // Korean
  ko: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}}의 연락처 정보 추가",
        noContactInfo: "{{name}}의 연락처 정보가 없습니다",
        dontShowMonth: "1개월 동안 표시하지 않음",
        warningSilenced: "{{method}} 경고가 다음 달까지 무음",
        connecting: "{{method}}로 {{name}}에 연결 중",
        planMeetup: "{{name}}에게 연락하여 만남 계획",
        markedConnected: "{{name}}을(를) 연결됨으로 표시"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "통화 예약",
        sendVoiceNote: "음성 메모 보내기",
        planMeetup: "만남 계획"
      },
      dateOptions: {
        today: "오늘",
        yesterday: "어제",
        twoDaysAgo: "2일 전",
        threeDaysAgo: "3일 전",
        oneWeekAgo: "1주 전",
        twoWeeksAgo: "2주 전"
      }
    },
    parasocialFeed: {
      new: "새로운",
      from: "{{name}}에서",
      seen: "읽음",
      unseen: "읽지 않음",
      unknownCreator: "알 수 없는 작성자"
    },
    nayborVideo: {
      title: "내 이웃이 되어줄래요?",
      clickToWatch: "YouTube에서 보려면 클릭",
      blocked: "네트워크에서 동영상이 차단되었나요?",
      learnMore: "자세히 알아보기",
      iframeTitle: "내 이웃이 되어줄래요? - 미스터 로저스"
    },
    contactImport: {
      sources: {
        contactPicker: "전화 연락처",
        vcard: "vCard 파일",
        csv: "CSV 파일"
      }
    },
    feed: {
      loading: "피드 로딩 중...",
      errorLoadFeed: "피드 로드 실패",
      retryLoadFeed: "피드 다시 로드"
    },
    nudge: {
      timeToReconnect: "다시 연결할 시간",
      friendsNeedAttention: "{{count}}명의 친구가 관심이 필요합니다",
      neverContacted: "연락한 적 없음",
      daysSinceContact: "마지막 연락 후 {{days}}일",
      connected: "연결됨"
    },
    accessibility: {
      selected: "선택됨",
      nudge: {
        friendsList: "다시 연결이 필요한 친구들",
        actionGroup: "{{name}}에 대한 작업",
        actionButton: "{{name}}와(과) {{action}}",
        connectedButton: "{{name}}을(를) 오늘 연결됨으로 표시",
        selectDateButton: "{{name}}와(과) 언제 연결했는지 선택",
        dismissButton: "{{name}}에 대한 알림 닫기"
      }
    }
  },

  // Portuguese
  pt: {
    tierFeed: {
      toasts: {
        addContactInfo: "Adicionar informações de contato de {{name}}",
        noContactInfo: "Sem informações de contato para {{name}}",
        dontShowMonth: "Não mostrar por 1 mês",
        warningSilenced: "Avisos de {{method}} silenciados até o próximo mês",
        connecting: "Conectando com {{name}} via {{method}}",
        planMeetup: "Entre em contato com {{name}} para planejar um encontro",
        markedConnected: "{{name}} marcado como conectado"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Agendar chamada",
        sendVoiceNote: "Enviar nota de voz",
        planMeetup: "Planejar encontro"
      },
      dateOptions: {
        today: "Hoje",
        yesterday: "Ontem",
        twoDaysAgo: "2 dias atrás",
        threeDaysAgo: "3 dias atrás",
        oneWeekAgo: "1 semana atrás",
        twoWeeksAgo: "2 semanas atrás"
      }
    },
    parasocialFeed: {
      new: "Novo",
      from: "de {{name}}",
      seen: "Visto",
      unseen: "Não visto",
      unknownCreator: "Criador desconhecido"
    },
    nayborVideo: {
      title: "Quer ser meu vizinho?",
      clickToWatch: "Clique para assistir no YouTube",
      blocked: "Vídeo bloqueado pela sua rede?",
      learnMore: "Saiba mais",
      iframeTitle: "Quer ser meu vizinho? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Contatos do telefone",
        vcard: "Arquivo vCard",
        csv: "Arquivo CSV"
      }
    },
    feed: {
      loading: "Carregando feed...",
      errorLoadFeed: "Falha ao carregar o feed",
      retryLoadFeed: "Tentar carregar o feed novamente"
    },
    nudge: {
      timeToReconnect: "Hora de reconectar",
      friendsNeedAttention: "{{count}} amigos precisam de atenção",
      neverContacted: "Nunca contatado",
      daysSinceContact: "{{days}} dias desde o último contato",
      connected: "Conectado"
    },
    accessibility: {
      selected: "Selecionado",
      nudge: {
        friendsList: "Amigos que precisam de reconexão",
        actionGroup: "Ações para {{name}}",
        actionButton: "{{action}} com {{name}}",
        connectedButton: "Marcar {{name}} como conectado hoje",
        selectDateButton: "Selecione quando você se conectou com {{name}}",
        dismissButton: "Dispensar lembrete para {{name}}"
      }
    }
  },

  // Russian
  ru: {
    tierFeed: {
      toasts: {
        addContactInfo: "Добавьте контактную информацию для {{name}}",
        noContactInfo: "Нет контактной информации для {{name}}",
        dontShowMonth: "Не показывать 1 месяц",
        warningSilenced: "Предупреждения {{method}} отключены до следующего месяца",
        connecting: "Подключение к {{name}} через {{method}}",
        planMeetup: "Свяжитесь с {{name}} для планирования встречи",
        markedConnected: "{{name}} отмечен как на связи"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Запланировать звонок",
        sendVoiceNote: "Отправить голосовое сообщение",
        planMeetup: "Запланировать встречу"
      },
      dateOptions: {
        today: "Сегодня",
        yesterday: "Вчера",
        twoDaysAgo: "2 дня назад",
        threeDaysAgo: "3 дня назад",
        oneWeekAgo: "1 неделю назад",
        twoWeeksAgo: "2 недели назад"
      }
    },
    parasocialFeed: {
      new: "Новое",
      from: "от {{name}}",
      seen: "Просмотрено",
      unseen: "Не просмотрено",
      unknownCreator: "Неизвестный автор"
    },
    nayborVideo: {
      title: "Хочешь быть моим соседом?",
      clickToWatch: "Нажмите для просмотра на YouTube",
      blocked: "Видео заблокировано вашей сетью?",
      learnMore: "Узнать больше",
      iframeTitle: "Хочешь быть моим соседом? - Мистер Роджерс"
    },
    contactImport: {
      sources: {
        contactPicker: "Контакты телефона",
        vcard: "Файл vCard",
        csv: "Файл CSV"
      }
    },
    feed: {
      loading: "Загрузка ленты...",
      errorLoadFeed: "Не удалось загрузить ленту",
      retryLoadFeed: "Повторить загрузку ленты"
    },
    nudge: {
      timeToReconnect: "Пора восстановить связь",
      friendsNeedAttention: "{{count}} друзей нуждаются во внимании",
      neverContacted: "Никогда не связывались",
      daysSinceContact: "{{days}} дней с последнего контакта",
      connected: "На связи"
    },
    accessibility: {
      selected: "Выбрано",
      nudge: {
        friendsList: "Друзья, с которыми нужно восстановить связь",
        actionGroup: "Действия для {{name}}",
        actionButton: "{{action}} с {{name}}",
        connectedButton: "Отметить {{name}} как на связи сегодня",
        selectDateButton: "Выберите, когда вы связались с {{name}}",
        dismissButton: "Отклонить напоминание для {{name}}"
      }
    }
  },

  // Turkish
  tr: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} için iletişim bilgisi ekleyin",
        noContactInfo: "{{name}} için iletişim bilgisi yok",
        dontShowMonth: "1 ay boyunca gösterme",
        warningSilenced: "{{method}} uyarıları gelecek aya kadar susturuldu",
        connecting: "{{method}} üzerinden {{name}} ile bağlanılıyor",
        planMeetup: "Buluşma planlamak için {{name}} ile iletişime geçin",
        markedConnected: "{{name}} bağlı olarak işaretlendi"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Arama Planla",
        sendVoiceNote: "Sesli Not Gönder",
        planMeetup: "Buluşma Planla"
      },
      dateOptions: {
        today: "Bugün",
        yesterday: "Dün",
        twoDaysAgo: "2 gün önce",
        threeDaysAgo: "3 gün önce",
        oneWeekAgo: "1 hafta önce",
        twoWeeksAgo: "2 hafta önce"
      }
    },
    parasocialFeed: {
      new: "Yeni",
      from: "{{name}} tarafından",
      seen: "Görüldü",
      unseen: "Görülmedi",
      unknownCreator: "Bilinmeyen İçerik Üretici"
    },
    nayborVideo: {
      title: "Komşum olur musun?",
      clickToWatch: "YouTube'da izlemek için tıklayın",
      blocked: "Video ağınız tarafından engellendi mi?",
      learnMore: "Daha fazla bilgi",
      iframeTitle: "Komşum olur musun? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Telefon Kişileri",
        vcard: "vCard Dosyası",
        csv: "CSV Dosyası"
      }
    },
    feed: {
      loading: "Akış yükleniyor...",
      errorLoadFeed: "Akış yüklenemedi",
      retryLoadFeed: "Akışı yeniden yükle"
    },
    nudge: {
      timeToReconnect: "Yeniden bağlanma zamanı",
      friendsNeedAttention: "{{count}} arkadaş ilgiye ihtiyaç duyuyor",
      neverContacted: "Hiç iletişime geçilmedi",
      daysSinceContact: "Son iletişimden bu yana {{days}} gün",
      connected: "Bağlandı"
    },
    accessibility: {
      selected: "Seçili",
      nudge: {
        friendsList: "Yeniden bağlanması gereken arkadaşlar",
        actionGroup: "{{name}} için eylemler",
        actionButton: "{{name}} ile {{action}}",
        connectedButton: "{{name}} bugün bağlandı olarak işaretle",
        selectDateButton: "{{name}} ile ne zaman bağlandığınızı seçin",
        dismissButton: "{{name}} için hatırlatmayı kapat"
      }
    }
  },

  // Chinese
  zh: {
    tierFeed: {
      toasts: {
        addContactInfo: "添加 {{name}} 的联系方式",
        noContactInfo: "{{name}} 没有联系方式",
        dontShowMonth: "1个月内不再显示",
        warningSilenced: "{{method}} 警告已静音至下月",
        connecting: "正在通过 {{method}} 连接 {{name}}",
        planMeetup: "联系 {{name}} 计划见面",
        markedConnected: "已将 {{name}} 标记为已联系"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "安排通话",
        sendVoiceNote: "发送语音",
        planMeetup: "计划见面"
      },
      dateOptions: {
        today: "今天",
        yesterday: "昨天",
        twoDaysAgo: "2天前",
        threeDaysAgo: "3天前",
        oneWeekAgo: "1周前",
        twoWeeksAgo: "2周前"
      }
    },
    parasocialFeed: {
      new: "新",
      from: "来自 {{name}}",
      seen: "已读",
      unseen: "未读",
      unknownCreator: "未知创作者"
    },
    nayborVideo: {
      title: "你愿意做我的邻居吗？",
      clickToWatch: "点击在YouTube观看",
      blocked: "视频被您的网络屏蔽了？",
      learnMore: "了解更多",
      iframeTitle: "你愿意做我的邻居吗？ - 罗杰斯先生"
    },
    contactImport: {
      sources: {
        contactPicker: "手机通讯录",
        vcard: "vCard 文件",
        csv: "CSV 文件"
      }
    },
    feed: {
      loading: "正在加载动态...",
      errorLoadFeed: "加载动态失败",
      retryLoadFeed: "重试加载动态"
    },
    nudge: {
      timeToReconnect: "是时候重新联系了",
      friendsNeedAttention: "{{count}} 位朋友需要关注",
      neverContacted: "从未联系过",
      daysSinceContact: "距上次联系已过 {{days}} 天",
      connected: "已联系"
    },
    accessibility: {
      selected: "已选择",
      nudge: {
        friendsList: "需要重新联系的朋友",
        actionGroup: "{{name}} 的操作",
        actionButton: "与 {{name}} {{action}}",
        connectedButton: "将 {{name}} 标记为今天已联系",
        selectDateButton: "选择您与 {{name}} 联系的时间",
        dismissButton: "关闭 {{name}} 的提醒"
      }
    }
  },

  // Vietnamese
  vi: {
    tierFeed: {
      toasts: {
        addContactInfo: "Thêm thông tin liên lạc của {{name}}",
        noContactInfo: "Không có thông tin liên lạc cho {{name}}",
        dontShowMonth: "Không hiển thị trong 1 tháng",
        warningSilenced: "Cảnh báo {{method}} đã tắt tiếng đến tháng sau",
        connecting: "Đang kết nối với {{name}} qua {{method}}",
        planMeetup: "Liên hệ {{name}} để lên kế hoạch gặp mặt",
        markedConnected: "Đã đánh dấu {{name}} là đã kết nối"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Lên lịch gọi",
        sendVoiceNote: "Gửi tin nhắn thoại",
        planMeetup: "Lên kế hoạch gặp mặt"
      },
      dateOptions: {
        today: "Hôm nay",
        yesterday: "Hôm qua",
        twoDaysAgo: "2 ngày trước",
        threeDaysAgo: "3 ngày trước",
        oneWeekAgo: "1 tuần trước",
        twoWeeksAgo: "2 tuần trước"
      }
    },
    parasocialFeed: {
      new: "Mới",
      from: "từ {{name}}",
      seen: "Đã xem",
      unseen: "Chưa xem",
      unknownCreator: "Người tạo không xác định"
    },
    nayborVideo: {
      title: "Bạn có muốn làm hàng xóm của tôi không?",
      clickToWatch: "Nhấp để xem trên YouTube",
      blocked: "Video bị chặn bởi mạng của bạn?",
      learnMore: "Tìm hiểu thêm",
      iframeTitle: "Bạn có muốn làm hàng xóm của tôi không? - Mr. Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Danh bạ điện thoại",
        vcard: "Tệp vCard",
        csv: "Tệp CSV"
      }
    },
    feed: {
      loading: "Đang tải bảng tin...",
      errorLoadFeed: "Không thể tải bảng tin",
      retryLoadFeed: "Thử lại tải bảng tin"
    },
    nudge: {
      timeToReconnect: "Đến lúc kết nối lại",
      friendsNeedAttention: "{{count}} bạn bè cần quan tâm",
      neverContacted: "Chưa từng liên lạc",
      daysSinceContact: "{{days}} ngày kể từ lần liên lạc cuối",
      connected: "Đã kết nối"
    },
    accessibility: {
      selected: "Đã chọn",
      nudge: {
        friendsList: "Bạn bè cần kết nối lại",
        actionGroup: "Hành động cho {{name}}",
        actionButton: "{{action}} với {{name}}",
        connectedButton: "Đánh dấu {{name}} đã kết nối hôm nay",
        selectDateButton: "Chọn khi bạn đã kết nối với {{name}}",
        dismissButton: "Bỏ qua nhắc nhở cho {{name}}"
      }
    }
  },

  // Bengali
  bn: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}}-এর যোগাযোগের তথ্য যোগ করুন",
        noContactInfo: "{{name}}-এর জন্য কোনো যোগাযোগের তথ্য নেই",
        dontShowMonth: "১ মাসের জন্য দেখাবেন না",
        warningSilenced: "{{method}} সতর্কতা পরের মাস পর্যন্ত নীরব",
        connecting: "{{method}} এর মাধ্যমে {{name}}-এর সাথে সংযুক্ত হচ্ছে",
        planMeetup: "দেখা করার পরিকল্পনা করতে {{name}}-এর সাথে যোগাযোগ করুন",
        markedConnected: "{{name}} সংযুক্ত হিসাবে চিহ্নিত"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "কল নির্ধারণ করুন",
        sendVoiceNote: "ভয়েস নোট পাঠান",
        planMeetup: "সাক্ষাতের পরিকল্পনা করুন"
      },
      dateOptions: {
        today: "আজ",
        yesterday: "গতকাল",
        twoDaysAgo: "২ দিন আগে",
        threeDaysAgo: "৩ দিন আগে",
        oneWeekAgo: "১ সপ্তাহ আগে",
        twoWeeksAgo: "২ সপ্তাহ আগে"
      }
    },
    parasocialFeed: {
      new: "নতুন",
      from: "{{name}} থেকে",
      seen: "দেখা হয়েছে",
      unseen: "দেখা হয়নি",
      unknownCreator: "অজানা নির্মাতা"
    },
    nayborVideo: {
      title: "আপনি কি আমার প্রতিবেশী হবেন?",
      clickToWatch: "YouTube-এ দেখতে ক্লিক করুন",
      blocked: "আপনার নেটওয়ার্ক দ্বারা ভিডিও অবরুদ্ধ?",
      learnMore: "আরও জানুন",
      iframeTitle: "আপনি কি আমার প্রতিবেশী হবেন? - মিস্টার রজার্স"
    },
    contactImport: {
      sources: {
        contactPicker: "ফোন পরিচিতি",
        vcard: "vCard ফাইল",
        csv: "CSV ফাইল"
      }
    },
    feed: {
      loading: "ফিড লোড হচ্ছে...",
      errorLoadFeed: "ফিড লোড করতে ব্যর্থ",
      retryLoadFeed: "ফিড পুনরায় লোড করুন"
    },
    nudge: {
      timeToReconnect: "পুনরায় সংযোগ করার সময়",
      friendsNeedAttention: "{{count}} বন্ধুর মনোযোগ দরকার",
      neverContacted: "কখনো যোগাযোগ করা হয়নি",
      daysSinceContact: "শেষ যোগাযোগের পর {{days}} দিন",
      connected: "সংযুক্ত"
    },
    accessibility: {
      selected: "নির্বাচিত",
      nudge: {
        friendsList: "যাদের সাথে পুনরায় সংযোগ দরকার",
        actionGroup: "{{name}}-এর জন্য ক্রিয়া",
        actionButton: "{{name}}-এর সাথে {{action}}",
        connectedButton: "{{name}}-কে আজ সংযুক্ত হিসাবে চিহ্নিত করুন",
        selectDateButton: "আপনি {{name}}-এর সাথে কখন সংযুক্ত হয়েছিলেন তা নির্বাচন করুন",
        dismissButton: "{{name}}-এর জন্য অনুস্মারক বাতিল করুন"
      }
    }
  },

  // Urdu
  ur: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} کی رابطہ معلومات شامل کریں",
        noContactInfo: "{{name}} کے لیے کوئی رابطہ معلومات نہیں",
        dontShowMonth: "1 مہینے تک نہ دکھائیں",
        warningSilenced: "{{method}} انتباہات اگلے مہینے تک خاموش",
        connecting: "{{method}} کے ذریعے {{name}} سے جڑ رہا ہے",
        planMeetup: "ملاقات کی منصوبہ بندی کے لیے {{name}} سے رابطہ کریں",
        markedConnected: "{{name}} کو جڑا ہوا نشان زد کیا گیا"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "کال شیڈول کریں",
        sendVoiceNote: "وائس نوٹ بھیجیں",
        planMeetup: "ملاقات کی منصوبہ بندی کریں"
      },
      dateOptions: {
        today: "آج",
        yesterday: "کل",
        twoDaysAgo: "2 دن پہلے",
        threeDaysAgo: "3 دن پہلے",
        oneWeekAgo: "1 ہفتہ پہلے",
        twoWeeksAgo: "2 ہفتے پہلے"
      }
    },
    parasocialFeed: {
      new: "نیا",
      from: "{{name}} کی طرف سے",
      seen: "دیکھا گیا",
      unseen: "نہیں دیکھا گیا",
      unknownCreator: "نامعلوم تخلیق کار"
    },
    nayborVideo: {
      title: "کیا آپ میرے پڑوسی بنیں گے؟",
      clickToWatch: "YouTube پر دیکھنے کے لیے کلک کریں",
      blocked: "ویڈیو آپ کے نیٹ ورک نے بلاک کر دیا؟",
      learnMore: "مزید جانیں",
      iframeTitle: "کیا آپ میرے پڑوسی بنیں گے؟ - مسٹر راجرز"
    },
    contactImport: {
      sources: {
        contactPicker: "فون رابطے",
        vcard: "vCard فائل",
        csv: "CSV فائل"
      }
    },
    feed: {
      loading: "فیڈ لوڈ ہو رہا ہے...",
      errorLoadFeed: "فیڈ لوڈ کرنے میں ناکام",
      retryLoadFeed: "فیڈ دوبارہ لوڈ کریں"
    },
    nudge: {
      timeToReconnect: "دوبارہ جڑنے کا وقت",
      friendsNeedAttention: "{{count}} دوستوں کو توجہ چاہیے",
      neverContacted: "کبھی رابطہ نہیں کیا",
      daysSinceContact: "آخری رابطے کے بعد {{days}} دن",
      connected: "جڑا ہوا"
    },
    accessibility: {
      selected: "منتخب",
      nudge: {
        friendsList: "جن دوستوں کو دوبارہ جڑنا ہے",
        actionGroup: "{{name}} کے لیے اقدامات",
        actionButton: "{{name}} کے ساتھ {{action}}",
        connectedButton: "{{name}} کو آج جڑا ہوا نشان زد کریں",
        selectDateButton: "منتخب کریں کہ آپ {{name}} سے کب جڑے",
        dismissButton: "{{name}} کے لیے یاد دہانی خارج کریں"
      }
    }
  },

  // Javanese
  jv: {
    tierFeed: {
      toasts: {
        addContactInfo: "Tambahake info kontak {{name}}",
        noContactInfo: "Ora ana info kontak kanggo {{name}}",
        dontShowMonth: "Aja tampilake 1 sasi",
        warningSilenced: "Peringatan {{method}} dipateni nganti sasi ngarep",
        connecting: "Nyambung karo {{name}} liwat {{method}}",
        planMeetup: "Hubungi {{name}} kanggo ngrancang ketemu",
        markedConnected: "{{name}} ditandai wis nyambung"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "Jadwalake Telpon",
        sendVoiceNote: "Kirim Cathetan Swara",
        planMeetup: "Rancang Ketemu"
      },
      dateOptions: {
        today: "Dina iki",
        yesterday: "Wingi",
        twoDaysAgo: "2 dina kepungkur",
        threeDaysAgo: "3 dina kepungkur",
        oneWeekAgo: "1 minggu kepungkur",
        twoWeeksAgo: "2 minggu kepungkur"
      }
    },
    parasocialFeed: {
      new: "Anyar",
      from: "saka {{name}}",
      seen: "Wis dideleng",
      unseen: "Durung dideleng",
      unknownCreator: "Kreator ora dikenal"
    },
    nayborVideo: {
      title: "Gelem dadi tanggaku?",
      clickToWatch: "Klik kanggo nonton ing YouTube",
      blocked: "Video diblokir jaringanmu?",
      learnMore: "Sinau luwih akeh",
      iframeTitle: "Gelem dadi tanggaku? - Pak Rogers"
    },
    contactImport: {
      sources: {
        contactPicker: "Kontak HP",
        vcard: "File vCard",
        csv: "File CSV"
      }
    },
    feed: {
      loading: "Ngisi feed...",
      errorLoadFeed: "Gagal ngisi feed",
      retryLoadFeed: "Coba maneh ngisi feed"
    },
    nudge: {
      timeToReconnect: "Wektune nyambung maneh",
      friendsNeedAttention: "{{count}} kanca butuh perhatian",
      neverContacted: "Durung tau dihubungi",
      daysSinceContact: "{{days}} dina wiwit kontak pungkasan",
      connected: "Wis nyambung"
    },
    accessibility: {
      selected: "Dipilih",
      nudge: {
        friendsList: "Kanca sing kudu disambung maneh",
        actionGroup: "Aksi kanggo {{name}}",
        actionButton: "{{action}} karo {{name}}",
        connectedButton: "Tandai {{name}} wis nyambung dina iki",
        selectDateButton: "Pilih kapan kowe nyambung karo {{name}}",
        dismissButton: "Tutup pengeling kanggo {{name}}"
      }
    }
  },

  // Marathi
  mr: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} साठी संपर्क माहिती जोडा",
        noContactInfo: "{{name}} साठी संपर्क माहिती नाही",
        dontShowMonth: "1 महिना दाखवू नका",
        warningSilenced: "{{method}} सूचना पुढील महिन्यापर्यंत बंद",
        connecting: "{{method}} द्वारे {{name}} शी जोडत आहे",
        planMeetup: "भेटीचे नियोजन करण्यासाठी {{name}} शी संपर्क साधा",
        markedConnected: "{{name}} ला जोडले म्हणून चिन्हांकित केले"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "कॉल शेड्यूल करा",
        sendVoiceNote: "व्हॉइस नोट पाठवा",
        planMeetup: "भेटीचे नियोजन करा"
      },
      dateOptions: {
        today: "आज",
        yesterday: "काल",
        twoDaysAgo: "2 दिवसांपूर्वी",
        threeDaysAgo: "3 दिवसांपूर्वी",
        oneWeekAgo: "1 आठवड्यापूर्वी",
        twoWeeksAgo: "2 आठवड्यांपूर्वी"
      }
    },
    parasocialFeed: {
      new: "नवीन",
      from: "{{name}} कडून",
      seen: "पाहिले",
      unseen: "पाहिले नाही",
      unknownCreator: "अज्ञात निर्माता"
    },
    nayborVideo: {
      title: "तुम्ही माझे शेजारी व्हाल का?",
      clickToWatch: "YouTube वर पाहण्यासाठी क्लिक करा",
      blocked: "व्हिडिओ तुमच्या नेटवर्कने ब्लॉक केला?",
      learnMore: "अधिक जाणून घ्या",
      iframeTitle: "तुम्ही माझे शेजारी व्हाल का? - मिस्टर रॉजर्स"
    },
    contactImport: {
      sources: {
        contactPicker: "फोन संपर्क",
        vcard: "vCard फाइल",
        csv: "CSV फाइल"
      }
    },
    feed: {
      loading: "फीड लोड होत आहे...",
      errorLoadFeed: "फीड लोड करण्यात अयशस्वी",
      retryLoadFeed: "फीड पुन्हा लोड करा"
    },
    nudge: {
      timeToReconnect: "पुन्हा जोडण्याची वेळ",
      friendsNeedAttention: "{{count}} मित्रांना लक्ष देणे आवश्यक आहे",
      neverContacted: "कधीही संपर्क केला नाही",
      daysSinceContact: "शेवटच्या संपर्कापासून {{days}} दिवस",
      connected: "जोडले"
    },
    accessibility: {
      selected: "निवडले",
      nudge: {
        friendsList: "पुन्हा जोडणे आवश्यक असलेले मित्र",
        actionGroup: "{{name}} साठी क्रिया",
        actionButton: "{{name}} सोबत {{action}}",
        connectedButton: "{{name}} ला आज जोडले म्हणून चिन्हांकित करा",
        selectDateButton: "तुम्ही {{name}} शी केव्हा जोडले ते निवडा",
        dismissButton: "{{name}} साठी स्मरणपत्र बंद करा"
      }
    }
  },

  // Tamil
  ta: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} இன் தொடர்பு தகவலைச் சேர்க்கவும்",
        noContactInfo: "{{name}} க்கு தொடர்பு தகவல் இல்லை",
        dontShowMonth: "1 மாதத்திற்கு காட்டாதே",
        warningSilenced: "{{method}} எச்சரிக்கைகள் அடுத்த மாதம் வரை அமைதி",
        connecting: "{{method}} மூலம் {{name}} உடன் இணைக்கிறது",
        planMeetup: "சந்திப்பைத் திட்டமிட {{name}} ஐ தொடர்பு கொள்ளுங்கள்",
        markedConnected: "{{name}} இணைந்ததாகக் குறிக்கப்பட்டது"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "அழைப்பை திட்டமிடு",
        sendVoiceNote: "குரல் குறிப்பு அனுப்பு",
        planMeetup: "சந்திப்பைத் திட்டமிடு"
      },
      dateOptions: {
        today: "இன்று",
        yesterday: "நேற்று",
        twoDaysAgo: "2 நாட்களுக்கு முன்",
        threeDaysAgo: "3 நாட்களுக்கு முன்",
        oneWeekAgo: "1 வாரத்திற்கு முன்",
        twoWeeksAgo: "2 வாரங்களுக்கு முன்"
      }
    },
    parasocialFeed: {
      new: "புதிய",
      from: "{{name}} இலிருந்து",
      seen: "பார்த்தது",
      unseen: "பார்க்கவில்லை",
      unknownCreator: "அறியப்படாத படைப்பாளர்"
    },
    nayborVideo: {
      title: "நீ என் அண்டை வீட்டாராக இருப்பாயா?",
      clickToWatch: "YouTube இல் பார்க்க கிளிக் செய்யவும்",
      blocked: "உங்கள் நெட்வொர்க் மூலம் வீடியோ தடுக்கப்பட்டதா?",
      learnMore: "மேலும் அறிக",
      iframeTitle: "நீ என் அண்டை வீட்டாராக இருப்பாயா? - மிஸ்டர் ரோஜர்ஸ்"
    },
    contactImport: {
      sources: {
        contactPicker: "தொலைபேசி தொடர்புகள்",
        vcard: "vCard கோப்பு",
        csv: "CSV கோப்பு"
      }
    },
    feed: {
      loading: "ஃபீட் ஏற்றப்படுகிறது...",
      errorLoadFeed: "ஃபீட் ஏற்ற முடியவில்லை",
      retryLoadFeed: "ஃபீட்டை மீண்டும் ஏற்று"
    },
    nudge: {
      timeToReconnect: "மீண்டும் இணைக்க நேரம்",
      friendsNeedAttention: "{{count}} நண்பர்களுக்கு கவனம் தேவை",
      neverContacted: "ஒருபோதும் தொடர்பு கொள்ளவில்லை",
      daysSinceContact: "கடைசி தொடர்பிலிருந்து {{days}} நாட்கள்",
      connected: "இணைந்தது"
    },
    accessibility: {
      selected: "தேர்ந்தெடுக்கப்பட்டது",
      nudge: {
        friendsList: "மீண்டும் இணைக்க வேண்டிய நண்பர்கள்",
        actionGroup: "{{name}} க்கான செயல்கள்",
        actionButton: "{{name}} உடன் {{action}}",
        connectedButton: "{{name}} ஐ இன்று இணைந்ததாகக் குறி",
        selectDateButton: "நீங்கள் {{name}} உடன் எப்போது இணைந்தீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்",
        dismissButton: "{{name}} க்கான நினைவூட்டலை நிராகரி"
      }
    }
  },

  // Telugu
  te: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} సంప్రదింపు సమాచారాన్ని జోడించండి",
        noContactInfo: "{{name}} కోసం సంప్రదింపు సమాచారం లేదు",
        dontShowMonth: "1 నెల పాటు చూపించకు",
        warningSilenced: "{{method}} హెచ్చరికలు వచ్చే నెల వరకు నిశ్శబ్దం",
        connecting: "{{method}} ద్వారా {{name}} తో కనెక్ట్ అవుతోంది",
        planMeetup: "కలుసుకోవడానికి ప్లాన్ చేయడానికి {{name}} ను సంప్రదించండి",
        markedConnected: "{{name}} కనెక్ట్ అయినట్లు గుర్తించబడింది"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "కాల్ షెడ్యూల్ చేయండి",
        sendVoiceNote: "వాయిస్ నోట్ పంపండి",
        planMeetup: "కలుసుకోవడం ప్లాన్ చేయండి"
      },
      dateOptions: {
        today: "ఈ రోజు",
        yesterday: "నిన్న",
        twoDaysAgo: "2 రోజుల క్రితం",
        threeDaysAgo: "3 రోజుల క్రితం",
        oneWeekAgo: "1 వారం క్రితం",
        twoWeeksAgo: "2 వారాల క్రితం"
      }
    },
    parasocialFeed: {
      new: "కొత్త",
      from: "{{name}} నుండి",
      seen: "చూశారు",
      unseen: "చూడలేదు",
      unknownCreator: "తెలియని సృష్టికర్త"
    },
    nayborVideo: {
      title: "మీరు నా పొరుగువారు అవుతారా?",
      clickToWatch: "YouTube లో చూడటానికి క్లిక్ చేయండి",
      blocked: "మీ నెట్‌వర్క్ ద్వారా వీడియో బ్లాక్ చేయబడిందా?",
      learnMore: "మరింత తెలుసుకోండి",
      iframeTitle: "మీరు నా పొరుగువారు అవుతారా? - మిస్టర్ రోజర్స్"
    },
    contactImport: {
      sources: {
        contactPicker: "ఫోన్ కాంటాక్ట్‌లు",
        vcard: "vCard ఫైల్",
        csv: "CSV ఫైల్"
      }
    },
    feed: {
      loading: "ఫీడ్ లోడ్ అవుతోంది...",
      errorLoadFeed: "ఫీడ్ లోడ్ చేయడంలో విఫలమైంది",
      retryLoadFeed: "ఫీడ్ మళ్ళీ లోడ్ చేయండి"
    },
    nudge: {
      timeToReconnect: "మళ్ళీ కనెక్ట్ అయ్యే సమయం",
      friendsNeedAttention: "{{count}} మంది స్నేహితులకు శ్రద్ధ అవసరం",
      neverContacted: "ఎప్పుడూ సంప్రదించలేదు",
      daysSinceContact: "చివరి సంప్రదింపు నుండి {{days}} రోజులు",
      connected: "కనెక్ట్ అయింది"
    },
    accessibility: {
      selected: "ఎంచుకోబడింది",
      nudge: {
        friendsList: "మళ్ళీ కనెక్ట్ అవ్వాల్సిన స్నేహితులు",
        actionGroup: "{{name}} కోసం చర్యలు",
        actionButton: "{{name}} తో {{action}}",
        connectedButton: "{{name}} ను ఈ రోజు కనెక్ట్ అయినట్లు గుర్తించండి",
        selectDateButton: "మీరు {{name}} తో ఎప్పుడు కనెక్ట్ అయ్యారో ఎంచుకోండి",
        dismissButton: "{{name}} కోసం రిమైండర్ తీసివేయండి"
      }
    }
  },

  // Punjabi
  pa: {
    tierFeed: {
      toasts: {
        addContactInfo: "{{name}} ਲਈ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਜੋੜੋ",
        noContactInfo: "{{name}} ਲਈ ਕੋਈ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਨਹੀਂ",
        dontShowMonth: "1 ਮਹੀਨੇ ਲਈ ਨਾ ਦਿਖਾਓ",
        warningSilenced: "{{method}} ਚੇਤਾਵਨੀਆਂ ਅਗਲੇ ਮਹੀਨੇ ਤੱਕ ਬੰਦ",
        connecting: "{{method}} ਰਾਹੀਂ {{name}} ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ",
        planMeetup: "ਮਿਲਣ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਲਈ {{name}} ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
        markedConnected: "{{name}} ਨੂੰ ਜੁੜਿਆ ਮਾਰਕ ਕੀਤਾ ਗਿਆ"
      }
    },
    sunsetNudge: {
      actions: {
        scheduleCall: "ਕਾਲ ਤਹਿ ਕਰੋ",
        sendVoiceNote: "ਵੌਇਸ ਨੋਟ ਭੇਜੋ",
        planMeetup: "ਮਿਲਣ ਦੀ ਯੋਜਨਾ ਬਣਾਓ"
      },
      dateOptions: {
        today: "ਅੱਜ",
        yesterday: "ਕੱਲ੍ਹ",
        twoDaysAgo: "2 ਦਿਨ ਪਹਿਲਾਂ",
        threeDaysAgo: "3 ਦਿਨ ਪਹਿਲਾਂ",
        oneWeekAgo: "1 ਹਫ਼ਤਾ ਪਹਿਲਾਂ",
        twoWeeksAgo: "2 ਹਫ਼ਤੇ ਪਹਿਲਾਂ"
      }
    },
    parasocialFeed: {
      new: "ਨਵਾਂ",
      from: "{{name}} ਤੋਂ",
      seen: "ਦੇਖਿਆ",
      unseen: "ਨਹੀਂ ਦੇਖਿਆ",
      unknownCreator: "ਅਣਜਾਣ ਸਿਰਜਣਹਾਰ"
    },
    nayborVideo: {
      title: "ਕੀ ਤੁਸੀਂ ਮੇਰੇ ਗੁਆਂਢੀ ਬਣੋਗੇ?",
      clickToWatch: "YouTube 'ਤੇ ਦੇਖਣ ਲਈ ਕਲਿੱਕ ਕਰੋ",
      blocked: "ਤੁਹਾਡੇ ਨੈੱਟਵਰਕ ਦੁਆਰਾ ਵੀਡੀਓ ਬਲੌਕ ਕੀਤੀ ਗਈ?",
      learnMore: "ਹੋਰ ਜਾਣੋ",
      iframeTitle: "ਕੀ ਤੁਸੀਂ ਮੇਰੇ ਗੁਆਂਢੀ ਬਣੋਗੇ? - ਮਿਸਟਰ ਰੋਜਰਸ"
    },
    contactImport: {
      sources: {
        contactPicker: "ਫ਼ੋਨ ਸੰਪਰਕ",
        vcard: "vCard ਫਾਈਲ",
        csv: "CSV ਫਾਈਲ"
      }
    },
    feed: {
      loading: "ਫੀਡ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...",
      errorLoadFeed: "ਫੀਡ ਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",
      retryLoadFeed: "ਫੀਡ ਦੁਬਾਰਾ ਲੋਡ ਕਰੋ"
    },
    nudge: {
      timeToReconnect: "ਦੁਬਾਰਾ ਜੁੜਨ ਦਾ ਸਮਾਂ",
      friendsNeedAttention: "{{count}} ਦੋਸਤਾਂ ਨੂੰ ਧਿਆਨ ਦੀ ਲੋੜ ਹੈ",
      neverContacted: "ਕਦੇ ਸੰਪਰਕ ਨਹੀਂ ਕੀਤਾ",
      daysSinceContact: "ਆਖਰੀ ਸੰਪਰਕ ਤੋਂ {{days}} ਦਿਨ",
      connected: "ਜੁੜਿਆ"
    },
    accessibility: {
      selected: "ਚੁਣਿਆ ਗਿਆ",
      nudge: {
        friendsList: "ਦੁਬਾਰਾ ਜੁੜਨ ਵਾਲੇ ਦੋਸਤ",
        actionGroup: "{{name}} ਲਈ ਕਾਰਵਾਈਆਂ",
        actionButton: "{{name}} ਨਾਲ {{action}}",
        connectedButton: "{{name}} ਨੂੰ ਅੱਜ ਜੁੜਿਆ ਮਾਰਕ ਕਰੋ",
        selectDateButton: "ਚੁਣੋ ਕਿ ਤੁਸੀਂ {{name}} ਨਾਲ ਕਦੋਂ ਜੁੜੇ",
        dismissButton: "{{name}} ਲਈ ਯਾਦ-ਦਹਾਨੀ ਖਾਰਜ ਕਰੋ"
      }
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

// Apply translations
const localesDir = path.join(__dirname, '..', 'public', 'locales');

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

console.log('Done! New i18n keys applied to all languages.');
