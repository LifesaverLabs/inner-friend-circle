import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Share2, Printer, Copy, AlertTriangle } from 'lucide-react';
import { Friend, TierType, TIER_INFO } from '@/types/friend';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  getFriendsInTier: (tier: TierType) => Friend[];
}

const tiers: TierType[] = ['core', 'inner', 'outer', 'parasocial'];

const tierEmoji: Record<TierType, string> = {
  core: '💎',
  inner: '💛',
  outer: '🌿',
  parasocial: '📺',
};

export function ShareDialog({ open, onOpenChange, friends, getFriendsInTier }: ShareDialogProps) {
  const [selectedTiers, setSelectedTiers] = useState<TierType[]>([]);

  const toggleTier = (tier: TierType) => {
    setSelectedTiers(prev => 
      prev.includes(tier) 
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };

  const selectAll = () => {
    setSelectedTiers([...tiers]);
  };

  const clearAll = () => {
    setSelectedTiers([]);
  };

  const getShareContent = () => {
    const lines: string[] = ['My Inner Friend Circles', ''];
    
    tiers.forEach(tier => {
      if (selectedTiers.includes(tier)) {
        const tierFriends = getFriendsInTier(tier);
        const info = TIER_INFO[tier];
        lines.push(`${tierEmoji[tier]} ${info.name} (${tierFriends.length}/${info.limit})`);
        lines.push('─'.repeat(20));
        
        if (tierFriends.length === 0) {
          lines.push('  (empty)');
        } else {
          tierFriends.forEach(friend => {
            lines.push(`  • ${friend.name}${friend.notes ? ` — ${friend.notes}` : ''}`);
          });
        }
        lines.push('');
      }
    });

    lines.push('─'.repeat(30));
    lines.push('Created with Inner Friend');
    
    return lines.join('\n');
  };

  const handleCopy = async () => {
    if (selectedTiers.length === 0) {
      toast.error('Please select at least one tier to share');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(getShareContent());
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handlePrint = () => {
    if (selectedTiers.length === 0) {
      toast.error('Please select at least one tier to print');
      return;
    }

    const content = getShareContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>My Inner Friend Circles</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; max-width: 600px; margin: 0 auto; }
              pre { white-space: pre-wrap; font-family: inherit; line-height: 1.8; }
            </style>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const allSelected = selectedTiers.length === tiers.length;
  const multipleSelected = selectedTiers.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Circles
          </DialogTitle>
          <DialogDescription>
            Select which tiers to include in your share
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear
            </Button>
          </div>

          <div className="space-y-3">
            {tiers.map(tier => {
              const info = TIER_INFO[tier];
              const count = getFriendsInTier(tier).length;
              
              return (
                <div key={tier} className="flex items-center space-x-3">
                  <Checkbox
                    id={tier}
                    checked={selectedTiers.includes(tier)}
                    onCheckedChange={() => toggleTier(tier)}
                  />
                  <Label 
                    htmlFor={tier} 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <span>{tierEmoji[tier]}</span>
                    <span className="font-medium">{info.name}</span>
                    <span className="text-muted-foreground text-sm">
                      ({count} {count === 1 ? 'person' : 'people'})
                    </span>
                  </Label>
                </div>
              );
            })}
          </div>

          {(allSelected || multipleSelected) && (
            <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-sm">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-amber-700 dark:text-amber-300">
                  <p className="font-medium">Privacy Note</p>
                  <p className="mt-1 text-xs opacity-90">
                    {allSelected 
                      ? "Sharing all circles reveals your complete social graph. This could be used for social engineering, competitive intelligence, or targeted marketing."
                      : "Sharing multiple tiers reveals relationships between your circles that could be cross-referenced."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={selectedTiers.length === 0}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            onClick={handlePrint}
            disabled={selectedTiers.length === 0}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
