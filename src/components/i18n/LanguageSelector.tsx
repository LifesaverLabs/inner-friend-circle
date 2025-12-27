import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  getLanguageDirection,
} from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'prominent';
  showLabel?: boolean;
  className?: string;
}

export function LanguageSelector({
  variant = 'default',
  showLabel = true,
  className,
}: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;
  const currentLangInfo = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    // Update document direction for RTL languages immediately
    const direction = getLanguageDirection(lang);
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;

    // Change language and wait for translations to load
    // react-i18next will automatically re-render all components using useTranslation
    await i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'prominent' ? 'outline' : 'ghost'}
          size={variant === 'compact' ? 'icon' : 'default'}
          className={`${className} ${variant === 'prominent' ? 'gap-2 border-primary/30 hover:border-primary/50' : ''}`}
          aria-label={t('language.select')}
        >
          {variant === 'compact' ? (
            <>
              <Globe className="h-4 w-4" />
              <span className="sr-only">{t('language.select')}</span>
            </>
          ) : variant === 'prominent' ? (
            <>
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-base">{currentLangInfo.flag}</span>
              <span className="text-sm font-medium">{currentLangInfo.nativeName}</span>
            </>
          ) : (
            <>
              <span className="text-base mr-2">{currentLangInfo.flag}</span>
              {showLabel && (
                <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
              )}
              <Globe className="h-4 w-4 ml-2 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('language.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(SUPPORTED_LANGUAGES) as [SupportedLanguage, typeof SUPPORTED_LANGUAGES[SupportedLanguage]][]).map(
          ([code, info]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{info.flag}</span>
                <div className="flex flex-col">
                  <span>{info.nativeName}</span>
                  {info.nativeName !== info.name && (
                    <span className="text-xs text-muted-foreground">{info.name}</span>
                  )}
                </div>
              </div>
              {currentLang === code && (
                <Check className="h-4 w-4 text-primary" aria-label={t('accessibility.selected')} />
              )}
            </DropdownMenuItem>
          )
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-primary cursor-pointer"
          onClick={() => window.open('https://github.com/LifesaverLabs/inner-friend-circle/blob/main/CONTRIBUTING.md#translations', '_blank')}
        >
          <Globe className="h-4 w-4 mr-2" />
          {t('language.helpTranslate')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
