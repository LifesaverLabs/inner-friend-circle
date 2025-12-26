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
              <h2 className="text-xl font-semibold mb-3">Our Privacy-First Philosophy</h2>
              <p className="text-muted-foreground">
                Inner Friend Circle is built by Lifesaver Labs with privacy as a core principle. We believe your
                relationships are deeply personal, and we treat your data with the respect it deserves. We collect
                only what's necessary to provide the service, and we never sell your data to third parties.
              </p>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3">What Data We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Account Information</h3>
                  <p className="text-muted-foreground text-sm">
                    Email address and password (securely hashed) for authentication. Optional display name.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Friend Data</h3>
                  <p className="text-muted-foreground text-sm">
                    Names, contact information (email, phone), notes, and tier classifications you create.
                    This is stored to provide the core service functionality.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Emergency Access Data (Keys Shared)</h3>
                  <p className="text-muted-foreground text-sm">
                    If you use the Keys Shared feature, we store your address, key holder information,
                    and emergency access preferences. This data is especially sensitive and is protected accordingly.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Usage Data</h3>
                  <p className="text-muted-foreground text-sm">
                    We may collect basic usage information to improve the service, but we do not use
                    third-party analytics or tracking tools.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Data</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>To provide and maintain the Inner Friend Circle service</li>
                <li>To enable mutual matching when you and another user both list each other</li>
                <li>To facilitate emergency naybor coordination if you enable Keys Shared</li>
                <li>To send you important service notifications (never marketing)</li>
                <li>To improve and develop new features</li>
              </ul>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Data Storage & Security</h2>
              <p className="text-muted-foreground text-sm">
                Your data is stored securely using Supabase, a trusted infrastructure provider. All data is
                encrypted in transit (HTTPS/TLS) and at rest. We implement row-level security to ensure
                you can only access your own data. Authentication is handled securely with industry-standard practices.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights (GDPR & Data Liberation)</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Right to Access & Export</h3>
                    <p className="text-muted-foreground">
                      You can export all your data at any time in a portable JSON format. Use the Export
                      feature in your dashboard. Your data belongs to you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Right to Deletion</h3>
                    <p className="text-muted-foreground">
                      You can delete your account and all associated data at any time from Settings.
                      Deletion is permanent and cascades to all your data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Right to Rectification</h3>
                    <p className="text-muted-foreground">
                      You can edit your data at any time through the application interface.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Right to Object</h3>
                    <p className="text-muted-foreground">
                      You can opt out of specific features like emergency worker sharing for Keys Shared data.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Third Parties */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
              <p className="text-muted-foreground text-sm">
                <strong>Supabase:</strong> Our database and authentication provider. They process data on our
                behalf under strict data processing agreements. See their privacy policy at supabase.com/privacy.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                We do not use any advertising networks, social media trackers, or third-party analytics services.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Cookies & Local Storage</h2>
              <p className="text-muted-foreground text-sm">
                We use only essential cookies/local storage for authentication session management. We do not
                use tracking cookies, advertising cookies, or any non-essential cookies.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
              <p className="text-muted-foreground text-sm">
                Inner Friend Circle is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If you become aware that a child has
                provided us with personal data, please contact us.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
              <p className="text-muted-foreground text-sm">
                We retain your data for as long as your account is active. When you delete your account,
                all associated data is permanently deleted within 30 days. Backups may retain data for up
                to 90 days for disaster recovery purposes.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground text-sm">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <ul className="list-none text-sm text-muted-foreground mt-2 space-y-1">
                <li>Email: privacy@lifesaverlabs.org</li>
                <li>GitHub: github.com/lifesaverlabs/inner-friend-circle</li>
              </ul>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-muted-foreground text-sm">
                We may update this privacy policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the "last updated" date. Continued use of
                the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
