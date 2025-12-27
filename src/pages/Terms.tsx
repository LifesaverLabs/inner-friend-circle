import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/i18n/LanguageSelector';

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
          aria-label={t('legal.backToHome')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('nav.back')}
        </Button>
        <LanguageSelector variant="prominent" />
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">{t('legal.termsOfService')}</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            {t('legal.lastUpdated', { date: 'December 2025' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.introduction.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.introduction.description')}
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.service.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.service.description')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm mt-2">
                <li>{t('terms.service.features.tiers')}</li>
                <li>{t('terms.service.features.matching')}</li>
                <li>{t('terms.service.features.keysShared')}</li>
                <li>{t('terms.service.features.dataExport')}</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.userAccounts.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.userAccounts.description')}
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.acceptableUse.title')}</h2>
              <p className="text-muted-foreground text-sm mb-2">
                {t('terms.acceptableUse.intro')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>{t('terms.acceptableUse.prohibited.harm')}</li>
                <li>{t('terms.acceptableUse.prohibited.harassment')}</li>
                <li>{t('terms.acceptableUse.prohibited.laws')}</li>
                <li>{t('terms.acceptableUse.prohibited.unauthorized')}</li>
                <li>{t('terms.acceptableUse.prohibited.misuse')}</li>
                <li>{t('terms.acceptableUse.prohibited.impersonate')}</li>
              </ul>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.userContent.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.userContent.description')}
              </p>
            </section>

            {/* Keys Shared & Emergency Features */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.keysShared.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.keysShared.description')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm mt-2">
                <li>{t('terms.keysShared.points.risks')}</li>
                <li>{t('terms.keysShared.points.trust')}</li>
                <li>{t('terms.keysShared.points.liability')}</li>
                <li>{t('terms.keysShared.points.emergencyWorkers')}</li>
                <li>{t('terms.keysShared.points.disable')}</li>
              </ul>
            </section>

            {/* Data Liberation */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.dataLiberation.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.dataLiberation.description')}
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.privacy.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.privacy.description')}
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.intellectualProperty.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.intellectualProperty.description')}
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.liability.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.liability.description')}
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {t('terms.liability.includes')}
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.indemnification.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.indemnification.description')}
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.termination.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.termination.description')}
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.changes.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.changes.description')}
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.governingLaw.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.governingLaw.description')}
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.severability.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.severability.description')}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.contact.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('terms.contact.description')}
              </p>
              <ul className="list-none text-sm text-muted-foreground mt-2 space-y-1">
                <li>{t('terms.contact.email')}: legal@lifesaverlabs.org</li>
                <li>{t('terms.contact.github')}: github.com/lifesaverlabs/inner-friend-circle</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
