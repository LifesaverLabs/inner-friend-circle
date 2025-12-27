const fs = require('fs');
const path = require('path');

const bengaliTranslations = {
  "landing": {
    "hero": {
      "title": "যারা সত্যিই গুরুত্বপূর্ণ তাদের সাথে সংযুক্ত থাকুন",
      "subtitle": "InnerFriend আপনার নিকটতম সম্পর্কগুলি পরিচালনা করতে এবং আপনি যাদের যত্ন করেন তাদের সাথে সংযুক্ত থাকতে সাহায্য করে",
      "cta": "শুরু করুন",
      "learnMore": "আরও জানুন"
    },
    "features": {
      "title": "বৈশিষ্ট্য",
      "organize": {
        "title": "বন্ধুদের সংগঠিত করুন",
        "description": "সম্পর্কের ধরন এবং ঘনিষ্ঠতার উপর ভিত্তি করে আপনার ঘনিষ্ঠ বন্ধুদের স্তরে শ্রেণীবদ্ধ করুন"
      },
      "remind": {
        "title": "সংযুক্ত থাকুন",
        "description": "সম্পর্ক বজায় রাখতে অনেক দিন হয়ে গেলে রিমাইন্ডার পান"
      },
      "emergency": {
        "title": "জরুরি নেটওয়ার্ক",
        "description": "জরুরি অবস্থায় যোগাযোগের জন্য একটি বিশ্বস্ত বৃত্ত তৈরি করুন"
      }
    },
    "privacy": {
      "title": "গোপনীয়তা প্রথম",
      "description": "আপনার ডেটা আপনার। আপনার সামাজিক নেটওয়ার্কের উপর সম্পূর্ণ নিয়ন্ত্রণ বজায় রাখুন।"
    },
    "cta": {
      "title": "আপনার যাত্রা শুরু করতে প্রস্তুত?",
      "subtitle": "আজই InnerFriend এর সাথে অর্থবহ সম্পর্ক গড়ে তোলা শুরু করুন",
      "button": "বিনামূল্যে শুরু করুন"
    }
  },
  "auth": {
    "signIn": "সাইন ইন",
    "signUp": "সাইন আপ",
    "signOut": "সাইন আউট",
    "email": "ইমেইল",
    "password": "পাসওয়ার্ড",
    "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
    "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
    "resetPassword": "পাসওয়ার্ড রিসেট করুন",
    "noAccount": "অ্যাকাউন্ট নেই?",
    "hasAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    "continueWith": "{{provider}} দিয়ে চালিয়ে যান",
    "orContinueWith": "অথবা এর সাথে চালিয়ে যান",
    "signingIn": "সাইন ইন হচ্ছে...",
    "signingUp": "সাইন আপ হচ্ছে...",
    "errors": {
      "invalidEmail": "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন",
      "invalidPassword": "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
      "passwordMismatch": "পাসওয়ার্ড মিলছে না",
      "emailInUse": "এই ইমেইল ইতিমধ্যে ব্যবহৃত হচ্ছে",
      "invalidCredentials": "অবৈধ ইমেইল বা পাসওয়ার্ড",
      "generic": "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন"
    }
  },
  "actions": {
    "save": "সংরক্ষণ",
    "cancel": "বাতিল",
    "delete": "মুছুন",
    "edit": "সম্পাদনা",
    "add": "যোগ করুন",
    "remove": "সরান",
    "confirm": "নিশ্চিত",
    "back": "পেছনে",
    "next": "পরবর্তী",
    "finish": "শেষ",
    "skip": "এড়িয়ে যান",
    "close": "বন্ধ",
    "search": "অনুসন্ধান",
    "filter": "ফিল্টার",
    "sort": "সাজান",
    "refresh": "রিফ্রেশ",
    "loading": "লোড হচ্ছে...",
    "submit": "জমা দিন",
    "continue": "চালিয়ে যান",
    "done": "সম্পন্ন",
    "apply": "প্রয়োগ করুন",
    "clear": "মুছে ফেলুন",
    "selectAll": "সব নির্বাচন করুন",
    "deselectAll": "সব নির্বাচন বাতিল করুন",
    "expandAll": "সব প্রসারিত করুন",
    "collapseAll": "সব সংকুচিত করুন"
  },
  "emptyState": {
    "noFriends": {
      "title": "এখনও কোনো বন্ধু নেই",
      "description": "আপনার প্রথম বন্ধু যোগ করে শুরু করুন",
      "action": "বন্ধু যোগ করুন"
    },
    "noResults": {
      "title": "কোনো ফলাফল নেই",
      "description": "আপনার অনুসন্ধান মানদণ্ডের সাথে কিছু মেলেনি",
      "action": "ফিল্টার মুছুন"
    },
    "noNotifications": {
      "title": "কোনো বিজ্ঞপ্তি নেই",
      "description": "আপনি সব দেখে ফেলেছেন!",
      "action": "রিফ্রেশ"
    },
    "noActivity": {
      "title": "কোনো কার্যকলাপ নেই",
      "description": "আপনার সাম্প্রতিক কার্যকলাপ এখানে দেখা যাবে",
      "action": "শুরু করুন"
    }
  },
  "dashboard": {
    "title": "ড্যাশবোর্ড",
    "welcome": "স্বাগতম, {{name}}",
    "overview": "সংক্ষিপ্ত বিবরণ",
    "recentActivity": "সাম্প্রতিক কার্যকলাপ",
    "quickActions": "দ্রুত কার্য",
    "stats": {
      "totalFriends": "মোট বন্ধু",
      "innerCircle": "অন্তরঙ্গ বৃত্ত",
      "needsAttention": "মনোযোগ প্রয়োজন",
      "lastContact": "শেষ যোগাযোগ"
    },
    "widgets": {
      "upcomingBirthdays": "আসন্ন জন্মদিন",
      "recentContacts": "সাম্প্রতিক যোগাযোগ",
      "suggestedActions": "প্রস্তাবিত কার্য"
    }
  },
  "mission": {
    "title": "মিশন",
    "subtitle": "গুরুত্বপূর্ণ সম্পর্কের সাথে সংযুক্ত থাকুন",
    "description": "মিশন আপনাকে বন্ধুদের সাথে যোগাযোগ রাখতে সাহায্য করে",
    "complete": "মিশন সম্পূর্ণ করুন",
    "skip": "মিশন এড়িয়ে যান",
    "remind": "পরে মনে করিয়ে দিন",
    "empty": {
      "title": "কোনো সক্রিয় মিশন নেই",
      "description": "আপনি সব করেছেন! নতুন মিশন শীঘ্রই আসবে।"
    },
    "types": {
      "call": "কল মিশন",
      "message": "বার্তা মিশন",
      "meetup": "সাক্ষাৎ মিশন",
      "birthday": "জন্মদিন মিশন",
      "checkin": "চেক-ইন মিশন"
    }
  },
  "tending": {
    "title": "বন্ধুদের যত্ন নেওয়া",
    "subtitle": "সম্পর্ক একটি বাগানের মতো - নিয়মিত যত্ন প্রয়োজন",
    "description": "যে বন্ধুদের সাথে যোগাযোগ করার সময় হয়েছে",
    "actions": {
      "markContacted": "যোগাযোগ হয়েছে চিহ্নিত করুন",
      "snooze": "স্নুজ করুন",
      "viewProfile": "প্রোফাইল দেখুন"
    },
    "filters": {
      "all": "সব",
      "overdue": "বিলম্বিত",
      "upcoming": "আসন্ন",
      "byTier": "স্তর অনুসারে"
    },
    "frequency": {
      "daily": "দৈনিক",
      "weekly": "সাপ্তাহিক",
      "biweekly": "পাক্ষিক",
      "monthly": "মাসিক",
      "quarterly": "ত্রৈমাসিক",
      "yearly": "বার্ষিক"
    },
    "status": {
      "onTrack": "সঠিক পথে",
      "dueSoon": "শীঘ্রই প্রয়োজন",
      "overdue": "বিলম্বিত",
      "needsAttention": "মনোযোগ প্রয়োজন"
    },
    "reminderTypes": {
      "call": "কল",
      "text": "টেক্সট",
      "visit": "দেখা করুন",
      "email": "ইমেইল"
    },
    "lastContact": "শেষ যোগাযোগ",
    "contactDue": "যোগাযোগ প্রয়োজন",
    "noContactYet": "এখনও যোগাযোগ হয়নি",
    "daysOverdue": "{{count}} দিন বিলম্বিত",
    "dueIn": "{{count}} দিনে প্রয়োজন"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "সবচেয়ে প্রয়োজনের সময় আপনার বিশ্বস্ত বৃত্তে পৌঁছান",
    "description": "জরুরি নেটওয়ার্ক হল বিশ্বস্ত যোগাযোগ যারা সংকটে সাহায্য করতে পারে",
    "activate": "SOS সক্রিয় করুন",
    "deactivate": "SOS নিষ্ক্রিয় করুন",
    "status": {
      "active": "SOS সক্রিয়",
      "inactive": "SOS নিষ্ক্রিয়",
      "pending": "অপেক্ষমান..."
    },
    "contacts": {
      "title": "জরুরি যোগাযোগ",
      "add": "জরুরি যোগাযোগ যোগ করুন",
      "remove": "জরুরি তালিকা থেকে সরান",
      "empty": "এখনও কোনো জরুরি যোগাযোগ সেট করা হয়নি"
    },
    "message": {
      "title": "জরুরি বার্তা",
      "placeholder": "আপনার নেটওয়ার্কে পাঠানো বার্তা লিখুন",
      "default": "আমার সাহায্য দরকার। সম্ভব হলে যোগাযোগ করুন।"
    },
    "settings": {
      "title": "SOS সেটিংস",
      "autoLocation": "স্বয়ংক্রিয়ভাবে অবস্থান শেয়ার করুন",
      "confirmActivation": "সক্রিয় করার আগে নিশ্চিত করুন",
      "cooldown": "সক্রিয়করণের মধ্যে কুলডাউন"
    }
  },
  "callActions": {
    "call": "কল করুন",
    "video": "ভিডিও কল",
    "message": "বার্তা পাঠান",
    "email": "ইমেইল করুন",
    "directions": "দিকনির্দেশ",
    "schedule": "সময়সূচী করুন",
    "addNote": "নোট যোগ করুন",
    "recordCall": "কল রেকর্ড করুন",
    "shareContact": "যোগাযোগ শেয়ার করুন"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend এ স্বাগতম",
      "subtitle": "অর্থবহ সম্পর্ক পরিচালনা শুরু করা যাক",
      "description": "আপনার অন্তরঙ্গ বৃত্ত অভিজ্ঞতা কাস্টমাইজ করতে আমরা কিছু প্রশ্ন করব"
    },
    "steps": {
      "profile": "প্রোফাইল তৈরি করুন",
      "import": "যোগাযোগ আমদানি করুন",
      "categorize": "বন্ধুদের শ্রেণীবদ্ধ করুন",
      "preferences": "পছন্দসমূহ"
    },
    "import": {
      "title": "যোগাযোগ আমদানি করুন",
      "description": "আপনার বিদ্যমান যোগাযোগ আমদানি করে শুরু করুন",
      "fromPhone": "ফোন যোগাযোগ থেকে",
      "fromGoogle": "Google যোগাযোগ থেকে",
      "manual": "ম্যানুয়ালি যোগ করুন",
      "skip": "এখন এড়িয়ে যান"
    },
    "complete": {
      "title": "সব প্রস্তুত!",
      "subtitle": "আপনি আপনার অন্তরঙ্গ বৃত্ত পরিচালনা শুরু করতে প্রস্তুত",
      "action": "ড্যাশবোর্ডে যান"
    }
  },
  "keysShared": {
    "title": "শেয়ার করা চাবি",
    "subtitle": "আপনার বিশ্বাসের বৃত্তে অ্যাক্সেস পরিচালনা করুন",
    "description": "জরুরি অবস্থায় কে আপনার অন্তরঙ্গ বৃত্তে অ্যাক্সেস করতে পারে তা পরিচালনা করুন",
    "grant": "চাবি দিন",
    "revoke": "চাবি প্রত্যাহার করুন",
    "manage": "শেয়ার করা চাবি পরিচালনা করুন",
    "permissions": {
      "view": "যোগাযোগ দেখুন",
      "contact": "জরুরি অবস্থায় যোগাযোগ করতে পারেন",
      "location": "অবস্থান অ্যাক্সেস"
    },
    "doorKeyTree": {
      "title": "দরজার চাবি ট্রি",
      "description": "বিশ্বস্ত মানুষ যারা জরুরি অবস্থায় আপনার অন্তরঙ্গ বৃত্তে অ্যাক্সেস করতে পারে",
      "empty": "এখনও কোনো চাবি শেয়ার করা হয়নি"
    },
    "shareRequest": {
      "title": "চাবি অনুরোধ",
      "pending": "অপেক্ষমান অনুরোধ",
      "accept": "গ্রহণ করুন",
      "decline": "প্রত্যাখ্যান করুন"
    },
    "sharedWithYou": "আপনার সাথে শেয়ার করা চাবি",
    "sharedByYou": "আপনি শেয়ার করা চাবি",
    "noSharedKeys": "এখনও কোনো চাবি শেয়ার করা হয়নি",
    "expiresAt": "মেয়াদ শেষ: {{date}}",
    "neverExpires": "মেয়াদ শেষ হয় না"
  },
  "reserved": {
    "title": "সংরক্ষিত বিভাগ",
    "description": "এই বৈশিষ্ট্য প্রিমিয়াম ব্যবহারকারীদের জন্য সংরক্ষিত",
    "upgrade": "আনলক করতে আপগ্রেড করুন"
  },
  "addLinkedFriend": {
    "title": "লিংক করা বন্ধু যোগ করুন",
    "subtitle": "যারা ইতিমধ্যে InnerFriend ব্যবহার করছে তাদের সাথে সংযুক্ত হন",
    "description": "নীচে আপনার কোড শেয়ার করুন অথবা একজন বন্ধুর কোড স্ক্যান করুন",
    "searchPlaceholder": "নাম বা ইমেইল দিয়ে অনুসন্ধান করুন",
    "noResults": "কোনো ব্যবহারকারী পাওয়া যায়নি",
    "sendRequest": "সংযোগ অনুরোধ পাঠান",
    "pending": "অনুরোধ অপেক্ষমান",
    "connected": "সংযুক্ত",
    "yourCode": "আপনার কোড",
    "scanCode": "কোড স্ক্যান করুন",
    "enterCode": "কোড প্রবেশ করুন",
    "shareCode": "কোড শেয়ার করুন"
  },
  "gdpr": {
    "title": "ডেটা গোপনীয়তা",
    "subtitle": "আমরা কীভাবে আপনার ব্যক্তিগত ডেটা সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি তা জানুন",
    "consent": {
      "title": "সম্মতি ব্যবস্থাপনা",
      "description": "আপনার ডেটা প্রক্রিয়াকরণ সম্মতি পরিচালনা করুন",
      "analytics": "অ্যানালিটিক্স কুকিজ",
      "marketing": "মার্কেটিং যোগাযোগ",
      "thirdParty": "তৃতীয় পক্ষের শেয়ারিং",
      "withdraw": "সম্মতি প্রত্যাহার করুন"
    },
    "rights": {
      "title": "আপনার অধিকার",
      "access": "ডেটা অ্যাক্সেস",
      "rectification": "ডেটা সংশোধন",
      "erasure": "ডেটা মুছে ফেলা",
      "portability": "ডেটা পোর্টেবিলিটি",
      "restriction": "প্রক্রিয়াকরণ সীমাবদ্ধতা",
      "objection": "প্রক্রিয়াকরণে আপত্তি"
    },
    "export": {
      "title": "ডেটা রপ্তানি করুন",
      "description": "আপনার সমস্ত ব্যক্তিগত ডেটার একটি কপি ডাউনলোড করুন",
      "button": "ডেটা রপ্তানি করুন",
      "processing": "রপ্তানি প্রস্তুত হচ্ছে...",
      "ready": "ডেটা ডাউনলোডের জন্য প্রস্তুত"
    },
    "delete": {
      "title": "অ্যাকাউন্ট মুছুন",
      "description": "আপনার অ্যাকাউন্ট এবং সমস্ত সম্পর্কিত ডেটা স্থায়ীভাবে মুছুন। এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না।",
      "button": "অ্যাকাউন্ট মুছুন",
      "confirm": "নিশ্চিত করতে 'মুছুন' টাইপ করুন",
      "warning": "এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না"
    },
    "policy": {
      "title": "গোপনীয়তা নীতি",
      "lastUpdated": "সর্বশেষ আপডেট",
      "readFull": "সম্পূর্ণ নীতি পড়ুন"
    }
  },
  "admin": {
    "title": "অ্যাডমিন প্যানেল",
    "dashboard": "অ্যাডমিন ড্যাশবোর্ড",
    "users": {
      "title": "ব্যবহারকারী ব্যবস্থাপনা",
      "list": "সব ব্যবহারকারী",
      "active": "সক্রিয় ব্যবহারকারী",
      "suspended": "স্থগিত ব্যবহারকারী",
      "invite": "ব্যবহারকারী আমন্ত্রণ করুন"
    },
    "settings": {
      "title": "সিস্টেম সেটিংস",
      "general": "সাধারণ সেটিংস",
      "security": "নিরাপত্তা সেটিংস",
      "notifications": "বিজ্ঞপ্তি সেটিংস"
    },
    "logs": {
      "title": "সিস্টেম লগ",
      "audit": "অডিট লগ",
      "error": "ত্রুটি লগ",
      "access": "অ্যাক্সেস লগ"
    },
    "analytics": {
      "title": "অ্যানালিটিক্স",
      "overview": "সংক্ষিপ্ত বিবরণ",
      "users": "ব্যবহারকারী অ্যানালিটিক্স",
      "engagement": "এনগেজমেন্ট মেট্রিক্স"
    }
  },
  "dev": {
    "title": "ডেভেলপার সেটিংস",
    "apiKeys": "API কী",
    "webhooks": "ওয়েবহুক",
    "logs": "ডেভেলপার লগ",
    "testing": "টেস্টিং মোড",
    "documentation": "API ডকুমেন্টেশন"
  },
  "contactMethods": {
    "title": "যোগাযোগের পদ্ধতি",
    "phone": "ফোন",
    "email": "ইমেইল",
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
    "other": "অন্যান্য",
    "preferred": "পছন্দের পদ্ধতি",
    "add": "যোগাযোগের পদ্ধতি যোগ করুন",
    "primary": "প্রাথমিক",
    "secondary": "মাধ্যমিক"
  },
  "post": {
    "title": "পোস্ট তৈরি করুন",
    "placeholder": "আপনি কী ভাবছেন?",
    "submit": "পোস্ট করুন",
    "visibility": {
      "public": "সর্বজনীন",
      "friends": "শুধু বন্ধুরা",
      "private": "ব্যক্তিগত"
    },
    "actions": {
      "like": "পছন্দ",
      "comment": "মন্তব্য",
      "share": "শেয়ার",
      "save": "সংরক্ষণ"
    }
  },
  "parasocial": {
    "title": "ক্রিয়েটরদের অনুসরণ করুন",
    "subtitle": "আপনার প্রিয় ক্রিয়েটরদের সাথে সংযুক্ত হন",
    "description": "আপনার প্রিয় ক্রিয়েটরদের অনুসরণ করুন এবং তাদের আপডেট পান",
    "follow": "অনুসরণ করুন",
    "unfollow": "অনুসরণ বন্ধ করুন",
    "following": "অনুসরণ করছেন",
    "followers": "অনুসারী",
    "noCreators": "কোনো ক্রিয়েটর পাওয়া যায়নি"
  },
  "profileSettings": {
    "title": "প্রোফাইল সেটিংস",
    "personalInfo": "ব্যক্তিগত তথ্য",
    "displayName": "প্রদর্শিত নাম",
    "bio": "বায়ো",
    "avatar": "অবতার",
    "changeAvatar": "অবতার পরিবর্তন করুন",
    "removeAvatar": "অবতার সরান",
    "privacy": {
      "title": "গোপনীয়তা সেটিংস",
      "profileVisibility": "প্রোফাইল দৃশ্যমানতা",
      "showOnline": "অনলাইন স্ট্যাটাস দেখান",
      "showLastSeen": "সর্বশেষ দেখা দেখান"
    },
    "notifications": {
      "title": "বিজ্ঞপ্তি সেটিংস",
      "email": "ইমেইল বিজ্ঞপ্তি",
      "push": "পুশ বিজ্ঞপ্তি",
      "sms": "SMS বিজ্ঞপ্তি"
    },
    "account": {
      "title": "অ্যাকাউন্ট সেটিংস",
      "changePassword": "পাসওয়ার্ড পরিবর্তন করুন",
      "twoFactor": "দুই-ধাপ যাচাইকরণ",
      "sessions": "সক্রিয় সেশন",
      "deleteAccount": "অ্যাকাউন্ট মুছুন"
    }
  },
  "editFriend": {
    "title": "বন্ধু সম্পাদনা করুন",
    "basicInfo": "মৌলিক তথ্য",
    "name": "নাম",
    "nickname": "ডাকনাম",
    "birthday": "জন্মদিন",
    "notes": "নোট",
    "tier": "স্তর",
    "contactFrequency": "যোগাযোগের ফ্রিকোয়েন্সি",
    "save": "পরিবর্তন সংরক্ষণ করুন",
    "delete": "বন্ধু মুছুন",
    "confirmDelete": "আপনি কি নিশ্চিত যে আপনি এই বন্ধুকে মুছতে চান?"
  },
  "followCreator": {
    "title": "ক্রিয়েটর অনুসরণ করুন",
    "search": "ক্রিয়েটর অনুসন্ধান করুন",
    "suggested": "আপনার জন্য প্রস্তাবিত",
    "categories": "বিভাগ",
    "trending": "ট্রেন্ডিং"
  },
  "dispatch": {
    "validation": {
      "required": "এই ক্ষেত্রটি প্রয়োজনীয়",
      "invalidEmail": "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন",
      "invalidPhone": "অনুগ্রহ করে একটি বৈধ ফোন নম্বর দিন",
      "minLength": "কমপক্ষে {{min}} অক্ষর হতে হবে",
      "maxLength": "{{max}} অক্ষরের বেশি হতে পারবে না",
      "passwordMatch": "পাসওয়ার্ড মিলতে হবে",
      "invalidUrl": "অনুগ্রহ করে একটি বৈধ URL দিন",
      "invalidDate": "অনুগ্রহ করে একটি বৈধ তারিখ দিন",
      "futureDate": "তারিখ ভবিষ্যতে হতে হবে",
      "pastDate": "তারিখ অতীতে হতে হবে"
    }
  },
  "privacy": {
    "title": "গোপনীয়তা নীতি",
    "lastUpdated": "সর্বশেষ আপডেট: {{date}}",
    "sections": {
      "collection": {
        "title": "তথ্য সংগ্রহ",
        "description": "আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে"
      },
      "usage": {
        "title": "তথ্যের ব্যবহার",
        "description": "আমরা সংগৃহীত তথ্য কীভাবে ব্যবহার করি"
      },
      "sharing": {
        "title": "তথ্য শেয়ারিং",
        "description": "কখন এবং কার সাথে আমরা আপনার তথ্য শেয়ার করি"
      },
      "security": {
        "title": "ডেটা নিরাপত্তা",
        "description": "আমরা কীভাবে আপনার তথ্য সুরক্ষিত করি"
      },
      "rights": {
        "title": "আপনার অধিকার",
        "description": "ব্যক্তিগত ডেটা সম্পর্কিত আপনার অধিকার"
      },
      "cookies": {
        "title": "কুকিজ এবং ট্র্যাকিং",
        "description": "কুকিজ এবং অনুরূপ প্রযুক্তির আমাদের ব্যবহার"
      },
      "children": {
        "title": "শিশুদের গোপনীয়তা",
        "description": "শিশুদের গোপনীয়তা সম্পর্কে আমাদের নীতি"
      },
      "changes": {
        "title": "নীতি পরিবর্তন",
        "description": "এই নীতির পরিবর্তন সম্পর্কে আমরা কীভাবে জানাই"
      },
      "contact": {
        "title": "যোগাযোগ করুন",
        "description": "গোপনীয়তা সম্পর্কিত প্রশ্নের জন্য যোগাযোগ করুন"
      }
    }
  },
  "terms": {
    "title": "সেবার শর্তাবলী",
    "lastUpdated": "সর্বশেষ আপডেট: {{date}}",
    "sections": {
      "acceptance": {
        "title": "শর্তাবলী স্বীকার",
        "description": "InnerFriend ব্যবহার করে, আপনি এই শর্তাবলীতে সম্মত হচ্ছেন"
      },
      "eligibility": {
        "title": "যোগ্যতা",
        "description": "আমাদের সেবা ব্যবহারের জন্য প্রয়োজনীয়তা"
      },
      "accounts": {
        "title": "ব্যবহারকারী অ্যাকাউন্ট",
        "description": "আপনার অ্যাকাউন্টের জন্য আপনার দায়িত্ব"
      },
      "content": {
        "title": "ব্যবহারকারী সামগ্রী",
        "description": "আপনি যে সামগ্রী জমা দেন তার নিয়ম"
      },
      "prohibited": {
        "title": "নিষিদ্ধ কার্যক্রম",
        "description": "আমাদের প্ল্যাটফর্মে কী নিষিদ্ধ"
      },
      "intellectual": {
        "title": "মেধাসত্ত্ব",
        "description": "কপিরাইট এবং ট্রেডমার্ক সম্পর্কে তথ্য"
      },
      "disclaimers": {
        "title": "দাবি পরিত্যাগ",
        "description": "InnerFriend কোনো ওয়ারেন্টি ছাড়াই 'যেমন আছে' প্রদান করা হয়"
      },
      "liability": {
        "title": "দায় সীমাবদ্ধতা",
        "description": "আমাদের দায়ের সীমাবদ্ধতা"
      },
      "termination": {
        "title": "সমাপ্তি",
        "description": "কখন অ্যাকাউন্ট সমাপ্ত করা যেতে পারে"
      },
      "governing": {
        "title": "প্রযোজ্য আইন",
        "description": "এই শর্তাবলী নিয়ন্ত্রণকারী আইন"
      },
      "contact": {
        "title": "যোগাযোগ করুন",
        "description": "এই শর্তাবলী সম্পর্কে প্রশ্নের জন্য যোগাযোগ করুন"
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

const localePath = path.join(__dirname, '../public/locales/bn/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, bengaliTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: bn');
console.log('Done! Bengali translations applied.');
