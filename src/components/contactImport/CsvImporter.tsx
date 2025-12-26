/**
 * CsvImporter Component
 *
 * Imports contacts from CSV files with column mapping support.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Upload, Globe, AlertCircle, Columns } from 'lucide-react';
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
import { ImportableContact, CsvColumnMapping } from '@/types/contactImport';
import { parseCsv, detectCsvColumns, readFileAsText } from '@/lib/contactImportUtils';
import { COUNTRY_OPTIONS, detectUserCountry, getCountryFlag } from '@/lib/phoneUtils';
import type { CountryCode } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';

interface CsvImporterProps {
  onContactsParsed: (contacts: ImportableContact[]) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

type ImportStep = 'upload' | 'mapping' | 'parsing';

export function CsvImporter({
  onContactsParsed,
  onError,
  disabled = false,
}: CsvImporterProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<ImportStep>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<CsvColumnMapping>({});
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
    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith('.csv') && file.type !== 'text/csv') {
      onError(t('contactImport.errors.invalidCsvFile'));
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const content = await readFileAsText(file);
      setCsvContent(content);

      // Parse just to get headers and auto-detected mapping
      const result = parseCsv(content, undefined, defaultCountry);
      setHeaders(result.headers);
      setMapping(result.detectedMapping);
      setStep('mapping');
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

  const handleConfirmMapping = () => {
    setIsLoading(true);
    setStep('parsing');

    try {
      const result = parseCsv(csvContent, mapping, defaultCountry);

      if (result.contacts.length === 0) {
        onError(t('contactImport.errors.noContactsFound'));
        setStep('mapping');
        setIsLoading(false);
        return;
      }

      onContactsParsed(result.contacts);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : t('contactImport.errors.parseError')
      );
      setStep('mapping');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('upload');
    setSelectedFile(null);
    setCsvContent('');
    setHeaders([]);
    setMapping({});
  };

  const updateMapping = (field: keyof CsvColumnMapping, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: value === '_none_' ? undefined : value,
    }));
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Default Country Selection */}
        <div className="space-y-2">
          <Label htmlFor="csv-default-country" className="flex items-center gap-2">
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
            <SelectTrigger id="csv-default-country" className="w-full">
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
          <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

          <p className="text-sm font-medium mb-1">
            {t('contactImport.fromCsv.dropZone')}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {t('contactImport.fromCsv.hint')}
          </p>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-file-input"
            disabled={disabled || isLoading}
          />
          <Button asChild variant="outline" size="sm" disabled={disabled || isLoading}>
            <label htmlFor="csv-file-input" className="cursor-pointer">
              {isLoading ? t('contactImport.loading') : t('contactImport.selectFile')}
            </label>
          </Button>
        </div>
      </motion.div>
    );
  }

  // Mapping Step
  if (step === 'mapping') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Columns className="h-4 w-4 text-primary" />
          <h4 className="font-medium">{t('contactImport.fromCsv.mapColumns')}</h4>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('contactImport.fromCsv.mapColumnsDescription')}
        </p>

        {selectedFile && (
          <p className="text-xs text-muted-foreground">
            {t('contactImport.selectedFile')}: {selectedFile.name} ({headers.length} {t('contactImport.columns')})
          </p>
        )}

        <div className="space-y-4">
          {/* Name Column */}
          <div className="space-y-1">
            <Label htmlFor="name-column">{t('contactImport.columnMapping.name')}</Label>
            <Select
              value={mapping.nameColumn || '_none_'}
              onValueChange={(value) => updateMapping('nameColumn', value)}
            >
              <SelectTrigger id="name-column">
                <SelectValue placeholder={t('contactImport.columnMapping.selectColumn')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none_">{t('contactImport.columnMapping.none')}</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* First Name Column (alternative) */}
          {!mapping.nameColumn && (
            <>
              <div className="text-xs text-muted-foreground text-center">
                {t('contactImport.columnMapping.orSeparate')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="first-name-column">{t('contactImport.columnMapping.firstName')}</Label>
                  <Select
                    value={mapping.firstNameColumn || '_none_'}
                    onValueChange={(value) => updateMapping('firstNameColumn', value)}
                  >
                    <SelectTrigger id="first-name-column">
                      <SelectValue placeholder={t('contactImport.columnMapping.selectColumn')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_">{t('contactImport.columnMapping.none')}</SelectItem>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last-name-column">{t('contactImport.columnMapping.lastName')}</Label>
                  <Select
                    value={mapping.lastNameColumn || '_none_'}
                    onValueChange={(value) => updateMapping('lastNameColumn', value)}
                  >
                    <SelectTrigger id="last-name-column">
                      <SelectValue placeholder={t('contactImport.columnMapping.selectColumn')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_">{t('contactImport.columnMapping.none')}</SelectItem>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Phone Column */}
          <div className="space-y-1">
            <Label htmlFor="phone-column">{t('contactImport.columnMapping.phone')}</Label>
            <Select
              value={mapping.phoneColumn || '_none_'}
              onValueChange={(value) => updateMapping('phoneColumn', value)}
            >
              <SelectTrigger id="phone-column">
                <SelectValue placeholder={t('contactImport.columnMapping.selectColumn')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none_">{t('contactImport.columnMapping.none')}</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email Column */}
          <div className="space-y-1">
            <Label htmlFor="email-column">{t('contactImport.columnMapping.email')}</Label>
            <Select
              value={mapping.emailColumn || '_none_'}
              onValueChange={(value) => updateMapping('emailColumn', value)}
            >
              <SelectTrigger id="email-column">
                <SelectValue placeholder={t('contactImport.columnMapping.selectColumn')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none_">{t('contactImport.columnMapping.none')}</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Validation */}
        {!mapping.nameColumn && !mapping.firstNameColumn && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t('contactImport.errors.nameColumnRequired')}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            {t('actions.back')}
          </Button>
          <Button
            onClick={handleConfirmMapping}
            disabled={!mapping.nameColumn && !mapping.firstNameColumn}
          >
            {t('contactImport.fromCsv.importButton')}
          </Button>
        </div>
      </motion.div>
    );
  }

  // Parsing step (loading state)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 text-center"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <FileSpreadsheet className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      <p className="text-sm text-muted-foreground">{t('contactImport.parsing')}</p>
    </motion.div>
  );
}
