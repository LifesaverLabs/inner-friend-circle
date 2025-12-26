/**
 * Script to add GDPR-related i18n translations to all locales
 * Run with: node scripts/add-gdpr-i18n.cjs
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// New translations for GDPR compliance
const newTranslations = {
  en: {
    auth: {
      validation: {
        mustAgreeToTerms: "You must agree to the Privacy Policy and Terms of Service to create an account"
      },
      consent: {
        agreeTo: "I agree to the",
        privacyPolicy: "Privacy Policy",
        and: "and",
        termsOfService: "Terms of Service",
        dataProcessingNote: "We process your data to provide the service. You can export or delete your data at any time."
      }
    },
    legal: {
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      lastUpdated: "Last updated: {{date}}",
      backToHome: "Back to Home"
    },
    settings: {
      deleteAccount: "Delete Account",
      deleteAccountDescription: "Permanently delete your account and all associated data",
      deleteAccountWarning: "This action cannot be undone. All your friends, posts, settings, and other data will be permanently deleted.",
      deleteAccountConfirmation: "Type DELETE to confirm",
      deleteAccountButton: "Delete My Account",
      deleteAccountSuccess: "Your account has been deleted",
      deleteAccountError: "Failed to delete account. Please try again."
    }
  },
  ar: {
    auth: {
      validation: {
        mustAgreeToTerms: "يجب أن توافق على سياسة الخصوصية وشروط الخدمة لإنشاء حساب"
      },
      consent: {
        agreeTo: "أوافق على",
        privacyPolicy: "سياسة الخصوصية",
        and: "و",
        termsOfService: "شروط الخدمة",
        dataProcessingNote: "نقوم بمعالجة بياناتك لتقديم الخدمة. يمكنك تصدير أو حذف بياناتك في أي وقت."
      }
    },
    legal: {
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      lastUpdated: "آخر تحديث: {{date}}",
      backToHome: "العودة للرئيسية"
    },
    settings: {
      deleteAccount: "حذف الحساب",
      deleteAccountDescription: "حذف حسابك وجميع البيانات المرتبطة به نهائياً",
      deleteAccountWarning: "لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع أصدقائك ومنشوراتك وإعداداتك وبياناتك الأخرى نهائياً.",
      deleteAccountConfirmation: "اكتب DELETE للتأكيد",
      deleteAccountButton: "حذف حسابي",
      deleteAccountSuccess: "تم حذف حسابك",
      deleteAccountError: "فشل حذف الحساب. يرجى المحاولة مرة أخرى."
    }
  },
  bled: {
    auth: {
      validation: {
        mustAgreeToTerms: "You must agree to the Privasee Polisee and Terms of Servis to kreayt an akkount"
      },
      consent: {
        agreeTo: "I agree to the",
        privacyPolicy: "Privasee Polisee",
        and: "and",
        termsOfService: "Terms of Servis",
        dataProcessingNote: "We proses yor data to provyde the servis. You kan eksport or deleyt yor data at eny tyme."
      }
    },
    legal: {
      privacyPolicy: "Privasee Polisee",
      termsOfService: "Terms of Servis",
      lastUpdated: "Last updayted: {{date}}",
      backToHome: "Bak to Home"
    },
    settings: {
      deleteAccount: "Deleyt Akkount",
      deleteAccountDescription: "Permanentlee deleyt yor akkount and all assosheeayted data",
      deleteAccountWarning: "Thiz akshon kannot be undun. All yor frends, posts, settings, and other data will be permanentlee deleyted.",
      deleteAccountConfirmation: "Type DELETE to konfirm",
      deleteAccountButton: "Deleyt My Akkount",
      deleteAccountSuccess: "Yor akkount haz been deleyted",
      deleteAccountError: "Fayled to deleyt akkount. Pleez try agen."
    }
  },
  de: {
    auth: {
      validation: {
        mustAgreeToTerms: "Sie müssen der Datenschutzerklärung und den Nutzungsbedingungen zustimmen, um ein Konto zu erstellen"
      },
      consent: {
        agreeTo: "Ich stimme zu",
        privacyPolicy: "Datenschutzerklärung",
        and: "und",
        termsOfService: "Nutzungsbedingungen",
        dataProcessingNote: "Wir verarbeiten Ihre Daten, um den Service bereitzustellen. Sie können Ihre Daten jederzeit exportieren oder löschen."
      }
    },
    legal: {
      privacyPolicy: "Datenschutzerklärung",
      termsOfService: "Nutzungsbedingungen",
      lastUpdated: "Zuletzt aktualisiert: {{date}}",
      backToHome: "Zurück zur Startseite"
    },
    settings: {
      deleteAccount: "Konto löschen",
      deleteAccountDescription: "Löschen Sie Ihr Konto und alle zugehörigen Daten dauerhaft",
      deleteAccountWarning: "Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Freunde, Beiträge, Einstellungen und anderen Daten werden dauerhaft gelöscht.",
      deleteAccountConfirmation: "Geben Sie DELETE ein, um zu bestätigen",
      deleteAccountButton: "Mein Konto löschen",
      deleteAccountSuccess: "Ihr Konto wurde gelöscht",
      deleteAccountError: "Konto konnte nicht gelöscht werden. Bitte versuchen Sie es erneut."
    }
  },
  es: {
    auth: {
      validation: {
        mustAgreeToTerms: "Debes aceptar la Política de Privacidad y los Términos de Servicio para crear una cuenta"
      },
      consent: {
        agreeTo: "Acepto la",
        privacyPolicy: "Política de Privacidad",
        and: "y los",
        termsOfService: "Términos de Servicio",
        dataProcessingNote: "Procesamos tus datos para proporcionar el servicio. Puedes exportar o eliminar tus datos en cualquier momento."
      }
    },
    legal: {
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      lastUpdated: "Última actualización: {{date}}",
      backToHome: "Volver al Inicio"
    },
    settings: {
      deleteAccount: "Eliminar Cuenta",
      deleteAccountDescription: "Eliminar permanentemente tu cuenta y todos los datos asociados",
      deleteAccountWarning: "Esta acción no se puede deshacer. Todos tus amigos, publicaciones, configuraciones y otros datos serán eliminados permanentemente.",
      deleteAccountConfirmation: "Escribe DELETE para confirmar",
      deleteAccountButton: "Eliminar Mi Cuenta",
      deleteAccountSuccess: "Tu cuenta ha sido eliminada",
      deleteAccountError: "Error al eliminar la cuenta. Por favor, inténtalo de nuevo."
    }
  },
  fr: {
    auth: {
      validation: {
        mustAgreeToTerms: "Vous devez accepter la Politique de Confidentialité et les Conditions d'Utilisation pour créer un compte"
      },
      consent: {
        agreeTo: "J'accepte la",
        privacyPolicy: "Politique de Confidentialité",
        and: "et les",
        termsOfService: "Conditions d'Utilisation",
        dataProcessingNote: "Nous traitons vos données pour fournir le service. Vous pouvez exporter ou supprimer vos données à tout moment."
      }
    },
    legal: {
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      lastUpdated: "Dernière mise à jour: {{date}}",
      backToHome: "Retour à l'Accueil"
    },
    settings: {
      deleteAccount: "Supprimer le Compte",
      deleteAccountDescription: "Supprimer définitivement votre compte et toutes les données associées",
      deleteAccountWarning: "Cette action est irréversible. Tous vos amis, publications, paramètres et autres données seront définitivement supprimés.",
      deleteAccountConfirmation: "Tapez DELETE pour confirmer",
      deleteAccountButton: "Supprimer Mon Compte",
      deleteAccountSuccess: "Votre compte a été supprimé",
      deleteAccountError: "Échec de la suppression du compte. Veuillez réessayer."
    }
  },
  he: {
    auth: {
      validation: {
        mustAgreeToTerms: "עליך להסכים למדיניות הפרטיות ולתנאי השימוש כדי ליצור חשבון"
      },
      consent: {
        agreeTo: "אני מסכים ל",
        privacyPolicy: "מדיניות הפרטיות",
        and: "ול",
        termsOfService: "תנאי השימוש",
        dataProcessingNote: "אנו מעבדים את הנתונים שלך כדי לספק את השירות. תוכל לייצא או למחוק את הנתונים שלך בכל עת."
      }
    },
    legal: {
      privacyPolicy: "מדיניות פרטיות",
      termsOfService: "תנאי שימוש",
      lastUpdated: "עודכן לאחרונה: {{date}}",
      backToHome: "חזרה לדף הבית"
    },
    settings: {
      deleteAccount: "מחק חשבון",
      deleteAccountDescription: "מחק לצמיתות את החשבון שלך ואת כל הנתונים המשויכים",
      deleteAccountWarning: "פעולה זו אינה ניתנת לביטול. כל החברים, הפוסטים, ההגדרות והנתונים האחרים שלך יימחקו לצמיתות.",
      deleteAccountConfirmation: "הקלד DELETE לאישור",
      deleteAccountButton: "מחק את החשבון שלי",
      deleteAccountSuccess: "החשבון שלך נמחק",
      deleteAccountError: "מחיקת החשבון נכשלה. אנא נסה שוב."
    }
  },
  hi: {
    auth: {
      validation: {
        mustAgreeToTerms: "खाता बनाने के लिए आपको गोपनीयता नीति और सेवा की शर्तों से सहमत होना होगा"
      },
      consent: {
        agreeTo: "मैं सहमत हूं",
        privacyPolicy: "गोपनीयता नीति",
        and: "और",
        termsOfService: "सेवा की शर्तें",
        dataProcessingNote: "हम सेवा प्रदान करने के लिए आपके डेटा को संसाधित करते हैं। आप किसी भी समय अपना डेटा निर्यात या हटा सकते हैं।"
      }
    },
    legal: {
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      lastUpdated: "अंतिम अद्यतन: {{date}}",
      backToHome: "होम पर वापस जाएं"
    },
    settings: {
      deleteAccount: "खाता हटाएं",
      deleteAccountDescription: "अपने खाते और सभी संबंधित डेटा को स्थायी रूप से हटाएं",
      deleteAccountWarning: "इस क्रिया को पूर्ववत नहीं किया जा सकता। आपके सभी मित्र, पोस्ट, सेटिंग्स और अन्य डेटा स्थायी रूप से हटा दिए जाएंगे।",
      deleteAccountConfirmation: "पुष्टि करने के लिए DELETE टाइप करें",
      deleteAccountButton: "मेरा खाता हटाएं",
      deleteAccountSuccess: "आपका खाता हटा दिया गया है",
      deleteAccountError: "खाता हटाने में विफल। कृपया पुनः प्रयास करें।"
    }
  },
  it: {
    auth: {
      validation: {
        mustAgreeToTerms: "Devi accettare l'Informativa sulla Privacy e i Termini di Servizio per creare un account"
      },
      consent: {
        agreeTo: "Accetto l'",
        privacyPolicy: "Informativa sulla Privacy",
        and: "e i",
        termsOfService: "Termini di Servizio",
        dataProcessingNote: "Elaboriamo i tuoi dati per fornire il servizio. Puoi esportare o eliminare i tuoi dati in qualsiasi momento."
      }
    },
    legal: {
      privacyPolicy: "Informativa sulla Privacy",
      termsOfService: "Termini di Servizio",
      lastUpdated: "Ultimo aggiornamento: {{date}}",
      backToHome: "Torna alla Home"
    },
    settings: {
      deleteAccount: "Elimina Account",
      deleteAccountDescription: "Elimina permanentemente il tuo account e tutti i dati associati",
      deleteAccountWarning: "Questa azione non può essere annullata. Tutti i tuoi amici, post, impostazioni e altri dati saranno eliminati permanentemente.",
      deleteAccountConfirmation: "Digita DELETE per confermare",
      deleteAccountButton: "Elimina il Mio Account",
      deleteAccountSuccess: "Il tuo account è stato eliminato",
      deleteAccountError: "Eliminazione account fallita. Riprova."
    }
  },
  ja: {
    auth: {
      validation: {
        mustAgreeToTerms: "アカウントを作成するには、プライバシーポリシーと利用規約に同意する必要があります"
      },
      consent: {
        agreeTo: "に同意します",
        privacyPolicy: "プライバシーポリシー",
        and: "と",
        termsOfService: "利用規約",
        dataProcessingNote: "サービスを提供するためにお客様のデータを処理します。いつでもデータのエクスポートまたは削除ができます。"
      }
    },
    legal: {
      privacyPolicy: "プライバシーポリシー",
      termsOfService: "利用規約",
      lastUpdated: "最終更新日: {{date}}",
      backToHome: "ホームに戻る"
    },
    settings: {
      deleteAccount: "アカウントを削除",
      deleteAccountDescription: "アカウントとすべての関連データを完全に削除します",
      deleteAccountWarning: "この操作は元に戻せません。すべての友達、投稿、設定、その他のデータが完全に削除されます。",
      deleteAccountConfirmation: "確認するにはDELETEと入力してください",
      deleteAccountButton: "アカウントを削除",
      deleteAccountSuccess: "アカウントが削除されました",
      deleteAccountError: "アカウントの削除に失敗しました。もう一度お試しください。"
    }
  },
  ko: {
    auth: {
      validation: {
        mustAgreeToTerms: "계정을 만들려면 개인정보 처리방침과 서비스 약관에 동의해야 합니다"
      },
      consent: {
        agreeTo: "동의합니다",
        privacyPolicy: "개인정보 처리방침",
        and: "및",
        termsOfService: "서비스 약관",
        dataProcessingNote: "서비스를 제공하기 위해 귀하의 데이터를 처리합니다. 언제든지 데이터를 내보내거나 삭제할 수 있습니다."
      }
    },
    legal: {
      privacyPolicy: "개인정보 처리방침",
      termsOfService: "서비스 약관",
      lastUpdated: "최종 업데이트: {{date}}",
      backToHome: "홈으로 돌아가기"
    },
    settings: {
      deleteAccount: "계정 삭제",
      deleteAccountDescription: "계정과 모든 관련 데이터를 영구적으로 삭제",
      deleteAccountWarning: "이 작업은 취소할 수 없습니다. 모든 친구, 게시물, 설정 및 기타 데이터가 영구적으로 삭제됩니다.",
      deleteAccountConfirmation: "확인하려면 DELETE를 입력하세요",
      deleteAccountButton: "내 계정 삭제",
      deleteAccountSuccess: "계정이 삭제되었습니다",
      deleteAccountError: "계정 삭제 실패. 다시 시도해 주세요."
    }
  },
  pt: {
    auth: {
      validation: {
        mustAgreeToTerms: "Você deve concordar com a Política de Privacidade e os Termos de Serviço para criar uma conta"
      },
      consent: {
        agreeTo: "Eu concordo com a",
        privacyPolicy: "Política de Privacidade",
        and: "e os",
        termsOfService: "Termos de Serviço",
        dataProcessingNote: "Processamos seus dados para fornecer o serviço. Você pode exportar ou excluir seus dados a qualquer momento."
      }
    },
    legal: {
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      lastUpdated: "Última atualização: {{date}}",
      backToHome: "Voltar para o Início"
    },
    settings: {
      deleteAccount: "Excluir Conta",
      deleteAccountDescription: "Excluir permanentemente sua conta e todos os dados associados",
      deleteAccountWarning: "Esta ação não pode ser desfeita. Todos os seus amigos, posts, configurações e outros dados serão permanentemente excluídos.",
      deleteAccountConfirmation: "Digite DELETE para confirmar",
      deleteAccountButton: "Excluir Minha Conta",
      deleteAccountSuccess: "Sua conta foi excluída",
      deleteAccountError: "Falha ao excluir conta. Por favor, tente novamente."
    }
  },
  ru: {
    auth: {
      validation: {
        mustAgreeToTerms: "Вы должны согласиться с Политикой конфиденциальности и Условиями использования для создания аккаунта"
      },
      consent: {
        agreeTo: "Я соглашаюсь с",
        privacyPolicy: "Политикой конфиденциальности",
        and: "и",
        termsOfService: "Условиями использования",
        dataProcessingNote: "Мы обрабатываем ваши данные для предоставления услуги. Вы можете экспортировать или удалить свои данные в любое время."
      }
    },
    legal: {
      privacyPolicy: "Политика конфиденциальности",
      termsOfService: "Условия использования",
      lastUpdated: "Последнее обновление: {{date}}",
      backToHome: "Вернуться на главную"
    },
    settings: {
      deleteAccount: "Удалить аккаунт",
      deleteAccountDescription: "Безвозвратно удалить ваш аккаунт и все связанные данные",
      deleteAccountWarning: "Это действие нельзя отменить. Все ваши друзья, посты, настройки и другие данные будут безвозвратно удалены.",
      deleteAccountConfirmation: "Введите DELETE для подтверждения",
      deleteAccountButton: "Удалить мой аккаунт",
      deleteAccountSuccess: "Ваш аккаунт удалён",
      deleteAccountError: "Не удалось удалить аккаунт. Пожалуйста, попробуйте снова."
    }
  },
  zh: {
    auth: {
      validation: {
        mustAgreeToTerms: "您必须同意隐私政策和服务条款才能创建账户"
      },
      consent: {
        agreeTo: "我同意",
        privacyPolicy: "隐私政策",
        and: "和",
        termsOfService: "服务条款",
        dataProcessingNote: "我们处理您的数据以提供服务。您可以随时导出或删除您的数据。"
      }
    },
    legal: {
      privacyPolicy: "隐私政策",
      termsOfService: "服务条款",
      lastUpdated: "最后更新：{{date}}",
      backToHome: "返回首页"
    },
    settings: {
      deleteAccount: "删除账户",
      deleteAccountDescription: "永久删除您的账户和所有关联数据",
      deleteAccountWarning: "此操作无法撤销。您的所有好友、帖子、设置和其他数据将被永久删除。",
      deleteAccountConfirmation: "输入 DELETE 确认",
      deleteAccountButton: "删除我的账户",
      deleteAccountSuccess: "您的账户已删除",
      deleteAccountError: "删除账户失败。请重试。"
    }
  }
};

// Add remaining languages with English fallback
const otherLanguages = ['bn', 'jv', 'mr', 'pa', 'ta', 'te', 'tr', 'ur', 'vi'];
otherLanguages.forEach(lang => {
  if (!newTranslations[lang]) {
    newTranslations[lang] = newTranslations.en;
  }
});

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

    // Deep merge auth section
    if (!content.auth) content.auth = {};
    if (!content.auth.validation) content.auth.validation = {};
    if (!content.auth.consent) content.auth.consent = {};

    content.auth.validation.mustAgreeToTerms = translations.auth.validation.mustAgreeToTerms;
    content.auth.consent = translations.auth.consent;

    // Add legal section
    content.legal = translations.legal;

    // Add settings section (merge with existing)
    if (!content.settings) content.settings = {};
    Object.assign(content.settings, translations.settings);

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Updated ${locale}`);
  } catch (error) {
    console.error(`Error processing ${locale}:`, error.message);
  }
});

console.log('\nDone! GDPR i18n translations added.');
