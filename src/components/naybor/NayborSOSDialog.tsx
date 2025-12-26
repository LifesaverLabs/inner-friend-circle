import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  User,
  Check,
  Copy,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Friend, CONTACT_METHODS } from '@/types/friend';
import {
  SOSCategory,
  SOS_CATEGORIES,
  getSortedSOSContacts,
  generateSOSMessage,
} from '@/types/nayborSOS';
import { toast } from 'sonner';

interface NayborSOSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  naybors: Friend[];
  onContactNaybor?: (naybor: Friend) => void;
}

type DialogStep = 'category' | 'compose' | 'contacts';

export function NayborSOSDialog({
  open,
  onOpenChange,
  naybors,
  onContactNaybor,
}: NayborSOSDialogProps) {
  const [step, setStep] = useState<DialogStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<SOSCategory | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [selectedNaybors, setSelectedNaybors] = useState<Set<string>>(new Set());
  const [contactedNaybors, setContactedNaybors] = useState<Set<string>>(new Set());

  const sortedNaybors = getSortedSOSContacts(naybors);

  const handleCategorySelect = (category: SOSCategory) => {
    setSelectedCategory(category);
    setStep('compose');
  };

  const handleComposeNext = () => {
    // Pre-select top 3 naybors with phone numbers
    const topWithPhones = sortedNaybors
      .filter((n) => n.phone)
      .slice(0, 3)
      .map((n) => n.id);
    setSelectedNaybors(new Set(topWithPhones));
    setStep('contacts');
  };

  const handleNayborToggle = (nayborId: string) => {
    setSelectedNaybors((prev) => {
      const next = new Set(prev);
      if (next.has(nayborId)) {
        next.delete(nayborId);
      } else {
        next.add(nayborId);
      }
      return next;
    });
  };

  const handleCall = (naybor: Friend) => {
    if (naybor.phone) {
      window.open(`tel:${naybor.phone}`, '_self');
      setContactedNaybors((prev) => new Set([...prev, naybor.id]));
      onContactNaybor?.(naybor);
    }
  };

  const handleMessage = (naybor: Friend) => {
    if (!selectedCategory) return;

    const message = generateSOSMessage(selectedCategory, customMessage, includeLocation);
    const encodedMessage = encodeURIComponent(message);

    if (naybor.phone) {
      const method = naybor.preferredContact || 'tel';
      if (method === 'whatsapp') {
        window.open(`https://wa.me/${naybor.phone.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
      } else if (method === 'signal') {
        // Signal doesn't support pre-filled messages well, just open it
        window.open(CONTACT_METHODS.signal.getUrl(naybor.phone), '_blank');
      } else {
        // Default to SMS
        window.open(`sms:${naybor.phone}?body=${encodedMessage}`, '_self');
      }
      setContactedNaybors((prev) => new Set([...prev, naybor.id]));
      onContactNaybor?.(naybor);
    }
  };

  const handleCopyMessage = () => {
    if (!selectedCategory) return;
    const message = generateSOSMessage(selectedCategory, customMessage, includeLocation);
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const handleContactAll = () => {
    if (!selectedCategory) return;

    const toContact = sortedNaybors.filter(
      (n) => selectedNaybors.has(n.id) && n.phone
    );

    if (toContact.length === 0) {
      toast.error('No naybors with phone numbers selected');
      return;
    }

    // Open SMS to all selected (comma-separated on iOS, semicolon on Android)
    const phones = toContact.map((n) => n.phone).join(',');
    const message = generateSOSMessage(selectedCategory, customMessage, includeLocation);
    window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');

    toContact.forEach((n) => {
      setContactedNaybors((prev) => new Set([...prev, n.id]));
      onContactNaybor?.(n);
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setStep('category');
      setSelectedCategory(null);
      setCustomMessage('');
      setIncludeLocation(false);
      setSelectedNaybors(new Set());
      setContactedNaybors(new Set());
    }, 200);
  };

  const handleBack = () => {
    if (step === 'compose') {
      setStep('category');
    } else if (step === 'contacts') {
      setStep('compose');
    }
  };

  const categoryInfo = selectedCategory ? SOS_CATEGORIES[selectedCategory] : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-tier-naybor" aria-hidden="true" />
            Naybor SOS™
          </DialogTitle>
          <DialogDescription>
            {step === 'category' && 'What kind of help do you need?'}
            {step === 'compose' && categoryInfo && `${categoryInfo.icon} ${categoryInfo.name}`}
            {step === 'contacts' && 'Choose naybors to contact'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                {Object.values(SOS_CATEGORIES).map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={`h-auto p-3 flex flex-col items-start gap-1 text-left ${
                      category.urgencyLevel === 'critical'
                        ? 'border-destructive/50 hover:border-destructive hover:bg-destructive/5'
                        : 'hover:border-tier-naybor hover:bg-tier-naybor/5'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                    aria-label={`${category.name}${category.urgencyLevel === 'critical' ? ' - Critical urgency' : ''}`}
                  >
                    <span className="text-lg" aria-hidden="true">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                    {category.urgencyLevel === 'critical' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive" aria-hidden="true">
                        Critical
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  For life-threatening emergencies, call 911 first
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Compose Message */}
          {step === 'compose' && categoryInfo && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-tier-naybor/5 border border-tier-naybor/20">
                <p className="text-sm text-muted-foreground mb-1">
                  {categoryInfo.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Suggested actions:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {categoryInfo.suggestedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Add details (optional)
                </label>
                <Textarea
                  placeholder="Describe your situation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-location"
                  checked={includeLocation}
                  onCheckedChange={(checked) => setIncludeLocation(checked === true)}
                  aria-describedby="location-description"
                />
                <label htmlFor="include-location" className="text-sm flex items-center gap-1 cursor-pointer">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  Include location info
                </label>
                <span id="location-description" className="sr-only">
                  When enabled, your approximate location will be shared with your naybors
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1" aria-label="Go back to category selection">
                  Back
                </Button>
                <Button
                  onClick={handleComposeNext}
                  className="flex-1 bg-tier-naybor hover:bg-tier-naybor/90"
                  aria-label="Continue to choose naybors to contact"
                >
                  Choose Naybors
                  <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Selection */}
          {step === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  {selectedNaybors.size} naybor{selectedNaybors.size !== 1 ? 's' : ''} selected
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyMessage} aria-label="Copy SOS message to clipboard">
                  <Copy className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  Copy message
                </Button>
              </div>

              <ScrollArea className="h-[200px] pr-3">
                <div className="space-y-2" role="list" aria-label="Naybor contacts">
                  {sortedNaybors.map((naybor) => {
                    const isSelected = selectedNaybors.has(naybor.id);
                    const wasContacted = contactedNaybors.has(naybor.id);

                    return (
                      <div
                        key={naybor.id}
                        role="listitem"
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                          isSelected
                            ? 'border-tier-naybor bg-tier-naybor/5'
                            : 'border-border'
                        } ${wasContacted ? 'opacity-60' : ''}`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleNayborToggle(naybor.id)}
                          aria-label={`Select ${naybor.name}${wasContacted ? ' (already contacted)' : ''}`}
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="p-1.5 rounded-full bg-tier-naybor/10 shrink-0" aria-hidden="true">
                            <User className="w-3 h-3 text-tier-naybor" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate flex items-center gap-1">
                              {naybor.name}
                              {wasContacted && (
                                <>
                                  <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
                                  <span className="sr-only">(already contacted)</span>
                                </>
                              )}
                            </p>
                            {naybor.phone && (
                              <p className="text-xs text-muted-foreground truncate">
                                {naybor.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        {naybor.phone && (
                          <div className="flex items-center gap-1 shrink-0" role="group" aria-label={`Contact options for ${naybor.name}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCall(naybor)}
                              aria-label={`Call ${naybor.name}`}
                            >
                              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleMessage(naybor)}
                              aria-label={`Message ${naybor.name}`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" onClick={handleBack} className="flex-1" aria-label="Go back to compose message">
                  Back
                </Button>
                <Button
                  onClick={handleContactAll}
                  disabled={selectedNaybors.size === 0}
                  className="flex-1 bg-tier-naybor hover:bg-tier-naybor/90"
                  aria-label={`Message all ${selectedNaybors.size} selected naybor${selectedNaybors.size !== 1 ? 's' : ''}`}
                >
                  <MessageCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  Message All ({selectedNaybors.size})
                </Button>
              </div>

              {contactedNaybors.size > 0 && (
                <p className="text-xs text-center text-muted-foreground" aria-live="polite">
                  Contacted {contactedNaybors.size} naybor{contactedNaybors.size !== 1 ? 's' : ''}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
