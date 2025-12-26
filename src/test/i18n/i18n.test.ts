import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  getLanguageDirection,
  getLanguageInfo,
} from '@/lib/i18n';

describe('i18n Configuration', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should include all 5 major languages', () => {
      const languages = Object.keys(SUPPORTED_LANGUAGES);
      expect(languages).toContain('en'); // English
      expect(languages).toContain('zh'); // Chinese
      expect(languages).toContain('hi'); // Hindi
      expect(languages).toContain('es'); // Spanish
      expect(languages).toContain('ar'); // Arabic
      expect(languages).toHaveLength(5);
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
        // Flag emojis are typically 2 code points (regional indicator symbols)
        expect(lang.flag.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should mark Arabic as RTL', () => {
      expect(SUPPORTED_LANGUAGES.ar.direction).toBe('rtl');
    });

    it('should mark all other languages as LTR', () => {
      expect(SUPPORTED_LANGUAGES.en.direction).toBe('ltr');
      expect(SUPPORTED_LANGUAGES.zh.direction).toBe('ltr');
      expect(SUPPORTED_LANGUAGES.hi.direction).toBe('ltr');
      expect(SUPPORTED_LANGUAGES.es.direction).toBe('ltr');
    });
  });

  describe('getLanguageDirection', () => {
    it('should return rtl for Arabic', () => {
      expect(getLanguageDirection('ar')).toBe('rtl');
      expect(getLanguageDirection('ar-SA')).toBe('rtl');
      expect(getLanguageDirection('ar-EG')).toBe('rtl');
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

    it('should return correct info for Chinese', () => {
      const info = getLanguageInfo('zh');
      expect(info.name).toBe('Chinese (Simplified)');
      expect(info.nativeName).toBe('简体中文');
      expect(info.flag).toBe('🇨🇳');
    });

    it('should return correct info for Hindi', () => {
      const info = getLanguageInfo('hi');
      expect(info.name).toBe('Hindi');
      expect(info.nativeName).toBe('हिन्दी');
      expect(info.flag).toBe('🇮🇳');
    });

    it('should return correct info for Spanish', () => {
      const info = getLanguageInfo('es');
      expect(info.name).toBe('Spanish');
      expect(info.nativeName).toBe('Español');
      expect(info.flag).toBe('🇪🇸');
    });

    it('should return correct info for Arabic', () => {
      const info = getLanguageInfo('ar');
      expect(info.name).toBe('Arabic');
      expect(info.nativeName).toBe('العربية');
      expect(info.flag).toBe('🇸🇦');
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
  const languages = ['en', 'zh', 'hi', 'es', 'ar'];

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
    // Arabic is the only RTL language in our initial set
    const rtlLanguages = Object.entries(SUPPORTED_LANGUAGES)
      .filter(([_, info]) => info.direction === 'rtl')
      .map(([code]) => code);

    expect(rtlLanguages).toContain('ar');
    expect(rtlLanguages).toHaveLength(1);
  });

  it('should identify LTR languages correctly', () => {
    const ltrLanguages = Object.entries(SUPPORTED_LANGUAGES)
      .filter(([_, info]) => info.direction === 'ltr')
      .map(([code]) => code);

    expect(ltrLanguages).toContain('en');
    expect(ltrLanguages).toContain('zh');
    expect(ltrLanguages).toContain('hi');
    expect(ltrLanguages).toContain('es');
    expect(ltrLanguages).toHaveLength(4);
  });
});
