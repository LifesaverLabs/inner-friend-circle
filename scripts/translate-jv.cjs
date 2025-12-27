const fs = require('fs');
const path = require('path');

const javaneseTranslations = {
  "landing": {
    "hero": {
      "title": "Nyambung karo wong-wong sing penting tenan",
      "subtitle": "InnerFriend mbantu sampeyan ngatur hubungan sing paling cedhak lan tetep nyambung karo wong-wong sing sampeyan sayangi",
      "cta": "Miwiti",
      "learnMore": "Sinau luwih akeh"
    },
    "features": {
      "title": "Fitur",
      "organize": {
        "title": "Ngatur kanca",
        "description": "Kategorikake kanca-kanca cedhak sampeyan dadi tingkat miturut jinis hubungan lan kecedhakan"
      },
      "remind": {
        "title": "Tetep nyambung",
        "description": "Entuk pengeling-eling nalika wis suwe ora kontak kanggo njaga hubungan"
      },
      "emergency": {
        "title": "Jaringan darurat",
        "description": "Gawe lingkaran kepercayaan kanggo dihubungi nalika darurat"
      }
    },
    "privacy": {
      "title": "Privasi dhisik",
      "description": "Data sampeyan duweke sampeyan. Njaga kontrol lengkap ing grafik sosial sampeyan."
    },
    "cta": {
      "title": "Siap miwiti perjalanan sampeyan?",
      "subtitle": "Mulai mbangun hubungan sing migunani karo InnerFriend dina iki",
      "button": "Miwiti gratis"
    }
  },
  "auth": {
    "signIn": "Mlebu",
    "signUp": "Daftar",
    "signOut": "Metu",
    "email": "Email",
    "password": "Sandi",
    "confirmPassword": "Konfirmasi sandi",
    "forgotPassword": "Lali sandi?",
    "resetPassword": "Reset sandi",
    "noAccount": "Ora duwe akun?",
    "hasAccount": "Wis duwe akun?",
    "continueWith": "Lanjutake karo {{provider}}",
    "orContinueWith": "Utawa lanjutake karo",
    "signingIn": "Lagi mlebu...",
    "signingUp": "Lagi daftar...",
    "errors": {
      "invalidEmail": "Mangga lebokake alamat email sing bener",
      "invalidPassword": "Sandi kudu minimal 8 karakter",
      "passwordMismatch": "Sandi ora cocog",
      "emailInUse": "Email iki wis digunakake",
      "invalidCredentials": "Email utawa sandi salah",
      "generic": "Ana sing salah. Mangga coba maneh"
    }
  },
  "actions": {
    "save": "Simpen",
    "cancel": "Batal",
    "delete": "Busak",
    "edit": "Sunting",
    "add": "Tambah",
    "remove": "Copot",
    "confirm": "Konfirmasi",
    "back": "Bali",
    "next": "Sabanjure",
    "finish": "Rampung",
    "skip": "Lewati",
    "close": "Tutup",
    "search": "Goleki",
    "filter": "Filter",
    "sort": "Urut",
    "refresh": "Segarake",
    "loading": "Lagi dimuat...",
    "submit": "Kirim",
    "continue": "Lanjutake",
    "done": "Rampung",
    "apply": "Terapake",
    "clear": "Resiki",
    "selectAll": "Pilih kabeh",
    "deselectAll": "Batalake kabeh pilihan",
    "expandAll": "Ambakna kabeh",
    "collapseAll": "Ciutake kabeh"
  },
  "emptyState": {
    "noFriends": {
      "title": "Durung ana kanca",
      "description": "Mulai kanthi nambahake kanca pisanan sampeyan",
      "action": "Tambah kanca"
    },
    "noResults": {
      "title": "Ora ana asil",
      "description": "Ora ana sing cocog karo kriteria panelusuran sampeyan",
      "action": "Resiki filter"
    },
    "noNotifications": {
      "title": "Ora ana notifikasi",
      "description": "Sampeyan wis ndeleng kabeh!",
      "action": "Segarake"
    },
    "noActivity": {
      "title": "Ora ana aktivitas",
      "description": "Aktivitas anyar sampeyan bakal muncul ing kene",
      "action": "Miwiti"
    }
  },
  "dashboard": {
    "title": "Dasbor",
    "welcome": "Sugeng rawuh, {{name}}",
    "overview": "Ringkesan",
    "recentActivity": "Aktivitas anyar",
    "quickActions": "Aksi cepet",
    "stats": {
      "totalFriends": "Total kanca",
      "innerCircle": "Lingkaran njero",
      "needsAttention": "Butuh kawigaten",
      "lastContact": "Kontak pungkasan"
    },
    "widgets": {
      "upcomingBirthdays": "Ulang taun sing arep teka",
      "recentContacts": "Kontak anyar",
      "suggestedActions": "Aksi sing disaranake"
    }
  },
  "mission": {
    "title": "Misi",
    "subtitle": "Tetep nyambung karo hubungan sing penting",
    "description": "Misi mbantu sampeyan tetep kontak karo kanca-kanca",
    "complete": "Rampungake misi",
    "skip": "Lewati misi",
    "remind": "Eling-eling aku mengko",
    "empty": {
      "title": "Ora ana misi aktif",
      "description": "Sampeyan wis ngrampungake kabeh! Misi anyar bakal teka."
    },
    "types": {
      "call": "Misi nelpon",
      "message": "Misi pesen",
      "meetup": "Misi ketemu",
      "birthday": "Misi ulang taun",
      "checkin": "Misi check-in"
    }
  },
  "tending": {
    "title": "Ngurus kanca",
    "subtitle": "Hubungan kaya taman - butuh perawatan rutin",
    "description": "Kanca-kanca sing wektu ne kanggo dihubungi",
    "actions": {
      "markContacted": "Tandai wis dihubungi",
      "snooze": "Snooze",
      "viewProfile": "Deleng profil"
    },
    "filters": {
      "all": "Kabeh",
      "overdue": "Telat",
      "upcoming": "Arep teka",
      "byTier": "Miturut tingkat"
    },
    "frequency": {
      "daily": "Saben dina",
      "weekly": "Saben minggu",
      "biweekly": "Saben rong minggu",
      "monthly": "Saben wulan",
      "quarterly": "Saben telung wulan",
      "yearly": "Saben taun"
    },
    "status": {
      "onTrack": "Ing jalur",
      "dueSoon": "Wektu ne cedhak",
      "overdue": "Telat",
      "needsAttention": "Butuh kawigaten"
    },
    "reminderTypes": {
      "call": "Telpon",
      "text": "Pesen",
      "visit": "Tilik",
      "email": "Email"
    },
    "lastContact": "Kontak pungkasan",
    "contactDue": "Kontak kudu",
    "noContactYet": "Durung ana kontak",
    "daysOverdue": "Telat {{count}} dina",
    "dueIn": "Kudu ing {{count}} dina"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "Hubungi lingkaran kepercayaan sampeyan nalika paling butuh",
    "description": "Jaringan darurat yaiku kontak sing dipercaya sing bisa mbantu nalika krisis",
    "activate": "Aktifake SOS",
    "deactivate": "Nonaktifake SOS",
    "status": {
      "active": "SOS aktif",
      "inactive": "SOS ora aktif",
      "pending": "Lagi ngenteni..."
    },
    "contacts": {
      "title": "Kontak darurat",
      "add": "Tambah kontak darurat",
      "remove": "Copot saka dhaptar darurat",
      "empty": "Durung ana kontak darurat sing disetel"
    },
    "message": {
      "title": "Pesen darurat",
      "placeholder": "Lebokake pesen sing bakal dikirim menyang jaringan sampeyan",
      "default": "Aku butuh bantuan. Mangga hubungi aku yen bisa."
    },
    "settings": {
      "title": "Setelan SOS",
      "autoLocation": "Bagekake lokasi otomatis",
      "confirmActivation": "Konfirmasi sadurunge ngaktifake",
      "cooldown": "Cooldown antarane aktivasi"
    }
  },
  "callActions": {
    "call": "Telpon",
    "video": "Video call",
    "message": "Kirim pesen",
    "email": "Kirim email",
    "directions": "Arah",
    "schedule": "Jadwalake",
    "addNote": "Tambah cathetan",
    "recordCall": "Rekam telpon",
    "shareContact": "Bagekake kontak"
  },
  "onboarding": {
    "welcome": {
      "title": "Sugeng rawuh ing InnerFriend",
      "subtitle": "Ayo mulai ngatur hubungan sing migunani",
      "description": "Kita bakal takon sawetara pitakonan kanggo nyesuaikan pengalaman lingkaran njero sampeyan"
    },
    "steps": {
      "profile": "Gawe profil",
      "import": "Impor kontak",
      "categorize": "Kategorikake kanca",
      "preferences": "Preferensi"
    },
    "import": {
      "title": "Impor kontak",
      "description": "Mulai kanthi ngimpor kontak sampeyan sing wis ana",
      "fromPhone": "Saka kontak telpon",
      "fromGoogle": "Saka kontak Google",
      "manual": "Tambah manual",
      "skip": "Lewati saiki"
    },
    "complete": {
      "title": "Kabeh wis siap!",
      "subtitle": "Sampeyan siap mulai ngatur lingkaran njero sampeyan",
      "action": "Menyang dasbor"
    }
  },
  "keysShared": {
    "title": "Kunci sing dibagekake",
    "subtitle": "Atur akses menyang lingkaran kepercayaan sampeyan",
    "description": "Atur sapa sing bisa ngakses lingkaran njero sampeyan nalika darurat",
    "grant": "Wenehake kunci",
    "revoke": "Cabut kunci",
    "manage": "Atur kunci sing dibagekake",
    "permissions": {
      "view": "Deleng kontak",
      "contact": "Bisa dihubungi nalika darurat",
      "location": "Akses lokasi"
    },
    "doorKeyTree": {
      "title": "Wit kunci lawang",
      "description": "Wong-wong sing dipercaya sing bisa ngakses lingkaran njero sampeyan nalika darurat",
      "empty": "Durung ana kunci sing dibagekake"
    },
    "shareRequest": {
      "title": "Panjalukan kunci",
      "pending": "Panjalukan sing nunggu",
      "accept": "Trima",
      "decline": "Tolak"
    },
    "sharedWithYou": "Kunci sing dibagekake karo sampeyan",
    "sharedByYou": "Kunci sing sampeyan bagekake",
    "noSharedKeys": "Durung ana kunci sing dibagekake",
    "expiresAt": "Kadaluwarsa: {{date}}",
    "neverExpires": "Ora kadaluwarsa"
  },
  "reserved": {
    "title": "Bagian sing dicadhangake",
    "description": "Fitur iki dicadhangake kanggo pangguna premium",
    "upgrade": "Upgrade kanggo mbukak"
  },
  "addLinkedFriend": {
    "title": "Tambah kanca sing dilink",
    "subtitle": "Nyambung karo kanca-kanca sing wis nggunakake InnerFriend",
    "description": "Bagekake kode sampeyan ing ngisor iki utawa scan kode kanca",
    "searchPlaceholder": "Goleki miturut jeneng utawa email",
    "noResults": "Ora ana pangguna sing ditemokake",
    "sendRequest": "Kirim panjalukan koneksi",
    "pending": "Panjalukan nunggu",
    "connected": "Wis nyambung",
    "yourCode": "Kode sampeyan",
    "scanCode": "Scan kode",
    "enterCode": "Lebokake kode",
    "shareCode": "Bagekake kode"
  },
  "gdpr": {
    "title": "Privasi data",
    "subtitle": "Sinau kepiye kita nglumpukake, nggunakake, lan nglindhungi data pribadi sampeyan",
    "consent": {
      "title": "Manajemen persetujuan",
      "description": "Atur persetujuan pemrosesan data sampeyan",
      "analytics": "Cookie analitik",
      "marketing": "Komunikasi pemasaran",
      "thirdParty": "Berbagi pihak ketiga",
      "withdraw": "Cabut persetujuan"
    },
    "rights": {
      "title": "Hak sampeyan",
      "access": "Akses data",
      "rectification": "Koreksi data",
      "erasure": "Penghapusan data",
      "portability": "Portabilitas data",
      "restriction": "Pembatasan pemrosesan",
      "objection": "Keberatan pemrosesan"
    },
    "export": {
      "title": "Ekspor data",
      "description": "Unduh salinan kabeh data pribadi sampeyan",
      "button": "Ekspor data",
      "processing": "Lagi nyiapake ekspor...",
      "ready": "Data siap diunduh"
    },
    "delete": {
      "title": "Busak akun",
      "description": "Busak akun sampeyan lan kabeh data sing gegandhengan kanthi permanen. Aksi iki ora bisa dibatalake.",
      "button": "Busak akun",
      "confirm": "Ketik 'BUSAK' kanggo konfirmasi",
      "warning": "Aksi iki ora bisa dibatalake"
    },
    "policy": {
      "title": "Kebijakan privasi",
      "lastUpdated": "Diperbarui pungkasan",
      "readFull": "Waca kebijakan lengkap"
    }
  },
  "admin": {
    "title": "Panel admin",
    "dashboard": "Dasbor admin",
    "users": {
      "title": "Manajemen pangguna",
      "list": "Kabeh pangguna",
      "active": "Pangguna aktif",
      "suspended": "Pangguna sing dihentikan",
      "invite": "Undang pangguna"
    },
    "settings": {
      "title": "Setelan sistem",
      "general": "Setelan umum",
      "security": "Setelan keamanan",
      "notifications": "Setelan notifikasi"
    },
    "logs": {
      "title": "Log sistem",
      "audit": "Log audit",
      "error": "Log kesalahan",
      "access": "Log akses"
    },
    "analytics": {
      "title": "Analitik",
      "overview": "Ringkesan",
      "users": "Analitik pangguna",
      "engagement": "Metrik keterlibatan"
    }
  },
  "dev": {
    "title": "Setelan pengembang",
    "apiKeys": "Kunci API",
    "webhooks": "Webhook",
    "logs": "Log pengembang",
    "testing": "Mode pengujian",
    "documentation": "Dokumentasi API"
  },
  "contactMethods": {
    "title": "Metode kontak",
    "phone": "Telpon",
    "email": "Email",
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
    "other": "Liyane",
    "preferred": "Metode pilihan",
    "add": "Tambah metode kontak",
    "primary": "Utama",
    "secondary": "Sekunder"
  },
  "post": {
    "title": "Gawe posting",
    "placeholder": "Sampeyan lagi mikir apa?",
    "submit": "Posting",
    "visibility": {
      "public": "Umum",
      "friends": "Mung kanca",
      "private": "Pribadi"
    },
    "actions": {
      "like": "Seneng",
      "comment": "Komentar",
      "share": "Bagekake",
      "save": "Simpen"
    }
  },
  "parasocial": {
    "title": "Tututake kreator",
    "subtitle": "Nyambung karo kreator favorit sampeyan",
    "description": "Tututake kreator favorit sampeyan lan entuk pembaruan saka wong-wong mau",
    "follow": "Tututake",
    "unfollow": "Batal tututake",
    "following": "Lagi nututake",
    "followers": "Pengikut",
    "noCreators": "Ora ana kreator sing ditemokake"
  },
  "profileSettings": {
    "title": "Setelan profil",
    "personalInfo": "Informasi pribadi",
    "displayName": "Jeneng tampilan",
    "bio": "Bio",
    "avatar": "Avatar",
    "changeAvatar": "Ganti avatar",
    "removeAvatar": "Copot avatar",
    "privacy": {
      "title": "Setelan privasi",
      "profileVisibility": "Visibilitas profil",
      "showOnline": "Tuduhake status online",
      "showLastSeen": "Tuduhake pungkasan katon"
    },
    "notifications": {
      "title": "Setelan notifikasi",
      "email": "Notifikasi email",
      "push": "Notifikasi push",
      "sms": "Notifikasi SMS"
    },
    "account": {
      "title": "Setelan akun",
      "changePassword": "Ganti sandi",
      "twoFactor": "Otentikasi dua faktor",
      "sessions": "Sesi aktif",
      "deleteAccount": "Busak akun"
    }
  },
  "editFriend": {
    "title": "Sunting kanca",
    "basicInfo": "Informasi dasar",
    "name": "Jeneng",
    "nickname": "Jeneng sesingidan",
    "birthday": "Ulang taun",
    "notes": "Cathetan",
    "tier": "Tingkat",
    "contactFrequency": "Frekuensi kontak",
    "save": "Simpen owah-owahan",
    "delete": "Busak kanca",
    "confirmDelete": "Sampeyan yakin arep mbusak kanca iki?"
  },
  "followCreator": {
    "title": "Tututake kreator",
    "search": "Goleki kreator",
    "suggested": "Disaranake kanggo sampeyan",
    "categories": "Kategori",
    "trending": "Trending"
  },
  "dispatch": {
    "validation": {
      "required": "Kolom iki dibutuhake",
      "invalidEmail": "Mangga lebokake alamat email sing bener",
      "invalidPhone": "Mangga lebokake nomor telpon sing bener",
      "minLength": "Kudu minimal {{min}} karakter",
      "maxLength": "Ora bisa luwih saka {{max}} karakter",
      "passwordMatch": "Sandi kudu cocog",
      "invalidUrl": "Mangga lebokake URL sing bener",
      "invalidDate": "Mangga lebokake tanggal sing bener",
      "futureDate": "Tanggal kudu ing mangsa ngarep",
      "pastDate": "Tanggal kudu ing jaman kepungkur"
    }
  },
  "privacy": {
    "title": "Kebijakan privasi",
    "lastUpdated": "Diperbarui pungkasan: {{date}}",
    "sections": {
      "collection": {
        "title": "Pengumpulan informasi",
        "description": "Informasi apa sing kita kumpulake lan kepiye"
      },
      "usage": {
        "title": "Penggunaan informasi",
        "description": "Kepiye kita nggunakake informasi sing dikumpulake"
      },
      "sharing": {
        "title": "Berbagi informasi",
        "description": "Kapan lan karo sapa kita mbagekake informasi sampeyan"
      },
      "security": {
        "title": "Keamanan data",
        "description": "Kepiye kita nglindhungi informasi sampeyan"
      },
      "rights": {
        "title": "Hak sampeyan",
        "description": "Hak sampeyan babagan data pribadi"
      },
      "cookies": {
        "title": "Cookie lan pelacakan",
        "description": "Panggunaan cookie lan teknologi serupa"
      },
      "children": {
        "title": "Privasi bocah",
        "description": "Kebijakan kita babagan privasi bocah"
      },
      "changes": {
        "title": "Perubahan kebijakan",
        "description": "Kepiye kita menehi kabar babagan perubahan kebijakan iki"
      },
      "contact": {
        "title": "Hubungi kita",
        "description": "Hubungi kanggo pitakonan privasi"
      }
    }
  },
  "terms": {
    "title": "Syarat layanan",
    "lastUpdated": "Diperbarui pungkasan: {{date}}",
    "sections": {
      "acceptance": {
        "title": "Penerimaan syarat",
        "description": "Kanthi nggunakake InnerFriend, sampeyan setuju karo syarat-syarat iki"
      },
      "eligibility": {
        "title": "Kelayakan",
        "description": "Persyaratan kanggo nggunakake layanan kita"
      },
      "accounts": {
        "title": "Akun pangguna",
        "description": "Tanggung jawab sampeyan kanggo akun sampeyan"
      },
      "content": {
        "title": "Konten pangguna",
        "description": "Aturan babagan konten sing sampeyan kirim"
      },
      "prohibited": {
        "title": "Aktivitas sing dilarang",
        "description": "Apa sing dilarang ing platform kita"
      },
      "intellectual": {
        "title": "Properti intelektual",
        "description": "Informasi babagan hak cipta lan merek dagang"
      },
      "disclaimers": {
        "title": "Penafian",
        "description": "InnerFriend diwenehake 'apa anane' tanpa jaminan"
      },
      "liability": {
        "title": "Batasan tanggung jawab",
        "description": "Batasan tanggung jawab kita"
      },
      "termination": {
        "title": "Penghentian",
        "description": "Kapan akun bisa dihentikan"
      },
      "governing": {
        "title": "Hukum sing berlaku",
        "description": "Hukum sing ngatur syarat-syarat iki"
      },
      "contact": {
        "title": "Hubungi kita",
        "description": "Hubungi kanggo pitakonan babagan syarat-syarat iki"
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

const localePath = path.join(__dirname, '../public/locales/jv/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, javaneseTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: jv');
console.log('Done! Javanese translations applied.');
