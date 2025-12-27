import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional translations for nayborSOS.criticalUrgency, postContent.photo/video/sharedPhoto/sharedVideo,
// accessibility.dragToReorder, and contactMethods.guidance with all service details
const translations = {
  // Arabic
  ar: {
    nayborSOS: {
      criticalUrgency: "حالة طوارئ حرجة"
    },
    postContent: {
      photo: "صورة",
      sharedPhoto: "صورة مشتركة",
      video: "فيديو",
      sharedVideo: "فيديو مشترك"
    },
    accessibility: {
      dragToReorder: "اسحب لإعادة الترتيب"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "مثال",
        realFaceTime: {
          howToFind: "شارك مدينتك أو مكان اللقاء المفضل — لا شيء يضاهي اللقاء الشخصي!",
          example: "\"الرياض\" أو \"مقهى ستاربكس، العليا\"",
          tip: "كن محدداً بقدر ما ترتاح. غالباً ما يكفي ذكر الحي."
        },
        phone: {
          howToFind: "أدخل رقم هاتفك مع رمز البلد.",
          example: "+966 55 123 4567",
          tip: "يعمل للمكالمات العادية والرسائل النصية."
        },
        facetime: {
          howToFind: "استخدم بريد Apple ID أو رقم الهاتف المرتبط بـ FaceTime.",
          example: "yourname@icloud.com أو +966 55 123 4567",
          tip: "يحتاج كلا الطرفين إلى أجهزة Apple لـ FaceTime."
        },
        whatsapp: {
          howToFind: "رقم هاتفك مع رمز البلد (المسجل في WhatsApp).",
          example: "+966551234567",
          tip: "لا تضع مسافات أو شرطات في الرقم."
        },
        signal: {
          howToFind: "رقم هاتفك المسجل في تطبيق Signal.",
          example: "+966 55 123 4567",
          tip: "Signal يوفر تشفيراً شاملاً للمستخدمين المهتمين بالخصوصية."
        },
        telegram: {
          howToFind: "اسم المستخدم الخاص بك (بدون @) أو رقم الهاتف.",
          example: "username أو +966551234567",
          tip: "أسماء المستخدمين أسهل في المشاركة من أرقام الهواتف."
        },
        zoom: {
          howToFind: "معرف الاجتماع الشخصي أو رابط غرفة الاجتماع الشخصية.",
          example: "123 456 7890 أو https://zoom.us/j/1234567890",
          tip: "تجده في إعدادات Zoom تحت الملف الشخصي > معرف الاجتماع الشخصي."
        },
        googleMeet: {
          howToFind: "عنوان Gmail الخاص بك — يمكن للأصدقاء بدء Meet معك مباشرة.",
          example: "yourname@gmail.com",
          tip: "Google Meet يعمل بشكل أفضل عندما يكون لدى كلا الطرفين حسابات Google."
        },
        teams: {
          howToFind: "عنوان بريد Microsoft للعمل أو الشخصي.",
          example: "yourname@company.com أو yourname@outlook.com",
          tip: "لحسابات العمل، قد تحتاج المكالمات الخارجية إلى موافقة المسؤول."
        },
        discord: {
          howToFind: "اسم مستخدم Discord أو معرف المستخدم.",
          example: "username#1234 أو 123456789012345678",
          tip: "تجد معرف المستخدم بتفعيل وضع المطور في إعدادات Discord."
        },
        skype: {
          howToFind: "اسم Skype الخاص بك (ليس اسم العرض).",
          example: "live:yourskypename",
          tip: "تجده في إعدادات Skype → الحساب → اسم Skype."
        },
        webex: {
          howToFind: "رابط الغرفة الشخصية أو بريد Webex.",
          example: "https://company.webex.com/meet/yourname",
          tip: "روابط الغرف الشخصية دائمة وسهلة المشاركة."
        },
        slack: {
          howToFind: "بريد العمل (يحتاج كلا الطرفين الوصول لنفس مساحة Slack).",
          example: "yourname@company.com",
          tip: "مكالمات Slack تعمل فقط بين أعضاء نفس مساحة العمل."
        }
      }
    }
  },

  // German
  de: {
    nayborSOS: {
      criticalUrgency: "Kritische Dringlichkeit"
    },
    postContent: {
      photo: "Foto",
      sharedPhoto: "Geteiltes Foto",
      video: "Video",
      sharedVideo: "Geteiltes Video"
    },
    accessibility: {
      dragToReorder: "Ziehen zum Neuordnen"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Beispiel",
        realFaceTime: {
          howToFind: "Teile deine Stadt oder deinen Lieblingsort — nichts ist besser als persönliche Treffen!",
          example: "\"Berlin\" oder \"Café Einstein, Mitte\"",
          tip: "Sei so spezifisch, wie du dich wohl fühlst. Ein Stadtviertel reicht oft aus."
        },
        phone: {
          howToFind: "Gib deine Telefonnummer mit Ländervorwahl ein.",
          example: "+49 (170) 123-4567",
          tip: "Funktioniert für normale Anrufe und SMS."
        },
        facetime: {
          howToFind: "Verwende deine Apple ID E-Mail oder die mit FaceTime verknüpfte Telefonnummer.",
          example: "deinname@icloud.com oder +49 170 1234567",
          tip: "Beide Parteien benötigen Apple-Geräte für FaceTime."
        },
        whatsapp: {
          howToFind: "Deine Telefonnummer mit Ländervorwahl (die bei WhatsApp registriert ist).",
          example: "+491701234567",
          tip: "Keine Leerzeichen oder Bindestriche in der Nummer."
        },
        signal: {
          howToFind: "Deine bei der Signal-App registrierte Telefonnummer.",
          example: "+49 170 123-4567",
          tip: "Signal bietet Ende-zu-Ende-Verschlüsselung für datenschutzbewusste Nutzer."
        },
        telegram: {
          howToFind: "Dein @Benutzername (ohne @) oder Telefonnummer.",
          example: "benutzername oder +491701234567",
          tip: "Benutzernamen sind einfacher zu teilen als Telefonnummern."
        },
        zoom: {
          howToFind: "Deine persönliche Meeting-ID oder der Link zu deinem persönlichen Meeting-Raum.",
          example: "123 456 7890 oder https://zoom.us/j/1234567890",
          tip: "Findest du in den Zoom-Einstellungen unter Profil > Persönliche Meeting-ID."
        },
        googleMeet: {
          howToFind: "Deine Gmail-Adresse — Freunde können direkt ein Meet mit dir starten.",
          example: "deinname@gmail.com",
          tip: "Google Meet funktioniert am besten, wenn beide Google-Konten haben."
        },
        teams: {
          howToFind: "Deine Microsoft-Arbeits- oder persönliche E-Mail-Adresse.",
          example: "deinname@firma.com oder deinname@outlook.com",
          tip: "Bei Arbeitskonten benötigen externe Anrufe möglicherweise Admin-Genehmigung."
        },
        discord: {
          howToFind: "Dein Discord-Benutzername oder Benutzer-ID.",
          example: "benutzername#1234 oder 123456789012345678",
          tip: "Finde deine Benutzer-ID durch Aktivieren des Entwicklermodus in den Discord-Einstellungen."
        },
        skype: {
          howToFind: "Dein Skype-Name (nicht dein Anzeigename).",
          example: "live:deinskypename",
          tip: "Findest du in Skype Einstellungen → Konto → Skype-Name."
        },
        webex: {
          howToFind: "Dein persönlicher Raum-Link oder Webex-E-Mail.",
          example: "https://firma.webex.com/meet/deinname",
          tip: "Persönliche Raum-Links sind dauerhaft und leicht zu teilen."
        },
        slack: {
          howToFind: "Deine Arbeits-E-Mail (beide Parteien brauchen Zugang zum selben Slack-Workspace).",
          example: "deinname@firma.com",
          tip: "Slack-Anrufe funktionieren nur zwischen Mitgliedern desselben Workspaces."
        }
      }
    }
  },

  // Spanish
  es: {
    nayborSOS: {
      criticalUrgency: "Urgencia crítica"
    },
    postContent: {
      photo: "Foto",
      sharedPhoto: "Foto compartida",
      video: "Video",
      sharedVideo: "Video compartido"
    },
    accessibility: {
      dragToReorder: "Arrastra para reordenar"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Ejemplo",
        realFaceTime: {
          howToFind: "Comparte tu ciudad o lugar de encuentro favorito — ¡nada supera verse en persona!",
          example: "\"Madrid\" o \"Café del Art, Gran Vía\"",
          tip: "Sé tan específico como te sientas cómodo. Un barrio suele ser suficiente."
        },
        phone: {
          howToFind: "Ingresa tu número de teléfono con código de país.",
          example: "+34 612 345 678",
          tip: "Funciona para llamadas regulares y SMS."
        },
        facetime: {
          howToFind: "Usa tu email de Apple ID o número de teléfono vinculado a FaceTime.",
          example: "tunombre@icloud.com o +34 612 345 678",
          tip: "Ambas partes necesitan dispositivos Apple para FaceTime."
        },
        whatsapp: {
          howToFind: "Tu número de teléfono con código de país (el registrado en WhatsApp).",
          example: "+34612345678",
          tip: "No incluyas espacios ni guiones en el número."
        },
        signal: {
          howToFind: "Tu número de teléfono registrado en la app Signal.",
          example: "+34 612 345 678",
          tip: "Signal ofrece cifrado de extremo a extremo para usuarios conscientes de la privacidad."
        },
        telegram: {
          howToFind: "Tu @nombre de usuario (sin @) o número de teléfono.",
          example: "nombreusuario o +34612345678",
          tip: "Los nombres de usuario son más fáciles de compartir que los números de teléfono."
        },
        zoom: {
          howToFind: "Tu ID de reunión personal o enlace de sala personal.",
          example: "123 456 7890 o https://zoom.us/j/1234567890",
          tip: "Encuéntralo en Configuración de Zoom bajo Perfil > ID de reunión personal."
        },
        googleMeet: {
          howToFind: "Tu dirección de Gmail — los amigos pueden iniciar un Meet contigo directamente.",
          example: "tunombre@gmail.com",
          tip: "Google Meet funciona mejor cuando ambos tienen cuentas de Google."
        },
        teams: {
          howToFind: "Tu dirección de email de Microsoft laboral o personal.",
          example: "tunombre@empresa.com o tunombre@outlook.com",
          tip: "Para cuentas laborales, las llamadas externas pueden necesitar aprobación del administrador."
        },
        discord: {
          howToFind: "Tu nombre de usuario de Discord o ID de usuario.",
          example: "nombreusuario#1234 o 123456789012345678",
          tip: "Encuentra tu ID de usuario habilitando el Modo desarrollador en configuración de Discord."
        },
        skype: {
          howToFind: "Tu nombre de Skype (no tu nombre para mostrar).",
          example: "live:tuskypename",
          tip: "Encuéntralo en Configuración de Skype → Cuenta → Nombre de Skype."
        },
        webex: {
          howToFind: "Tu enlace de sala personal o email de Webex.",
          example: "https://empresa.webex.com/meet/tunombre",
          tip: "Los enlaces de sala personal son permanentes y fáciles de compartir."
        },
        slack: {
          howToFind: "Tu email de trabajo (ambas partes necesitan acceso al mismo workspace de Slack).",
          example: "tunombre@empresa.com",
          tip: "Las llamadas de Slack solo funcionan entre miembros del mismo workspace."
        }
      }
    }
  },

  // French
  fr: {
    nayborSOS: {
      criticalUrgency: "Urgence critique"
    },
    postContent: {
      photo: "Photo",
      sharedPhoto: "Photo partagée",
      video: "Vidéo",
      sharedVideo: "Vidéo partagée"
    },
    accessibility: {
      dragToReorder: "Glisser pour réorganiser"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Exemple",
        realFaceTime: {
          howToFind: "Partagez votre ville ou lieu de rencontre préféré — rien ne vaut une rencontre en personne !",
          example: "\"Paris\" ou \"Café de Flore, Saint-Germain\"",
          tip: "Soyez aussi précis que vous le souhaitez. Un quartier suffit souvent."
        },
        phone: {
          howToFind: "Entrez votre numéro de téléphone avec l'indicatif du pays.",
          example: "+33 6 12 34 56 78",
          tip: "Fonctionne pour les appels réguliers et les SMS."
        },
        facetime: {
          howToFind: "Utilisez votre email Apple ID ou le numéro de téléphone lié à FaceTime.",
          example: "votrenom@icloud.com ou +33 6 12 34 56 78",
          tip: "Les deux parties ont besoin d'appareils Apple pour FaceTime."
        },
        whatsapp: {
          howToFind: "Votre numéro de téléphone avec l'indicatif du pays (celui enregistré sur WhatsApp).",
          example: "+33612345678",
          tip: "N'incluez pas d'espaces ou de tirets dans le numéro."
        },
        signal: {
          howToFind: "Votre numéro de téléphone enregistré sur l'application Signal.",
          example: "+33 6 12 34 56 78",
          tip: "Signal offre un chiffrement de bout en bout pour les utilisateurs soucieux de leur vie privée."
        },
        telegram: {
          howToFind: "Votre @nom d'utilisateur (sans @) ou numéro de téléphone.",
          example: "nomdutilisateur ou +33612345678",
          tip: "Les noms d'utilisateur sont plus faciles à partager que les numéros de téléphone."
        },
        zoom: {
          howToFind: "Votre ID de réunion personnel ou lien de salle personnelle.",
          example: "123 456 7890 ou https://zoom.us/j/1234567890",
          tip: "Trouvez-le dans Paramètres Zoom sous Profil > ID de réunion personnel."
        },
        googleMeet: {
          howToFind: "Votre adresse Gmail — vos amis peuvent démarrer un Meet avec vous directement.",
          example: "votrenom@gmail.com",
          tip: "Google Meet fonctionne mieux quand les deux parties ont des comptes Google."
        },
        teams: {
          howToFind: "Votre adresse email Microsoft professionnelle ou personnelle.",
          example: "votrenom@entreprise.com ou votrenom@outlook.com",
          tip: "Pour les comptes professionnels, les appels externes peuvent nécessiter l'approbation de l'admin."
        },
        discord: {
          howToFind: "Votre nom d'utilisateur Discord ou ID utilisateur.",
          example: "nomdutilisateur#1234 ou 123456789012345678",
          tip: "Trouvez votre ID utilisateur en activant le Mode développeur dans les paramètres Discord."
        },
        skype: {
          howToFind: "Votre nom Skype (pas votre nom d'affichage).",
          example: "live:votreskypename",
          tip: "Trouvez-le dans Paramètres Skype → Compte → Nom Skype."
        },
        webex: {
          howToFind: "Votre lien de salle personnelle ou email Webex.",
          example: "https://entreprise.webex.com/meet/votrenom",
          tip: "Les liens de salle personnelle sont permanents et faciles à partager."
        },
        slack: {
          howToFind: "Votre email professionnel (les deux parties ont besoin d'accès au même espace Slack).",
          example: "votrenom@entreprise.com",
          tip: "Les appels Slack ne fonctionnent qu'entre membres du même espace de travail."
        }
      }
    }
  },

  // Hebrew
  he: {
    nayborSOS: {
      criticalUrgency: "דחיפות קריטית"
    },
    postContent: {
      photo: "תמונה",
      sharedPhoto: "תמונה משותפת",
      video: "סרטון",
      sharedVideo: "סרטון משותף"
    },
    accessibility: {
      dragToReorder: "גרור לסידור מחדש"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "דוגמה",
        realFaceTime: {
          howToFind: "שתף את העיר שלך או מקום מפגש מועדף — שום דבר לא משתווה למפגש פנים אל פנים!",
          example: "\"תל אביב\" או \"קפה הגלריה, רוטשילד\"",
          tip: "היה ספציפי כמה שנוח לך. לרוב די בציון השכונה."
        },
        phone: {
          howToFind: "הזן את מספר הטלפון שלך עם קידומת המדינה.",
          example: "+972 52 123 4567",
          tip: "עובד לשיחות רגילות ו-SMS."
        },
        facetime: {
          howToFind: "השתמש באימייל Apple ID או במספר הטלפון המקושר ל-FaceTime.",
          example: "yourname@icloud.com או +972 52 123 4567",
          tip: "שני הצדדים צריכים מכשירי Apple ל-FaceTime."
        },
        whatsapp: {
          howToFind: "מספר הטלפון שלך עם קידומת המדינה (הרשום ב-WhatsApp).",
          example: "+972521234567",
          tip: "אל תכלול רווחים או מקפים במספר."
        },
        signal: {
          howToFind: "מספר הטלפון שלך הרשום באפליקציית Signal.",
          example: "+972 52 123 4567",
          tip: "Signal מציע הצפנה מקצה לקצה למשתמשים המודעים לפרטיות."
        },
        telegram: {
          howToFind: "שם המשתמש שלך @ (ללא @) או מספר טלפון.",
          example: "username או +972521234567",
          tip: "שמות משתמש קלים יותר לשיתוף ממספרי טלפון."
        },
        zoom: {
          howToFind: "מזהה הפגישה האישית שלך או קישור לחדר הפגישות האישי.",
          example: "123 456 7890 או https://zoom.us/j/1234567890",
          tip: "מצא זאת בהגדרות Zoom תחת פרופיל > מזהה פגישה אישית."
        },
        googleMeet: {
          howToFind: "כתובת ה-Gmail שלך — חברים יכולים להתחיל Meet איתך ישירות.",
          example: "yourname@gmail.com",
          tip: "Google Meet עובד הכי טוב כששני הצדדים יש להם חשבונות Google."
        },
        teams: {
          howToFind: "כתובת האימייל של Microsoft לעבודה או אישית.",
          example: "yourname@company.com או yourname@outlook.com",
          tip: "לחשבונות עבודה, שיחות חיצוניות עשויות לדרוש אישור מנהל."
        },
        discord: {
          howToFind: "שם המשתמש שלך ב-Discord או מזהה משתמש.",
          example: "username#1234 או 123456789012345678",
          tip: "מצא את מזהה המשתמש שלך על ידי הפעלת מצב מפתח בהגדרות Discord."
        },
        skype: {
          howToFind: "שם ה-Skype שלך (לא שם התצוגה).",
          example: "live:yourskypename",
          tip: "מצא זאת בהגדרות Skype → חשבון → שם Skype."
        },
        webex: {
          howToFind: "קישור החדר האישי שלך או אימייל Webex.",
          example: "https://company.webex.com/meet/yourname",
          tip: "קישורי חדר אישי הם קבועים וקלים לשיתוף."
        },
        slack: {
          howToFind: "אימייל העבודה שלך (שני הצדדים צריכים גישה לאותו workspace של Slack).",
          example: "yourname@company.com",
          tip: "שיחות Slack עובדות רק בין חברי אותו workspace."
        }
      }
    }
  },

  // Hindi
  hi: {
    nayborSOS: {
      criticalUrgency: "गंभीर आपातकाल"
    },
    postContent: {
      photo: "फोटो",
      sharedPhoto: "साझा की गई फोटो",
      video: "वीडियो",
      sharedVideo: "साझा किया गया वीडियो"
    },
    accessibility: {
      dragToReorder: "पुनर्क्रमित करने के लिए खींचें"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "उदाहरण",
        realFaceTime: {
          howToFind: "अपना शहर या पसंदीदा मिलन स्थान साझा करें — आमने-सामने मिलने से बेहतर कुछ नहीं!",
          example: "\"मुंबई\" या \"स्टारबक्स, बांद्रा\"",
          tip: "जितना आरामदायक हो उतना विशिष्ट बनें। आमतौर पर मोहल्ला काफी होता है।"
        },
        phone: {
          howToFind: "देश कोड के साथ अपना फोन नंबर दर्ज करें।",
          example: "+91 98765 43210",
          tip: "सामान्य कॉल और SMS के लिए काम करता है।"
        },
        facetime: {
          howToFind: "अपना Apple ID ईमेल या FaceTime से जुड़ा फोन नंबर उपयोग करें।",
          example: "yourname@icloud.com या +91 98765 43210",
          tip: "FaceTime के लिए दोनों पक्षों को Apple डिवाइस चाहिए।"
        },
        whatsapp: {
          howToFind: "देश कोड के साथ आपका फोन नंबर (WhatsApp पर पंजीकृत)।",
          example: "+919876543210",
          tip: "नंबर में स्पेस या डैश न डालें।"
        },
        signal: {
          howToFind: "Signal ऐप पर पंजीकृत आपका फोन नंबर।",
          example: "+91 98765 43210",
          tip: "Signal गोपनीयता-जागरूक उपयोगकर्ताओं के लिए एंड-टू-एंड एन्क्रिप्शन प्रदान करता है।"
        },
        telegram: {
          howToFind: "आपका @username (@ के बिना) या फोन नंबर।",
          example: "username या +919876543210",
          tip: "यूजरनेम फोन नंबर से साझा करना आसान है।"
        },
        zoom: {
          howToFind: "आपकी व्यक्तिगत मीटिंग ID या व्यक्तिगत मीटिंग रूम लिंक।",
          example: "123 456 7890 या https://zoom.us/j/1234567890",
          tip: "इसे Zoom सेटिंग्स में प्रोफ़ाइल > व्यक्तिगत मीटिंग ID में पाएं।"
        },
        googleMeet: {
          howToFind: "आपका Gmail पता — दोस्त सीधे आपके साथ Meet शुरू कर सकते हैं।",
          example: "yourname@gmail.com",
          tip: "Google Meet तब बेहतर काम करता है जब दोनों के पास Google खाते हों।"
        },
        teams: {
          howToFind: "आपका Microsoft कार्य या व्यक्तिगत ईमेल पता।",
          example: "yourname@company.com या yourname@outlook.com",
          tip: "कार्य खातों के लिए, बाहरी कॉल को व्यवस्थापक की मंजूरी की आवश्यकता हो सकती है।"
        },
        discord: {
          howToFind: "आपका Discord username या User ID।",
          example: "username#1234 या 123456789012345678",
          tip: "Discord सेटिंग्स में डेवलपर मोड सक्षम करके अपनी User ID पाएं।"
        },
        skype: {
          howToFind: "आपका Skype नाम (आपका प्रदर्शन नाम नहीं)।",
          example: "live:yourskypename",
          tip: "इसे Skype सेटिंग्स → खाता → Skype नाम में पाएं।"
        },
        webex: {
          howToFind: "आपका व्यक्तिगत कक्ष लिंक या Webex ईमेल।",
          example: "https://company.webex.com/meet/yourname",
          tip: "व्यक्तिगत कक्ष लिंक स्थायी और साझा करने में आसान होते हैं।"
        },
        slack: {
          howToFind: "आपका कार्य ईमेल (दोनों पक्षों को एक ही Slack workspace तक पहुंच चाहिए)।",
          example: "yourname@company.com",
          tip: "Slack कॉल केवल एक ही workspace के सदस्यों के बीच काम करती हैं।"
        }
      }
    }
  },

  // Italian
  it: {
    nayborSOS: {
      criticalUrgency: "Urgenza critica"
    },
    postContent: {
      photo: "Foto",
      sharedPhoto: "Foto condivisa",
      video: "Video",
      sharedVideo: "Video condiviso"
    },
    accessibility: {
      dragToReorder: "Trascina per riordinare"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Esempio",
        realFaceTime: {
          howToFind: "Condividi la tua città o il tuo luogo d'incontro preferito — niente batte un incontro di persona!",
          example: "\"Roma\" o \"Caffè Greco, Via Condotti\"",
          tip: "Sii specifico quanto ti senti a tuo agio. Spesso basta il quartiere."
        },
        phone: {
          howToFind: "Inserisci il tuo numero di telefono con il prefisso internazionale.",
          example: "+39 333 123 4567",
          tip: "Funziona per chiamate normali e SMS."
        },
        facetime: {
          howToFind: "Usa la tua email Apple ID o il numero di telefono collegato a FaceTime.",
          example: "tuonome@icloud.com o +39 333 123 4567",
          tip: "Entrambe le parti hanno bisogno di dispositivi Apple per FaceTime."
        },
        whatsapp: {
          howToFind: "Il tuo numero di telefono con prefisso internazionale (quello registrato su WhatsApp).",
          example: "+393331234567",
          tip: "Non includere spazi o trattini nel numero."
        },
        signal: {
          howToFind: "Il tuo numero di telefono registrato sull'app Signal.",
          example: "+39 333 123 4567",
          tip: "Signal offre crittografia end-to-end per utenti attenti alla privacy."
        },
        telegram: {
          howToFind: "Il tuo @username (senza @) o numero di telefono.",
          example: "username o +393331234567",
          tip: "Gli username sono più facili da condividere dei numeri di telefono."
        },
        zoom: {
          howToFind: "Il tuo ID riunione personale o link della stanza personale.",
          example: "123 456 7890 o https://zoom.us/j/1234567890",
          tip: "Trovalo nelle Impostazioni Zoom sotto Profilo > ID riunione personale."
        },
        googleMeet: {
          howToFind: "Il tuo indirizzo Gmail — gli amici possono avviare un Meet con te direttamente.",
          example: "tuonome@gmail.com",
          tip: "Google Meet funziona meglio quando entrambi hanno account Google."
        },
        teams: {
          howToFind: "Il tuo indirizzo email Microsoft lavorativo o personale.",
          example: "tuonome@azienda.com o tuonome@outlook.com",
          tip: "Per gli account di lavoro, le chiamate esterne potrebbero richiedere l'approvazione dell'admin."
        },
        discord: {
          howToFind: "Il tuo username Discord o ID utente.",
          example: "username#1234 o 123456789012345678",
          tip: "Trova il tuo ID utente abilitando la Modalità sviluppatore nelle impostazioni Discord."
        },
        skype: {
          howToFind: "Il tuo nome Skype (non il tuo nome visualizzato).",
          example: "live:tuoskypename",
          tip: "Trovalo in Impostazioni Skype → Account → Nome Skype."
        },
        webex: {
          howToFind: "Il tuo link della stanza personale o email Webex.",
          example: "https://azienda.webex.com/meet/tuonome",
          tip: "I link delle stanze personali sono permanenti e facili da condividere."
        },
        slack: {
          howToFind: "La tua email di lavoro (entrambe le parti hanno bisogno di accesso allo stesso workspace Slack).",
          example: "tuonome@azienda.com",
          tip: "Le chiamate Slack funzionano solo tra membri dello stesso workspace."
        }
      }
    }
  },

  // Japanese
  ja: {
    nayborSOS: {
      criticalUrgency: "緊急度：重大"
    },
    postContent: {
      photo: "写真",
      sharedPhoto: "共有された写真",
      video: "動画",
      sharedVideo: "共有された動画"
    },
    accessibility: {
      dragToReorder: "ドラッグして並べ替え"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "例",
        realFaceTime: {
          howToFind: "あなたの街やお気に入りの待ち合わせ場所を共有してください — 対面に勝るものはありません！",
          example: "「東京」または「スターバックス、渋谷」",
          tip: "心地よい範囲で具体的に。通常は地域名で十分です。"
        },
        phone: {
          howToFind: "国コード付きの電話番号を入力してください。",
          example: "+81 90 1234 5678",
          tip: "通常の通話とSMSで機能します。"
        },
        facetime: {
          howToFind: "Apple IDのメールまたはFaceTimeに紐付けられた電話番号を使用してください。",
          example: "yourname@icloud.com または +81 90 1234 5678",
          tip: "FaceTimeには両者ともAppleデバイスが必要です。"
        },
        whatsapp: {
          howToFind: "国コード付きの電話番号（WhatsAppに登録されているもの）。",
          example: "+819012345678",
          tip: "番号にスペースやハイフンを含めないでください。"
        },
        signal: {
          howToFind: "Signalアプリに登録されている電話番号。",
          example: "+81 90 1234 5678",
          tip: "Signalはプライバシーを重視するユーザー向けにエンドツーエンド暗号化を提供します。"
        },
        telegram: {
          howToFind: "@ユーザー名（@なし）または電話番号。",
          example: "username または +819012345678",
          tip: "ユーザー名は電話番号より共有しやすいです。"
        },
        zoom: {
          howToFind: "個人ミーティングIDまたは個人ミーティングルームのリンク。",
          example: "123 456 7890 または https://zoom.us/j/1234567890",
          tip: "Zoom設定のプロフィール > 個人ミーティングIDで見つけられます。"
        },
        googleMeet: {
          howToFind: "Gmailアドレス — 友達は直接あなたとMeetを開始できます。",
          example: "yourname@gmail.com",
          tip: "Google Meetは両者がGoogleアカウントを持っている場合に最適に機能します。"
        },
        teams: {
          howToFind: "Microsoftの仕事用または個人用メールアドレス。",
          example: "yourname@company.com または yourname@outlook.com",
          tip: "仕事用アカウントの場合、外部通話には管理者の承認が必要な場合があります。"
        },
        discord: {
          howToFind: "Discordのユーザー名またはユーザーID。",
          example: "username#1234 または 123456789012345678",
          tip: "Discord設定で開発者モードを有効にしてユーザーIDを見つけてください。"
        },
        skype: {
          howToFind: "Skype名（表示名ではありません）。",
          example: "live:yourskypename",
          tip: "Skype設定 → アカウント → Skype名で見つけられます。"
        },
        webex: {
          howToFind: "パーソナルルームのリンクまたはWebexメール。",
          example: "https://company.webex.com/meet/yourname",
          tip: "パーソナルルームのリンクは永続的で共有しやすいです。"
        },
        slack: {
          howToFind: "仕事用メール（両者が同じSlackワークスペースにアクセスできる必要があります）。",
          example: "yourname@company.com",
          tip: "Slack通話は同じワークスペースのメンバー間でのみ機能します。"
        }
      }
    }
  },

  // Korean
  ko: {
    nayborSOS: {
      criticalUrgency: "긴급 상황"
    },
    postContent: {
      photo: "사진",
      sharedPhoto: "공유된 사진",
      video: "동영상",
      sharedVideo: "공유된 동영상"
    },
    accessibility: {
      dragToReorder: "드래그하여 재정렬"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "예시",
        realFaceTime: {
          howToFind: "도시나 좋아하는 만남 장소를 공유하세요 — 직접 만나는 것보다 좋은 건 없습니다!",
          example: "\"서울\" 또는 \"스타벅스, 강남\"",
          tip: "편안한 만큼 구체적으로. 보통 동네면 충분합니다."
        },
        phone: {
          howToFind: "국가 코드와 함께 전화번호를 입력하세요.",
          example: "+82 10 1234 5678",
          tip: "일반 통화와 SMS에 사용됩니다."
        },
        facetime: {
          howToFind: "Apple ID 이메일 또는 FaceTime에 연결된 전화번호를 사용하세요.",
          example: "yourname@icloud.com 또는 +82 10 1234 5678",
          tip: "FaceTime을 사용하려면 양쪽 모두 Apple 기기가 필요합니다."
        },
        whatsapp: {
          howToFind: "국가 코드가 포함된 전화번호 (WhatsApp에 등록된 번호).",
          example: "+821012345678",
          tip: "번호에 공백이나 대시를 포함하지 마세요."
        },
        signal: {
          howToFind: "Signal 앱에 등록된 전화번호.",
          example: "+82 10 1234 5678",
          tip: "Signal은 개인정보를 중시하는 사용자를 위해 종단간 암호화를 제공합니다."
        },
        telegram: {
          howToFind: "@사용자명 (@ 없이) 또는 전화번호.",
          example: "username 또는 +821012345678",
          tip: "사용자명이 전화번호보다 공유하기 쉽습니다."
        },
        zoom: {
          howToFind: "개인 회의 ID 또는 개인 회의실 링크.",
          example: "123 456 7890 또는 https://zoom.us/j/1234567890",
          tip: "Zoom 설정의 프로필 > 개인 회의 ID에서 찾을 수 있습니다."
        },
        googleMeet: {
          howToFind: "Gmail 주소 — 친구들이 직접 Meet을 시작할 수 있습니다.",
          example: "yourname@gmail.com",
          tip: "Google Meet은 양쪽 모두 Google 계정이 있을 때 가장 잘 작동합니다."
        },
        teams: {
          howToFind: "Microsoft 업무용 또는 개인용 이메일 주소.",
          example: "yourname@company.com 또는 yourname@outlook.com",
          tip: "업무용 계정의 경우 외부 통화에 관리자 승인이 필요할 수 있습니다."
        },
        discord: {
          howToFind: "Discord 사용자명 또는 사용자 ID.",
          example: "username#1234 또는 123456789012345678",
          tip: "Discord 설정에서 개발자 모드를 활성화하여 사용자 ID를 찾으세요."
        },
        skype: {
          howToFind: "Skype 이름 (표시 이름이 아님).",
          example: "live:yourskypename",
          tip: "Skype 설정 → 계정 → Skype 이름에서 찾을 수 있습니다."
        },
        webex: {
          howToFind: "개인 회의실 링크 또는 Webex 이메일.",
          example: "https://company.webex.com/meet/yourname",
          tip: "개인 회의실 링크는 영구적이고 공유하기 쉽습니다."
        },
        slack: {
          howToFind: "업무용 이메일 (양쪽 모두 같은 Slack 워크스페이스에 접근 필요).",
          example: "yourname@company.com",
          tip: "Slack 통화는 같은 워크스페이스 멤버 간에만 작동합니다."
        }
      }
    }
  },

  // Portuguese
  pt: {
    nayborSOS: {
      criticalUrgency: "Urgência crítica"
    },
    postContent: {
      photo: "Foto",
      sharedPhoto: "Foto compartilhada",
      video: "Vídeo",
      sharedVideo: "Vídeo compartilhado"
    },
    accessibility: {
      dragToReorder: "Arraste para reordenar"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Exemplo",
        realFaceTime: {
          howToFind: "Compartilhe sua cidade ou local de encontro favorito — nada supera um encontro pessoal!",
          example: "\"São Paulo\" ou \"Café do Centro, Paulista\"",
          tip: "Seja tão específico quanto se sentir confortável. Geralmente o bairro é suficiente."
        },
        phone: {
          howToFind: "Insira seu número de telefone com código do país.",
          example: "+55 11 98765-4321",
          tip: "Funciona para chamadas regulares e SMS."
        },
        facetime: {
          howToFind: "Use seu email Apple ID ou número de telefone vinculado ao FaceTime.",
          example: "seunome@icloud.com ou +55 11 98765-4321",
          tip: "Ambas as partes precisam de dispositivos Apple para FaceTime."
        },
        whatsapp: {
          howToFind: "Seu número de telefone com código do país (o registrado no WhatsApp).",
          example: "+5511987654321",
          tip: "Não inclua espaços ou hífens no número."
        },
        signal: {
          howToFind: "Seu número de telefone registrado no app Signal.",
          example: "+55 11 98765-4321",
          tip: "Signal oferece criptografia de ponta a ponta para usuários preocupados com privacidade."
        },
        telegram: {
          howToFind: "Seu @nome de usuário (sem @) ou número de telefone.",
          example: "nomedeusuario ou +5511987654321",
          tip: "Nomes de usuário são mais fáceis de compartilhar que números de telefone."
        },
        zoom: {
          howToFind: "Seu ID de reunião pessoal ou link da sala pessoal.",
          example: "123 456 7890 ou https://zoom.us/j/1234567890",
          tip: "Encontre em Configurações do Zoom em Perfil > ID de reunião pessoal."
        },
        googleMeet: {
          howToFind: "Seu endereço Gmail — amigos podem iniciar um Meet com você diretamente.",
          example: "seunome@gmail.com",
          tip: "Google Meet funciona melhor quando ambos têm contas Google."
        },
        teams: {
          howToFind: "Seu endereço de email Microsoft de trabalho ou pessoal.",
          example: "seunome@empresa.com ou seunome@outlook.com",
          tip: "Para contas de trabalho, chamadas externas podem precisar de aprovação do admin."
        },
        discord: {
          howToFind: "Seu nome de usuário Discord ou ID de usuário.",
          example: "nomedeusuario#1234 ou 123456789012345678",
          tip: "Encontre seu ID de usuário ativando o Modo Desenvolvedor nas configurações do Discord."
        },
        skype: {
          howToFind: "Seu nome Skype (não seu nome de exibição).",
          example: "live:seuskypename",
          tip: "Encontre em Configurações Skype → Conta → Nome Skype."
        },
        webex: {
          howToFind: "Seu link de sala pessoal ou email Webex.",
          example: "https://empresa.webex.com/meet/seunome",
          tip: "Links de sala pessoal são permanentes e fáceis de compartilhar."
        },
        slack: {
          howToFind: "Seu email de trabalho (ambas as partes precisam de acesso ao mesmo workspace Slack).",
          example: "seunome@empresa.com",
          tip: "Chamadas Slack só funcionam entre membros do mesmo workspace."
        }
      }
    }
  },

  // Russian
  ru: {
    nayborSOS: {
      criticalUrgency: "Критическая срочность"
    },
    postContent: {
      photo: "Фото",
      sharedPhoto: "Общее фото",
      video: "Видео",
      sharedVideo: "Общее видео"
    },
    accessibility: {
      dragToReorder: "Перетащите для изменения порядка"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Пример",
        realFaceTime: {
          howToFind: "Поделитесь своим городом или любимым местом встречи — ничто не сравнится с личной встречей!",
          example: "\"Москва\" или \"Кофемания, Тверская\"",
          tip: "Будьте настолько конкретны, насколько вам комфортно. Обычно района достаточно."
        },
        phone: {
          howToFind: "Введите номер телефона с кодом страны.",
          example: "+7 (999) 123-45-67",
          tip: "Работает для обычных звонков и SMS."
        },
        facetime: {
          howToFind: "Используйте email Apple ID или номер телефона, связанный с FaceTime.",
          example: "yourname@icloud.com или +7 999 123 45 67",
          tip: "Для FaceTime обеим сторонам нужны устройства Apple."
        },
        whatsapp: {
          howToFind: "Ваш номер телефона с кодом страны (зарегистрированный в WhatsApp).",
          example: "+79991234567",
          tip: "Не включайте пробелы или дефисы в номер."
        },
        signal: {
          howToFind: "Ваш номер телефона, зарегистрированный в приложении Signal.",
          example: "+7 999 123-45-67",
          tip: "Signal предлагает сквозное шифрование для пользователей, заботящихся о конфиденциальности."
        },
        telegram: {
          howToFind: "Ваш @username (без @) или номер телефона.",
          example: "username или +79991234567",
          tip: "Имена пользователей легче делиться, чем номерами телефонов."
        },
        zoom: {
          howToFind: "Ваш личный ID встречи или ссылка на личную комнату.",
          example: "123 456 7890 или https://zoom.us/j/1234567890",
          tip: "Найдите в настройках Zoom в разделе Профиль > Личный ID встречи."
        },
        googleMeet: {
          howToFind: "Ваш адрес Gmail — друзья могут начать Meet с вами напрямую.",
          example: "yourname@gmail.com",
          tip: "Google Meet лучше работает, когда у обоих есть аккаунты Google."
        },
        teams: {
          howToFind: "Ваш рабочий или личный email Microsoft.",
          example: "yourname@company.com или yourname@outlook.com",
          tip: "Для рабочих аккаунтов внешние звонки могут требовать одобрения админа."
        },
        discord: {
          howToFind: "Ваше имя пользователя Discord или ID пользователя.",
          example: "username#1234 или 123456789012345678",
          tip: "Найдите свой ID пользователя, включив режим разработчика в настройках Discord."
        },
        skype: {
          howToFind: "Ваше имя Skype (не отображаемое имя).",
          example: "live:yourskypename",
          tip: "Найдите в настройках Skype → Учетная запись → Имя Skype."
        },
        webex: {
          howToFind: "Ссылка на вашу личную комнату или email Webex.",
          example: "https://company.webex.com/meet/yourname",
          tip: "Ссылки на личные комнаты постоянные и легко делиться."
        },
        slack: {
          howToFind: "Ваш рабочий email (обоим нужен доступ к одному рабочему пространству Slack).",
          example: "yourname@company.com",
          tip: "Звонки Slack работают только между членами одного рабочего пространства."
        }
      }
    }
  },

  // Turkish
  tr: {
    nayborSOS: {
      criticalUrgency: "Kritik aciliyet"
    },
    postContent: {
      photo: "Fotoğraf",
      sharedPhoto: "Paylaşılan fotoğraf",
      video: "Video",
      sharedVideo: "Paylaşılan video"
    },
    accessibility: {
      dragToReorder: "Yeniden sıralamak için sürükleyin"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Örnek",
        realFaceTime: {
          howToFind: "Şehrinizi veya favori buluşma yerinizi paylaşın — yüz yüze görüşmenin yerini hiçbir şey tutmaz!",
          example: "\"İstanbul\" veya \"Starbucks, Taksim\"",
          tip: "Kendinizi rahat hissettiğiniz kadar spesifik olun. Genellikle mahalle yeterlidir."
        },
        phone: {
          howToFind: "Ülke koduyla telefon numaranızı girin.",
          example: "+90 532 123 45 67",
          tip: "Normal aramalar ve SMS için çalışır."
        },
        facetime: {
          howToFind: "Apple ID e-postanızı veya FaceTime'a bağlı telefon numaranızı kullanın.",
          example: "adiniz@icloud.com veya +90 532 123 45 67",
          tip: "FaceTime için her iki tarafın da Apple cihazına ihtiyacı var."
        },
        whatsapp: {
          howToFind: "Ülke koduyla telefon numaranız (WhatsApp'a kayıtlı olan).",
          example: "+905321234567",
          tip: "Numarada boşluk veya tire kullanmayın."
        },
        signal: {
          howToFind: "Signal uygulamasına kayıtlı telefon numaranız.",
          example: "+90 532 123 45 67",
          tip: "Signal, gizlilik bilincine sahip kullanıcılar için uçtan uca şifreleme sunar."
        },
        telegram: {
          howToFind: "@kullanıcı adınız (@ olmadan) veya telefon numarası.",
          example: "kullaniciadi veya +905321234567",
          tip: "Kullanıcı adları telefon numaralarından daha kolay paylaşılır."
        },
        zoom: {
          howToFind: "Kişisel toplantı ID'niz veya kişisel toplantı odası linkiniz.",
          example: "123 456 7890 veya https://zoom.us/j/1234567890",
          tip: "Zoom ayarlarında Profil > Kişisel Toplantı ID altında bulun."
        },
        googleMeet: {
          howToFind: "Gmail adresiniz — arkadaşlar doğrudan sizinle Meet başlatabilir.",
          example: "adiniz@gmail.com",
          tip: "Google Meet, her iki tarafın da Google hesabı olduğunda en iyi çalışır."
        },
        teams: {
          howToFind: "Microsoft iş veya kişisel e-posta adresiniz.",
          example: "adiniz@sirket.com veya adiniz@outlook.com",
          tip: "İş hesapları için harici aramalar yönetici onayı gerektirebilir."
        },
        discord: {
          howToFind: "Discord kullanıcı adınız veya Kullanıcı ID'niz.",
          example: "kullaniciadi#1234 veya 123456789012345678",
          tip: "Discord ayarlarında Geliştirici Modunu etkinleştirerek Kullanıcı ID'nizi bulun."
        },
        skype: {
          howToFind: "Skype Adınız (görünen adınız değil).",
          example: "live:skypeadiniz",
          tip: "Skype Ayarları → Hesap → Skype Adı altında bulun."
        },
        webex: {
          howToFind: "Kişisel Oda linkiniz veya Webex e-postanız.",
          example: "https://sirket.webex.com/meet/adiniz",
          tip: "Kişisel Oda linkleri kalıcıdır ve paylaşması kolaydır."
        },
        slack: {
          howToFind: "İş e-postanız (her iki tarafın da aynı Slack çalışma alanına erişimi gerekir).",
          example: "adiniz@sirket.com",
          tip: "Slack aramaları yalnızca aynı çalışma alanının üyeleri arasında çalışır."
        }
      }
    }
  },

  // Chinese
  zh: {
    nayborSOS: {
      criticalUrgency: "紧急情况"
    },
    postContent: {
      photo: "照片",
      sharedPhoto: "分享的照片",
      video: "视频",
      sharedVideo: "分享的视频"
    },
    accessibility: {
      dragToReorder: "拖动以重新排序"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "示例",
        realFaceTime: {
          howToFind: "分享你的城市或最喜欢的见面地点——没有什么比面对面交流更好！",
          example: "\"北京\" 或 \"星巴克，三里屯\"",
          tip: "在你觉得舒适的范围内尽量具体。通常提到区域就够了。"
        },
        phone: {
          howToFind: "输入带国家代码的电话号码。",
          example: "+86 138 1234 5678",
          tip: "适用于普通通话和短信。"
        },
        facetime: {
          howToFind: "使用你的 Apple ID 邮箱或与 FaceTime 关联的电话号码。",
          example: "yourname@icloud.com 或 +86 138 1234 5678",
          tip: "FaceTime 需要双方都使用 Apple 设备。"
        },
        whatsapp: {
          howToFind: "带国家代码的电话号码（在 WhatsApp 注册的号码）。",
          example: "+8613812345678",
          tip: "号码中不要包含空格或连字符。"
        },
        signal: {
          howToFind: "在 Signal 应用注册的电话号码。",
          example: "+86 138 1234 5678",
          tip: "Signal 为注重隐私的用户提供端到端加密。"
        },
        telegram: {
          howToFind: "你的 @用户名（不带 @）或电话号码。",
          example: "username 或 +8613812345678",
          tip: "用户名比电话号码更容易分享。"
        },
        zoom: {
          howToFind: "你的个人会议 ID 或个人会议室链接。",
          example: "123 456 7890 或 https://zoom.us/j/1234567890",
          tip: "在 Zoom 设置的个人资料 > 个人会议 ID 中找到。"
        },
        googleMeet: {
          howToFind: "你的 Gmail 地址——朋友可以直接与你开始 Meet。",
          example: "yourname@gmail.com",
          tip: "当双方都有 Google 账户时，Google Meet 效果最好。"
        },
        teams: {
          howToFind: "你的 Microsoft 工作或个人邮箱地址。",
          example: "yourname@company.com 或 yourname@outlook.com",
          tip: "对于工作账户，外部通话可能需要管理员批准。"
        },
        discord: {
          howToFind: "你的 Discord 用户名或用户 ID。",
          example: "username#1234 或 123456789012345678",
          tip: "在 Discord 设置中启用开发者模式来找到你的用户 ID。"
        },
        skype: {
          howToFind: "你的 Skype 名称（不是显示名称）。",
          example: "live:yourskypename",
          tip: "在 Skype 设置 → 账户 → Skype 名称中找到。"
        },
        webex: {
          howToFind: "你的个人会议室链接或 Webex 邮箱。",
          example: "https://company.webex.com/meet/yourname",
          tip: "个人会议室链接是永久的，易于分享。"
        },
        slack: {
          howToFind: "你的工作邮箱（双方都需要访问同一个 Slack 工作区）。",
          example: "yourname@company.com",
          tip: "Slack 通话只在同一工作区的成员之间有效。"
        }
      }
    }
  },

  // Vietnamese
  vi: {
    nayborSOS: {
      criticalUrgency: "Mức độ khẩn cấp nghiêm trọng"
    },
    postContent: {
      photo: "Ảnh",
      sharedPhoto: "Ảnh được chia sẻ",
      video: "Video",
      sharedVideo: "Video được chia sẻ"
    },
    accessibility: {
      dragToReorder: "Kéo để sắp xếp lại"
    },
    contactMethods: {
      guidance: {
        exampleLabel: "Ví dụ",
        realFaceTime: {
          howToFind: "Chia sẻ thành phố hoặc địa điểm gặp mặt yêu thích của bạn — không gì bằng gặp mặt trực tiếp!",
          example: "\"Hà Nội\" hoặc \"Highlands Coffee, Hoàn Kiếm\"",
          tip: "Hãy cụ thể như bạn cảm thấy thoải mái. Thường thì tên khu vực là đủ."
        },
        phone: {
          howToFind: "Nhập số điện thoại với mã quốc gia.",
          example: "+84 98 765 4321",
          tip: "Hoạt động cho cuộc gọi thông thường và SMS."
        },
        facetime: {
          howToFind: "Sử dụng email Apple ID hoặc số điện thoại liên kết với FaceTime.",
          example: "yourname@icloud.com hoặc +84 98 765 4321",
          tip: "Cả hai bên đều cần thiết bị Apple cho FaceTime."
        },
        whatsapp: {
          howToFind: "Số điện thoại với mã quốc gia (số đã đăng ký với WhatsApp).",
          example: "+84987654321",
          tip: "Không bao gồm dấu cách hoặc gạch ngang trong số."
        },
        signal: {
          howToFind: "Số điện thoại đã đăng ký với ứng dụng Signal.",
          example: "+84 98 765 4321",
          tip: "Signal cung cấp mã hóa đầu cuối cho người dùng quan tâm đến quyền riêng tư."
        },
        telegram: {
          howToFind: "@tên người dùng (không có @) hoặc số điện thoại.",
          example: "username hoặc +84987654321",
          tip: "Tên người dùng dễ chia sẻ hơn số điện thoại."
        },
        zoom: {
          howToFind: "ID cuộc họp cá nhân hoặc liên kết phòng họp cá nhân.",
          example: "123 456 7890 hoặc https://zoom.us/j/1234567890",
          tip: "Tìm trong Cài đặt Zoom dưới Hồ sơ > ID cuộc họp cá nhân."
        },
        googleMeet: {
          howToFind: "Địa chỉ Gmail — bạn bè có thể bắt đầu Meet với bạn trực tiếp.",
          example: "yourname@gmail.com",
          tip: "Google Meet hoạt động tốt nhất khi cả hai bên đều có tài khoản Google."
        },
        teams: {
          howToFind: "Địa chỉ email Microsoft công việc hoặc cá nhân.",
          example: "yourname@company.com hoặc yourname@outlook.com",
          tip: "Đối với tài khoản công việc, cuộc gọi bên ngoài có thể cần sự phê duyệt của quản trị viên."
        },
        discord: {
          howToFind: "Tên người dùng Discord hoặc ID người dùng.",
          example: "username#1234 hoặc 123456789012345678",
          tip: "Tìm ID người dùng bằng cách bật Chế độ nhà phát triển trong cài đặt Discord."
        },
        skype: {
          howToFind: "Tên Skype của bạn (không phải tên hiển thị).",
          example: "live:yourskypename",
          tip: "Tìm trong Cài đặt Skype → Tài khoản → Tên Skype."
        },
        webex: {
          howToFind: "Liên kết phòng cá nhân hoặc email Webex.",
          example: "https://company.webex.com/meet/yourname",
          tip: "Liên kết phòng cá nhân là vĩnh viễn và dễ chia sẻ."
        },
        slack: {
          howToFind: "Email công việc (cả hai bên cần quyền truy cập vào cùng một không gian làm việc Slack).",
          example: "yourname@company.com",
          tip: "Cuộc gọi Slack chỉ hoạt động giữa các thành viên của cùng một không gian làm việc."
        }
      }
    }
  },

  // Bengali
  bn: {
    nayborSOS: {
      criticalUrgency: "জরুরি জরুরী অবস্থা"
    },
    postContent: {
      photo: "ছবি",
      sharedPhoto: "শেয়ার করা ছবি",
      video: "ভিডিও",
      sharedVideo: "শেয়ার করা ভিডিও"
    },
    accessibility: {
      dragToReorder: "পুনঃক্রম করতে টানুন"
    }
  },

  // Urdu
  ur: {
    nayborSOS: {
      criticalUrgency: "شدید ہنگامی صورتحال"
    },
    postContent: {
      photo: "تصویر",
      sharedPhoto: "شیئر کی گئی تصویر",
      video: "ویڈیو",
      sharedVideo: "شیئر کی گئی ویڈیو"
    },
    accessibility: {
      dragToReorder: "ترتیب بدلنے کے لیے گھسیٹیں"
    }
  },

  // Javanese
  jv: {
    nayborSOS: {
      criticalUrgency: "Darurat kritis"
    },
    postContent: {
      photo: "Foto",
      sharedPhoto: "Foto sing dibagikan",
      video: "Video",
      sharedVideo: "Video sing dibagikan"
    },
    accessibility: {
      dragToReorder: "Seret kanggo ngatur ulang"
    }
  },

  // Marathi
  mr: {
    nayborSOS: {
      criticalUrgency: "गंभीर आणीबाणी"
    },
    postContent: {
      photo: "फोटो",
      sharedPhoto: "शेअर केलेला फोटो",
      video: "व्हिडिओ",
      sharedVideo: "शेअर केलेला व्हिडिओ"
    },
    accessibility: {
      dragToReorder: "पुनर्क्रमित करण्यासाठी ड्रॅग करा"
    }
  },

  // Tamil
  ta: {
    nayborSOS: {
      criticalUrgency: "முக்கிய அவசரநிலை"
    },
    postContent: {
      photo: "புகைப்படம்",
      sharedPhoto: "பகிரப்பட்ட புகைப்படம்",
      video: "வீடியோ",
      sharedVideo: "பகிரப்பட்ட வீடியோ"
    },
    accessibility: {
      dragToReorder: "மறுவரிசைப்படுத்த இழுக்கவும்"
    }
  },

  // Telugu
  te: {
    nayborSOS: {
      criticalUrgency: "క్లిష్టమైన అత్యవసర పరిస్థితి"
    },
    postContent: {
      photo: "ఫోటో",
      sharedPhoto: "షేర్ చేసిన ఫోటో",
      video: "వీడియో",
      sharedVideo: "షేర్ చేసిన వీడియో"
    },
    accessibility: {
      dragToReorder: "పునఃక్రమం చేయడానికి లాగండి"
    }
  },

  // Punjabi
  pa: {
    nayborSOS: {
      criticalUrgency: "ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ"
    },
    postContent: {
      photo: "ਫੋਟੋ",
      sharedPhoto: "ਸਾਂਝੀ ਕੀਤੀ ਫੋਟੋ",
      video: "ਵੀਡੀਓ",
      sharedVideo: "ਸਾਂਝੀ ਕੀਤੀ ਵੀਡੀਓ"
    },
    accessibility: {
      dragToReorder: "ਮੁੜ ਕ੍ਰਮਬੱਧ ਕਰਨ ਲਈ ਖਿੱਚੋ"
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

console.log('Done! Additional i18n keys applied to all languages.');
