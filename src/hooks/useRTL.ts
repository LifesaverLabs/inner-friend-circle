import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageDirection } from '@/lib/i18n';

/**
 * Hook to manage RTL (Right-to-Left) layout support
 *
 * Automatically updates document direction when language changes.
 * Used for Arabic and other RTL languages.
 */
export function useRTL() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const direction = getLanguageDirection(i18n.language);
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;

    // Add RTL class for additional CSS targeting if needed
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  return {
    isRTL: getLanguageDirection(i18n.language) === 'rtl',
    direction: getLanguageDirection(i18n.language),
    language: i18n.language,
  };
}
