/**
 * MobileContactPicker Component
 *
 * Uses the Contact Picker API to import contacts from the user's phone.
 * Only available on mobile devices with browser support (Chrome 80+ Android, Safari iOS).
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Users, AlertCircle, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ImportableContact } from '@/types/contactImport';
import { isContactPickerSupported, pickContacts, isMobileDevice } from '@/lib/contactPickerApi';
import { COUNTRY_OPTIONS, detectUserCountry, getCountryFlag } from '@/lib/phoneUtils';
import type { CountryCode } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';

interface MobileContactPickerProps {
  onContactsSelected: (contacts: ImportableContact[]) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function MobileContactPicker({
  onContactsSelected,
  onError,
  disabled = false,
}: MobileContactPickerProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>(detectUserCountry());

  const isSupported = isContactPickerSupported();
  const isMobile = isMobileDevice();

  const handlePickContacts = async () => {
    if (!isSupported) {
      onError(t('contactImport.errors.notSupported'));
      return;
    }

    setIsLoading(true);

    try {
      const contacts = await pickContacts(defaultCountry);

      if (contacts.length === 0) {
        // User cancelled or selected no contacts
        setIsLoading(false);
        return;
      }

      onContactsSelected(contacts);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : t('contactImport.errors.pickerFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show unsupported message for desktop or unsupported browsers
  if (!isSupported) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {!isMobile
              ? t('contactImport.mobileOnly')
              : t('contactImport.browserNotSupported')}
          </AlertDescription>
        </Alert>

        <p className="text-sm text-muted-foreground">
          {t('contactImport.useFileImport')}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Promotion Message - Per user request: clearly communicate promotion path */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          {t('contactImport.promotionInfo.title')}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t('contactImport.promotionInfo.description')}
        </p>
        <ul className="mt-2 text-xs text-muted-foreground space-y-1">
          <li>• {t('contactImport.promotionInfo.core')}</li>
          <li>• {t('contactImport.promotionInfo.inner')}</li>
          <li>• {t('contactImport.promotionInfo.outer')}</li>
          <li>• {t('contactImport.promotionInfo.naybor')}</li>
          <li>• {t('contactImport.promotionInfo.roleModel')}</li>
        </ul>
      </div>

      {/* Default Country Selection - For handling "naked" phone numbers */}
      <div className="space-y-2">
        <Label htmlFor="default-country" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('contactImport.defaultCountry')}
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          {t('contactImport.defaultCountryHint')}
        </p>
        <Select
          value={defaultCountry}
          onValueChange={(value) => setDefaultCountry(value as CountryCode)}
        >
          <SelectTrigger id="default-country" className="w-full">
            <SelectValue>
              {getCountryFlag(defaultCountry)}{' '}
              {COUNTRY_OPTIONS.find((c) => c.code === defaultCountry)?.name || defaultCountry}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_OPTIONS.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {getCountryFlag(country.code as CountryCode)} {country.name} ({country.dialCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Import Button */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center">
          <h3 className="font-medium mb-1">{t('contactImport.fromPhone.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('contactImport.fromPhone.description')}
          </p>
        </div>

        <Button
          onClick={handlePickContacts}
          disabled={disabled || isLoading}
          size="lg"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Users className="w-4 h-4" />
              </motion.div>
              {t('contactImport.loading')}
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              {t('contactImport.fromPhone.button')}
            </>
          )}
        </Button>
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-center text-muted-foreground">
        {t('contactImport.privacyNote')}
      </p>
    </motion.div>
  );
}
