import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactMethodsManager } from '@/components/ContactMethodsManager';
import { ParasocialDashboard } from '@/components/ParasocialDashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Phone, AtSign, Star, Globe, Lock, Copy, ExternalLink } from 'lucide-react';

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  userId,
}: ProfileSettingsDialogProps) {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isParasocialPersonality, setIsParasocialPersonality] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [handleError, setHandleError] = useState('');

  useEffect(() => {
    if (open && userId) {
      fetchProfile();
    }
  }, [open, userId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, user_handle, is_parasocial_personality, is_public')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDisplayName(data.display_name || '');
        setUserHandle(data.user_handle || '');
        setIsParasocialPersonality(data.is_parasocial_personality || false);
        setIsPublic(data.is_public ?? true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateHandle = async (handle: string): Promise<string | null> => {
    if (!handle) return null;

    // Format check
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(handle)) {
      return 'Handle must be 3-30 characters, letters, numbers, and underscores only';
    }

    // Check if handle is already taken by another user
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_handle', handle)
      .maybeSingle();

    if (error) {
      console.error('Error checking handle:', error);
      return 'Error checking handle availability';
    }

    if (data && data.user_id !== userId) {
      return 'This handle is already taken';
    }

    // Check appropriateness using the database function
    const { data: isAppropriate, error: fnError } = await supabase
      .rpc('is_handle_appropriate', { handle });

    if (fnError) {
      console.error('Error checking handle appropriateness:', fnError);
      return 'Error validating handle';
    }

    if (!isAppropriate) {
      return 'This handle contains inappropriate language';
    }

    return null;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setHandleError('');

    try {
      // Validate handle if provided
      if (userHandle) {
        const error = await validateHandle(userHandle);
        if (error) {
          setHandleError(error);
          setIsSaving(false);
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          display_name: displayName.trim() || null,
          user_handle: userHandle.trim() || null,
          is_parasocial_personality: isParasocialPersonality,
          is_public: isPublic,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success(t('profileSettings.toasts.updated'));
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.message?.includes('user_handle_appropriate')) {
        setHandleError(t('profileSettings.errors.inappropriate'));
      } else if (error.message?.includes('user_handle_format')) {
        setHandleError(t('profileSettings.handleHint'));
      } else if (error.code === '23505') {
        setHandleError(t('profileSettings.errors.handleTaken'));
      } else {
        toast.error(t('profileSettings.toasts.updateFailed'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('profileSettings.title')}</DialogTitle>
          <DialogDescription>
            {t('profileSettings.description')}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                {t('profileSettings.tabs.profile')}
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="w-4 h-4 mr-2" />
                {t('profileSettings.tabs.contact')}
              </TabsTrigger>
              <TabsTrigger value="creator">
                <Star className="w-4 h-4 mr-2" />
                {t('profileSettings.tabs.creator')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('profileSettings.displayName')}</Label>
                <Input
                  id="displayName"
                  placeholder={t('profileSettings.displayNamePlaceholder')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userHandle">
                  <span className="flex items-center gap-1">
                    <AtSign className="w-4 h-4" />
                    {t('profileSettings.handle')}
                  </span>
                </Label>
                <Input
                  id="userHandle"
                  placeholder={t('profileSettings.handlePlaceholder')}
                  value={userHandle}
                  onChange={(e) => {
                    setUserHandle(e.target.value.toLowerCase());
                    setHandleError('');
                  }}
                  className={handleError ? 'border-destructive' : ''}
                />
                {handleError && (
                  <p className="text-sm text-destructive">{handleError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('profileSettings.handleHint')}
                </p>
              </div>

              {/* Public Profile Link */}
              {userHandle && (
                <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                  <Label className="text-sm font-medium">{t('profileSettings.publicProfile')}</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background px-3 py-2 rounded border truncate">
                      {window.location.origin}/u/{userHandle}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/u/${userHandle}`);
                        toast.success(t('profileSettings.toasts.linkCopied'));
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/u/${userHandle}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label htmlFor="public-toggle" className="text-sm font-medium">
                      {isPublic ? t('profileSettings.publicProfileLabel') : t('profileSettings.privateProfileLabel')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {isPublic
                        ? t('profileSettings.publicDescription')
                        : t('profileSettings.privateDescription')
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  id="public-toggle"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t('actions.saving') : t('profileSettings.saveProfile')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <ContactMethodsManager userId={userId} />
            </TabsContent>

            <TabsContent value="creator" className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-1">
                  <Label htmlFor="parasocial-toggle" className="text-base font-medium">
                    {t('profileSettings.parasocialMode')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('profileSettings.parasocialModeDescription')}
                  </p>
                </div>
                <Switch
                  id="parasocial-toggle"
                  checked={isParasocialPersonality}
                  onCheckedChange={(checked) => setIsParasocialPersonality(checked)}
                />
              </div>

              {isParasocialPersonality && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('profileSettings.parasocialModeHint')}
                  </p>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? t('actions.saving') : t('profileSettings.saveSettings')}
                    </Button>
                  </div>
                </div>
              )}

              {isParasocialPersonality && (
                <div className="pt-4 border-t">
                  <ParasocialDashboard userId={userId} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
