const fs = require('fs');
const path = require('path');

const teluguTranslations = {
  "landing": {
    "hero": {
      "title": "నిజంగా ముఖ్యమైన వారితో కనెక్ట్ అవ్వండి",
      "subtitle": "InnerFriend మీ సన్నిహిత సంబంధాలను నిర్వహించడానికి మరియు మీరు శ్రద్ధ వహించే వారితో కనెక్ట్ అయి ఉండటానికి సహాయపడుతుంది",
      "cta": "ప్రారంభించండి",
      "learnMore": "మరింత తెలుసుకోండి"
    },
    "features": {
      "title": "ఫీచర్లు",
      "organize": {
        "title": "స్నేహితులను వ్యవస్థీకరించండి",
        "description": "మీ సన్నిహిత స్నేహితులను సంబంధ రకం మరియు సాన్నిహిత్యం ఆధారంగా స్థాయిల్లో వర్గీకరించండి"
      },
      "remind": {
        "title": "కనెక్ట్ అయి ఉండండి",
        "description": "సంబంధాలను కొనసాగించడానికి చాలా కాలం అయినప్పుడు రిమైండర్లు పొందండి"
      },
      "emergency": {
        "title": "అత్యవసర నెట్‌వర్క్",
        "description": "అత్యవసర సమయంలో సంప్రదించడానికి నమ్మకమైన సర్కిల్‌ను నిర్మించండి"
      }
    },
    "privacy": {
      "title": "గోప్యత మొదట",
      "description": "మీ డేటా మీది. మీ సోషల్ గ్రాఫ్‌పై పూర్తి నియంత్రణను కొనసాగించండి."
    },
    "cta": {
      "title": "మీ ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?",
      "subtitle": "ఈ రోజే InnerFriend తో అర్థవంతమైన సంబంధాలను నిర్మించడం ప్రారంభించండి",
      "button": "ఉచితంగా ప్రారంభించండి"
    }
  },
  "auth": {
    "signIn": "సైన్ ఇన్",
    "signUp": "సైన్ అప్",
    "signOut": "సైన్ అవుట్",
    "email": "ఇమెయిల్",
    "password": "పాస్‌వర్డ్",
    "confirmPassword": "పాస్‌వర్డ్ నిర్ధారించండి",
    "forgotPassword": "పాస్‌వర్డ్ మర్చిపోయారా?",
    "resetPassword": "పాస్‌వర్డ్ రీసెట్ చేయండి",
    "noAccount": "ఖాతా లేదా?",
    "hasAccount": "ఇప్పటికే ఖాతా ఉందా?",
    "continueWith": "{{provider}} తో కొనసాగించండి",
    "orContinueWith": "లేదా దీనితో కొనసాగించండి",
    "signingIn": "సైన్ ఇన్ అవుతోంది...",
    "signingUp": "సైన్ అప్ అవుతోంది...",
    "errors": {
      "invalidEmail": "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి",
      "invalidPassword": "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి",
      "passwordMismatch": "పాస్‌వర్డ్‌లు సరిపోలడం లేదు",
      "emailInUse": "ఈ ఇమెయిల్ ఇప్పటికే వాడుకలో ఉంది",
      "invalidCredentials": "చెల్లని ఇమెయిల్ లేదా పాస్‌వర్డ్",
      "generic": "ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి"
    }
  },
  "actions": {
    "save": "సేవ్ చేయండి",
    "cancel": "రద్దు చేయండి",
    "delete": "తొలగించండి",
    "edit": "సవరించండి",
    "add": "జోడించండి",
    "remove": "తీసివేయండి",
    "confirm": "నిర్ధారించండి",
    "back": "వెనుకకు",
    "next": "తదుపరి",
    "finish": "ముగించు",
    "skip": "దాటవేయి",
    "close": "మూసివేయండి",
    "search": "వెతకండి",
    "filter": "ఫిల్టర్",
    "sort": "క్రమబద్ధీకరించు",
    "refresh": "రిఫ్రెష్",
    "loading": "లోడ్ అవుతోంది...",
    "submit": "సమర్పించండి",
    "continue": "కొనసాగించండి",
    "done": "పూర్తయింది",
    "apply": "వర్తింపజేయండి",
    "clear": "క్లియర్ చేయండి",
    "selectAll": "అన్నీ ఎంచుకోండి",
    "deselectAll": "అన్నీ ఎంపిక తీసివేయండి",
    "expandAll": "అన్నీ విస్తరించండి",
    "collapseAll": "అన్నీ కుదించండి"
  },
  "emptyState": {
    "noFriends": {
      "title": "ఇంకా స్నేహితులు లేరు",
      "description": "మీ మొదటి స్నేహితుడిని జోడించడం ద్వారా ప్రారంభించండి",
      "action": "స్నేహితుడిని జోడించండి"
    },
    "noResults": {
      "title": "ఫలితాలు లేవు",
      "description": "మీ శోధన ప్రమాణాలకు ఏమీ సరిపోలడం లేదు",
      "action": "ఫిల్టర్లు క్లియర్ చేయండి"
    },
    "noNotifications": {
      "title": "నోటిఫికేషన్లు లేవు",
      "description": "మీరు అన్నీ చూశారు!",
      "action": "రిఫ్రెష్"
    },
    "noActivity": {
      "title": "కార్యాచరణ లేదు",
      "description": "మీ ఇటీవలి కార్యాచరణ ఇక్కడ కనిపిస్తుంది",
      "action": "ప్రారంభించండి"
    }
  },
  "dashboard": {
    "title": "డాష్‌బోర్డ్",
    "welcome": "స్వాగతం, {{name}}",
    "overview": "అవలోకనం",
    "recentActivity": "ఇటీవలి కార్యాచరణ",
    "quickActions": "త్వరిత చర్యలు",
    "stats": {
      "totalFriends": "మొత్తం స్నేహితులు",
      "innerCircle": "అంతర్గత సర్కిల్",
      "needsAttention": "శ్రద్ధ అవసరం",
      "lastContact": "చివరి సంప్రదింపు"
    },
    "widgets": {
      "upcomingBirthdays": "రాబోయే పుట్టినరోజులు",
      "recentContacts": "ఇటీవలి సంప్రదింపులు",
      "suggestedActions": "సూచించిన చర్యలు"
    }
  },
  "mission": {
    "title": "మిషన్",
    "subtitle": "ముఖ్యమైన సంబంధాలతో కనెక్ట్ అయి ఉండండి",
    "description": "మిషన్లు మీ స్నేహితులతో సంప్రదింపులో ఉండటానికి సహాయపడతాయి",
    "complete": "మిషన్ పూర్తి చేయండి",
    "skip": "మిషన్ దాటవేయండి",
    "remind": "తర్వాత గుర్తు చేయండి",
    "empty": {
      "title": "యాక్టివ్ మిషన్లు లేవు",
      "description": "మీరు అన్నీ పూర్తి చేసారు! కొత్త మిషన్లు త్వరలో వస్తాయి."
    },
    "types": {
      "call": "కాల్ మిషన్",
      "message": "మెసేజ్ మిషన్",
      "meetup": "మీటప్ మిషన్",
      "birthday": "పుట్టినరోజు మిషన్",
      "checkin": "చెక్-ఇన్ మిషన్"
    }
  },
  "tending": {
    "title": "స్నేహితులను సంరక్షించడం",
    "subtitle": "సంబంధాలు తోటలాంటివి - వాటికి క్రమం తప్పకుండా సంరక్షణ అవసరం",
    "description": "సంప్రదించవలసిన స్నేహితులు",
    "actions": {
      "markContacted": "సంప్రదించినట్లు గుర్తించండి",
      "snooze": "స్నూజ్",
      "viewProfile": "ప్రొఫైల్ చూడండి"
    },
    "filters": {
      "all": "అన్నీ",
      "overdue": "గడువు మించింది",
      "upcoming": "రాబోయే",
      "byTier": "స్థాయి ప్రకారం"
    },
    "frequency": {
      "daily": "రోజువారీ",
      "weekly": "వారానికొకసారి",
      "biweekly": "రెండు వారాలకొకసారి",
      "monthly": "నెలవారీ",
      "quarterly": "త్రైమాసిక",
      "yearly": "వార్షిక"
    },
    "status": {
      "onTrack": "సరైన మార్గంలో",
      "dueSoon": "త్వరలో రావాలి",
      "overdue": "గడువు మించింది",
      "needsAttention": "శ్రద్ధ అవసరం"
    },
    "reminderTypes": {
      "call": "కాల్",
      "text": "టెక్స్ట్",
      "visit": "సందర్శన",
      "email": "ఇమెయిల్"
    },
    "lastContact": "చివరి సంప్రదింపు",
    "contactDue": "సంప్రదింపు గడువు",
    "noContactYet": "ఇంకా సంప్రదింపు లేదు",
    "daysOverdue": "{{count}} రోజులు మించిపోయింది",
    "dueIn": "{{count}} రోజుల్లో"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "అత్యంత అవసరమైనప్పుడు మీ నమ్మకమైన సర్కిల్‌ను చేరుకోండి",
    "description": "అత్యవసర నెట్‌వర్క్ అనేది సంక్షోభంలో సహాయం చేయగల నమ్మకమైన సంప్రదింపులు",
    "activate": "SOS యాక్టివేట్ చేయండి",
    "deactivate": "SOS డీయాక్టివేట్ చేయండి",
    "status": {
      "active": "SOS యాక్టివ్",
      "inactive": "SOS ఇన్యాక్టివ్",
      "pending": "వేచి ఉంది..."
    },
    "contacts": {
      "title": "అత్యవసర సంప్రదింపులు",
      "add": "అత్యవసర సంప్రదింపు జోడించండి",
      "remove": "అత్యవసర జాబితా నుండి తీసివేయండి",
      "empty": "ఇంకా అత్యవసర సంప్రదింపులు సెట్ చేయలేదు"
    },
    "message": {
      "title": "అత్యవసర సందేశం",
      "placeholder": "మీ నెట్‌వర్క్‌కు పంపబడే సందేశాన్ని నమోదు చేయండి",
      "default": "నాకు సహాయం అవసరం. మీరు చేయగలిగితే సంప్రదించండి."
    },
    "settings": {
      "title": "SOS సెట్టింగ్‌లు",
      "autoLocation": "స్వయంచాలకంగా లొకేషన్ షేర్ చేయండి",
      "confirmActivation": "యాక్టివేట్ చేయడానికి ముందు నిర్ధారించండి",
      "cooldown": "యాక్టివేషన్ల మధ్య కూల్‌డౌన్"
    }
  },
  "callActions": {
    "call": "కాల్ చేయండి",
    "video": "వీడియో కాల్",
    "message": "మెసేజ్ పంపండి",
    "email": "ఇమెయిల్ పంపండి",
    "directions": "దిశలు",
    "schedule": "షెడ్యూల్ చేయండి",
    "addNote": "నోట్ జోడించండి",
    "recordCall": "కాల్ రికార్డ్ చేయండి",
    "shareContact": "సంప్రదింపు షేర్ చేయండి"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend కు స్వాగతం",
      "subtitle": "అర్థవంతమైన సంబంధాలను నిర్వహించడం ప్రారంభిద్దాం",
      "description": "మీ అంతర్గత సర్కిల్ అనుభవాన్ని అనుకూలీకరించడానికి మేము కొన్ని ప్రశ్నలు అడుగుతాము"
    },
    "steps": {
      "profile": "ప్రొఫైల్ సృష్టించండి",
      "import": "సంప్రదింపులు దిగుమతి చేయండి",
      "categorize": "స్నేహితులను వర్గీకరించండి",
      "preferences": "ప్రాధాన్యతలు"
    },
    "import": {
      "title": "సంప్రదింపులు దిగుమతి చేయండి",
      "description": "మీ ఇప్పటికే ఉన్న సంప్రదింపులను దిగుమతి చేసి ప్రారంభించండి",
      "fromPhone": "ఫోన్ సంప్రదింపుల నుండి",
      "fromGoogle": "Google సంప్రదింపుల నుండి",
      "manual": "మాన్యువల్‌గా జోడించండి",
      "skip": "ఇప్పుడు దాటవేయండి"
    },
    "complete": {
      "title": "అంతా సిద్ధం!",
      "subtitle": "మీ అంతర్గత సర్కిల్‌ను నిర్వహించడం ప్రారంభించడానికి మీరు సిద్ధంగా ఉన్నారు",
      "action": "డాష్‌బోర్డ్‌కు వెళ్ళండి"
    }
  },
  "keysShared": {
    "title": "షేర్ చేసిన కీలు",
    "subtitle": "మీ నమ్మకమైన సర్కిల్‌కు యాక్సెస్‌ను నిర్వహించండి",
    "description": "అత్యవసర పరిస్థితుల్లో మీ అంతర్గత సర్కిల్‌ను ఎవరు యాక్సెస్ చేయవచ్చో నిర్వహించండి",
    "grant": "కీ ఇవ్వండి",
    "revoke": "కీ రద్దు చేయండి",
    "manage": "షేర్ చేసిన కీలను నిర్వహించండి",
    "permissions": {
      "view": "సంప్రదింపులు చూడండి",
      "contact": "అత్యవసర సమయంలో సంప్రదించగలరు",
      "location": "లొకేషన్ యాక్సెస్"
    },
    "doorKeyTree": {
      "title": "డోర్ కీ ట్రీ",
      "description": "అత్యవసర పరిస్థితుల్లో మీ అంతర్గత సర్కిల్‌ను యాక్సెస్ చేయగల నమ్మకమైన వ్యక్తులు",
      "empty": "ఇంకా కీలు షేర్ చేయలేదు"
    },
    "shareRequest": {
      "title": "కీ అభ్యర్థన",
      "pending": "పెండింగ్ అభ్యర్థనలు",
      "accept": "అంగీకరించండి",
      "decline": "తిరస్కరించండి"
    },
    "sharedWithYou": "మీతో షేర్ చేసిన కీలు",
    "sharedByYou": "మీరు షేర్ చేసిన కీలు",
    "noSharedKeys": "ఇంకా కీలు షేర్ చేయలేదు",
    "expiresAt": "గడువు: {{date}}",
    "neverExpires": "ఎప్పటికీ గడువు తీరదు"
  },
  "reserved": {
    "title": "రిజర్వ్ చేసిన విభాగం",
    "description": "ఈ ఫీచర్ ప్రీమియం వినియోగదారుల కోసం రిజర్వ్ చేయబడింది",
    "upgrade": "అన్‌లాక్ చేయడానికి అప్‌గ్రేడ్ చేయండి"
  },
  "addLinkedFriend": {
    "title": "లింక్ చేసిన స్నేహితుడిని జోడించండి",
    "subtitle": "ఇప్పటికే InnerFriend వాడుతున్న స్నేహితులతో కనెక్ట్ అవ్వండి",
    "description": "మీ కోడ్‌ను క్రింద షేర్ చేయండి లేదా స్నేహితుడి కోడ్‌ను స్కాన్ చేయండి",
    "searchPlaceholder": "పేరు లేదా ఇమెయిల్ ద్వారా వెతకండి",
    "noResults": "వినియోగదారులు కనుగొనబడలేదు",
    "sendRequest": "కనెక్షన్ అభ్యర్థన పంపండి",
    "pending": "అభ్యర్థన పెండింగ్‌లో ఉంది",
    "connected": "కనెక్ట్ అయింది",
    "yourCode": "మీ కోడ్",
    "scanCode": "కోడ్ స్కాన్ చేయండి",
    "enterCode": "కోడ్ నమోదు చేయండి",
    "shareCode": "కోడ్ షేర్ చేయండి"
  },
  "gdpr": {
    "title": "డేటా గోప్యత",
    "subtitle": "మేము మీ వ్యక్తిగత డేటాను ఎలా సేకరిస్తాము, ఉపయోగిస్తాము మరియు రక్షిస్తాము అనే విషయాన్ని తెలుసుకోండి",
    "consent": {
      "title": "సమ్మతి నిర్వహణ",
      "description": "మీ డేటా ప్రాసెసింగ్ సమ్మతిని నిర్వహించండి",
      "analytics": "అనలిటిక్స్ కుక్కీలు",
      "marketing": "మార్కెటింగ్ కమ్యూనికేషన్లు",
      "thirdParty": "థర్డ్-పార్టీ షేరింగ్",
      "withdraw": "సమ్మతి ఉపసంహరించుకోండి"
    },
    "rights": {
      "title": "మీ హక్కులు",
      "access": "డేటా యాక్సెస్",
      "rectification": "డేటా సవరణ",
      "erasure": "డేటా తొలగింపు",
      "portability": "డేటా పోర్టబిలిటీ",
      "restriction": "ప్రాసెసింగ్ పరిమితి",
      "objection": "ప్రాసెసింగ్‌పై అభ్యంతరం"
    },
    "export": {
      "title": "డేటా ఎక్స్‌పోర్ట్ చేయండి",
      "description": "మీ అన్ని వ్యక్తిగత డేటా కాపీని డౌన్‌లోడ్ చేయండి",
      "button": "డేటా ఎక్స్‌పోర్ట్ చేయండి",
      "processing": "ఎక్స్‌పోర్ట్ సిద్ధమవుతోంది...",
      "ready": "డేటా డౌన్‌లోడ్ చేయడానికి సిద్ధంగా ఉంది"
    },
    "delete": {
      "title": "ఖాతా తొలగించండి",
      "description": "మీ ఖాతా మరియు అన్ని సంబంధిత డేటాను శాశ్వతంగా తొలగించండి. ఈ చర్యను అన్‌డూ చేయలేరు.",
      "button": "ఖాతా తొలగించండి",
      "confirm": "నిర్ధారించడానికి 'తొలగించు' టైప్ చేయండి",
      "warning": "ఈ చర్యను అన్‌డూ చేయలేరు"
    },
    "policy": {
      "title": "గోప్యతా విధానం",
      "lastUpdated": "చివరిగా నవీకరించబడింది",
      "readFull": "పూర్తి విధానం చదవండి"
    }
  },
  "admin": {
    "title": "అడ్మిన్ ప్యానెల్",
    "dashboard": "అడ్మిన్ డాష్‌బోర్డ్",
    "users": {
      "title": "వినియోగదారు నిర్వహణ",
      "list": "అన్ని వినియోగదారులు",
      "active": "యాక్టివ్ వినియోగదారులు",
      "suspended": "సస్పెండ్ చేసిన వినియోగదారులు",
      "invite": "వినియోగదారుని ఆహ్వానించండి"
    },
    "settings": {
      "title": "సిస్టమ్ సెట్టింగ్‌లు",
      "general": "సాధారణ సెట్టింగ్‌లు",
      "security": "సెక్యూరిటీ సెట్టింగ్‌లు",
      "notifications": "నోటిఫికేషన్ సెట్టింగ్‌లు"
    },
    "logs": {
      "title": "సిస్టమ్ లాగ్‌లు",
      "audit": "ఆడిట్ లాగ్‌లు",
      "error": "ఎర్రర్ లాగ్‌లు",
      "access": "యాక్సెస్ లాగ్‌లు"
    },
    "analytics": {
      "title": "అనలిటిక్స్",
      "overview": "అవలోకనం",
      "users": "వినియోగదారు అనలిటిక్స్",
      "engagement": "ఎంగేజ్‌మెంట్ మెట్రిక్స్"
    }
  },
  "dev": {
    "title": "డెవలపర్ సెట్టింగ్‌లు",
    "apiKeys": "API కీలు",
    "webhooks": "వెబ్‌హుక్స్",
    "logs": "డెవలపర్ లాగ్‌లు",
    "testing": "టెస్టింగ్ మోడ్",
    "documentation": "API డాక్యుమెంటేషన్"
  },
  "contactMethods": {
    "title": "సంప్రదింపు పద్ధతులు",
    "phone": "ఫోన్",
    "email": "ఇమెయిల్",
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
    "other": "ఇతర",
    "preferred": "ప్రాధాన్య పద్ధతి",
    "add": "సంప్రదింపు పద్ధతి జోడించండి",
    "primary": "ప్రాథమిక",
    "secondary": "ద్వితీయ"
  },
  "post": {
    "title": "పోస్ట్ సృష్టించండి",
    "placeholder": "మీరు ఏమి ఆలోచిస్తున్నారు?",
    "submit": "పోస్ట్ చేయండి",
    "visibility": {
      "public": "పబ్లిక్",
      "friends": "స్నేహితులు మాత్రమే",
      "private": "ప్రైవేట్"
    },
    "actions": {
      "like": "లైక్",
      "comment": "కామెంట్",
      "share": "షేర్",
      "save": "సేవ్"
    }
  },
  "parasocial": {
    "title": "క్రియేటర్లను ఫాలో అవ్వండి",
    "subtitle": "మీ ఇష్టమైన క్రియేటర్లతో కనెక్ట్ అవ్వండి",
    "description": "మీ ఇష్టమైన క్రియేటర్లను ఫాలో అవ్వండి మరియు వారి అప్‌డేట్‌లను పొందండి",
    "follow": "ఫాలో అవ్వండి",
    "unfollow": "అన్‌ఫాలో అవ్వండి",
    "following": "ఫాలో అవుతున్నారు",
    "followers": "ఫాలోవర్లు",
    "noCreators": "క్రియేటర్లు కనుగొనబడలేదు"
  },
  "profileSettings": {
    "title": "ప్రొఫైల్ సెట్టింగ్‌లు",
    "personalInfo": "వ్యక్తిగత సమాచారం",
    "displayName": "డిస్‌ప్లే పేరు",
    "bio": "బయో",
    "avatar": "అవతార్",
    "changeAvatar": "అవతార్ మార్చండి",
    "removeAvatar": "అవతార్ తీసివేయండి",
    "privacy": {
      "title": "గోప్యతా సెట్టింగ్‌లు",
      "profileVisibility": "ప్రొఫైల్ విజిబిలిటీ",
      "showOnline": "ఆన్‌లైన్ స్టేటస్ చూపించండి",
      "showLastSeen": "చివరిగా చూసిన సమయం చూపించండి"
    },
    "notifications": {
      "title": "నోటిఫికేషన్ సెట్టింగ్‌లు",
      "email": "ఇమెయిల్ నోటిఫికేషన్లు",
      "push": "పుష్ నోటిఫికేషన్లు",
      "sms": "SMS నోటిఫికేషన్లు"
    },
    "account": {
      "title": "ఖాతా సెట్టింగ్‌లు",
      "changePassword": "పాస్‌వర్డ్ మార్చండి",
      "twoFactor": "టూ-ఫ్యాక్టర్ అథెంటికేషన్",
      "sessions": "యాక్టివ్ సెషన్లు",
      "deleteAccount": "ఖాతా తొలగించండి"
    }
  },
  "editFriend": {
    "title": "స్నేహితుడిని సవరించండి",
    "basicInfo": "ప్రాథమిక సమాచారం",
    "name": "పేరు",
    "nickname": "మారుపేరు",
    "birthday": "పుట్టినరోజు",
    "notes": "నోట్స్",
    "tier": "స్థాయి",
    "contactFrequency": "సంప్రదింపు ఫ్రీక్వెన్సీ",
    "save": "మార్పులను సేవ్ చేయండి",
    "delete": "స్నేహితుడిని తొలగించండి",
    "confirmDelete": "మీరు ఈ స్నేహితుడిని తొలగించాలనుకుంటున్నారా?"
  },
  "followCreator": {
    "title": "క్రియేటర్‌ను ఫాలో అవ్వండి",
    "search": "క్రియేటర్లను వెతకండి",
    "suggested": "మీకు సూచించినవి",
    "categories": "వర్గాలు",
    "trending": "ట్రెండింగ్"
  },
  "dispatch": {
    "validation": {
      "required": "ఈ ఫీల్డ్ అవసరం",
      "invalidEmail": "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి",
      "invalidPhone": "దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ నమోదు చేయండి",
      "minLength": "కనీసం {{min}} అక్షరాలు ఉండాలి",
      "maxLength": "{{max}} అక్షరాలకు మించకూడదు",
      "passwordMatch": "పాస్‌వర్డ్‌లు సరిపోలాలి",
      "invalidUrl": "దయచేసి చెల్లుబాటు అయ్యే URL నమోదు చేయండి",
      "invalidDate": "దయచేసి చెల్లుబాటు అయ్యే తేదీని నమోదు చేయండి",
      "futureDate": "తేదీ భవిష్యత్తులో ఉండాలి",
      "pastDate": "తేదీ గతంలో ఉండాలి"
    }
  },
  "privacy": {
    "title": "గోప్యతా విధానం",
    "lastUpdated": "చివరిగా నవీకరించబడింది: {{date}}",
    "sections": {
      "collection": {
        "title": "సమాచార సేకరణ",
        "description": "మేము ఏ సమాచారాన్ని ఎలా సేకరిస్తాము"
      },
      "usage": {
        "title": "సమాచార వినియోగం",
        "description": "సేకరించిన సమాచారాన్ని మేము ఎలా ఉపయోగిస్తాము"
      },
      "sharing": {
        "title": "సమాచార భాగస్వామ్యం",
        "description": "మీ సమాచారాన్ని ఎప్పుడు మరియు ఎవరితో భాగస్వామ్యం చేస్తాము"
      },
      "security": {
        "title": "డేటా భద్రత",
        "description": "మీ సమాచారాన్ని మేము ఎలా రక్షిస్తాము"
      },
      "rights": {
        "title": "మీ హక్కులు",
        "description": "వ్యక్తిగత డేటాకు సంబంధించిన మీ హక్కులు"
      },
      "cookies": {
        "title": "కుక్కీలు మరియు ట్రాకింగ్",
        "description": "కుక్కీలు మరియు సారూప్య సాంకేతికతల మా వినియోగం"
      },
      "children": {
        "title": "పిల్లల గోప్యత",
        "description": "పిల్లల గోప్యతపై మా విధానం"
      },
      "changes": {
        "title": "విధాన మార్పులు",
        "description": "ఈ విధానంలో మార్పులను మేము ఎలా తెలియజేస్తాము"
      },
      "contact": {
        "title": "మమ్మల్ని సంప్రదించండి",
        "description": "గోప్యతా ప్రశ్నల కోసం సంప్రదించండి"
      }
    }
  },
  "terms": {
    "title": "సేవా నిబంధనలు",
    "lastUpdated": "చివరిగా నవీకరించబడింది: {{date}}",
    "sections": {
      "acceptance": {
        "title": "నిబంధనల ఆమోదం",
        "description": "InnerFriend ను ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలను అంగీకరిస్తున్నారు"
      },
      "eligibility": {
        "title": "అర్హత",
        "description": "మా సేవలను ఉపయోగించడానికి అవసరాలు"
      },
      "accounts": {
        "title": "వినియోగదారు ఖాతాలు",
        "description": "మీ ఖాతాకు సంబంధించిన మీ బాధ్యతలు"
      },
      "content": {
        "title": "వినియోగదారు కంటెంట్",
        "description": "మీరు సమర్పించే కంటెంట్‌కు సంబంధించిన నియమాలు"
      },
      "prohibited": {
        "title": "నిషేధించబడిన కార్యకలాపాలు",
        "description": "మా ప్లాట్‌ఫారమ్‌లో నిషేధించబడినవి"
      },
      "intellectual": {
        "title": "మేధో సంపత్తి",
        "description": "కాపీరైట్ మరియు ట్రేడ్‌మార్క్‌ల గురించి సమాచారం"
      },
      "disclaimers": {
        "title": "నిరాకరణలు",
        "description": "InnerFriend ఎటువంటి వారంటీలు లేకుండా 'యథాతథంగా' అందించబడుతుంది"
      },
      "liability": {
        "title": "బాధ్యతా పరిమితి",
        "description": "మా బాధ్యతపై పరిమితులు"
      },
      "termination": {
        "title": "రద్దు",
        "description": "ఖాతాలు ఎప్పుడు రద్దు చేయబడవచ్చు"
      },
      "governing": {
        "title": "గవర్నింగ్ లా",
        "description": "ఈ నిబంధనలను నియంత్రించే చట్టాలు"
      },
      "contact": {
        "title": "మమ్మల్ని సంప్రదించండి",
        "description": "ఈ నిబంధనల గురించి ప్రశ్నల కోసం సంప్రదించండి"
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

const localePath = path.join(__dirname, '../public/locales/te/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, teluguTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: te');
console.log('Done! Telugu translations applied.');
