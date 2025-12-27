import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/i18n/LanguageSelector';

export default function Privacy() {
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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">{t('legal.privacyPolicy')}</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            {t('legal.lastUpdated', { date: 'December 2025' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            {/* Privacy-First Philosophy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.philosophy.title')}</h2>
              <p className="text-muted-foreground">
                {t('privacy.philosophy.description')}
              </p>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.dataCollection.title')}</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">{t('privacy.dataCollection.accountInfo.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('privacy.dataCollection.accountInfo.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">{t('privacy.dataCollection.friendData.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('privacy.dataCollection.friendData.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">{t('privacy.dataCollection.emergencyData.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('privacy.dataCollection.emergencyData.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">{t('privacy.dataCollection.usageData.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('privacy.dataCollection.usageData.description')}
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.dataUsage.title')}</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>{t('privacy.dataUsage.provide')}</li>
                <li>{t('privacy.dataUsage.matching')}</li>
                <li>{t('privacy.dataUsage.emergency')}</li>
                <li>{t('privacy.dataUsage.notifications')}</li>
                <li>{t('privacy.dataUsage.improve')}</li>
              </ul>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.dataStorage.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.dataStorage.description')}
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.rights.title')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{t('privacy.rights.access.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('privacy.rights.access.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{t('privacy.rights.deletion.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('privacy.rights.deletion.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{t('privacy.rights.rectification.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('privacy.rights.rectification.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{t('privacy.rights.object.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('privacy.rights.object.description')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Third Parties */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.thirdParties.title')}</h2>
              <p className="text-muted-foreground text-sm">
                <strong>{t('privacy.thirdParties.supabase.name')}:</strong> {t('privacy.thirdParties.supabase.description')}
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {t('privacy.thirdParties.noTracking')}
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.cookies.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.cookies.description')}
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.children.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.children.description')}
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.retention.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.retention.description')}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.contact.description')}
              </p>
              <ul className="list-none text-sm text-muted-foreground mt-2 space-y-1">
                <li>{t('privacy.contact.email')}: privacy@lifesaverlabs.org</li>
                <li>{t('privacy.contact.github')}: github.com/lifesaverlabs/inner-friend-circle</li>
              </ul>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.changes.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('privacy.changes.description')}
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
