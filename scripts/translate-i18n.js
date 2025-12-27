import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Translations for all the new keys we added
const translations = {
  // Arabic
  ar: {
    feedPost: {
      likeCount: "{{count}} إعجاب",
      likeCount_plural: "{{count}} إعجابات",
      commentCount: "{{count}} تعليق",
      commentCount_plural: "{{count}} تعليقات"
    },
    friendCard: {
      updated: "تم تحديث {{name}}"
    },
    compose: {
      placeholders: {
        text: "ما الذي يدور في ذهنك؟",
        photo: "أضف وصفاً لصورتك...",
        video: "أضف وصفاً لفيديوك...",
        call: "أضف تفاصيل عن المكالمة...",
        meetup: "ماذا تخطط؟",
        nearby: "أخبر أصدقاءك أنك قريب...",
        update: "شارك أخبارك المثيرة...",
        default: "اكتب شيئاً..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "مدينتك أو مكان اللقاء المفضل — لا شيء يضاهي اللقاء وجهاً لوجه!",
        phone: "رقم هاتفك مع رمز الدولة (مثال: +966 555-123-4567)",
        facetime: "رقم الهاتف أو بريد Apple ID المرتبط بـ FaceTime",
        whatsapp: "رقم الهاتف مع رمز الدولة، بدون مسافات (مثال: +966555123456)",
        signal: "رقم الهاتف المسجل في تطبيق Signal",
        telegram: "اسم المستخدم @ (بدون @) أو رقم الهاتف",
        zoom: "معرف الاجتماع الشخصي أو رابط zoom.us",
        googleMeet: "عنوان Gmail الخاص بك",
        teams: "بريد العمل أو الشخصي في Microsoft",
        discord: "اسم المستخدم#1234 أو معرف المستخدم",
        skype: "اسم Skype الخاص بك (في الإعدادات ← الحساب)",
        webex: "رابط الغرفة الشخصية أو بريد Webex",
        slack: "بريد العمل (يجب أن يكون الطرفان في نفس مساحة العمل)"
      }
    },
    dataImport: {
      title: "استيراد البيانات",
      description: "استورد شبكتك الاجتماعية من شبكة متوافقة مع Dunbar.",
      dropZone: "أسقط ملف التصدير هنا",
      orBrowse: "أو انقر للتصفح",
      selectFile: "اختر ملفاً",
      compatibilityNote: "يمكنك استيراد البيانات المصدرة من Inner Friend Circles أو شبكات اجتماعية أخرى متوافقة.",
      previewTitle: "معاينة الاستيراد",
      previewDescription: "راجع ما سيتم استيراده من {{filename}}",
      warningsCount: "{{count}} تحذير(ات)",
      friendsToImport: "الأصدقاء للاستيراد",
      posts: "المنشورات",
      interactions: "التفاعلات",
      warnings: "تحذيرات",
      andMore: "...و {{count}} المزيد",
      duplicatesQuestion: "كيف نتعامل مع التكرارات؟",
      keepExisting: "الاحتفاظ بالأصدقاء الحاليين (تخطي التكرارات)",
      overwrite: "تحديث الأصدقاء الحاليين بالبيانات المستوردة",
      keepBoth: "الاحتفاظ بالاثنين (قد ينشئ تكرارات)",
      importButton: "استيراد البيانات",
      importing: "جارٍ استيراد بياناتك...",
      successTitle: "اكتمل الاستيراد",
      successDescription: "تم استيراد بياناتك بنجاح.",
      friendsImported: "تم استيراد {{count}} صديق",
      postsImported: "تم استيراد {{count}} منشور",
      errorTitle: "فشل الاستيراد",
      tryAnother: "جرب ملفاً آخر",
      errors: {
        selectJson: "يرجى اختيار ملف JSON.",
        readFailed: "فشل قراءة الملف",
        importFailed: "فشل الاستيراد",
        generic: "تعذر استيراد الملف. يرجى التحقق من التنسيق والمحاولة مرة أخرى."
      }
    }
  },

  // German
  de: {
    feedPost: {
      likeCount: "{{count}} Gefällt mir",
      likeCount_plural: "{{count}} Gefällt mir",
      commentCount: "{{count}} Kommentar",
      commentCount_plural: "{{count}} Kommentare"
    },
    friendCard: {
      updated: "{{name}} aktualisiert"
    },
    compose: {
      placeholders: {
        text: "Was denkst du gerade?",
        photo: "Füge eine Beschreibung zu deinem Foto hinzu...",
        video: "Füge eine Beschreibung zu deinem Video hinzu...",
        call: "Füge Details zum Anruf hinzu...",
        meetup: "Was planst du?",
        nearby: "Lass deine Freunde wissen, dass du in der Nähe bist...",
        update: "Teile deine aufregenden Neuigkeiten...",
        default: "Schreibe etwas..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Deine Stadt oder dein Lieblingsort zum Treffen — nichts geht über persönliche Begegnungen!",
        phone: "Deine Telefonnummer mit Landesvorwahl (z.B. +49 151-1234567)",
        facetime: "Telefonnummer oder Apple-ID-E-Mail für FaceTime",
        whatsapp: "Telefonnummer mit Landesvorwahl, ohne Leerzeichen (z.B. +491511234567)",
        signal: "Bei Signal registrierte Telefonnummer",
        telegram: "Dein @Benutzername (ohne @) oder Telefonnummer",
        zoom: "Persönliche Meeting-ID oder dein zoom.us-Link",
        googleMeet: "Deine Gmail-Adresse",
        teams: "Deine Microsoft-Arbeits- oder persönliche E-Mail",
        discord: "Benutzername#1234 oder deine Benutzer-ID",
        skype: "Dein Skype-Name (unter Einstellungen → Konto)",
        webex: "Persönlicher Raum-Link oder Webex-E-Mail",
        slack: "Arbeits-E-Mail (beide Parteien brauchen denselben Workspace)"
      }
    },
    dataImport: {
      title: "Daten importieren",
      description: "Importiere dein soziales Netzwerk aus einem Dunbar-kompatiblen Netzwerk.",
      dropZone: "Exportdatei hier ablegen",
      orBrowse: "oder klicken zum Durchsuchen",
      selectFile: "Datei auswählen",
      compatibilityNote: "Du kannst Daten importieren, die aus Inner Friend Circles oder anderen kompatiblen Dunbar-basierten sozialen Netzwerken exportiert wurden.",
      previewTitle: "Import-Vorschau",
      previewDescription: "Überprüfe, was aus {{filename}} importiert wird",
      warningsCount: "{{count}} Warnung(en)",
      friendsToImport: "Zu importierende Freunde",
      posts: "Beiträge",
      interactions: "Interaktionen",
      warnings: "Warnungen",
      andMore: "...und {{count}} weitere",
      duplicatesQuestion: "Wie sollen wir mit Duplikaten umgehen?",
      keepExisting: "Bestehende Freunde behalten (Duplikate überspringen)",
      overwrite: "Bestehende Freunde mit importierten Daten aktualisieren",
      keepBoth: "Beide behalten (kann Duplikate erzeugen)",
      importButton: "Daten importieren",
      importing: "Deine Daten werden importiert...",
      successTitle: "Import abgeschlossen",
      successDescription: "Deine Daten wurden erfolgreich importiert.",
      friendsImported: "{{count}} Freunde importiert",
      postsImported: "{{count}} Beiträge importiert",
      errorTitle: "Import fehlgeschlagen",
      tryAnother: "Andere Datei versuchen",
      errors: {
        selectJson: "Bitte wähle eine JSON-Datei aus.",
        readFailed: "Datei konnte nicht gelesen werden",
        importFailed: "Import fehlgeschlagen",
        generic: "Die Datei konnte nicht importiert werden. Bitte überprüfe das Format und versuche es erneut."
      }
    }
  },

  // French
  fr: {
    feedPost: {
      likeCount: "{{count}} j'aime",
      likeCount_plural: "{{count}} j'aime",
      commentCount: "{{count}} commentaire",
      commentCount_plural: "{{count}} commentaires"
    },
    friendCard: {
      updated: "{{name}} mis à jour"
    },
    compose: {
      placeholders: {
        text: "Qu'avez-vous en tête ?",
        photo: "Ajoutez une légende à votre photo...",
        video: "Ajoutez une description à votre vidéo...",
        call: "Ajoutez les détails de l'appel...",
        meetup: "Que prévoyez-vous ?",
        nearby: "Faites savoir à vos amis que vous êtes à proximité...",
        update: "Partagez vos nouvelles excitantes...",
        default: "Écrivez quelque chose..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Votre ville ou lieu de rencontre préféré — rien ne vaut le face à face !",
        phone: "Votre numéro de téléphone avec indicatif pays (ex. +33 6 12 34 56 78)",
        facetime: "Numéro de téléphone ou email Apple ID lié à FaceTime",
        whatsapp: "Numéro de téléphone avec indicatif pays, sans espaces (ex. +33612345678)",
        signal: "Numéro de téléphone enregistré sur l'app Signal",
        telegram: "Votre @pseudo (sans @) ou numéro de téléphone",
        zoom: "ID de réunion personnel ou votre lien zoom.us",
        googleMeet: "Votre adresse Gmail",
        teams: "Votre email professionnel ou personnel Microsoft",
        discord: "Pseudo#1234 ou votre ID utilisateur",
        skype: "Votre nom Skype (dans Paramètres → Compte)",
        webex: "Lien de salle personnelle ou email Webex",
        slack: "Email professionnel (les deux parties doivent être dans le même espace)"
      }
    },
    dataImport: {
      title: "Importer des données",
      description: "Importez votre réseau social depuis un réseau compatible Dunbar.",
      dropZone: "Déposez votre fichier d'export ici",
      orBrowse: "ou cliquez pour parcourir",
      selectFile: "Sélectionner un fichier",
      compatibilityNote: "Vous pouvez importer des données exportées depuis Inner Friend Circles ou d'autres réseaux sociaux compatibles basés sur Dunbar.",
      previewTitle: "Aperçu de l'import",
      previewDescription: "Vérifiez ce qui sera importé depuis {{filename}}",
      warningsCount: "{{count}} avertissement(s)",
      friendsToImport: "Amis à importer",
      posts: "Publications",
      interactions: "Interactions",
      warnings: "Avertissements",
      andMore: "...et {{count}} de plus",
      duplicatesQuestion: "Comment gérer les doublons ?",
      keepExisting: "Garder les amis existants (ignorer les doublons)",
      overwrite: "Mettre à jour les amis existants avec les données importées",
      keepBoth: "Garder les deux (peut créer des doublons)",
      importButton: "Importer les données",
      importing: "Import de vos données en cours...",
      successTitle: "Import terminé",
      successDescription: "Vos données ont été importées avec succès.",
      friendsImported: "{{count}} amis importés",
      postsImported: "{{count}} publications importées",
      errorTitle: "Échec de l'import",
      tryAnother: "Essayer un autre fichier",
      errors: {
        selectJson: "Veuillez sélectionner un fichier JSON.",
        readFailed: "Échec de la lecture du fichier",
        importFailed: "Échec de l'import",
        generic: "Impossible d'importer le fichier. Veuillez vérifier le format et réessayer."
      }
    }
  },

  // Hebrew
  he: {
    feedPost: {
      likeCount: "{{count}} לייק",
      likeCount_plural: "{{count}} לייקים",
      commentCount: "{{count}} תגובה",
      commentCount_plural: "{{count}} תגובות"
    },
    friendCard: {
      updated: "{{name}} עודכן"
    },
    compose: {
      placeholders: {
        text: "מה בראש שלך?",
        photo: "הוסף כיתוב לתמונה שלך...",
        video: "הוסף תיאור לסרטון שלך...",
        call: "הוסף פרטים על השיחה...",
        meetup: "מה אתה מתכנן?",
        nearby: "ספר לחברים שאתה בקרבת מקום...",
        update: "שתף את החדשות המרגשות שלך...",
        default: "כתוב משהו..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "העיר שלך או מקום המפגש האהוב עליך — שום דבר לא מנצח מפגש פנים אל פנים!",
        phone: "מספר הטלפון שלך עם קוד המדינה (למשל +972 50-123-4567)",
        facetime: "מספר טלפון או אימייל Apple ID מקושר ל-FaceTime",
        whatsapp: "מספר טלפון עם קוד מדינה, ללא רווחים (למשל +972501234567)",
        signal: "מספר טלפון רשום באפליקציית Signal",
        telegram: "שם המשתמש @ שלך (ללא @) או מספר טלפון",
        zoom: "מזהה פגישה אישי או קישור zoom.us שלך",
        googleMeet: "כתובת ה-Gmail שלך",
        teams: "אימייל עבודה או אישי של Microsoft",
        discord: "שם משתמש#1234 או מזהה המשתמש שלך",
        skype: "שם ה-Skype שלך (בהגדרות ← חשבון)",
        webex: "קישור חדר אישי או אימייל Webex",
        slack: "אימייל עבודה (שני הצדדים צריכים להיות באותו מרחב עבודה)"
      }
    },
    dataImport: {
      title: "ייבוא נתונים",
      description: "ייבא את הרשת החברתית שלך מרשת תואמת Dunbar.",
      dropZone: "גרור את קובץ הייצוא לכאן",
      orBrowse: "או לחץ לעיון",
      selectFile: "בחר קובץ",
      compatibilityNote: "ניתן לייבא נתונים מ-Inner Friend Circles או רשתות חברתיות אחרות תואמות Dunbar.",
      previewTitle: "תצוגה מקדימה של הייבוא",
      previewDescription: "בדוק מה ייובא מ-{{filename}}",
      warningsCount: "{{count}} אזהרה/ות",
      friendsToImport: "חברים לייבוא",
      posts: "פוסטים",
      interactions: "אינטראקציות",
      warnings: "אזהרות",
      andMore: "...ועוד {{count}}",
      duplicatesQuestion: "איך לטפל בכפילויות?",
      keepExisting: "שמור חברים קיימים (דלג על כפילויות)",
      overwrite: "עדכן חברים קיימים עם נתונים מיובאים",
      keepBoth: "שמור את שניהם (עלול ליצור כפילויות)",
      importButton: "ייבא נתונים",
      importing: "מייבא את הנתונים שלך...",
      successTitle: "הייבוא הושלם",
      successDescription: "הנתונים שלך יובאו בהצלחה.",
      friendsImported: "יובאו {{count}} חברים",
      postsImported: "יובאו {{count}} פוסטים",
      errorTitle: "הייבוא נכשל",
      tryAnother: "נסה קובץ אחר",
      errors: {
        selectJson: "אנא בחר קובץ JSON.",
        readFailed: "נכשלה קריאת הקובץ",
        importFailed: "הייבוא נכשל",
        generic: "לא ניתן לייבא את הקובץ. אנא בדוק את הפורמט ונסה שוב."
      }
    }
  },

  // Hindi
  hi: {
    feedPost: {
      likeCount: "{{count}} पसंद",
      likeCount_plural: "{{count}} पसंद",
      commentCount: "{{count}} टिप्पणी",
      commentCount_plural: "{{count}} टिप्पणियाँ"
    },
    friendCard: {
      updated: "{{name}} अपडेट किया गया"
    },
    compose: {
      placeholders: {
        text: "आपके मन में क्या है?",
        photo: "अपनी फोटो में कैप्शन जोड़ें...",
        video: "अपने वीडियो में विवरण जोड़ें...",
        call: "कॉल के बारे में विवरण जोड़ें...",
        meetup: "आप क्या योजना बना रहे हैं?",
        nearby: "अपने दोस्तों को बताएं कि आप पास में हैं...",
        update: "अपनी रोमांचक खबर साझा करें...",
        default: "कुछ लिखें..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "आपका शहर या पसंदीदा मिलने की जगह — आमने-सामने की मुलाकात से बेहतर कुछ नहीं!",
        phone: "देश कोड के साथ आपका फोन नंबर (जैसे +91 98765-43210)",
        facetime: "FaceTime से जुड़ा फोन नंबर या Apple ID ईमेल",
        whatsapp: "देश कोड के साथ फोन नंबर, बिना स्पेस (जैसे +919876543210)",
        signal: "Signal ऐप में पंजीकृत फोन नंबर",
        telegram: "आपका @यूजरनेम (@ के बिना) या फोन नंबर",
        zoom: "व्यक्तिगत मीटिंग ID या आपका zoom.us लिंक",
        googleMeet: "आपका Gmail पता",
        teams: "आपका Microsoft कार्य या व्यक्तिगत ईमेल",
        discord: "यूजरनेम#1234 या आपकी यूजर ID",
        skype: "आपका Skype नाम (सेटिंग्स → अकाउंट में देखें)",
        webex: "व्यक्तिगत रूम लिंक या Webex ईमेल",
        slack: "कार्य ईमेल (दोनों पक्षों को एक ही वर्कस्पेस में होना चाहिए)"
      }
    },
    dataImport: {
      title: "डेटा आयात करें",
      description: "किसी अन्य Dunbar-संगत नेटवर्क से अपना सोशल ग्राफ आयात करें।",
      dropZone: "अपनी एक्सपोर्ट फाइल यहाँ डालें",
      orBrowse: "या ब्राउज़ करने के लिए क्लिक करें",
      selectFile: "फाइल चुनें",
      compatibilityNote: "आप Inner Friend Circles या अन्य संगत Dunbar-आधारित सोशल नेटवर्क से निर्यात किया गया डेटा आयात कर सकते हैं।",
      previewTitle: "आयात पूर्वावलोकन",
      previewDescription: "{{filename}} से क्या आयात होगा, इसकी समीक्षा करें",
      warningsCount: "{{count}} चेतावनी",
      friendsToImport: "आयात करने के लिए मित्र",
      posts: "पोस्ट",
      interactions: "इंटरैक्शन",
      warnings: "चेतावनियाँ",
      andMore: "...और {{count}} और",
      duplicatesQuestion: "डुप्लीकेट को कैसे संभालें?",
      keepExisting: "मौजूदा मित्रों को रखें (डुप्लीकेट छोड़ें)",
      overwrite: "आयातित डेटा के साथ मौजूदा मित्रों को अपडेट करें",
      keepBoth: "दोनों रखें (डुप्लीकेट बना सकता है)",
      importButton: "डेटा आयात करें",
      importing: "आपका डेटा आयात हो रहा है...",
      successTitle: "आयात पूर्ण",
      successDescription: "आपका डेटा सफलतापूर्वक आयात हो गया।",
      friendsImported: "{{count}} मित्र आयात किए गए",
      postsImported: "{{count}} पोस्ट आयात की गईं",
      errorTitle: "आयात विफल",
      tryAnother: "दूसरी फाइल आज़माएँ",
      errors: {
        selectJson: "कृपया एक JSON फाइल चुनें।",
        readFailed: "फाइल पढ़ने में विफल",
        importFailed: "आयात विफल",
        generic: "फाइल आयात नहीं हो सकी। कृपया फॉर्मेट जांचें और पुनः प्रयास करें।"
      }
    }
  },

  // Italian
  it: {
    feedPost: {
      likeCount: "{{count}} mi piace",
      likeCount_plural: "{{count}} mi piace",
      commentCount: "{{count}} commento",
      commentCount_plural: "{{count}} commenti"
    },
    friendCard: {
      updated: "{{name}} aggiornato"
    },
    compose: {
      placeholders: {
        text: "A cosa stai pensando?",
        photo: "Aggiungi una didascalia alla tua foto...",
        video: "Aggiungi una descrizione al tuo video...",
        call: "Aggiungi dettagli sulla chiamata...",
        meetup: "Cosa stai pianificando?",
        nearby: "Fai sapere ai tuoi amici che sei nelle vicinanze...",
        update: "Condividi le tue notizie entusiasmanti...",
        default: "Scrivi qualcosa..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "La tua città o il tuo luogo di incontro preferito — niente batte l'incontro di persona!",
        phone: "Il tuo numero di telefono con prefisso internazionale (es. +39 333-1234567)",
        facetime: "Numero di telefono o email Apple ID collegato a FaceTime",
        whatsapp: "Numero di telefono con prefisso internazionale, senza spazi (es. +393331234567)",
        signal: "Numero di telefono registrato su Signal",
        telegram: "Il tuo @username (senza @) o numero di telefono",
        zoom: "ID riunione personale o il tuo link zoom.us",
        googleMeet: "Il tuo indirizzo Gmail",
        teams: "La tua email di lavoro o personale Microsoft",
        discord: "Username#1234 o il tuo ID utente",
        skype: "Il tuo nome Skype (in Impostazioni → Account)",
        webex: "Link sala personale o email Webex",
        slack: "Email di lavoro (entrambe le parti devono essere nello stesso workspace)"
      }
    },
    dataImport: {
      title: "Importa dati",
      description: "Importa il tuo grafo sociale da un'altra rete compatibile con Dunbar.",
      dropZone: "Trascina qui il file di esportazione",
      orBrowse: "o clicca per sfogliare",
      selectFile: "Seleziona file",
      compatibilityNote: "Puoi importare dati esportati da Inner Friend Circles o altri social network compatibili basati su Dunbar.",
      previewTitle: "Anteprima importazione",
      previewDescription: "Verifica cosa verrà importato da {{filename}}",
      warningsCount: "{{count}} avviso/i",
      friendsToImport: "Amici da importare",
      posts: "Post",
      interactions: "Interazioni",
      warnings: "Avvisi",
      andMore: "...e altri {{count}}",
      duplicatesQuestion: "Come gestire i duplicati?",
      keepExisting: "Mantieni amici esistenti (salta duplicati)",
      overwrite: "Aggiorna amici esistenti con dati importati",
      keepBoth: "Mantieni entrambi (può creare duplicati)",
      importButton: "Importa dati",
      importing: "Importazione dei tuoi dati in corso...",
      successTitle: "Importazione completata",
      successDescription: "I tuoi dati sono stati importati con successo.",
      friendsImported: "{{count}} amici importati",
      postsImported: "{{count}} post importati",
      errorTitle: "Importazione fallita",
      tryAnother: "Prova un altro file",
      errors: {
        selectJson: "Seleziona un file JSON.",
        readFailed: "Impossibile leggere il file",
        importFailed: "Importazione fallita",
        generic: "Impossibile importare il file. Verifica il formato e riprova."
      }
    }
  },

  // Japanese
  ja: {
    feedPost: {
      likeCount: "{{count}}いいね",
      likeCount_plural: "{{count}}いいね",
      commentCount: "{{count}}件のコメント",
      commentCount_plural: "{{count}}件のコメント"
    },
    friendCard: {
      updated: "{{name}}を更新しました"
    },
    compose: {
      placeholders: {
        text: "何を考えていますか？",
        photo: "写真にキャプションを追加...",
        video: "動画に説明を追加...",
        call: "通話の詳細を追加...",
        meetup: "何を計画していますか？",
        nearby: "近くにいることを友達に知らせましょう...",
        update: "エキサイティングなニュースをシェア...",
        default: "何か書いてください..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "あなたの街やお気に入りの待ち合わせ場所 — 直接会うのが一番です！",
        phone: "国番号付きの電話番号（例：+81 90-1234-5678）",
        facetime: "FaceTimeにリンクされた電話番号またはApple IDメール",
        whatsapp: "国番号付きの電話番号、スペースなし（例：+819012345678）",
        signal: "Signalアプリに登録された電話番号",
        telegram: "@ユーザー名（@なし）または電話番号",
        zoom: "個人ミーティングIDまたはzoom.usリンク",
        googleMeet: "Gmailアドレス",
        teams: "Microsoft仕事用または個人用メール",
        discord: "ユーザー名#1234またはユーザーID",
        skype: "Skype名（設定→アカウントで確認）",
        webex: "パーソナルルームリンクまたはWebexメール",
        slack: "仕事用メール（両者が同じワークスペースに参加必要）"
      }
    },
    dataImport: {
      title: "データをインポート",
      description: "Dunbar互換ネットワークからソーシャルグラフをインポートします。",
      dropZone: "エクスポートファイルをここにドロップ",
      orBrowse: "またはクリックして参照",
      selectFile: "ファイルを選択",
      compatibilityNote: "Inner Friend Circlesまたは他のDunbar互換ソーシャルネットワークからエクスポートしたデータをインポートできます。",
      previewTitle: "インポートプレビュー",
      previewDescription: "{{filename}}からインポートされる内容を確認",
      warningsCount: "{{count}}件の警告",
      friendsToImport: "インポートする友達",
      posts: "投稿",
      interactions: "インタラクション",
      warnings: "警告",
      andMore: "...他{{count}}件",
      duplicatesQuestion: "重複をどう処理しますか？",
      keepExisting: "既存の友達を保持（重複をスキップ）",
      overwrite: "インポートデータで既存の友達を更新",
      keepBoth: "両方を保持（重複が発生する可能性）",
      importButton: "データをインポート",
      importing: "データをインポート中...",
      successTitle: "インポート完了",
      successDescription: "データが正常にインポートされました。",
      friendsImported: "{{count}}人の友達をインポート",
      postsImported: "{{count}}件の投稿をインポート",
      errorTitle: "インポート失敗",
      tryAnother: "別のファイルを試す",
      errors: {
        selectJson: "JSONファイルを選択してください。",
        readFailed: "ファイルの読み込みに失敗",
        importFailed: "インポートに失敗",
        generic: "ファイルをインポートできませんでした。形式を確認して再試行してください。"
      }
    }
  },

  // Korean
  ko: {
    feedPost: {
      likeCount: "좋아요 {{count}}개",
      likeCount_plural: "좋아요 {{count}}개",
      commentCount: "댓글 {{count}}개",
      commentCount_plural: "댓글 {{count}}개"
    },
    friendCard: {
      updated: "{{name}} 업데이트됨"
    },
    compose: {
      placeholders: {
        text: "무슨 생각을 하고 계세요?",
        photo: "사진에 캡션 추가...",
        video: "동영상에 설명 추가...",
        call: "통화 세부 정보 추가...",
        meetup: "무엇을 계획하고 있나요?",
        nearby: "친구들에게 근처에 있다고 알리세요...",
        update: "흥미로운 소식을 공유하세요...",
        default: "무언가 작성하세요..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "당신의 도시 또는 선호하는 만남 장소 — 직접 만나는 것이 최고입니다!",
        phone: "국가 코드를 포함한 전화번호 (예: +82 10-1234-5678)",
        facetime: "FaceTime에 연결된 전화번호 또는 Apple ID 이메일",
        whatsapp: "국가 코드를 포함한 전화번호, 공백 없이 (예: +821012345678)",
        signal: "Signal 앱에 등록된 전화번호",
        telegram: "@사용자명 (@ 제외) 또는 전화번호",
        zoom: "개인 회의 ID 또는 zoom.us 링크",
        googleMeet: "Gmail 주소",
        teams: "Microsoft 업무용 또는 개인 이메일",
        discord: "사용자명#1234 또는 사용자 ID",
        skype: "Skype 이름 (설정 → 계정에서 확인)",
        webex: "개인 룸 링크 또는 Webex 이메일",
        slack: "업무용 이메일 (양측 모두 같은 워크스페이스에 있어야 함)"
      }
    },
    dataImport: {
      title: "데이터 가져오기",
      description: "다른 Dunbar 호환 네트워크에서 소셜 그래프를 가져옵니다.",
      dropZone: "내보내기 파일을 여기에 놓으세요",
      orBrowse: "또는 클릭하여 찾아보기",
      selectFile: "파일 선택",
      compatibilityNote: "Inner Friend Circles 또는 다른 Dunbar 기반 호환 소셜 네트워크에서 내보낸 데이터를 가져올 수 있습니다.",
      previewTitle: "가져오기 미리보기",
      previewDescription: "{{filename}}에서 가져올 내용 확인",
      warningsCount: "{{count}}개의 경고",
      friendsToImport: "가져올 친구",
      posts: "게시물",
      interactions: "상호작용",
      warnings: "경고",
      andMore: "...그리고 {{count}}개 더",
      duplicatesQuestion: "중복을 어떻게 처리할까요?",
      keepExisting: "기존 친구 유지 (중복 건너뛰기)",
      overwrite: "가져온 데이터로 기존 친구 업데이트",
      keepBoth: "둘 다 유지 (중복 생성 가능)",
      importButton: "데이터 가져오기",
      importing: "데이터를 가져오는 중...",
      successTitle: "가져오기 완료",
      successDescription: "데이터를 성공적으로 가져왔습니다.",
      friendsImported: "{{count}}명의 친구 가져옴",
      postsImported: "{{count}}개의 게시물 가져옴",
      errorTitle: "가져오기 실패",
      tryAnother: "다른 파일 시도",
      errors: {
        selectJson: "JSON 파일을 선택해 주세요.",
        readFailed: "파일을 읽을 수 없음",
        importFailed: "가져오기 실패",
        generic: "파일을 가져올 수 없습니다. 형식을 확인하고 다시 시도해 주세요."
      }
    }
  },

  // Portuguese
  pt: {
    feedPost: {
      likeCount: "{{count}} curtida",
      likeCount_plural: "{{count}} curtidas",
      commentCount: "{{count}} comentário",
      commentCount_plural: "{{count}} comentários"
    },
    friendCard: {
      updated: "{{name}} atualizado"
    },
    compose: {
      placeholders: {
        text: "O que você está pensando?",
        photo: "Adicione uma legenda à sua foto...",
        video: "Adicione uma descrição ao seu vídeo...",
        call: "Adicione detalhes sobre a chamada...",
        meetup: "O que você está planejando?",
        nearby: "Avise seus amigos que você está por perto...",
        update: "Compartilhe suas novidades empolgantes...",
        default: "Escreva algo..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Sua cidade ou local de encontro favorito — nada supera o encontro pessoal!",
        phone: "Seu número de telefone com código do país (ex: +55 11 99999-9999)",
        facetime: "Número de telefone ou email do Apple ID vinculado ao FaceTime",
        whatsapp: "Número de telefone com código do país, sem espaços (ex: +5511999999999)",
        signal: "Número de telefone registrado no app Signal",
        telegram: "Seu @usuário (sem @) ou número de telefone",
        zoom: "ID de reunião pessoal ou seu link zoom.us",
        googleMeet: "Seu endereço Gmail",
        teams: "Seu email de trabalho ou pessoal da Microsoft",
        discord: "Usuário#1234 ou seu ID de usuário",
        skype: "Seu nome do Skype (em Configurações → Conta)",
        webex: "Link da sala pessoal ou email Webex",
        slack: "Email de trabalho (ambas as partes precisam do mesmo workspace)"
      }
    },
    dataImport: {
      title: "Importar Dados",
      description: "Importe seu grafo social de outra rede compatível com Dunbar.",
      dropZone: "Arraste seu arquivo de exportação aqui",
      orBrowse: "ou clique para procurar",
      selectFile: "Selecionar Arquivo",
      compatibilityNote: "Você pode importar dados exportados do Inner Friend Circles ou outras redes sociais compatíveis baseadas em Dunbar.",
      previewTitle: "Prévia da Importação",
      previewDescription: "Revise o que será importado de {{filename}}",
      warningsCount: "{{count}} aviso(s)",
      friendsToImport: "Amigos para importar",
      posts: "Publicações",
      interactions: "Interações",
      warnings: "Avisos",
      andMore: "...e mais {{count}}",
      duplicatesQuestion: "Como lidar com duplicatas?",
      keepExisting: "Manter amigos existentes (pular duplicatas)",
      overwrite: "Atualizar amigos existentes com dados importados",
      keepBoth: "Manter ambos (pode criar duplicatas)",
      importButton: "Importar Dados",
      importing: "Importando seus dados...",
      successTitle: "Importação Concluída",
      successDescription: "Seus dados foram importados com sucesso.",
      friendsImported: "{{count}} amigos importados",
      postsImported: "{{count}} publicações importadas",
      errorTitle: "Falha na Importação",
      tryAnother: "Tentar Outro Arquivo",
      errors: {
        selectJson: "Por favor, selecione um arquivo JSON.",
        readFailed: "Falha ao ler o arquivo",
        importFailed: "Falha na importação",
        generic: "Não foi possível importar o arquivo. Verifique o formato e tente novamente."
      }
    }
  },

  // Russian
  ru: {
    feedPost: {
      likeCount: "{{count}} лайк",
      likeCount_plural: "{{count}} лайков",
      commentCount: "{{count}} комментарий",
      commentCount_plural: "{{count}} комментариев"
    },
    friendCard: {
      updated: "{{name}} обновлён"
    },
    compose: {
      placeholders: {
        text: "О чём вы думаете?",
        photo: "Добавьте описание к фото...",
        video: "Добавьте описание к видео...",
        call: "Добавьте детали о звонке...",
        meetup: "Что вы планируете?",
        nearby: "Дайте друзьям знать, что вы рядом...",
        update: "Поделитесь захватывающими новостями...",
        default: "Напишите что-нибудь..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Ваш город или любимое место встречи — ничто не сравнится с личной встречей!",
        phone: "Ваш номер телефона с кодом страны (напр. +7 999-123-4567)",
        facetime: "Номер телефона или email Apple ID, связанный с FaceTime",
        whatsapp: "Номер телефона с кодом страны, без пробелов (напр. +79991234567)",
        signal: "Номер телефона, зарегистрированный в Signal",
        telegram: "Ваш @username (без @) или номер телефона",
        zoom: "Личный ID конференции или ссылка zoom.us",
        googleMeet: "Ваш адрес Gmail",
        teams: "Ваша рабочая или личная почта Microsoft",
        discord: "Имя пользователя#1234 или ID пользователя",
        skype: "Ваше имя в Skype (в Настройках → Аккаунт)",
        webex: "Ссылка на личную комнату или email Webex",
        slack: "Рабочая почта (обе стороны должны быть в одном рабочем пространстве)"
      }
    },
    dataImport: {
      title: "Импорт данных",
      description: "Импортируйте вашу социальную сеть из другой сети, совместимой с Dunbar.",
      dropZone: "Перетащите файл экспорта сюда",
      orBrowse: "или нажмите для выбора",
      selectFile: "Выбрать файл",
      compatibilityNote: "Вы можете импортировать данные, экспортированные из Inner Friend Circles или других совместимых социальных сетей на основе Dunbar.",
      previewTitle: "Предпросмотр импорта",
      previewDescription: "Проверьте, что будет импортировано из {{filename}}",
      warningsCount: "{{count}} предупреждение(й)",
      friendsToImport: "Друзей для импорта",
      posts: "Публикации",
      interactions: "Взаимодействия",
      warnings: "Предупреждения",
      andMore: "...и ещё {{count}}",
      duplicatesQuestion: "Как обрабатывать дубликаты?",
      keepExisting: "Оставить существующих друзей (пропустить дубликаты)",
      overwrite: "Обновить существующих друзей импортированными данными",
      keepBoth: "Оставить оба (может создать дубликаты)",
      importButton: "Импортировать данные",
      importing: "Импортируем ваши данные...",
      successTitle: "Импорт завершён",
      successDescription: "Ваши данные успешно импортированы.",
      friendsImported: "{{count}} друзей импортировано",
      postsImported: "{{count}} публикаций импортировано",
      errorTitle: "Ошибка импорта",
      tryAnother: "Попробовать другой файл",
      errors: {
        selectJson: "Пожалуйста, выберите JSON файл.",
        readFailed: "Не удалось прочитать файл",
        importFailed: "Ошибка импорта",
        generic: "Не удалось импортировать файл. Проверьте формат и попробуйте снова."
      }
    }
  },

  // Turkish
  tr: {
    feedPost: {
      likeCount: "{{count}} beğeni",
      likeCount_plural: "{{count}} beğeni",
      commentCount: "{{count}} yorum",
      commentCount_plural: "{{count}} yorum"
    },
    friendCard: {
      updated: "{{name}} güncellendi"
    },
    compose: {
      placeholders: {
        text: "Aklından ne geçiyor?",
        photo: "Fotoğrafına bir açıklama ekle...",
        video: "Videona bir açıklama ekle...",
        call: "Arama hakkında detay ekle...",
        meetup: "Ne planlıyorsun?",
        nearby: "Arkadaşlarına yakınlarda olduğunu bildir...",
        update: "Heyecan verici haberlerini paylaş...",
        default: "Bir şeyler yaz..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Şehrin veya favori buluşma yerin — yüz yüze görüşmenin yerini hiçbir şey tutmaz!",
        phone: "Ülke koduyla telefon numaran (örn. +90 532-123-4567)",
        facetime: "FaceTime'a bağlı telefon numarası veya Apple ID e-postası",
        whatsapp: "Ülke koduyla telefon numarası, boşluksuz (örn. +905321234567)",
        signal: "Signal uygulamasına kayıtlı telefon numarası",
        telegram: "@kullanıcı adın (@ olmadan) veya telefon numarası",
        zoom: "Kişisel Toplantı ID'si veya zoom.us linkin",
        googleMeet: "Gmail adresin",
        teams: "Microsoft iş veya kişisel e-postan",
        discord: "Kullanıcıadı#1234 veya Kullanıcı ID'n",
        skype: "Skype Adın (Ayarlar → Hesap'ta bulabilirsin)",
        webex: "Kişisel Oda linki veya Webex e-postası",
        slack: "İş e-postası (her iki taraf da aynı çalışma alanında olmalı)"
      }
    },
    dataImport: {
      title: "Veri İçe Aktar",
      description: "Sosyal grafiğini başka bir Dunbar uyumlu ağdan içe aktar.",
      dropZone: "Dışa aktarma dosyanı buraya bırak",
      orBrowse: "veya göz atmak için tıkla",
      selectFile: "Dosya Seç",
      compatibilityNote: "Inner Friend Circles veya diğer Dunbar tabanlı uyumlu sosyal ağlardan dışa aktarılan verileri içe aktarabilirsin.",
      previewTitle: "İçe Aktarma Önizlemesi",
      previewDescription: "{{filename}} dosyasından nelerin içe aktarılacağını incele",
      warningsCount: "{{count}} uyarı",
      friendsToImport: "İçe aktarılacak arkadaşlar",
      posts: "Gönderiler",
      interactions: "Etkileşimler",
      warnings: "Uyarılar",
      andMore: "...ve {{count}} daha",
      duplicatesQuestion: "Kopyalar nasıl işlensin?",
      keepExisting: "Mevcut arkadaşları koru (kopyaları atla)",
      overwrite: "Mevcut arkadaşları içe aktarılan verilerle güncelle",
      keepBoth: "Her ikisini de koru (kopya oluşturabilir)",
      importButton: "Veri İçe Aktar",
      importing: "Veriler içe aktarılıyor...",
      successTitle: "İçe Aktarma Tamamlandı",
      successDescription: "Veriler başarıyla içe aktarıldı.",
      friendsImported: "{{count}} arkadaş içe aktarıldı",
      postsImported: "{{count}} gönderi içe aktarıldı",
      errorTitle: "İçe Aktarma Başarısız",
      tryAnother: "Başka Dosya Dene",
      errors: {
        selectJson: "Lütfen bir JSON dosyası seç.",
        readFailed: "Dosya okunamadı",
        importFailed: "İçe aktarma başarısız",
        generic: "Dosya içe aktarılamadı. Lütfen formatı kontrol edip tekrar dene."
      }
    }
  },

  // Chinese (Simplified)
  zh: {
    feedPost: {
      likeCount: "{{count}} 个赞",
      likeCount_plural: "{{count}} 个赞",
      commentCount: "{{count}} 条评论",
      commentCount_plural: "{{count}} 条评论"
    },
    friendCard: {
      updated: "已更新 {{name}}"
    },
    compose: {
      placeholders: {
        text: "你在想什么？",
        photo: "为你的照片添加说明...",
        video: "为你的视频添加描述...",
        call: "添加通话详情...",
        meetup: "你在计划什么？",
        nearby: "让朋友们知道你在附近...",
        update: "分享你的精彩消息...",
        default: "写点什么..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "你的城市或最喜欢的见面地点 — 没有什么比面对面交流更好！",
        phone: "带国家代码的电话号码（如 +86 138-1234-5678）",
        facetime: "与FaceTime关联的电话号码或Apple ID邮箱",
        whatsapp: "带国家代码的电话号码，不含空格（如 +8613812345678）",
        signal: "在Signal应用注册的电话号码",
        telegram: "你的@用户名（不含@）或电话号码",
        zoom: "个人会议ID或你的zoom.us链接",
        googleMeet: "你的Gmail地址",
        teams: "你的Microsoft工作或个人邮箱",
        discord: "用户名#1234或你的用户ID",
        skype: "你的Skype名称（在设置→账户中查看）",
        webex: "个人房间链接或Webex邮箱",
        slack: "工作邮箱（双方需在同一工作区）"
      }
    },
    dataImport: {
      title: "导入数据",
      description: "从其他Dunbar兼容网络导入你的社交图谱。",
      dropZone: "将导出文件拖放到这里",
      orBrowse: "或点击浏览",
      selectFile: "选择文件",
      compatibilityNote: "你可以导入从Inner Friend Circles或其他基于Dunbar的兼容社交网络导出的数据。",
      previewTitle: "导入预览",
      previewDescription: "查看将从{{filename}}导入的内容",
      warningsCount: "{{count}} 个警告",
      friendsToImport: "待导入的好友",
      posts: "帖子",
      interactions: "互动",
      warnings: "警告",
      andMore: "...还有{{count}}个",
      duplicatesQuestion: "如何处理重复项？",
      keepExisting: "保留现有好友（跳过重复）",
      overwrite: "用导入数据更新现有好友",
      keepBoth: "两者都保留（可能产生重复）",
      importButton: "导入数据",
      importing: "正在导入你的数据...",
      successTitle: "导入完成",
      successDescription: "你的数据已成功导入。",
      friendsImported: "已导入{{count}}位好友",
      postsImported: "已导入{{count}}个帖子",
      errorTitle: "导入失败",
      tryAnother: "尝试其他文件",
      errors: {
        selectJson: "请选择一个JSON文件。",
        readFailed: "无法读取文件",
        importFailed: "导入失败",
        generic: "无法导入文件。请检查格式后重试。"
      }
    }
  },

  // Vietnamese
  vi: {
    feedPost: {
      likeCount: "{{count}} lượt thích",
      likeCount_plural: "{{count}} lượt thích",
      commentCount: "{{count}} bình luận",
      commentCount_plural: "{{count}} bình luận"
    },
    friendCard: {
      updated: "Đã cập nhật {{name}}"
    },
    compose: {
      placeholders: {
        text: "Bạn đang nghĩ gì?",
        photo: "Thêm chú thích cho ảnh của bạn...",
        video: "Thêm mô tả cho video của bạn...",
        call: "Thêm chi tiết về cuộc gọi...",
        meetup: "Bạn đang lên kế hoạch gì?",
        nearby: "Cho bạn bè biết bạn đang ở gần...",
        update: "Chia sẻ tin tức thú vị của bạn...",
        default: "Viết gì đó..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Thành phố của bạn hoặc địa điểm gặp mặt yêu thích — không gì bằng gặp trực tiếp!",
        phone: "Số điện thoại với mã quốc gia (ví dụ: +84 912-345-678)",
        facetime: "Số điện thoại hoặc email Apple ID liên kết với FaceTime",
        whatsapp: "Số điện thoại với mã quốc gia, không có khoảng trắng (ví dụ: +84912345678)",
        signal: "Số điện thoại đã đăng ký trên ứng dụng Signal",
        telegram: "@tên người dùng của bạn (không có @) hoặc số điện thoại",
        zoom: "ID cuộc họp cá nhân hoặc liên kết zoom.us của bạn",
        googleMeet: "Địa chỉ Gmail của bạn",
        teams: "Email công việc hoặc cá nhân Microsoft của bạn",
        discord: "TênNgườiDùng#1234 hoặc ID người dùng",
        skype: "Tên Skype của bạn (trong Cài đặt → Tài khoản)",
        webex: "Liên kết Phòng Cá nhân hoặc email Webex",
        slack: "Email công việc (cả hai bên cần cùng không gian làm việc)"
      }
    },
    dataImport: {
      title: "Nhập Dữ liệu",
      description: "Nhập đồ thị xã hội của bạn từ mạng tương thích Dunbar khác.",
      dropZone: "Thả tệp xuất của bạn vào đây",
      orBrowse: "hoặc nhấp để duyệt",
      selectFile: "Chọn Tệp",
      compatibilityNote: "Bạn có thể nhập dữ liệu được xuất từ Inner Friend Circles hoặc các mạng xã hội dựa trên Dunbar tương thích khác.",
      previewTitle: "Xem trước Nhập",
      previewDescription: "Xem lại những gì sẽ được nhập từ {{filename}}",
      warningsCount: "{{count}} cảnh báo",
      friendsToImport: "Bạn bè để nhập",
      posts: "Bài đăng",
      interactions: "Tương tác",
      warnings: "Cảnh báo",
      andMore: "...và {{count}} nữa",
      duplicatesQuestion: "Xử lý trùng lặp như thế nào?",
      keepExisting: "Giữ bạn bè hiện có (bỏ qua trùng lặp)",
      overwrite: "Cập nhật bạn bè hiện có với dữ liệu nhập",
      keepBoth: "Giữ cả hai (có thể tạo trùng lặp)",
      importButton: "Nhập Dữ liệu",
      importing: "Đang nhập dữ liệu của bạn...",
      successTitle: "Nhập Hoàn tất",
      successDescription: "Dữ liệu của bạn đã được nhập thành công.",
      friendsImported: "Đã nhập {{count}} bạn bè",
      postsImported: "Đã nhập {{count}} bài đăng",
      errorTitle: "Nhập Thất bại",
      tryAnother: "Thử Tệp Khác",
      errors: {
        selectJson: "Vui lòng chọn một tệp JSON.",
        readFailed: "Không thể đọc tệp",
        importFailed: "Nhập thất bại",
        generic: "Không thể nhập tệp. Vui lòng kiểm tra định dạng và thử lại."
      }
    }
  },

  // Bengali
  bn: {
    feedPost: {
      likeCount: "{{count}} লাইক",
      likeCount_plural: "{{count}} লাইক",
      commentCount: "{{count}} মন্তব্য",
      commentCount_plural: "{{count}} মন্তব্য"
    },
    friendCard: {
      updated: "{{name}} আপডেট করা হয়েছে"
    },
    compose: {
      placeholders: {
        text: "আপনার মনে কী আছে?",
        photo: "আপনার ফটোতে একটি ক্যাপশন যোগ করুন...",
        video: "আপনার ভিডিওতে একটি বিবরণ যোগ করুন...",
        call: "কল সম্পর্কে বিস্তারিত যোগ করুন...",
        meetup: "আপনি কী পরিকল্পনা করছেন?",
        nearby: "আপনার বন্ধুদের জানান যে আপনি কাছে আছেন...",
        update: "আপনার উত্তেজনাপূর্ণ খবর শেয়ার করুন...",
        default: "কিছু লিখুন..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "আপনার শহর বা প্রিয় মিটিং স্পট — সামনাসামনি দেখার মতো কিছুই নেই!",
        phone: "দেশের কোড সহ আপনার ফোন নম্বর (যেমন +880 1712-345678)",
        facetime: "FaceTime এর সাথে লিঙ্ক করা ফোন নম্বর বা Apple ID ইমেইল",
        whatsapp: "দেশের কোড সহ ফোন নম্বর, স্পেস ছাড়া (যেমন +8801712345678)",
        signal: "Signal অ্যাপে নিবন্ধিত ফোন নম্বর",
        telegram: "আপনার @ইউজারনেম (@ ছাড়া) বা ফোন নম্বর",
        zoom: "ব্যক্তিগত মিটিং ID বা আপনার zoom.us লিঙ্ক",
        googleMeet: "আপনার Gmail ঠিকানা",
        teams: "আপনার Microsoft কাজের বা ব্যক্তিগত ইমেইল",
        discord: "ইউজারনেম#1234 বা আপনার ইউজার ID",
        skype: "আপনার Skype নাম (সেটিংস → অ্যাকাউন্টে পাবেন)",
        webex: "ব্যক্তিগত রুম লিঙ্ক বা Webex ইমেইল",
        slack: "কাজের ইমেইল (উভয় পক্ষকে একই ওয়ার্কস্পেসে থাকতে হবে)"
      }
    },
    dataImport: {
      title: "ডেটা আমদানি করুন",
      description: "অন্য Dunbar-সামঞ্জস্যপূর্ণ নেটওয়ার্ক থেকে আপনার সামাজিক গ্রাফ আমদানি করুন।",
      dropZone: "আপনার এক্সপোর্ট ফাইল এখানে ড্রপ করুন",
      orBrowse: "বা ব্রাউজ করতে ক্লিক করুন",
      selectFile: "ফাইল নির্বাচন করুন",
      compatibilityNote: "আপনি Inner Friend Circles বা অন্যান্য Dunbar-ভিত্তিক সামঞ্জস্যপূর্ণ সামাজিক নেটওয়ার্ক থেকে রপ্তানি করা ডেটা আমদানি করতে পারেন।",
      previewTitle: "আমদানি প্রিভিউ",
      previewDescription: "{{filename}} থেকে কী আমদানি হবে তা পর্যালোচনা করুন",
      warningsCount: "{{count}} সতর্কতা",
      friendsToImport: "আমদানি করার জন্য বন্ধুরা",
      posts: "পোস্ট",
      interactions: "ইন্টারঅ্যাকশন",
      warnings: "সতর্কতা",
      andMore: "...এবং আরও {{count}}",
      duplicatesQuestion: "ডুপ্লিকেট কীভাবে পরিচালনা করবেন?",
      keepExisting: "বিদ্যমান বন্ধুদের রাখুন (ডুপ্লিকেট এড়িয়ে যান)",
      overwrite: "আমদানি করা ডেটা দিয়ে বিদ্যমান বন্ধুদের আপডেট করুন",
      keepBoth: "উভয়ই রাখুন (ডুপ্লিকেট তৈরি হতে পারে)",
      importButton: "ডেটা আমদানি করুন",
      importing: "আপনার ডেটা আমদানি হচ্ছে...",
      successTitle: "আমদানি সম্পন্ন",
      successDescription: "আপনার ডেটা সফলভাবে আমদানি হয়েছে।",
      friendsImported: "{{count}} বন্ধু আমদানি করা হয়েছে",
      postsImported: "{{count}} পোস্ট আমদানি করা হয়েছে",
      errorTitle: "আমদানি ব্যর্থ",
      tryAnother: "অন্য ফাইল চেষ্টা করুন",
      errors: {
        selectJson: "অনুগ্রহ করে একটি JSON ফাইল নির্বাচন করুন।",
        readFailed: "ফাইল পড়তে ব্যর্থ",
        importFailed: "আমদানি ব্যর্থ",
        generic: "ফাইল আমদানি করা যায়নি। অনুগ্রহ করে ফরম্যাট পরীক্ষা করে আবার চেষ্টা করুন।"
      }
    }
  },

  // Urdu
  ur: {
    feedPost: {
      likeCount: "{{count}} لائیک",
      likeCount_plural: "{{count}} لائیکس",
      commentCount: "{{count}} تبصرہ",
      commentCount_plural: "{{count}} تبصرے"
    },
    friendCard: {
      updated: "{{name}} اپڈیٹ ہو گیا"
    },
    compose: {
      placeholders: {
        text: "آپ کے ذہن میں کیا ہے؟",
        photo: "اپنی تصویر میں کیپشن شامل کریں...",
        video: "اپنی ویڈیو میں تفصیل شامل کریں...",
        call: "کال کے بارے میں تفصیلات شامل کریں...",
        meetup: "آپ کیا پلان کر رہے ہیں؟",
        nearby: "اپنے دوستوں کو بتائیں کہ آپ قریب ہیں...",
        update: "اپنی دلچسپ خبر شیئر کریں...",
        default: "کچھ لکھیں..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "آپ کا شہر یا پسندیدہ ملاقات کی جگہ — آمنے سامنے ملنے سے بہتر کچھ نہیں!",
        phone: "ملکی کوڈ کے ساتھ آپ کا فون نمبر (مثلاً +92 300-1234567)",
        facetime: "FaceTime سے منسلک فون نمبر یا Apple ID ای میل",
        whatsapp: "ملکی کوڈ کے ساتھ فون نمبر، بغیر خالی جگہ (مثلاً +923001234567)",
        signal: "Signal ایپ میں رجسٹرڈ فون نمبر",
        telegram: "آپ کا @یوزرنیم (@ کے بغیر) یا فون نمبر",
        zoom: "ذاتی میٹنگ ID یا آپ کا zoom.us لنک",
        googleMeet: "آپ کا Gmail ایڈریس",
        teams: "آپ کا Microsoft کام یا ذاتی ای میل",
        discord: "یوزرنیم#1234 یا آپ کی یوزر ID",
        skype: "آپ کا Skype نام (سیٹنگز ← اکاؤنٹ میں دیکھیں)",
        webex: "ذاتی روم لنک یا Webex ای میل",
        slack: "کام کی ای میل (دونوں فریقوں کو ایک ہی ورک سپیس میں ہونا ضروری ہے)"
      }
    },
    dataImport: {
      title: "ڈیٹا درآمد کریں",
      description: "کسی اور Dunbar ہم آہنگ نیٹ ورک سے اپنا سوشل گراف درآمد کریں۔",
      dropZone: "اپنی ایکسپورٹ فائل یہاں چھوڑیں",
      orBrowse: "یا براؤز کرنے کے لیے کلک کریں",
      selectFile: "فائل منتخب کریں",
      compatibilityNote: "آپ Inner Friend Circles یا دیگر Dunbar پر مبنی ہم آہنگ سوشل نیٹ ورکس سے برآمد شدہ ڈیٹا درآمد کر سکتے ہیں۔",
      previewTitle: "درآمد کا پیش نظارہ",
      previewDescription: "جائزہ لیں کہ {{filename}} سے کیا درآمد ہوگا",
      warningsCount: "{{count}} انتباہ",
      friendsToImport: "درآمد کرنے کے لیے دوست",
      posts: "پوسٹس",
      interactions: "تعاملات",
      warnings: "انتباہات",
      andMore: "...اور {{count}} مزید",
      duplicatesQuestion: "ڈپلیکیٹس کو کیسے ہینڈل کریں؟",
      keepExisting: "موجودہ دوستوں کو رکھیں (ڈپلیکیٹس چھوڑ دیں)",
      overwrite: "درآمد شدہ ڈیٹا سے موجودہ دوستوں کو اپڈیٹ کریں",
      keepBoth: "دونوں رکھیں (ڈپلیکیٹس بن سکتے ہیں)",
      importButton: "ڈیٹا درآمد کریں",
      importing: "آپ کا ڈیٹا درآمد ہو رہا ہے...",
      successTitle: "درآمد مکمل",
      successDescription: "آپ کا ڈیٹا کامیابی سے درآمد ہو گیا۔",
      friendsImported: "{{count}} دوست درآمد ہوئے",
      postsImported: "{{count}} پوسٹس درآمد ہوئیں",
      errorTitle: "درآمد ناکام",
      tryAnother: "دوسری فائل آزمائیں",
      errors: {
        selectJson: "براہ کرم ایک JSON فائل منتخب کریں۔",
        readFailed: "فائل پڑھنے میں ناکام",
        importFailed: "درآمد ناکام",
        generic: "فائل درآمد نہیں ہو سکی۔ براہ کرم فارمیٹ چیک کریں اور دوبارہ کوشش کریں۔"
      }
    }
  },

  // Javanese
  jv: {
    feedPost: {
      likeCount: "{{count}} seneng",
      likeCount_plural: "{{count}} seneng",
      commentCount: "{{count}} komentar",
      commentCount_plural: "{{count}} komentar"
    },
    friendCard: {
      updated: "{{name}} wis dianyari"
    },
    compose: {
      placeholders: {
        text: "Apa sing lagi dipikir?",
        photo: "Tambahna katrangan kanggo fotone...",
        video: "Tambahna katrangan kanggo videone...",
        call: "Tambahna rincian babagan telpon...",
        meetup: "Apa sing lagi dirancang?",
        nearby: "Kandhanana kanca-kanca yen kowe ana ing cedhak...",
        update: "Bagekna kabar sing nyenengake...",
        default: "Tulisen apa wae..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "Kuthamu utawa papan ketemu sing paling disenengi — ora ana sing ngluwihi ketemu langsung!",
        phone: "Nomer telponmu nganggo kode negara (cth. +62 812-3456-7890)",
        facetime: "Nomer telpon utawa email Apple ID sing disambungake FaceTime",
        whatsapp: "Nomer telpon nganggo kode negara, tanpa spasi (cth. +6281234567890)",
        signal: "Nomer telpon sing wis didaftar ing app Signal",
        telegram: "@username-mu (tanpa @) utawa nomer telpon",
        zoom: "ID Rapat Pribadi utawa link zoom.us-mu",
        googleMeet: "Alamat Gmail-mu",
        teams: "Email kerja utawa pribadi Microsoft-mu",
        discord: "Username#1234 utawa User ID-mu",
        skype: "Jeneng Skype-mu (ing Setelan → Akun)",
        webex: "Link Ruang Pribadi utawa email Webex",
        slack: "Email kerja (loro-lorone kudu ana ing workspace sing padha)"
      }
    },
    dataImport: {
      title: "Impor Data",
      description: "Impor grafik sosialmu saka jaringan liya sing kompatibel karo Dunbar.",
      dropZone: "Selehna file ekspormu ing kene",
      orBrowse: "utawa klik kanggo njelajah",
      selectFile: "Pilih File",
      compatibilityNote: "Kowe bisa ngimpor data sing diekspor saka Inner Friend Circles utawa jaringan sosial liya sing kompatibel karo Dunbar.",
      previewTitle: "Pratinjau Impor",
      previewDescription: "Deloken apa sing bakal diimpor saka {{filename}}",
      warningsCount: "{{count}} peringatan",
      friendsToImport: "Kanca-kanca sing arep diimpor",
      posts: "Postingan",
      interactions: "Interaksi",
      warnings: "Peringatan",
      andMore: "...lan {{count}} liyane",
      duplicatesQuestion: "Kepriye carane nangani duplikat?",
      keepExisting: "Tetepake kanca-kanca sing wis ana (lewati duplikat)",
      overwrite: "Anyari kanca-kanca sing wis ana nganggo data sing diimpor",
      keepBoth: "Tetepake loro-lorone (bisa nggawe duplikat)",
      importButton: "Impor Data",
      importing: "Lagi ngimpor datamu...",
      successTitle: "Impor Rampung",
      successDescription: "Datamu wis sukses diimpor.",
      friendsImported: "{{count}} kanca wis diimpor",
      postsImported: "{{count}} postingan wis diimpor",
      errorTitle: "Impor Gagal",
      tryAnother: "Coba File Liya",
      errors: {
        selectJson: "Pilih file JSON.",
        readFailed: "Gagal maca file",
        importFailed: "Impor gagal",
        generic: "Ora bisa ngimpor file. Cek format lan coba maneh."
      }
    }
  },

  // Marathi
  mr: {
    feedPost: {
      likeCount: "{{count}} आवडी",
      likeCount_plural: "{{count}} आवडी",
      commentCount: "{{count}} टिप्पणी",
      commentCount_plural: "{{count}} टिप्पण्या"
    },
    friendCard: {
      updated: "{{name}} अद्यतनित केले"
    },
    compose: {
      placeholders: {
        text: "तुमच्या मनात काय आहे?",
        photo: "तुमच्या फोटोला मथळा द्या...",
        video: "तुमच्या व्हिडिओला वर्णन द्या...",
        call: "कॉलबद्दल तपशील द्या...",
        meetup: "तुम्ही काय नियोजन करत आहात?",
        nearby: "तुमच्या मित्रांना कळवा की तुम्ही जवळ आहात...",
        update: "तुमच्या रोमांचक बातम्या शेअर करा...",
        default: "काहीतरी लिहा..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "तुमचे शहर किंवा आवडते भेटण्याचे ठिकाण — समोरासमोर भेटण्यासारखे काहीच नाही!",
        phone: "देश कोडसह तुमचा फोन नंबर (उदा. +91 98765-43210)",
        facetime: "FaceTime शी जोडलेला फोन नंबर किंवा Apple ID ईमेल",
        whatsapp: "देश कोडसह फोन नंबर, स्पेस नाही (उदा. +919876543210)",
        signal: "Signal अॅपवर नोंदणीकृत फोन नंबर",
        telegram: "तुमचे @यूजरनेम (@ शिवाय) किंवा फोन नंबर",
        zoom: "वैयक्तिक मीटिंग ID किंवा तुमची zoom.us लिंक",
        googleMeet: "तुमचा Gmail पत्ता",
        teams: "तुमचा Microsoft कार्य किंवा वैयक्तिक ईमेल",
        discord: "यूजरनेम#1234 किंवा तुमची यूजर ID",
        skype: "तुमचे Skype नाव (सेटिंग्ज → खाते मध्ये पहा)",
        webex: "वैयक्तिक रूम लिंक किंवा Webex ईमेल",
        slack: "कार्य ईमेल (दोन्ही पक्षांना एकाच वर्कस्पेसमध्ये असणे आवश्यक)"
      }
    },
    dataImport: {
      title: "डेटा आयात करा",
      description: "दुसऱ्या Dunbar-संगत नेटवर्कमधून तुमचा सोशल ग्राफ आयात करा.",
      dropZone: "तुमची एक्सपोर्ट फाइल इथे ड्रॉप करा",
      orBrowse: "किंवा ब्राउझ करण्यासाठी क्लिक करा",
      selectFile: "फाइल निवडा",
      compatibilityNote: "तुम्ही Inner Friend Circles किंवा इतर Dunbar-आधारित संगत सोशल नेटवर्क्समधून निर्यात केलेला डेटा आयात करू शकता.",
      previewTitle: "आयात पूर्वावलोकन",
      previewDescription: "{{filename}} मधून काय आयात होईल ते पहा",
      warningsCount: "{{count}} इशारे",
      friendsToImport: "आयात करण्यासाठी मित्र",
      posts: "पोस्ट",
      interactions: "इंटरॅक्शन",
      warnings: "इशारे",
      andMore: "...आणि {{count}} अधिक",
      duplicatesQuestion: "डुप्लिकेट कसे हाताळायचे?",
      keepExisting: "विद्यमान मित्र ठेवा (डुप्लिकेट वगळा)",
      overwrite: "आयात केलेल्या डेटासह विद्यमान मित्र अद्यतनित करा",
      keepBoth: "दोन्ही ठेवा (डुप्लिकेट तयार होऊ शकतात)",
      importButton: "डेटा आयात करा",
      importing: "तुमचा डेटा आयात होत आहे...",
      successTitle: "आयात पूर्ण",
      successDescription: "तुमचा डेटा यशस्वीरित्या आयात झाला.",
      friendsImported: "{{count}} मित्र आयात केले",
      postsImported: "{{count}} पोस्ट आयात केल्या",
      errorTitle: "आयात अयशस्वी",
      tryAnother: "दुसरी फाइल वापरून पहा",
      errors: {
        selectJson: "कृपया JSON फाइल निवडा.",
        readFailed: "फाइल वाचता आली नाही",
        importFailed: "आयात अयशस्वी",
        generic: "फाइल आयात करता आली नाही. कृपया फॉरमॅट तपासा आणि पुन्हा प्रयत्न करा."
      }
    }
  },

  // Tamil
  ta: {
    feedPost: {
      likeCount: "{{count}} விருப்பம்",
      likeCount_plural: "{{count}} விருப்பங்கள்",
      commentCount: "{{count}} கருத்து",
      commentCount_plural: "{{count}} கருத்துகள்"
    },
    friendCard: {
      updated: "{{name}} புதுப்பிக்கப்பட்டது"
    },
    compose: {
      placeholders: {
        text: "உங்கள் மனதில் என்ன இருக்கிறது?",
        photo: "உங்கள் புகைப்படத்திற்கு தலைப்பு சேர்க்கவும்...",
        video: "உங்கள் வீடியோவிற்கு விவரணை சேர்க்கவும்...",
        call: "அழைப்பு பற்றிய விவரங்களைச் சேர்க்கவும்...",
        meetup: "நீங்கள் என்ன திட்டமிடுகிறீர்கள்?",
        nearby: "நீங்கள் அருகில் இருப்பதை உங்கள் நண்பர்களுக்குத் தெரிவிக்கவும்...",
        update: "உங்கள் அற்புதமான செய்தியைப் பகிரவும்...",
        default: "ஏதாவது எழுதுங்கள்..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "உங்கள் நகரம் அல்லது விருப்பமான சந்திப்பு இடம் — நேரில் சந்திப்பதை விட சிறந்தது எதுவும் இல்லை!",
        phone: "நாட்டு குறியீட்டுடன் உங்கள் தொலைபேசி எண் (எ.கா. +91 98765-43210)",
        facetime: "FaceTime உடன் இணைக்கப்பட்ட தொலைபேசி எண் அல்லது Apple ID மின்னஞ்சல்",
        whatsapp: "நாட்டு குறியீட்டுடன் தொலைபேசி எண், இடைவெளி இல்லாமல் (எ.கா. +919876543210)",
        signal: "Signal பயன்பாட்டில் பதிவுசெய்யப்பட்ட தொலைபேசி எண்",
        telegram: "உங்கள் @பயனர்பெயர் (@ இல்லாமல்) அல்லது தொலைபேசி எண்",
        zoom: "தனிப்பட்ட கூட்ட ID அல்லது உங்கள் zoom.us இணைப்பு",
        googleMeet: "உங்கள் Gmail முகவரி",
        teams: "உங்கள் Microsoft பணி அல்லது தனிப்பட்ட மின்னஞ்சல்",
        discord: "பயனர்பெயர்#1234 அல்லது உங்கள் பயனர் ID",
        skype: "உங்கள் Skype பெயர் (அமைப்புகள் → கணக்கில் பாருங்கள்)",
        webex: "தனிப்பட்ட அறை இணைப்பு அல்லது Webex மின்னஞ்சல்",
        slack: "பணி மின்னஞ்சல் (இரு தரப்பினரும் ஒரே பணியிடத்தில் இருக்க வேண்டும்)"
      }
    },
    dataImport: {
      title: "தரவு இறக்குமதி",
      description: "மற்றொரு Dunbar-இணக்கமான நெட்வொர்க்கிலிருந்து உங்கள் சமூக வரைபடத்தை இறக்குமதி செய்யுங்கள்.",
      dropZone: "உங்கள் ஏற்றுமதி கோப்பை இங்கே இழுக்கவும்",
      orBrowse: "அல்லது உலாவ கிளிக் செய்யவும்",
      selectFile: "கோப்பைத் தேர்ந்தெடுக்கவும்",
      compatibilityNote: "Inner Friend Circles அல்லது பிற Dunbar-அடிப்படையிலான இணக்கமான சமூக வலைப்பின்னல்களிலிருந்து ஏற்றுமதி செய்யப்பட்ட தரவை நீங்கள் இறக்குமதி செய்யலாம்.",
      previewTitle: "இறக்குமதி மாதிரிக்காட்சி",
      previewDescription: "{{filename}} இலிருந்து என்ன இறக்குமதி செய்யப்படும் என்பதை மதிப்பாய்வு செய்யுங்கள்",
      warningsCount: "{{count}} எச்சரிக்கை(கள்)",
      friendsToImport: "இறக்குமதி செய்ய நண்பர்கள்",
      posts: "பதிவுகள்",
      interactions: "தொடர்புகள்",
      warnings: "எச்சரிக்கைகள்",
      andMore: "...மேலும் {{count}}",
      duplicatesQuestion: "நகல்களை எப்படி கையாள்வது?",
      keepExisting: "இருக்கும் நண்பர்களை வைத்திருங்கள் (நகல்களைத் தவிர்க்கவும்)",
      overwrite: "இறக்குமதி செய்த தரவுடன் இருக்கும் நண்பர்களைப் புதுப்பிக்கவும்",
      keepBoth: "இரண்டையும் வைத்திருங்கள் (நகல்கள் உருவாக்கப்படலாம்)",
      importButton: "தரவை இறக்குமதி செய்யுங்கள்",
      importing: "உங்கள் தரவை இறக்குமதி செய்கிறது...",
      successTitle: "இறக்குமதி முடிந்தது",
      successDescription: "உங்கள் தரவு வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது.",
      friendsImported: "{{count}} நண்பர்கள் இறக்குமதி செய்யப்பட்டனர்",
      postsImported: "{{count}} பதிவுகள் இறக்குமதி செய்யப்பட்டன",
      errorTitle: "இறக்குமதி தோல்வி",
      tryAnother: "வேறொரு கோப்பை முயற்சிக்கவும்",
      errors: {
        selectJson: "JSON கோப்பைத் தேர்ந்தெடுக்கவும்.",
        readFailed: "கோப்பைப் படிக்க முடியவில்லை",
        importFailed: "இறக்குமதி தோல்வியடைந்தது",
        generic: "கோப்பை இறக்குமதி செய்ய முடியவில்லை. வடிவமைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
      }
    }
  },

  // Telugu
  te: {
    feedPost: {
      likeCount: "{{count}} లైక్",
      likeCount_plural: "{{count}} లైక్‌లు",
      commentCount: "{{count}} కామెంట్",
      commentCount_plural: "{{count}} కామెంట్లు"
    },
    friendCard: {
      updated: "{{name}} అప్‌డేట్ చేయబడింది"
    },
    compose: {
      placeholders: {
        text: "మీ మనసులో ఏముంది?",
        photo: "మీ ఫోటోకు క్యాప్షన్ జోడించండి...",
        video: "మీ వీడియోకు వివరణ జోడించండి...",
        call: "కాల్ గురించి వివరాలు జోడించండి...",
        meetup: "మీరు ఏమి ప్లాన్ చేస్తున్నారు?",
        nearby: "మీరు సమీపంలో ఉన్నారని మీ స్నేహితులకు తెలియజేయండి...",
        update: "మీ అద్భుతమైన వార్తలను షేర్ చేయండి...",
        default: "ఏదైనా రాయండి..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "మీ నగరం లేదా ఇష్టమైన కలుసుకునే ప్రదేశం — ముఖాముఖిగా కలవడం కంటే మించినది లేదు!",
        phone: "దేశ కోడ్‌తో మీ ఫోన్ నంబర్ (ఉదా. +91 98765-43210)",
        facetime: "FaceTimeకు లింక్ చేసిన ఫోన్ నంబర్ లేదా Apple ID ఇమెయిల్",
        whatsapp: "దేశ కోడ్‌తో ఫోన్ నంబర్, ఖాళీలు లేకుండా (ఉదా. +919876543210)",
        signal: "Signal యాప్‌లో నమోదు చేసిన ఫోన్ నంబర్",
        telegram: "మీ @యూజర్‌నేమ్ (@ లేకుండా) లేదా ఫోన్ నంబర్",
        zoom: "వ్యక్తిగత మీటింగ్ ID లేదా మీ zoom.us లింక్",
        googleMeet: "మీ Gmail చిరునామా",
        teams: "మీ Microsoft వర్క్ లేదా వ్యక్తిగత ఇమెయిల్",
        discord: "యూజర్‌నేమ్#1234 లేదా మీ యూజర్ ID",
        skype: "మీ Skype పేరు (సెట్టింగ్‌లు → ఖాతాలో చూడండి)",
        webex: "వ్యక్తిగత గది లింక్ లేదా Webex ఇమెయిల్",
        slack: "వర్క్ ఇమెయిల్ (ఇద్దరూ ఒకే వర్క్‌స్పేస్‌లో ఉండాలి)"
      }
    },
    dataImport: {
      title: "డేటా ఇంపోర్ట్ చేయండి",
      description: "మరొక Dunbar-అనుకూల నెట్‌వర్క్ నుండి మీ సోషల్ గ్రాఫ్‌ను ఇంపోర్ట్ చేయండి.",
      dropZone: "మీ ఎక్స్‌పోర్ట్ ఫైల్‌ను ఇక్కడ డ్రాప్ చేయండి",
      orBrowse: "లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి",
      selectFile: "ఫైల్ ఎంచుకోండి",
      compatibilityNote: "మీరు Inner Friend Circles లేదా ఇతర Dunbar-ఆధారిత అనుకూల సోషల్ నెట్‌వర్క్‌ల నుండి ఎక్స్‌పోర్ట్ చేసిన డేటాను ఇంపోర్ట్ చేయవచ్చు.",
      previewTitle: "ఇంపోర్ట్ ప్రివ్యూ",
      previewDescription: "{{filename}} నుండి ఏమి ఇంపోర్ట్ అవుతుందో సమీక్షించండి",
      warningsCount: "{{count}} హెచ్చరిక(లు)",
      friendsToImport: "ఇంపోర్ట్ చేయవలసిన స్నేహితులు",
      posts: "పోస్ట్‌లు",
      interactions: "ఇంటరాక్షన్‌లు",
      warnings: "హెచ్చరికలు",
      andMore: "...మరియు {{count}} మరిన్ని",
      duplicatesQuestion: "డూప్లికేట్‌లను ఎలా హ్యాండిల్ చేయాలి?",
      keepExisting: "ఇప్పటికే ఉన్న స్నేహితులను ఉంచండి (డూప్లికేట్‌లను దాటవేయండి)",
      overwrite: "ఇంపోర్ట్ చేసిన డేటాతో ఇప్పటికే ఉన్న స్నేహితులను అప్‌డేట్ చేయండి",
      keepBoth: "రెండింటినీ ఉంచండి (డూప్లికేట్‌లు సృష్టించవచ్చు)",
      importButton: "డేటా ఇంపోర్ట్ చేయండి",
      importing: "మీ డేటా ఇంపోర్ట్ అవుతోంది...",
      successTitle: "ఇంపోర్ట్ పూర్తయింది",
      successDescription: "మీ డేటా విజయవంతంగా ఇంపోర్ట్ చేయబడింది.",
      friendsImported: "{{count}} స్నేహితులు ఇంపోర్ట్ చేయబడ్డారు",
      postsImported: "{{count}} పోస్ట్‌లు ఇంపోర్ట్ చేయబడ్డాయి",
      errorTitle: "ఇంపోర్ట్ విఫలమైంది",
      tryAnother: "మరొక ఫైల్ ప్రయత్నించండి",
      errors: {
        selectJson: "దయచేసి JSON ఫైల్‌ను ఎంచుకోండి.",
        readFailed: "ఫైల్ చదవడం విఫలమైంది",
        importFailed: "ఇంపోర్ట్ విఫలమైంది",
        generic: "ఫైల్‌ను ఇంపోర్ట్ చేయలేకపోయింది. దయచేసి ఫార్మాట్‌ను తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి."
      }
    }
  },

  // Punjabi
  pa: {
    feedPost: {
      likeCount: "{{count}} ਪਸੰਦ",
      likeCount_plural: "{{count}} ਪਸੰਦ",
      commentCount: "{{count}} ਟਿੱਪਣੀ",
      commentCount_plural: "{{count}} ਟਿੱਪਣੀਆਂ"
    },
    friendCard: {
      updated: "{{name}} ਅੱਪਡੇਟ ਕੀਤਾ ਗਿਆ"
    },
    compose: {
      placeholders: {
        text: "ਤੁਹਾਡੇ ਮਨ ਵਿੱਚ ਕੀ ਹੈ?",
        photo: "ਆਪਣੀ ਫੋਟੋ ਵਿੱਚ ਕੈਪਸ਼ਨ ਜੋੜੋ...",
        video: "ਆਪਣੀ ਵੀਡੀਓ ਵਿੱਚ ਵੇਰਵਾ ਜੋੜੋ...",
        call: "ਕਾਲ ਬਾਰੇ ਵੇਰਵੇ ਜੋੜੋ...",
        meetup: "ਤੁਸੀਂ ਕੀ ਯੋਜਨਾ ਬਣਾ ਰਹੇ ਹੋ?",
        nearby: "ਆਪਣੇ ਦੋਸਤਾਂ ਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਨੇੜੇ ਹੋ...",
        update: "ਆਪਣੀ ਦਿਲਚਸਪ ਖ਼ਬਰ ਸਾਂਝੀ ਕਰੋ...",
        default: "ਕੁਝ ਲਿਖੋ..."
      }
    },
    onboarding: {
      hints: {
        realFaceTime: "ਤੁਹਾਡਾ ਸ਼ਹਿਰ ਜਾਂ ਪਸੰਦੀਦਾ ਮਿਲਣ ਦੀ ਥਾਂ — ਆਹਮਣੇ-ਸਾਹਮਣੇ ਮਿਲਣ ਤੋਂ ਵਧੀਆ ਕੁਝ ਨਹੀਂ!",
        phone: "ਦੇਸ਼ ਕੋਡ ਨਾਲ ਤੁਹਾਡਾ ਫ਼ੋਨ ਨੰਬਰ (ਉਦਾ. +91 98765-43210)",
        facetime: "FaceTime ਨਾਲ ਜੁੜਿਆ ਫ਼ੋਨ ਨੰਬਰ ਜਾਂ Apple ID ਈਮੇਲ",
        whatsapp: "ਦੇਸ਼ ਕੋਡ ਨਾਲ ਫ਼ੋਨ ਨੰਬਰ, ਬਿਨਾਂ ਸਪੇਸ (ਉਦਾ. +919876543210)",
        signal: "Signal ਐਪ 'ਤੇ ਰਜਿਸਟਰਡ ਫ਼ੋਨ ਨੰਬਰ",
        telegram: "ਤੁਹਾਡਾ @ਯੂਜ਼ਰਨੇਮ (@ ਤੋਂ ਬਿਨਾਂ) ਜਾਂ ਫ਼ੋਨ ਨੰਬਰ",
        zoom: "ਨਿੱਜੀ ਮੀਟਿੰਗ ID ਜਾਂ ਤੁਹਾਡਾ zoom.us ਲਿੰਕ",
        googleMeet: "ਤੁਹਾਡਾ Gmail ਪਤਾ",
        teams: "ਤੁਹਾਡੀ Microsoft ਕੰਮ ਜਾਂ ਨਿੱਜੀ ਈਮੇਲ",
        discord: "ਯੂਜ਼ਰਨੇਮ#1234 ਜਾਂ ਤੁਹਾਡੀ ਯੂਜ਼ਰ ID",
        skype: "ਤੁਹਾਡਾ Skype ਨਾਮ (ਸੈਟਿੰਗਜ਼ → ਖਾਤੇ ਵਿੱਚ ਦੇਖੋ)",
        webex: "ਨਿੱਜੀ ਕਮਰਾ ਲਿੰਕ ਜਾਂ Webex ਈਮੇਲ",
        slack: "ਕੰਮ ਦੀ ਈਮੇਲ (ਦੋਵਾਂ ਧਿਰਾਂ ਨੂੰ ਇੱਕੋ ਵਰਕਸਪੇਸ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ)"
      }
    },
    dataImport: {
      title: "ਡਾਟਾ ਆਯਾਤ ਕਰੋ",
      description: "ਕਿਸੇ ਹੋਰ Dunbar-ਅਨੁਕੂਲ ਨੈੱਟਵਰਕ ਤੋਂ ਆਪਣਾ ਸੋਸ਼ਲ ਗ੍ਰਾਫ਼ ਆਯਾਤ ਕਰੋ।",
      dropZone: "ਆਪਣੀ ਐਕਸਪੋਰਟ ਫ਼ਾਈਲ ਇੱਥੇ ਛੱਡੋ",
      orBrowse: "ਜਾਂ ਬ੍ਰਾਊਜ਼ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
      selectFile: "ਫ਼ਾਈਲ ਚੁਣੋ",
      compatibilityNote: "ਤੁਸੀਂ Inner Friend Circles ਜਾਂ ਹੋਰ Dunbar-ਅਧਾਰਿਤ ਅਨੁਕੂਲ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕਾਂ ਤੋਂ ਐਕਸਪੋਰਟ ਕੀਤਾ ਡਾਟਾ ਆਯਾਤ ਕਰ ਸਕਦੇ ਹੋ।",
      previewTitle: "ਆਯਾਤ ਪ੍ਰੀਵਿਊ",
      previewDescription: "ਸਮੀਖਿਆ ਕਰੋ ਕਿ {{filename}} ਤੋਂ ਕੀ ਆਯਾਤ ਕੀਤਾ ਜਾਵੇਗਾ",
      warningsCount: "{{count}} ਚੇਤਾਵਨੀ(ਆਂ)",
      friendsToImport: "ਆਯਾਤ ਕਰਨ ਲਈ ਦੋਸਤ",
      posts: "ਪੋਸਟਾਂ",
      interactions: "ਇੰਟਰੈਕਸ਼ਨ",
      warnings: "ਚੇਤਾਵਨੀਆਂ",
      andMore: "...ਅਤੇ {{count}} ਹੋਰ",
      duplicatesQuestion: "ਡੁਪਲੀਕੇਟਾਂ ਨੂੰ ਕਿਵੇਂ ਸੰਭਾਲਣਾ ਹੈ?",
      keepExisting: "ਮੌਜੂਦਾ ਦੋਸਤਾਂ ਨੂੰ ਰੱਖੋ (ਡੁਪਲੀਕੇਟ ਛੱਡੋ)",
      overwrite: "ਆਯਾਤ ਕੀਤੇ ਡਾਟੇ ਨਾਲ ਮੌਜੂਦਾ ਦੋਸਤਾਂ ਨੂੰ ਅੱਪਡੇਟ ਕਰੋ",
      keepBoth: "ਦੋਵੇਂ ਰੱਖੋ (ਡੁਪਲੀਕੇਟ ਬਣ ਸਕਦੇ ਹਨ)",
      importButton: "ਡਾਟਾ ਆਯਾਤ ਕਰੋ",
      importing: "ਤੁਹਾਡਾ ਡਾਟਾ ਆਯਾਤ ਹੋ ਰਿਹਾ ਹੈ...",
      successTitle: "ਆਯਾਤ ਪੂਰਾ",
      successDescription: "ਤੁਹਾਡਾ ਡਾਟਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਆਯਾਤ ਹੋ ਗਿਆ।",
      friendsImported: "{{count}} ਦੋਸਤ ਆਯਾਤ ਕੀਤੇ ਗਏ",
      postsImported: "{{count}} ਪੋਸਟਾਂ ਆਯਾਤ ਕੀਤੀਆਂ ਗਈਆਂ",
      errorTitle: "ਆਯਾਤ ਅਸਫ਼ਲ",
      tryAnother: "ਕੋਈ ਹੋਰ ਫ਼ਾਈਲ ਅਜ਼ਮਾਓ",
      errors: {
        selectJson: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ JSON ਫ਼ਾਈਲ ਚੁਣੋ।",
        readFailed: "ਫ਼ਾਈਲ ਪੜ੍ਹਨ ਵਿੱਚ ਅਸਫ਼ਲ",
        importFailed: "ਆਯਾਤ ਅਸਫ਼ਲ",
        generic: "ਫ਼ਾਈਲ ਆਯਾਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਫ਼ਾਰਮੈਟ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
      }
    }
  }
};

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

const localesDir = path.join(__dirname, '../public/locales');

// Apply translations to each locale
for (const [locale, trans] of Object.entries(translations)) {
  const localePath = path.join(localesDir, locale, 'common.json');

  try {
    const currentData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    const mergedData = deepMerge(currentData, trans);
    fs.writeFileSync(localePath, JSON.stringify(mergedData, null, 2) + '\n');
    console.log(`Updated: ${locale}`);
  } catch (err) {
    console.error(`Error updating ${locale}:`, err.message);
  }
}

console.log('Done! Translations applied.');
