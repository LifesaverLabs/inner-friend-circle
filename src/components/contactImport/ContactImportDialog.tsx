/**
 * ContactImportDialog Component
 *
 * Main dialog for bulk importing contacts from phone, vCard, or CSV.
 * All imported contacts go to the "Acquainted Cousins" tier.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Smartphone,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Users,
  X,
} from 'lucide-react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportableContact, ImportState, DeduplicationResult } from '@/types/contactImport';
import { Friend } from '@/types/friend';
import { findDuplicates, getAcquaintedCapacity, importContacts } from '@/lib/contactImportUtils';
import { isContactPickerSupported, isMobileDevice } from '@/lib/contactPickerApi';
import { MobileContactPicker } from './MobileContactPicker';
import { VCardImporter } from './VCardImporter';
import { CsvImporter } from './CsvImporter';
import { ImportPreview } from './ImportPreview';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ContactImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingFriends: Friend[];
  onAddFriend: (friend: Omit<Friend, 'id' | 'addedAt'>) => { success: boolean; error?: string };
  onImportComplete?: (imported: number) => void;
}

type ImportTab = 'phone' | 'vcard' | 'csv';

export function ContactImportDialog({
  open,
  onOpenChange,
  existingFriends,
  onAddFriend,
  onImportComplete,
}: ContactImportDialogProps) {
  const { t } = useTranslation();
  const [importState, setImportState] = useState<ImportState>('selecting');
  const [activeTab, setActiveTab] = useState<ImportTab>(
    isContactPickerSupported() && isMobileDevice() ? 'phone' : 'vcard'
  );
  const [parsedContacts, setParsedContacts] = useState<ImportableContact[]>([]);
  const [deduplicationResult, setDeduplicationResult] = useState<DeduplicationResult | null>(null);
  const [importSource, setImportSource] = useState<ImportableContact['source']>('contact_picker');
  const [errorMessage, setErrorMessage] = useState('');
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number }>({
    imported: 0,
    skipped: 0,
  });

  const capacity = getAcquaintedCapacity(existingFriends);

  const handleContactsReceived = useCallback(
    (contacts: ImportableContact[], source: ImportableContact['source']) => {
      setParsedContacts(contacts);
      setImportSource(source);

      // Run deduplication
      const dedupResult = findDuplicates(contacts, existingFriends);
      setDeduplicationResult(dedupResult);

      setImportState('previewing');
    },
    [existingFriends]
  );

  const handleError = (error: string) => {
    setErrorMessage(error);
    setImportState('error');
  };

  const handleConfirmImport = async (contactsToImport: ImportableContact[]) => {
    setImportState('importing');

    try {
      const result = importContacts(contactsToImport, (friendData) => {
        return onAddFriend(friendData);
      });

      setImportResult({
        imported: result.imported,
        skipped: result.skipped,
      });

      if (result.imported > 0) {
        setImportState('success');
        onImportComplete?.(result.imported);
      } else if (result.errors.length > 0) {
        setErrorMessage(result.errors.join('\n'));
        setImportState('error');
      } else {
        setImportState('success');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('contactImport.errors.importFailed')
      );
      setImportState('error');
    }
  };

  const handleClose = () => {
    // Reset state
    setImportState('selecting');
    setParsedContacts([]);
    setDeduplicationResult(null);
    setErrorMessage('');
    setImportResult({ imported: 0, skipped: 0 });
    onOpenChange(false);
  };

  const handleBack = () => {
    setImportState('selecting');
    setParsedContacts([]);
    setDeduplicationResult(null);
    setErrorMessage('');
  };

  const isContactPickerAvailable = isContactPickerSupported();

  return (
    <ResponsiveDialog open={open} onOpenChange={handleClose}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {/* Selecting Source */}
          {importState === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  {t('contactImport.title')}
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  {t('contactImport.description')}
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              {/* Capacity Info */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('contactImport.acquaintedCapacity')}
                  </span>
                  <span className="font-medium">
                    {capacity.used} / {capacity.limit}
                  </span>
                </div>
                {capacity.available === 0 && (
                  <p className="mt-1 text-xs text-destructive">
                    {t('contactImport.capacityFull')}
                  </p>
                )}
              </div>

              {/* Import Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ImportTab)}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="phone" disabled={!isContactPickerAvailable}>
                    <Smartphone className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{t('contactImport.tabs.phone')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="vcard">
                    <FileText className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{t('contactImport.tabs.vcard')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="csv">
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{t('contactImport.tabs.csv')}</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <TabsContent value="phone">
                    <MobileContactPicker
                      onContactsSelected={(contacts) =>
                        handleContactsReceived(contacts, 'contact_picker')
                      }
                      onError={handleError}
                      disabled={capacity.available === 0}
                    />
                  </TabsContent>

                  <TabsContent value="vcard">
                    <VCardImporter
                      onContactsParsed={(contacts) =>
                        handleContactsReceived(contacts, 'vcard')
                      }
                      onError={handleError}
                      disabled={capacity.available === 0}
                    />
                  </TabsContent>

                  <TabsContent value="csv">
                    <CsvImporter
                      onContactsParsed={(contacts) => handleContactsReceived(contacts, 'csv')}
                      onError={handleError}
                      disabled={capacity.available === 0}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              <ResponsiveDialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose} className="h-11">
                  {t('actions.cancel')}
                </Button>
              </ResponsiveDialogFooter>
            </motion.div>
          )}

          {/* Previewing */}
          {importState === 'previewing' && deduplicationResult && (
            <motion.div
              key="previewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {t('contactImport.preview.title')}
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  {t('contactImport.preview.description')}
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              <div className="mt-4">
                <ImportPreview
                  contacts={parsedContacts}
                  deduplicationResult={deduplicationResult}
                  availableCapacity={capacity.available}
                  source={importSource}
                  onConfirm={handleConfirmImport}
                  onCancel={handleBack}
                />
              </div>
            </motion.div>
          )}

          {/* Importing */}
          {importState === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Upload className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-semibold mb-1">{t('contactImport.importing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('contactImport.importingDescription')}
              </p>
            </motion.div>
          )}

          {/* Success */}
          {importState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">{t('contactImport.success.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('contactImport.success.description', { count: importResult.imported })}
              </p>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  {t('contactImport.success.imported')}: {importResult.imported}
                </p>
                {importResult.skipped > 0 && (
                  <p>
                    {t('contactImport.success.skipped')}: {importResult.skipped}
                  </p>
                )}
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
                <p>{t('contactImport.success.promotionTip')}</p>
              </div>

              <ResponsiveDialogFooter className="mt-6 justify-center">
                <Button onClick={handleClose} className="h-11">{t('actions.done')}</Button>
              </ResponsiveDialogFooter>
            </motion.div>
          )}

          {/* Error */}
          {importState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-semibold mb-1">{t('contactImport.error.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line max-w-sm mx-auto">
                {errorMessage || t('contactImport.error.generic')}
              </p>

              <ResponsiveDialogFooter className="mt-6 justify-center gap-2">
                <Button variant="outline" onClick={handleClose} className="h-11">
                  {t('actions.cancel')}
                </Button>
                <Button onClick={handleBack} className="h-11">{t('contactImport.error.tryAgain')}</Button>
              </ResponsiveDialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
