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
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground text-sm">
                Welcome to Inner Friend Circle, a service provided by Lifesaver Labs. By accessing or using
                our service, you agree to be bound by these Terms of Service ("Terms"). If you disagree with
                any part of these terms, you may not access the service.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground text-sm">
                Inner Friend Circle is a privacy-first relationship management tool that helps you maintain
                meaningful connections based on Dunbar's number research. The service includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm mt-2">
                <li>Organization of friends into meaningful tiers (Core, Inner, Outer, Naybor, etc.)</li>
                <li>Optional mutual matching to discover reciprocal friendships</li>
                <li>Keys Shared emergency access coordination for naybors</li>
                <li>Data export and portability features</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground text-sm">
                You are responsible for safeguarding your account credentials and for any activities or
                actions under your account. You must notify us immediately upon becoming aware of any
                breach of security or unauthorized use of your account.
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-muted-foreground text-sm mb-2">
                You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Store information about others without their knowledge in ways that could harm them</li>
                <li>Engage in stalking, harassment, or surveillance of others</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to other users' data</li>
                <li>Use the emergency features (Keys Shared, Naybor SOS) for non-emergency purposes</li>
                <li>Impersonate others or misrepresent your identity</li>
              </ul>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-xl font-semibold mb-3">5. User Content</h2>
              <p className="text-muted-foreground text-sm">
                You retain ownership of all content you create within the service (friend information, notes,
                preferences). By using the service, you grant us a limited license to process and store this
                content solely to provide the service to you. We do not claim ownership of your data.
              </p>
            </section>

            {/* Keys Shared & Emergency Features */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Keys Shared & Emergency Features</h2>
              <p className="text-muted-foreground text-sm">
                The Keys Shared feature allows you to designate trusted naybors who have access to your home
                in emergencies. By using this feature:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm mt-2">
                <li>You acknowledge that sharing key/access information carries inherent risks</li>
                <li>You are responsible for ensuring you trust the naybors you designate</li>
                <li>We are not liable for actions taken by your designated key holders</li>
                <li>If you enable emergency worker sharing, verified dispatch accounts may access your information in emergencies</li>
                <li>You can disable emergency worker sharing at any time</li>
              </ul>
            </section>

            {/* Data Liberation */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Liberation</h2>
              <p className="text-muted-foreground text-sm">
                We believe your data belongs to you. You have the right to export all your data at any time
                in a portable format. You also have the right to delete your account and all associated data.
                We will never hold your data hostage.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Privacy</h2>
              <p className="text-muted-foreground text-sm">
                Your use of the service is also governed by our Privacy Policy, which is incorporated into
                these Terms by reference. Please review our Privacy Policy to understand how we collect,
                use, and protect your information.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Intellectual Property</h2>
              <p className="text-muted-foreground text-sm">
                Inner Friend Circle is open-source software. The source code is available under the terms
                of its open-source license. The Inner Friend Circle name, logo, and associated trademarks
                are the property of Lifesaver Labs.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p className="text-muted-foreground text-sm">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT
                PERMITTED BY LAW, LIFESAVER LABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                This includes, but is not limited to, damages arising from: actions taken by your designated
                key holders, emergency response delays, data loss, or service interruptions.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Indemnification</h2>
              <p className="text-muted-foreground text-sm">
                You agree to indemnify and hold harmless Lifesaver Labs and its officers, directors,
                employees, and agents from any claims, damages, or expenses arising from your use of the
                service or violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-3">12. Termination</h2>
              <p className="text-muted-foreground text-sm">
                You may terminate your account at any time by deleting it through the Settings. We may
                terminate or suspend your access to the service immediately, without prior notice, for
                conduct that we believe violates these Terms or is harmful to other users.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">13. Changes to Terms</h2>
              <p className="text-muted-foreground text-sm">
                We reserve the right to modify these Terms at any time. We will provide notice of significant
                changes by posting the new Terms on this page and updating the "last updated" date. Your
                continued use of the service after changes take effect constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold mb-3">14. Governing Law</h2>
              <p className="text-muted-foreground text-sm">
                These Terms shall be governed by and construed in accordance with applicable laws, without
                regard to conflict of law provisions. For EU users, these terms do not affect your statutory
                rights under GDPR or applicable consumer protection laws.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">15. Severability</h2>
              <p className="text-muted-foreground text-sm">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will
                be limited or eliminated to the minimum extent necessary, and the remaining provisions will
                remain in full force and effect.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-3">16. Contact</h2>
              <p className="text-muted-foreground text-sm">
                For questions about these Terms, contact us at:
              </p>
              <ul className="list-none text-sm text-muted-foreground mt-2 space-y-1">
                <li>Email: legal@lifesaverlabs.org</li>
                <li>GitHub: github.com/lifesaverlabs/inner-friend-circle</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
