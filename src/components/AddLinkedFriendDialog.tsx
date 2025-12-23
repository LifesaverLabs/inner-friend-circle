import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, AtSign, Phone, Mail, Link2, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { CircleTier } from '@/hooks/useFriendConnections';
import { TIER_INFO, TierType } from '@/types/friend';

const SERVICE_TYPES = [
  { value: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+1 555-123-4567' },
  { value: 'email', label: 'Email Address', icon: Mail, placeholder: 'friend@example.com' },
  { value: 'handle', label: 'User Handle', icon: AtSign, placeholder: 'their_handle' },
  { value: 'signal', label: 'Signal', icon: Phone, placeholder: '+1 555-123-4567' },
  { value: 'telegram', label: 'Telegram', icon: AtSign, placeholder: '@username' },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone, placeholder: '+1 555-123-4567' },
  { value: 'facetime', label: 'FaceTime', icon: Phone, placeholder: 'email or phone' },
];

interface FoundUser {
  userId: string;
  contactMethodId: string | null;
  displayName: string | null;
  userHandle: string | null;
  avatarUrl: string | null;
}

interface AddLinkedFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: CircleTier;
  onAddConnection: (
    targetUserId: string,
    circleTier: CircleTier,
    matchedContactMethodId: string | null,
    discloseCircle: boolean
  ) => Promise<{ success: boolean; error?: string }>;
}

export function AddLinkedFriendDialog({
  open,
  onOpenChange,
  tier,
  onAddConnection,
}: AddLinkedFriendDialogProps) {
  const [serviceType, setServiceType] = useState('handle');
  const [contactIdentifier, setContactIdentifier] = useState('');
  const [discloseCircle, setDiscloseCircle] = useState(true);
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tierInfo = TIER_INFO[tier as TierType];
  const selectedService = SERVICE_TYPES.find(s => s.value === serviceType);

  const resetForm = () => {
    setContactIdentifier('');
    setFoundUser(null);
    setSearchError(null);
    setSearching(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSearch = async () => {
    if (!contactIdentifier.trim()) return;

    setSearching(true);
    setFoundUser(null);
    setSearchError(null);

    try {
      if (serviceType === 'handle') {
        // Search by user handle
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, display_name, user_handle, avatar_url')
          .eq('user_handle', contactIdentifier.trim().replace('@', ''))
          .single();

        if (error || !data) {
          setSearchError('No user found with that handle. Make sure they have an account and have set their handle.');
          return;
        }

        setFoundUser({
          userId: data.user_id,
          contactMethodId: null,
          displayName: data.display_name,
          userHandle: data.user_handle,
          avatarUrl: data.avatar_url,
        });
      } else {
        // Search by contact method
        const { data, error } = await supabase
          .from('contact_methods')
          .select('id, user_id')
          .eq('service_type', serviceType)
          .eq('contact_identifier', contactIdentifier.trim())
          .single();

        if (error || !data) {
          setSearchError(`No user found with that ${selectedService?.label.toLowerCase() || 'contact info'}. They may not have added it to their profile yet.`);
          return;
        }

        // Get profile info
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, user_handle, avatar_url')
          .eq('user_id', data.user_id)
          .single();

        setFoundUser({
          userId: data.user_id,
          contactMethodId: data.id,
          displayName: profile?.display_name || null,
          userHandle: profile?.user_handle || null,
          avatarUrl: profile?.avatar_url || null,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!foundUser) return;

    setSubmitting(true);
    const result = await onAddConnection(
      foundUser.userId,
      tier,
      foundUser.contactMethodId,
      discloseCircle
    );

    if (result.success) {
      handleClose();
    } else {
      setSearchError(result.error || 'Failed to send connection request');
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Link2 className="h-5 w-5" />
            Add Linked Friend to {tierInfo.name}
          </DialogTitle>
          <DialogDescription>
            Find someone by their contact info to request a connection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Service Type Selection */}
          <div className="space-y-2">
            <Label>Find by</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    <span className="flex items-center gap-2">
                      <service.icon className="h-4 w-4" />
                      {service.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Identifier Input */}
          <div className="space-y-2">
            <Label htmlFor="contact-id">
              {selectedService?.label || 'Contact Info'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="contact-id"
                value={contactIdentifier}
                onChange={(e) => setContactIdentifier(e.target.value)}
                placeholder={selectedService?.placeholder || 'Enter contact info'}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={!contactIdentifier.trim() || searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {serviceType === 'handle' 
                ? 'Enter their username exactly as they set it'
                : `Enter their ${selectedService?.label.toLowerCase()} exactly as they registered it`
              }
            </p>
          </div>

          {/* Search Results */}
          <AnimatePresence mode="wait">
            {searchError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {searchError}
              </motion.div>
            )}

            {foundUser && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {/* Found User Card */}
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={foundUser.avatarUrl || undefined} />
                    <AvatarFallback>
                      {foundUser.displayName?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {foundUser.displayName || 'User Found'}
                    </p>
                    {foundUser.userHandle && (
                      <p className="text-sm text-muted-foreground">
                        @{foundUser.userHandle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Privacy Options */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    {discloseCircle ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Show circle level</p>
                      <p className="text-xs text-muted-foreground">
                        {discloseCircle 
                          ? `They'll see you added them as ${tierInfo.name}`
                          : "They won't see which circle you added them to"
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={discloseCircle}
                    onCheckedChange={setDiscloseCircle}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Link2 className="h-4 w-4 mr-2" />
                    )}
                    Send Connection Request
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  They'll see only the contact info you used to find them until they accept.
                  Once accepted, you'll both see each other's full contact methods.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
