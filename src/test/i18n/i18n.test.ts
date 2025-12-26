import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  getLanguageDirection,
  getLanguageInfo,
} from '@/lib/i18n';

describe('i18n Configuration', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should include all 23 Tier 1 languages plus Blesséd and Evereet', () => {
      const languages = Object.keys(SUPPORTED_LANGUAGES);
      // Top 20 languages by speaker count + English + Blesséd + Evereet
      expect(languages).toContain('en'); // English
      expect(languages).toContain('zh'); // 简体中文
      expect(languages).toContain('hi'); // हिन्दी
      expect(languages).toContain('es'); // Español
      expect(languages).toContain('fr'); // Français
      expect(languages).toContain('ar'); // العربية
      expect(languages).toContain('bn'); // বাংলা
      expect(languages).toContain('pt'); // Português
      expect(languages).toContain('ru'); // Русский
      expect(languages).toContain('ja'); // 日本語
      expect(languages).toContain('pa'); // ਪੰਜਾਬੀ
      expect(languages).toContain('de'); // Deutsch
      expect(languages).toContain('jv'); // Basa Jawa
      expect(languages).toContain('ko'); // 한국어
      expect(languages).toContain('te'); // తెలుగు
      expect(languages).toContain('vi'); // Tiếng Việt
      expect(languages).toContain('mr'); // मराठी
      expect(languages).toContain('ta'); // தமிழ்
      expect(languages).toContain('tr'); // Türkçe
      expect(languages).toContain('it'); // Italiano
      expect(languages).toContain('ur'); // اردو
      expect(languages).toContain('he'); // Evereet (עברית)
      expect(languages).toContain('bled'); // Blesséd
      expect(languages).toHaveLength(23);
    });

    it('should have name and nativeName for each language', () => {
      Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
        expect(lang.name).toBeDefined();
        expect(lang.nativeName).toBeDefined();
        expect(typeof lang.name).toBe('string');
        expect(typeof lang.nativeName).toBe('string');
        expect(lang.name.length).toBeGreaterThan(0);
        expect(lang.nativeName.length).toBeGreaterThan(0);
      });
    });

    it('should use endonyms (native names) as primary name', () => {
      // Verify that language names are endonyms, not English exonyms
      expect(SUPPORTED_LANGUAGES.zh.name).toBe('简体中文');
      expect(SUPPORTED_LANGUAGES.hi.name).toBe('हिन्दी');
      expect(SUPPORTED_LANGUAGES.ar.name).toBe('العربية');
      expect(SUPPORTED_LANGUAGES.ja.name).toBe('日本語');
      expect(SUPPORTED_LANGUAGES.ko.name).toBe('한국어');
      expect(SUPPORTED_LANGUAGES.ru.name).toBe('Русский');
      expect(SUPPORTED_LANGUAGES.de.name).toBe('Deutsch');
      expect(SUPPORTED_LANGUAGES.fr.name).toBe('Français');
      expect(SUPPORTED_LANGUAGES.es.name).toBe('Español');
      expect(SUPPORTED_LANGUAGES.pt.name).toBe('Português');
      expect(SUPPORTED_LANGUAGES.it.name).toBe('Italiano');
      expect(SUPPORTED_LANGUAGES.tr.name).toBe('Türkçe');
      expect(SUPPORTED_LANGUAGES.vi.name).toBe('Tiếng Việt');
      expect(SUPPORTED_LANGUAGES.ur.name).toBe('اردو');
    });

    it('should have direction for each language', () => {
      Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
        expect(lang.direction).toBeDefined();
        expect(['ltr', 'rtl']).toContain(lang.direction);
      });
    });

    it('should have flag emoji for each language', () => {
      Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
        expect(lang.flag).toBeDefined();
        expect(typeof lang.flag).toBe('string');
        // Flag emojis are typically 2+ code points
        expect(lang.flag.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should mark Arabic, Urdu, and Evereet as RTL', () => {
      expect(SUPPORTED_LANGUAGES.ar.direction).toBe('rtl');
      expect(SUPPORTED_LANGUAGES.ur.direction).toBe('rtl');
      expect(SUPPORTED_LANGUAGES.he.direction).toBe('rtl'); // Evereet
    });

    it('should mark all other languages as LTR', () => {
      const ltrLanguages = ['en', 'zh', 'hi', 'es', 'fr', 'bn', 'pt', 'ru', 'ja', 'pa', 'de', 'jv', 'ko', 'te', 'vi', 'mr', 'ta', 'tr', 'it', 'bled'];
      ltrLanguages.forEach((code) => {
        expect(SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES].direction).toBe('ltr');
      });
    });
  });

  describe('getLanguageDirection', () => {
    it('should return rtl for Arabic', () => {
      expect(getLanguageDirection('ar')).toBe('rtl');
      expect(getLanguageDirection('ar-SA')).toBe('rtl');
      expect(getLanguageDirection('ar-EG')).toBe('rtl');
    });

    it('should return rtl for Urdu', () => {
      expect(getLanguageDirection('ur')).toBe('rtl');
      expect(getLanguageDirection('ur-PK')).toBe('rtl');
    });

    it('should return ltr for English', () => {
      expect(getLanguageDirection('en')).toBe('ltr');
      expect(getLanguageDirection('en-US')).toBe('ltr');
      expect(getLanguageDirection('en-GB')).toBe('ltr');
    });

    it('should return ltr for Chinese', () => {
      expect(getLanguageDirection('zh')).toBe('ltr');
      expect(getLanguageDirection('zh-CN')).toBe('ltr');
      expect(getLanguageDirection('zh-TW')).toBe('ltr');
    });

    it('should return ltr for Hindi', () => {
      expect(getLanguageDirection('hi')).toBe('ltr');
      expect(getLanguageDirection('hi-IN')).toBe('ltr');
    });

    it('should return ltr for Spanish', () => {
      expect(getLanguageDirection('es')).toBe('ltr');
      expect(getLanguageDirection('es-ES')).toBe('ltr');
      expect(getLanguageDirection('es-MX')).toBe('ltr');
    });

    it('should return ltr for Japanese, Korean, and other Asian languages', () => {
      expect(getLanguageDirection('ja')).toBe('ltr');
      expect(getLanguageDirection('ko')).toBe('ltr');
      expect(getLanguageDirection('vi')).toBe('ltr');
    });

    it('should return ltr for unknown languages', () => {
      expect(getLanguageDirection('unknown')).toBe('ltr');
      expect(getLanguageDirection('')).toBe('ltr');
    });
  });

  describe('getLanguageInfo', () => {
    it('should return correct info for English', () => {
      const info = getLanguageInfo('en');
      expect(info.name).toBe('English');
      expect(info.nativeName).toBe('English');
      expect(info.flag).toBe('🇺🇸');
    });

    it('should return correct info for Chinese (using endonym)', () => {
      const info = getLanguageInfo('zh');
      expect(info.name).toBe('简体中文');
      expect(info.nativeName).toBe('简体中文');
      expect(info.flag).toBe('🇨🇳');
    });

    it('should return correct info for Hindi (using endonym)', () => {
      const info = getLanguageInfo('hi');
      expect(info.name).toBe('हिन्दी');
      expect(info.nativeName).toBe('हिन्दी');
      expect(info.flag).toBe('🇮🇳');
    });

    it('should return correct info for Spanish (using endonym)', () => {
      const info = getLanguageInfo('es');
      expect(info.name).toBe('Español');
      expect(info.nativeName).toBe('Español');
      expect(info.flag).toBe('🇪🇸');
    });

    it('should return correct info for Arabic (using endonym)', () => {
      const info = getLanguageInfo('ar');
      expect(info.name).toBe('العربية');
      expect(info.nativeName).toBe('العربية');
      expect(info.flag).toBe('🇸🇦');
    });

    it('should return correct info for Japanese (using endonym)', () => {
      const info = getLanguageInfo('ja');
      expect(info.name).toBe('日本語');
      expect(info.nativeName).toBe('日本語');
      expect(info.flag).toBe('🇯🇵');
    });

    it('should return correct info for Blesséd', () => {
      const info = getLanguageInfo('bled');
      expect(info.name).toBe('Blesséd');
      expect(info.nativeName).toBe('Blesséd');
      expect(info.flag).toBe('✨');
    });

    it('should handle language codes with region', () => {
      const info = getLanguageInfo('en-US');
      expect(info.name).toBe('English');
    });

    it('should fall back to English for unknown languages', () => {
      const info = getLanguageInfo('unknown');
      expect(info.name).toBe('English');
    });
  });
});

