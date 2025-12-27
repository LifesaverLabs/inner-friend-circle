import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional translations for tending.periods, language.*, and shareDialog.export
const translations = {
  // Arabic
  ar: {
    tending: {
      periods: {
        core: "هذا الأسبوع",
        inner: "هذين الأسبوعين",
        outer: "هذين الشهرين"
      }
    },
    language: {
      contribute: "ساهم",
      currentlyAvailable: "متوفر حالياً بـ {{count}} لغة. ساعدنا في إضافة المزيد!",
      becomeTranslator: "كن مترجماً",
      openSourceNote: "InnerFriend مفتوح المصدر. ترجماتك تساعد في بناء مجتمع أكثر شمولاً."
    },
    shareDialog: {
      export: {
        header: "دوائر أصدقائي المقربين",
        healthcareHeader: "شبكة الدعم الاجتماعي السرية للمريض",
        footer: "تم إنشاؤه باستخدام InnerFriend",
        empty: "فارغ"
      }
    }
  },

  // German
  de: {
    tending: {
      periods: {
        core: "diese Woche",
        inner: "diese zwei Wochen",
        outer: "diese zwei Monate"
      }
    },
    language: {
      contribute: "Beitragen",
      currentlyAvailable: "Derzeit in {{count}} Sprachen verfügbar. Hilf uns, mehr hinzuzufügen!",
      becomeTranslator: "Übersetzer werden",
      openSourceNote: "InnerFriend ist Open Source. Deine Übersetzungen helfen, eine inklusivere Gemeinschaft aufzubauen."
    },
    shareDialog: {
      export: {
        header: "Meine Inner Friend Circles",
        healthcareHeader: "VERTRAULICHES SOZIALES UNTERSTÜTZUNGSNETZWERK DES PATIENTEN",
        footer: "Erstellt mit InnerFriend",
        empty: "leer"
      }
    }
  },

  // French
  fr: {
    tending: {
      periods: {
        core: "cette semaine",
        inner: "ces deux semaines",
        outer: "ces deux mois"
      }
    },
    language: {
      contribute: "Contribuer",
      currentlyAvailable: "Actuellement disponible en {{count}} langues. Aidez-nous à en ajouter plus !",
      becomeTranslator: "Devenir traducteur",
      openSourceNote: "InnerFriend est open source. Vos traductions aident à construire une communauté plus inclusive."
    },
    shareDialog: {
      export: {
        header: "Mes cercles d'amis proches",
        healthcareHeader: "RÉSEAU DE SOUTIEN SOCIAL CONFIDENTIEL DU PATIENT",
        footer: "Créé avec InnerFriend",
        empty: "vide"
      }
    }
  },

  // Hebrew
  he: {
    tending: {
      periods: {
        core: "השבוע הזה",
        inner: "השבועיים האלה",
        outer: "החודשיים האלה"
      }
    },
    language: {
      contribute: "תרום",
      currentlyAvailable: "זמין כעת ב-{{count}} שפות. עזור לנו להוסיף עוד!",
      becomeTranslator: "הפוך למתרגם",
      openSourceNote: "InnerFriend הוא קוד פתוח. התרגומים שלך עוזרים לבנות קהילה מכילה יותר."
    },
    shareDialog: {
      export: {
        header: "חוגי החברים הקרובים שלי",
        healthcareHeader: "רשת תמיכה חברתית חסויה של המטופל",
        footer: "נוצר עם InnerFriend",
        empty: "ריק"
      }
    }
  },

  // Hindi
  hi: {
    tending: {
      periods: {
        core: "इस सप्ताह",
        inner: "इन दो सप्ताहों में",
        outer: "इन दो महीनों में"
      }
    },
    language: {
      contribute: "योगदान करें",
      currentlyAvailable: "वर्तमान में {{count}} भाषाओं में उपलब्ध। और जोड़ने में हमारी मदद करें!",
      becomeTranslator: "अनुवादक बनें",
      openSourceNote: "InnerFriend ओपन सोर्स है। आपके अनुवाद अधिक समावेशी समुदाय बनाने में मदद करते हैं।"
    },
    shareDialog: {
      export: {
        header: "मेरे करीबी मित्रों के सर्कल",
        healthcareHeader: "गोपनीय रोगी सामाजिक सहायता नेटवर्क",
        footer: "InnerFriend के साथ बनाया गया",
        empty: "खाली"
      }
    }
  },

  // Italian
  it: {
    tending: {
      periods: {
        core: "questa settimana",
        inner: "queste due settimane",
        outer: "questi due mesi"
      }
    },
    language: {
      contribute: "Contribuisci",
      currentlyAvailable: "Attualmente disponibile in {{count}} lingue. Aiutaci ad aggiungerne altre!",
      becomeTranslator: "Diventa un traduttore",
      openSourceNote: "InnerFriend è open source. Le tue traduzioni aiutano a costruire una comunità più inclusiva."
    },
    shareDialog: {
      export: {
        header: "I miei cerchi di amici intimi",
        healthcareHeader: "RETE DI SUPPORTO SOCIALE CONFIDENZIALE DEL PAZIENTE",
        footer: "Creato con InnerFriend",
        empty: "vuoto"
      }
    }
  },

  // Japanese
  ja: {
    tending: {
      periods: {
        core: "今週",
        inner: "この2週間",
        outer: "この2ヶ月"
      }
    },
    language: {
      contribute: "貢献する",
      currentlyAvailable: "現在{{count}}言語で利用可能です。もっと追加するのを手伝ってください！",
      becomeTranslator: "翻訳者になる",
      openSourceNote: "InnerFriendはオープンソースです。あなたの翻訳がより包括的なコミュニティ構築に役立ちます。"
    },
    shareDialog: {
      export: {
        header: "私の親友サークル",
        healthcareHeader: "機密患者社会的支援ネットワーク",
        footer: "InnerFriendで作成",
        empty: "空"
      }
    }
  },

  // Korean
  ko: {
    tending: {
      periods: {
        core: "이번 주",
        inner: "이 2주간",
        outer: "이 2개월간"
      }
    },
    language: {
      contribute: "기여하기",
      currentlyAvailable: "현재 {{count}}개 언어로 이용 가능합니다. 더 추가하도록 도와주세요!",
      becomeTranslator: "번역가 되기",
      openSourceNote: "InnerFriend는 오픈 소스입니다. 당신의 번역이 더 포용적인 커뮤니티를 만드는 데 도움이 됩니다."
    },
    shareDialog: {
      export: {
        header: "나의 친한 친구 서클",
        healthcareHeader: "기밀 환자 사회적 지원 네트워크",
        footer: "InnerFriend로 생성됨",
        empty: "비어 있음"
      }
    }
  },

  // Portuguese
  pt: {
    tending: {
      periods: {
        core: "esta semana",
        inner: "estas duas semanas",
        outer: "estes dois meses"
      }
    },
    language: {
      contribute: "Contribuir",
      currentlyAvailable: "Atualmente disponível em {{count}} idiomas. Ajude-nos a adicionar mais!",
      becomeTranslator: "Torne-se um Tradutor",
      openSourceNote: "InnerFriend é código aberto. Suas traduções ajudam a construir uma comunidade mais inclusiva."
    },
    shareDialog: {
      export: {
        header: "Meus Círculos de Amigos Íntimos",
        healthcareHeader: "REDE CONFIDENCIAL DE APOIO SOCIAL DO PACIENTE",
        footer: "Criado com InnerFriend",
        empty: "vazio"
      }
    }
  },

  // Russian
  ru: {
    tending: {
      periods: {
        core: "на этой неделе",
        inner: "за эти две недели",
        outer: "за эти два месяца"
      }
    },
    language: {
      contribute: "Внести вклад",
      currentlyAvailable: "Сейчас доступно на {{count}} языках. Помогите нам добавить больше!",
      becomeTranslator: "Стать переводчиком",
      openSourceNote: "InnerFriend — открытый исходный код. Ваши переводы помогают создать более инклюзивное сообщество."
    },
    shareDialog: {
      export: {
        header: "Мои круги близких друзей",
        healthcareHeader: "КОНФИДЕНЦИАЛЬНАЯ СЕТЬ СОЦИАЛЬНОЙ ПОДДЕРЖКИ ПАЦИЕНТА",
        footer: "Создано с InnerFriend",
        empty: "пусто"
      }
    }
  },

  // Spanish
  es: {
    tending: {
      periods: {
        core: "esta semana",
        inner: "estas dos semanas",
        outer: "estos dos meses"
      }
    },
    language: {
      contribute: "Contribuir",
      currentlyAvailable: "Actualmente disponible en {{count}} idiomas. ¡Ayúdanos a añadir más!",
      becomeTranslator: "Conviértete en Traductor",
      openSourceNote: "InnerFriend es código abierto. Tus traducciones ayudan a construir una comunidad más inclusiva."
    },
    shareDialog: {
      export: {
        header: "Mis Círculos de Amigos Cercanos",
        healthcareHeader: "RED CONFIDENCIAL DE APOYO SOCIAL DEL PACIENTE",
        footer: "Creado con InnerFriend",
        empty: "vacío"
      }
    }
  },

  // Turkish
  tr: {
    tending: {
      periods: {
        core: "bu hafta",
        inner: "bu iki hafta",
        outer: "bu iki ay"
      }
    },
    language: {
      contribute: "Katkıda Bulun",
      currentlyAvailable: "Şu anda {{count}} dilde mevcut. Daha fazlasını eklememize yardım edin!",
      becomeTranslator: "Çevirmen Olun",
      openSourceNote: "InnerFriend açık kaynaklıdır. Çevirileriniz daha kapsayıcı bir topluluk oluşturmaya yardımcı olur."
    },
    shareDialog: {
      export: {
        header: "Yakın Arkadaş Çevrelerim",
        healthcareHeader: "GİZLİ HASTA SOSYAL DESTEK AĞI",
        footer: "InnerFriend ile oluşturuldu",
        empty: "boş"
      }
    }
  },

  // Chinese
  zh: {
    tending: {
      periods: {
        core: "本周",
        inner: "这两周",
        outer: "这两个月"
      }
    },
    language: {
      contribute: "贡献",
      currentlyAvailable: "目前支持 {{count}} 种语言。帮助我们添加更多！",
      becomeTranslator: "成为翻译者",
      openSourceNote: "InnerFriend 是开源的。您的翻译有助于建立一个更具包容性的社区。"
    },
    shareDialog: {
      export: {
        header: "我的亲密朋友圈",
        healthcareHeader: "机密患者社会支持网络",
        footer: "由 InnerFriend 创建",
        empty: "空"
      }
    }
  },

  // Vietnamese
  vi: {
    tending: {
      periods: {
        core: "tuần này",
        inner: "hai tuần này",
        outer: "hai tháng này"
      }
    },
    language: {
      contribute: "Đóng góp",
      currentlyAvailable: "Hiện có sẵn bằng {{count}} ngôn ngữ. Hãy giúp chúng tôi thêm nhiều hơn!",
      becomeTranslator: "Trở thành Phiên dịch viên",
      openSourceNote: "InnerFriend là mã nguồn mở. Bản dịch của bạn giúp xây dựng cộng đồng hòa nhập hơn."
    },
    shareDialog: {
      export: {
        header: "Vòng tròn bạn thân của tôi",
        healthcareHeader: "MẠNG LƯỚI HỖ TRỢ XÃ HỘI BẢO MẬT CỦA BỆNH NHÂN",
        footer: "Tạo bằng InnerFriend",
        empty: "trống"
      }
    }
  },

  // Bengali
  bn: {
    tending: {
      periods: {
        core: "এই সপ্তাহে",
        inner: "এই দুই সপ্তাহে",
        outer: "এই দুই মাসে"
      }
    },
    language: {
      contribute: "অবদান রাখুন",
      currentlyAvailable: "বর্তমানে {{count}} টি ভাষায় উপলব্ধ। আরও যোগ করতে আমাদের সাহায্য করুন!",
      becomeTranslator: "অনুবাদক হন",
      openSourceNote: "InnerFriend ওপেন সোর্স। আপনার অনুবাদ একটি আরও অন্তর্ভুক্তিমূলক সম্প্রদায় গড়তে সাহায্য করে।"
    },
    shareDialog: {
      export: {
        header: "আমার ঘনিষ্ঠ বন্ধু মহল",
        healthcareHeader: "গোপনীয় রোগীর সামাজিক সহায়তা নেটওয়ার্ক",
        footer: "InnerFriend দিয়ে তৈরি",
        empty: "খালি"
      }
    }
  },

  // Urdu
  ur: {
    tending: {
      periods: {
        core: "اس ہفتے",
        inner: "ان دو ہفتوں میں",
        outer: "ان دو مہینوں میں"
      }
    },
    language: {
      contribute: "تعاون کریں",
      currentlyAvailable: "فی الحال {{count}} زبانوں میں دستیاب۔ مزید شامل کرنے میں ہماری مدد کریں!",
      becomeTranslator: "مترجم بنیں",
      openSourceNote: "InnerFriend اوپن سورس ہے۔ آپ کے ترجمے زیادہ جامع کمیونٹی بنانے میں مدد کرتے ہیں۔"
    },
    shareDialog: {
      export: {
        header: "میرے قریبی دوستوں کے حلقے",
        healthcareHeader: "مریض کا رازداری سماجی معاونت نیٹ ورک",
        footer: "InnerFriend سے بنایا گیا",
        empty: "خالی"
      }
    }
  },

  // Javanese
  jv: {
    tending: {
      periods: {
        core: "minggu iki",
        inner: "rong minggu iki",
        outer: "rong sasi iki"
      }
    },
    language: {
      contribute: "Sumbang",
      currentlyAvailable: "Saiki kasedhiya ing {{count}} basa. Tulung tambahin liyane!",
      becomeTranslator: "Dadi Penerjemah",
      openSourceNote: "InnerFriend iku sumber terbuka. Terjemahanmu mbantu mbangun komunitas sing luwih inklusif."
    },
    shareDialog: {
      export: {
        header: "Lingkaran Kanca Cedak",
        healthcareHeader: "JARINGAN DHUKUNGAN SOSIAL RAHASIA PASIEN",
        footer: "Digawe nganggo InnerFriend",
        empty: "kosong"
      }
    }
  },

  // Marathi
  mr: {
    tending: {
      periods: {
        core: "या आठवड्यात",
        inner: "या दोन आठवड्यांत",
        outer: "या दोन महिन्यांत"
      }
    },
    language: {
      contribute: "योगदान द्या",
      currentlyAvailable: "सध्या {{count}} भाषांमध्ये उपलब्ध. अधिक जोडण्यात आम्हाला मदत करा!",
      becomeTranslator: "अनुवादक व्हा",
      openSourceNote: "InnerFriend ओपन सोर्स आहे. तुमचे अनुवाद अधिक समावेशक समुदाय तयार करण्यात मदत करतात."
    },
    shareDialog: {
      export: {
        header: "माझी जवळच्या मित्रांची मंडळे",
        healthcareHeader: "गोपनीय रुग्ण सामाजिक सहाय्य नेटवर्क",
        footer: "InnerFriend सह तयार केले",
        empty: "रिक्त"
      }
    }
  },

  // Tamil
  ta: {
    tending: {
      periods: {
        core: "இந்த வாரம்",
        inner: "இந்த இரண்டு வாரங்களில்",
        outer: "இந்த இரண்டு மாதங்களில்"
      }
    },
    language: {
      contribute: "பங்களிக்கவும்",
      currentlyAvailable: "தற்போது {{count}} மொழிகளில் கிடைக்கிறது. மேலும் சேர்க்க உதவுங்கள்!",
      becomeTranslator: "மொழிபெயர்ப்பாளராகுங்கள்",
      openSourceNote: "InnerFriend திறந்த மூலமாகும். உங்கள் மொழிபெயர்ப்புகள் மேலும் உள்ளடக்கிய சமூகத்தை உருவாக்க உதவுகின்றன."
    },
    shareDialog: {
      export: {
        header: "என் நெருங்கிய நண்பர்கள் வட்டங்கள்",
        healthcareHeader: "இரகசிய நோயாளி சமூக ஆதரவு நெட்வொர்க்",
        footer: "InnerFriend மூலம் உருவாக்கப்பட்டது",
        empty: "காலியாக"
      }
    }
  },

  // Telugu
  te: {
    tending: {
      periods: {
        core: "ఈ వారం",
        inner: "ఈ రెండు వారాల్లో",
        outer: "ఈ రెండు నెలల్లో"
      }
    },
    language: {
      contribute: "సహకరించండి",
      currentlyAvailable: "ప్రస్తుతం {{count}} భాషల్లో అందుబాటులో ఉంది. మరిన్ని జోడించడంలో మాకు సహాయం చేయండి!",
      becomeTranslator: "అనువాదకుడు అవ్వండి",
      openSourceNote: "InnerFriend ఓపెన్ సోర్స్. మీ అనువాదాలు మరింత సమ్మిళిత సమాజాన్ని నిర్మించడంలో సహాయపడతాయి."
    },
    shareDialog: {
      export: {
        header: "నా సన్నిహిత స్నేహితుల వలయాలు",
        healthcareHeader: "రహస్య రోగి సామాజిక మద్దతు నెట్‌వర్క్",
        footer: "InnerFriend తో రూపొందించబడింది",
        empty: "ఖాళీ"
      }
    }
  },

  // Punjabi
  pa: {
    tending: {
      periods: {
        core: "ਇਸ ਹਫ਼ਤੇ",
        inner: "ਇਹਨਾਂ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ",
        outer: "ਇਹਨਾਂ ਦੋ ਮਹੀਨਿਆਂ ਵਿੱਚ"
      }
    },
    language: {
      contribute: "ਯੋਗਦਾਨ ਪਾਓ",
      currentlyAvailable: "ਵਰਤਮਾਨ ਵਿੱਚ {{count}} ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ। ਹੋਰ ਜੋੜਨ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ!",
      becomeTranslator: "ਅਨੁਵਾਦਕ ਬਣੋ",
      openSourceNote: "InnerFriend ਓਪਨ ਸੋਰਸ ਹੈ। ਤੁਹਾਡੇ ਅਨੁਵਾਦ ਵਧੇਰੇ ਸਮਾਵੇਸ਼ੀ ਭਾਈਚਾਰਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।"
    },
    shareDialog: {
      export: {
        header: "ਮੇਰੇ ਨਜ਼ਦੀਕੀ ਦੋਸਤਾਂ ਦੇ ਚੱਕਰ",
        healthcareHeader: "ਗੁਪਤ ਮਰੀਜ਼ ਸਮਾਜਿਕ ਸਹਾਇਤਾ ਨੈੱਟਵਰਕ",
        footer: "InnerFriend ਨਾਲ ਬਣਾਇਆ ਗਿਆ",
        empty: "ਖਾਲੀ"
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

console.log('Done! Additional translations applied.');
