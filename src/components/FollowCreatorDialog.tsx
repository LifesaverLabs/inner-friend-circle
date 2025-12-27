import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Star, Loader2, CheckCircle2, AlertCircle, Link2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useParasocial } from '@/hooks/useParasocial';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FoundCreator {
  user_id: string;
  display_name: string | null;
  user_handle: string | null;
  avatar_url: string | null;
  is_parasocial_personality: boolean;
}

interface FollowCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function FollowCreatorDialog({
  open,
  onOpenChange,
  userId,
}: FollowCreatorDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { followParasocial, refetch } = useParasocial(userId);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<FoundCreator[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [followingId, setFollowingId] = useState<string | null>(null);

  const resetForm = () => {
    setSearchQuery('');
    setResults([]);
    setSearchError(null);
    setSearching(false);
    setFollowingId(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setResults([]);
    setSearchError(null);

    try {
      const query = searchQuery.trim().replace('@', '').toLowerCase();
      
      // Search for parasocial personalities by handle or display name
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, user_handle, avatar_url, is_parasocial_personality')
        .eq('is_parasocial_personality', true)
        .eq('is_public', true)
        .or(`user_handle.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        setSearchError(t('followCreator.errors.searching'));
        return;
      }

      if (!data || data.length === 0) {
        setSearchError(t('followCreator.errors.noCreators'));
        return;
      }

      // Filter out the current user
      const filtered = data.filter(p => p.user_id !== userId);
      if (filtered.length === 0) {
        setSearchError(t('followCreator.errors.noCreatorsFound'));
        return;
      }

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(t('followCreator.errors.searching'));
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (creator: FoundCreator) => {
    setFollowingId(creator.user_id);

    const result = await followParasocial(creator.user_id);

    if (result.success) {
      toast.success(t('followCreator.toasts.following', { name: creator.display_name || `@${creator.user_handle}` }));
      refetch();
      handleClose();
    } else {
      if (result.error === 'Already following') {
        toast.info(t('followCreator.toasts.alreadyFollowing'));
      } else {
        toast.error(result.error || t('followCreator.toasts.followFailed'));
      }
    }

    setFollowingId(null);
  };

  const handleViewProfile = (handle: string) => {
    handleClose();
    navigate(`/@${handle}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Star className="h-5 w-5" />
            {t('followCreator.title')}
          </DialogTitle>
          <DialogDescription>
            {t('followCreator.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="creator-search">{t('followCreator.searchLabel')}</Label>
            <div className="flex gap-2">
              <Input
                id="creator-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('followCreator.searchPlaceholder')}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('followCreator.creatorModeHint')}
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

            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-2"
              >
                {results.map((creator) => (
                  <div
                    key={creator.user_id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.avatar_url || undefined} />
                      <AvatarFallback>
                        {creator.display_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium flex items-center gap-2 truncate">
                        {creator.display_name || t('profile.creator')}
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          {t('profile.creator')}
                        </Badge>
                      </p>
                      {creator.user_handle && (
                        <p className="text-sm text-muted-foreground truncate">
                          @{creator.user_handle}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {creator.user_handle && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(creator.user_handle!)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleFollow(creator)}
                        disabled={followingId === creator.user_id}
                      >
                        {followingId === creator.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Link2 className="h-4 w-4 mr-1" />
                            {t('profile.follow')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}