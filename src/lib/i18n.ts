/**
 * Internationalization (i18n) Configuration
 *
 * InnerFriend.org supports multiple languages to serve our global community.
 * Initial languages: English, Mandarin Chinese, Hindi, Spanish, Arabic
 *
 * We welcome community translators! See CONTRIBUTING.md for how to help.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Supported languages with metadata - Top 20 languages by speaker count (Tier 1)
// Language names use endonyms (native names) as the primary identifier
export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr' as const,
    flag: '🇺🇸',
  },
  zh: {
    name: '简体中文',
    nativeName: '简体中文',
    direction: 'ltr' as const,
    flag: '🇨🇳',
  },
  hi: {
    name: 'हिन्दी',
    nativeName: 'हिन्दी',
    direction: 'ltr' as const,
    flag: '🇮🇳',
  },
  es: {
    name: 'Español',
    nativeName: 'Español',
    direction: 'ltr' as const,
    flag: '🇪🇸',
  },
  fr: {
    name: 'Français',
    nativeName: 'Français',
    direction: 'ltr' as const,
    flag: '🇫🇷',
  },
  ar: {
    name: 'العربية',
    nativeName: 'العربية',
    direction: 'rtl' as const,
    flag: '🇸🇦',
  },
  bn: {
    name: 'বাংলা',
    nativeName: 'বাংলা',
    direction: 'ltr' as const,
    flag: '🇧🇩',
  },
  pt: {
    name: 'Português',
    nativeName: 'Português',
    direction: 'ltr' as const,
    flag: '🇧🇷',
  },
  ru: {
    name: 'Русский',
    nativeName: 'Русский',
    direction: 'ltr' as const,
    flag: '🇷🇺',
  },
  ja: {
    name: '日本語',
    nativeName: '日本語',
    direction: 'ltr' as const,
    flag: '🇯🇵',
  },
  pa: {
    name: 'ਪੰਜਾਬੀ',
    nativeName: 'ਪੰਜਾਬੀ',
    direction: 'ltr' as const,
    flag: '🇮🇳',
  },
  de: {
    name: 'Deutsch',
    nativeName: 'Deutsch',
    direction: 'ltr' as const,
    flag: '🇩🇪',
  },
  jv: {
    name: 'Basa Jawa',
    nativeName: 'Basa Jawa',
    direction: 'ltr' as const,
    flag: '🇮🇩',
  },
  ko: {
    name: '한국어',
    nativeName: '한국어',
    direction: 'ltr' as const,
    flag: '🇰🇷',
  },
  te: {
    name: 'తెలుగు',
    nativeName: 'తెలుగు',
    direction: 'ltr' as const,
    flag: '🇮🇳',
  },
  vi: {
    name: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    direction: 'ltr' as const,
    flag: '🇻🇳',
  },
  mr: {
    name: 'मराठी',
    nativeName: 'मराठी',
    direction: 'ltr' as const,
    flag: '🇮🇳',
  },
  ta: {
    name: 'தமிழ்',
    nativeName: 'தமிழ்',
    direction: 'ltr' as const,
    flag: '🇮🇳',
  },
  tr: {
    name: 'Türkçe',
    nativeName: 'Türkçe',
    direction: 'ltr' as const,
    flag: '🇹🇷',
  },
  it: {
    name: 'Italiano',
    nativeName: 'Italiano',
    direction: 'ltr' as const,
    flag: '🇮🇹',
  },
  ur: {
    name: 'اردو',
    nativeName: 'اردو',
    direction: 'rtl' as const,
    flag: '🇵🇰',
  },
  bled: {
    name: 'Blesséd',
    nativeName: 'Blesséd',
    direction: 'ltr' as const,
    flag: '✨',
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Get language direction (for RTL support)
export function getLanguageDirection(lang: string): 'ltr' | 'rtl' {
  const langCode = lang.split('-')[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES[langCode]?.direction || 'ltr';
}

// Get language metadata
export function getLanguageInfo(lang: string) {
  const langCode = lang.split('-')[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES.en;
}

// Initialize i18next
i18n
  .use(HttpBackend) // Load translations from /public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // React integration
  .init({
    // Default and fallback language
    fallbackLng: 'en',

    // Supported languages
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),

    // Debug mode in development
    debug: import.meta.env.DEV,

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'feed', 'friends', 'settings', 'naybor'],

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Backend configuration for loading translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Detection options
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache language selection
      caches: ['localStorage'],
      // localStorage key
      lookupLocalStorage: 'innerfriend-language',
    },

    // React-specific options
    react: {
      useSuspense: true,
    },
  });

export default i18n;
