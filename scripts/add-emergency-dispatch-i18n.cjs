/**
 * Script to add emergency dispatch i18n translations to all locales
 * Run with: node scripts/add-emergency-dispatch-i18n.cjs
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// New translations for emergency worker sharing and door breaking preferences
const newTranslations = {
  en: {
    emergencyWorkerSharing: {
      title: "Emergency Worker Access",
      enabled: "Share with Emergency Services",
      disabled: "Do Not Share with Emergency Workers",
      enabledDescription: "Verified emergency dispatch (ambulance, fire, police) can request your Door Key Tree when responding to emergencies at your address.",
      disabledDescription: "Emergency dispatch services will NOT have access to your naybor key contacts. Only your designated naybors can use this information.",
      warning: "Disabling this may delay emergency response if responders need to break down your door instead of using naybor-held keys.",
      reviewEnabled: "Emergency dispatch can access your Door Key Tree",
      reviewDisabled: "Emergency dispatch access is disabled"
    },
    doorBreaking: {
      title: "Door Breaking Preference",
      description: "If emergency responders cannot reach a keyholder, how should they proceed?",
      options: {
        break_fast_no_naybors: {
          name: "Break Fast, Skip Naybors",
          description: "In emergencies, break down the door immediately. Do not waste time contacting naybors for keys."
        },
        break_fast_call_naybors: {
          name: "Break Fast, Call Naybors",
          description: "Contact naybors for keys, but do not hesitate to break down the door if needed. Speed is priority."
        },
        last_resort_only: {
          name: "Last Resort Only",
          description: "Please only break door after careful consideration, as a last resort when strictly legally necessary."
        }
      }
    }
  },
  ar: {
    emergencyWorkerSharing: {
      title: "وصول عمال الطوارئ",
      enabled: "مشاركة مع خدمات الطوارئ",
      disabled: "عدم المشاركة مع عمال الطوارئ",
      enabledDescription: "يمكن لإرسال الطوارئ المعتمد (الإسعاف، الإطفاء، الشرطة) طلب شجرة مفاتيح بابك عند الاستجابة لحالات الطوارئ في عنوانك.",
      disabledDescription: "لن يكون لخدمات إرسال الطوارئ وصول إلى جهات اتصال مفاتيح جارك. فقط جيرانك المعينون يمكنهم استخدام هذه المعلومات.",
      warning: "تعطيل هذا قد يؤخر الاستجابة للطوارئ إذا احتاج المستجيبون لكسر بابك بدلاً من استخدام مفاتيح الجيران.",
      reviewEnabled: "يمكن لإرسال الطوارئ الوصول إلى شجرة مفاتيح بابك",
      reviewDisabled: "وصول إرسال الطوارئ معطل"
    },
    doorBreaking: {
      title: "تفضيل كسر الباب",
      description: "إذا لم يتمكن المستجيبون للطوارئ من الوصول إلى حامل المفتاح، كيف يجب أن يتصرفوا؟",
      options: {
        break_fast_no_naybors: {
          name: "اكسر بسرعة، تخطى الجيران",
          description: "في حالات الطوارئ، اكسر الباب فوراً. لا تضيع الوقت في الاتصال بالجيران للحصول على المفاتيح."
        },
        break_fast_call_naybors: {
          name: "اكسر بسرعة، اتصل بالجيران",
          description: "اتصل بالجيران للحصول على المفاتيح، لكن لا تتردد في كسر الباب إذا لزم الأمر. السرعة هي الأولوية."
        },
        last_resort_only: {
          name: "الملاذ الأخير فقط",
          description: "يرجى كسر الباب فقط بعد دراسة متأنية، كملاذ أخير عندما يكون ذلك ضرورياً قانونياً بشكل صارم."
        }
      }
    }
  },
  bled: {
    emergencyWorkerSharing: {
      title: "Emerjensee Worker Akses",
      enabled: "Share with Emerjensee Servisés",
      disabled: "Do Not Share with Emerjensee Workers",
      enabledDescription: "Verifyed emerjensee dispach (ambulans, fyre, polees) kan request yor Door Key Tree when responding to emerjenseez at yor adres.",
      disabledDescription: "Emerjensee dispach servisés will NOT have akses to yor naybor key kontakts. Only yor deziggnaytéd naybors kan use thiz informashon.",
      warning: "Dizaybling thiz may delay emerjensee respons if responders need to break down yor door insted of using naybor-held keys.",
      reviewEnabled: "Emerjensee dispach kan akses yor Door Key Tree",
      reviewDisabled: "Emerjensee dispach akses iz dizaybléd"
    },
    doorBreaking: {
      title: "Door Brayking Preferens",
      description: "If emerjensee responders kannot reach a keyholder, how shood they proseed?",
      options: {
        break_fast_no_naybors: {
          name: "Brayk Fast, Skip Naybors",
          description: "In emerjenseez, brayk down the door imeedyatlee. Do not wayst tyme kontakting naybors for keys."
        },
        break_fast_call_naybors: {
          name: "Brayk Fast, Kall Naybors",
          description: "Kontakt naybors for keys, but do not hezitaté to brayk down the door if needed. Speed iz priorytee."
        },
        last_resort_only: {
          name: "Last Resort Onlee",
          description: "Pleez only brayk door after kayrful konsiderashon, az a last resort when striktlee legallee nesesaree."
        }
      }
    }
  },
  bn: {
    emergencyWorkerSharing: {
      title: "জরুরি কর্মী অ্যাক্সেস",
      enabled: "জরুরি পরিষেবার সাথে শেয়ার করুন",
      disabled: "জরুরি কর্মীদের সাথে শেয়ার করবেন না",
      enabledDescription: "যাচাইকৃত জরুরি প্রেরণ (অ্যাম্বুলেন্স, অগ্নি, পুলিশ) আপনার ঠিকানায় জরুরি পরিস্থিতিতে সাড়া দেওয়ার সময় আপনার ডোর কী ট্রি অনুরোধ করতে পারে।",
      disabledDescription: "জরুরি প্রেরণ পরিষেবাগুলির আপনার প্রতিবেশীর চাবি পরিচিতিতে অ্যাক্সেস থাকবে না। শুধুমাত্র আপনার মনোনীত প্রতিবেশীরা এই তথ্য ব্যবহার করতে পারেন।",
      warning: "এটি নিষ্ক্রিয় করলে জরুরি প্রতিক্রিয়া বিলম্বিত হতে পারে যদি সাড়াদানকারীদের প্রতিবেশীর ধারণকৃত চাবি ব্যবহার না করে আপনার দরজা ভাঙতে হয়।",
      reviewEnabled: "জরুরি প্রেরণ আপনার ডোর কী ট্রি অ্যাক্সেস করতে পারে",
      reviewDisabled: "জরুরি প্রেরণ অ্যাক্সেস নিষ্ক্রিয়"
    },
    doorBreaking: {
      title: "দরজা ভাঙার পছন্দ",
      description: "যদি জরুরি সাড়াদানকারীরা চাবিধারীর কাছে পৌঁছাতে না পারে, তাহলে তারা কীভাবে এগিয়ে যাবে?",
      options: {
        break_fast_no_naybors: {
          name: "দ্রুত ভাঙুন, প্রতিবেশী এড়িয়ে যান",
          description: "জরুরি অবস্থায়, অবিলম্বে দরজা ভেঙে ফেলুন। চাবির জন্য প্রতিবেশীদের সাথে যোগাযোগ করতে সময় নষ্ট করবেন না।"
        },
        break_fast_call_naybors: {
          name: "দ্রুত ভাঙুন, প্রতিবেশীদের কল করুন",
          description: "চাবির জন্য প্রতিবেশীদের সাথে যোগাযোগ করুন, তবে প্রয়োজনে দরজা ভাঙতে দ্বিধা করবেন না। গতি অগ্রাধিকার।"
        },
        last_resort_only: {
          name: "শুধুমাত্র শেষ অবলম্বন",
          description: "অনুগ্রহ করে সতর্কতার সাথে বিবেচনা করার পরেই দরজা ভাঙুন, শুধুমাত্র কঠোরভাবে আইনত প্রয়োজনীয় হলে শেষ অবলম্বন হিসাবে।"
        }
      }
    }
  },
  de: {
    emergencyWorkerSharing: {
      title: "Zugang für Rettungskräfte",
      enabled: "Mit Rettungsdiensten teilen",
      disabled: "Nicht mit Rettungskräften teilen",
      enabledDescription: "Verifizierte Notfallleitstellen (Krankenwagen, Feuerwehr, Polizei) können Ihren Türschlüsselbaum anfordern, wenn sie auf Notfälle an Ihrer Adresse reagieren.",
      disabledDescription: "Notfallleitstellen haben KEINEN Zugang zu Ihren Nachbar-Schlüsselkontakten. Nur Ihre designierten Nachbarn können diese Informationen nutzen.",
      warning: "Das Deaktivieren kann die Notfallreaktion verzögern, wenn Rettungskräfte Ihre Tür einbrechen müssen, anstatt von Nachbarn gehaltene Schlüssel zu verwenden.",
      reviewEnabled: "Notfallleitstelle kann auf Ihren Türschlüsselbaum zugreifen",
      reviewDisabled: "Zugang für Notfallleitstelle ist deaktiviert"
    },
    doorBreaking: {
      title: "Präferenz für Türöffnung",
      description: "Wenn Rettungskräfte keinen Schlüsselhalter erreichen können, wie sollen sie vorgehen?",
      options: {
        break_fast_no_naybors: {
          name: "Schnell einbrechen, Nachbarn überspringen",
          description: "Bei Notfällen sofort die Tür einbrechen. Keine Zeit verschwenden, um Nachbarn wegen Schlüsseln zu kontaktieren."
        },
        break_fast_call_naybors: {
          name: "Schnell einbrechen, Nachbarn anrufen",
          description: "Nachbarn wegen Schlüsseln kontaktieren, aber nicht zögern, die Tür bei Bedarf einzubrechen. Geschwindigkeit hat Priorität."
        },
        last_resort_only: {
          name: "Nur als letztes Mittel",
          description: "Bitte die Tür nur nach sorgfältiger Überlegung einbrechen, als letztes Mittel, wenn es streng rechtlich notwendig ist."
        }
      }
    }
  },
  es: {
    emergencyWorkerSharing: {
      title: "Acceso de Trabajadores de Emergencia",
      enabled: "Compartir con Servicios de Emergencia",
      disabled: "No Compartir con Trabajadores de Emergencia",
      enabledDescription: "El despacho de emergencia verificado (ambulancia, bomberos, policía) puede solicitar tu Árbol de Llaves de Puerta al responder a emergencias en tu dirección.",
      disabledDescription: "Los servicios de despacho de emergencia NO tendrán acceso a tus contactos de llaves de vecinos. Solo tus vecinos designados pueden usar esta información.",
      warning: "Desactivar esto puede retrasar la respuesta de emergencia si los respondedores necesitan derribar tu puerta en lugar de usar las llaves que tienen los vecinos.",
      reviewEnabled: "El despacho de emergencia puede acceder a tu Árbol de Llaves de Puerta",
      reviewDisabled: "El acceso del despacho de emergencia está desactivado"
    },
    doorBreaking: {
      title: "Preferencia de Derribar Puerta",
      description: "Si los respondedores de emergencia no pueden contactar a un portador de llaves, ¿cómo deben proceder?",
      options: {
        break_fast_no_naybors: {
          name: "Derribar Rápido, Saltar Vecinos",
          description: "En emergencias, derribar la puerta inmediatamente. No perder tiempo contactando vecinos por llaves."
        },
        break_fast_call_naybors: {
          name: "Derribar Rápido, Llamar Vecinos",
          description: "Contactar vecinos por llaves, pero no dudar en derribar la puerta si es necesario. La velocidad es prioridad."
        },
        last_resort_only: {
          name: "Solo Último Recurso",
          description: "Por favor, solo derribar la puerta después de consideración cuidadosa, como último recurso cuando sea estrictamente necesario legalmente."
        }
      }
    }
  },
  fr: {
    emergencyWorkerSharing: {
      title: "Accès des Secouristes",
      enabled: "Partager avec les Services d'Urgence",
      disabled: "Ne Pas Partager avec les Secouristes",
      enabledDescription: "Les dispatchers d'urgence vérifiés (ambulance, pompiers, police) peuvent demander votre Arbre de Clés de Porte lors d'interventions à votre adresse.",
      disabledDescription: "Les services de dispatch d'urgence N'auront PAS accès à vos contacts de clés de voisins. Seuls vos voisins désignés peuvent utiliser ces informations.",
      warning: "Désactiver ceci peut retarder la réponse d'urgence si les intervenants doivent enfoncer votre porte au lieu d'utiliser les clés détenues par les voisins.",
      reviewEnabled: "Le dispatch d'urgence peut accéder à votre Arbre de Clés de Porte",
      reviewDisabled: "L'accès du dispatch d'urgence est désactivé"
    },
    doorBreaking: {
      title: "Préférence d'Enfoncement de Porte",
      description: "Si les intervenants d'urgence ne peuvent pas joindre un détenteur de clé, comment doivent-ils procéder?",
      options: {
        break_fast_no_naybors: {
          name: "Enfoncer Rapidement, Ignorer les Voisins",
          description: "En cas d'urgence, enfoncer la porte immédiatement. Ne pas perdre de temps à contacter les voisins pour les clés."
        },
        break_fast_call_naybors: {
          name: "Enfoncer Rapidement, Appeler les Voisins",
          description: "Contacter les voisins pour les clés, mais ne pas hésiter à enfoncer la porte si nécessaire. La rapidité est prioritaire."
        },
        last_resort_only: {
          name: "Dernier Recours Uniquement",
          description: "Veuillez n'enfoncer la porte qu'après mûre réflexion, en dernier recours lorsque c'est strictement légalement nécessaire."
        }
      }
    }
  },
  he: {
    emergencyWorkerSharing: {
      title: "גישת עובדי חירום",
      enabled: "שתף עם שירותי חירום",
      disabled: "אל תשתף עם עובדי חירום",
      enabledDescription: "מוקדי חירום מאומתים (אמבולנס, כיבוי, משטרה) יכולים לבקש את עץ מפתחות הדלת שלך בעת תגובה למקרי חירום בכתובתך.",
      disabledDescription: "שירותי מוקד החירום לא יקבלו גישה לאנשי קשר מפתחות השכנים שלך. רק השכנים המיועדים שלך יכולים להשתמש במידע זה.",
      warning: "השבתה עלולה לעכב את תגובת החירום אם המגיבים צריכים לפרוץ את הדלת במקום להשתמש במפתחות שמחזיקים השכנים.",
      reviewEnabled: "מוקד חירום יכול לגשת לעץ מפתחות הדלת שלך",
      reviewDisabled: "גישת מוקד החירום מושבתת"
    },
    doorBreaking: {
      title: "העדפת פריצת דלת",
      description: "אם מגיבי חירום לא יכולים להגיע למחזיק מפתח, איך עליהם להמשיך?",
      options: {
        break_fast_no_naybors: {
          name: "פרוץ מהר, דלג על שכנים",
          description: "במקרי חירום, פרוץ את הדלת מיד. אל תבזבז זמן ביצירת קשר עם שכנים למפתחות."
        },
        break_fast_call_naybors: {
          name: "פרוץ מהר, התקשר לשכנים",
          description: "צור קשר עם שכנים למפתחות, אבל אל תהסס לפרוץ את הדלת אם צריך. מהירות היא העדיפות."
        },
        last_resort_only: {
          name: "מוצא אחרון בלבד",
          description: "אנא פרוץ דלת רק לאחר שיקול דעת מעמיק, כמוצא אחרון כאשר זה הכרחי מבחינה משפטית."
        }
      }
    }
  },
  hi: {
    emergencyWorkerSharing: {
      title: "आपातकालीन कर्मचारी पहुंच",
      enabled: "आपातकालीन सेवाओं के साथ साझा करें",
      disabled: "आपातकालीन कर्मचारियों के साथ साझा न करें",
      enabledDescription: "सत्यापित आपातकालीन प्रेषण (एम्बुलेंस, फायर, पुलिस) आपके पते पर आपातकाल का जवाब देते समय आपके डोर की ट्री का अनुरोध कर सकते हैं।",
      disabledDescription: "आपातकालीन प्रेषण सेवाओं के पास आपके पड़ोसी की संपर्क जानकारी तक पहुंच नहीं होगी। केवल आपके नामित पड़ोसी ही इस जानकारी का उपयोग कर सकते हैं।",
      warning: "इसे अक्षम करने से आपातकालीन प्रतिक्रिया में देरी हो सकती है यदि प्रतिक्रियाकर्ताओं को पड़ोसी द्वारा रखी गई चाबियों का उपयोग करने के बजाय आपका दरवाजा तोड़ना पड़े।",
      reviewEnabled: "आपातकालीन प्रेषण आपके डोर की ट्री तक पहुंच सकता है",
      reviewDisabled: "आपातकालीन प्रेषण पहुंच अक्षम है"
    },
    doorBreaking: {
      title: "दरवाजा तोड़ने की प्राथमिकता",
      description: "यदि आपातकालीन प्रतिक्रियाकर्ता कीहोल्डर तक नहीं पहुंच सकते, तो उन्हें कैसे आगे बढ़ना चाहिए?",
      options: {
        break_fast_no_naybors: {
          name: "जल्दी तोड़ें, पड़ोसियों को छोड़ें",
          description: "आपातकाल में, तुरंत दरवाजा तोड़ दें। चाबियों के लिए पड़ोसियों से संपर्क करने में समय बर्बाद न करें।"
        },
        break_fast_call_naybors: {
          name: "जल्दी तोड़ें, पड़ोसियों को कॉल करें",
          description: "चाबियों के लिए पड़ोसियों से संपर्क करें, लेकिन जरूरत पड़ने पर दरवाजा तोड़ने में संकोच न करें। गति प्राथमिकता है।"
        },
        last_resort_only: {
          name: "केवल अंतिम उपाय",
          description: "कृपया सावधानीपूर्वक विचार के बाद ही दरवाजा तोड़ें, केवल अंतिम उपाय के रूप में जब कानूनी रूप से सख्ती से आवश्यक हो।"
        }
      }
    }
  },
  it: {
    emergencyWorkerSharing: {
      title: "Accesso Soccorritori",
      enabled: "Condividi con i Servizi di Emergenza",
      disabled: "Non Condividere con i Soccorritori",
      enabledDescription: "Le centrali operative verificate (ambulanza, vigili del fuoco, polizia) possono richiedere il tuo Albero delle Chiavi della Porta durante le emergenze al tuo indirizzo.",
      disabledDescription: "I servizi di emergenza NON avranno accesso ai tuoi contatti chiavi dei vicini. Solo i tuoi vicini designati possono usare queste informazioni.",
      warning: "Disabilitare questo potrebbe ritardare la risposta di emergenza se i soccorritori devono sfondare la porta invece di usare le chiavi dei vicini.",
      reviewEnabled: "La centrale operativa può accedere al tuo Albero delle Chiavi della Porta",
      reviewDisabled: "L'accesso della centrale operativa è disabilitato"
    },
    doorBreaking: {
      title: "Preferenza Sfondamento Porta",
      description: "Se i soccorritori non riescono a raggiungere un detentore di chiavi, come devono procedere?",
      options: {
        break_fast_no_naybors: {
          name: "Sfonda Veloce, Salta i Vicini",
          description: "In emergenza, sfondare la porta immediatamente. Non perdere tempo a contattare i vicini per le chiavi."
        },
        break_fast_call_naybors: {
          name: "Sfonda Veloce, Chiama i Vicini",
          description: "Contattare i vicini per le chiavi, ma non esitare a sfondare la porta se necessario. La velocità è prioritaria."
        },
        last_resort_only: {
          name: "Solo Ultima Risorsa",
          description: "Per favore sfondare la porta solo dopo attenta considerazione, come ultima risorsa quando strettamente necessario legalmente."
        }
      }
    }
  },
  ja: {
    emergencyWorkerSharing: {
      title: "緊急作業員アクセス",
      enabled: "緊急サービスと共有",
      disabled: "緊急作業員と共有しない",
      enabledDescription: "認証された緊急派遣（救急車、消防、警察）は、お住まいの住所での緊急事態に対応する際にドアキーツリーをリクエストできます。",
      disabledDescription: "緊急派遣サービスは隣人のキー連絡先にアクセスできません。指定された隣人のみがこの情報を使用できます。",
      warning: "これを無効にすると、対応者が隣人が持っている鍵を使用する代わりにドアを破る必要がある場合、緊急対応が遅れる可能性があります。",
      reviewEnabled: "緊急派遣はドアキーツリーにアクセスできます",
      reviewDisabled: "緊急派遣アクセスが無効になっています"
    },
    doorBreaking: {
      title: "ドア破壊の設定",
      description: "緊急対応者がキーホルダーに連絡できない場合、どのように進めるべきですか？",
      options: {
        break_fast_no_naybors: {
          name: "速く破る、隣人をスキップ",
          description: "緊急時には、すぐにドアを破ります。鍵のために隣人に連絡する時間を無駄にしないでください。"
        },
        break_fast_call_naybors: {
          name: "速く破る、隣人に電話",
          description: "鍵のために隣人に連絡しますが、必要に応じてドアを破ることをためらわないでください。速度が優先です。"
        },
        last_resort_only: {
          name: "最後の手段のみ",
          description: "法的に厳密に必要な場合にのみ、最後の手段として慎重に検討した後にドアを破ってください。"
        }
      }
    }
  },
  jv: {
    emergencyWorkerSharing: {
      title: "Akses Petugas Darurat",
      enabled: "Bagikan karo Layanan Darurat",
      disabled: "Ora Bagikan karo Petugas Darurat",
      enabledDescription: "Dispatch darurat sing diverifikasi (ambulans, pemadam, polisi) bisa njaluk Door Key Tree sampeyan nalika nanggapi kedaruratan ing alamatmu.",
      disabledDescription: "Layanan dispatch darurat ORA bakal duwe akses menyang kontak kunci tetangga sampeyan. Mung tetangga sing ditunjuk sing bisa nggunakake informasi iki.",
      warning: "Mateni iki bisa ngundurake respon darurat yen responden kudu nyerang lawang tinimbang nggunakake kunci sing dicekel tetangga.",
      reviewEnabled: "Dispatch darurat bisa ngakses Door Key Tree sampeyan",
      reviewDisabled: "Akses dispatch darurat dipateni"
    },
    doorBreaking: {
      title: "Preferensi Nyerang Lawang",
      description: "Yen responden darurat ora bisa nggayuh pemegang kunci, kepiye carane kudu maju?",
      options: {
        break_fast_no_naybors: {
          name: "Nyerang Cepet, Lewati Tetangga",
          description: "Ing kedaruratan, nyerang lawang langsung. Ora mbuwang wektu kanggo hubungi tetangga kanggo kunci."
        },
        break_fast_call_naybors: {
          name: "Nyerang Cepet, Telpon Tetangga",
          description: "Hubungi tetangga kanggo kunci, nanging ora ragu nyerang lawang yen perlu. Kecepatan minangka prioritas."
        },
        last_resort_only: {
          name: "Mung Pilihan Terakhir",
          description: "Tulung mung nyerang lawang sawise pertimbangan sing ati-ati, minangka pilihan terakhir nalika sacara hukum perlu."
        }
      }
    }
  },
  ko: {
    emergencyWorkerSharing: {
      title: "응급 요원 접근",
      enabled: "응급 서비스와 공유",
      disabled: "응급 요원과 공유하지 않음",
      enabledDescription: "인증된 응급 디스패치(구급차, 소방서, 경찰)는 귀하의 주소에서 응급 상황에 대응할 때 도어 키 트리를 요청할 수 있습니다.",
      disabledDescription: "응급 디스패치 서비스는 이웃 키 연락처에 접근할 수 없습니다. 지정된 이웃만 이 정보를 사용할 수 있습니다.",
      warning: "이를 비활성화하면 대응자가 이웃이 가진 키를 사용하는 대신 문을 부숴야 할 경우 응급 대응이 지연될 수 있습니다.",
      reviewEnabled: "응급 디스패치가 도어 키 트리에 접근할 수 있습니다",
      reviewDisabled: "응급 디스패치 접근이 비활성화됨"
    },
    doorBreaking: {
      title: "문 부수기 선호도",
      description: "응급 대응자가 키 소지자에게 연락할 수 없는 경우 어떻게 진행해야 합니까?",
      options: {
        break_fast_no_naybors: {
          name: "빨리 부수기, 이웃 건너뛰기",
          description: "응급 상황에서 즉시 문을 부숩니다. 키를 위해 이웃에게 연락하느라 시간을 낭비하지 마세요."
        },
        break_fast_call_naybors: {
          name: "빨리 부수기, 이웃에게 전화",
          description: "키를 위해 이웃에게 연락하되, 필요하면 문을 부수는 것을 주저하지 마세요. 속도가 우선입니다."
        },
        last_resort_only: {
          name: "최후의 수단만",
          description: "법적으로 엄격하게 필요한 경우에만 최후의 수단으로 신중하게 고려한 후 문을 부숴주세요."
        }
      }
    }
  },
  mr: {
    emergencyWorkerSharing: {
      title: "आपत्कालीन कर्मचारी प्रवेश",
      enabled: "आपत्कालीन सेवांसोबत शेअर करा",
      disabled: "आपत्कालीन कर्मचाऱ्यांसोबत शेअर करू नका",
      enabledDescription: "प्रमाणित आपत्कालीन डिस्पॅच (अॅम्बुलन्स, अग्निशमन, पोलीस) तुमच्या पत्त्यावरील आपत्कालीन परिस्थितीला प्रतिसाद देताना तुमच्या डोर की ट्रीची विनंती करू शकतात.",
      disabledDescription: "आपत्कालीन डिस्पॅच सेवांना तुमच्या शेजाऱ्यांच्या की संपर्कांमध्ये प्रवेश मिळणार नाही. फक्त तुमचे नियुक्त शेजारी ही माहिती वापरू शकतात.",
      warning: "हे अक्षम केल्यास आपत्कालीन प्रतिसादात विलंब होऊ शकतो जर प्रतिसादकर्त्यांना शेजाऱ्यांकडील चाव्या वापरण्याऐवजी तुमचा दरवाजा तोडावा लागला.",
      reviewEnabled: "आपत्कालीन डिस्पॅच तुमच्या डोर की ट्रीमध्ये प्रवेश करू शकते",
      reviewDisabled: "आपत्कालीन डिस्पॅच प्रवेश अक्षम आहे"
    },
    doorBreaking: {
      title: "दरवाजा तोडण्याची प्राधान्ये",
      description: "जर आपत्कालीन प्रतिसादकर्ते कीहोल्डरपर्यंत पोहोचू शकत नाहीत, तर त्यांनी कसे पुढे जावे?",
      options: {
        break_fast_no_naybors: {
          name: "लवकर तोडा, शेजाऱ्यांना वगळा",
          description: "आपत्कालीन परिस्थितीत, लगेच दरवाजा तोडा. चाव्यांसाठी शेजाऱ्यांशी संपर्क साधण्यात वेळ वाया घालवू नका."
        },
        break_fast_call_naybors: {
          name: "लवकर तोडा, शेजाऱ्यांना कॉल करा",
          description: "चाव्यांसाठी शेजाऱ्यांशी संपर्क साधा, पण गरज असल्यास दरवाजा तोडण्यास संकोच करू नका. वेग हे प्राधान्य आहे."
        },
        last_resort_only: {
          name: "फक्त शेवटचा उपाय",
          description: "कृपया काळजीपूर्वक विचार केल्यानंतरच दरवाजा तोडा, केवळ शेवटचा उपाय म्हणून जेव्हा कायदेशीररित्या कठोरपणे आवश्यक असेल."
        }
      }
    }
  },
  pa: {
    emergencyWorkerSharing: {
      title: "ਐਮਰਜੈਂਸੀ ਵਰਕਰ ਐਕਸੈਸ",
      enabled: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ",
      disabled: "ਐਮਰਜੈਂਸੀ ਵਰਕਰਾਂ ਨਾਲ ਸਾਂਝਾ ਨਾ ਕਰੋ",
      enabledDescription: "ਪ੍ਰਮਾਣਿਤ ਐਮਰਜੈਂਸੀ ਡਿਸਪੈਚ (ਐਂਬੂਲੈਂਸ, ਫਾਇਰ, ਪੁਲਿਸ) ਤੁਹਾਡੇ ਪਤੇ 'ਤੇ ਐਮਰਜੈਂਸੀ ਦਾ ਜਵਾਬ ਦਿੰਦੇ ਸਮੇਂ ਤੁਹਾਡੇ ਡੋਰ ਕੀ ਟ੍ਰੀ ਦੀ ਬੇਨਤੀ ਕਰ ਸਕਦੇ ਹਨ।",
      disabledDescription: "ਐਮਰਜੈਂਸੀ ਡਿਸਪੈਚ ਸੇਵਾਵਾਂ ਕੋਲ ਤੁਹਾਡੇ ਗੁਆਂਢੀ ਕੀ ਸੰਪਰਕਾਂ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਹੋਵੇਗੀ। ਸਿਰਫ਼ ਤੁਹਾਡੇ ਨਿਯੁਕਤ ਗੁਆਂਢੀ ਇਹ ਜਾਣਕਾਰੀ ਵਰਤ ਸਕਦੇ ਹਨ।",
      warning: "ਇਸਨੂੰ ਅਯੋਗ ਕਰਨ ਨਾਲ ਐਮਰਜੈਂਸੀ ਜਵਾਬ ਵਿੱਚ ਦੇਰੀ ਹੋ ਸਕਦੀ ਹੈ ਜੇਕਰ ਜਵਾਬ ਦੇਣ ਵਾਲਿਆਂ ਨੂੰ ਗੁਆਂਢੀਆਂ ਦੀਆਂ ਚਾਬੀਆਂ ਵਰਤਣ ਦੀ ਬਜਾਏ ਤੁਹਾਡਾ ਦਰਵਾਜ਼ਾ ਤੋੜਨਾ ਪਵੇ।",
      reviewEnabled: "ਐਮਰਜੈਂਸੀ ਡਿਸਪੈਚ ਤੁਹਾਡੇ ਡੋਰ ਕੀ ਟ੍ਰੀ ਤੱਕ ਪਹੁੰਚ ਕਰ ਸਕਦਾ ਹੈ",
      reviewDisabled: "ਐਮਰਜੈਂਸੀ ਡਿਸਪੈਚ ਐਕਸੈਸ ਅਯੋਗ ਹੈ"
    },
    doorBreaking: {
      title: "ਦਰਵਾਜ਼ਾ ਤੋੜਨ ਦੀ ਤਰਜੀਹ",
      description: "ਜੇ ਐਮਰਜੈਂਸੀ ਜਵਾਬ ਦੇਣ ਵਾਲੇ ਕੀਹੋਲਡਰ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਸਕਦੇ, ਤਾਂ ਉਹਨਾਂ ਨੂੰ ਕਿਵੇਂ ਅੱਗੇ ਵਧਣਾ ਚਾਹੀਦਾ ਹੈ?",
      options: {
        break_fast_no_naybors: {
          name: "ਜਲਦੀ ਤੋੜੋ, ਗੁਆਂਢੀਆਂ ਨੂੰ ਛੱਡੋ",
          description: "ਐਮਰਜੈਂਸੀ ਵਿੱਚ, ਤੁਰੰਤ ਦਰਵਾਜ਼ਾ ਤੋੜੋ। ਚਾਬੀਆਂ ਲਈ ਗੁਆਂਢੀਆਂ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਵਿੱਚ ਸਮਾਂ ਬਰਬਾਦ ਨਾ ਕਰੋ।"
        },
        break_fast_call_naybors: {
          name: "ਜਲਦੀ ਤੋੜੋ, ਗੁਆਂਢੀਆਂ ਨੂੰ ਕਾਲ ਕਰੋ",
          description: "ਚਾਬੀਆਂ ਲਈ ਗੁਆਂਢੀਆਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, ਪਰ ਲੋੜ ਪੈਣ 'ਤੇ ਦਰਵਾਜ਼ਾ ਤੋੜਨ ਤੋਂ ਝਿਜਕੋ ਨਾ। ਸਪੀਡ ਤਰਜੀਹ ਹੈ।"
        },
        last_resort_only: {
          name: "ਸਿਰਫ਼ ਆਖਰੀ ਉਪਾਅ",
          description: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਨਾਲ ਵਿਚਾਰ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਦਰਵਾਜ਼ਾ ਤੋੜੋ, ਆਖਰੀ ਉਪਾਅ ਵਜੋਂ ਜਦੋਂ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਸਖ਼ਤੀ ਨਾਲ ਜ਼ਰੂਰੀ ਹੋਵੇ।"
        }
      }
    }
  },
  pt: {
    emergencyWorkerSharing: {
      title: "Acesso de Socorristas",
      enabled: "Compartilhar com Serviços de Emergência",
      disabled: "Não Compartilhar com Socorristas",
      enabledDescription: "Despacho de emergência verificado (ambulância, bombeiros, polícia) pode solicitar sua Árvore de Chaves da Porta ao responder a emergências no seu endereço.",
      disabledDescription: "Os serviços de despacho de emergência NÃO terão acesso aos seus contatos de chaves dos vizinhos. Apenas seus vizinhos designados podem usar essas informações.",
      warning: "Desabilitar isso pode atrasar a resposta de emergência se os socorristas precisarem arrombar sua porta em vez de usar as chaves dos vizinhos.",
      reviewEnabled: "Despacho de emergência pode acessar sua Árvore de Chaves da Porta",
      reviewDisabled: "Acesso do despacho de emergência está desabilitado"
    },
    doorBreaking: {
      title: "Preferência de Arrombamento",
      description: "Se os socorristas não conseguirem contatar um portador de chave, como devem proceder?",
      options: {
        break_fast_no_naybors: {
          name: "Arrombar Rápido, Pular Vizinhos",
          description: "Em emergências, arrombar a porta imediatamente. Não perder tempo contatando vizinhos por chaves."
        },
        break_fast_call_naybors: {
          name: "Arrombar Rápido, Ligar para Vizinhos",
          description: "Contatar vizinhos por chaves, mas não hesitar em arrombar a porta se necessário. Velocidade é prioridade."
        },
        last_resort_only: {
          name: "Apenas Último Recurso",
          description: "Por favor, arrombar a porta apenas após consideração cuidadosa, como último recurso quando estritamente necessário legalmente."
        }
      }
    }
  },
  ru: {
    emergencyWorkerSharing: {
      title: "Доступ для Экстренных Служб",
      enabled: "Делиться с Экстренными Службами",
      disabled: "Не Делиться с Экстренными Службами",
      enabledDescription: "Верифицированные экстренные диспетчерские (скорая, пожарные, полиция) могут запросить ваше Дерево Ключей при реагировании на чрезвычайные ситуации по вашему адресу.",
      disabledDescription: "Экстренные диспетчерские службы НЕ будут иметь доступа к контактам ваших соседей с ключами. Только ваши назначенные соседи могут использовать эту информацию.",
      warning: "Отключение может задержать экстренное реагирование, если спасателям придётся взламывать вашу дверь вместо использования ключей соседей.",
      reviewEnabled: "Экстренная диспетчерская может получить доступ к вашему Дереву Ключей",
      reviewDisabled: "Доступ экстренной диспетчерской отключён"
    },
    doorBreaking: {
      title: "Предпочтение по Взлому Двери",
      description: "Если спасатели не могут связаться с владельцем ключа, как им действовать?",
      options: {
        break_fast_no_naybors: {
          name: "Взламывать Быстро, Пропустить Соседей",
          description: "В экстренных случаях немедленно взломать дверь. Не тратить время на связь с соседями за ключами."
        },
        break_fast_call_naybors: {
          name: "Взламывать Быстро, Позвонить Соседям",
          description: "Связаться с соседями за ключами, но не колебаться взломать дверь при необходимости. Скорость приоритетна."
        },
        last_resort_only: {
          name: "Только в Крайнем Случае",
          description: "Пожалуйста, взламывайте дверь только после тщательного рассмотрения, в крайнем случае, когда это строго юридически необходимо."
        }
      }
    }
  },
  ta: {
    emergencyWorkerSharing: {
      title: "அவசர ஊழியர் அணுகல்",
      enabled: "அவசர சேவைகளுடன் பகிர்",
      disabled: "அவசர ஊழியர்களுடன் பகிர வேண்டாம்",
      enabledDescription: "சரிபார்க்கப்பட்ட அவசர அனுப்புதல் (ஆம்புலன்ஸ், தீ, காவல்துறை) உங்கள் முகவரியில் அவசரநிலைகளுக்கு பதிலளிக்கும்போது உங்கள் கதவு சாவி மரத்தைக் கோரலாம்.",
      disabledDescription: "அவசர அனுப்புதல் சேவைகளுக்கு உங்கள் அக்கம்பக்கத்தினரின் சாவி தொடர்புகளுக்கு அணுகல் இருக்காது. உங்கள் நியமிக்கப்பட்ட அக்கம்பக்கத்தினர் மட்டுமே இந்த தகவலைப் பயன்படுத்த முடியும்.",
      warning: "இதை முடக்குவது அவசர பதிலை தாமதப்படுத்தலாம், பதிலளிப்பவர்கள் அக்கம்பக்கத்தினரின் சாவிகளைப் பயன்படுத்துவதற்குப் பதிலாக உங்கள் கதவை உடைக்க வேண்டியிருந்தால்.",
      reviewEnabled: "அவசர அனுப்புதல் உங்கள் கதவு சாவி மரத்தை அணுகலாம்",
      reviewDisabled: "அவசர அனுப்புதல் அணுகல் முடக்கப்பட்டது"
    },
    doorBreaking: {
      title: "கதவு உடைப்பு விருப்பம்",
      description: "அவசர பதிலளிப்பவர்கள் சாவி வைத்திருப்பவரை அணுக முடியாவிட்டால், அவர்கள் எப்படி தொடர வேண்டும்?",
      options: {
        break_fast_no_naybors: {
          name: "வேகமாக உடை, அக்கம்பக்கத்தினரை தவிர்",
          description: "அவசரநிலையில், உடனடியாக கதவை உடை. சாவிகளுக்கு அக்கம்பக்கத்தினரைத் தொடர்புகொள்ள நேரத்தை வீணடிக்க வேண்டாம்."
        },
        break_fast_call_naybors: {
          name: "வேகமாக உடை, அக்கம்பக்கத்தினரை அழை",
          description: "சாவிகளுக்கு அக்கம்பக்கத்தினரைத் தொடர்புகொள், ஆனால் தேவைப்பட்டால் கதவை உடைக்க தயங்க வேண்டாம். வேகம் முன்னுரிமை."
        },
        last_resort_only: {
          name: "கடைசி வழி மட்டுமே",
          description: "கவனமான பரிசீலனைக்குப் பிறகு மட்டுமே கதவை உடையுங்கள், சட்டப்பூர்வமாக கடுமையாக தேவைப்படும்போது கடைசி வழியாக."
        }
      }
    }
  },
  te: {
    emergencyWorkerSharing: {
      title: "అత్యవసర కార్మికుల యాక్సెస్",
      enabled: "అత్యవసర సేవలతో షేర్ చేయండి",
      disabled: "అత్యవసర కార్మికులతో షేర్ చేయవద్దు",
      enabledDescription: "ధృవీకరించబడిన అత్యవసర డిస్పాచ్ (అంబులెన్స్, ఫైర్, పోలీసు) మీ చిరునామాలో అత్యవసర పరిస్థితులకు స్పందిస్తున్నప్పుడు మీ డోర్ కీ ట్రీని అభ్యర్థించవచ్చు.",
      disabledDescription: "అత్యవసర డిస్పాచ్ సేవలకు మీ పొరుగువారి కీ సంప్రదింపులకు యాక్సెస్ ఉండదు. మీ నిర్ణీత పొరుగువారు మాత్రమే ఈ సమాచారాన్ని ఉపయోగించగలరు.",
      warning: "దీన్ని నిష్క్రియం చేయడం వల్ల ప్రతిస్పందకులు పొరుగువారి కీలను ఉపయోగించకుండా మీ తలుపును పగలగొట్టవలసి వస్తే అత్యవసర ప్రతిస్పందన ఆలస్యం కావచ్చు.",
      reviewEnabled: "అత్యవసర డిస్పాచ్ మీ డోర్ కీ ట్రీని యాక్సెస్ చేయగలదు",
      reviewDisabled: "అత్యవసర డిస్పాచ్ యాక్సెస్ నిష్క్రియం చేయబడింది"
    },
    doorBreaking: {
      title: "తలుపు పగలగొట్టడం ప్రాధాన్యత",
      description: "అత్యవసర ప్రతిస్పందకులు కీహోల్డర్‌ను చేరుకోలేకపోతే, వారు ఎలా కొనసాగించాలి?",
      options: {
        break_fast_no_naybors: {
          name: "వేగంగా పగలగొట్టండి, పొరుగువారిని దాటండి",
          description: "అత్యవసర పరిస్థితుల్లో, వెంటనే తలుపును పగలగొట్టండి. కీల కోసం పొరుగువారిని సంప్రదించడంలో సమయం వృథా చేయకండి."
        },
        break_fast_call_naybors: {
          name: "వేగంగా పగలగొట్టండి, పొరుగువారికి కాల్ చేయండి",
          description: "కీల కోసం పొరుగువారిని సంప్రదించండి, కానీ అవసరమైతే తలుపును పగలగొట్టడానికి వెనుకాడకండి. వేగం ప్రాధాన్యత."
        },
        last_resort_only: {
          name: "చివరి ఆశ్రయం మాత్రమే",
          description: "దయచేసి జాగ్రత్తగా పరిగణించిన తర్వాతనే తలుపును పగలగొట్టండి, చట్టబద్ధంగా కఠినంగా అవసరమైనప్పుడు చివరి ఆశ్రయంగా."
        }
      }
    }
  },
  tr: {
    emergencyWorkerSharing: {
      title: "Acil Durum Çalışanı Erişimi",
      enabled: "Acil Servislerle Paylaş",
      disabled: "Acil Durum Çalışanlarıyla Paylaşma",
      enabledDescription: "Doğrulanmış acil durum sevki (ambulans, itfaiye, polis) adresinizdeki acil durumlara yanıt verirken Kapı Anahtar Ağacınızı talep edebilir.",
      disabledDescription: "Acil durum sevk hizmetleri komşu anahtar kişilerinize erişim OLMAYACAKTIR. Yalnızca belirlediğiniz komşular bu bilgileri kullanabilir.",
      warning: "Bunu devre dışı bırakmak, müdahale ekiplerinin komşuların elindeki anahtarları kullanmak yerine kapınızı kırmak zorunda kalmaları durumunda acil müdahaleyi geciktirebilir.",
      reviewEnabled: "Acil durum sevki Kapı Anahtar Ağacınıza erişebilir",
      reviewDisabled: "Acil durum sevk erişimi devre dışı"
    },
    doorBreaking: {
      title: "Kapı Kırma Tercihi",
      description: "Acil müdahale ekipleri anahtar sahibine ulaşamazsa, nasıl devam etmeliler?",
      options: {
        break_fast_no_naybors: {
          name: "Hızlı Kır, Komşuları Atla",
          description: "Acil durumlarda kapıyı hemen kırın. Anahtarlar için komşularla iletişim kurmaya zaman harcamayın."
        },
        break_fast_call_naybors: {
          name: "Hızlı Kır, Komşuları Ara",
          description: "Anahtarlar için komşularla iletişime geçin, ancak gerekirse kapıyı kırmaktan çekinmeyin. Hız önceliktir."
        },
        last_resort_only: {
          name: "Yalnızca Son Çare",
          description: "Lütfen kapıyı yalnızca dikkatli bir değerlendirmeden sonra, yasal olarak kesinlikle gerekli olduğunda son çare olarak kırın."
        }
      }
    }
  },
  ur: {
    emergencyWorkerSharing: {
      title: "ہنگامی کارکنوں تک رسائی",
      enabled: "ہنگامی خدمات کے ساتھ شیئر کریں",
      disabled: "ہنگامی کارکنوں کے ساتھ شیئر نہ کریں",
      enabledDescription: "تصدیق شدہ ہنگامی ڈسپیچ (ایمبولینس، فائر، پولیس) آپ کے پتے پر ہنگامی حالات کا جواب دیتے وقت آپ کے ڈور کی ٹری کی درخواست کر سکتے ہیں۔",
      disabledDescription: "ہنگامی ڈسپیچ سروسز کو آپ کے پڑوسیوں کے کی رابطوں تک رسائی نہیں ہوگی۔ صرف آپ کے نامزد پڑوسی ہی یہ معلومات استعمال کر سکتے ہیں۔",
      warning: "اسے غیر فعال کرنے سے ہنگامی ردعمل میں تاخیر ہو سکتی ہے اگر جواب دہندگان کو پڑوسیوں کی چابیاں استعمال کرنے کی بجائے آپ کا دروازہ توڑنا پڑے۔",
      reviewEnabled: "ہنگامی ڈسپیچ آپ کے ڈور کی ٹری تک رسائی حاصل کر سکتی ہے",
      reviewDisabled: "ہنگامی ڈسپیچ رسائی غیر فعال ہے"
    },
    doorBreaking: {
      title: "دروازہ توڑنے کی ترجیح",
      description: "اگر ہنگامی جواب دہندگان کی ہولڈر تک نہیں پہنچ سکتے، تو انہیں کیسے آگے بڑھنا چاہیے؟",
      options: {
        break_fast_no_naybors: {
          name: "جلدی توڑیں، پڑوسیوں کو چھوڑیں",
          description: "ہنگامی حالات میں، فوری طور پر دروازہ توڑ دیں۔ چابیوں کے لیے پڑوسیوں سے رابطہ کرنے میں وقت ضائع نہ کریں۔"
        },
        break_fast_call_naybors: {
          name: "جلدی توڑیں، پڑوسیوں کو کال کریں",
          description: "چابیوں کے لیے پڑوسیوں سے رابطہ کریں، لیکن ضرورت ہو تو دروازہ توڑنے میں ہچکچاہٹ نہ کریں۔ رفتار ترجیح ہے۔"
        },
        last_resort_only: {
          name: "صرف آخری حربہ",
          description: "براہ کرم دروازہ صرف محتاط غور و فکر کے بعد توڑیں، آخری حربے کے طور پر جب قانونی طور پر سختی سے ضروری ہو۔"
        }
      }
    }
  },
  vi: {
    emergencyWorkerSharing: {
      title: "Quyền Truy Cập Nhân Viên Cấp Cứu",
      enabled: "Chia Sẻ với Dịch Vụ Cấp Cứu",
      disabled: "Không Chia Sẻ với Nhân Viên Cấp Cứu",
      enabledDescription: "Điều phối cấp cứu đã xác minh (xe cấp cứu, cứu hỏa, công an) có thể yêu cầu Cây Khóa Cửa của bạn khi phản hồi các trường hợp khẩn cấp tại địa chỉ của bạn.",
      disabledDescription: "Các dịch vụ điều phối cấp cứu sẽ KHÔNG có quyền truy cập vào danh bạ khóa hàng xóm của bạn. Chỉ những hàng xóm được chỉ định của bạn mới có thể sử dụng thông tin này.",
      warning: "Tắt điều này có thể trì hoãn phản hồi cấp cứu nếu người cứu hộ phải phá cửa thay vì sử dụng chìa khóa hàng xóm giữ.",
      reviewEnabled: "Điều phối cấp cứu có thể truy cập Cây Khóa Cửa của bạn",
      reviewDisabled: "Quyền truy cập điều phối cấp cứu bị tắt"
    },
    doorBreaking: {
      title: "Ưu Tiên Phá Cửa",
      description: "Nếu người cứu hộ không thể liên lạc được người giữ chìa khóa, họ nên tiến hành như thế nào?",
      options: {
        break_fast_no_naybors: {
          name: "Phá Nhanh, Bỏ Qua Hàng Xóm",
          description: "Trong trường hợp khẩn cấp, phá cửa ngay lập tức. Đừng lãng phí thời gian liên lạc hàng xóm để lấy chìa khóa."
        },
        break_fast_call_naybors: {
          name: "Phá Nhanh, Gọi Hàng Xóm",
          description: "Liên lạc hàng xóm để lấy chìa khóa, nhưng đừng ngần ngại phá cửa nếu cần. Tốc độ là ưu tiên."
        },
        last_resort_only: {
          name: "Chỉ Là Phương Án Cuối",
          description: "Xin chỉ phá cửa sau khi cân nhắc kỹ, như phương án cuối cùng khi cần thiết về mặt pháp lý."
        }
      }
    }
  },
  zh: {
    emergencyWorkerSharing: {
      title: "急救人员访问权限",
      enabled: "与紧急服务共享",
      disabled: "不与急救人员共享",
      enabledDescription: "经验证的紧急调度（救护车、消防、警察）可以在响应您地址的紧急情况时请求您的门钥匙树。",
      disabledDescription: "紧急调度服务将无法访问您邻居的钥匙联系人。只有您指定的邻居才能使用此信息。",
      warning: "禁用此功能可能会延迟紧急响应，如果响应者需要破门而入而不是使用邻居持有的钥匙。",
      reviewEnabled: "紧急调度可以访问您的门钥匙树",
      reviewDisabled: "紧急调度访问已禁用"
    },
    doorBreaking: {
      title: "破门偏好",
      description: "如果急救人员无法联系到钥匙持有人，他们应该如何进行？",
      options: {
        break_fast_no_naybors: {
          name: "快速破门，跳过邻居",
          description: "在紧急情况下，立即破门。不要浪费时间联系邻居获取钥匙。"
        },
        break_fast_call_naybors: {
          name: "快速破门，呼叫邻居",
          description: "联系邻居获取钥匙，但如果需要，不要犹豫破门。速度是优先的。"
        },
        last_resort_only: {
          name: "仅作为最后手段",
          description: "请仅在仔细考虑后才破门，作为严格法律上必要时的最后手段。"
        }
      }
    }
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
    const translations = newTranslations[locale] || newTranslations.en;

    // Add new translations to keysShared section
    if (!content.keysShared) {
      console.log(`Skipping ${locale}: keysShared section not found`);
      return;
    }

    content.keysShared.emergencyWorkerSharing = translations.emergencyWorkerSharing;
    content.keysShared.doorBreaking = translations.doorBreaking;

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Updated ${locale}`);
  } catch (error) {
    console.error(`Error processing ${locale}:`, error.message);
  }
});

console.log('\nDone! Emergency dispatch i18n translations added.');
