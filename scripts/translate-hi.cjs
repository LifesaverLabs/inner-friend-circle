const fs = require('fs');
const path = require('path');

const hindiTranslations = {
  "landing": {
    "hero": {
      "title": "जो वास्तव में महत्वपूर्ण हैं उनसे जुड़ें",
      "subtitle": "InnerFriend आपकी सबसे करीबी रिश्तों को प्रबंधित करने और जिन लोगों की आप परवाह करते हैं उनसे जुड़े रहने में मदद करता है",
      "cta": "शुरू करें",
      "learnMore": "और जानें"
    },
    "features": {
      "title": "विशेषताएं",
      "organize": {
        "title": "दोस्तों को व्यवस्थित करें",
        "description": "अपने करीबी दोस्तों को रिश्ते के प्रकार और निकटता के आधार पर स्तरों में वर्गीकृत करें"
      },
      "remind": {
        "title": "जुड़े रहें",
        "description": "रिश्तों को बनाए रखने के लिए जब बहुत समय हो जाए तो रिमाइंडर प्राप्त करें"
      },
      "emergency": {
        "title": "आपातकालीन नेटवर्क",
        "description": "आपातकाल में संपर्क करने के लिए एक विश्वसनीय सर्कल बनाएं"
      }
    },
    "privacy": {
      "title": "गोपनीयता सर्वप्रथम",
      "description": "आपका डेटा आपका है। अपने सोशल ग्राफ पर पूर्ण नियंत्रण बनाए रखें।"
    },
    "cta": {
      "title": "अपनी यात्रा शुरू करने के लिए तैयार हैं?",
      "subtitle": "आज ही InnerFriend के साथ सार्थक रिश्ते बनाना शुरू करें",
      "button": "मुफ्त में शुरू करें"
    }
  },
  "auth": {
    "signIn": "साइन इन करें",
    "signUp": "साइन अप करें",
    "signOut": "साइन आउट करें",
    "email": "ईमेल",
    "password": "पासवर्ड",
    "confirmPassword": "पासवर्ड की पुष्टि करें",
    "forgotPassword": "पासवर्ड भूल गए?",
    "resetPassword": "पासवर्ड रीसेट करें",
    "noAccount": "खाता नहीं है?",
    "hasAccount": "पहले से खाता है?",
    "continueWith": "{{provider}} के साथ जारी रखें",
    "orContinueWith": "या इसके साथ जारी रखें",
    "signingIn": "साइन इन हो रहा है...",
    "signingUp": "साइन अप हो रहा है...",
    "errors": {
      "invalidEmail": "कृपया एक वैध ईमेल पता दर्ज करें",
      "invalidPassword": "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
      "passwordMismatch": "पासवर्ड मेल नहीं खाते",
      "emailInUse": "यह ईमेल पहले से उपयोग में है",
      "invalidCredentials": "अमान्य ईमेल या पासवर्ड",
      "generic": "कुछ गलत हो गया। कृपया पुनः प्रयास करें"
    }
  },
  "actions": {
    "save": "सहेजें",
    "cancel": "रद्द करें",
    "delete": "हटाएं",
    "edit": "संपादित करें",
    "add": "जोड़ें",
    "remove": "हटाएं",
    "confirm": "पुष्टि करें",
    "back": "वापस",
    "next": "आगे",
    "finish": "समाप्त",
    "skip": "छोड़ें",
    "close": "बंद करें",
    "search": "खोजें",
    "filter": "फ़िल्टर",
    "sort": "क्रमबद्ध करें",
    "refresh": "रीफ्रेश करें",
    "loading": "लोड हो रहा है...",
    "submit": "जमा करें",
    "continue": "जारी रखें",
    "done": "हो गया",
    "apply": "लागू करें",
    "clear": "साफ़ करें",
    "selectAll": "सभी चुनें",
    "deselectAll": "सभी अचयनित करें",
    "expandAll": "सभी विस्तृत करें",
    "collapseAll": "सभी संक्षिप्त करें"
  },
  "emptyState": {
    "noFriends": {
      "title": "अभी तक कोई दोस्त नहीं",
      "description": "अपना पहला दोस्त जोड़कर शुरू करें",
      "action": "दोस्त जोड़ें"
    },
    "noResults": {
      "title": "कोई परिणाम नहीं",
      "description": "आपके खोज मानदंडों से कुछ भी मेल नहीं खाता",
      "action": "फ़िल्टर साफ़ करें"
    },
    "noNotifications": {
      "title": "कोई सूचनाएं नहीं",
      "description": "आप सब कुछ देख चुके हैं!",
      "action": "रीफ्रेश करें"
    },
    "noActivity": {
      "title": "कोई गतिविधि नहीं",
      "description": "आपकी हाल की गतिविधि यहां दिखाई देगी",
      "action": "शुरू करें"
    }
  },
  "dashboard": {
    "title": "डैशबोर्ड",
    "welcome": "नमस्ते, {{name}}",
    "overview": "अवलोकन",
    "recentActivity": "हाल की गतिविधि",
    "quickActions": "त्वरित कार्य",
    "stats": {
      "totalFriends": "कुल दोस्त",
      "innerCircle": "इनर सर्कल",
      "needsAttention": "ध्यान चाहिए",
      "lastContact": "अंतिम संपर्क"
    },
    "widgets": {
      "upcomingBirthdays": "आने वाले जन्मदिन",
      "recentContacts": "हाल के संपर्क",
      "suggestedActions": "सुझाए गए कार्य"
    }
  },
  "mission": {
    "title": "मिशन",
    "subtitle": "महत्वपूर्ण रिश्तों से जुड़े रहें",
    "description": "मिशन आपको दोस्तों से जुड़े रहने में मदद करते हैं",
    "complete": "मिशन पूरा करें",
    "skip": "मिशन छोड़ें",
    "remind": "मुझे बाद में याद दिलाएं",
    "empty": {
      "title": "कोई सक्रिय मिशन नहीं",
      "description": "आप सब कर चुके हैं! नए मिशन जल्द ही आएंगे।"
    },
    "types": {
      "call": "कॉल मिशन",
      "message": "संदेश मिशन",
      "meetup": "मिलने का मिशन",
      "birthday": "जन्मदिन मिशन",
      "checkin": "चेक-इन मिशन"
    }
  },
  "tending": {
    "title": "दोस्तों की देखभाल",
    "subtitle": "रिश्ते एक बगीचे की तरह हैं - उन्हें नियमित देखभाल की जरूरत है",
    "description": "जिन दोस्तों से संपर्क करने का समय है",
    "actions": {
      "markContacted": "संपर्क किया गया चिह्नित करें",
      "snooze": "स्नूज़ करें",
      "viewProfile": "प्रोफ़ाइल देखें"
    },
    "filters": {
      "all": "सभी",
      "overdue": "बकाया",
      "upcoming": "आने वाले",
      "byTier": "स्तर के अनुसार"
    },
    "frequency": {
      "daily": "दैनिक",
      "weekly": "साप्ताहिक",
      "biweekly": "पाक्षिक",
      "monthly": "मासिक",
      "quarterly": "त्रैमासिक",
      "yearly": "वार्षिक"
    },
    "status": {
      "onTrack": "सही राह पर",
      "dueSoon": "जल्द देय",
      "overdue": "बकाया",
      "needsAttention": "ध्यान चाहिए"
    },
    "reminderTypes": {
      "call": "कॉल",
      "text": "संदेश",
      "visit": "मिलें",
      "email": "ईमेल"
    },
    "lastContact": "अंतिम संपर्क",
    "contactDue": "संपर्क देय",
    "noContactYet": "अभी तक संपर्क नहीं",
    "daysOverdue": "{{count}} दिन बकाया",
    "dueIn": "{{count}} दिन में देय"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "जब सबसे ज्यादा जरूरत हो तब अपने विश्वसनीय सर्कल तक पहुंचें",
    "description": "आपातकालीन नेटवर्क विश्वसनीय संपर्क हैं जो संकट में मदद कर सकते हैं",
    "activate": "SOS सक्रिय करें",
    "deactivate": "SOS निष्क्रिय करें",
    "status": {
      "active": "SOS सक्रिय",
      "inactive": "SOS निष्क्रिय",
      "pending": "प्रतीक्षा में..."
    },
    "contacts": {
      "title": "आपातकालीन संपर्क",
      "add": "आपातकालीन संपर्क जोड़ें",
      "remove": "आपातकालीन सूची से हटाएं",
      "empty": "अभी तक कोई आपातकालीन संपर्क सेट नहीं है"
    },
    "message": {
      "title": "आपातकालीन संदेश",
      "placeholder": "वह संदेश दर्ज करें जो आपके नेटवर्क को भेजा जाएगा",
      "default": "मुझे मदद चाहिए। कृपया संपर्क करें अगर आप कर सकते हैं।"
    },
    "settings": {
      "title": "SOS सेटिंग्स",
      "autoLocation": "स्वचालित रूप से स्थान साझा करें",
      "confirmActivation": "सक्रियण से पहले पुष्टि करें",
      "cooldown": "सक्रियण के बीच कूलडाउन"
    }
  },
  "callActions": {
    "call": "कॉल करें",
    "video": "वीडियो कॉल",
    "message": "संदेश भेजें",
    "email": "ईमेल भेजें",
    "directions": "दिशा-निर्देश",
    "schedule": "शेड्यूल करें",
    "addNote": "नोट जोड़ें",
    "recordCall": "कॉल रिकॉर्ड करें",
    "shareContact": "संपर्क साझा करें"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend में आपका स्वागत है",
      "subtitle": "आइए सार्थक रिश्तों को प्रबंधित करना शुरू करें",
      "description": "हम आपसे कुछ सवाल पूछेंगे ताकि आपके इनर सर्कल अनुभव को अनुकूलित किया जा सके"
    },
    "steps": {
      "profile": "प्रोफ़ाइल बनाएं",
      "import": "संपर्क आयात करें",
      "categorize": "दोस्तों को वर्गीकृत करें",
      "preferences": "प्राथमिकताएं"
    },
    "import": {
      "title": "संपर्क आयात करें",
      "description": "अपने मौजूदा संपर्कों को आयात करके शुरू करें",
      "fromPhone": "फोन संपर्कों से",
      "fromGoogle": "Google संपर्कों से",
      "manual": "मैन्युअली जोड़ें",
      "skip": "अभी छोड़ें"
    },
    "complete": {
      "title": "सब कुछ तैयार!",
      "subtitle": "आप अपने इनर सर्कल को प्रबंधित करने के लिए तैयार हैं",
      "action": "डैशबोर्ड पर जाएं"
    }
  },
  "keysShared": {
    "title": "साझा की गई चाबियां",
    "subtitle": "अपने विश्वास सर्कल तक पहुंच प्रबंधित करें",
    "description": "प्रबंधित करें कि आपातकाल में आपके इनर सर्कल तक कौन पहुंच सकता है",
    "grant": "चाबी प्रदान करें",
    "revoke": "चाबी रद्द करें",
    "manage": "साझा की गई चाबियां प्रबंधित करें",
    "permissions": {
      "view": "संपर्क देखें",
      "contact": "आपातकाल में संपर्क कर सकते हैं",
      "location": "स्थान पहुंच"
    },
    "doorKeyTree": {
      "title": "डोर की ट्री",
      "description": "विश्वसनीय लोग जो आपातकाल में आपके इनर सर्कल तक पहुंच सकते हैं",
      "empty": "अभी तक कोई चाबी साझा नहीं की गई"
    },
    "shareRequest": {
      "title": "चाबी अनुरोध",
      "pending": "लंबित अनुरोध",
      "accept": "स्वीकार करें",
      "decline": "अस्वीकार करें"
    },
    "sharedWithYou": "आपके साथ साझा की गई चाबियां",
    "sharedByYou": "आपने साझा की गई चाबियां",
    "noSharedKeys": "अभी तक कोई चाबी साझा नहीं की गई",
    "expiresAt": "समाप्ति: {{date}}",
    "neverExpires": "कभी समाप्त नहीं होती"
  },
  "reserved": {
    "title": "आरक्षित अनुभाग",
    "description": "यह सुविधा प्रीमियम उपयोगकर्ताओं के लिए आरक्षित है",
    "upgrade": "अनलॉक करने के लिए अपग्रेड करें"
  },
  "addLinkedFriend": {
    "title": "लिंक्ड दोस्त जोड़ें",
    "subtitle": "उन दोस्तों से जुड़ें जो पहले से InnerFriend का उपयोग करते हैं",
    "description": "नीचे अपना कोड साझा करें या किसी दोस्त का कोड स्कैन करें",
    "searchPlaceholder": "नाम या ईमेल से खोजें",
    "noResults": "कोई उपयोगकर्ता नहीं मिला",
    "sendRequest": "कनेक्शन अनुरोध भेजें",
    "pending": "अनुरोध लंबित",
    "connected": "जुड़ा हुआ",
    "yourCode": "आपका कोड",
    "scanCode": "कोड स्कैन करें",
    "enterCode": "कोड दर्ज करें",
    "shareCode": "कोड साझा करें"
  },
  "gdpr": {
    "title": "डेटा गोपनीयता",
    "subtitle": "जानें कि हम आपके व्यक्तिगत डेटा को कैसे एकत्र, उपयोग और सुरक्षित करते हैं",
    "consent": {
      "title": "सहमति प्रबंधन",
      "description": "अपनी डेटा प्रोसेसिंग सहमति प्रबंधित करें",
      "analytics": "एनालिटिक्स कुकीज़",
      "marketing": "मार्केटिंग संचार",
      "thirdParty": "तृतीय-पक्ष साझाकरण",
      "withdraw": "सहमति वापस लें"
    },
    "rights": {
      "title": "आपके अधिकार",
      "access": "डेटा पहुंच",
      "rectification": "डेटा सुधार",
      "erasure": "डेटा मिटाना",
      "portability": "डेटा पोर्टेबिलिटी",
      "restriction": "प्रोसेसिंग प्रतिबंध",
      "objection": "प्रोसेसिंग पर आपत्ति"
    },
    "export": {
      "title": "डेटा निर्यात करें",
      "description": "अपने सभी व्यक्तिगत डेटा की एक प्रति डाउनलोड करें",
      "button": "डेटा निर्यात करें",
      "processing": "निर्यात तैयार हो रहा है...",
      "ready": "डेटा डाउनलोड के लिए तैयार"
    },
    "delete": {
      "title": "खाता हटाएं",
      "description": "अपना खाता और सभी संबंधित डेटा स्थायी रूप से हटाएं। इस क्रिया को पूर्ववत नहीं किया जा सकता।",
      "button": "खाता हटाएं",
      "confirm": "पुष्टि करने के लिए 'हटाएं' टाइप करें",
      "warning": "इस क्रिया को पूर्ववत नहीं किया जा सकता"
    },
    "policy": {
      "title": "गोपनीयता नीति",
      "lastUpdated": "अंतिम अपडेट",
      "readFull": "पूरी नीति पढ़ें"
    }
  },
  "admin": {
    "title": "व्यवस्थापक पैनल",
    "dashboard": "व्यवस्थापक डैशबोर्ड",
    "users": {
      "title": "उपयोगकर्ता प्रबंधन",
      "list": "सभी उपयोगकर्ता",
      "active": "सक्रिय उपयोगकर्ता",
      "suspended": "निलंबित उपयोगकर्ता",
      "invite": "उपयोगकर्ता आमंत्रित करें"
    },
    "settings": {
      "title": "सिस्टम सेटिंग्स",
      "general": "सामान्य सेटिंग्स",
      "security": "सुरक्षा सेटिंग्स",
      "notifications": "सूचना सेटिंग्स"
    },
    "logs": {
      "title": "सिस्टम लॉग्स",
      "audit": "ऑडिट लॉग्स",
      "error": "त्रुटि लॉग्स",
      "access": "पहुंच लॉग्स"
    },
    "analytics": {
      "title": "एनालिटिक्स",
      "overview": "अवलोकन",
      "users": "उपयोगकर्ता एनालिटिक्स",
      "engagement": "सहभागिता मेट्रिक्स"
    }
  },
  "dev": {
    "title": "डेवलपर सेटिंग्स",
    "apiKeys": "API कुंजियां",
    "webhooks": "वेबहुक्स",
    "logs": "डेवलपर लॉग्स",
    "testing": "टेस्टिंग मोड",
    "documentation": "API दस्तावेज़ीकरण"
  },
  "contactMethods": {
    "title": "संपर्क के तरीके",
    "phone": "फोन",
    "email": "ईमेल",
    "sms": "SMS",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "signal": "Signal",
    "messenger": "Messenger",
    "instagram": "Instagram",
    "twitter": "Twitter",
    "linkedin": "LinkedIn",
    "discord": "Discord",
    "slack": "Slack",
    "other": "अन्य",
    "preferred": "पसंदीदा तरीका",
    "add": "संपर्क तरीका जोड़ें",
    "primary": "प्राथमिक",
    "secondary": "द्वितीयक"
  },
  "post": {
    "title": "पोस्ट बनाएं",
    "placeholder": "आप क्या सोच रहे हैं?",
    "submit": "पोस्ट करें",
    "visibility": {
      "public": "सार्वजनिक",
      "friends": "केवल दोस्त",
      "private": "निजी"
    },
    "actions": {
      "like": "पसंद",
      "comment": "टिप्पणी",
      "share": "साझा करें",
      "save": "सहेजें"
    }
  },
  "parasocial": {
    "title": "क्रिएटर्स को फॉलो करें",
    "subtitle": "अपने पसंदीदा क्रिएटर्स से जुड़ें",
    "description": "अपने पसंदीदा क्रिएटर्स को फॉलो करें और उनसे अपडेट प्राप्त करें",
    "follow": "फॉलो करें",
    "unfollow": "अनफॉलो करें",
    "following": "फॉलो कर रहे हैं",
    "followers": "फॉलोअर्स",
    "noCreators": "कोई क्रिएटर नहीं मिला"
  },
  "profileSettings": {
    "title": "प्रोफ़ाइल सेटिंग्स",
    "personalInfo": "व्यक्तिगत जानकारी",
    "displayName": "प्रदर्शित नाम",
    "bio": "बायो",
    "avatar": "अवतार",
    "changeAvatar": "अवतार बदलें",
    "removeAvatar": "अवतार हटाएं",
    "privacy": {
      "title": "गोपनीयता सेटिंग्स",
      "profileVisibility": "प्रोफ़ाइल दृश्यता",
      "showOnline": "ऑनलाइन स्थिति दिखाएं",
      "showLastSeen": "अंतिम बार देखा गया दिखाएं"
    },
    "notifications": {
      "title": "सूचना सेटिंग्स",
      "email": "ईमेल सूचनाएं",
      "push": "पुश सूचनाएं",
      "sms": "SMS सूचनाएं"
    },
    "account": {
      "title": "खाता सेटिंग्स",
      "changePassword": "पासवर्ड बदलें",
      "twoFactor": "दो-कारक प्रमाणीकरण",
      "sessions": "सक्रिय सत्र",
      "deleteAccount": "खाता हटाएं"
    }
  },
  "editFriend": {
    "title": "दोस्त संपादित करें",
    "basicInfo": "मूल जानकारी",
    "name": "नाम",
    "nickname": "उपनाम",
    "birthday": "जन्मदिन",
    "notes": "नोट्स",
    "tier": "स्तर",
    "contactFrequency": "संपर्क आवृत्ति",
    "save": "परिवर्तन सहेजें",
    "delete": "दोस्त हटाएं",
    "confirmDelete": "क्या आप वाकई इस दोस्त को हटाना चाहते हैं?"
  },
  "followCreator": {
    "title": "क्रिएटर को फॉलो करें",
    "search": "क्रिएटर्स खोजें",
    "suggested": "आपके लिए सुझाए गए",
    "categories": "श्रेणियां",
    "trending": "ट्रेंडिंग"
  },
  "dispatch": {
    "validation": {
      "required": "यह फ़ील्ड आवश्यक है",
      "invalidEmail": "कृपया एक वैध ईमेल पता दर्ज करें",
      "invalidPhone": "कृपया एक वैध फोन नंबर दर्ज करें",
      "minLength": "कम से कम {{min}} अक्षर होने चाहिए",
      "maxLength": "{{max}} अक्षरों से अधिक नहीं हो सकता",
      "passwordMatch": "पासवर्ड मेल खाने चाहिए",
      "invalidUrl": "कृपया एक वैध URL दर्ज करें",
      "invalidDate": "कृपया एक वैध तिथि दर्ज करें",
      "futureDate": "तिथि भविष्य में होनी चाहिए",
      "pastDate": "तिथि अतीत में होनी चाहिए"
    }
  },
  "privacy": {
    "title": "गोपनीयता नीति",
    "lastUpdated": "अंतिम अपडेट: {{date}}",
    "sections": {
      "collection": {
        "title": "जानकारी संग्रह",
        "description": "हम कौन सी जानकारी एकत्र करते हैं और कैसे"
      },
      "usage": {
        "title": "जानकारी का उपयोग",
        "description": "हम एकत्रित जानकारी का उपयोग कैसे करते हैं"
      },
      "sharing": {
        "title": "जानकारी साझाकरण",
        "description": "हम आपकी जानकारी कब और किसके साथ साझा करते हैं"
      },
      "security": {
        "title": "डेटा सुरक्षा",
        "description": "हम आपकी जानकारी की सुरक्षा कैसे करते हैं"
      },
      "rights": {
        "title": "आपके अधिकार",
        "description": "व्यक्तिगत डेटा के संबंध में आपके अधिकार"
      },
      "cookies": {
        "title": "कुकीज़ और ट्रैकिंग",
        "description": "कुकीज़ और समान तकनीकों का हमारा उपयोग"
      },
      "children": {
        "title": "बच्चों की गोपनीयता",
        "description": "बच्चों की गोपनीयता पर हमारी नीति"
      },
      "changes": {
        "title": "नीति में परिवर्तन",
        "description": "हम इस नीति में परिवर्तनों के बारे में कैसे सूचित करते हैं"
      },
      "contact": {
        "title": "हमसे संपर्क करें",
        "description": "गोपनीयता संबंधी प्रश्नों के लिए संपर्क करें"
      }
    }
  },
  "terms": {
    "title": "सेवा की शर्तें",
    "lastUpdated": "अंतिम अपडेट: {{date}}",
    "sections": {
      "acceptance": {
        "title": "शर्तों की स्वीकृति",
        "description": "InnerFriend का उपयोग करके, आप इन शर्तों से सहमत होते हैं"
      },
      "eligibility": {
        "title": "पात्रता",
        "description": "हमारी सेवाओं का उपयोग करने के लिए आवश्यकताएं"
      },
      "accounts": {
        "title": "उपयोगकर्ता खाते",
        "description": "आपके खाते के लिए आपकी जिम्मेदारियां"
      },
      "content": {
        "title": "उपयोगकर्ता सामग्री",
        "description": "आपके द्वारा सबमिट की गई सामग्री के संबंध में नियम"
      },
      "prohibited": {
        "title": "निषिद्ध गतिविधियां",
        "description": "हमारे प्लेटफॉर्म पर क्या प्रतिबंधित है"
      },
      "intellectual": {
        "title": "बौद्धिक संपदा",
        "description": "कॉपीराइट और ट्रेडमार्क के बारे में जानकारी"
      },
      "disclaimers": {
        "title": "अस्वीकरण",
        "description": "InnerFriend बिना किसी वारंटी के 'जैसा है' प्रदान किया जाता है"
      },
      "liability": {
        "title": "दायित्व की सीमा",
        "description": "हमारे दायित्व पर सीमाएं"
      },
      "termination": {
        "title": "समाप्ति",
        "description": "खाते कब समाप्त किए जा सकते हैं"
      },
      "governing": {
        "title": "शासी कानून",
        "description": "इन शर्तों को नियंत्रित करने वाले कानून"
      },
      "contact": {
        "title": "हमसे संपर्क करें",
        "description": "इन शर्तों के बारे में प्रश्नों के लिए संपर्क करें"
      }
    }
  }
};

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

const localePath = path.join(__dirname, '../public/locales/hi/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, hindiTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: hi');
console.log('Done! Hindi translations applied.');
