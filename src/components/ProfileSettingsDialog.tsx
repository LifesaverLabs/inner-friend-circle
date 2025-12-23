import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactMethodsManager } from '@/components/ContactMethodsManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Phone, AtSign } from 'lucide-react';

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
  const [displayName, setDisplayName] = useState('');
  const [userHandle, setUserHandle] = useState('');
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
        .select('display_name, user_handle')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDisplayName(data.display_name || '');
        setUserHandle(data.user_handle || '');
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
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Profile updated');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.message?.includes('user_handle_appropriate')) {
        setHandleError('This handle contains inappropriate language');
      } else if (error.message?.includes('user_handle_format')) {
        setHandleError('Handle must be 3-30 characters, letters, numbers, and underscores only');
      } else if (error.code === '23505') {
        setHandleError('This handle is already taken');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Manage your profile and contact preferences
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact Methods
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userHandle">
                  <span className="flex items-center gap-1">
                    <AtSign className="w-4 h-4" />
                    Handle
                  </span>
                </Label>
                <Input
                  id="userHandle"
                  placeholder="your_handle"
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
                  3-30 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <ContactMethodsManager userId={userId} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
