const fs = require('fs');
const path = require('path');

const punjabiTranslations = {
  "landing": {
    "hero": {
      "title": "ਉਹਨਾਂ ਨਾਲ ਜੁੜੋ ਜੋ ਸੱਚਮੁੱਚ ਮਹੱਤਵਪੂਰਨ ਹਨ",
      "subtitle": "InnerFriend ਤੁਹਾਡੇ ਸਭ ਤੋਂ ਨਜ਼ਦੀਕੀ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਸੰਭਾਲਣ ਅਤੇ ਉਹਨਾਂ ਨਾਲ ਜੁੜੇ ਰਹਿਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਦੀ ਤੁਸੀਂ ਪਰਵਾਹ ਕਰਦੇ ਹੋ",
      "cta": "ਸ਼ੁਰੂ ਕਰੋ",
      "learnMore": "ਹੋਰ ਜਾਣੋ"
    },
    "features": {
      "title": "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      "organize": {
        "title": "ਦੋਸਤਾਂ ਨੂੰ ਸੰਗਠਿਤ ਕਰੋ",
        "description": "ਆਪਣੇ ਨਜ਼ਦੀਕੀ ਦੋਸਤਾਂ ਨੂੰ ਰਿਸ਼ਤੇ ਦੀ ਕਿਸਮ ਅਤੇ ਨਜ਼ਦੀਕੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪੱਧਰਾਂ ਵਿੱਚ ਸ਼੍ਰੇਣੀਬੱਧ ਕਰੋ"
      },
      "remind": {
        "title": "ਜੁੜੇ ਰਹੋ",
        "description": "ਰਿਸ਼ਤੇ ਬਣਾਈ ਰੱਖਣ ਲਈ ਬਹੁਤ ਸਮਾਂ ਹੋ ਗਿਆ ਹੈ ਤਾਂ ਯਾਦ ਦਿਵਾਉਣ ਵਾਲੇ ਪ੍ਰਾਪਤ ਕਰੋ"
      },
      "emergency": {
        "title": "ਐਮਰਜੈਂਸੀ ਨੈੱਟਵਰਕ",
        "description": "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਸੰਪਰਕ ਕਰਨ ਲਈ ਇੱਕ ਭਰੋਸੇਯੋਗ ਸਰਕਲ ਬਣਾਓ"
      }
    },
    "privacy": {
      "title": "ਪ੍ਰਾਈਵੇਸੀ ਪਹਿਲਾਂ",
      "description": "ਤੁਹਾਡਾ ਡਾਟਾ ਤੁਹਾਡਾ ਹੈ। ਆਪਣੇ ਸੋਸ਼ਲ ਗ੍ਰਾਫ਼ 'ਤੇ ਪੂਰਾ ਕੰਟਰੋਲ ਰੱਖੋ।"
    },
    "cta": {
      "title": "ਆਪਣਾ ਸਫ਼ਰ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?",
      "subtitle": "ਅੱਜ ਹੀ InnerFriend ਨਾਲ ਅਰਥਪੂਰਨ ਰਿਸ਼ਤੇ ਬਣਾਉਣਾ ਸ਼ੁਰੂ ਕਰੋ",
      "button": "ਮੁਫ਼ਤ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ"
    }
  },
  "auth": {
    "signIn": "ਸਾਈਨ ਇਨ ਕਰੋ",
    "signUp": "ਸਾਈਨ ਅੱਪ ਕਰੋ",
    "signOut": "ਸਾਈਨ ਆਊਟ ਕਰੋ",
    "email": "ਈਮੇਲ",
    "password": "ਪਾਸਵਰਡ",
    "confirmPassword": "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    "forgotPassword": "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    "resetPassword": "ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ",
    "noAccount": "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    "hasAccount": "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    "continueWith": "{{provider}} ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    "orContinueWith": "ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    "signingIn": "ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...",
    "signingUp": "ਸਾਈਨ ਅੱਪ ਹੋ ਰਿਹਾ ਹੈ...",
    "errors": {
      "invalidEmail": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
      "invalidPassword": "ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
      "passwordMismatch": "ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ",
      "emailInUse": "ਇਹ ਈਮੇਲ ਪਹਿਲਾਂ ਹੀ ਵਰਤੋਂ ਵਿੱਚ ਹੈ",
      "invalidCredentials": "ਗਲਤ ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ",
      "generic": "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ"
    }
  },
  "actions": {
    "save": "ਸੇਵ ਕਰੋ",
    "cancel": "ਰੱਦ ਕਰੋ",
    "delete": "ਮਿਟਾਓ",
    "edit": "ਸੋਧੋ",
    "add": "ਜੋੜੋ",
    "remove": "ਹਟਾਓ",
    "confirm": "ਪੁਸ਼ਟੀ ਕਰੋ",
    "back": "ਵਾਪਸ",
    "next": "ਅੱਗੇ",
    "finish": "ਮੁਕੰਮਲ",
    "skip": "ਛੱਡੋ",
    "close": "ਬੰਦ ਕਰੋ",
    "search": "ਖੋਜੋ",
    "filter": "ਫਿਲਟਰ",
    "sort": "ਕ੍ਰਮਬੱਧ ਕਰੋ",
    "refresh": "ਰਿਫਰੈਸ਼ ਕਰੋ",
    "loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
    "continue": "ਜਾਰੀ ਰੱਖੋ",
    "done": "ਹੋ ਗਿਆ",
    "apply": "ਲਾਗੂ ਕਰੋ",
    "clear": "ਸਾਫ਼ ਕਰੋ",
    "selectAll": "ਸਭ ਚੁਣੋ",
    "deselectAll": "ਸਭ ਚੋਣ ਰੱਦ ਕਰੋ",
    "expandAll": "ਸਭ ਫੈਲਾਓ",
    "collapseAll": "ਸਭ ਸਮੇਟੋ"
  },
  "emptyState": {
    "noFriends": {
      "title": "ਅਜੇ ਕੋਈ ਦੋਸਤ ਨਹੀਂ",
      "description": "ਆਪਣਾ ਪਹਿਲਾ ਦੋਸਤ ਜੋੜ ਕੇ ਸ਼ੁਰੂ ਕਰੋ",
      "action": "ਦੋਸਤ ਜੋੜੋ"
    },
    "noResults": {
      "title": "ਕੋਈ ਨਤੀਜੇ ਨਹੀਂ",
      "description": "ਤੁਹਾਡੇ ਖੋਜ ਮਾਪਦੰਡਾਂ ਨਾਲ ਕੁਝ ਵੀ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ",
      "action": "ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ"
    },
    "noNotifications": {
      "title": "ਕੋਈ ਸੂਚਨਾਵਾਂ ਨਹੀਂ",
      "description": "ਤੁਸੀਂ ਸਭ ਦੇਖ ਲਿਆ ਹੈ!",
      "action": "ਰਿਫਰੈਸ਼ ਕਰੋ"
    },
    "noActivity": {
      "title": "ਕੋਈ ਗਤੀਵਿਧੀ ਨਹੀਂ",
      "description": "ਤੁਹਾਡੀ ਹਾਲੀਆ ਗਤੀਵਿਧੀ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗੀ",
      "action": "ਸ਼ੁਰੂ ਕਰੋ"
    }
  },
  "dashboard": {
    "title": "ਡੈਸ਼ਬੋਰਡ",
    "welcome": "ਸਵਾਗਤ ਹੈ, {{name}}",
    "overview": "ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
    "recentActivity": "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
    "quickActions": "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
    "stats": {
      "totalFriends": "ਕੁੱਲ ਦੋਸਤ",
      "innerCircle": "ਅੰਦਰਲਾ ਸਰਕਲ",
      "needsAttention": "ਧਿਆਨ ਚਾਹੀਦਾ",
      "lastContact": "ਆਖਰੀ ਸੰਪਰਕ"
    },
    "widgets": {
      "upcomingBirthdays": "ਆਉਣ ਵਾਲੇ ਜਨਮਦਿਨ",
      "recentContacts": "ਹਾਲੀਆ ਸੰਪਰਕ",
      "suggestedActions": "ਸੁਝਾਅ ਕੀਤੀਆਂ ਕਾਰਵਾਈਆਂ"
    }
  },
  "mission": {
    "title": "ਮਿਸ਼ਨ",
    "subtitle": "ਮਹੱਤਵਪੂਰਨ ਰਿਸ਼ਤਿਆਂ ਨਾਲ ਜੁੜੇ ਰਹੋ",
    "description": "ਮਿਸ਼ਨ ਤੁਹਾਨੂੰ ਦੋਸਤਾਂ ਨਾਲ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ",
    "complete": "ਮਿਸ਼ਨ ਪੂਰਾ ਕਰੋ",
    "skip": "ਮਿਸ਼ਨ ਛੱਡੋ",
    "remind": "ਬਾਅਦ ਵਿੱਚ ਯਾਦ ਦਿਵਾਓ",
    "empty": {
      "title": "ਕੋਈ ਸਰਗਰਮ ਮਿਸ਼ਨ ਨਹੀਂ",
      "description": "ਤੁਸੀਂ ਸਭ ਕਰ ਲਿਆ ਹੈ! ਨਵੇਂ ਮਿਸ਼ਨ ਜਲਦੀ ਆਉਣਗੇ।"
    },
    "types": {
      "call": "ਕਾਲ ਮਿਸ਼ਨ",
      "message": "ਸੁਨੇਹਾ ਮਿਸ਼ਨ",
      "meetup": "ਮਿਲਣ ਦਾ ਮਿਸ਼ਨ",
      "birthday": "ਜਨਮਦਿਨ ਮਿਸ਼ਨ",
      "checkin": "ਚੈੱਕ-ਇਨ ਮਿਸ਼ਨ"
    }
  },
  "tending": {
    "title": "ਦੋਸਤਾਂ ਦੀ ਦੇਖਭਾਲ",
    "subtitle": "ਰਿਸ਼ਤੇ ਬਾਗ਼ ਵਰਗੇ ਹਨ - ਉਨ੍ਹਾਂ ਨੂੰ ਨਿਯਮਿਤ ਦੇਖਭਾਲ ਚਾਹੀਦੀ ਹੈ",
    "description": "ਦੋਸਤ ਜਿਨ੍ਹਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਦਾ ਸਮਾਂ ਹੈ",
    "actions": {
      "markContacted": "ਸੰਪਰਕ ਕੀਤਾ ਮਾਰਕ ਕਰੋ",
      "snooze": "ਸਨੂਜ਼ ਕਰੋ",
      "viewProfile": "ਪ੍ਰੋਫਾਈਲ ਦੇਖੋ"
    },
    "filters": {
      "all": "ਸਭ",
      "overdue": "ਸਮਾਂ ਲੰਘ ਗਿਆ",
      "upcoming": "ਆਉਣ ਵਾਲੇ",
      "byTier": "ਪੱਧਰ ਅਨੁਸਾਰ"
    },
    "frequency": {
      "daily": "ਰੋਜ਼ਾਨਾ",
      "weekly": "ਹਫ਼ਤਾਵਾਰੀ",
      "biweekly": "ਦੋ ਹਫ਼ਤਿਆਂ ਬਾਅਦ",
      "monthly": "ਮਹੀਨਾਵਾਰ",
      "quarterly": "ਤਿਮਾਹੀ",
      "yearly": "ਸਾਲਾਨਾ"
    },
    "status": {
      "onTrack": "ਸਹੀ ਰਸਤੇ 'ਤੇ",
      "dueSoon": "ਜਲਦੀ ਆਉਣਾ ਹੈ",
      "overdue": "ਸਮਾਂ ਲੰਘ ਗਿਆ",
      "needsAttention": "ਧਿਆਨ ਚਾਹੀਦਾ"
    },
    "reminderTypes": {
      "call": "ਕਾਲ",
      "text": "ਟੈਕਸਟ",
      "visit": "ਮਿਲੋ",
      "email": "ਈਮੇਲ"
    },
    "lastContact": "ਆਖਰੀ ਸੰਪਰਕ",
    "contactDue": "ਸੰਪਰਕ ਬਕਾਇਆ",
    "noContactYet": "ਅਜੇ ਕੋਈ ਸੰਪਰਕ ਨਹੀਂ",
    "daysOverdue": "{{count}} ਦਿਨ ਲੰਘ ਗਏ",
    "dueIn": "{{count}} ਦਿਨਾਂ ਵਿੱਚ"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "ਸਭ ਤੋਂ ਵੱਧ ਲੋੜ ਹੋਣ 'ਤੇ ਆਪਣੇ ਭਰੋਸੇਯੋਗ ਸਰਕਲ ਤੱਕ ਪਹੁੰਚੋ",
    "description": "ਐਮਰਜੈਂਸੀ ਨੈੱਟਵਰਕ ਭਰੋਸੇਯੋਗ ਸੰਪਰਕ ਹਨ ਜੋ ਸੰਕਟ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ",
    "activate": "SOS ਐਕਟੀਵੇਟ ਕਰੋ",
    "deactivate": "SOS ਡੀਐਕਟੀਵੇਟ ਕਰੋ",
    "status": {
      "active": "SOS ਐਕਟਿਵ",
      "inactive": "SOS ਇਨਐਕਟਿਵ",
      "pending": "ਉਡੀਕ ਵਿੱਚ..."
    },
    "contacts": {
      "title": "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      "add": "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਜੋੜੋ",
      "remove": "ਐਮਰਜੈਂਸੀ ਸੂਚੀ ਤੋਂ ਹਟਾਓ",
      "empty": "ਅਜੇ ਕੋਈ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਸੈੱਟ ਨਹੀਂ ਕੀਤੇ"
    },
    "message": {
      "title": "ਐਮਰਜੈਂਸੀ ਸੁਨੇਹਾ",
      "placeholder": "ਆਪਣੇ ਨੈੱਟਵਰਕ ਨੂੰ ਭੇਜਿਆ ਜਾਣ ਵਾਲਾ ਸੁਨੇਹਾ ਦਰਜ ਕਰੋ",
      "default": "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਜੇ ਹੋ ਸਕੇ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸੰਪਰਕ ਕਰੋ।"
    },
    "settings": {
      "title": "SOS ਸੈਟਿੰਗਾਂ",
      "autoLocation": "ਆਪਣੇ ਆਪ ਟਿਕਾਣਾ ਸਾਂਝਾ ਕਰੋ",
      "confirmActivation": "ਐਕਟੀਵੇਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰੋ",
      "cooldown": "ਐਕਟੀਵੇਸ਼ਨਾਂ ਵਿਚਕਾਰ ਕੂਲਡਾਊਨ"
    }
  },
  "callActions": {
    "call": "ਕਾਲ ਕਰੋ",
    "video": "ਵੀਡੀਓ ਕਾਲ",
    "message": "ਸੁਨੇਹਾ ਭੇਜੋ",
    "email": "ਈਮੇਲ ਭੇਜੋ",
    "directions": "ਦਿਸ਼ਾਵਾਂ",
    "schedule": "ਸ਼ਡਿਊਲ ਕਰੋ",
    "addNote": "ਨੋਟ ਜੋੜੋ",
    "recordCall": "ਕਾਲ ਰਿਕਾਰਡ ਕਰੋ",
    "shareContact": "ਸੰਪਰਕ ਸਾਂਝਾ ਕਰੋ"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
      "subtitle": "ਆਓ ਅਰਥਪੂਰਨ ਰਿਸ਼ਤੇ ਸੰਭਾਲਣਾ ਸ਼ੁਰੂ ਕਰੀਏ",
      "description": "ਤੁਹਾਡੇ ਅੰਦਰਲੇ ਸਰਕਲ ਤਜ਼ਰਬੇ ਨੂੰ ਅਨੁਕੂਲਿਤ ਕਰਨ ਲਈ ਅਸੀਂ ਕੁਝ ਸਵਾਲ ਪੁੱਛਾਂਗੇ"
    },
    "steps": {
      "profile": "ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ",
      "import": "ਸੰਪਰਕ ਆਯਾਤ ਕਰੋ",
      "categorize": "ਦੋਸਤਾਂ ਨੂੰ ਸ਼੍ਰੇਣੀਬੱਧ ਕਰੋ",
      "preferences": "ਤਰਜੀਹਾਂ"
    },
    "import": {
      "title": "ਸੰਪਰਕ ਆਯਾਤ ਕਰੋ",
      "description": "ਆਪਣੇ ਮੌਜੂਦਾ ਸੰਪਰਕਾਂ ਨੂੰ ਆਯਾਤ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ",
      "fromPhone": "ਫ਼ੋਨ ਸੰਪਰਕਾਂ ਤੋਂ",
      "fromGoogle": "Google ਸੰਪਰਕਾਂ ਤੋਂ",
      "manual": "ਹੱਥੀਂ ਜੋੜੋ",
      "skip": "ਹੁਣੇ ਛੱਡੋ"
    },
    "complete": {
      "title": "ਸਭ ਤਿਆਰ!",
      "subtitle": "ਤੁਸੀਂ ਆਪਣਾ ਅੰਦਰਲਾ ਸਰਕਲ ਸੰਭਾਲਣਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ",
      "action": "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਜਾਓ"
    }
  },
  "keysShared": {
    "title": "ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ ਚਾਬੀਆਂ",
    "subtitle": "ਆਪਣੇ ਭਰੋਸੇ ਵਾਲੇ ਸਰਕਲ ਤੱਕ ਪਹੁੰਚ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    "description": "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਕੌਣ ਤੁਹਾਡੇ ਅੰਦਰਲੇ ਸਰਕਲ ਤੱਕ ਪਹੁੰਚ ਸਕਦਾ ਹੈ, ਇਸਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    "grant": "ਚਾਬੀ ਦਿਓ",
    "revoke": "ਚਾਬੀ ਵਾਪਸ ਲਓ",
    "manage": "ਸਾਂਝੀਆਂ ਚਾਬੀਆਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    "permissions": {
      "view": "ਸੰਪਰਕ ਦੇਖੋ",
      "contact": "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹਨ",
      "location": "ਟਿਕਾਣਾ ਪਹੁੰਚ"
    },
    "doorKeyTree": {
      "title": "ਦਰਵਾਜ਼ੇ ਦੀ ਚਾਬੀ ਦਾ ਰੁੱਖ",
      "description": "ਭਰੋਸੇਯੋਗ ਲੋਕ ਜੋ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਹਾਡੇ ਅੰਦਰਲੇ ਸਰਕਲ ਤੱਕ ਪਹੁੰਚ ਸਕਦੇ ਹਨ",
      "empty": "ਅਜੇ ਕੋਈ ਚਾਬੀਆਂ ਸਾਂਝੀਆਂ ਨਹੀਂ ਕੀਤੀਆਂ"
    },
    "shareRequest": {
      "title": "ਚਾਬੀ ਬੇਨਤੀ",
      "pending": "ਬਕਾਇਆ ਬੇਨਤੀਆਂ",
      "accept": "ਸਵੀਕਾਰ ਕਰੋ",
      "decline": "ਇਨਕਾਰ ਕਰੋ"
    },
    "sharedWithYou": "ਤੁਹਾਡੇ ਨਾਲ ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ ਚਾਬੀਆਂ",
    "sharedByYou": "ਤੁਸੀਂ ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ ਚਾਬੀਆਂ",
    "noSharedKeys": "ਅਜੇ ਕੋਈ ਚਾਬੀਆਂ ਸਾਂਝੀਆਂ ਨਹੀਂ ਕੀਤੀਆਂ",
    "expiresAt": "ਮਿਆਦ: {{date}}",
    "neverExpires": "ਕਦੇ ਮਿਆਦ ਖ਼ਤਮ ਨਹੀਂ ਹੁੰਦੀ"
  },
  "reserved": {
    "title": "ਰਾਖਵਾਂ ਭਾਗ",
    "description": "ਇਹ ਵਿਸ਼ੇਸ਼ਤਾ ਪ੍ਰੀਮੀਅਮ ਯੂਜ਼ਰਾਂ ਲਈ ਰਾਖਵੀਂ ਹੈ",
    "upgrade": "ਅਨਲੌਕ ਕਰਨ ਲਈ ਅੱਪਗ੍ਰੇਡ ਕਰੋ"
  },
  "addLinkedFriend": {
    "title": "ਲਿੰਕ ਕੀਤਾ ਦੋਸਤ ਜੋੜੋ",
    "subtitle": "ਉਨ੍ਹਾਂ ਦੋਸਤਾਂ ਨਾਲ ਜੁੜੋ ਜੋ ਪਹਿਲਾਂ ਹੀ InnerFriend ਵਰਤ ਰਹੇ ਹਨ",
    "description": "ਹੇਠਾਂ ਆਪਣਾ ਕੋਡ ਸਾਂਝਾ ਕਰੋ ਜਾਂ ਦੋਸਤ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰੋ",
    "searchPlaceholder": "ਨਾਮ ਜਾਂ ਈਮੇਲ ਨਾਲ ਖੋਜੋ",
    "noResults": "ਕੋਈ ਯੂਜ਼ਰ ਨਹੀਂ ਮਿਲੇ",
    "sendRequest": "ਕੁਨੈਕਸ਼ਨ ਬੇਨਤੀ ਭੇਜੋ",
    "pending": "ਬੇਨਤੀ ਬਕਾਇਆ",
    "connected": "ਜੁੜਿਆ ਹੋਇਆ",
    "yourCode": "ਤੁਹਾਡਾ ਕੋਡ",
    "scanCode": "ਕੋਡ ਸਕੈਨ ਕਰੋ",
    "enterCode": "ਕੋਡ ਦਰਜ ਕਰੋ",
    "shareCode": "ਕੋਡ ਸਾਂਝਾ ਕਰੋ"
  },
  "gdpr": {
    "title": "ਡਾਟਾ ਪ੍ਰਾਈਵੇਸੀ",
    "subtitle": "ਜਾਣੋ ਕਿ ਅਸੀਂ ਤੁਹਾਡਾ ਨਿੱਜੀ ਡਾਟਾ ਕਿਵੇਂ ਇਕੱਠਾ ਕਰਦੇ, ਵਰਤਦੇ ਅਤੇ ਸੁਰੱਖਿਅਤ ਕਰਦੇ ਹਾਂ",
    "consent": {
      "title": "ਸਹਿਮਤੀ ਪ੍ਰਬੰਧਨ",
      "description": "ਆਪਣੀ ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਸਹਿਮਤੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
      "analytics": "ਐਨਾਲਿਟਿਕਸ ਕੂਕੀਜ਼",
      "marketing": "ਮਾਰਕੀਟਿੰਗ ਸੰਚਾਰ",
      "thirdParty": "ਤੀਜੀ-ਧਿਰ ਸਾਂਝਾਕਰਨ",
      "withdraw": "ਸਹਿਮਤੀ ਵਾਪਸ ਲਓ"
    },
    "rights": {
      "title": "ਤੁਹਾਡੇ ਹੱਕ",
      "access": "ਡਾਟਾ ਪਹੁੰਚ",
      "rectification": "ਡਾਟਾ ਸੁਧਾਰ",
      "erasure": "ਡਾਟਾ ਮਿਟਾਉਣਾ",
      "portability": "ਡਾਟਾ ਪੋਰਟੇਬਿਲਿਟੀ",
      "restriction": "ਪ੍ਰੋਸੈਸਿੰਗ ਪਾਬੰਦੀ",
      "objection": "ਪ੍ਰੋਸੈਸਿੰਗ 'ਤੇ ਇਤਰਾਜ਼"
    },
    "export": {
      "title": "ਡਾਟਾ ਐਕਸਪੋਰਟ ਕਰੋ",
      "description": "ਆਪਣੇ ਸਾਰੇ ਨਿੱਜੀ ਡਾਟੇ ਦੀ ਕਾਪੀ ਡਾਊਨਲੋਡ ਕਰੋ",
      "button": "ਡਾਟਾ ਐਕਸਪੋਰਟ ਕਰੋ",
      "processing": "ਐਕਸਪੋਰਟ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...",
      "ready": "ਡਾਟਾ ਡਾਊਨਲੋਡ ਲਈ ਤਿਆਰ"
    },
    "delete": {
      "title": "ਖਾਤਾ ਮਿਟਾਓ",
      "description": "ਆਪਣਾ ਖਾਤਾ ਅਤੇ ਸਾਰਾ ਸੰਬੰਧਿਤ ਡਾਟਾ ਸਥਾਈ ਤੌਰ 'ਤੇ ਮਿਟਾਓ। ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
      "button": "ਖਾਤਾ ਮਿਟਾਓ",
      "confirm": "ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ 'ਮਿਟਾਓ' ਟਾਈਪ ਕਰੋ",
      "warning": "ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ"
    },
    "policy": {
      "title": "ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ",
      "lastUpdated": "ਆਖਰੀ ਅਪਡੇਟ",
      "readFull": "ਪੂਰੀ ਨੀਤੀ ਪੜ੍ਹੋ"
    }
  },
  "admin": {
    "title": "ਐਡਮਿਨ ਪੈਨਲ",
    "dashboard": "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ",
    "users": {
      "title": "ਯੂਜ਼ਰ ਪ੍ਰਬੰਧਨ",
      "list": "ਸਾਰੇ ਯੂਜ਼ਰ",
      "active": "ਸਰਗਰਮ ਯੂਜ਼ਰ",
      "suspended": "ਮੁਅੱਤਲ ਯੂਜ਼ਰ",
      "invite": "ਯੂਜ਼ਰ ਨੂੰ ਸੱਦਾ ਦਿਓ"
    },
    "settings": {
      "title": "ਸਿਸਟਮ ਸੈਟਿੰਗਾਂ",
      "general": "ਆਮ ਸੈਟਿੰਗਾਂ",
      "security": "ਸੁਰੱਖਿਆ ਸੈਟਿੰਗਾਂ",
      "notifications": "ਸੂਚਨਾ ਸੈਟਿੰਗਾਂ"
    },
    "logs": {
      "title": "ਸਿਸਟਮ ਲੌਗ",
      "audit": "ਆਡਿਟ ਲੌਗ",
      "error": "ਗਲਤੀ ਲੌਗ",
      "access": "ਪਹੁੰਚ ਲੌਗ"
    },
    "analytics": {
      "title": "ਐਨਾਲਿਟਿਕਸ",
      "overview": "ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
      "users": "ਯੂਜ਼ਰ ਐਨਾਲਿਟਿਕਸ",
      "engagement": "ਇੰਗੇਜਮੈਂਟ ਮੈਟ੍ਰਿਕਸ"
    }
  },
  "dev": {
    "title": "ਡਿਵੈਲਪਰ ਸੈਟਿੰਗਾਂ",
    "apiKeys": "API ਕੁੰਜੀਆਂ",
    "webhooks": "ਵੈਬਹੁੱਕਸ",
    "logs": "ਡਿਵੈਲਪਰ ਲੌਗ",
    "testing": "ਟੈਸਟਿੰਗ ਮੋਡ",
    "documentation": "API ਦਸਤਾਵੇਜ਼"
  },
  "contactMethods": {
    "title": "ਸੰਪਰਕ ਤਰੀਕੇ",
    "phone": "ਫ਼ੋਨ",
    "email": "ਈਮੇਲ",
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
    "other": "ਹੋਰ",
    "preferred": "ਤਰਜੀਹੀ ਤਰੀਕਾ",
    "add": "ਸੰਪਰਕ ਤਰੀਕਾ ਜੋੜੋ",
    "primary": "ਮੁੱਖ",
    "secondary": "ਸੈਕੰਡਰੀ"
  },
  "post": {
    "title": "ਪੋਸਟ ਬਣਾਓ",
    "placeholder": "ਤੁਸੀਂ ਕੀ ਸੋਚ ਰਹੇ ਹੋ?",
    "submit": "ਪੋਸਟ ਕਰੋ",
    "visibility": {
      "public": "ਜਨਤਕ",
      "friends": "ਸਿਰਫ਼ ਦੋਸਤ",
      "private": "ਨਿੱਜੀ"
    },
    "actions": {
      "like": "ਪਸੰਦ",
      "comment": "ਟਿੱਪਣੀ",
      "share": "ਸਾਂਝਾ ਕਰੋ",
      "save": "ਸੇਵ ਕਰੋ"
    }
  },
  "parasocial": {
    "title": "ਕਰੀਏਟਰਾਂ ਨੂੰ ਫਾਲੋ ਕਰੋ",
    "subtitle": "ਆਪਣੇ ਮਨਪਸੰਦ ਕਰੀਏਟਰਾਂ ਨਾਲ ਜੁੜੋ",
    "description": "ਆਪਣੇ ਮਨਪਸੰਦ ਕਰੀਏਟਰਾਂ ਨੂੰ ਫਾਲੋ ਕਰੋ ਅਤੇ ਉਨ੍ਹਾਂ ਤੋਂ ਅਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰੋ",
    "follow": "ਫਾਲੋ ਕਰੋ",
    "unfollow": "ਅਨਫਾਲੋ ਕਰੋ",
    "following": "ਫਾਲੋ ਕਰ ਰਹੇ",
    "followers": "ਫਾਲੋਅਰਜ਼",
    "noCreators": "ਕੋਈ ਕਰੀਏਟਰ ਨਹੀਂ ਮਿਲੇ"
  },
  "profileSettings": {
    "title": "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ",
    "personalInfo": "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
    "displayName": "ਡਿਸਪਲੇ ਨਾਮ",
    "bio": "ਬਾਇਓ",
    "avatar": "ਅਵਤਾਰ",
    "changeAvatar": "ਅਵਤਾਰ ਬਦਲੋ",
    "removeAvatar": "ਅਵਤਾਰ ਹਟਾਓ",
    "privacy": {
      "title": "ਪ੍ਰਾਈਵੇਸੀ ਸੈਟਿੰਗਾਂ",
      "profileVisibility": "ਪ੍ਰੋਫਾਈਲ ਦਿੱਖ",
      "showOnline": "ਆਨਲਾਈਨ ਸਥਿਤੀ ਦਿਖਾਓ",
      "showLastSeen": "ਆਖਰੀ ਵਾਰ ਦੇਖਿਆ ਦਿਖਾਓ"
    },
    "notifications": {
      "title": "ਸੂਚਨਾ ਸੈਟਿੰਗਾਂ",
      "email": "ਈਮੇਲ ਸੂਚਨਾਵਾਂ",
      "push": "ਪੁਸ਼ ਸੂਚਨਾਵਾਂ",
      "sms": "SMS ਸੂਚਨਾਵਾਂ"
    },
    "account": {
      "title": "ਖਾਤਾ ਸੈਟਿੰਗਾਂ",
      "changePassword": "ਪਾਸਵਰਡ ਬਦਲੋ",
      "twoFactor": "ਦੋ-ਕਾਰਕ ਪ੍ਰਮਾਣੀਕਰਨ",
      "sessions": "ਸਰਗਰਮ ਸੈਸ਼ਨ",
      "deleteAccount": "ਖਾਤਾ ਮਿਟਾਓ"
    }
  },
  "editFriend": {
    "title": "ਦੋਸਤ ਸੋਧੋ",
    "basicInfo": "ਮੁਢਲੀ ਜਾਣਕਾਰੀ",
    "name": "ਨਾਮ",
    "nickname": "ਉਪਨਾਮ",
    "birthday": "ਜਨਮਦਿਨ",
    "notes": "ਨੋਟਸ",
    "tier": "ਪੱਧਰ",
    "contactFrequency": "ਸੰਪਰਕ ਬਾਰੰਬਾਰਤਾ",
    "save": "ਬਦਲਾਅ ਸੇਵ ਕਰੋ",
    "delete": "ਦੋਸਤ ਮਿਟਾਓ",
    "confirmDelete": "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਹੋ ਕਿ ਤੁਸੀਂ ਇਸ ਦੋਸਤ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?"
  },
  "followCreator": {
    "title": "ਕਰੀਏਟਰ ਫਾਲੋ ਕਰੋ",
    "search": "ਕਰੀਏਟਰ ਲੱਭੋ",
    "suggested": "ਤੁਹਾਡੇ ਲਈ ਸੁਝਾਅ",
    "categories": "ਸ਼੍ਰੇਣੀਆਂ",
    "trending": "ਟ੍ਰੈਂਡਿੰਗ"
  },
  "dispatch": {
    "validation": {
      "required": "ਇਹ ਖੇਤਰ ਲੋੜੀਂਦਾ ਹੈ",
      "invalidEmail": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
      "invalidPhone": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
      "minLength": "ਘੱਟੋ-ਘੱਟ {{min}} ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ",
      "maxLength": "{{max}} ਅੱਖਰਾਂ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦਾ",
      "passwordMatch": "ਪਾਸਵਰਡ ਮੇਲ ਖਾਣੇ ਚਾਹੀਦੇ ਹਨ",
      "invalidUrl": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ URL ਦਰਜ ਕਰੋ",
      "invalidDate": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਤਾਰੀਖ਼ ਦਰਜ ਕਰੋ",
      "futureDate": "ਤਾਰੀਖ਼ ਭਵਿੱਖ ਵਿੱਚ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ",
      "pastDate": "ਤਾਰੀਖ਼ ਬੀਤੇ ਸਮੇਂ ਵਿੱਚ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ"
    }
  },
  "privacy": {
    "title": "ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ",
    "lastUpdated": "ਆਖਰੀ ਅਪਡੇਟ: {{date}}",
    "sections": {
      "collection": {
        "title": "ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਨਾ",
        "description": "ਅਸੀਂ ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ ਅਤੇ ਕਿਵੇਂ"
      },
      "usage": {
        "title": "ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ",
        "description": "ਅਸੀਂ ਇਕੱਠੀ ਕੀਤੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਵਰਤਦੇ ਹਾਂ"
      },
      "sharing": {
        "title": "ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਨਾ",
        "description": "ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਕਦੋਂ ਅਤੇ ਕਿਸ ਨਾਲ ਸਾਂਝੀ ਕਰਦੇ ਹਾਂ"
      },
      "security": {
        "title": "ਡਾਟਾ ਸੁਰੱਖਿਆ",
        "description": "ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਨੂੰ ਕਿਵੇਂ ਸੁਰੱਖਿਅਤ ਕਰਦੇ ਹਾਂ"
      },
      "rights": {
        "title": "ਤੁਹਾਡੇ ਹੱਕ",
        "description": "ਨਿੱਜੀ ਡਾਟੇ ਬਾਰੇ ਤੁਹਾਡੇ ਹੱਕ"
      },
      "cookies": {
        "title": "ਕੂਕੀਜ਼ ਅਤੇ ਟ੍ਰੈਕਿੰਗ",
        "description": "ਕੂਕੀਜ਼ ਅਤੇ ਸਮਾਨ ਤਕਨੀਕਾਂ ਦੀ ਸਾਡੀ ਵਰਤੋਂ"
      },
      "children": {
        "title": "ਬੱਚਿਆਂ ਦੀ ਪ੍ਰਾਈਵੇਸੀ",
        "description": "ਬੱਚਿਆਂ ਦੀ ਪ੍ਰਾਈਵੇਸੀ ਬਾਰੇ ਸਾਡੀ ਨੀਤੀ"
      },
      "changes": {
        "title": "ਨੀਤੀ ਬਦਲਾਅ",
        "description": "ਅਸੀਂ ਇਸ ਨੀਤੀ ਵਿੱਚ ਬਦਲਾਵਾਂ ਬਾਰੇ ਕਿਵੇਂ ਸੂਚਿਤ ਕਰਦੇ ਹਾਂ"
      },
      "contact": {
        "title": "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
        "description": "ਪ੍ਰਾਈਵੇਸੀ ਸਵਾਲਾਂ ਲਈ ਸੰਪਰਕ ਕਰੋ"
      }
    }
  },
  "terms": {
    "title": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
    "lastUpdated": "ਆਖਰੀ ਅਪਡੇਟ: {{date}}",
    "sections": {
      "acceptance": {
        "title": "ਸ਼ਰਤਾਂ ਦੀ ਸਵੀਕ੍ਰਿਤੀ",
        "description": "InnerFriend ਵਰਤ ਕੇ, ਤੁਸੀਂ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ"
      },
      "eligibility": {
        "title": "ਯੋਗਤਾ",
        "description": "ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ ਵਰਤਣ ਲਈ ਲੋੜਾਂ"
      },
      "accounts": {
        "title": "ਯੂਜ਼ਰ ਖਾਤੇ",
        "description": "ਤੁਹਾਡੇ ਖਾਤੇ ਲਈ ਤੁਹਾਡੀਆਂ ਜ਼ਿੰਮੇਵਾਰੀਆਂ"
      },
      "content": {
        "title": "ਯੂਜ਼ਰ ਸਮੱਗਰੀ",
        "description": "ਤੁਹਾਡੇ ਦੁਆਰਾ ਜਮ੍ਹਾਂ ਕੀਤੀ ਸਮੱਗਰੀ ਬਾਰੇ ਨਿਯਮ"
      },
      "prohibited": {
        "title": "ਮਨਾਹੀ ਵਾਲੀਆਂ ਗਤੀਵਿਧੀਆਂ",
        "description": "ਸਾਡੇ ਪਲੇਟਫਾਰਮ 'ਤੇ ਕੀ ਮਨਾਹੀ ਹੈ"
      },
      "intellectual": {
        "title": "ਬੌਧਿਕ ਸੰਪਤੀ",
        "description": "ਕਾਪੀਰਾਈਟ ਅਤੇ ਟ੍ਰੇਡਮਾਰਕ ਬਾਰੇ ਜਾਣਕਾਰੀ"
      },
      "disclaimers": {
        "title": "ਬੇਦਾਅਵੇ",
        "description": "InnerFriend ਬਿਨਾਂ ਕਿਸੇ ਵਾਰੰਟੀ ਦੇ 'ਜਿਵੇਂ ਹੈ' ਪ੍ਰਦਾਨ ਕੀਤਾ ਗਿਆ ਹੈ"
      },
      "liability": {
        "title": "ਜਵਾਬਦੇਹੀ ਸੀਮਾ",
        "description": "ਸਾਡੀ ਜਵਾਬਦੇਹੀ 'ਤੇ ਸੀਮਾਵਾਂ"
      },
      "termination": {
        "title": "ਸਮਾਪਤੀ",
        "description": "ਖਾਤੇ ਕਦੋਂ ਸਮਾਪਤ ਕੀਤੇ ਜਾ ਸਕਦੇ ਹਨ"
      },
      "governing": {
        "title": "ਸ਼ਾਸਨਕਾਰੀ ਕਾਨੂੰਨ",
        "description": "ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਚਲਾਉਣ ਵਾਲੇ ਕਾਨੂੰਨ"
      },
      "contact": {
        "title": "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
        "description": "ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਬਾਰੇ ਸਵਾਲਾਂ ਲਈ ਸੰਪਰਕ ਕਰੋ"
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

const localePath = path.join(__dirname, '../public/locales/pa/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, punjabiTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: pa');
console.log('Done! Punjabi translations applied.');
