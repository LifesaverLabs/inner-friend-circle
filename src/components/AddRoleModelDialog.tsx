import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface AddRoleModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, reason: string) => void;
  capacity: { available: number; used: number; limit: number };
}

export function AddRoleModelDialog({ open, onOpenChange, onAdd, capacity }: AddRoleModelDialogProps) {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && reason.trim()) {
      onAdd(name.trim(), reason.trim());
      setName('');
      setReason('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName('');
      setReason('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-tier-rolemodel" />
            Add Role Model
          </DialogTitle>
          <DialogDescription>
            Add someone whose life story inspires you — living or departed.
            <span className="block mt-1 text-xs">
              {capacity.available} of {capacity.limit} spots available
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Marcus Aurelius, Maya Angelou..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why is this person a role model?</Label>
            <Textarea
              id="reason"
              placeholder="Describe what you admire about them, what traits you want to embrace, or how their story inspires you to be good, better, best..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to your confirmed connections.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || !reason.trim() || capacity.available <= 0}
            >
              Add Role Model
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
