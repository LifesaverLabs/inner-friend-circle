import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, ArrowRight, Check, Plus, X, Info, Globe, Lock } from 'lucide-react';
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

// Quick guidance hints for onboarding - i18n key mapping
const QUICK_HINT_KEYS: Record<ServiceType, string> = {
  real_face_time: 'onboarding.hints.realFaceTime',
  phone: 'onboarding.hints.phone',
  facetime: 'onboarding.hints.facetime',
  whatsapp: 'onboarding.hints.whatsapp',
  signal: 'onboarding.hints.signal',
  telegram: 'onboarding.hints.telegram',
  zoom: 'onboarding.hints.zoom',
  google_meet: 'onboarding.hints.googleMeet',
  teams: 'onboarding.hints.teams',
  discord: 'onboarding.hints.discord',
  skype: 'onboarding.hints.skype',
  webex: 'onboarding.hints.webex',
  slack: 'onboarding.hints.slack',
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
  const { t } = useTranslation();
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
  const [isPublicProfile, setIsPublicProfile] = useState(true);

  const { addContactMethod } = useContactMethods(userId);

  const steps = [
    {
      title: t('onboarding.steps.connect.title'),
      description: t('onboarding.steps.connect.description'),
      icon: <Phone className="w-12 h-12 text-primary" />,
    },
    {
      title: t('onboarding.steps.channels.title'),
      description: t('onboarding.steps.channels.description'),
      icon: <Video className="w-12 h-12 text-primary" />,
    },
    {
      title: t('onboarding.steps.complete.title'),
      description: t('onboarding.steps.complete.description'),
      icon: <Check className="w-12 h-12 text-green-500" />,
    },
  ];

  const handleAddMethod = () => {
    if (!currentIdentifier.trim()) {
      toast.error(t('onboarding.toasts.enterContactInfo'));
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

      // Mark contact setup as complete and save privacy preference
      await supabase
        .from('profiles')
        .update({ 
          contact_setup_complete: true,
          is_public: isPublicProfile 
        })
        .eq('user_id', userId);

      onComplete();
    } catch (error) {
      console.error('Error saving contact methods:', error);
      toast.error(t('onboarding.toasts.saveFailed'));
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
                      {t('onboarding.skipForNow')}
                    </Button>
                    <Button onClick={() => setStep(1)}>
                      {t('onboarding.getStarted')}
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
                        <Label className="text-xs">{t('onboarding.service')}</Label>
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
                        <span className="text-muted-foreground">{t(QUICK_HINT_KEYS[currentService])}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">{t('onboarding.yourContactInfo', { service: SERVICES[currentService].name })}</Label>
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
                        <span className="text-muted-foreground">{t('onboarding.spontaneous')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Switch
                          checked={forScheduled}
                          onCheckedChange={setForScheduled}
                          className="scale-75"
                        />
                        <span className="text-muted-foreground">{t('onboarding.scheduled')}</span>
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
                      {t('onboarding.addMethod')}
                    </Button>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="ghost" onClick={() => setStep(0)}>
                      {t('actions.back')}
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={methods.length === 0}
                    >
                      {t('onboarding.continue')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-center text-muted-foreground">
                      {t('onboarding.methodsAdded', { count: methods.length })}
                    </p>
                    <div className="flex justify-center gap-2 mt-2">
                      {methods.map((method, index) => (
                        <span key={index} className="text-xl">
                          {SERVICES[method.service].icon}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Profile Privacy Setting */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isPublicProfile ? (
                          <Globe className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {isPublicProfile ? t('onboarding.publicProfile') : t('onboarding.privateProfile')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isPublicProfile
                              ? t('onboarding.publicProfileHint')
                              : t('onboarding.privateProfileHint')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isPublicProfile}
                        onCheckedChange={setIsPublicProfile}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      {t('onboarding.addMore')}
                    </Button>
                    <Button onClick={handleSaveAndComplete} disabled={isSaving}>
                      {isSaving ? t('onboarding.saving') : t('onboarding.completeSetup')}
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
