/**
 * Age Verification Dialog
 *
 * GDPR Article 8 compliant age verification for users under 16.
 * Collects only birth year (minimal data) and handles parental consent requirements.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { MINIMUM_AGE_WITHOUT_CONSENT, AgeVerification } from '@/types/gdpr';

interface AgeVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verification: AgeVerification) => void;
}

export function AgeVerificationDialog({
  isOpen,
  onClose,
  onVerified,
}: AgeVerificationDialogProps) {
  const { t } = useTranslation();
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [showMinorWarning, setShowMinorWarning] = useState(false);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120; // Reasonable minimum
  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, i) => currentYear - i
  );

  const calculateAge = (year: number): number => {
    return currentYear - year;
  };

  const isMinor = birthYear ? calculateAge(birthYear) < MINIMUM_AGE_WITHOUT_CONSENT : false;

  const handleYearChange = (yearString: string) => {
    const year = parseInt(yearString, 10);
    setBirthYear(year);
    if (calculateAge(year) < MINIMUM_AGE_WITHOUT_CONSENT) {
      setShowMinorWarning(true);
    } else {
      setShowMinorWarning(false);
    }
  };

  const handleVerify = () => {
    if (!birthYear) return;

    const age = calculateAge(birthYear);
    const verification: AgeVerification = {
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      birthYear,
      isMinor: age < MINIMUM_AGE_WITHOUT_CONSENT,
      parentalConsentRequired: age < MINIMUM_AGE_WITHOUT_CONSENT,
      parentalConsentGiven: false,
    };

    onVerified(verification);
  };

  const handleClose = () => {
    setBirthYear(null);
    setShowMinorWarning(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            {t('gdpr.age.title')}
          </DialogTitle>
          <DialogDescription>
            {t('gdpr.age.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{t('gdpr.age.whyTitle')}</AlertTitle>
            <AlertDescription>
              {t('gdpr.age.whyDescription', { age: MINIMUM_AGE_WITHOUT_CONSENT })}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="birth-year">{t('gdpr.age.birthYearLabel')}</Label>
            <Select
              value={birthYear?.toString() ?? ''}
              onValueChange={handleYearChange}
            >
              <SelectTrigger id="birth-year">
                <SelectValue placeholder={t('gdpr.age.selectYear')} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('gdpr.age.privacyNote')}
            </p>
          </div>

          {showMinorWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('gdpr.age.minorTitle')}</AlertTitle>
              <AlertDescription>
                {t('gdpr.age.minorDescription', { age: MINIMUM_AGE_WITHOUT_CONSENT })}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={handleVerify}
            disabled={!birthYear || isMinor}
          >
            {isMinor ? t('gdpr.age.parentalRequired') : t('gdpr.age.verify')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
