import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional translations for contactMethods.toasts, connections.toasts/errors, profileSettings.errors
const translations = {
  // Arabic
  ar: {
    contactMethods: {
      toasts: {
        signInRequired: "يرجى تسجيل الدخول لإضافة طرق الاتصال",
        added: "تمت إضافة طريقة الاتصال",
        addFailed: "فشل في إضافة طريقة الاتصال",
        updateFailed: "فشل في تحديث طريقة الاتصال",
        removed: "تمت إزالة طريقة الاتصال",
        removeFailed: "فشل في إزالة طريقة الاتصال",
        reorderFailed: "فشل في إعادة الترتيب"
      }
    },
    connections: {
      toasts: {
        requestSent: "تم إرسال طلب الاتصال!",
        confirmed: "تم تأكيد الاتصال! يمكنكم الآن رؤية طرق الاتصال لبعضكم البعض.",
        declined: "تم رفض الاتصال.",
        removed: "تمت إزالة الاتصال."
      },
      errors: {
        notAuthenticated: "غير مسجل الدخول",
        cannotAddSelf: "لا يمكنك إضافة نفسك كصديق",
        alreadyExists: "الاتصال موجود بالفعل",
        requestExists: "طلب الاتصال موجود بالفعل",
        createFailed: "فشل في إنشاء طلب الاتصال",
        respondFailed: "فشل في الرد على الطلب",
        deleteFailed: "فشل في حذف الاتصال"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "يجب أن يكون المعرف من 3-30 حرفاً، حروف وأرقام وشرطات سفلية فقط",
        checkAvailability: "خطأ في التحقق من توفر المعرف",
        validationError: "خطأ في التحقق من المعرف"
      }
    }
  },

  // German
  de: {
    contactMethods: {
      toasts: {
        signInRequired: "Bitte melde dich an, um Kontaktmethoden hinzuzufügen",
        added: "Kontaktmethode hinzugefügt",
        addFailed: "Kontaktmethode konnte nicht hinzugefügt werden",
        updateFailed: "Kontaktmethode konnte nicht aktualisiert werden",
        removed: "Kontaktmethode entfernt",
        removeFailed: "Kontaktmethode konnte nicht entfernt werden",
        reorderFailed: "Neuordnung fehlgeschlagen"
      }
    },
    connections: {
      toasts: {
        requestSent: "Verbindungsanfrage gesendet!",
        confirmed: "Verbindung bestätigt! Ihr könnt jetzt gegenseitig eure Kontaktmethoden sehen.",
        declined: "Verbindung abgelehnt.",
        removed: "Verbindung entfernt."
      },
      errors: {
        notAuthenticated: "Nicht angemeldet",
        cannotAddSelf: "Du kannst dich nicht selbst als Freund hinzufügen",
        alreadyExists: "Verbindung existiert bereits",
        requestExists: "Verbindungsanfrage existiert bereits",
        createFailed: "Verbindungsanfrage konnte nicht erstellt werden",
        respondFailed: "Antwort auf Anfrage fehlgeschlagen",
        deleteFailed: "Verbindung konnte nicht gelöscht werden"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "Handle muss 3-30 Zeichen lang sein, nur Buchstaben, Zahlen und Unterstriche",
        checkAvailability: "Fehler beim Prüfen der Handle-Verfügbarkeit",
        validationError: "Fehler bei der Handle-Validierung"
      }
    }
  },

  // Spanish
  es: {
    contactMethods: {
      toasts: {
        signInRequired: "Por favor inicia sesión para añadir métodos de contacto",
        added: "Método de contacto añadido",
        addFailed: "Error al añadir método de contacto",
        updateFailed: "Error al actualizar método de contacto",
        removed: "Método de contacto eliminado",
        removeFailed: "Error al eliminar método de contacto",
        reorderFailed: "Error al reordenar"
      }
    },
    connections: {
      toasts: {
        requestSent: "¡Solicitud de conexión enviada!",
        confirmed: "¡Conexión confirmada! Ahora pueden ver los métodos de contacto del otro.",
        declined: "Conexión rechazada.",
        removed: "Conexión eliminada."
      },
      errors: {
        notAuthenticated: "No autenticado",
        cannotAddSelf: "No puedes añadirte a ti mismo como amigo",
        alreadyExists: "La conexión ya existe",
        requestExists: "La solicitud de conexión ya existe",
        createFailed: "Error al crear solicitud de conexión",
        respondFailed: "Error al responder a la solicitud",
        deleteFailed: "Error al eliminar conexión"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "El nombre de usuario debe tener 3-30 caracteres, solo letras, números y guiones bajos",
        checkAvailability: "Error al verificar disponibilidad del nombre",
        validationError: "Error al validar nombre de usuario"
      }
    }
  },

  // French
  fr: {
    contactMethods: {
      toasts: {
        signInRequired: "Veuillez vous connecter pour ajouter des méthodes de contact",
        added: "Méthode de contact ajoutée",
        addFailed: "Échec de l'ajout de la méthode de contact",
        updateFailed: "Échec de la mise à jour de la méthode de contact",
        removed: "Méthode de contact supprimée",
        removeFailed: "Échec de la suppression de la méthode de contact",
        reorderFailed: "Échec de la réorganisation"
      }
    },
    connections: {
      toasts: {
        requestSent: "Demande de connexion envoyée !",
        confirmed: "Connexion confirmée ! Vous pouvez maintenant voir vos méthodes de contact respectives.",
        declined: "Connexion refusée.",
        removed: "Connexion supprimée."
      },
      errors: {
        notAuthenticated: "Non authentifié",
        cannotAddSelf: "Vous ne pouvez pas vous ajouter comme ami",
        alreadyExists: "La connexion existe déjà",
        requestExists: "La demande de connexion existe déjà",
        createFailed: "Échec de la création de la demande de connexion",
        respondFailed: "Échec de la réponse à la demande",
        deleteFailed: "Échec de la suppression de la connexion"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "L'identifiant doit contenir 3-30 caractères, lettres, chiffres et underscores uniquement",
        checkAvailability: "Erreur lors de la vérification de la disponibilité",
        validationError: "Erreur lors de la validation de l'identifiant"
      }
    }
  },

  // Hebrew
  he: {
    contactMethods: {
      toasts: {
        signInRequired: "יש להתחבר כדי להוסיף שיטות קשר",
        added: "שיטת קשר נוספה",
        addFailed: "נכשל בהוספת שיטת קשר",
        updateFailed: "נכשל בעדכון שיטת קשר",
        removed: "שיטת קשר הוסרה",
        removeFailed: "נכשל בהסרת שיטת קשר",
        reorderFailed: "נכשל בסידור מחדש"
      }
    },
    connections: {
      toasts: {
        requestSent: "בקשת חיבור נשלחה!",
        confirmed: "החיבור אושר! כעת תוכלו לראות את שיטות הקשר של זה.",
        declined: "החיבור נדחה.",
        removed: "החיבור הוסר."
      },
      errors: {
        notAuthenticated: "לא מאומת",
        cannotAddSelf: "לא ניתן להוסיף את עצמך כחבר",
        alreadyExists: "החיבור כבר קיים",
        requestExists: "בקשת החיבור כבר קיימת",
        createFailed: "נכשל ביצירת בקשת חיבור",
        respondFailed: "נכשל בתגובה לבקשה",
        deleteFailed: "נכשל במחיקת החיבור"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "הכינוי חייב להיות 3-30 תווים, אותיות, מספרים וקווים תחתונים בלבד",
        checkAvailability: "שגיאה בבדיקת זמינות הכינוי",
        validationError: "שגיאה באימות הכינוי"
      }
    }
  },

  // Hindi
  hi: {
    contactMethods: {
      toasts: {
        signInRequired: "संपर्क विधियाँ जोड़ने के लिए कृपया साइन इन करें",
        added: "संपर्क विधि जोड़ी गई",
        addFailed: "संपर्क विधि जोड़ने में विफल",
        updateFailed: "संपर्क विधि अपडेट करने में विफल",
        removed: "संपर्क विधि हटाई गई",
        removeFailed: "संपर्क विधि हटाने में विफल",
        reorderFailed: "पुनर्क्रमित करने में विफल"
      }
    },
    connections: {
      toasts: {
        requestSent: "कनेक्शन अनुरोध भेजा गया!",
        confirmed: "कनेक्शन की पुष्टि हो गई! अब आप एक दूसरे की संपर्क विधियाँ देख सकते हैं।",
        declined: "कनेक्शन अस्वीकार।",
        removed: "कनेक्शन हटाया गया।"
      },
      errors: {
        notAuthenticated: "प्रमाणित नहीं",
        cannotAddSelf: "आप खुद को मित्र के रूप में नहीं जोड़ सकते",
        alreadyExists: "कनेक्शन पहले से मौजूद है",
        requestExists: "कनेक्शन अनुरोध पहले से मौजूद है",
        createFailed: "कनेक्शन अनुरोध बनाने में विफल",
        respondFailed: "अनुरोध का जवाब देने में विफल",
        deleteFailed: "कनेक्शन हटाने में विफल"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "हैंडल 3-30 अक्षर का होना चाहिए, केवल अक्षर, संख्या और अंडरस्कोर",
        checkAvailability: "हैंडल उपलब्धता जाँचने में त्रुटि",
        validationError: "हैंडल सत्यापन में त्रुटि"
      }
    }
  },

  // Italian
  it: {
    contactMethods: {
      toasts: {
        signInRequired: "Accedi per aggiungere metodi di contatto",
        added: "Metodo di contatto aggiunto",
        addFailed: "Impossibile aggiungere il metodo di contatto",
        updateFailed: "Impossibile aggiornare il metodo di contatto",
        removed: "Metodo di contatto rimosso",
        removeFailed: "Impossibile rimuovere il metodo di contatto",
        reorderFailed: "Impossibile riordinare"
      }
    },
    connections: {
      toasts: {
        requestSent: "Richiesta di connessione inviata!",
        confirmed: "Connessione confermata! Ora potete vedere i metodi di contatto reciproci.",
        declined: "Connessione rifiutata.",
        removed: "Connessione rimossa."
      },
      errors: {
        notAuthenticated: "Non autenticato",
        cannotAddSelf: "Non puoi aggiungere te stesso come amico",
        alreadyExists: "La connessione esiste già",
        requestExists: "La richiesta di connessione esiste già",
        createFailed: "Impossibile creare la richiesta di connessione",
        respondFailed: "Impossibile rispondere alla richiesta",
        deleteFailed: "Impossibile eliminare la connessione"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "L'handle deve essere di 3-30 caratteri, solo lettere, numeri e underscore",
        checkAvailability: "Errore nel verificare la disponibilità dell'handle",
        validationError: "Errore nella validazione dell'handle"
      }
    }
  },

  // Japanese
  ja: {
    contactMethods: {
      toasts: {
        signInRequired: "連絡方法を追加するにはサインインしてください",
        added: "連絡方法を追加しました",
        addFailed: "連絡方法の追加に失敗しました",
        updateFailed: "連絡方法の更新に失敗しました",
        removed: "連絡方法を削除しました",
        removeFailed: "連絡方法の削除に失敗しました",
        reorderFailed: "並べ替えに失敗しました"
      }
    },
    connections: {
      toasts: {
        requestSent: "接続リクエストを送信しました！",
        confirmed: "接続が確認されました！お互いの連絡方法が見れるようになりました。",
        declined: "接続を拒否しました。",
        removed: "接続を削除しました。"
      },
      errors: {
        notAuthenticated: "認証されていません",
        cannotAddSelf: "自分自身を友達として追加することはできません",
        alreadyExists: "接続は既に存在します",
        requestExists: "接続リクエストは既に存在します",
        createFailed: "接続リクエストの作成に失敗しました",
        respondFailed: "リクエストへの応答に失敗しました",
        deleteFailed: "接続の削除に失敗しました"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "ハンドルは3〜30文字で、英数字とアンダースコアのみ使用可能です",
        checkAvailability: "ハンドルの利用可否の確認中にエラーが発生しました",
        validationError: "ハンドルの検証中にエラーが発生しました"
      }
    }
  },

  // Korean
  ko: {
    contactMethods: {
      toasts: {
        signInRequired: "연락 방법을 추가하려면 로그인하세요",
        added: "연락 방법이 추가되었습니다",
        addFailed: "연락 방법 추가 실패",
        updateFailed: "연락 방법 업데이트 실패",
        removed: "연락 방법이 제거되었습니다",
        removeFailed: "연락 방법 제거 실패",
        reorderFailed: "재정렬 실패"
      }
    },
    connections: {
      toasts: {
        requestSent: "연결 요청이 전송되었습니다!",
        confirmed: "연결이 확인되었습니다! 이제 서로의 연락 방법을 볼 수 있습니다.",
        declined: "연결이 거절되었습니다.",
        removed: "연결이 제거되었습니다."
      },
      errors: {
        notAuthenticated: "인증되지 않음",
        cannotAddSelf: "자신을 친구로 추가할 수 없습니다",
        alreadyExists: "연결이 이미 존재합니다",
        requestExists: "연결 요청이 이미 존재합니다",
        createFailed: "연결 요청 생성 실패",
        respondFailed: "요청 응답 실패",
        deleteFailed: "연결 삭제 실패"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "핸들은 3-30자여야 하며, 문자, 숫자, 밑줄만 사용 가능합니다",
        checkAvailability: "핸들 가용성 확인 중 오류",
        validationError: "핸들 유효성 검사 중 오류"
      }
    }
  },

  // Portuguese
  pt: {
    contactMethods: {
      toasts: {
        signInRequired: "Faça login para adicionar métodos de contato",
        added: "Método de contato adicionado",
        addFailed: "Falha ao adicionar método de contato",
        updateFailed: "Falha ao atualizar método de contato",
        removed: "Método de contato removido",
        removeFailed: "Falha ao remover método de contato",
        reorderFailed: "Falha ao reordenar"
      }
    },
    connections: {
      toasts: {
        requestSent: "Solicitação de conexão enviada!",
        confirmed: "Conexão confirmada! Agora vocês podem ver os métodos de contato um do outro.",
        declined: "Conexão recusada.",
        removed: "Conexão removida."
      },
      errors: {
        notAuthenticated: "Não autenticado",
        cannotAddSelf: "Você não pode adicionar a si mesmo como amigo",
        alreadyExists: "A conexão já existe",
        requestExists: "A solicitação de conexão já existe",
        createFailed: "Falha ao criar solicitação de conexão",
        respondFailed: "Falha ao responder à solicitação",
        deleteFailed: "Falha ao excluir conexão"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "O identificador deve ter 3-30 caracteres, apenas letras, números e underscores",
        checkAvailability: "Erro ao verificar disponibilidade do identificador",
        validationError: "Erro ao validar identificador"
      }
    }
  },

  // Russian
  ru: {
    contactMethods: {
      toasts: {
        signInRequired: "Войдите, чтобы добавить способы связи",
        added: "Способ связи добавлен",
        addFailed: "Не удалось добавить способ связи",
        updateFailed: "Не удалось обновить способ связи",
        removed: "Способ связи удалён",
        removeFailed: "Не удалось удалить способ связи",
        reorderFailed: "Не удалось изменить порядок"
      }
    },
    connections: {
      toasts: {
        requestSent: "Запрос на подключение отправлен!",
        confirmed: "Подключение подтверждено! Теперь вы можете видеть способы связи друг друга.",
        declined: "Подключение отклонено.",
        removed: "Подключение удалено."
      },
      errors: {
        notAuthenticated: "Не аутентифицирован",
        cannotAddSelf: "Вы не можете добавить себя в друзья",
        alreadyExists: "Подключение уже существует",
        requestExists: "Запрос на подключение уже существует",
        createFailed: "Не удалось создать запрос на подключение",
        respondFailed: "Не удалось ответить на запрос",
        deleteFailed: "Не удалось удалить подключение"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "Имя пользователя должно быть 3-30 символов, только буквы, цифры и подчёркивания",
        checkAvailability: "Ошибка проверки доступности имени",
        validationError: "Ошибка проверки имени пользователя"
      }
    }
  },

  // Turkish
  tr: {
    contactMethods: {
      toasts: {
        signInRequired: "İletişim yöntemi eklemek için giriş yapın",
        added: "İletişim yöntemi eklendi",
        addFailed: "İletişim yöntemi eklenemedi",
        updateFailed: "İletişim yöntemi güncellenemedi",
        removed: "İletişim yöntemi kaldırıldı",
        removeFailed: "İletişim yöntemi kaldırılamadı",
        reorderFailed: "Yeniden sıralama başarısız"
      }
    },
    connections: {
      toasts: {
        requestSent: "Bağlantı isteği gönderildi!",
        confirmed: "Bağlantı onaylandı! Artık birbirinizin iletişim yöntemlerini görebilirsiniz.",
        declined: "Bağlantı reddedildi.",
        removed: "Bağlantı kaldırıldı."
      },
      errors: {
        notAuthenticated: "Kimlik doğrulanmadı",
        cannotAddSelf: "Kendinizi arkadaş olarak ekleyemezsiniz",
        alreadyExists: "Bağlantı zaten mevcut",
        requestExists: "Bağlantı isteği zaten mevcut",
        createFailed: "Bağlantı isteği oluşturulamadı",
        respondFailed: "İsteğe yanıt verilemedi",
        deleteFailed: "Bağlantı silinemedi"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "Kullanıcı adı 3-30 karakter olmalı, sadece harf, rakam ve alt çizgi",
        checkAvailability: "Kullanıcı adı müsaitliği kontrol edilirken hata",
        validationError: "Kullanıcı adı doğrulama hatası"
      }
    }
  },

  // Chinese
  zh: {
    contactMethods: {
      toasts: {
        signInRequired: "请登录以添加联系方式",
        added: "联系方式已添加",
        addFailed: "添加联系方式失败",
        updateFailed: "更新联系方式失败",
        removed: "联系方式已删除",
        removeFailed: "删除联系方式失败",
        reorderFailed: "重新排序失败"
      }
    },
    connections: {
      toasts: {
        requestSent: "连接请求已发送！",
        confirmed: "连接已确认！现在你们可以看到彼此的联系方式了。",
        declined: "连接已拒绝。",
        removed: "连接已删除。"
      },
      errors: {
        notAuthenticated: "未认证",
        cannotAddSelf: "您不能将自己添加为好友",
        alreadyExists: "连接已存在",
        requestExists: "连接请求已存在",
        createFailed: "创建连接请求失败",
        respondFailed: "响应请求失败",
        deleteFailed: "删除连接失败"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "用户名必须是3-30个字符，只能包含字母、数字和下划线",
        checkAvailability: "检查用户名可用性时出错",
        validationError: "验证用户名时出错"
      }
    }
  },

  // Vietnamese
  vi: {
    contactMethods: {
      toasts: {
        signInRequired: "Vui lòng đăng nhập để thêm phương thức liên hệ",
        added: "Đã thêm phương thức liên hệ",
        addFailed: "Không thể thêm phương thức liên hệ",
        updateFailed: "Không thể cập nhật phương thức liên hệ",
        removed: "Đã xóa phương thức liên hệ",
        removeFailed: "Không thể xóa phương thức liên hệ",
        reorderFailed: "Không thể sắp xếp lại"
      }
    },
    connections: {
      toasts: {
        requestSent: "Đã gửi yêu cầu kết nối!",
        confirmed: "Kết nối đã được xác nhận! Giờ các bạn có thể xem phương thức liên hệ của nhau.",
        declined: "Kết nối bị từ chối.",
        removed: "Kết nối đã bị xóa."
      },
      errors: {
        notAuthenticated: "Chưa xác thực",
        cannotAddSelf: "Bạn không thể thêm chính mình làm bạn bè",
        alreadyExists: "Kết nối đã tồn tại",
        requestExists: "Yêu cầu kết nối đã tồn tại",
        createFailed: "Không thể tạo yêu cầu kết nối",
        respondFailed: "Không thể phản hồi yêu cầu",
        deleteFailed: "Không thể xóa kết nối"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "Tên người dùng phải từ 3-30 ký tự, chỉ bao gồm chữ cái, số và gạch dưới",
        checkAvailability: "Lỗi khi kiểm tra tính khả dụng của tên",
        validationError: "Lỗi khi xác thực tên người dùng"
      }
    }
  },

  // Bengali
  bn: {
    contactMethods: {
      toasts: {
        signInRequired: "যোগাযোগ পদ্ধতি যোগ করতে সাইন ইন করুন",
        added: "যোগাযোগ পদ্ধতি যোগ করা হয়েছে",
        addFailed: "যোগাযোগ পদ্ধতি যোগ করতে ব্যর্থ",
        updateFailed: "যোগাযোগ পদ্ধতি আপডেট করতে ব্যর্থ",
        removed: "যোগাযোগ পদ্ধতি সরানো হয়েছে",
        removeFailed: "যোগাযোগ পদ্ধতি সরাতে ব্যর্থ",
        reorderFailed: "পুনঃক্রম করতে ব্যর্থ"
      }
    },
    connections: {
      toasts: {
        requestSent: "সংযোগ অনুরোধ পাঠানো হয়েছে!",
        confirmed: "সংযোগ নিশ্চিত! এখন আপনারা একে অপরের যোগাযোগ পদ্ধতি দেখতে পারবেন।",
        declined: "সংযোগ প্রত্যাখ্যান।",
        removed: "সংযোগ সরানো হয়েছে।"
      },
      errors: {
        notAuthenticated: "প্রমাণীকৃত নয়",
        cannotAddSelf: "আপনি নিজেকে বন্ধু হিসাবে যোগ করতে পারবেন না",
        alreadyExists: "সংযোগ ইতিমধ্যে বিদ্যমান",
        requestExists: "সংযোগ অনুরোধ ইতিমধ্যে বিদ্যমান",
        createFailed: "সংযোগ অনুরোধ তৈরি করতে ব্যর্থ",
        respondFailed: "অনুরোধে সাড়া দিতে ব্যর্থ",
        deleteFailed: "সংযোগ মুছতে ব্যর্থ"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "হ্যান্ডেল ৩-৩০ অক্ষর হতে হবে, শুধু অক্ষর, সংখ্যা এবং আন্ডারস্কোর",
        checkAvailability: "হ্যান্ডেল উপলব্ধতা পরীক্ষায় ত্রুটি",
        validationError: "হ্যান্ডেল যাচাইয়ে ত্রুটি"
      }
    }
  },

  // Urdu
  ur: {
    contactMethods: {
      toasts: {
        signInRequired: "رابطے کے طریقے شامل کرنے کے لیے سائن ان کریں",
        added: "رابطے کا طریقہ شامل کیا گیا",
        addFailed: "رابطے کا طریقہ شامل کرنے میں ناکام",
        updateFailed: "رابطے کا طریقہ اپڈیٹ کرنے میں ناکام",
        removed: "رابطے کا طریقہ ہٹا دیا گیا",
        removeFailed: "رابطے کا طریقہ ہٹانے میں ناکام",
        reorderFailed: "ترتیب بدلنے میں ناکام"
      }
    },
    connections: {
      toasts: {
        requestSent: "کنکشن کی درخواست بھیج دی گئی!",
        confirmed: "کنکشن کی تصدیق! اب آپ ایک دوسرے کے رابطے کے طریقے دیکھ سکتے ہیں۔",
        declined: "کنکشن مسترد۔",
        removed: "کنکشن ہٹا دیا گیا۔"
      },
      errors: {
        notAuthenticated: "تصدیق نہیں ہوئی",
        cannotAddSelf: "آپ خود کو دوست کے طور پر شامل نہیں کر سکتے",
        alreadyExists: "کنکشن پہلے سے موجود ہے",
        requestExists: "کنکشن کی درخواست پہلے سے موجود ہے",
        createFailed: "کنکشن کی درخواست بنانے میں ناکام",
        respondFailed: "درخواست کا جواب دینے میں ناکام",
        deleteFailed: "کنکشن حذف کرنے میں ناکام"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "ہینڈل 3-30 حروف ہونا چاہیے، صرف حروف، اعداد اور انڈرسکور",
        checkAvailability: "ہینڈل کی دستیابی چیک کرنے میں خرابی",
        validationError: "ہینڈل کی توثیق میں خرابی"
      }
    }
  },

  // Javanese
  jv: {
    contactMethods: {
      toasts: {
        signInRequired: "Mangga mlebu kanggo nambah cara kontak",
        added: "Cara kontak wis ditambahake",
        addFailed: "Gagal nambah cara kontak",
        updateFailed: "Gagal nganyari cara kontak",
        removed: "Cara kontak wis dibusak",
        removeFailed: "Gagal mbusak cara kontak",
        reorderFailed: "Gagal ngatur ulang"
      }
    },
    connections: {
      toasts: {
        requestSent: "Panjaluk sambungan wis dikirim!",
        confirmed: "Sambungan dikonfirmasi! Saiki sampeyan bisa ndeleng cara kontak saben liyane.",
        declined: "Sambungan ditolak.",
        removed: "Sambungan wis dibusak."
      },
      errors: {
        notAuthenticated: "Durung diverifikasi",
        cannotAddSelf: "Sampeyan ora bisa nambah dhiri dhewe minangka kanca",
        alreadyExists: "Sambungan wis ana",
        requestExists: "Panjaluk sambungan wis ana",
        createFailed: "Gagal nggawe panjaluk sambungan",
        respondFailed: "Gagal njawab panjaluk",
        deleteFailed: "Gagal mbusak sambungan"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "Handle kudu 3-30 karakter, mung huruf, angka lan garis ngisor",
        checkAvailability: "Kesalahan mriksa kasedhiyan handle",
        validationError: "Kesalahan validasi handle"
      }
    }
  },

  // Marathi
  mr: {
    contactMethods: {
      toasts: {
        signInRequired: "संपर्क पद्धती जोडण्यासाठी साइन इन करा",
        added: "संपर्क पद्धत जोडली",
        addFailed: "संपर्क पद्धत जोडण्यात अयशस्वी",
        updateFailed: "संपर्क पद्धत अद्यतनित करण्यात अयशस्वी",
        removed: "संपर्क पद्धत काढली",
        removeFailed: "संपर्क पद्धत काढण्यात अयशस्वी",
        reorderFailed: "पुनर्क्रमित करण्यात अयशस्वी"
      }
    },
    connections: {
      toasts: {
        requestSent: "कनेक्शन विनंती पाठवली!",
        confirmed: "कनेक्शनची पुष्टी झाली! आता तुम्ही एकमेकांच्या संपर्क पद्धती पाहू शकता.",
        declined: "कनेक्शन नाकारले.",
        removed: "कनेक्शन काढले."
      },
      errors: {
        notAuthenticated: "प्रमाणीकृत नाही",
        cannotAddSelf: "तुम्ही स्वतःला मित्र म्हणून जोडू शकत नाही",
        alreadyExists: "कनेक्शन आधीच अस्तित्वात आहे",
        requestExists: "कनेक्शन विनंती आधीच अस्तित्वात आहे",
        createFailed: "कनेक्शन विनंती तयार करण्यात अयशस्वी",
        respondFailed: "विनंतीला प्रतिसाद देण्यात अयशस्वी",
        deleteFailed: "कनेक्शन हटवण्यात अयशस्वी"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "हँडल 3-30 अक्षरे असावे, फक्त अक्षरे, अंक आणि अंडरस्कोर",
        checkAvailability: "हँडल उपलब्धता तपासण्यात त्रुटी",
        validationError: "हँडल प्रमाणीकरणात त्रुटी"
      }
    }
  },

  // Tamil
  ta: {
    contactMethods: {
      toasts: {
        signInRequired: "தொடர்பு முறைகளைச் சேர்க்க உள்நுழையவும்",
        added: "தொடர்பு முறை சேர்க்கப்பட்டது",
        addFailed: "தொடர்பு முறையைச் சேர்க்க முடியவில்லை",
        updateFailed: "தொடர்பு முறையைப் புதுப்பிக்க முடியவில்லை",
        removed: "தொடர்பு முறை நீக்கப்பட்டது",
        removeFailed: "தொடர்பு முறையை நீக்க முடியவில்லை",
        reorderFailed: "மறுவரிசைப்படுத்த முடியவில்லை"
      }
    },
    connections: {
      toasts: {
        requestSent: "இணைப்பு கோரிக்கை அனுப்பப்பட்டது!",
        confirmed: "இணைப்பு உறுதிப்படுத்தப்பட்டது! இப்போது நீங்கள் ஒருவருக்கொருவர் தொடர்பு முறைகளைப் பார்க்கலாம்.",
        declined: "இணைப்பு நிராகரிக்கப்பட்டது.",
        removed: "இணைப்பு நீக்கப்பட்டது."
      },
      errors: {
        notAuthenticated: "அங்கீகரிக்கப்படவில்லை",
        cannotAddSelf: "உங்களை நண்பராகச் சேர்க்க முடியாது",
        alreadyExists: "இணைப்பு ஏற்கனவே உள்ளது",
        requestExists: "இணைப்பு கோரிக்கை ஏற்கனவே உள்ளது",
        createFailed: "இணைப்பு கோரிக்கையை உருவாக்க முடியவில்லை",
        respondFailed: "கோரிக்கைக்கு பதிலளிக்க முடியவில்லை",
        deleteFailed: "இணைப்பை நீக்க முடியவில்லை"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "கைப்பிடி 3-30 எழுத்துகள் இருக்க வேண்டும், எழுத்துகள், எண்கள் மற்றும் அடிக்கோடுகள் மட்டுமே",
        checkAvailability: "கைப்பிடி கிடைக்குமா என்று சரிபார்க்கும் போது பிழை",
        validationError: "கைப்பிடி சரிபார்ப்பில் பிழை"
      }
    }
  },

  // Telugu
  te: {
    contactMethods: {
      toasts: {
        signInRequired: "సంప్రదింపు పద్ధతులను జోడించడానికి సైన్ ఇన్ చేయండి",
        added: "సంప్రదింపు పద్ధతి జోడించబడింది",
        addFailed: "సంప్రదింపు పద్ధతిని జోడించడంలో విఫలమైంది",
        updateFailed: "సంప్రదింపు పద్ధతిని నవీకరించడంలో విఫలమైంది",
        removed: "సంప్రదింపు పద్ధతి తొలగించబడింది",
        removeFailed: "సంప్రదింపు పద్ధతిని తొలగించడంలో విఫలమైంది",
        reorderFailed: "పునఃక్రమం చేయడంలో విఫలమైంది"
      }
    },
    connections: {
      toasts: {
        requestSent: "కనెక్షన్ అభ్యర్థన పంపబడింది!",
        confirmed: "కనెక్షన్ నిర్ధారించబడింది! ఇప్పుడు మీరు ఒకరి సంప్రదింపు పద్ధతులను చూడవచ్చు.",
        declined: "కనెక్షన్ తిరస్కరించబడింది.",
        removed: "కనెక్షన్ తొలగించబడింది."
      },
      errors: {
        notAuthenticated: "ధృవీకరించబడలేదు",
        cannotAddSelf: "మీరు మిమ్మల్ని స్నేహితుడిగా జోడించలేరు",
        alreadyExists: "కనెక్షన్ ఇప్పటికే ఉంది",
        requestExists: "కనెక్షన్ అభ్యర్థన ఇప్పటికే ఉంది",
        createFailed: "కనెక్షన్ అభ్యర్థన సృష్టించడంలో విఫలమైంది",
        respondFailed: "అభ్యర్థనకు ప్రతిస్పందించడంలో విఫలమైంది",
        deleteFailed: "కనెక్షన్ తొలగించడంలో విఫలమైంది"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "హ్యాండిల్ 3-30 అక్షరాలు ఉండాలి, అక్షరాలు, సంఖ్యలు మరియు అండర్‌స్కోర్‌లు మాత్రమే",
        checkAvailability: "హ్యాండిల్ లభ్యతను తనిఖీ చేయడంలో లోపం",
        validationError: "హ్యాండిల్ ధృవీకరణలో లోపం"
      }
    }
  },

  // Punjabi
  pa: {
    contactMethods: {
      toasts: {
        signInRequired: "ਸੰਪਰਕ ਤਰੀਕੇ ਜੋੜਨ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ",
        added: "ਸੰਪਰਕ ਤਰੀਕਾ ਜੋੜਿਆ ਗਿਆ",
        addFailed: "ਸੰਪਰਕ ਤਰੀਕਾ ਜੋੜਨ ਵਿੱਚ ਅਸਫਲ",
        updateFailed: "ਸੰਪਰਕ ਤਰੀਕਾ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",
        removed: "ਸੰਪਰਕ ਤਰੀਕਾ ਹਟਾਇਆ ਗਿਆ",
        removeFailed: "ਸੰਪਰਕ ਤਰੀਕਾ ਹਟਾਉਣ ਵਿੱਚ ਅਸਫਲ",
        reorderFailed: "ਮੁੜ ਕ੍ਰਮਬੱਧ ਕਰਨ ਵਿੱਚ ਅਸਫਲ"
      }
    },
    connections: {
      toasts: {
        requestSent: "ਕਨੈਕਸ਼ਨ ਬੇਨਤੀ ਭੇਜੀ ਗਈ!",
        confirmed: "ਕਨੈਕਸ਼ਨ ਪੁਸ਼ਟੀ! ਹੁਣ ਤੁਸੀਂ ਇੱਕ ਦੂਜੇ ਦੇ ਸੰਪਰਕ ਤਰੀਕੇ ਦੇਖ ਸਕਦੇ ਹੋ।",
        declined: "ਕਨੈਕਸ਼ਨ ਅਸਵੀਕਾਰ।",
        removed: "ਕਨੈਕਸ਼ਨ ਹਟਾਇਆ ਗਿਆ।"
      },
      errors: {
        notAuthenticated: "ਪ੍ਰਮਾਣਿਤ ਨਹੀਂ",
        cannotAddSelf: "ਤੁਸੀਂ ਆਪਣੇ ਆਪ ਨੂੰ ਦੋਸਤ ਵਜੋਂ ਨਹੀਂ ਜੋੜ ਸਕਦੇ",
        alreadyExists: "ਕਨੈਕਸ਼ਨ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ",
        requestExists: "ਕਨੈਕਸ਼ਨ ਬੇਨਤੀ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ",
        createFailed: "ਕਨੈਕਸ਼ਨ ਬੇਨਤੀ ਬਣਾਉਣ ਵਿੱਚ ਅਸਫਲ",
        respondFailed: "ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਦੇਣ ਵਿੱਚ ਅਸਫਲ",
        deleteFailed: "ਕਨੈਕਸ਼ਨ ਮਿਟਾਉਣ ਵਿੱਚ ਅਸਫਲ"
      }
    },
    profileSettings: {
      errors: {
        handleFormat: "ਹੈਂਡਲ 3-30 ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ, ਸਿਰਫ਼ ਅੱਖਰ, ਨੰਬਰ ਅਤੇ ਅੰਡਰਸਕੋਰ",
        checkAvailability: "ਹੈਂਡਲ ਉਪਲਬਧਤਾ ਦੀ ਜਾਂਚ ਵਿੱਚ ਗਲਤੀ",
        validationError: "ਹੈਂਡਲ ਪ੍ਰਮਾਣਿਕਤਾ ਵਿੱਚ ਗਲਤੀ"
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

console.log('Done! Additional i18n keys applied to all languages.');
