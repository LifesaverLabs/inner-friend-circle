import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, ArrowRight, Check, Plus, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useContactMethods } from '@/hooks/useContactMethods';
import { supabase } from '@/integrations/supabase/client';
import { ServiceType, SERVICES, SERVICE_LIST } from '@/types/contactMethod';
import { toast } from 'sonner';

// Quick guidance hints for onboarding
const QUICK_HINTS: Record<ServiceType, string> = {
  phone: 'Your phone number with country code (e.g., +1 555-123-4567)',
  facetime: 'Phone number or Apple ID email linked to FaceTime',
  whatsapp: 'Phone number with country code, no spaces (e.g., +15551234567)',
  signal: 'Phone number registered with Signal app',
  telegram: 'Your @username (without @) or phone number',
  zoom: 'Personal Meeting ID or your zoom.us meeting link',
  google_meet: 'Your Gmail address',
  teams: 'Your Microsoft work or personal email',
  discord: 'Username#1234 or your User ID',
  skype: 'Your Skype Name (find in Settings → Account)',
  webex: 'Personal Room link or Webex email',
  slack: 'Work email (both parties need same workspace)',
};

interface ContactSetupOnboardingProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function ContactSetupOnboarding({
  userId,
  onComplete,
  onSkip,
}: ContactSetupOnboardingProps) {
  const [step, setStep] = useState(0);
  const [methods, setMethods] = useState<Array<{
    service: ServiceType;
    identifier: string;
    forSpontaneous: boolean;
    forScheduled: boolean;
  }>>([]);
  const [currentService, setCurrentService] = useState<ServiceType>('phone');
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [forSpontaneous, setForSpontaneous] = useState(true);
  const [forScheduled, setForScheduled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { addContactMethod } = useContactMethods(userId);

  const steps = [
    {
      title: 'Stay Connected',
      description: 'Add your contact methods so friends can reach you easily.',
      icon: <Phone className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Add Your Channels',
      description: 'Which video call and messaging apps do you use?',
      icon: <Video className="w-12 h-12 text-primary" />,
    },
    {
      title: 'All Set!',
      description: 'Your friends can now start or schedule kalls with you.',
      icon: <Check className="w-12 h-12 text-green-500" />,
    },
  ];

  const handleAddMethod = () => {
    if (!currentIdentifier.trim()) {
      toast.error('Please enter contact information');
      return;
    }

    setMethods(prev => [
      ...prev,
      {
        service: currentService,
        identifier: currentIdentifier.trim(),
        forSpontaneous,
        forScheduled,
      },
    ]);
    setCurrentIdentifier('');
    setCurrentService('phone');
    setForSpontaneous(true);
    setForScheduled(true);
  };

  const handleRemoveMethod = (index: number) => {
    setMethods(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAndComplete = async () => {
    setIsSaving(true);
    try {
      // Save all methods
      for (const method of methods) {
        await addContactMethod(method.service, method.identifier, {
          forSpontaneous: method.forSpontaneous,
          forScheduled: method.forScheduled,
        });
      }

      // Mark contact setup as complete
      await supabase
        .from('profiles')
        .update({ contact_setup_complete: true })
        .eq('user_id', userId);

      onComplete();
    } catch (error) {
      console.error('Error saving contact methods:', error);
      toast.error('Failed to save contact methods');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    // Mark as complete even if skipped
    await supabase
      .from('profiles')
      .update({ contact_setup_complete: true })
      .eq('user_id', userId);
    onSkip();
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                {steps[step].icon}
              </div>
              <DialogTitle className="text-xl">{steps[step].title}</DialogTitle>
              <DialogDescription>{steps[step].description}</DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {SERVICE_LIST.slice(0, 8).map((service) => (
                      <Card
                        key={service.type}
                        className="cursor-pointer hover:border-primary transition-colors"
                      >
                        <CardContent className="p-3 text-center">
                          <span className="text-2xl">{service.icon}</span>
                          <p className="text-xs mt-1 truncate">{service.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="ghost" onClick={handleSkip}>
                      Skip for now
                    </Button>
                    <Button onClick={() => setStep(1)}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  {/* Added methods */}
                  {methods.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {methods.map((method, index) => {
                        const service = SERVICES[method.service];
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                          >
                            <span className="text-lg">{service.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {method.identifier}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveMethod(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add new method form */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Service</Label>
                        <Select
                          value={currentService}
                          onValueChange={(v) => setCurrentService(v as ServiceType)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {SERVICE_LIST.map((service) => (
                              <SelectItem key={service.type} value={service.type}>
                                <span className="flex items-center gap-2">
                                  <span>{service.icon}</span>
                                  <span>{service.name}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Guidance hint */}
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs">
                        <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{QUICK_HINTS[currentService]}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Your {SERVICES[currentService].name} Contact Info</Label>
                        <Input
                          className="h-9"
                          placeholder={SERVICES[currentService].placeholder}
                          value={currentIdentifier}
                          onChange={(e) => setCurrentIdentifier(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMethod();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Switch
                          checked={forSpontaneous}
                          onCheckedChange={setForSpontaneous}
                          className="scale-75"
                        />
                        <span className="text-muted-foreground">Spontaneous</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Switch
                          checked={forScheduled}
                          onCheckedChange={setForScheduled}
                          className="scale-75"
                        />
                        <span className="text-muted-foreground">Scheduled</span>
                      </label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleAddMethod}
                      disabled={!currentIdentifier.trim() || (!forSpontaneous && !forScheduled)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Method
                    </Button>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="ghost" onClick={() => setStep(0)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={methods.length === 0}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-center text-muted-foreground">
                      You've added {methods.length} contact method{methods.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex justify-center gap-2 mt-2">
                      {methods.map((method, index) => (
                        <span key={index} className="text-xl">
                          {SERVICES[method.service].icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Add More
                    </Button>
                    <Button onClick={handleSaveAndComplete} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Complete Setup'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Hook to check if onboarding should be shown
export function useContactSetupNeeded(userId?: string) {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      if (!userId) {
        setNeedsSetup(false);
        setIsChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('contact_setup_complete')
          .eq('user_id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        // Show setup if profile doesn't exist or setup not complete
        setNeedsSetup(!data?.contact_setup_complete);
      } catch (error) {
        console.error('Error checking contact setup:', error);
        setNeedsSetup(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSetup();
  }, [userId]);

  return { needsSetup, isChecking, setNeedsSetup };
}
