/**
 * DispatchRegistration Page
 *
 * Public page for emergency dispatch organizations to register for
 * Door Key Tree access.
 */

import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/i18n/LanguageSelector';
import { DispatchRegistrationWizard } from '@/components/dispatch/DispatchRegistrationWizard';

export default function DispatchRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
            aria-label={t('nav.back')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('nav.back')}
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">{t('app.name')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dispatch/login" className="text-sm text-muted-foreground hover:text-foreground">
            {t('dispatch.registration.alreadyRegistered')}
          </Link>
          <LanguageSelector variant="prominent" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Page title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-4 p-3 rounded-full bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t('dispatch.registration.pageTitle')}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('dispatch.registration.pageDescription')}
            </p>
          </div>

          {/* Info banner */}
          <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                  {t('dispatch.registration.infoTitle')}
                </p>
                <ul className="text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>{t('dispatch.registration.infoPoint1')}</li>
                  <li>{t('dispatch.registration.infoPoint2')}</li>
                  <li>{t('dispatch.registration.infoPoint3')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration wizard */}
          <DispatchRegistrationWizard />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground border-t">
        <p>
          {t('dispatch.registration.footer.questions')}{' '}
          <a href="mailto:dispatch@innerfriend.app" className="text-primary hover:underline">
            dispatch@innerfriend.app
          </a>
        </p>
      </footer>
    </div>
  );
}
