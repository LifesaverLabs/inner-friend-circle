/**
 * Script to add missing rolemodel tier translations to all locales
 * Run with: node scripts/add-rolemodel-i18n.cjs
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// Rolemodel translations for all languages
const rolemodelTranslations = {
  en: {
    rolemodel: "Role Model",
    rolemodelDescription: "People whose life stories inspire you to be good, better, best"
  },
  ar: {
    rolemodel: "قدوة",
    rolemodelDescription: "أشخاص تلهمك قصص حياتهم لتكون جيداً وأفضل وأفضل ما يمكن"
  },
  bled: {
    rolemodel: "Role Model",
    rolemodelDescription: "Peeple whoze lyfe storeez inspyre you to be good, better, best"
  },
  bn: {
    rolemodel: "আদর্শ",
    rolemodelDescription: "যাদের জীবনের গল্প আপনাকে ভালো, উন্নত, সেরা হতে অনুপ্রাণিত করে"
  },
  de: {
    rolemodel: "Vorbild",
    rolemodelDescription: "Menschen, deren Lebensgeschichten Sie inspirieren, gut, besser, am besten zu sein"
  },
  es: {
    rolemodel: "Modelo a seguir",
    rolemodelDescription: "Personas cuyas historias de vida te inspiran a ser bueno, mejor, el mejor"
  },
  fr: {
    rolemodel: "Modèle",
    rolemodelDescription: "Des personnes dont les histoires de vie vous inspirent à être bon, meilleur, le meilleur"
  },
  he: {
    rolemodel: "דמות מופת",
    rolemodelDescription: "אנשים שסיפורי חייהם מעוררים בך השראה להיות טוב, טוב יותר, הכי טוב"
  },
  hi: {
    rolemodel: "आदर्श",
    rolemodelDescription: "जिनकी जीवन कहानियां आपको अच्छा, बेहतर, सर्वश्रेष्ठ बनने के लिए प्रेरित करती हैं"
  },
  it: {
    rolemodel: "Modello di riferimento",
    rolemodelDescription: "Persone le cui storie di vita ti ispirano ad essere buono, migliore, il migliore"
  },
  ja: {
    rolemodel: "ロールモデル",
    rolemodelDescription: "その人生の物語があなたを良く、より良く、最高になるよう鼓舞する人々"
  },
  jv: {
    rolemodel: "Model",
    rolemodelDescription: "Wong sing cerita uripe menehi inspirasi kanggo dadi apik, luwih apik, paling apik"
  },
  ko: {
    rolemodel: "롤모델",
    rolemodelDescription: "삶의 이야기가 당신을 좋게, 더 좋게, 최고가 되도록 영감을 주는 사람들"
  },
  mr: {
    rolemodel: "आदर्श",
    rolemodelDescription: "ज्यांच्या जीवनकथा तुम्हाला चांगले, उत्तम, सर्वोत्तम बनण्यासाठी प्रेरणा देतात"
  },
  pa: {
    rolemodel: "ਆਦਰਸ਼",
    rolemodelDescription: "ਜਿਨ੍ਹਾਂ ਦੀਆਂ ਜੀਵਨ ਕਹਾਣੀਆਂ ਤੁਹਾਨੂੰ ਚੰਗੇ, ਬਿਹਤਰ, ਸਭ ਤੋਂ ਵਧੀਆ ਬਣਨ ਲਈ ਪ੍ਰੇਰਿਤ ਕਰਦੀਆਂ ਹਨ"
  },
  pt: {
    rolemodel: "Modelo",
    rolemodelDescription: "Pessoas cujas histórias de vida te inspiram a ser bom, melhor, o melhor"
  },
  ru: {
    rolemodel: "Образец для подражания",
    rolemodelDescription: "Люди, чьи истории жизни вдохновляют вас быть хорошим, лучше, лучшим"
  },
  ta: {
    rolemodel: "முன்மாதிரி",
    rolemodelDescription: "யாருடைய வாழ்க்கைக் கதைகள் உங்களை நல்லவராக, சிறந்தவராக, மிகச்சிறந்தவராக ஊக்குவிக்கின்றன"
  },
  te: {
    rolemodel: "రోల్ మోడల్",
    rolemodelDescription: "ఎవరి జీవిత కథలు మిమ్మల్ని మంచివారిగా, మెరుగుగా, అత్యుత్తమంగా ఉండేందుకు ప్రేరేపిస్తాయి"
  },
  tr: {
    rolemodel: "Rol Model",
    rolemodelDescription: "Hayat hikayeleri sizi iyi, daha iyi, en iyi olmaya ilham veren insanlar"
  },
  ur: {
    rolemodel: "رول ماڈل",
    rolemodelDescription: "وہ لوگ جن کی زندگی کی کہانیاں آپ کو اچھا، بہتر، بہترین بننے کی تحریک دیتی ہیں"
  },
  vi: {
    rolemodel: "Hình mẫu",
    rolemodelDescription: "Những người mà câu chuyện cuộc đời truyền cảm hứng cho bạn trở nên tốt, tốt hơn, tốt nhất"
  },
  zh: {
    rolemodel: "榜样",
    rolemodelDescription: "他们的人生故事激励你成为好人、更好的人、最好的人"
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
    const translations = rolemodelTranslations[locale] || rolemodelTranslations.en;

    // Add rolemodel to tiers section
    if (!content.tiers) content.tiers = {};
    content.tiers.rolemodel = translations.rolemodel;
    content.tiers.rolemodelDescription = translations.rolemodelDescription;

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Updated ${locale}`);
  } catch (error) {
    console.error(`Error processing ${locale}:`, error.message);
  }
});

console.log('\nDone! Rolemodel tier translations added.');
