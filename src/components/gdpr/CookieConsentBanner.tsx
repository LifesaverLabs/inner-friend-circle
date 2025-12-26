/**
 * Cookie Consent Banner
 *
 * GDPR-compliant cookie consent banner that appears on first visit.
 * Allows users to accept all cookies, essential only, or customize preferences.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { CookieConsent } from '@/types/gdpr';

interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onAcceptEssential: () => void;
  onCustomize: (consent: Partial<CookieConsent>) => void;
  onDismiss: () => void;
}

export function CookieConsentBanner({
  onAcceptAll,
  onAcceptEssential,
  onCustomize,
  onDismiss,
}: CookieConsentBannerProps) {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  const [customConsent, setCustomConsent] = useState<CookieConsent>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const handleSaveCustom = () => {
    onCustomize(customConsent);
    setShowSettings(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Icon and Text */}
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <h2 id="cookie-banner-title" className="font-semibold text-sm">
                    {t('gdpr.cookies.title')}
                  </h2>
                  <p id="cookie-banner-description" className="text-sm text-muted-foreground">
                    {t('gdpr.cookies.description')}{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {t('gdpr.cookies.learnMore')}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex-1 md:flex-initial"
                  aria-label={t('gdpr.cookies.customizeAria')}
                >
                  <Settings className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  {t('gdpr.cookies.customize')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAcceptEssential}
                  className="flex-1 md:flex-initial"
                  aria-label={t('gdpr.cookies.essentialOnlyAria')}
                >
                  {t('gdpr.cookies.essentialOnly')}
                </Button>
                <Button
                  size="sm"
                  onClick={onAcceptAll}
                  className="flex-1 md:flex-initial"
                  aria-label={t('gdpr.cookies.acceptAllAria')}
                >
                  <Check className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  {t('gdpr.cookies.acceptAll')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" aria-hidden="true" />
              {t('gdpr.cookies.settingsTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('gdpr.cookies.settingsDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Essential Cookies - Always on */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Checkbox
                id="essential-cookies"
                checked={true}
                disabled
                className="mt-0.5"
                aria-describedby="essential-description"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="essential-cookies" className="font-medium">
                  {t('gdpr.cookies.essential.title')}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({t('gdpr.cookies.required')})
                  </span>
                </Label>
                <p id="essential-description" className="text-sm text-muted-foreground">
                  {t('gdpr.cookies.essential.description')}
                </p>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Checkbox
                id="functional-cookies"
                checked={customConsent.functional}
                onCheckedChange={(checked) =>
                  setCustomConsent((prev) => ({ ...prev, functional: !!checked }))
                }
                className="mt-0.5"
                aria-describedby="functional-description"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="functional-cookies" className="font-medium cursor-pointer">
                  {t('gdpr.cookies.functional.title')}
                </Label>
                <p id="functional-description" className="text-sm text-muted-foreground">
                  {t('gdpr.cookies.functional.description')}
                </p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Checkbox
                id="analytics-cookies"
                checked={customConsent.analytics}
                onCheckedChange={(checked) =>
                  setCustomConsent((prev) => ({ ...prev, analytics: !!checked }))
                }
                className="mt-0.5"
                aria-describedby="analytics-description"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="analytics-cookies" className="font-medium cursor-pointer">
                  {t('gdpr.cookies.analytics.title')}
                </Label>
                <p id="analytics-description" className="text-sm text-muted-foreground">
                  {t('gdpr.cookies.analytics.description')}
                </p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Checkbox
                id="marketing-cookies"
                checked={customConsent.marketing}
                onCheckedChange={(checked) =>
                  setCustomConsent((prev) => ({ ...prev, marketing: !!checked }))
                }
                className="mt-0.5"
                aria-describedby="marketing-description"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="marketing-cookies" className="font-medium cursor-pointer">
                  {t('gdpr.cookies.marketing.title')}
                </Label>
                <p id="marketing-description" className="text-sm text-muted-foreground">
                  {t('gdpr.cookies.marketing.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleSaveCustom} className="flex-1">
              {t('gdpr.cookies.savePreferences')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
