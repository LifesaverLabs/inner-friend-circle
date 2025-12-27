const fs = require('fs');
const path = require('path');

// Turkish translations for all missing sections
const turkishTranslations = {
  "landing": {
    "features": {
      "dataLiberation": {
        "title": "Verileriniz, Sizin Seçiminiz",
        "description": "Tüm verilerinizi istediğiniz zaman dışa aktarın. Tam onay yönetimi, hesap silme ve veri taşınabilirliği ile GDPR uyumlu."
      },
      "nayborNetwork": {
        "title": "Komşu Ağı",
        "description": "Güvenilir komşularla topluluk dayanıklılığı oluşturun. Hızlı SOS erişimi, paylaşılan acil durum kişileri ve karşılıklı yardım."
      },
      "globalReach": {
        "title": "23 Dil",
        "description": "Arapça, Urduca ve İbranice için RTL desteğiyle tam uluslararasılaştırma. Ana dilinizde mevcut."
      }
    }
  },
  "auth": {
    "toasts": {
      "signOutError": "Çıkış yapılamadı",
      "signOutSuccess": "Başarıyla çıkış yapıldı"
    }
  },
  "actions": {
    "refresh": "Yenile",
    "retry": "Tekrar Dene",
    "share": "Paylaş",
    "sharing": "Paylaşılıyor...",
    "selectAll": "Tümünü Seç",
    "clear": "Temizle",
    "copy": "Kopyala",
    "print": "Yazdır",
    "saving": "Kaydediliyor..."
  },
  "emptyState": {
    "noPostsYet": "Henüz gönderi yok",
    "noFriendsYet": {
      "core": "Henüz çekirdek arkadaş yok",
      "inner": "Henüz iç çember arkadaş yok",
      "outer": "Henüz dış çember arkadaş yok"
    },
    "noPostsDescription": {
      "core": "Çekirdek arkadaşlarınız henüz bir şey paylaşmadı. İlk paylaşan siz olun!",
      "inner": "İç çember arkadaşlarınız henüz bir şey paylaşmadı. İlk paylaşan siz olun!",
      "outer": "Dış çember arkadaşlarınız henüz bir şey paylaşmadı. İlk paylaşan siz olun!"
    },
    "getStarted": {
      "core": "Çekirdeğinize 5 arkadaş ekleyerek başlayın.",
      "inner": "İç Çemberinize 15 arkadaş ekleyerek başlayın.",
      "outer": "Dış Çemberinize 150 arkadaş ekleyerek başlayın."
    },
    "addToSee": {
      "core": "Gönderilerini burada görmek için 5 arkadaş ekleyin.",
      "inner": "Gönderilerini burada görmek için 15 arkadaş ekleyin.",
      "outer": "Gönderilerini burada görmek için 150 arkadaş ekleyin."
    },
    "addFriends": {
      "core": "Çekirdek Arkadaş Ekle",
      "inner": "İç Çember Arkadaş Ekle",
      "outer": "Dış Çember Arkadaş Ekle"
    },
    "createPost": "Gönderi Oluştur",
    "noParasoicalsYet": "Henüz parasosyal yok",
    "noAcquaintedYet": "Henüz tanıdık yok",
    "noRoleModelsYet": "Henüz rol model yok",
    "noNayborsYet": "Henüz komşu yok",
    "addParasocialsHint": "Takip ettiğiniz içerik üreticileri, ünlüler veya figürler ekleyin",
    "acquaintedHint": "Arkadaşlar zaman içinde temas eksikliğinden dolayı buraya yeniden sınıflandırılır",
    "roleModelsHint": "Hayat hikayeleri sizi iyi, daha iyi, en iyi olmaya ilham veren insanları ekleyin",
    "nayborsHint": "Komşularınızla tanışın ve buraya ekleyin",
    "addToCircleHint": "En yakın çemberinize birini ekleyin"
  },
  "labels": {
    "phone": "Telefon Numarası",
    "notes": "Notlar",
    "handle": "Kullanıcı Adı"
  },
  "dashboard": {
    "title": "İç Çemberleriniz",
    "subtitle": "En yakın ilişkilerinizi düzenleyin ve ilgilenin",
    "loading": "Çemberleriniz yükleniyor...",
    "tend": "İlgilen",
    "share": "Paylaş",
    "localStorageHint": "💡 Listeleriniz yerel olarak kaydedilir. Cihazlar arası senkronizasyon ve karşılıklı eşleştirme için hesap oluşturun.",
    "dunbarDisclaimer": "Not: Bu Dunbar esinli seviye limitleri, topluluk bilinci bilimi geliştikçe değişebilir. Gelecekteki değişiklikler, belirli seviye sayılarının diğerlerini etkilediği kurallar içerebilir — örneğin, parasosyal bağlantılar izin verilen dış arkadaş kapasitenizi azaltabilir.",
    "toasts": {
      "addedFriend": "{{name}} {{tier}} çemberinize eklendi",
      "movedFriend": "{{name}} {{tier}}'a taşındı",
      "moveError": "Arkadaş taşınamadı",
      "removedFriend": "{{name}} listelerinizden kaldırıldı",
      "addedReserved": "Ayrılmış grup {{tier}}'a eklendi",
      "reservedError": "Ayrılmış grup eklenemedi",
      "updatedReserved": "Ayrılmış grup güncellendi",
      "removedReserved": "Ayrılmış grup kaldırıldı",
      "imported": "{{count}} arkadaş içe aktarıldı",
      "imported_plural": "{{count}} arkadaş içe aktarıldı",
      "skippedDuplicates": "{{count}} kopya atlandı",
      "skippedDuplicates_plural": "{{count}} kopya atlandı",
      "dataLiberation": "Verileriniz size ait. Başka bir yere taşımak için istediğiniz zaman dışa aktarın."
    }
  },
  "mission": {
    "title": "Yüz Yüze Zaman, Reklam Zamanı Değil",
    "description": "Sitemizden ayrıldığınızda kazanırız — en önemli insanlarla gerçek anları paylaşmak için.",
    "learnMore": "Daha fazla bilgi...",
    "showLess": "Daha az göster",
    "inspiration": "İlham kaynağımız? Bu klasik Dentyne Ice reklamı — en iyi anların telefonu bırakıp orada olduğunuzda gerçekleştiğini mükemmel hatırlatıyor:",
    "videoTitle": "Dentyne Ice - Yüz Yüze Zaman",
    "quote": "\"Yüz Yüze Zaman Yarat\" — bu ideal. Mesafe sizi ayırdığında, video aramalarla köprü kurmanıza yardımcı olacağız. Ama her zaman unutmayın: orada olmak kadar iyi bir şey yok.",
    "features": {
      "spark": {
        "title": "Video Aramalar Başlat",
        "description": "Uzaktayken, bir tıkla bağlanın"
      },
      "tend": {
        "title": "Çemberlerinize İlgilenin",
        "description": "Bağlantılar kaybolmadan önce ulaşma hatırlatmaları"
      },
      "pull": {
        "title": "Daha Yakına Çek",
        "description": "Anlamlı bağlantıları daha yakın yörüngelere taşıyın"
      }
    }
  },
  "tierSection": {
    "reserve": "Ayır",
    "reservedCount": "{{count}} Ayrılmış",
    "link": "Bağla",
    "followCreator": "İçerik Üreticisi Takip Et",
    "addRoleModel": "Rol Model Ekle",
    "add": "Ekle"
  },
  "tending": {
    "title": "Çemberlerinize İlgilenin",
    "markDescription": "{{period}} bağlantı kurmadığınız {{tier}} arkadaşlarınızı işaretleyin",
    "periods": {
      "core": "bu hafta",
      "inner": "bu iki hafta",
      "outer": "bu iki ay"
    },
    "peopleCount": "{{count}} kişi",
    "peopleCount_plural": "{{count}} kişi",
    "noFriendsInTier": "Bu seviyede henüz arkadaş yok",
    "checkInstruction": "✓ Yeterince konuşmadıklarınızı işaretleyin:",
    "noPhone": "telefon yok",
    "call": "Ara",
    "maybeLater": "Belki Sonra",
    "doneTending": "İlgilenme Tamamlandı",
    "finish": "Bitir",
    "mobileHint": "İletişim eylemleri mobil cihazlarda en iyi şekilde çalışır",
    "reconnect": {
      "title": "Yeniden Bağlanma Zamanı",
      "description": "Bu arkadaşlar biraz zamanınızı kullanabilir"
    },
    "toasts": {
      "allTended": "Harika! Tüm çemberlerinize ilgilendiniz 🌱",
      "noPhone": "{{name}} için telefon numarası yok",
      "connecting": "{{method}} ile {{name}}'a bağlanılıyor",
      "rememberReachOut": "Yakında ulaşmayı unutmayın! 💛",
      "friendsWaiting": "{{count}} arkadaş sizden haber bekliyor",
      "friendsWaiting_plural": "{{count}} arkadaş sizden haber bekliyor"
    }
  },
  "nayborSOS": {
    "steps": {
      "category": "Ne tür yardıma ihtiyacınız var?",
      "contacts": "İletişim kurmak için komşu seçin"
    },
    "critical": "Kritik",
    "emergencyWarning": "Hayati tehlike durumlarında önce 112'yi arayın",
    "suggestedActions": "Önerilen eylemler:",
    "addDetails": "Ayrıntı ekle (isteğe bağlı)",
    "describePlaceholder": "Durumunuzu açıklayın...",
    "includeLocation": "Konum bilgisi ekle",
    "chooseNaybors": "Komşu Seç",
    "chooseNayborsAria": "İletişim kurmak için komşu seçmeye devam edin",
    "nayborsSelected": "{{count}} komşu seçildi",
    "nayborsSelected_plural": "{{count}} komşu seçildi",
    "copyMessage": "Mesajı kopyala",
    "messageAll": "Hepsine Mesaj ({{count}})",
    "contacted": "{{count}} komşuyla iletişim kuruldu",
    "contacted_plural": "{{count}} komşuyla iletişim kuruldu",
    "toasts": {
      "messageCopied": "Mesaj panoya kopyalandı",
      "noNayborsSelected": "Telefon numarası olan komşu seçilmedi"
    }
  },
  "callActions": {
    "startKall": "Arama başlat",
    "kallNow": "Şimdi {{name}}'ı ara",
    "scheduleKall": "Arama planla",
    "scheduleWith": "{{name}} ile planla",
    "sharedServices": "Paylaşılan hizmetler:",
    "theirPreferences": "Tercihleri:",
    "noMethods": "İletişim yöntemi yok",
    "requestInfo": "İletişim bilgisi iste",
    "toasts": {
      "connecting": "{{service}} ile bağlanılıyor",
      "openService": "Bağlanmak için {{service}}'i açın"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "Bağlı Kalın",
        "description": "Arkadaşların size kolayca ulaşabilmesi için iletişim yöntemlerinizi ekleyin."
      },
      "channels": {
        "title": "Kanallarınızı Ekleyin",
        "description": "Hangi video arama ve mesajlaşma uygulamalarını kullanıyorsunuz?"
      },
      "complete": {
        "title": "Hazırsınız!",
        "description": "Arkadaşlarınız artık sizinle arama başlatabilir veya planlayabilir."
      }
    },
    "skipForNow": "Şimdilik atla",
    "getStarted": "Başla",
    "service": "Hizmet",
    "yourContactInfo": "{{service}} İletişim Bilginiz",
    "spontaneous": "Anlık",
    "scheduled": "Planlanmış",
    "addMethod": "Yöntem Ekle",
    "continue": "Devam",
    "methodsAdded": "{{count}} iletişim yöntemi eklediniz",
    "methodsAdded_plural": "{{count}} iletişim yöntemi eklediniz",
    "publicProfile": "Herkese Açık Profil",
    "privateProfile": "Özel Profil",
    "publicProfileHint": "Herkes sizi kullanıcı adınızla bulabilir",
    "privateProfileHint": "Sadece onaylanmış arkadaşlar profilinizi görebilir",
    "addMore": "Daha Fazla Ekle",
    "saving": "Kaydediliyor...",
    "completeSetup": "Kurulumu Tamamla",
    "toasts": {
      "enterContactInfo": "Lütfen iletişim bilgisi girin",
      "saveFailed": "İletişim yöntemleri kaydedilemedi"
    }
  },
  "keysShared": {
    "addressHelp": "Bu adres, komşularınız sizin adınıza yardım istediğinde acil müdahale ekipleriyle paylaşılacaktır.",
    "address": "Adres",
    "addressPlaceholder": "Örnek Sokak No: 123",
    "unitNumber": "Daire/Kapı No",
    "unitPlaceholder": "Daire 4B",
    "entryInstructions": "Özel Giriş Talimatları",
    "instructionsPlaceholder": "Zil kapının sağında, iki kez çalın...",
    "instructionsHint": "Evinize erişim hakkında müdahale ekiplerinin bilmesi gereken tüm ayrıntıları ekleyin",
    "keyType": "Erişim Türü",
    "keyTypes": {
      "physical": "Fiziksel Anahtar",
      "digital": "Dijital Kod",
      "both": "Her İkisi"
    },
    "digitalCodeType": "Kod Türü",
    "codeTypes": {
      "keypad": "Kapı Tuş Takımı",
      "smart_lock": "Akıllı Kilit Uygulaması",
      "garage": "Garaj Kodu",
      "other": "Diğer"
    },
    "notes": "Notlar (isteğe bağlı)",
    "notesPlaceholder": "Anahtar mavi saksının altında...",
    "confirmKeyHolder": "Onayla",
    "currentKeyHolders": "Mevcut Anahtar Sahipleri",
    "selectNaybors": "Erişimi olan bir komşu ekleyin:",
    "noNaybors": "Anahtar paylaşmak için önce komşu ekleyin",
    "allNayborsAssigned": "Tüm komşularınız atandı",
    "mandatoryScenarios": "Zorunlu Giriş İzinleri",
    "optionalScenarios": "İsteğe Bağlı Giriş İzinleri",
    "optionalScenariosHelp": "Bu senaryolar için komşuların girip giremeyeceğini seçebilirsiniz.",
    "mandatoryScenariosHelp": "Bu hayati tehlike veya güvenlik açısından kritik senaryolar her zaman girişe izin verir. Hayatı, uzuvları ve masum insanları travmadan korudukları için devre dışı bırakılamazlar.",
    "scenarios": {
      "cardiac_arrest": {
        "name": "Kalp Durması",
        "description": "Kalp krizi veya ani kalp durması — her saniye önemli"
      },
      "choking": {
        "name": "Boğulma",
        "description": "Boğulma acil durumu — hava yolu tıkalı, acil yardım gerekli"
      },
      "drowning": {
        "name": "Suda Boğulma",
        "description": "Havuz, küvet veya diğer suda boğulma"
      },
      "anaphylaxis": {
        "name": "Anafilaktik Şok",
        "description": "Arı sokması, yiyecek, ilaçtan kaynaklanan şiddetli alerjik reaksiyon"
      },
      "elderly_fall": {
        "name": "Yaşlı Düşmesi",
        "description": "Yaşlı kişi düştü, kalkamıyor, muhtemelen yaralı"
      },
      "fire": {
        "name": "Yangın",
        "description": "Yangın algılandı — hayat, uzuv, doku, hareketsiz veya uyuyan herkes için tehdit"
      },
      "gas_leak": {
        "name": "Gaz Kaçağı",
        "description": "Gaz kaçağı algılandı — patlama/zehirlenme riski"
      },
      "carbon_monoxide": {
        "name": "Karbon Monoksit",
        "description": "CO dedektör alarmı — sessiz katil, sakinler bilinçsiz olabilir"
      },
      "childhood_corporal": {
        "name": "Çocuklara Bedensel Ceza",
        "description": "Çocuk bedensel ceza hakkında komşuları uyarıyor. Araştırmalar topluluk müdahalesinin gelecekteki şiddeti önlediğini gösteriyor."
      },
      "take10_spiral": {
        "name": "Take 10 Bağırma Sarmalı",
        "description": "Ev içi bağırma kabul edilemez şekilde tırmanıyor. Sakinleştirme müdahalesi gerekli."
      },
      "bedroom_consent": {
        "name": "Yatak Odası Rıza Çatışması",
        "description": "Yatak odası rıza çatışması acil durumu algılandı — acil müdahale gerekli"
      },
      "medical_other": {
        "name": "Diğer Tıbbi Acil",
        "description": "Eve giriş gerektiren diğer tıbbi acil durum"
      },
      "intruder_check": {
        "name": "Davetsiz Misafir Kontrolü",
        "description": "Yanıt veremediğinizde şüpheli davetsiz misafir kontrolü"
      },
      "welfare_check": {
        "name": "Sağlık Kontrolü",
        "description": "Uzun süre yanıt vermediğinizde genel sağlık kontrolü"
      },
      "flooding": {
        "name": "Su Baskını/Kaçağı",
        "description": "Su kaçağı veya baskın — mülk hasarı önleme (hayati tehlike değil)"
      }
    },
    "yourAddress": "Adresiniz",
    "noAddressSet": "Adres belirlenmedi",
    "unit": "Birim",
    "keyHoldersSummary": "{{count}} komşunun anahtarı var",
    "keyHoldersSummary_plural": "{{count}} komşunun anahtarı var",
    "noKeyHolders": "Anahtar sahibi atanmadı",
    "permissionsSummary": "Giriş İzinleri",
    "mandatoryCount": "{{count}}",
    "mandatoryLabel": "zorunlu (her zaman izinli)",
    "optionalCount": "{{count}}",
    "optionalLabel": "isteğe bağlı etkin",
    "reviewWarning": "Bu ayarları kaydederek, belirlenen komşularınızı seçilen acil durum senaryolarında evinize girme yetkisi veriyorsunuz. Bu kişilere evinize erişim konusunda güvendiğinizden emin olun.",
    "savePreferences": "Tercihleri Kaydet",
    "toasts": {
      "keyHolderAdded": "Anahtar sahibi eklendi",
      "keyHolderRemoved": "Anahtar sahibi kaldırıldı",
      "saved": "Paylaşılan anahtar tercihleri kaydedildi"
    }
  },
  "reserved": {
    "spotsCount_plural": "{{count}} Ayrılmış Yer",
    "spotsLabel_plural": "ayrılmış yer"
  },
  "addLinkedFriend": {
    "title": "{{tier}}'a Bağlı Arkadaş Ekle",
    "description": "Bağlantı istemek için birini iletişim bilgisiyle bulun.",
    "findBy": "Şununla bul",
    "enterUsernameHint": "Kullanıcı adını tam olarak ayarladıkları gibi girin",
    "enterContactHint": "{{type}}'ı tam olarak kaydettikleri gibi girin",
    "errors": {
      "noUserHandle": "Bu kullanıcı adıyla kullanıcı bulunamadı. Hesapları olduğundan ve kullanıcı adı ayarladıklarından emin olun.",
      "noUserContact": "Bu {{type}} ile kullanıcı bulunamadı. Henüz profillerine eklememiş olabilirler.",
      "searchError": "Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      "connectionFailed": "Bağlantı isteği gönderilemedi"
    },
    "userFound": "Kullanıcı Bulundu",
    "showCircleLevel": "Çember seviyesini göster",
    "circleVisibleHint": "Onları {{tier}} olarak eklediğinizi görecekler",
    "circleHiddenHint": "Hangi çembere eklediğinizi görmeyecekler",
    "sendRequest": "Bağlantı İsteği Gönder",
    "privacyNote": "Kabul edene kadar sadece onları bulmak için kullandığınız iletişim bilgisini görecekler. Kabul edildikten sonra, her ikiniz de birbirinizin tam iletişim yöntemlerini göreceksiniz.",
    "serviceTypes": {
      "phone": "Telefon Numarası",
      "email": "E-posta Adresi",
      "handle": "Kullanıcı Adı",
      "signal": "Signal",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "facetime": "FaceTime"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "Çerez kullanıyoruz",
      "description": "Deneyiminizi geliştirmek için çerez kullanıyoruz. Temel çerezler uygulamanın çalışması için gereklidir.",
      "learnMore": "Daha fazla bilgi",
      "customize": "Özelleştir",
      "customizeAria": "Çerez tercihlerini özelleştir",
      "essentialOnly": "Sadece Temel",
      "essentialOnlyAria": "Sadece temel çerezleri kabul et",
      "acceptAll": "Tümünü Kabul Et",
      "acceptAllAria": "Tüm çerezleri kabul et",
      "settingsTitle": "Çerez Tercihleri",
      "settingsDescription": "Hangi çerez türlerine izin vermek istediğinizi seçin. Temel çerezler her zaman etkindir çünkü sitenin çalışması için gereklidir.",
      "savePreferences": "Tercihleri Kaydet",
      "required": "Gerekli",
      "essential": {
        "title": "Temel Çerezler",
        "description": "Kimlik doğrulama ve güvenlik gibi temel site işlevselliği için gereklidir."
      },
      "functional": {
        "title": "İşlevsel Çerezler",
        "description": "Dil ayarları ve UI özelleştirmeleri gibi tercihlerinizi hatırlar."
      },
      "analytics": {
        "title": "Analitik Çerezler",
        "description": "Deneyimi geliştirmek için ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur."
      },
      "marketing": {
        "title": "Pazarlama Çerezleri",
        "description": "İlgili reklamlar sunmak ve kampanya etkinliğini izlemek için kullanılır."
      }
    },
    "settings": {
      "cookiePreferences": "Çerez Tercihleri",
      "cookieDescription": "Kullanmamıza izin verdiğiniz çerez türlerini yönetin.",
      "consentHistory": "Onay Geçmişi",
      "consentHistoryDescription": "Onay kayıtlarınızı görüntüleyin ve yönetin.",
      "consentGiven": "Onay verildi",
      "consentVersion": "Şartlar sürümü",
      "noConsent": "Onay kaydı bulunamadı. Lütfen çerez politikasını kabul edin.",
      "withdrawConsent": "Onayı Geri Çek",
      "withdrawWarning": "Onayı geri çekmek çerez tercihlerinizi sıfırlayacak ve bazı özellikleri sınırlayabilir. Emin misiniz?",
      "confirmWithdraw": "Evet, Onayı Geri Çek",
      "dataRights": "Veri Haklarınız",
      "dataRightsDescription": "GDPR kapsamında verilerinize erişme, dışa aktarma ve silme hakkına sahipsiniz.",
      "exportData": "Verilerimi Dışa Aktar",
      "exportDescription": "Tüm verilerinizi taşınabilir formatta indirin",
      "deleteAccount": "Hesabımı Sil",
      "deleteDescription": "Hesabınızı ve tüm verileri kalıcı olarak silin"
    },
    "deletion": {
      "title": "Hesabınızı Silin",
      "description": "Bu, hesabınızı ve tüm ilişkili verileri kalıcı olarak silecektir.",
      "warningTitle": "Uyarı: Bu geri alınamaz",
      "warningDescription": "Silindikten sonra hesabınız ve tüm veriler kalıcı olarak kaldırılacaktır. Saklamak istiyorsanız önce verilerinizi dışa aktardığınızdan emin olun.",
      "whatDeleted": "Ne silinecek:",
      "deletedItems": {
        "profile": "Profiliniz ve kişisel bilgileriniz",
        "connections": "Tüm arkadaş bağlantılarınız ve çemberleriniz",
        "posts": "Tüm gönderileriniz ve paylaşılan içerik",
        "preferences": "Tercihleriniz ve ayarlarınız",
        "keysShared": "Paylaşılan Anahtarlar acil erişim ayarlarınız"
      },
      "gracePeriodTitle": "30 Günlük Bekleme Süresi",
      "gracePeriodDescription": "Hesabınız {{days}} gün sonra silinmek üzere planlanacaktır. Bu süre içinde giriş yaparak silmeyi iptal edebilirsiniz.",
      "exportFirst": "Silmeden önce verilerinizi dışa aktarmak ister misiniz?",
      "exportData": "Verileri Dışa Aktar",
      "exported": "Veriler Dışa Aktarıldı",
      "continue": "Silmeye Devam Et",
      "confirmTitle": "Hesap Silmeyi Onayla",
      "confirmDescription": "Bu son onayınız. Devam etmek için kimliğinizi doğrulayın.",
      "typeEmail": "Onaylamak için e-postanızı yazın: {{email}}",
      "emailMismatch": "E-posta hesabınızla eşleşmiyor",
      "reasonLabel": "Ayrılma nedeni",
      "reasonPlaceholder": "Neden ayrıldığınızı paylaşarak gelişmemize yardımcı olun...",
      "understandConsequences": "Hesabımın ve tüm verilerin bekleme süresinden sonra kalıcı olarak silineceğini ve bu işlemin geri alınamayacağını anlıyorum.",
      "deleting": "Silme planlanıyor...",
      "confirmDelete": "Hesabımı Sil",
      "scheduledTitle": "Silme Planlandı",
      "scheduledDescription": "Hesabınız silinmek üzere planlandı.",
      "scheduledDate": "Hesabınız şu tarihte kalıcı olarak silinecek:",
      "cancelInfo": "Silmeyi iptal etmek için planlanan tarihten önce hesabınıza giriş yapmanız yeterlidir."
    },
    "age": {
      "title": "Yaş Doğrulama",
      "description": "Gizlilik düzenlemelerine uymak için yaşınızı doğrulamamız gerekiyor.",
      "whyTitle": "Neden soruyoruz",
      "whyDescription": "GDPR kapsamında {{age}} yaşın altındaki kullanıcıların hesap oluşturmak için ebeveyn onayı gerekir.",
      "birthYearLabel": "Hangi yıl doğdunuz?",
      "selectYear": "Yıl seçin",
      "privacyNote": "Uyumluluk amacıyla sadece doğum yılınızı saklıyoruz.",
      "minorTitle": "Ebeveyn Onayı Gerekli",
      "minorDescription": "{{age}} yaşın altındaki kullanıcılar için ebeveyn onayı gereklidir. Lütfen bir ebeveyn veya vasiden hesap oluşturmanıza yardımcı olmalarını isteyin.",
      "parentalRequired": "Ebeveyn Onayı Gerekli",
      "verify": "Yaşı Doğrula"
    }
  },
  "admin": {
    "dispatch": {
      "title": "Sevk Hesabı Doğrulama",
      "searchPlaceholder": "Kuruluş, e-posta veya kişi adına göre ara...",
      "filters": {
        "all": "Tüm Hesaplar"
      },
      "noAccounts": "Kriterlerinize uyan hesap bulunamadı",
      "accessDenied": {
        "title": "Erişim Reddedildi",
        "description": "Sevk doğrulama paneline erişim izniniz yok."
      },
      "actions": {
        "verify": "Doğrula",
        "reject": "Reddet",
        "suspend": "Askıya Al"
      },
      "success": {
        "verify": "Hesap başarıyla doğrulandı",
        "reject": "Hesap reddedildi",
        "suspend": "Hesap askıya alındı"
      },
      "errors": {
        "fetchFailed": "Hesaplar alınamadı",
        "actionFailed": "İşlem başarısız. Lütfen tekrar deneyin."
      },
      "detail": {
        "description": "Kuruluş ayrıntılarını ve doğrulama belgelerini inceleyin",
        "organization": "Kuruluş Ayrıntıları",
        "name": "Ad",
        "type": "Tür",
        "jurisdictions": "Yetki Alanları",
        "legal": "Yasal Bilgiler",
        "taxId": "Vergi Kimlik No",
        "insurance": "Sigorta Şirketi",
        "policyNumber": "Poliçe Numarası",
        "registeredAgent": "Kayıtlı Temsilci",
        "contact": "İletişim Bilgileri",
        "contactName": "İletişim Adı",
        "contactEmail": "E-posta",
        "contactPhone": "Telefon",
        "status": "Hesap Durumu",
        "verificationStatus": "Durum",
        "createdAt": "Başvuru Tarihi",
        "rejectionReason": "Ret Nedeni"
      },
      "confirm": {
        "verifyTitle": "Hesabı Doğrula?",
        "verifyDescription": "Bu, kuruluşa acil durumlarda sakinlerin Kapı Anahtar Ağacı bilgilerine erişim hakkı verecektir.",
        "rejectTitle": "Hesabı Reddet?",
        "rejectDescription": "Lütfen ret için bir neden belirtin. Bu kuruluşla paylaşılacaktır.",
        "suspendTitle": "Hesabı Askıya Al?",
        "suspendDescription": "Bu, kuruluşun erişimini derhal iptal edecektir. Lütfen bir neden belirtin.",
        "reason": "Neden",
        "reasonPlaceholder": "Bu hesabın neden reddedildiğini/askıya alındığını açıklayın...",
        "processing": "İşleniyor..."
      }
    }
  },
  "dev": {
    "label": "Geliştirici",
    "panelTitle": "Geliştirici Paneli",
    "mode": "Geliştirme Modu",
    "authStatus": "Kimlik Durumu",
    "notLoggedIn": "Giriş yapılmadı",
    "authActions": "Kimlik İşlemleri",
    "refreshButton": "Yenile",
    "clearApp": "Uygulamayı Temizle",
    "clearAll": "Tümünü Temizle",
    "forceSignOut": "Zorla Çıkış Yap",
    "toasts": {
      "clearStorage": "{{count}} uygulama localStorage anahtarı temizlendi",
      "clearAll": "Tüm localStorage ve sessionStorage temizlendi",
      "signOut": "Zorla çıkış yapıldı ve kimlik depolaması temizlendi",
      "signOutFailed": "Zorla çıkış yapılamadı",
      "refreshed": "Oturum yenilendi",
      "refreshFailed": "Oturum yenilenemedi"
    },
    "forceLogout": "Zorla Çıkış",
    "storageActions": "Depolama İşlemleri",
    "storageInspector": "Depolama Denetleyicisi",
    "noStorageData": "localStorage verisi yok",
    "chars": "karakter",
    "tips": {
      "title": "İpuçları",
      "sessions": "Oturumlar sayfa yenilemelerinde kalıcıdır",
      "clearApp": "Arkadaş listelerini sıfırlamak için \"Uygulama Verilerini Temizle\" kullanın",
      "forceLogout": "Kimlik durumunu tamamen temizlemek için \"Zorla Çıkış\" kullanın"
    }
  },
  "contactMethods": {
    "title": "İletişim Yöntemleri",
    "subtitle": "Arkadaşların size ulaşabilmesi için tercih ettiğiniz video arama ve mesajlaşma hizmetlerini ekleyin",
    "addButton": "İletişim Yöntemi Ekle",
    "addButtonCompact": "Ekle",
    "addDialogTitle": "İletişim Yöntemi Ekle",
    "addDialogDescription": "Arkadaşların size video aramaları için ulaşması için bir yol ekleyin",
    "serviceLabel": "Hizmet",
    "contactInfoLabel": "{{service}} İletişim Bilginiz",
    "labelOptional": "Etiket (isteğe bağlı)",
    "labelPlaceholder": "örn., Kişisel, İş, Ev",
    "labelHint": "Aynı hizmette birden fazla hesabı ayırt etmenize yardımcı olur",
    "availableFor": "Şunlar için uygun",
    "spontaneousKalls": "Anlık Aramalar",
    "spontaneousTooltip": "Arkadaşlar hemen bağlanmak istediğinde anlık video aramalar",
    "scheduledKalls": "Planlanmış Aramalar",
    "scheduledTooltip": "Belirli bir saat için önceden planlanmış video toplantılar",
    "addMethod": "Yöntem Ekle",
    "dragToReorder": "Yeniden sıralamak için sürükleyin",
    "dragReorderHint": "Önceliği yeniden sıralamak için sürükleyin. #1 tercih ettiğiniz yöntemdir.",
    "noSpontaneousMethods": "Henüz anlık arama yöntemi eklenmedi",
    "noScheduledMethods": "Henüz planlanmış arama yöntemi eklenmedi"
  },
  "post": {
    "voiceNote": "Sesli Not",
    "audioUnavailable": "Ses mevcut değil",
    "callInvitation": "Arama Daveti",
    "joinCall": "Katıl",
    "meetupInvitation": "Buluşma Daveti",
    "location": "Konum: {{name}}",
    "rsvpYes": "Evet Katılacağım",
    "rsvpMaybe": "Belki",
    "nearbyMessage": "Yakınlardayım!",
    "lifeUpdate": "Hayat Güncellemesi",
    "call": "Ara",
    "addContactInfo": "İletişim Bilgisi Ekle",
    "addContactInfoTooltip": "{{name}} için iletişim bilgisi ekle",
    "callViaHighFidelity": "{{method}} ile ara (yüksek kalite)",
    "addMoreContactInfo": "Daha fazla iletişim bilgisi ekle",
    "usePhoneRecommendation": "En iyi sonuçlar için aramalar için telefonunuzu kullanın",
    "voiceReplyTooltip": "Sesli yanıt gönder (yüksek kalite)",
    "meetupTooltip": "Buluşma planla (yüksek kalite)",
    "commentTooltip": "Yorum ekle",
    "likeTooltip": "Bu gönderiyi beğen",
    "likeTooltipHighFidelity": "Beğen (daha anlamlı bir etkileşim düşünün)",
    "shareTooltip": "Paylaş",
    "toasts": {
      "noContact": "İletişim bilgisi mevcut değil",
      "contactFailed": "İletişim başlatılamadı",
      "noContactPerson": "Bu kişi için iletişim bilgisi mevcut değil"
    },
    "callVia": "{{method}} ile ara",
    "voiceReply": "Sesli Yanıt",
    "meetup": "Buluşma",
    "comment": "Yorum",
    "like": "Beğen",
    "selectContactMethod": "İletişim yöntemi seç",
    "warningPlatform": "Uyarı: platformun gözetim endişeleri olabilir",
    "currentlySelected": "Şu anda seçili",
    "dontShowMonth": "1 ay gösterme",
    "warningSilenced": "{{method}} uyarıları gelecek aya kadar susturuldu",
    "connectingVia": "{{method}} ile bağlanılıyor"
  },
  "parasocial": {
    "creatorDashboard": "İçerik Üreticisi Paneli",
    "shareContent": "İçerik Paylaş",
    "shareNewContent": "Yeni İçerik Paylaş",
    "shareDescription": "Parasosyal takipçilerinizle bir bağlantı paylaşın",
    "noContentShared": "Henüz içerik paylaşılmadı",
    "noContentHint": "Takipçilerinizle etkileşim için bağlantılar paylaşın",
    "title": "Başlık",
    "titlePlaceholder": "Ne paylaşıyorsunuz?",
    "url": "URL",
    "urlPlaceholder": "https://...",
    "description": "Açıklama",
    "descriptionPlaceholder": "Kısa açıklama (isteğe bağlı)",
    "deleteTitle": "Bu paylaşımı sil?",
    "deleteDescription": "Bu, bağlantıyı takipçilerinizin akışlarından kaldıracaktır.",
    "clicks": "{{count}} tıklama",
    "clicks_plural": "{{count}} tıklama",
    "engagement": "%{{percent}} etkileşim",
    "toasts": {
      "titleAndUrlRequired": "Başlık ve URL gerekli",
      "invalidUrl": "Lütfen geçerli bir URL girin",
      "sharedContent": "İçerik takipçilerinizle paylaşıldı!",
      "deleted": "Paylaşım silindi"
    }
  },
  "profileSettings": {
    "title": "Profil Ayarları",
    "description": "Profilinizi ve iletişim tercihlerinizi yönetin",
    "tabs": {
      "profile": "Profil",
      "contact": "İletişim",
      "creator": "İçerik Üreticisi"
    },
    "displayName": "Görünen Ad",
    "displayNamePlaceholder": "Adınız",
    "handle": "Kullanıcı Adı",
    "handlePlaceholder": "kullanici_adiniz",
    "handleHint": "3-30 karakter. Sadece harfler, rakamlar ve alt çizgi.",
    "publicProfile": "Herkese Açık Profiliniz",
    "publicProfileLabel": "Herkese Açık Profil",
    "privateProfileLabel": "Özel Profil",
    "publicDescription": "Herkes profil sayfanızı görüntüleyebilir",
    "privateDescription": "Sadece siz ve onaylanmış arkadaşlar profilinizi görüntüleyebilir",
    "parasocialMode": "Parasosyal Kişilik Modu",
    "parasocialModeDescription": "Hayranlardan parasosyal bağlantılar almak ve onlarla içerik paylaşmak isteyen bir kamusal figür, içerik üreticisi veya ünlüyseniz bunu etkinleştirin.",
    "parasocialModeHint": "Etkinleştirildiğinde, diğer kullanıcılar sizi Parasosyaller çemberlerine ekleyebilir ve paylaştığınız içerikleri görebilir. Bu değişikliği uygulamak için profilinizi kaydedin.",
    "saveProfile": "Profili Kaydet",
    "saveSettings": "Ayarları Kaydet",
    "toasts": {
      "updated": "Profil güncellendi",
      "updateFailed": "Profil güncellenemedi",
      "linkCopied": "Bağlantı kopyalandı!"
    }
  },
  "editFriend": {
    "title": "Kişiyi Düzenle",
    "description": "{{name}} için iletişim bilgilerini güncelleyin",
    "namePlaceholder": "Arkadaşın adı",
    "emailPlaceholder": "arkadas@ornek.com",
    "preferredContactMethod": "Tercih Edilen İletişim Yöntemi",
    "selectContactMethod": "Nasıl ulaşılacağını seçin",
    "notesPlaceholder": "Bu kişi hakkında notlar...",
    "saveChanges": "Değişiklikleri Kaydet"
  },
  "followCreator": {
    "title": "İçerik Üreticisi Takip Et",
    "description": "Takip etmek ve akışınızda içeriklerini görmek için doğrulanmış içerik üreticileri arayın.",
    "searchLabel": "Ad veya kullanıcı adıyla ara",
    "searchPlaceholder": "@ureticinin_kullanici_adi veya Üretici Adı",
    "creatorModeHint": "Sadece İçerik Üreticisi Modunu etkinleştiren kullanıcılar arama sonuçlarında görünecektir.",
    "toasts": {
      "following": "Şimdi {{name}}'ı takip ediyorsunuz",
      "alreadyFollowing": "Bu içerik üreticisini zaten takip ediyorsunuz",
      "followFailed": "Takip edilemedi"
    },
    "errors": {
      "searching": "Arama sırasında bir hata oluştu.",
      "noCreators": "Bu aramayla eşleşen içerik üreticisi bulunamadı. Henüz içerik üreticisi modunu etkinleştirmemiş olabilirler.",
      "noCreatorsFound": "Bu aramayla eşleşen içerik üreticisi bulunamadı."
    }
  },
  "dispatch": {
    "validation": {
      "organizationNameRequired": "Kuruluş adı gereklidir",
      "jurisdictionRequired": "En az bir yetki alanı gereklidir",
      "taxIdRequired": "Vergi kimlik numarası gereklidir",
      "insuranceRequired": "Sigorta şirketi adı gereklidir",
      "policyRequired": "Poliçe numarası gereklidir",
      "agentNameRequired": "Kayıtlı temsilci adı gereklidir",
      "agentContactRequired": "Kayıtlı temsilci iletişimi gereklidir",
      "contactNameRequired": "Birincil iletişim adı gereklidir",
      "invalidEmail": "Lütfen geçerli bir e-posta adresi girin",
      "invalidPhone": "Lütfen geçerli bir telefon numarası girin",
      "passwordMin": "Şifre en az 8 karakter olmalıdır",
      "passwordMatch": "Şifreler eşleşmelidir",
      "termsRequired": "Şartları kabul etmelisiniz"
    }
  },
  "privacy": {
    "title": "Gizlilik Politikası",
    "lastUpdated": "Son güncelleme: 1 Ocak 2025",
    "philosophy": {
      "title": "Gizlilik Felsefemiz",
      "description": "InnerFriend temel bir önerme üzerine kurulmuştur: ilişkileriniz sizindir. Dikkatinizi paraya çeviren veya verilerinizi satan bir sosyal ağ değiliz. En önemli insanlarla anlamlı bağlantıları sürdürmenize yardımcı olan bir araçız."
    },
    "dataCollection": {
      "title": "Topladığımız Veriler",
      "intro": "Sadece hizmeti sağlamak için gerekli olanı topluyoruz:",
      "items": {
        "account": "Hesap Bilgileri: Hesap oluşturduğunuzda e-posta ve şifre (şifreli)",
        "friends": "Arkadaş Listeleri: Eklediğiniz kişilerin adları ve isteğe bağlı iletişim bilgileri",
        "connections": "Bağlantı Verileri: Etkinleştirmeyi seçerseniz karşılıklı eşleştirme meta verileri",
        "preferences": "Tercihler: Dil ve bildirim tercihleri gibi uygulama ayarlarınız"
      }
    },
    "localStorage": {
      "title": "Önce Yerel",
      "description": "Varsayılan olarak arkadaş listeleriniz sadece cihazınızda saklanır. Cihazlar arası senkronizasyon veya karşılıklı eşleştirme gibi özellikler için hesap oluşturmayı seçmediğiniz sürece sunucularımıza asla dokunmayız."
    },
    "noSelling": {
      "title": "Verilerinizi Asla Satmayız",
      "description": "Verileriniz satılık değil. Nokta. Reklamcılar, veri simsarları veya pazarlama amaçlı üçüncü taraflarla paylaşmıyoruz."
    },
    "gdprRights": {
      "title": "Haklarınız (GDPR Uyumluluğu)",
      "intro": "Verileriniz üzerinde tam kontrole sahipsiniz:",
      "items": {
        "access": "Erişim: Tüm verilerinizi istediğiniz zaman taşınabilir formatta dışa aktarın",
        "deletion": "Silme: Hesabınızı ve tüm ilişkili verileri tek tıkla silin",
        "rectification": "Düzeltme: Bilgilerinizden herhangi birini güncelleyin veya düzeltin",
        "portability": "Taşınabilirlik: Verilerinizi Dunbar uyumlu diğer sosyal ağlara taşıyın"
      }
    },
    "security": {
      "title": "Güvenlik",
      "description": "Aktarım halinde ve dinlenme halindeki veriler için endüstri standardı şifreleme kullanıyoruz. Şifreler hashlenir ve asla düz metin olarak saklanmaz."
    },
    "contact": {
      "title": "İletişim",
      "description": "Gizlilik soruları? Bize ulaşın: privacy@lifesaverlabs.org"
    }
  },
  "terms": {
    "title": "Hizmet Şartları",
    "lastUpdated": "Son güncelleme: 1 Ocak 2025",
    "introduction": {
      "title": "Giriş",
      "description": "InnerFriend'e hoş geldiniz. Hizmetimizi kullanarak bu şartları kabul etmiş olursunuz. Basit ve okunabilir tuttuk."
    },
    "service": {
      "title": "Hizmet",
      "description": "InnerFriend, sosyal çemberlerinizi organize etmek ve bakımını yapmak için araçlar sağlayarak anlamlı ilişkileri sürdürmenize yardımcı olur. Sosyal bir platform değiliz — kamusal içerik barındırmıyor veya kamusal bağlantıları kolaylaştırmıyoruz."
    },
    "responsibilities": {
      "title": "Sorumluluklarınız",
      "intro": "InnerFriend kullanarak şunları kabul ediyorsunuz:",
      "items": {
        "accurate": "Hesap oluştururken doğru bilgi sağlamak",
        "secure": "Giriş bilgilerinizi güvende tutmak",
        "privacy": "Listelerinize eklediğiniz kişilerin gizliliğine saygı göstermek",
        "lawful": "Hizmeti sadece yasal amaçlarla kullanmak"
      }
    },
    "intellectualProperty": {
      "title": "Fikri Mülkiyet",
      "description": "InnerFriend MIT lisansı altında açık kaynaklıdır. Verileriniz size aittir — tam mülkiyeti siz korursunuz."
    },
    "liability": {
      "title": "Sorumluluk Sınırlaması",
      "description": "InnerFriend hiçbir garanti olmaksızın \"olduğu gibi\" sağlanır. Hizmeti kullanmanızdan kaynaklanan herhangi bir zarardan sorumlu değiliz."
    },
    "termination": {
      "title": "Fesih",
      "description": "Hesabınızı istediğiniz zaman silebilirsiniz. Bu şartları ihlal eden hesapları sonlandırma hakkımız saklıdır."
    },
    "changes": {
      "title": "Şartlardaki Değişiklikler",
      "description": "Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikleri e-posta veya uygulama aracılığıyla size bildireceğiz."
    },
    "contact": {
      "title": "İletişim",
      "description": "Sorular? Bize ulaşın: support@lifesaverlabs.org"
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

// Update Turkish locale
const localePath = path.join(__dirname, '../public/locales/tr/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, turkishTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: tr');
console.log('Done! Turkish translations applied.');
