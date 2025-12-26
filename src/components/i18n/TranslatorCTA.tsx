import { useTranslation } from 'react-i18next';
import { Globe, Heart, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface TranslatorCTAProps {
  variant?: 'card' | 'inline' | 'banner';
  className?: string;
}

/**
 * Call-to-action component encouraging community translations
 * Shows current language coverage and invites contributions
 */
export function TranslatorCTA({ variant = 'card', className }: TranslatorCTAProps) {
  const { t } = useTranslation();

  const languageCount = Object.keys(SUPPORTED_LANGUAGES).length;
  const contributeUrl = 'https://github.com/LifesaverLabs/inner-friend-circle/blob/main/CONTRIBUTING.md#translations';

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/5 border border-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('language.helpTranslate')}</p>
              <p className="text-xs text-muted-foreground">
                {t('language.communityTranslation')}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(contributeUrl, '_blank')}
            className="gap-2"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            Contribute
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={() => window.open(contributeUrl, '_blank')}
        className={`inline-flex items-center gap-2 text-sm text-primary hover:underline ${className}`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {t('language.helpTranslate')}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </button>
    );
  }

  // Default card variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
          {t('language.helpTranslate')}
        </CardTitle>
        <CardDescription>
          {t('language.communityTranslation')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
            <span
              key={lang.name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm"
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Currently available in {languageCount} languages. We're looking for translators
          to add support for more languages including:
        </p>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>Portuguese</span>
          <span>•</span>
          <span>Bengali</span>
          <span>•</span>
          <span>Japanese</span>
          <span>•</span>
          <span>French</span>
          <span>•</span>
          <span>German</span>
          <span>•</span>
          <span>Korean</span>
          <span>•</span>
          <span>and more...</span>
        </div>

        <Button
          onClick={() => window.open(contributeUrl, '_blank')}
          className="w-full gap-2"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Become a Translator
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          InnerFriend is open source. Your translations help build a more inclusive community.
        </p>
      </CardContent>
    </Card>
  );
}
