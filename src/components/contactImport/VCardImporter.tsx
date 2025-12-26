/**
 * VCardImporter Component
 *
 * Imports contacts from vCard/VCF files exported from iCloud, Google Contacts, Outlook, etc.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Globe, AlertCircle } from 'lucide-react';
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
import { parseVCard, readFileAsText } from '@/lib/contactImportUtils';
import { COUNTRY_OPTIONS, detectUserCountry, getCountryFlag } from '@/lib/phoneUtils';
import type { CountryCode } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';

interface VCardImporterProps {
  onContactsParsed: (contacts: ImportableContact[]) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function VCardImporter({
  onContactsParsed,
  onError,
  disabled = false,
}: VCardImporterProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>(detectUserCountry());

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    const validExtensions = ['.vcf', '.vcard'];
    const fileName = file.name.toLowerCase();

    if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
      onError(t('contactImport.errors.invalidVCardFile'));
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const content = await readFileAsText(file);
      const contacts = parseVCard(content, defaultCountry);

      if (contacts.length === 0) {
        onError(t('contactImport.errors.noContactsFound'));
        setIsLoading(false);
        return;
      }

      onContactsParsed(contacts);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : t('contactImport.errors.parseError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [defaultCountry]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Default Country Selection */}
      <div className="space-y-2">
        <Label htmlFor="vcard-default-country" className="flex items-center gap-2">
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
          <SelectTrigger id="vcard-default-country" className="w-full">
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

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled || isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

        <p className="text-sm font-medium mb-1">
          {t('contactImport.fromVCard.dropZone')}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          {t('contactImport.fromVCard.hint')}
        </p>

        <input
          type="file"
          accept=".vcf,.vcard"
          onChange={handleFileSelect}
          className="hidden"
          id="vcard-file-input"
          disabled={disabled || isLoading}
        />
        <Button asChild variant="outline" size="sm" disabled={disabled || isLoading}>
          <label htmlFor="vcard-file-input" className="cursor-pointer">
            {isLoading ? t('contactImport.loading') : t('contactImport.selectFile')}
          </label>
        </Button>

        {selectedFile && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t('contactImport.selectedFile')}: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Export Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {t('contactImport.fromVCard.exportInstructions')}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
