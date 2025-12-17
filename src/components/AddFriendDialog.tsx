import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TierType, TIER_INFO } from '@/types/friend';

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: TierType;
  onAdd: (name: string, email?: string) => void;
  capacity: { available: number; used: number; limit: number };
}

export function AddFriendDialog({ 
  open, 
  onOpenChange, 
  tier, 
  onAdd, 
  capacity 
}: AddFriendDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);

  const tierInfo = TIER_INFO[tier];
  const isFull = capacity.available <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isFull) {
      onAdd(name.trim(), email.trim() || undefined);
      setName('');
      setEmail('');
      setShowEmailField(false);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setShowEmailField(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <div className={`w-3 h-3 rounded-full bg-${tierInfo.color}`} />
            Add {tierInfo.name} Friend
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {tierInfo.description}
          </DialogDescription>
        </DialogHeader>

        {isFull ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-2">
              Your {tierInfo.name} circle is full
            </p>
            <p className="text-sm text-muted-foreground">
              To add someone here, you'll need to move a current {tierInfo.name.toLowerCase()} friend 
              to another tier first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Their name"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {showEmailField ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For mutual match notifications"
                  />
                  <p className="text-xs text-muted-foreground">
                    If they also list you as a {tierInfo.name.toLowerCase()} friend and you both have 
                    notifications enabled, you'll both be notified of your mutual connection.
                  </p>
                </motion.div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => setShowEmailField(true)}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Plus className="w-4 h-4" />
                  Add email for mutual matching
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">
                {capacity.used}/{capacity.limit} spots used
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim()}>
                  Add Friend
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}