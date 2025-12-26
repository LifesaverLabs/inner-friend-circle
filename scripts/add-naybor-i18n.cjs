/**
 * Script to add missing naybor tier translations to all locales
 * Run with: node scripts/add-naybor-i18n.cjs
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// Naybor translations for all languages
const nayborTranslations = {
  en: {
    underMinWarning: "You only have {{count}} naybor(s) — we recommend at least 3",
    underMinDescription: "Having trusted naybors nearby is essential for emergencies, mutual aid, and building community resilience. Introduce yourself to your neighbors!",
    mrRogersQuote: "\"Won't you be my neighbor?\" — Fred Rogers"
  },
  ar: {
    underMinWarning: "لديك فقط {{count}} جار(ين) — نوصي بما لا يقل عن 3",
    underMinDescription: "وجود جيران موثوقين قريبين أمر ضروري للطوارئ والمساعدة المتبادلة وبناء مرونة المجتمع. عرّف نفسك لجيرانك!",
    mrRogersQuote: "\"ألن تكون جاري؟\" — فريد روجرز"
  },
  bled: {
    underMinWarning: "You only haz {{count}} naybor(z) — we rekumend at leest 3",
    underMinDescription: "Havin trusted naybors nerby iz essential 4 emergensiez, mutual aid, and bildin komunity reziliens. Introduce yoself 2 ur naybors!",
    mrRogersQuote: "\"Wont u be my naybor?\" — Fred Rogerz"
  },
  bn: {
    underMinWarning: "আপনার শুধু {{count}} জন প্রতিবেশী আছে — আমরা কমপক্ষে ৩ জন সুপারিশ করি",
    underMinDescription: "জরুরি অবস্থা, পারস্পরিক সহায়তা এবং সম্প্রদায়ের স্থিতিস্থাপকতা তৈরির জন্য নিকটবর্তী বিশ্বস্ত প্রতিবেশী থাকা অপরিহার্য। আপনার প্রতিবেশীদের সাথে পরিচিত হন!",
    mrRogersQuote: "\"তুমি কি আমার প্রতিবেশী হবে?\" — ফ্রেড রজার্স"
  },
  de: {
    underMinWarning: "Sie haben nur {{count}} Nachbar(n) — wir empfehlen mindestens 3",
    underMinDescription: "Vertrauenswürdige Nachbarn in der Nähe zu haben ist unerlässlich für Notfälle, gegenseitige Hilfe und den Aufbau von Gemeinschaftsresilienz. Stellen Sie sich Ihren Nachbarn vor!",
    mrRogersQuote: "\"Willst du nicht mein Nachbar sein?\" — Fred Rogers"
  },
  es: {
    underMinWarning: "Solo tienes {{count}} vecino(s) — recomendamos al menos 3",
    underMinDescription: "Tener vecinos de confianza cerca es esencial para emergencias, ayuda mutua y construir resiliencia comunitaria. ¡Preséntate a tus vecinos!",
    mrRogersQuote: "\"¿No quieres ser mi vecino?\" — Fred Rogers"
  },
  fr: {
    underMinWarning: "Vous n'avez que {{count}} voisin(s) — nous recommandons au moins 3",
    underMinDescription: "Avoir des voisins de confiance à proximité est essentiel pour les urgences, l'entraide et la résilience communautaire. Présentez-vous à vos voisins !",
    mrRogersQuote: "\"Ne veux-tu pas être mon voisin ?\" — Fred Rogers"
  },
  he: {
    underMinWarning: "יש לך רק {{count}} שכן(ים) — אנו ממליצים על לפחות 3",
    underMinDescription: "שכנים אמינים בקרבת מקום חיוניים למקרי חירום, עזרה הדדית ובניית חוסן קהילתי. הציגו את עצמכם לשכנים שלכם!",
    mrRogersQuote: "\"האם תהיה השכן שלי?\" — פרד רוג'רס"
  },
  hi: {
    underMinWarning: "आपके पास केवल {{count}} पड़ोसी हैं — हम कम से कम 3 की सिफारिश करते हैं",
    underMinDescription: "आपातकाल, पारस्परिक सहायता और सामुदायिक लचीलापन बनाने के लिए पास में विश्वसनीय पड़ोसियों का होना आवश्यक है। अपने पड़ोसियों से अपना परिचय दें!",
    mrRogersQuote: "\"क्या आप मेरे पड़ोसी नहीं होंगे?\" — फ्रेड रॉजर्स"
  },
  it: {
    underMinWarning: "Hai solo {{count}} vicino/i — consigliamo almeno 3",
    underMinDescription: "Avere vicini fidati nelle vicinanze è essenziale per le emergenze, l'aiuto reciproco e la costruzione della resilienza della comunità. Presentati ai tuoi vicini!",
    mrRogersQuote: "\"Non vuoi essere il mio vicino?\" — Fred Rogers"
  },
  ja: {
    underMinWarning: "{{count}}人のご近所さんしかいません — 最低3人をお勧めします",
    underMinDescription: "信頼できるご近所さんが近くにいることは、緊急時、相互扶助、コミュニティのレジリエンス構築に不可欠です。ご近所さんに自己紹介しましょう！",
    mrRogersQuote: "「私のご近所さんになってくれませんか？」— フレッド・ロジャース"
  },
  jv: {
    underMinWarning: "Sampeyan mung duwe {{count}} tangga — kita nyaranake paling ora 3",
    underMinDescription: "Duwe tangga sing dipercaya cedhak iku penting kanggo darurat, bantuan bebarengan, lan mbangun ketahanan komunitas. Kenalake dhewe marang tanggamu!",
    mrRogersQuote: "\"Apa sampeyan ora dadi tanggaku?\" — Fred Rogers"
  },
  ko: {
    underMinWarning: "{{count}}명의 이웃밖에 없습니다 — 최소 3명을 권장합니다",
    underMinDescription: "가까이에 믿을 수 있는 이웃이 있는 것은 비상시, 상호 부조, 그리고 지역 사회 회복력 구축에 필수적입니다. 이웃에게 자신을 소개하세요!",
    mrRogersQuote: "\"제 이웃이 되어 주시겠어요?\" — 프레드 로저스"
  },
  mr: {
    underMinWarning: "तुमच्याकडे फक्त {{count}} शेजारी आहे — आम्ही किमान 3 ची शिफारस करतो",
    underMinDescription: "आपत्कालीन परिस्थितीत, परस्पर मदत आणि समुदाय लवचिकता निर्माण करण्यासाठी विश्वासार्ह शेजारी जवळ असणे आवश्यक आहे. तुमच्या शेजाऱ्यांशी स्वतःचा परिचय करून द्या!",
    mrRogersQuote: "\"तुम्ही माझे शेजारी व्हाल का?\" — फ्रेड रॉजर्स"
  },
  pa: {
    underMinWarning: "ਤੁਹਾਡੇ ਕੋਲ ਸਿਰਫ਼ {{count}} ਗੁਆਂਢੀ ਹਨ — ਅਸੀਂ ਘੱਟੋ-ਘੱਟ 3 ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦੇ ਹਾਂ",
    underMinDescription: "ਐਮਰਜੈਂਸੀ, ਆਪਸੀ ਸਹਾਇਤਾ ਅਤੇ ਭਾਈਚਾਰਕ ਲਚਕੀਲਾਪਣ ਬਣਾਉਣ ਲਈ ਨੇੜੇ ਭਰੋਸੇਯੋਗ ਗੁਆਂਢੀ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ। ਆਪਣੇ ਗੁਆਂਢੀਆਂ ਨਾਲ ਆਪਣੀ ਜਾਣ-ਪਛਾਣ ਕਰਵਾਓ!",
    mrRogersQuote: "\"ਕੀ ਤੁਸੀਂ ਮੇਰੇ ਗੁਆਂਢੀ ਨਹੀਂ ਹੋਵੋਗੇ?\" — ਫ੍ਰੈੱਡ ਰੋਜਰਜ਼"
  },
  pt: {
    underMinWarning: "Você tem apenas {{count}} vizinho(s) — recomendamos pelo menos 3",
    underMinDescription: "Ter vizinhos de confiança por perto é essencial para emergências, ajuda mútua e construção de resiliência comunitária. Apresente-se aos seus vizinhos!",
    mrRogersQuote: "\"Você não quer ser meu vizinho?\" — Fred Rogers"
  },
  ru: {
    underMinWarning: "У вас только {{count}} сосед(ей) — мы рекомендуем минимум 3",
    underMinDescription: "Иметь надёжных соседей рядом необходимо для экстренных ситуаций, взаимопомощи и укрепления устойчивости сообщества. Познакомьтесь со своими соседями!",
    mrRogersQuote: "\"Не хотите ли вы стать моим соседом?\" — Фред Роджерс"
  },
  ta: {
    underMinWarning: "உங்களிடம் {{count}} அண்டை வீட்டார் மட்டுமே உள்ளனர் — குறைந்தது 3 பேரை பரிந்துரைக்கிறோம்",
    underMinDescription: "அவசரநிலைகள், பரஸ்பர உதவி மற்றும் சமூக நெகிழ்ச்சியை உருவாக்க அருகிலுள்ள நம்பகமான அண்டை வீட்டார் இருப்பது அவசியம். உங்கள் அண்டை வீட்டாரிடம் உங்களை அறிமுகப்படுத்திக்கொள்ளுங்கள்!",
    mrRogersQuote: "\"நீ என் அண்டை வீட்டாராக இருக்க மாட்டாயா?\" — ஃபிரெட் ரோஜர்ஸ்"
  },
  te: {
    underMinWarning: "మీకు {{count}} పొరుగువారు మాత్రమే ఉన్నారు — మేము కనీసం 3 మందిని సిఫార్సు చేస్తాము",
    underMinDescription: "అత్యవసర పరిస్థితులు, పరస్పర సహాయం మరియు కమ్యూనిటీ స్థితిస్థాపకతను నిర్మించడానికి సమీపంలో నమ్మకమైన పొరుగువారు ఉండటం అవసరం. మీ పొరుగువారికి మిమ్మల్ని పరిచయం చేసుకోండి!",
    mrRogersQuote: "\"నీవు నా పొరుగువాడివి కాదా?\" — ఫ్రెడ్ రోజర్స్"
  },
  tr: {
    underMinWarning: "Sadece {{count}} komşunuz var — en az 3 tavsiye ediyoruz",
    underMinDescription: "Acil durumlar, karşılıklı yardım ve topluluk dayanıklılığı oluşturmak için yakında güvenilir komşulara sahip olmak önemlidir. Komşularınıza kendinizi tanıtın!",
    mrRogersQuote: "\"Benim komşum olmak istemez misin?\" — Fred Rogers"
  },
  ur: {
    underMinWarning: "آپ کے پاس صرف {{count}} پڑوسی ہیں — ہم کم از کم 3 کی سفارش کرتے ہیں",
    underMinDescription: "ہنگامی حالات، باہمی مدد اور کمیونٹی لچک کی تعمیر کے لیے قریب میں قابل اعتماد پڑوسیوں کا ہونا ضروری ہے۔ اپنے پڑوسیوں سے اپنا تعارف کروائیں!",
    mrRogersQuote: "\"کیا تم میرے پڑوسی نہیں بنو گے؟\" — فریڈ راجرز"
  },
  vi: {
    underMinWarning: "Bạn chỉ có {{count}} người hàng xóm — chúng tôi khuyến nghị ít nhất 3",
    underMinDescription: "Có hàng xóm đáng tin cậy gần đó là điều cần thiết cho các trường hợp khẩn cấp, hỗ trợ lẫn nhau và xây dựng khả năng phục hồi của cộng đồng. Hãy giới thiệu bản thân với hàng xóm của bạn!",
    mrRogersQuote: "\"Bạn sẽ không làm hàng xóm của tôi sao?\" — Fred Rogers"
  },
  zh: {
    underMinWarning: "您只有{{count}}位邻居 — 我们建议至少3位",
    underMinDescription: "拥有值得信赖的邻居对于紧急情况、互助和建立社区韧性至关重要。向您的邻居介绍自己吧！",
    mrRogersQuote: "\"你愿意做我的邻居吗？\" — 弗雷德·罗杰斯"
  }
};

// Process each locale
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

locales.forEach(locale => {
  const filePath = path.join(localesDir, locale, 'common.json');

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${locale}: common.json not found`);
    return;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Get translations for this locale, fallback to English
    const translations = nayborTranslations[locale] || nayborTranslations.en;

    // Add naybor section if it doesn't exist
    if (!content.naybor) content.naybor = {};
    content.naybor.underMinWarning = translations.underMinWarning;
    content.naybor.underMinDescription = translations.underMinDescription;
    content.naybor.mrRogersQuote = translations.mrRogersQuote;

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Updated ${locale}`);
  } catch (error) {
    console.error(`Error processing ${locale}:`, error.message);
  }
});

console.log('\nDone! Naybor tier translations added.');
