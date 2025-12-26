import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Trash2, ExternalLink, BarChart3, Users, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useParasocial, ParasocialShare, EngagementStats } from '@/hooks/useParasocial';
import { toast } from 'sonner';

interface ParasocialDashboardProps {
  userId: string;
}

export function ParasocialDashboard({ userId }: ParasocialDashboardProps) {
  const {
    isParasocialPersonality,
    myShares,
    followerCount,
    engagementStats,
    createShare,
    deleteShare,
  } = useParasocial(userId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isParasocialPersonality) {
    return null;
  }

  const handleCreateShare = async () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error('Title and URL are required');
      return;
    }

    // Validate URL
    try {
      new URL(newUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsCreating(true);
    const result = await createShare(newTitle.trim(), newUrl.trim(), newDescription.trim() || undefined);
    setIsCreating(false);

    if (result.success) {
      toast.success('Content shared with your followers!');
      setCreateDialogOpen(false);
      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
    } else {
      toast.error(result.error || 'Failed to share content');
    }
  };

  const handleDeleteShare = async (shareId: string) => {
    const result = await deleteShare(shareId);
    if (result.success) {
      toast.success('Share deleted');
    } else {
      toast.error(result.error || 'Failed to delete share');
    }
  };

  const getStats = (shareId: string): EngagementStats => {
    return engagementStats[shareId] || {
      share_id: shareId,
      total_clicks: 0,
      follower_count: followerCount,
      click_percentage: 0,
    };
  };

  return (
    <Card className="border-tier-parasocial/30 bg-tier-parasocial/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Creator Dashboard
            </CardTitle>
            <CardDescription>
              Share content with your {followerCount} parasocial follower{followerCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Share Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share New Content</DialogTitle>
                <DialogDescription>
                  Share a link with your parasocial followers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What are you sharing?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell your followers what this is about..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateShare} disabled={isCreating}>
                    {isCreating ? 'Sharing...' : 'Share'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {myShares.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ExternalLink className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No content shared yet</p>
            <p className="text-xs mt-1">Share links to engage with your followers</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {myShares.map((share) => {
                const stats = getStats(share.id);
                return (
                  <motion.div
                    key={share.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start justify-between p-3 bg-background/50 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={share.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {share.title}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      {share.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {share.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}</span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {stats.total_clicks} click{stats.total_clicks !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {stats.click_percentage.toFixed(1)}% engagement
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 ml-2">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this share?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the link from your followers' feeds.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteShare(share.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
