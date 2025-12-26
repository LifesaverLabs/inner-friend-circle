import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

/**
 * Tests to ensure naybor warning translations are present in all locales.
 * These are critical for the UX when users have fewer than 3 naybors.
 */

const REQUIRED_NAYBOR_KEYS = [
  'naybor.underMinWarning',
  'naybor.underMinDescription',
  'naybor.mrRogersQuote',
];

const LOCALES_PATH = path.resolve(__dirname, '../../../public/locales');

// Helper to get nested value from object
function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  return keyPath.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

describe('Naybor Warning Translations', () => {
  const supportedLangCodes = Object.keys(SUPPORTED_LANGUAGES);

  describe('English (reference)', () => {
    const enPath = path.join(LOCALES_PATH, 'en', 'common.json');
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

    it('should have underMinWarning with count placeholder', () => {
      const value = getNestedValue(enTranslations, 'naybor.underMinWarning') as string;
      expect(value).toBeDefined();
      expect(value).toContain('{{count}}');
      expect(value.toLowerCase()).toContain('naybor');
    });

    it('should have underMinDescription explaining why naybors matter', () => {
      const value = getNestedValue(enTranslations, 'naybor.underMinDescription') as string;
      expect(value).toBeDefined();
      expect(value.length).toBeGreaterThan(50); // Should be a meaningful description
      expect(value.toLowerCase()).toMatch(/emergenc|mutual|communit/i);
    });

    it('should have mrRogersQuote with proper attribution', () => {
      const value = getNestedValue(enTranslations, 'naybor.mrRogersQuote') as string;
      expect(value).toBeDefined();
      expect(value).toContain('Fred Rogers');
      expect(value.toLowerCase()).toContain('neighbor');
    });
  });

  describe('All supported languages', () => {
    supportedLangCodes.forEach((langCode) => {
      describe(`${langCode} locale`, () => {
        const localePath = path.join(LOCALES_PATH, langCode, 'common.json');

        // Skip if file doesn't exist (some languages may not have translations yet)
        const fileExists = fs.existsSync(localePath);

        if (fileExists) {
          const translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));

          REQUIRED_NAYBOR_KEYS.forEach((key) => {
            it(`should have ${key}`, () => {
              const value = getNestedValue(translations, key);
              expect(value, `Missing ${key} in ${langCode}`).toBeDefined();
              expect(typeof value).toBe('string');
              expect((value as string).length).toBeGreaterThan(0);
            });
          });

          it('should have underMinWarning with count placeholder', () => {
            const value = getNestedValue(translations, 'naybor.underMinWarning') as string;
            expect(value).toContain('{{count}}');
          });
        } else {
          it.skip(`${langCode} locale file not found`, () => {});
        }
      });
    });
  });

  describe('Translation content quality', () => {
    const enPath = path.join(LOCALES_PATH, 'en', 'common.json');
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

    it('underMinWarning should recommend at least 3 naybors', () => {
      const value = getNestedValue(enTranslations, 'naybor.underMinWarning') as string;
      expect(value).toContain('3');
    });

    it('underMinDescription should encourage community building', () => {
      const value = getNestedValue(enTranslations, 'naybor.underMinDescription') as string;
      expect(value.toLowerCase()).toMatch(/introduc|neighbor|communit/i);
    });

    it('mrRogersQuote should be the iconic quote', () => {
      const value = getNestedValue(enTranslations, 'naybor.mrRogersQuote') as string;
      expect(value.toLowerCase()).toContain("won't you be my neighbor");
    });
  });
});

describe('GDPR Translations', () => {
  const REQUIRED_GDPR_KEYS = [
    'gdpr.cookies.title',
    'gdpr.cookies.description',
    'gdpr.cookies.acceptAll',
    'gdpr.cookies.essentialOnly',
    'gdpr.cookies.customize',
    'gdpr.cookies.essential.title',
    'gdpr.cookies.functional.title',
    'gdpr.cookies.analytics.title',
    'gdpr.cookies.marketing.title',
    'gdpr.settings.dataRights',
    'gdpr.settings.exportData',
    'gdpr.settings.deleteAccount',
    'gdpr.deletion.title',
    'gdpr.deletion.gracePeriodTitle',
    'gdpr.age.title',
  ];

  describe('English GDPR translations', () => {
    const enPath = path.join(LOCALES_PATH, 'en', 'common.json');
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

    REQUIRED_GDPR_KEYS.forEach((key) => {
      it(`should have ${key}`, () => {
        const value = getNestedValue(enTranslations, key);
        expect(value, `Missing ${key}`).toBeDefined();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      });
    });

    it('should have 30-day grace period mentioned', () => {
      const value = getNestedValue(enTranslations, 'gdpr.deletion.gracePeriodDescription') as string;
      expect(value).toContain('{{days}}');
    });

    it('should have age verification with GDPR age limit', () => {
      const value = getNestedValue(enTranslations, 'gdpr.age.whyDescription') as string;
      expect(value).toContain('{{age}}');
    });
  });
});
