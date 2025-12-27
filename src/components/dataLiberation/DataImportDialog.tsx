import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TierType } from '@/types/friend';
import { ExportableSocialGraph } from '@/types/feed';
import { importSocialGraph, ImportValidationResult } from '@/lib/dataPortability';

interface DataImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: ExportableSocialGraph, options: ImportOptions) => void;
  existingFriendCount: number;
}

interface ImportOptions {
  mergeStrategy: 'keep_existing' | 'overwrite' | 'keep_both';
  importFriends: boolean;
  importPosts: boolean;
  importSettings: boolean;
}

interface ImportPreview {
  version: string;
  friendsToImport: number;
  friendsByTier: Partial<Record<TierType, number>>;
  postsToImport: number;
  interactionsToImport: number;
  hasSettings: boolean;
}

type ImportState = 'select' | 'preview' | 'importing' | 'success' | 'error';

export function DataImportDialog({
  open,
  onOpenChange,
  onImport,
  existingFriendCount,
}: DataImportDialogProps) {
  const { t } = useTranslation();
  const [importState, setImportState] = useState<ImportState>('select');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importData, setImportData] = useState<ExportableSocialGraph | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState<ImportOptions>({
    mergeStrategy: 'keep_existing',
    importFriends: true,
    importPosts: true,
    importSettings: false,
  });

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
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMessage(t('dataImport.errors.selectJson'));
      setImportState('error');
      return;
    }

    setSelectedFile(file);

    try {
      const text = await file.text();
      const result = importSocialGraph(text);

      setValidationResult({
        valid: result.success,
        errors: result.errors,
        warnings: result.warnings,
      });

      if (result.success && result.data) {
        setImportData(result.data);

        // Build preview
        const friendsByTier: Partial<Record<TierType, number>> = {};
        result.data.friends.forEach((f) => {
          friendsByTier[f.tier] = (friendsByTier[f.tier] || 0) + 1;
        });

        setPreview({
          version: result.data.version,
          friendsToImport: result.data.friends.length,
          friendsByTier,
          postsToImport: result.data.posts.length,
          interactionsToImport: result.data.interactions.length,
          hasSettings: !!result.data.settings,
        });

        setImportState('preview');
      } else {
        setErrorMessage(result.errors.join('\n'));
        setImportState('error');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t('dataImport.errors.readFailed'));
      setImportState('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!importData) return;

    setImportState('importing');

    // Simulate async operation
    setTimeout(() => {
      try {
        onImport(importData, options);
        setImportState('success');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : t('dataImport.errors.importFailed'));
        setImportState('error');
      }
    }, 500);
  };

  const handleClose = () => {
    setImportState('select');
    setSelectedFile(null);
    setValidationResult(null);
    setImportData(null);
    setPreview(null);
    setErrorMessage('');
    onOpenChange(false);
  };

  const handleBack = () => {
    setImportState('select');
    setSelectedFile(null);
    setValidationResult(null);
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="data-import-dialog">
        <AnimatePresence mode="wait">
          {importState === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  {t('dataImport.title')}
                </DialogTitle>
                <DialogDescription>
                  {t('dataImport.description')}
                </DialogDescription>
              </DialogHeader>

              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <FileJson className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {t('dataImport.dropZone')}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t('dataImport.orBrowse')}
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="file-input" className="cursor-pointer">
                    {t('dataImport.selectFile')}
                  </label>
                </Button>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg flex gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {t('dataImport.compatibilityNote')}
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose}>
                  {t('actions.cancel')}
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {importState === 'preview' && preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>{t('dataImport.previewTitle')}</DialogTitle>
                <DialogDescription>
                  {t('dataImport.previewDescription', { filename: selectedFile?.name })}
                </DialogDescription>
              </DialogHeader>

              {/* Import Summary */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">v{preview.version}</Badge>
                  {validationResult?.warnings.length ? (
                    <Badge variant="outline" className="text-yellow-600">
                      {t('dataImport.warningsCount', { count: validationResult.warnings.length })}
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('dataImport.friendsToImport')}</span>
                    <span className="font-medium">{preview.friendsToImport}</span>
                  </div>

                  {Object.entries(preview.friendsByTier).map(([tier, count]) => (
                    <div key={tier} className="flex justify-between pl-4">
                      <span className="text-muted-foreground text-xs">
                        {t(`tiers.${tier}`)}
                      </span>
                      <span className="text-xs">{count}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('dataImport.posts')}</span>
                    <span className="font-medium">{preview.postsToImport}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('dataImport.interactions')}</span>
                    <span className="font-medium">{preview.interactionsToImport}</span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {validationResult?.warnings.length ? (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                      {t('dataImport.warnings')}
                    </span>
                  </div>
                  <ul className="text-xs text-yellow-700 dark:text-yellow-500 space-y-1 pl-6">
                    {validationResult.warnings.slice(0, 3).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                    {validationResult.warnings.length > 3 && (
                      <li>{t('dataImport.andMore', { count: validationResult.warnings.length - 3 })}</li>
                    )}
                  </ul>
                </div>
              ) : null}

              {/* Merge Strategy */}
              {existingFriendCount > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-3">
                    {t('dataImport.duplicatesQuestion')}
                  </h4>
                  <RadioGroup
                    value={options.mergeStrategy}
                    onValueChange={(v) =>
                      setOptions((o) => ({
                        ...o,
                        mergeStrategy: v as ImportOptions['mergeStrategy'],
                      }))
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="keep_existing" id="keep_existing" />
                      <Label htmlFor="keep_existing" className="text-sm">
                        {t('dataImport.keepExisting')}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="overwrite" id="overwrite" />
                      <Label htmlFor="overwrite" className="text-sm">
                        {t('dataImport.overwrite')}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="keep_both" id="keep_both" />
                      <Label htmlFor="keep_both" className="text-sm">
                        {t('dataImport.keepBoth')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleBack}>
                  {t('actions.back')}
                </Button>
                <Button onClick={handleImport} className="gap-2">
                  <Upload className="w-4 h-4" />
                  {t('dataImport.importButton')}
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {importState === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Upload className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground">{t('dataImport.importing')}</p>
            </motion.div>
          )}

          {importState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">{t('dataImport.successTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('dataImport.successDescription')}
              </p>

              {preview && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{t('dataImport.friendsImported', { count: preview.friendsToImport })}</p>
                  {preview.postsToImport > 0 && (
                    <p>{t('dataImport.postsImported', { count: preview.postsToImport })}</p>
                  )}
                </div>
              )}

              <DialogFooter className="mt-6 justify-center">
                <Button onClick={handleClose}>{t('actions.done')}</Button>
              </DialogFooter>
            </motion.div>
          )}

          {importState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-1">{t('dataImport.errorTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                {errorMessage || t('dataImport.errors.generic')}
              </p>

              <DialogFooter className="mt-6 justify-center gap-2">
                <Button variant="outline" onClick={handleClose}>
                  {t('actions.cancel')}
                </Button>
                <Button onClick={handleBack}>{t('dataImport.tryAnother')}</Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
