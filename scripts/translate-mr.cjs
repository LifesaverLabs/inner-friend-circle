const fs = require('fs');
const path = require('path');

const marathiTranslations = {
  "landing": {
    "hero": {
      "title": "खरोखर महत्त्वाच्या लोकांशी जोडले जा",
      "subtitle": "InnerFriend तुमचे जवळचे संबंध व्यवस्थापित करण्यात आणि तुम्हाला ज्यांची काळजी आहे त्यांच्याशी जोडलेले राहण्यात मदत करते",
      "cta": "सुरू करा",
      "learnMore": "अधिक जाणून घ्या"
    },
    "features": {
      "title": "वैशिष्ट्ये",
      "organize": {
        "title": "मित्रांना व्यवस्थित करा",
        "description": "तुमच्या जवळच्या मित्रांना नातेसंबंधाचा प्रकार आणि जवळीक यावर आधारित स्तरांमध्ये वर्गीकृत करा"
      },
      "remind": {
        "title": "जोडलेले राहा",
        "description": "संबंध टिकवण्यासाठी खूप वेळ झाल्यावर स्मरणपत्रे मिळवा"
      },
      "emergency": {
        "title": "आपत्कालीन नेटवर्क",
        "description": "आपत्कालीन परिस्थितीत संपर्क करण्यासाठी विश्वासार्ह वर्तुळ तयार करा"
      }
    },
    "privacy": {
      "title": "गोपनीयता प्रथम",
      "description": "तुमचा डेटा तुमचा आहे. तुमच्या सोशल ग्राफवर पूर्ण नियंत्रण ठेवा."
    },
    "cta": {
      "title": "तुमचा प्रवास सुरू करण्यास तयार आहात?",
      "subtitle": "आजच InnerFriend सोबत अर्थपूर्ण संबंध बांधायला सुरुवात करा",
      "button": "मोफत सुरू करा"
    }
  },
  "auth": {
    "signIn": "साइन इन करा",
    "signUp": "साइन अप करा",
    "signOut": "साइन आउट करा",
    "email": "ईमेल",
    "password": "पासवर्ड",
    "confirmPassword": "पासवर्ड पुष्टी करा",
    "forgotPassword": "पासवर्ड विसरलात?",
    "resetPassword": "पासवर्ड रीसेट करा",
    "noAccount": "खाते नाही?",
    "hasAccount": "आधीच खाते आहे?",
    "continueWith": "{{provider}} सह सुरू ठेवा",
    "orContinueWith": "किंवा यासह सुरू ठेवा",
    "signingIn": "साइन इन होत आहे...",
    "signingUp": "साइन अप होत आहे...",
    "errors": {
      "invalidEmail": "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
      "invalidPassword": "पासवर्ड किमान 8 अक्षरे असणे आवश्यक आहे",
      "passwordMismatch": "पासवर्ड जुळत नाहीत",
      "emailInUse": "हा ईमेल आधीच वापरात आहे",
      "invalidCredentials": "अवैध ईमेल किंवा पासवर्ड",
      "generic": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा"
    }
  },
  "actions": {
    "save": "जतन करा",
    "cancel": "रद्द करा",
    "delete": "हटवा",
    "edit": "संपादित करा",
    "add": "जोडा",
    "remove": "काढा",
    "confirm": "पुष्टी करा",
    "back": "मागे",
    "next": "पुढे",
    "finish": "समाप्त",
    "skip": "वगळा",
    "close": "बंद करा",
    "search": "शोधा",
    "filter": "फिल्टर",
    "sort": "क्रमवारी लावा",
    "refresh": "रिफ्रेश करा",
    "loading": "लोड होत आहे...",
    "submit": "सबमिट करा",
    "continue": "सुरू ठेवा",
    "done": "पूर्ण",
    "apply": "लागू करा",
    "clear": "साफ करा",
    "selectAll": "सर्व निवडा",
    "deselectAll": "सर्व निवड रद्द करा",
    "expandAll": "सर्व विस्तृत करा",
    "collapseAll": "सर्व संकुचित करा"
  },
  "emptyState": {
    "noFriends": {
      "title": "अजून मित्र नाहीत",
      "description": "तुमचा पहिला मित्र जोडून सुरुवात करा",
      "action": "मित्र जोडा"
    },
    "noResults": {
      "title": "परिणाम नाहीत",
      "description": "तुमच्या शोध निकषांशी काहीही जुळत नाही",
      "action": "फिल्टर साफ करा"
    },
    "noNotifications": {
      "title": "सूचना नाहीत",
      "description": "तुम्ही सर्व पाहिले आहे!",
      "action": "रिफ्रेश करा"
    },
    "noActivity": {
      "title": "क्रियाकलाप नाही",
      "description": "तुमची अलीकडील क्रियाकलाप येथे दिसेल",
      "action": "सुरू करा"
    }
  },
  "dashboard": {
    "title": "डॅशबोर्ड",
    "welcome": "स्वागत आहे, {{name}}",
    "overview": "विहंगावलोकन",
    "recentActivity": "अलीकडील क्रियाकलाप",
    "quickActions": "जलद क्रिया",
    "stats": {
      "totalFriends": "एकूण मित्र",
      "innerCircle": "आंतरिक वर्तुळ",
      "needsAttention": "लक्ष आवश्यक",
      "lastContact": "शेवटचा संपर्क"
    },
    "widgets": {
      "upcomingBirthdays": "आगामी वाढदिवस",
      "recentContacts": "अलीकडील संपर्क",
      "suggestedActions": "सुचवलेल्या क्रिया"
    }
  },
  "mission": {
    "title": "मिशन",
    "subtitle": "महत्त्वाच्या नातेसंबंधांशी जोडलेले राहा",
    "description": "मिशन तुम्हाला मित्रांशी संपर्कात राहण्यास मदत करतात",
    "complete": "मिशन पूर्ण करा",
    "skip": "मिशन वगळा",
    "remind": "मला नंतर आठवण करून द्या",
    "empty": {
      "title": "सक्रिय मिशन नाहीत",
      "description": "तुम्ही सर्व केले आहे! नवीन मिशन लवकरच येतील."
    },
    "types": {
      "call": "कॉल मिशन",
      "message": "संदेश मिशन",
      "meetup": "भेट मिशन",
      "birthday": "वाढदिवस मिशन",
      "checkin": "चेक-इन मिशन"
    }
  },
  "tending": {
    "title": "मित्रांची काळजी घेणे",
    "subtitle": "नातेसंबंध बागेसारखे आहेत - त्यांना नियमित काळजी आवश्यक आहे",
    "description": "संपर्क करण्याची वेळ आलेले मित्र",
    "actions": {
      "markContacted": "संपर्क केला म्हणून चिन्हांकित करा",
      "snooze": "स्नूझ करा",
      "viewProfile": "प्रोफाइल पहा"
    },
    "filters": {
      "all": "सर्व",
      "overdue": "मुदत संपलेले",
      "upcoming": "आगामी",
      "byTier": "स्तरानुसार"
    },
    "frequency": {
      "daily": "दररोज",
      "weekly": "साप्ताहिक",
      "biweekly": "पंधरवडा",
      "monthly": "मासिक",
      "quarterly": "त्रैमासिक",
      "yearly": "वार्षिक"
    },
    "status": {
      "onTrack": "योग्य मार्गावर",
      "dueSoon": "लवकरच येणार",
      "overdue": "मुदत संपलेले",
      "needsAttention": "लक्ष आवश्यक"
    },
    "reminderTypes": {
      "call": "कॉल",
      "text": "संदेश",
      "visit": "भेट",
      "email": "ईमेल"
    },
    "lastContact": "शेवटचा संपर्क",
    "contactDue": "संपर्क देय",
    "noContactYet": "अजून संपर्क नाही",
    "daysOverdue": "{{count}} दिवस मुदत संपलेले",
    "dueIn": "{{count}} दिवसांत देय"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "सर्वात गरजेच्या वेळी तुमच्या विश्वासार्ह वर्तुळापर्यंत पोहोचा",
    "description": "आपत्कालीन नेटवर्क म्हणजे विश्वासार्ह संपर्क जे संकटात मदत करू शकतात",
    "activate": "SOS सक्रिय करा",
    "deactivate": "SOS निष्क्रिय करा",
    "status": {
      "active": "SOS सक्रिय",
      "inactive": "SOS निष्क्रिय",
      "pending": "प्रतीक्षेत..."
    },
    "contacts": {
      "title": "आपत्कालीन संपर्क",
      "add": "आपत्कालीन संपर्क जोडा",
      "remove": "आपत्कालीन यादीतून काढा",
      "empty": "अजून आपत्कालीन संपर्क सेट केले नाहीत"
    },
    "message": {
      "title": "आपत्कालीन संदेश",
      "placeholder": "तुमच्या नेटवर्कला पाठवला जाणारा संदेश प्रविष्ट करा",
      "default": "मला मदत हवी आहे. शक्य असल्यास कृपया संपर्क करा."
    },
    "settings": {
      "title": "SOS सेटिंग्ज",
      "autoLocation": "स्वयंचलितपणे स्थान शेअर करा",
      "confirmActivation": "सक्रिय करण्यापूर्वी पुष्टी करा",
      "cooldown": "सक्रियणांमधील कूलडाउन"
    }
  },
  "callActions": {
    "call": "कॉल करा",
    "video": "व्हिडिओ कॉल",
    "message": "संदेश पाठवा",
    "email": "ईमेल पाठवा",
    "directions": "दिशानिर्देश",
    "schedule": "वेळापत्रक करा",
    "addNote": "टीप जोडा",
    "recordCall": "कॉल रेकॉर्ड करा",
    "shareContact": "संपर्क शेअर करा"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend मध्ये स्वागत",
      "subtitle": "अर्थपूर्ण संबंध व्यवस्थापित करायला सुरुवात करूया",
      "description": "तुमचा आंतरिक वर्तुळ अनुभव सानुकूलित करण्यासाठी आम्ही काही प्रश्न विचारू"
    },
    "steps": {
      "profile": "प्रोफाइल तयार करा",
      "import": "संपर्क आयात करा",
      "categorize": "मित्रांना वर्गीकृत करा",
      "preferences": "प्राधान्ये"
    },
    "import": {
      "title": "संपर्क आयात करा",
      "description": "तुमचे विद्यमान संपर्क आयात करून सुरुवात करा",
      "fromPhone": "फोन संपर्कांवरून",
      "fromGoogle": "Google संपर्कांवरून",
      "manual": "मॅन्युअली जोडा",
      "skip": "आत्ता वगळा"
    },
    "complete": {
      "title": "सर्व तयार!",
      "subtitle": "तुम्ही तुमचे आंतरिक वर्तुळ व्यवस्थापित करायला तयार आहात",
      "action": "डॅशबोर्डवर जा"
    }
  },
  "keysShared": {
    "title": "शेअर केलेल्या किल्ल्या",
    "subtitle": "तुमच्या विश्वास वर्तुळाचा प्रवेश व्यवस्थापित करा",
    "description": "आपत्कालीन परिस्थितीत तुमच्या आंतरिक वर्तुळाचा प्रवेश कोणाला आहे ते व्यवस्थापित करा",
    "grant": "किल्ली द्या",
    "revoke": "किल्ली रद्द करा",
    "manage": "शेअर केलेल्या किल्ल्या व्यवस्थापित करा",
    "permissions": {
      "view": "संपर्क पहा",
      "contact": "आपत्कालीन परिस्थितीत संपर्क करू शकतात",
      "location": "स्थान प्रवेश"
    },
    "doorKeyTree": {
      "title": "दार किल्ली वृक्ष",
      "description": "आपत्कालीन परिस्थितीत तुमच्या आंतरिक वर्तुळाचा प्रवेश असलेले विश्वासार्ह लोक",
      "empty": "अजून किल्ल्या शेअर केल्या नाहीत"
    },
    "shareRequest": {
      "title": "किल्ली विनंती",
      "pending": "प्रलंबित विनंत्या",
      "accept": "स्वीकारा",
      "decline": "नाकारा"
    },
    "sharedWithYou": "तुमच्यासोबत शेअर केलेल्या किल्ल्या",
    "sharedByYou": "तुम्ही शेअर केलेल्या किल्ल्या",
    "noSharedKeys": "अजून किल्ल्या शेअर केल्या नाहीत",
    "expiresAt": "कालबाह्य: {{date}}",
    "neverExpires": "कधीही कालबाह्य होत नाही"
  },
  "reserved": {
    "title": "राखीव विभाग",
    "description": "हे वैशिष्ट्य प्रीमियम वापरकर्त्यांसाठी राखीव आहे",
    "upgrade": "अनलॉक करण्यासाठी अपग्रेड करा"
  },
  "addLinkedFriend": {
    "title": "लिंक केलेला मित्र जोडा",
    "subtitle": "आधीच InnerFriend वापरत असलेल्या मित्रांशी कनेक्ट व्हा",
    "description": "खाली तुमचा कोड शेअर करा किंवा मित्राचा कोड स्कॅन करा",
    "searchPlaceholder": "नाव किंवा ईमेलने शोधा",
    "noResults": "वापरकर्ते सापडले नाहीत",
    "sendRequest": "कनेक्शन विनंती पाठवा",
    "pending": "विनंती प्रलंबित",
    "connected": "कनेक्ट झाले",
    "yourCode": "तुमचा कोड",
    "scanCode": "कोड स्कॅन करा",
    "enterCode": "कोड प्रविष्ट करा",
    "shareCode": "कोड शेअर करा"
  },
  "gdpr": {
    "title": "डेटा गोपनीयता",
    "subtitle": "आम्ही तुमचा वैयक्तिक डेटा कसा गोळा करतो, वापरतो आणि संरक्षित करतो ते जाणून घ्या",
    "consent": {
      "title": "संमती व्यवस्थापन",
      "description": "तुमची डेटा प्रक्रिया संमती व्यवस्थापित करा",
      "analytics": "अॅनालिटिक्स कुकीज",
      "marketing": "मार्केटिंग संवाद",
      "thirdParty": "तृतीय-पक्ष शेअरिंग",
      "withdraw": "संमती मागे घ्या"
    },
    "rights": {
      "title": "तुमचे अधिकार",
      "access": "डेटा प्रवेश",
      "rectification": "डेटा दुरुस्ती",
      "erasure": "डेटा हटवणे",
      "portability": "डेटा पोर्टेबिलिटी",
      "restriction": "प्रक्रिया निर्बंध",
      "objection": "प्रक्रियेवर आक्षेप"
    },
    "export": {
      "title": "डेटा निर्यात करा",
      "description": "तुमच्या सर्व वैयक्तिक डेटाची प्रत डाउनलोड करा",
      "button": "डेटा निर्यात करा",
      "processing": "निर्यात तयार होत आहे...",
      "ready": "डेटा डाउनलोडसाठी तयार"
    },
    "delete": {
      "title": "खाते हटवा",
      "description": "तुमचे खाते आणि सर्व संबंधित डेटा कायमचे हटवा. ही क्रिया पूर्ववत करता येणार नाही.",
      "button": "खाते हटवा",
      "confirm": "पुष्टी करण्यासाठी 'हटवा' टाइप करा",
      "warning": "ही क्रिया पूर्ववत करता येणार नाही"
    },
    "policy": {
      "title": "गोपनीयता धोरण",
      "lastUpdated": "शेवटचे अद्यतन",
      "readFull": "संपूर्ण धोरण वाचा"
    }
  },
  "admin": {
    "title": "प्रशासक पॅनेल",
    "dashboard": "प्रशासक डॅशबोर्ड",
    "users": {
      "title": "वापरकर्ता व्यवस्थापन",
      "list": "सर्व वापरकर्ते",
      "active": "सक्रिय वापरकर्ते",
      "suspended": "निलंबित वापरकर्ते",
      "invite": "वापरकर्त्याला आमंत्रित करा"
    },
    "settings": {
      "title": "सिस्टम सेटिंग्ज",
      "general": "सामान्य सेटिंग्ज",
      "security": "सुरक्षा सेटिंग्ज",
      "notifications": "सूचना सेटिंग्ज"
    },
    "logs": {
      "title": "सिस्टम लॉग्ज",
      "audit": "ऑडिट लॉग्ज",
      "error": "त्रुटी लॉग्ज",
      "access": "प्रवेश लॉग्ज"
    },
    "analytics": {
      "title": "अॅनालिटिक्स",
      "overview": "विहंगावलोकन",
      "users": "वापरकर्ता अॅनालिटिक्स",
      "engagement": "सहभाग मेट्रिक्स"
    }
  },
  "dev": {
    "title": "डेव्हलपर सेटिंग्ज",
    "apiKeys": "API किल्ल्या",
    "webhooks": "वेबहुक्स",
    "logs": "डेव्हलपर लॉग्ज",
    "testing": "टेस्टिंग मोड",
    "documentation": "API दस्तऐवजीकरण"
  },
  "contactMethods": {
    "title": "संपर्क पद्धती",
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
    "other": "इतर",
    "preferred": "पसंतीची पद्धत",
    "add": "संपर्क पद्धत जोडा",
    "primary": "प्राथमिक",
    "secondary": "दुय्यम"
  },
  "post": {
    "title": "पोस्ट तयार करा",
    "placeholder": "तुम्ही काय विचार करत आहात?",
    "submit": "पोस्ट करा",
    "visibility": {
      "public": "सार्वजनिक",
      "friends": "फक्त मित्र",
      "private": "खाजगी"
    },
    "actions": {
      "like": "आवडले",
      "comment": "टिप्पणी",
      "share": "शेअर करा",
      "save": "जतन करा"
    }
  },
  "parasocial": {
    "title": "क्रिएटर्सना फॉलो करा",
    "subtitle": "तुमच्या आवडत्या क्रिएटर्सशी कनेक्ट व्हा",
    "description": "तुमच्या आवडत्या क्रिएटर्सना फॉलो करा आणि त्यांचे अद्यतने मिळवा",
    "follow": "फॉलो करा",
    "unfollow": "अनफॉलो करा",
    "following": "फॉलो करत आहे",
    "followers": "फॉलोअर्स",
    "noCreators": "क्रिएटर्स सापडले नाहीत"
  },
  "profileSettings": {
    "title": "प्रोफाइल सेटिंग्ज",
    "personalInfo": "वैयक्तिक माहिती",
    "displayName": "प्रदर्शन नाव",
    "bio": "बायो",
    "avatar": "अवतार",
    "changeAvatar": "अवतार बदला",
    "removeAvatar": "अवतार काढा",
    "privacy": {
      "title": "गोपनीयता सेटिंग्ज",
      "profileVisibility": "प्रोफाइल दृश्यता",
      "showOnline": "ऑनलाइन स्थिती दाखवा",
      "showLastSeen": "शेवटचे पाहिले दाखवा"
    },
    "notifications": {
      "title": "सूचना सेटिंग्ज",
      "email": "ईमेल सूचना",
      "push": "पुश सूचना",
      "sms": "SMS सूचना"
    },
    "account": {
      "title": "खाते सेटिंग्ज",
      "changePassword": "पासवर्ड बदला",
      "twoFactor": "दोन-घटक प्रमाणीकरण",
      "sessions": "सक्रिय सत्रे",
      "deleteAccount": "खाते हटवा"
    }
  },
  "editFriend": {
    "title": "मित्र संपादित करा",
    "basicInfo": "मूलभूत माहिती",
    "name": "नाव",
    "nickname": "टोपणनाव",
    "birthday": "वाढदिवस",
    "notes": "टिपा",
    "tier": "स्तर",
    "contactFrequency": "संपर्क वारंवारता",
    "save": "बदल जतन करा",
    "delete": "मित्र हटवा",
    "confirmDelete": "तुम्हाला खात्री आहे की तुम्ही हा मित्र हटवू इच्छिता?"
  },
  "followCreator": {
    "title": "क्रिएटरला फॉलो करा",
    "search": "क्रिएटर्स शोधा",
    "suggested": "तुमच्यासाठी सुचवलेले",
    "categories": "श्रेण्या",
    "trending": "ट्रेंडिंग"
  },
  "dispatch": {
    "validation": {
      "required": "हे फील्ड आवश्यक आहे",
      "invalidEmail": "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
      "invalidPhone": "कृपया वैध फोन नंबर प्रविष्ट करा",
      "minLength": "किमान {{min}} अक्षरे असणे आवश्यक आहे",
      "maxLength": "{{max}} अक्षरांपेक्षा जास्त असू शकत नाही",
      "passwordMatch": "पासवर्ड जुळले पाहिजेत",
      "invalidUrl": "कृपया वैध URL प्रविष्ट करा",
      "invalidDate": "कृपया वैध तारीख प्रविष्ट करा",
      "futureDate": "तारीख भविष्यात असणे आवश्यक आहे",
      "pastDate": "तारीख भूतकाळात असणे आवश्यक आहे"
    }
  },
  "privacy": {
    "title": "गोपनीयता धोरण",
    "lastUpdated": "शेवटचे अद्यतन: {{date}}",
    "sections": {
      "collection": {
        "title": "माहिती संकलन",
        "description": "आम्ही कोणती माहिती कशी गोळा करतो"
      },
      "usage": {
        "title": "माहिती वापर",
        "description": "गोळा केलेली माहिती आम्ही कशी वापरतो"
      },
      "sharing": {
        "title": "माहिती शेअरिंग",
        "description": "तुमची माहिती कधी आणि कोणाशी शेअर करतो"
      },
      "security": {
        "title": "डेटा सुरक्षा",
        "description": "तुमची माहिती आम्ही कशी संरक्षित करतो"
      },
      "rights": {
        "title": "तुमचे अधिकार",
        "description": "वैयक्तिक डेटाबाबत तुमचे अधिकार"
      },
      "cookies": {
        "title": "कुकीज आणि ट्रॅकिंग",
        "description": "कुकीज आणि समान तंत्रज्ञानाचा आमचा वापर"
      },
      "children": {
        "title": "मुलांची गोपनीयता",
        "description": "मुलांच्या गोपनीयतेबद्दल आमचे धोरण"
      },
      "changes": {
        "title": "धोरण बदल",
        "description": "या धोरणातील बदलांबद्दल आम्ही कसे कळवतो"
      },
      "contact": {
        "title": "आमच्याशी संपर्क साधा",
        "description": "गोपनीयता प्रश्नांसाठी संपर्क साधा"
      }
    }
  },
  "terms": {
    "title": "सेवा अटी",
    "lastUpdated": "शेवटचे अद्यतन: {{date}}",
    "sections": {
      "acceptance": {
        "title": "अटींची स्वीकृती",
        "description": "InnerFriend वापरून, तुम्ही या अटी स्वीकारता"
      },
      "eligibility": {
        "title": "पात्रता",
        "description": "आमच्या सेवा वापरण्यासाठी आवश्यकता"
      },
      "accounts": {
        "title": "वापरकर्ता खाती",
        "description": "तुमच्या खात्यासाठी तुमच्या जबाबदाऱ्या"
      },
      "content": {
        "title": "वापरकर्ता सामग्री",
        "description": "तुम्ही सबमिट केलेल्या सामग्रीबद्दलचे नियम"
      },
      "prohibited": {
        "title": "प्रतिबंधित क्रियाकलाप",
        "description": "आमच्या प्लॅटफॉर्मवर काय प्रतिबंधित आहे"
      },
      "intellectual": {
        "title": "बौद्धिक संपदा",
        "description": "कॉपीराइट आणि ट्रेडमार्कबद्दल माहिती"
      },
      "disclaimers": {
        "title": "अस्वीकृती",
        "description": "InnerFriend कोणत्याही हमींशिवाय 'जसे आहे तसे' प्रदान केले जाते"
      },
      "liability": {
        "title": "दायित्व मर्यादा",
        "description": "आमच्या दायित्वावरील मर्यादा"
      },
      "termination": {
        "title": "समाप्ती",
        "description": "खाती कधी समाप्त केली जाऊ शकतात"
      },
      "governing": {
        "title": "शासकीय कायदा",
        "description": "या अटींना लागू होणारे कायदे"
      },
      "contact": {
        "title": "आमच्याशी संपर्क साधा",
        "description": "या अटींबद्दल प्रश्नांसाठी संपर्क साधा"
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

const localePath = path.join(__dirname, '../public/locales/mr/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, marathiTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: mr');
console.log('Done! Marathi translations applied.');
