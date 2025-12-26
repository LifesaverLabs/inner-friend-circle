import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            {t('roleModel.addTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('roleModel.addDescription')}
            <span className="block mt-1 text-xs">
              {t('capacity.spotsAvailable', { available: capacity.available, limit: capacity.limit })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('labels.name')}</Label>
            <Input
              id="name"
              placeholder={t('roleModel.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">{t('roleModel.whyRoleModel')}</Label>
            <Textarea
              id="reason"
              placeholder={t('roleModel.reasonPlaceholder')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {t('roleModel.visibilityNote')}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !reason.trim() || capacity.available <= 0}
            >
              {t('roleModel.addTitle')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
