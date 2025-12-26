/**
 * Account Deletion Dialog
 *
 * GDPR-compliant account deletion with:
 * - 30-day grace period before permanent deletion
 * - Option to export data before deletion
 * - Clear explanation of what will be deleted
 * - Cancellation option during grace period
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Download, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { DATA_RETENTION_DAYS } from '@/types/gdpr';

interface AccountDeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (reason?: string) => Promise<void>;
  onExportData: () => void;
  userEmail?: string;
}

type DeletionStep = 'warning' | 'confirmation' | 'scheduled';

export function AccountDeletionDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  onExportData,
  userEmail,
}: AccountDeletionDialogProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<DeletionStep>('warning');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [reason, setReason] = useState('');
  const [hasExported, setHasExported] = useState(false);
  const [understandsConsequences, setUnderstandsConsequences] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + DATA_RETENTION_DAYS);

  const handleExportAndContinue = () => {
    onExportData();
    setHasExported(true);
  };

  const handleProceedToConfirmation = () => {
    setStep('confirmation');
  };

  const handleConfirmDeletion = async () => {
    if (!understandsConsequences || (userEmail && confirmEmail !== userEmail)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirmDelete(reason || undefined);
      setStep('scheduled');
    } catch (error) {
      console.error('Failed to schedule deletion:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setStep('warning');
    setConfirmEmail('');
    setReason('');
    setHasExported(false);
    setUnderstandsConsequences(false);
    onClose();
  };

  const emailMatch = !userEmail || confirmEmail === userEmail;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'warning' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {t('gdpr.deletion.title')}
              </DialogTitle>
              <DialogDescription>
                {t('gdpr.deletion.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('gdpr.deletion.warningTitle')}</AlertTitle>
                <AlertDescription>
                  {t('gdpr.deletion.warningDescription')}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium">{t('gdpr.deletion.whatDeleted')}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('gdpr.deletion.deletedItems.profile')}</li>
                  <li>{t('gdpr.deletion.deletedItems.connections')}</li>
                  <li>{t('gdpr.deletion.deletedItems.posts')}</li>
                  <li>{t('gdpr.deletion.deletedItems.preferences')}</li>
                  <li>{t('gdpr.deletion.deletedItems.keysShared')}</li>
                </ul>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>{t('gdpr.deletion.gracePeriodTitle')}</AlertTitle>
                <AlertDescription>
                  {t('gdpr.deletion.gracePeriodDescription', { days: DATA_RETENTION_DAYS })}
                </AlertDescription>
              </Alert>

              {/* Export data before deletion */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t('gdpr.deletion.exportFirst')}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAndContinue}
                  disabled={hasExported}
                >
                  {hasExported ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />
                      {t('gdpr.deletion.exported')}
                    </>
                  ) : (
                    t('gdpr.deletion.exportData')
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                {t('actions.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleProceedToConfirmation}
              >
                {t('gdpr.deletion.continue')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                {t('gdpr.deletion.confirmTitle')}
              </DialogTitle>
              <DialogDescription>
                {t('gdpr.deletion.confirmDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {userEmail && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-email">
                    {t('gdpr.deletion.typeEmail', { email: userEmail })}
                  </Label>
                  <Input
                    id="confirm-email"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder={userEmail}
                    className={!emailMatch && confirmEmail ? 'border-destructive' : ''}
                  />
                  {!emailMatch && confirmEmail && (
                    <p className="text-sm text-destructive">
                      {t('gdpr.deletion.emailMismatch')}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="deletion-reason">
                  {t('gdpr.deletion.reasonLabel')} <span className="text-muted-foreground">({t('common.optional')})</span>
                </Label>
                <Input
                  id="deletion-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('gdpr.deletion.reasonPlaceholder')}
                />
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg bg-destructive/5">
                <Checkbox
                  id="understand-consequences"
                  checked={understandsConsequences}
                  onCheckedChange={(checked) => setUnderstandsConsequences(!!checked)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="understand-consequences"
                  className="text-sm cursor-pointer"
                >
                  {t('gdpr.deletion.understandConsequences')}
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setStep('warning')}>
                {t('actions.back')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeletion}
                disabled={!understandsConsequences || !emailMatch || isDeleting}
              >
                {isDeleting ? t('gdpr.deletion.deleting') : t('gdpr.deletion.confirmDelete')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'scheduled' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" aria-hidden="true" />
                {t('gdpr.deletion.scheduledTitle')}
              </DialogTitle>
              <DialogDescription>
                {t('gdpr.deletion.scheduledDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>{t('gdpr.deletion.scheduledDate')}</AlertTitle>
                <AlertDescription>
                  {scheduledDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground">
                {t('gdpr.deletion.cancelInfo')}
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>
                {t('actions.close')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
