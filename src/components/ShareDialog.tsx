import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Share2, Printer, Copy, AlertTriangle, HeartPulse } from 'lucide-react';
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
  const [isHealthcareMode, setIsHealthcareMode] = useState(false);

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

  const getShareContent = (forHealthcare = false) => {
    const lines: string[] = [];
    
    if (forHealthcare) {
      lines.push('═'.repeat(50));
      lines.push('CONFIDENTIAL PATIENT SOCIAL SUPPORT NETWORK');
      lines.push('═'.repeat(50));
      lines.push('');
    } else {
      lines.push('My Inner Friend Circles');
      lines.push('');
    }
    
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
            let entry = `  • ${friend.name}`;
            if (forHealthcare && friend.phone) {
              entry += ` — ${friend.phone}`;
            }
            if (friend.notes) {
              entry += ` — ${friend.notes}`;
            }
            lines.push(entry);
          });
        }
        lines.push('');
      }
    });

    if (forHealthcare) {
      lines.push('═'.repeat(50));
      lines.push('PRIVACY NOTICE — PROTECTED HEALTH INFORMATION');
      lines.push('═'.repeat(50));
      lines.push('');
      lines.push('This document contains Protected Health Information (PHI) and');
      lines.push('is shared for healthcare coordination purposes only.');
      lines.push('');
      lines.push('LEGAL PROTECTIONS:');
      lines.push('');
      lines.push('• UNITED STATES: Protected under HIPAA (Health Insurance');
      lines.push('  Portability and Accountability Act of 1996), 45 CFR §164.');
      lines.push('  Unauthorized disclosure may result in civil penalties up to');
      lines.push('  $50,000 per violation and criminal penalties.');
      lines.push('');
      lines.push('• EUROPEAN UNION: Protected under GDPR (General Data Protection');
      lines.push('  Regulation), Articles 9 and 82. Special category data');
      lines.push('  requiring explicit consent and enhanced protection.');
      lines.push('');
      lines.push('• UNITED KINGDOM: Protected under UK GDPR and Data Protection');
      lines.push('  Act 2018. Subject to NHS confidentiality requirements.');
      lines.push('');
      lines.push('• CANADA: Protected under PIPEDA (Personal Information');
      lines.push('  Protection and Electronic Documents Act) and provincial');
      lines.push('  health information acts (e.g., PHIPA in Ontario).');
      lines.push('');
      lines.push('• AUSTRALIA: Protected under the Privacy Act 1988 and');
      lines.push('  Australian Privacy Principles (APPs).');
      lines.push('');
      lines.push('This information must be handled in accordance with applicable');
      lines.push('healthcare privacy laws and professional ethics standards.');
      lines.push('Retain, copy, or disclose only as permitted by law.');
      lines.push('');
      lines.push('Generated: ' + new Date().toLocaleDateString());
      lines.push('');
    } else {
      lines.push('─'.repeat(30));
      lines.push('Created with Inner Friend');
    }
    
    return lines.join('\n');
  };

  const handleCopy = async (forHealthcare = false) => {
    if (selectedTiers.length === 0) {
      toast.error('Please select at least one tier to share');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(getShareContent(forHealthcare));
      toast.success(forHealthcare ? 'Healthcare document copied' : 'Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handlePrint = (forHealthcare = false) => {
    if (selectedTiers.length === 0) {
      toast.error('Please select at least one tier to print');
      return;
    }

    const content = getShareContent(forHealthcare);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${forHealthcare ? 'Confidential Patient Social Support Network' : 'My Inner Friend Circles'}</title>
            <style>
              body { 
                font-family: ${forHealthcare ? "'Courier New', monospace" : "'Georgia', serif"}; 
                padding: 40px; 
                max-width: 600px; 
                margin: 0 auto; 
              }
              pre { 
                white-space: pre-wrap; 
                font-family: inherit; 
                line-height: 1.8; 
              }
              ${forHealthcare ? `
              @media print {
                body { border: 2px solid #333; padding: 30px; }
              }
              ` : ''}
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

  const handleHealthcareShare = () => {
    setIsHealthcareMode(true);
    setSelectedTiers([...tiers]);
  };

  const allSelected = selectedTiers.length === tiers.length;
  const multipleSelected = selectedTiers.length > 1;
  const showPrivacyWarning = !isHealthcareMode && (allSelected || multipleSelected);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setIsHealthcareMode(false);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isHealthcareMode ? (
              <HeartPulse className="h-5 w-5 text-red-500" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
            {isHealthcareMode ? 'Healthcare Provider Share' : 'Share Your Circles'}
          </DialogTitle>
          <DialogDescription>
            {isHealthcareMode 
              ? 'Share with your healthcare provider or social worker (includes privacy protections)'
              : 'Select which tiers to include in your share'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear
            </Button>
            {!isHealthcareMode && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHealthcareShare}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                <HeartPulse className="h-4 w-4 mr-1" />
                Healthcare
              </Button>
            )}
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

          {isHealthcareMode && (
            <div className="rounded-md bg-green-500/10 border border-green-500/30 p-3 text-sm">
              <div className="flex gap-2">
                <HeartPulse className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <div className="text-green-700 dark:text-green-300">
                  <p className="font-medium">Healthcare Mode</p>
                  <p className="mt-1 text-xs opacity-90">
                    Document will include privacy law citations (HIPAA, GDPR, etc.) to protect this data under healthcare confidentiality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showPrivacyWarning && (
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
            onClick={() => handleCopy(isHealthcareMode)}
            disabled={selectedTiers.length === 0}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            onClick={() => handlePrint(isHealthcareMode)}
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
