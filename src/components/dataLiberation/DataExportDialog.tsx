import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, AlertTriangle, CheckCircle2, FileJson, X, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Friend, TierType } from '@/types/friend';
import { FeedPost, PrivacySettings, NotificationSettings } from '@/types/feed';
import { HomeEntryPreferences } from '@/types/keysShared';
import {
  exportSocialGraph,
  createExportFile,
  generateExportFilename,
} from '@/lib/dataPortability';

interface DataExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  friends: Friend[];
  posts: FeedPost[];
  privacySettings?: PrivacySettings;
  notificationSettings?: NotificationSettings;
  keysSharedPreferences?: HomeEntryPreferences;
}

interface ExportOptions {
  includeFriends: boolean;
  includePosts: boolean;
  includeSettings: boolean;
  includeContactInfo: boolean;
  includeNotes: boolean;
  includeKeysShared: boolean;
}

type ExportState = 'options' | 'exporting' | 'success' | 'error';

const TIER_LABELS: Record<TierType, string> = {
  core: 'Core',
  inner: 'Inner',
  outer: 'Outer',
  naybor: 'Naybor',
  parasocial: 'Parasocial',
  rolemodel: 'Role Model',
  acquainted: 'Acquainted',
};

export function DataExportDialog({
  open,
  onOpenChange,
  userId,
  friends,
  posts,
  privacySettings,
  notificationSettings,
  keysSharedPreferences,
}: DataExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    includeFriends: true,
    includePosts: true,
    includeSettings: true,
    includeContactInfo: true,
    includeNotes: true,
    includeKeysShared: true,
  });

  const [exportState, setExportState] = useState<ExportState>('options');
  const [exportedFilename, setExportedFilename] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate export summary
  const exportSummary = useMemo(() => {
    const friendsByTier: Partial<Record<TierType, number>> = {};
    friends.forEach((f) => {
      friendsByTier[f.tier] = (friendsByTier[f.tier] || 0) + 1;
    });

    const userPosts = posts.filter((p) => p.authorId === userId);
    const userInteractions = posts.flatMap((p) =>
      p.interactions.filter((i) => i.userId === userId)
    );

    const hasContactInfo = friends.some((f) => f.email || f.phone);
    const hasNotes = friends.some((f) => f.notes);

    // Rough size estimation
    const estimatedSizeKB = Math.round(
      (friends.length * 0.5 + userPosts.length * 1 + userInteractions.length * 0.2) * 1.5
    );

    return {
      totalFriends: friends.length,
      friendsByTier,
      totalPosts: userPosts.length,
      totalInteractions: userInteractions.length,
      hasContactInfo,
      hasNotes,
      estimatedSizeKB: Math.max(estimatedSizeKB, 1),
    };
  }, [friends, posts, userId]);

  const handleExport = async () => {
    setExportState('exporting');

    try {
      // Filter data based on options
      let filteredFriends = options.includeFriends ? [...friends] : [];

      if (!options.includeContactInfo) {
        filteredFriends = filteredFriends.map((f) => ({
          ...f,
          email: undefined,
          phone: undefined,
        }));
      }

      if (!options.includeNotes) {
        filteredFriends = filteredFriends.map((f) => ({
          ...f,
          notes: undefined,
        }));
      }

      const filteredPosts = options.includePosts ? posts : [];

      // Generate export
      const exportData = exportSocialGraph(
        userId,
        filteredFriends,
        filteredPosts,
        options.includeSettings ? privacySettings : undefined,
        options.includeSettings ? notificationSettings : undefined,
        options.includeKeysShared ? keysSharedPreferences : undefined
      );

      // Create downloadable file
      const blob = createExportFile(exportData);
      const filename = generateExportFilename(userId);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportedFilename(filename);
      setExportState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
      setExportState('error');
    }
  };

  const handleClose = () => {
    setExportState('options');
    setErrorMessage('');
    onOpenChange(false);
  };

  const handleRetry = () => {
    setExportState('options');
    setErrorMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="data-export-dialog">
        <AnimatePresence mode="wait">
          {exportState === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Export Your Data
                </DialogTitle>
                <DialogDescription>
                  Download your social graph to use elsewhere or as a backup.
                  Only your own data is included.
                </DialogDescription>
              </DialogHeader>

              {/* Export Summary */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Export Summary</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Friends</span>
                    <span className="font-medium">{exportSummary.totalFriends}</span>
                  </div>

                  {Object.entries(exportSummary.friendsByTier).map(([tier, count]) => (
                    <div key={tier} className="flex justify-between pl-4">
                      <span className="text-muted-foreground text-xs">
                        {TIER_LABELS[tier as TierType]}
                      </span>
                      <span className="text-xs">{count}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Posts</span>
                    <span className="font-medium">{exportSummary.totalPosts}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Interactions</span>
                    <span className="font-medium">{exportSummary.totalInteractions}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Estimated Size</span>
                    <Badge variant="secondary">{exportSummary.estimatedSizeKB} KB</Badge>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium">Include in Export</h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="includeFriends"
                      checked={options.includeFriends}
                      onCheckedChange={(checked) =>
                        setOptions((o) => ({ ...o, includeFriends: !!checked }))
                      }
                    />
                    <Label htmlFor="includeFriends" className="text-sm">
                      Friends and tiers
                    </Label>
                  </div>

                  {options.includeFriends && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="includeContactInfo"
                          checked={options.includeContactInfo}
                          onCheckedChange={(checked) =>
                            setOptions((o) => ({ ...o, includeContactInfo: !!checked }))
                          }
                        />
                        <Label htmlFor="includeContactInfo" className="text-sm text-muted-foreground">
                          Email & phone numbers
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="includeNotes"
                          checked={options.includeNotes}
                          onCheckedChange={(checked) =>
                            setOptions((o) => ({ ...o, includeNotes: !!checked }))
                          }
                        />
                        <Label htmlFor="includeNotes" className="text-sm text-muted-foreground">
                          Private notes
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="includePosts"
                      checked={options.includePosts}
                      onCheckedChange={(checked) =>
                        setOptions((o) => ({ ...o, includePosts: !!checked }))
                      }
                    />
                    <Label htmlFor="includePosts" className="text-sm">
                      Your posts and reactions
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="includeSettings"
                      checked={options.includeSettings}
                      onCheckedChange={(checked) =>
                        setOptions((o) => ({ ...o, includeSettings: !!checked }))
                      }
                    />
                    <Label htmlFor="includeSettings" className="text-sm">
                      Privacy & notification settings
                    </Label>
                  </div>

                  {keysSharedPreferences && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="includeKeysShared"
                        checked={options.includeKeysShared}
                        onCheckedChange={(checked) =>
                          setOptions((o) => ({ ...o, includeKeysShared: !!checked }))
                        }
                      />
                      <Label htmlFor="includeKeysShared" className="text-sm">
                        Keys Shared preferences (emergency access)
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Sensitive Data Warning */}
              {(options.includeContactInfo && exportSummary.hasContactInfo) || (options.includeKeysShared && keysSharedPreferences) ? (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-700 dark:text-yellow-500">
                    <p className="font-medium mb-1">Sensitive data included:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {options.includeContactInfo && exportSummary.hasContactInfo && (
                        <li>Personal contact information (email, phone)</li>
                      )}
                      {options.includeKeysShared && keysSharedPreferences && (
                        <li>Home security info (address, key holders, entry codes)</li>
                      )}
                    </ul>
                    <p className="mt-1">Store the exported file securely.</p>
                  </div>
                </div>
              ) : null}

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Export
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {exportState === 'exporting' && (
            <motion.div
              key="exporting"
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
                  <FileJson className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground">Preparing your export...</p>
            </motion.div>
          )}

          {exportState === 'success' && (
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
              <h3 className="font-semibold mb-1">Export Complete</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your data has been downloaded successfully.
              </p>
              <Badge variant="secondary" className="font-mono text-xs">
                {exportedFilename}
              </Badge>

              <DialogFooter className="mt-6 justify-center">
                <Button onClick={handleClose}>Done</Button>
              </DialogFooter>
            </motion.div>
          )}

          {exportState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-1">Export Failed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {errorMessage || 'Unable to export your data. Please try again.'}
              </p>

              <DialogFooter className="mt-6 justify-center gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleRetry}>Try Again</Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
