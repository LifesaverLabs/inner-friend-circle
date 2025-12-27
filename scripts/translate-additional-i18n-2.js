import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional translations for dataLiberation.banner, nayborSOS extras, pagination, sidebar, carousel, breadcrumb
const translations = {
  // Arabic
  ar: {
    dataLiberation: {
      banner: {
        title: "بياناتك، اختيارك",
        description: "قم بتصدير شبكتك الاجتماعية في أي وقت لاستخدامها مع شبكات أخرى متوافقة مع دنبار. بياناتك ملك لك.",
        exportButton: "تصدير بياناتي",
        learnMore: "اعرف المزيد",
        dismiss: "إخفاء الإشعار"
      }
    },
    nayborSOS: {
      addMoreNaybors: "أضف المزيد من الجيران",
      quick: "سريع",
      noPhone: "لا يوجد هاتف",
      tapSOSForMore: "اضغط SOS لمزيد من الخيارات وجميع الجيران"
    },
    accessibility: {
      naybor: {
        hideQuickContacts: "إخفاء جهات الاتصال السريعة",
        showQuickContacts: "إظهار جهات الاتصال السريعة",
        sosRegion: "جهات اتصال SOS السريعة",
        sosContactsList: "جهات الاتصال السريعة:",
        contactOptions: "خيارات الاتصال لـ {{name}}",
        callButton: "اتصل بـ {{name}}",
        messageButton: "أرسل رسالة إلى {{name}}"
      }
    },
    pagination: {
      previous: "السابق",
      next: "التالي",
      goToPrevious: "انتقل إلى الصفحة السابقة",
      goToNext: "انتقل إلى الصفحة التالية",
      morePages: "المزيد من الصفحات"
    },
    sidebar: {
      toggle: "تبديل الشريط الجانبي"
    },
    carousel: {
      previousSlide: "الشريحة السابقة",
      nextSlide: "الشريحة التالية"
    },
    breadcrumb: {
      more: "المزيد"
    }
  },

  // German
  de: {
    dataLiberation: {
      banner: {
        title: "Deine Daten, Deine Wahl",
        description: "Exportiere dein soziales Netzwerk jederzeit für andere Dunbar-kompatible Netzwerke. Deine Daten gehören dir.",
        exportButton: "Meine Daten exportieren",
        learnMore: "Mehr erfahren",
        dismiss: "Banner ausblenden"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Mehr Nachbarn hinzufügen",
      quick: "Schnell",
      noPhone: "Kein Telefon",
      tapSOSForMore: "SOS antippen für mehr Optionen und alle Nachbarn"
    },
    pagination: {
      previous: "Zurück",
      next: "Weiter",
      goToPrevious: "Zur vorherigen Seite",
      goToNext: "Zur nächsten Seite",
      morePages: "Mehr Seiten"
    },
    sidebar: {
      toggle: "Seitenleiste umschalten"
    },
    carousel: {
      previousSlide: "Vorherige Folie",
      nextSlide: "Nächste Folie"
    },
    breadcrumb: {
      more: "Mehr"
    }
  },

  // Spanish
  es: {
    dataLiberation: {
      banner: {
        title: "Tus Datos, Tu Elección",
        description: "Exporta tu gráfico social en cualquier momento para usar con otras redes compatibles con Dunbar. Tus datos te pertenecen.",
        exportButton: "Exportar Mis Datos",
        learnMore: "Saber Más",
        dismiss: "Descartar banner"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Añadir más vecinos",
      quick: "Rápido",
      noPhone: "Sin teléfono",
      tapSOSForMore: "Toca SOS para más opciones y todos los vecinos"
    },
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      goToPrevious: "Ir a la página anterior",
      goToNext: "Ir a la página siguiente",
      morePages: "Más páginas"
    },
    sidebar: {
      toggle: "Alternar barra lateral"
    },
    carousel: {
      previousSlide: "Diapositiva anterior",
      nextSlide: "Diapositiva siguiente"
    },
    breadcrumb: {
      more: "Más"
    }
  },

  // French
  fr: {
    dataLiberation: {
      banner: {
        title: "Vos Données, Votre Choix",
        description: "Exportez votre graphe social à tout moment pour l'utiliser avec d'autres réseaux compatibles Dunbar. Vos données vous appartiennent.",
        exportButton: "Exporter Mes Données",
        learnMore: "En Savoir Plus",
        dismiss: "Fermer la bannière"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Ajouter plus de voisins",
      quick: "Rapide",
      noPhone: "Pas de téléphone",
      tapSOSForMore: "Appuyez sur SOS pour plus d'options et tous les voisins"
    },
    pagination: {
      previous: "Précédent",
      next: "Suivant",
      goToPrevious: "Aller à la page précédente",
      goToNext: "Aller à la page suivante",
      morePages: "Plus de pages"
    },
    sidebar: {
      toggle: "Basculer la barre latérale"
    },
    carousel: {
      previousSlide: "Diapositive précédente",
      nextSlide: "Diapositive suivante"
    },
    breadcrumb: {
      more: "Plus"
    }
  },

  // Hebrew
  he: {
    dataLiberation: {
      banner: {
        title: "הנתונים שלך, הבחירה שלך",
        description: "ייצא את הרשת החברתית שלך בכל עת לשימוש עם רשתות אחרות התואמות לדנבר. הנתונים שלך שייכים לך.",
        exportButton: "ייצא את הנתונים שלי",
        learnMore: "למד עוד",
        dismiss: "סגור באנר"
      }
    },
    nayborSOS: {
      addMoreNaybors: "הוסף עוד שכנים",
      quick: "מהיר",
      noPhone: "אין טלפון",
      tapSOSForMore: "הקש SOS לאפשרויות נוספות וכל השכנים"
    },
    pagination: {
      previous: "הקודם",
      next: "הבא",
      goToPrevious: "עבור לעמוד הקודם",
      goToNext: "עבור לעמוד הבא",
      morePages: "עמודים נוספים"
    },
    sidebar: {
      toggle: "החלף סרגל צד"
    },
    carousel: {
      previousSlide: "שקופית קודמת",
      nextSlide: "שקופית הבאה"
    },
    breadcrumb: {
      more: "עוד"
    }
  },

  // Hindi
  hi: {
    dataLiberation: {
      banner: {
        title: "आपका डेटा, आपकी पसंद",
        description: "अपने सामाजिक ग्राफ को कभी भी अन्य डनबर-संगत नेटवर्क के साथ उपयोग करने के लिए निर्यात करें। आपका डेटा आपका है।",
        exportButton: "मेरा डेटा निर्यात करें",
        learnMore: "और जानें",
        dismiss: "बैनर छिपाएं"
      }
    },
    nayborSOS: {
      addMoreNaybors: "और पड़ोसी जोड़ें",
      quick: "त्वरित",
      noPhone: "कोई फ़ोन नहीं",
      tapSOSForMore: "अधिक विकल्पों और सभी पड़ोसियों के लिए SOS टैप करें"
    },
    pagination: {
      previous: "पिछला",
      next: "अगला",
      goToPrevious: "पिछले पेज पर जाएं",
      goToNext: "अगले पेज पर जाएं",
      morePages: "और पेज"
    },
    sidebar: {
      toggle: "साइडबार टॉगल करें"
    },
    carousel: {
      previousSlide: "पिछली स्लाइड",
      nextSlide: "अगली स्लाइड"
    },
    breadcrumb: {
      more: "और"
    }
  },

  // Italian
  it: {
    dataLiberation: {
      banner: {
        title: "I Tuoi Dati, La Tua Scelta",
        description: "Esporta il tuo grafo sociale in qualsiasi momento per usarlo con altre reti compatibili con Dunbar. I tuoi dati ti appartengono.",
        exportButton: "Esporta I Miei Dati",
        learnMore: "Scopri di Più",
        dismiss: "Chiudi banner"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Aggiungi più vicini",
      quick: "Veloce",
      noPhone: "Nessun telefono",
      tapSOSForMore: "Tocca SOS per più opzioni e tutti i vicini"
    },
    pagination: {
      previous: "Precedente",
      next: "Successivo",
      goToPrevious: "Vai alla pagina precedente",
      goToNext: "Vai alla pagina successiva",
      morePages: "Altre pagine"
    },
    sidebar: {
      toggle: "Attiva/disattiva barra laterale"
    },
    carousel: {
      previousSlide: "Diapositiva precedente",
      nextSlide: "Diapositiva successiva"
    },
    breadcrumb: {
      more: "Altro"
    }
  },

  // Japanese
  ja: {
    dataLiberation: {
      banner: {
        title: "あなたのデータ、あなたの選択",
        description: "ソーシャルグラフをいつでもエクスポートして、他のダンバー互換ネットワークで使用できます。あなたのデータはあなたのものです。",
        exportButton: "データをエクスポート",
        learnMore: "詳細を見る",
        dismiss: "バナーを閉じる"
      }
    },
    nayborSOS: {
      addMoreNaybors: "隣人を追加",
      quick: "クイック",
      noPhone: "電話なし",
      tapSOSForMore: "SOSをタップしてオプションとすべての隣人を表示"
    },
    pagination: {
      previous: "前へ",
      next: "次へ",
      goToPrevious: "前のページへ",
      goToNext: "次のページへ",
      morePages: "他のページ"
    },
    sidebar: {
      toggle: "サイドバーを切り替え"
    },
    carousel: {
      previousSlide: "前のスライド",
      nextSlide: "次のスライド"
    },
    breadcrumb: {
      more: "もっと見る"
    }
  },

  // Korean
  ko: {
    dataLiberation: {
      banner: {
        title: "당신의 데이터, 당신의 선택",
        description: "소셜 그래프를 언제든지 내보내 다른 던바 호환 네트워크에서 사용하세요. 당신의 데이터는 당신의 것입니다.",
        exportButton: "내 데이터 내보내기",
        learnMore: "자세히 알아보기",
        dismiss: "배너 닫기"
      }
    },
    nayborSOS: {
      addMoreNaybors: "이웃 추가하기",
      quick: "빠른",
      noPhone: "전화 없음",
      tapSOSForMore: "더 많은 옵션과 모든 이웃을 보려면 SOS를 탭하세요"
    },
    pagination: {
      previous: "이전",
      next: "다음",
      goToPrevious: "이전 페이지로",
      goToNext: "다음 페이지로",
      morePages: "더 많은 페이지"
    },
    sidebar: {
      toggle: "사이드바 토글"
    },
    carousel: {
      previousSlide: "이전 슬라이드",
      nextSlide: "다음 슬라이드"
    },
    breadcrumb: {
      more: "더보기"
    }
  },

  // Portuguese
  pt: {
    dataLiberation: {
      banner: {
        title: "Seus Dados, Sua Escolha",
        description: "Exporte seu gráfico social a qualquer momento para usar com outras redes compatíveis com Dunbar. Seus dados pertencem a você.",
        exportButton: "Exportar Meus Dados",
        learnMore: "Saiba Mais",
        dismiss: "Fechar banner"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Adicionar mais vizinhos",
      quick: "Rápido",
      noPhone: "Sem telefone",
      tapSOSForMore: "Toque em SOS para mais opções e todos os vizinhos"
    },
    pagination: {
      previous: "Anterior",
      next: "Próximo",
      goToPrevious: "Ir para página anterior",
      goToNext: "Ir para próxima página",
      morePages: "Mais páginas"
    },
    sidebar: {
      toggle: "Alternar barra lateral"
    },
    carousel: {
      previousSlide: "Slide anterior",
      nextSlide: "Próximo slide"
    },
    breadcrumb: {
      more: "Mais"
    }
  },

  // Russian
  ru: {
    dataLiberation: {
      banner: {
        title: "Ваши Данные, Ваш Выбор",
        description: "Экспортируйте социальный граф в любое время для использования с другими сетями, совместимыми с Данбаром. Ваши данные принадлежат вам.",
        exportButton: "Экспортировать Мои Данные",
        learnMore: "Узнать Больше",
        dismiss: "Закрыть баннер"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Добавить больше соседей",
      quick: "Быстро",
      noPhone: "Нет телефона",
      tapSOSForMore: "Нажмите SOS для дополнительных опций и всех соседей"
    },
    pagination: {
      previous: "Назад",
      next: "Вперёд",
      goToPrevious: "На предыдущую страницу",
      goToNext: "На следующую страницу",
      morePages: "Ещё страницы"
    },
    sidebar: {
      toggle: "Переключить боковую панель"
    },
    carousel: {
      previousSlide: "Предыдущий слайд",
      nextSlide: "Следующий слайд"
    },
    breadcrumb: {
      more: "Ещё"
    }
  },

  // Turkish
  tr: {
    dataLiberation: {
      banner: {
        title: "Verileriniz, Seçiminiz",
        description: "Sosyal grafiğinizi istediğiniz zaman dışa aktarın ve diğer Dunbar uyumlu ağlarla kullanın. Verileriniz size aittir.",
        exportButton: "Verilerimi Dışa Aktar",
        learnMore: "Daha Fazla Bilgi",
        dismiss: "Banner'ı kapat"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Daha fazla komşu ekle",
      quick: "Hızlı",
      noPhone: "Telefon yok",
      tapSOSForMore: "Daha fazla seçenek ve tüm komşular için SOS'a dokunun"
    },
    pagination: {
      previous: "Önceki",
      next: "Sonraki",
      goToPrevious: "Önceki sayfaya git",
      goToNext: "Sonraki sayfaya git",
      morePages: "Daha fazla sayfa"
    },
    sidebar: {
      toggle: "Kenar çubuğunu değiştir"
    },
    carousel: {
      previousSlide: "Önceki slayt",
      nextSlide: "Sonraki slayt"
    },
    breadcrumb: {
      more: "Daha fazla"
    }
  },

  // Chinese
  zh: {
    dataLiberation: {
      banner: {
        title: "您的数据，您的选择",
        description: "随时导出您的社交图谱，与其他符合邓巴数的网络一起使用。您的数据属于您。",
        exportButton: "导出我的数据",
        learnMore: "了解更多",
        dismiss: "关闭横幅"
      }
    },
    nayborSOS: {
      addMoreNaybors: "添加更多邻居",
      quick: "快速",
      noPhone: "无电话",
      tapSOSForMore: "点击SOS获取更多选项和所有邻居"
    },
    pagination: {
      previous: "上一页",
      next: "下一页",
      goToPrevious: "转到上一页",
      goToNext: "转到下一页",
      morePages: "更多页面"
    },
    sidebar: {
      toggle: "切换侧边栏"
    },
    carousel: {
      previousSlide: "上一张幻灯片",
      nextSlide: "下一张幻灯片"
    },
    breadcrumb: {
      more: "更多"
    }
  },

  // Vietnamese
  vi: {
    dataLiberation: {
      banner: {
        title: "Dữ Liệu Của Bạn, Lựa Chọn Của Bạn",
        description: "Xuất đồ thị xã hội của bạn bất cứ lúc nào để sử dụng với các mạng tương thích Dunbar khác. Dữ liệu của bạn thuộc về bạn.",
        exportButton: "Xuất Dữ Liệu Của Tôi",
        learnMore: "Tìm Hiểu Thêm",
        dismiss: "Đóng banner"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Thêm hàng xóm",
      quick: "Nhanh",
      noPhone: "Không có điện thoại",
      tapSOSForMore: "Nhấn SOS để có thêm tùy chọn và tất cả hàng xóm"
    },
    pagination: {
      previous: "Trước",
      next: "Sau",
      goToPrevious: "Đi đến trang trước",
      goToNext: "Đi đến trang sau",
      morePages: "Thêm trang"
    },
    sidebar: {
      toggle: "Chuyển đổi thanh bên"
    },
    carousel: {
      previousSlide: "Slide trước",
      nextSlide: "Slide sau"
    },
    breadcrumb: {
      more: "Thêm"
    }
  },

  // Bengali
  bn: {
    dataLiberation: {
      banner: {
        title: "আপনার ডেটা, আপনার পছন্দ",
        description: "যেকোনো সময় আপনার সোশ্যাল গ্রাফ রপ্তানি করুন অন্যান্য ডানবার-সামঞ্জস্যপূর্ণ নেটওয়ার্কে ব্যবহার করতে। আপনার ডেটা আপনার।",
        exportButton: "আমার ডেটা রপ্তানি করুন",
        learnMore: "আরও জানুন",
        dismiss: "ব্যানার বন্ধ করুন"
      }
    },
    nayborSOS: {
      addMoreNaybors: "আরও প্রতিবেশী যোগ করুন",
      quick: "দ্রুত",
      noPhone: "ফোন নেই",
      tapSOSForMore: "আরও বিকল্প এবং সমস্ত প্রতিবেশীদের জন্য SOS ট্যাপ করুন"
    },
    pagination: {
      previous: "পূর্ববর্তী",
      next: "পরবর্তী",
      goToPrevious: "আগের পৃষ্ঠায় যান",
      goToNext: "পরের পৃষ্ঠায় যান",
      morePages: "আরও পৃষ্ঠা"
    },
    sidebar: {
      toggle: "সাইডবার টগল করুন"
    },
    carousel: {
      previousSlide: "আগের স্লাইড",
      nextSlide: "পরের স্লাইড"
    },
    breadcrumb: {
      more: "আরও"
    }
  },

  // Urdu
  ur: {
    dataLiberation: {
      banner: {
        title: "آپ کا ڈیٹا، آپ کا انتخاب",
        description: "اپنے سوشل گراف کو کسی بھی وقت برآمد کریں اور دوسرے ڈنبار سے ہم آہنگ نیٹ ورکس کے ساتھ استعمال کریں۔ آپ کا ڈیٹا آپ کا ہے۔",
        exportButton: "میرا ڈیٹا برآمد کریں",
        learnMore: "مزید جانیں",
        dismiss: "بینر بند کریں"
      }
    },
    nayborSOS: {
      addMoreNaybors: "مزید پڑوسی شامل کریں",
      quick: "فوری",
      noPhone: "کوئی فون نہیں",
      tapSOSForMore: "مزید اختیارات اور تمام پڑوسیوں کے لیے SOS ٹیپ کریں"
    },
    pagination: {
      previous: "پچھلا",
      next: "اگلا",
      goToPrevious: "پچھلے صفحے پر جائیں",
      goToNext: "اگلے صفحے پر جائیں",
      morePages: "مزید صفحات"
    },
    sidebar: {
      toggle: "سائیڈبار ٹوگل کریں"
    },
    carousel: {
      previousSlide: "پچھلی سلائیڈ",
      nextSlide: "اگلی سلائیڈ"
    },
    breadcrumb: {
      more: "مزید"
    }
  },

  // Javanese
  jv: {
    dataLiberation: {
      banner: {
        title: "Data Sampeyan, Pilihan Sampeyan",
        description: "Ekspor graf sosial sampeyan kapan wae kanggo nganggo karo jaringan liyane sing kompatibel karo Dunbar. Data sampeyan duweke sampeyan.",
        exportButton: "Ekspor Data Kula",
        learnMore: "Sinau Luwih Akeh",
        dismiss: "Tutup banner"
      }
    },
    nayborSOS: {
      addMoreNaybors: "Tambah tangga luwih akeh",
      quick: "Cepet",
      noPhone: "Ora ana telpon",
      tapSOSForMore: "Tutul SOS kanggo pilihan luwih akeh lan kabeh tangga"
    },
    pagination: {
      previous: "Sadurunge",
      next: "Sabanjure",
      goToPrevious: "Menyang kaca sadurunge",
      goToNext: "Menyang kaca sabanjure",
      morePages: "Kaca luwih akeh"
    },
    sidebar: {
      toggle: "Ganti sidebar"
    },
    carousel: {
      previousSlide: "Slide sadurunge",
      nextSlide: "Slide sabanjure"
    },
    breadcrumb: {
      more: "Luwih akeh"
    }
  },

  // Marathi
  mr: {
    dataLiberation: {
      banner: {
        title: "तुमचा डेटा, तुमची निवड",
        description: "तुमचा सोशल ग्राफ कधीही निर्यात करा आणि इतर डनबार-सुसंगत नेटवर्कसह वापरा. तुमचा डेटा तुमचा आहे.",
        exportButton: "माझा डेटा निर्यात करा",
        learnMore: "अधिक जाणून घ्या",
        dismiss: "बॅनर बंद करा"
      }
    },
    nayborSOS: {
      addMoreNaybors: "अधिक शेजारी जोडा",
      quick: "जलद",
      noPhone: "फोन नाही",
      tapSOSForMore: "अधिक पर्याय आणि सर्व शेजार्‍यांसाठी SOS टॅप करा"
    },
    pagination: {
      previous: "मागील",
      next: "पुढील",
      goToPrevious: "मागील पृष्ठावर जा",
      goToNext: "पुढील पृष्ठावर जा",
      morePages: "अधिक पृष्ठे"
    },
    sidebar: {
      toggle: "साइडबार टॉगल करा"
    },
    carousel: {
      previousSlide: "मागील स्लाइड",
      nextSlide: "पुढील स्लाइड"
    },
    breadcrumb: {
      more: "अधिक"
    }
  },

  // Tamil
  ta: {
    dataLiberation: {
      banner: {
        title: "உங்கள் தரவு, உங்கள் தேர்வு",
        description: "உங்கள் சமூக வரைபடத்தை எப்போது வேண்டுமானாலும் ஏற்றுமதி செய்து மற்ற டன்பார்-இணக்கமான நெட்வொர்க்குகளுடன் பயன்படுத்தவும். உங்கள் தரவு உங்களுடையது.",
        exportButton: "என் தரவை ஏற்றுமதி செய்",
        learnMore: "மேலும் அறிக",
        dismiss: "பேனரை மூடு"
      }
    },
    nayborSOS: {
      addMoreNaybors: "மேலும் அண்டை வீட்டாரை சேர்க்கவும்",
      quick: "விரைவு",
      noPhone: "தொலைபேசி இல்லை",
      tapSOSForMore: "மேலும் விருப்பங்களுக்கும் அனைத்து அண்டை வீட்டாருக்கும் SOS தட்டவும்"
    },
    pagination: {
      previous: "முந்தைய",
      next: "அடுத்த",
      goToPrevious: "முந்தைய பக்கத்திற்கு செல்",
      goToNext: "அடுத்த பக்கத்திற்கு செல்",
      morePages: "மேலும் பக்கங்கள்"
    },
    sidebar: {
      toggle: "பக்கப்பட்டியை மாற்று"
    },
    carousel: {
      previousSlide: "முந்தைய ஸ்லைடு",
      nextSlide: "அடுத்த ஸ்லைடு"
    },
    breadcrumb: {
      more: "மேலும்"
    }
  },

  // Telugu
  te: {
    dataLiberation: {
      banner: {
        title: "మీ డేటా, మీ ఎంపిక",
        description: "మీ సామాజిక గ్రాఫ్‌ను ఎప్పుడైనా ఎగుమతి చేసి ఇతర డన్బార్-అనుకూల నెట్‌వర్క్‌లతో ఉపయోగించండి. మీ డేటా మీది.",
        exportButton: "నా డేటాను ఎగుమతి చేయండి",
        learnMore: "మరింత తెలుసుకోండి",
        dismiss: "బ్యానర్ మూసివేయండి"
      }
    },
    nayborSOS: {
      addMoreNaybors: "మరిన్ని పొరుగువారిని జోడించండి",
      quick: "త్వరగా",
      noPhone: "ఫోన్ లేదు",
      tapSOSForMore: "మరిన్ని ఎంపికలు మరియు అన్ని పొరుగువారి కోసం SOS నొక్కండి"
    },
    pagination: {
      previous: "మునుపటి",
      next: "తదుపరి",
      goToPrevious: "మునుపటి పేజీకి వెళ్ళండి",
      goToNext: "తదుపరి పేజీకి వెళ్ళండి",
      morePages: "మరిన్ని పేజీలు"
    },
    sidebar: {
      toggle: "సైడ్‌బార్ టోగుల్ చేయండి"
    },
    carousel: {
      previousSlide: "మునుపటి స్లైడ్",
      nextSlide: "తదుపరి స్లైడ్"
    },
    breadcrumb: {
      more: "మరిన్ని"
    }
  },

  // Punjabi
  pa: {
    dataLiberation: {
      banner: {
        title: "ਤੁਹਾਡਾ ਡੇਟਾ, ਤੁਹਾਡੀ ਚੋਣ",
        description: "ਆਪਣੇ ਸੋਸ਼ਲ ਗ੍ਰਾਫ ਨੂੰ ਕਿਸੇ ਵੀ ਸਮੇਂ ਨਿਰਯਾਤ ਕਰੋ ਅਤੇ ਹੋਰ ਡਨਬਾਰ-ਅਨੁਕੂਲ ਨੈੱਟਵਰਕਾਂ ਨਾਲ ਵਰਤੋ। ਤੁਹਾਡਾ ਡੇਟਾ ਤੁਹਾਡਾ ਹੈ।",
        exportButton: "ਮੇਰਾ ਡੇਟਾ ਨਿਰਯਾਤ ਕਰੋ",
        learnMore: "ਹੋਰ ਜਾਣੋ",
        dismiss: "ਬੈਨਰ ਬੰਦ ਕਰੋ"
      }
    },
    nayborSOS: {
      addMoreNaybors: "ਹੋਰ ਗੁਆਂਢੀ ਸ਼ਾਮਲ ਕਰੋ",
      quick: "ਤੇਜ਼",
      noPhone: "ਕੋਈ ਫ਼ੋਨ ਨਹੀਂ",
      tapSOSForMore: "ਹੋਰ ਵਿਕਲਪਾਂ ਅਤੇ ਸਾਰੇ ਗੁਆਂਢੀਆਂ ਲਈ SOS ਟੈਪ ਕਰੋ"
    },
    pagination: {
      previous: "ਪਿਛਲਾ",
      next: "ਅਗਲਾ",
      goToPrevious: "ਪਿਛਲੇ ਪੰਨੇ 'ਤੇ ਜਾਓ",
      goToNext: "ਅਗਲੇ ਪੰਨੇ 'ਤੇ ਜਾਓ",
      morePages: "ਹੋਰ ਪੰਨੇ"
    },
    sidebar: {
      toggle: "ਸਾਈਡਬਾਰ ਟੌਗਲ ਕਰੋ"
    },
    carousel: {
      previousSlide: "ਪਿਛਲੀ ਸਲਾਈਡ",
      nextSlide: "ਅਗਲੀ ਸਲਾਈਡ"
    },
    breadcrumb: {
      more: "ਹੋਰ"
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
