/**
 * ImportPreview Component
 *
 * Shows a preview of contacts to be imported with deduplication info.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ImportableContact, DeduplicationResult, ImportSource } from '@/types/contactImport';
import { useTranslation } from 'react-i18next';

interface ImportPreviewProps {
  contacts: ImportableContact[];
  deduplicationResult: DeduplicationResult;
  availableCapacity: number;
  source: ImportSource;
  onConfirm: (contactsToImport: ImportableContact[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const SOURCE_LABELS: Record<ImportSource, string> = {
  contact_picker: 'Phone Contacts',
  vcard: 'vCard File',
  csv: 'CSV File',
};

export function ImportPreview({
  contacts,
  deduplicationResult,
  availableCapacity,
  source,
  onConfirm,
  onCancel,
  isLoading = false,
}: ImportPreviewProps) {
  const { t } = useTranslation();

  const { unique, duplicates } = deduplicationResult;
  const willExceedCapacity = unique.length > availableCapacity;
  const contactsToImport = willExceedCapacity
    ? unique.slice(0, availableCapacity)
    : unique;

  const stats = useMemo(
    () => ({
      total: contacts.length,
      unique: unique.length,
      duplicates: duplicates.length,
      toImport: contactsToImport.length,
      skipped: unique.length - contactsToImport.length,
    }),
    [contacts, unique, duplicates, contactsToImport]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">
            {t('contactImport.preview.total')}
          </div>
        </div>
        <div className="p-3 bg-green-500/10 rounded-lg text-center">
          <UserCheck className="w-5 h-5 mx-auto mb-1 text-green-600" />
          <div className="text-2xl font-bold text-green-600">{stats.toImport}</div>
          <div className="text-xs text-muted-foreground">
            {t('contactImport.preview.toImport')}
          </div>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
          <UserX className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-600">{stats.duplicates}</div>
          <div className="text-xs text-muted-foreground">
            {t('contactImport.preview.duplicates')}
          </div>
        </div>
      </div>

      {/* Source Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t('contactImport.preview.source')}:</span>
        <Badge variant="outline">{SOURCE_LABELS[source]}</Badge>
      </div>

      {/* Capacity Warning */}
      {willExceedCapacity && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('contactImport.preview.capacityWarning', {
              available: availableCapacity,
              total: unique.length,
              skipped: stats.skipped,
            })}
          </AlertDescription>
        </Alert>
      )}

      {/* Duplicates Info */}
      {duplicates.length > 0 && (
        <Alert>
          <UserX className="h-4 w-4" />
          <AlertDescription>
            {t('contactImport.preview.duplicatesInfo', { count: duplicates.length })}
          </AlertDescription>
        </Alert>
      )}

      {/* Promotion Reminder */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{t('contactImport.preview.promotionReminder')}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('contactImport.preview.promotionReminderDescription')}
        </p>
      </div>

      {/* Contact List Preview */}
      <div>
        <h4 className="text-sm font-medium mb-2">
          {t('contactImport.preview.contactsToImport')} ({contactsToImport.length})
        </h4>
        <ScrollArea className="h-[200px] border rounded-lg p-2">
          {contactsToImport.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('contactImport.preview.noContactsToImport')}
            </p>
          ) : (
            <div className="space-y-2">
              {contactsToImport.slice(0, 50).map((contact, index) => (
                <div
                  key={`${contact.name}-${contact.phone || contact.email || index}`}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded"
                >
                  <div>
                    <div className="font-medium text-sm">{contact.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      )}
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {contactsToImport.length > 50 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  {t('contactImport.preview.andMore', { count: contactsToImport.length - 50 })}
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Duplicates List (if any) */}
      {duplicates.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-yellow-600">
            {t('contactImport.preview.duplicatesSkipped')} ({duplicates.length})
          </h4>
          <ScrollArea className="h-[100px] border border-yellow-200 rounded-lg p-2 bg-yellow-50/50 dark:bg-yellow-900/10">
            <div className="space-y-1">
              {duplicates.slice(0, 20).map((dup, index) => (
                <div
                  key={`dup-${dup.imported.name}-${index}`}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{dup.imported.name}</span>
                  <span className="text-muted-foreground">
                    {t('contactImport.preview.matchedWith', {
                      name: dup.existingFriendName,
                      by: dup.matchedBy,
                    })}
                  </span>
                </div>
              ))}
              {duplicates.length > 20 && (
                <p className="text-xs text-muted-foreground text-center">
                  {t('contactImport.preview.andMoreDuplicates', { count: duplicates.length - 20 })}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('actions.cancel')}
        </Button>
        <Button
          onClick={() => onConfirm(contactsToImport)}
          disabled={isLoading || contactsToImport.length === 0}
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
              {t('contactImport.importing')}
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              {t('contactImport.preview.importButton', { count: contactsToImport.length })}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
