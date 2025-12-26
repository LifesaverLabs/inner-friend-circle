/**
 * Privacy Settings Component
 *
 * Comprehensive privacy settings panel that allows users to:
 * - Manage cookie preferences
 * - View and withdraw consent
 * - Request data export
 * - Request account deletion
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  Cookie,
  Download,
  Trash2,
  History,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { useGDPR } from '@/hooks/useGDPR';
import { CookieConsent } from '@/types/gdpr';
import { AccountDeletionDialog } from './AccountDeletionDialog';

interface PrivacySettingsProps {
  onExportData: () => void;
  userEmail?: string;
}

export function PrivacySettings({ onExportData, userEmail }: PrivacySettingsProps) {
  const { t } = useTranslation();
  const {
    consent,
    cookieConsent,
    updateCookieConsent,
    withdrawConsent,
    hasValidConsent,
  } = useGDPR();

  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const handleCookieToggle = (category: keyof CookieConsent, enabled: boolean) => {
    if (category === 'essential') return; // Essential cannot be disabled
    updateCookieConsent({ [category]: enabled });
  };

  const handleWithdrawConsent = () => {
    withdrawConsent();
    setShowWithdrawConfirm(false);
  };

  const handleDeleteAccount = async (reason?: string) => {
    // This would be connected to Supabase or your backend
    console.log('Account deletion requested with reason:', reason);
    // For now, just log it - actual implementation would call an API
  };

  const consentDate = consent?.consentDate
    ? new Date(consent.consentDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Cookie Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" aria-hidden="true" />
            {t('gdpr.settings.cookiePreferences')}
          </CardTitle>
          <CardDescription>
            {t('gdpr.settings.cookieDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Essential Cookies */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">
                {t('gdpr.cookies.essential.title')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('gdpr.cookies.essential.description')}
              </p>
            </div>
            <Switch checked disabled aria-label={t('gdpr.cookies.essential.title')} />
          </div>

          <Separator />

          {/* Functional Cookies */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">
                {t('gdpr.cookies.functional.title')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('gdpr.cookies.functional.description')}
              </p>
            </div>
            <Switch
              checked={cookieConsent.functional}
              onCheckedChange={(checked) => handleCookieToggle('functional', checked)}
              aria-label={t('gdpr.cookies.functional.title')}
            />
          </div>

          <Separator />

          {/* Analytics Cookies */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">
                {t('gdpr.cookies.analytics.title')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('gdpr.cookies.analytics.description')}
              </p>
            </div>
            <Switch
              checked={cookieConsent.analytics}
              onCheckedChange={(checked) => handleCookieToggle('analytics', checked)}
              aria-label={t('gdpr.cookies.analytics.title')}
            />
          </div>

          <Separator />

          {/* Marketing Cookies */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">
                {t('gdpr.cookies.marketing.title')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('gdpr.cookies.marketing.description')}
              </p>
            </div>
            <Switch
              checked={cookieConsent.marketing}
              onCheckedChange={(checked) => handleCookieToggle('marketing', checked)}
              aria-label={t('gdpr.cookies.marketing.title')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Consent History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" aria-hidden="true" />
            {t('gdpr.settings.consentHistory')}
          </CardTitle>
          <CardDescription>
            {t('gdpr.settings.consentHistoryDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasValidConsent && consentDate ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('gdpr.settings.consentGiven')}</span>
                <span>{consentDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('gdpr.settings.consentVersion')}</span>
                <span>{consent?.consentVersion}</span>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('gdpr.settings.noConsent')}
              </AlertDescription>
            </Alert>
          )}

          {hasValidConsent && !showWithdrawConfirm && (
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => setShowWithdrawConfirm(true)}
            >
              {t('gdpr.settings.withdrawConsent')}
            </Button>
          )}

          {showWithdrawConfirm && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-3">
                <p>{t('gdpr.settings.withdrawWarning')}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowWithdrawConfirm(false)}
                  >
                    {t('actions.cancel')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleWithdrawConsent}
                  >
                    {t('gdpr.settings.confirmWithdraw')}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            {t('gdpr.settings.dataRights')}
          </CardTitle>
          <CardDescription>
            {t('gdpr.settings.dataRightsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Export Data */}
          <button
            onClick={onExportData}
            className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">{t('gdpr.settings.exportData')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('gdpr.settings.exportDescription')}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeletionDialog(true)}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-destructive/20 hover:bg-destructive/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <div className="text-left">
                <div className="font-medium text-destructive">
                  {t('gdpr.settings.deleteAccount')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('gdpr.settings.deleteDescription')}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Account Deletion Dialog */}
      <AccountDeletionDialog
        isOpen={showDeletionDialog}
        onClose={() => setShowDeletionDialog(false)}
        onConfirmDelete={handleDeleteAccount}
        onExportData={onExportData}
        userEmail={userEmail}
      />
    </div>
  );
}
