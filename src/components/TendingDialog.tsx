import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Heart, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Friend, TierType, TIER_INFO, CONTACT_METHODS } from '@/types/friend';
import { toast } from 'sonner';

interface TendingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  getFriendsInTier: (tier: TierType) => Friend[];
  onUpdateLastContacted: (id: string) => void;
  onTendingComplete?: () => void;
}

const TENDING_TIERS: { tier: TierType; period: string; days: number }[] = [
  { tier: 'core', period: 'this week', days: 7 },
  { tier: 'inner', period: 'these two weeks', days: 14 },
  { tier: 'outer', period: 'these two months', days: 60 },
];

const tierEmoji: Record<TierType, string> = {
  core: '💎',
  inner: '💛',
  outer: '🌿',
  naybor: '🏠',
  parasocial: '📺',
  rolemodel: '⭐',
  acquainted: '🤝',
};

export function TendingDialog({ 
  open, 
  onOpenChange, 
  friends, 
  getFriendsInTier,
  onUpdateLastContacted,
  onTendingComplete
}: TendingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [neglectedIds, setNeglectedIds] = useState<Set<string>>(new Set());
  const [showCallPrompt, setShowCallPrompt] = useState(false);

  const currentTier = TENDING_TIERS[currentStep];
  const tierFriends = useMemo(() => 
    currentTier ? getFriendsInTier(currentTier.tier) : [],
    [currentTier, getFriendsInTier]
  );

  const neglectedFriends = useMemo(() => 
    friends.filter(f => neglectedIds.has(f.id)),
    [friends, neglectedIds]
  );

  const toggleNeglected = (id: string) => {
    setNeglectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep < TENDING_TIERS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (neglectedIds.size > 0) {
        setShowCallPrompt(true);
      } else {
        toast.success("Amazing! You've tended to all your circles 🌱");
        handleClose();
      }
    }
  };

  const handleCall = (friend: Friend) => {
    if (!friend.phone) {
      toast.error(`No phone number for ${friend.name}`);
      return;
    }
    
    const method = friend.preferredContact || 'tel';
    const contactInfo = CONTACT_METHODS[method];
    window.open(contactInfo.getUrl(friend.phone), '_blank');
    
    // Mark as contacted
    onUpdateLastContacted(friend.id);
    setNeglectedIds(prev => {
      const next = new Set(prev);
      next.delete(friend.id);
      return next;
    });
    
    toast.success(`Connecting with ${friend.name} via ${contactInfo.name}`);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setNeglectedIds(new Set());
    setShowCallPrompt(false);
    onTendingComplete?.();
    onOpenChange(false);
  };

  const handleSkipCalls = () => {
    toast("Remember to reach out soon! 💛", { 
      description: `${neglectedIds.size} friend${neglectedIds.size === 1 ? '' : 's'} waiting to hear from you`
    });
    handleClose();
  };

  if (showCallPrompt) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Time to Reconnect
            </DialogTitle>
            <DialogDescription>
              These friends could use some of your time
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3 max-h-[400px] overflow-y-auto">
            {neglectedFriends.map(friend => {
              const tierInfo = TIER_INFO[friend.tier];
              const hasPhone = !!friend.phone;
              
              return (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tierEmoji[friend.tier]}</span>
                    <div>
                      <p className="font-medium text-foreground">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{tierInfo.name}</p>
                    </div>
                  </div>
                  
                  {hasPhone ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleCall(friend)}
                      className="gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">No phone</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleSkipCalls}>
              Maybe Later
            </Button>
            <Button onClick={handleClose}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Done Tending
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Tend Your Circles
          </DialogTitle>
          <DialogDescription>
            {currentTier && (
              <>
                Mark your <strong>{TIER_INFO[currentTier.tier].name}</strong> friends 
                you <em>haven't</em> connected with {currentTier.period}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {TENDING_TIERS.map((t, i) => (
              <div 
                key={t.tier}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {currentTier && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{tierEmoji[currentTier.tier]}</span>
                <span className="font-display text-lg font-medium">
                  {TIER_INFO[currentTier.tier].name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({tierFriends.length} {tierFriends.length === 1 ? 'person' : 'people'})
                </span>
              </div>

              {tierFriends.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No friends in this tier yet
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-2">
                    ✓ Check those you <strong>haven't</strong> talked to enough:
                  </p>
                  {tierFriends.map(friend => (
                    <div 
                      key={friend.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleNeglected(friend.id)}
                    >
                      <Checkbox
                        checked={neglectedIds.has(friend.id)}
                        onCheckedChange={() => toggleNeglected(friend.id)}
                      />
                      <span className="text-foreground">{friend.name}</span>
                      {!friend.phone && (
                        <span className="text-xs text-muted-foreground ml-auto">no phone</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleNext}>
            {currentStep < TENDING_TIERS.length - 1 ? (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
