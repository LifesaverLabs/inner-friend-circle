import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Minus, Plus, Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TierType, TIER_INFO, ReservedGroup } from '@/types/friend';

interface EditReservedGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: TierType;
  group: ReservedGroup;
  maxCount: number;
  onSave: (count: number, note?: string) => void;
}

export function EditReservedGroupDialog({
  open,
  onOpenChange,
  tier,
  group,
  maxCount,
  onSave,
}: EditReservedGroupDialogProps) {
  const { t } = useTranslation();
  const [count, setCount] = useState(group.count);
  const [note, setNote] = useState(group.note || '');

  const tierInfo = TIER_INFO[tier];

  useEffect(() => {
    if (open) {
      setCount(group.count);
      setNote(group.note || '');
    }
  }, [open, group]);

  const handleSave = () => {
    onSave(count, note.trim() || undefined);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const increment = () => setCount(c => Math.min(c + 1, maxCount));
  const decrement = () => setCount(c => Math.max(c - 1, 1));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Lock className="w-5 h-5 text-muted-foreground" />
            {t('reserved.editTitle', { tier: t(`tiers.${tier}`) })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('reserved.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrement}
              disabled={count <= 1}
              className="h-12 w-12 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </Button>
            
            <motion.div
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-4xl font-display font-bold text-foreground">
                {count}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('reserved.spotsLabel', { count })}
              </div>
            </motion.div>

            <Button
              variant="outline"
              size="icon"
              onClick={increment}
              disabled={count >= maxCount}
              className="h-12 w-12 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {t('reserved.maxAvailable', { count: maxCount })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('reserved.privateNoteLabel')}
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('reserved.notePlaceholder')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('actions.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