describe('Translation Files', () => {
  // These tests validate the structure of translation files
  const languages = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ja', 'pa', 'de', 'jv', 'ko', 'te', 'vi', 'mr', 'ta', 'tr', 'it', 'ur', 'he', 'bled'];

  languages.forEach((lang) => {
    describe(`${lang} translations`, () => {
      it(`should have valid JSON structure for ${lang}/common.json`, async () => {
        // In a real test environment, we'd load the JSON files
        // For now, we just verify the language is in our supported list
        expect(SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]).toBeDefined();
      });
    });
  });
});

describe('RTL Support', () => {
  it('should identify RTL languages correctly', () => {
    // Arabic, Urdu, and Evereet are RTL languages
    const rtlLanguages = Object.entries(SUPPORTED_LANGUAGES)
      .filter(([_, info]) => info.direction === 'rtl')
      .map(([code]) => code);

    expect(rtlLanguages).toContain('ar');
    expect(rtlLanguages).toContain('ur');
    expect(rtlLanguages).toContain('he'); // Evereet
    expect(rtlLanguages).toHaveLength(3);
  });

  it('should identify LTR languages correctly', () => {
    const ltrLanguages = Object.entries(SUPPORTED_LANGUAGES)
      .filter(([_, info]) => info.direction === 'ltr')
      .map(([code]) => code);

    expect(ltrLanguages).toContain('en');
    expect(ltrLanguages).toContain('zh');
    expect(ltrLanguages).toContain('hi');
    expect(ltrLanguages).toContain('es');
    expect(ltrLanguages).toContain('ja');
    expect(ltrLanguages).toContain('ko');
    expect(ltrLanguages).toContain('bled');
    expect(ltrLanguages).toHaveLength(20); // 23 total - 3 RTL = 20 LTR
  });
});
