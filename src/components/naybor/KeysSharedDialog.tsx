import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Smartphone,
  User,
  Check,
  ChevronRight,
  Home,
  Shield,
  ExternalLink,
  AlertTriangle,
  Info,
  Lock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Friend } from '@/types/friend';
import {
  KeyType,
  EmergencyScenario,
  NayborKeyAccess,
  HomeEntryPreferences,
  DoorBreakingPreference,
  EMERGENCY_SCENARIOS,
  DOOR_BREAKING_OPTIONS,
  getMandatoryScenarios,
  getOptionalScenarios,
  getScenariosByCategory,
  getDefaultHomeEntryPreferences,
} from '@/types/keysShared';
import { toast } from 'sonner';

interface KeysSharedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  naybors: Friend[];
  userId: string;
  preferences?: HomeEntryPreferences;
  onSave: (preferences: HomeEntryPreferences) => void;
}

type DialogStep = 'address' | 'keyholders' | 'permissions' | 'review';

const KEY_TYPE_OPTIONS: { value: KeyType; label: string; icon: React.ReactNode }[] = [
  { value: 'physical', label: 'Physical Key', icon: <Key className="w-4 h-4" /> },
  { value: 'digital', label: 'Digital Code', icon: <Smartphone className="w-4 h-4" /> },
  { value: 'both', label: 'Both', icon: <Lock className="w-4 h-4" /> },
];

const DIGITAL_CODE_TYPES = [
  { value: 'keypad', label: 'Door Keypad' },
  { value: 'smart_lock', label: 'Smart Lock App' },
  { value: 'garage', label: 'Garage Code' },
  { value: 'other', label: 'Other' },
] as const;

export function KeysSharedDialog({
  open,
  onOpenChange,
  naybors,
  userId,
  preferences: initialPreferences,
  onSave,
}: KeysSharedDialogProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<DialogStep>('address');

  // Form state
  const [address, setAddress] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [entryInstructions, setEntryInstructions] = useState('');
  const [keyHolders, setKeyHolders] = useState<NayborKeyAccess[]>([]);
  const [selectedOptionalScenarios, setSelectedOptionalScenarios] = useState<Set<EmergencyScenario>>(new Set());
  const [shareWithEmergencyWorkers, setShareWithEmergencyWorkers] = useState(true);
  const [doorBreakingPreference, setDoorBreakingPreference] = useState<DoorBreakingPreference>('break_fast_call_naybors');

  // Editing state for adding key holder
  const [editingNayborId, setEditingNayborId] = useState<string | null>(null);
  const [editKeyType, setEditKeyType] = useState<KeyType>('physical');
  const [editDigitalCodeType, setEditDigitalCodeType] = useState<string>('keypad');
  const [editNotes, setEditNotes] = useState('');

  // Initialize from existing preferences
  useEffect(() => {
    if (initialPreferences) {
      setAddress(initialPreferences.address || '');
      setUnitNumber(initialPreferences.unitNumber || '');
      setEntryInstructions(initialPreferences.entryInstructions || '');
      setKeyHolders(initialPreferences.keyHolders);
      setShareWithEmergencyWorkers(initialPreferences.shareWithEmergencyWorkers ?? true);
      setDoorBreakingPreference(initialPreferences.doorBreakingPreference ?? 'break_fast_call_naybors');

      // Set optional scenarios
      const optionalEnabled = new Set<EmergencyScenario>();
      const optionalScenarios = getOptionalScenarios();
      initialPreferences.emergencyPermissions.forEach(p => {
        if (optionalScenarios.includes(p)) {
          optionalEnabled.add(p);
        }
      });
      setSelectedOptionalScenarios(optionalEnabled);
    } else {
      // Reset to defaults
      setAddress('');
      setUnitNumber('');
      setEntryInstructions('');
      setKeyHolders([]);
      setSelectedOptionalScenarios(new Set());
      setShareWithEmergencyWorkers(true); // Default to sharing for safety
      setDoorBreakingPreference('break_fast_call_naybors');
    }
  }, [initialPreferences, open]);

  const mandatoryScenarios = getMandatoryScenarios();
  const optionalScenarios = getOptionalScenarios();
  const scenariosByCategory = getScenariosByCategory();

  const handleAddKeyHolder = (nayborId: string) => {
    setEditingNayborId(nayborId);
    setEditKeyType('physical');
    setEditDigitalCodeType('keypad');
    setEditNotes('');
  };

  const handleConfirmKeyHolder = () => {
    if (!editingNayborId) return;

    const newHolder: NayborKeyAccess = {
      nayborId: editingNayborId,
      keyType: editKeyType,
      hasPhysicalKey: editKeyType === 'physical' || editKeyType === 'both',
      hasDigitalCode: editKeyType === 'digital' || editKeyType === 'both',
      digitalCodeType: editKeyType !== 'physical' ? editDigitalCodeType as NayborKeyAccess['digitalCodeType'] : undefined,
      notes: editNotes || undefined,
      confirmedAt: new Date(),
    };

    setKeyHolders(prev => {
      const existing = prev.findIndex(h => h.nayborId === editingNayborId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newHolder;
        return updated;
      }
      return [...prev, newHolder];
    });

    setEditingNayborId(null);
    toast.success(t('keysShared.toasts.keyHolderAdded'));
  };

  const handleRemoveKeyHolder = (nayborId: string) => {
    setKeyHolders(prev => prev.filter(h => h.nayborId !== nayborId));
    toast.success(t('keysShared.toasts.keyHolderRemoved'));
  };

  const toggleOptionalScenario = (scenario: EmergencyScenario) => {
    setSelectedOptionalScenarios(prev => {
      const next = new Set(prev);
      if (next.has(scenario)) {
        next.delete(scenario);
      } else {
        next.add(scenario);
      }
      return next;
    });
  };

  const handleSave = () => {
    const allPermissions = [...mandatoryScenarios, ...selectedOptionalScenarios];

    const preferences: HomeEntryPreferences = {
      userId,
      address: address || undefined,
      unitNumber: unitNumber || undefined,
      entryInstructions: entryInstructions || undefined,
      emergencyPermissions: allPermissions,
      keyHolders,
      shareWithEmergencyWorkers,
      doorBreakingPreference,
      createdAt: initialPreferences?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(preferences);
    toast.success(t('keysShared.toasts.saved'));
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('address');
      setEditingNayborId(null);
    }, 200);
  };

  const handleNext = () => {
    if (step === 'address') setStep('keyholders');
    else if (step === 'keyholders') setStep('permissions');
    else if (step === 'permissions') setStep('review');
  };

  const handleBack = () => {
    if (step === 'keyholders') setStep('address');
    else if (step === 'permissions') setStep('keyholders');
    else if (step === 'review') setStep('permissions');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'address': return t('keysShared.steps.address.title');
      case 'keyholders': return t('keysShared.steps.keyholders.title');
      case 'permissions': return t('keysShared.steps.permissions.title');
      case 'review': return t('keysShared.steps.review.title');
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'address': return t('keysShared.steps.address.description');
      case 'keyholders': return t('keysShared.steps.keyholders.description');
      case 'permissions': return t('keysShared.steps.permissions.description');
      case 'review': return t('keysShared.steps.review.description');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-tier-naybor" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-2">
          {(['address', 'keyholders', 'permissions', 'review'] as DialogStep[]).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= ['address', 'keyholders', 'permissions', 'review'].indexOf(step)
                  ? 'bg-tier-naybor'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Address */}
            {step === 'address' && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-3 rounded-lg bg-tier-naybor/5 border border-tier-naybor/20">
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-tier-naybor mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {t('keysShared.addressHelp')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="address">{t('keysShared.address')}</Label>
                    <Input
                      id="address"
                      placeholder={t('keysShared.addressPlaceholder')}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">{t('keysShared.unitNumber')}</Label>
                    <Input
                      id="unit"
                      placeholder={t('keysShared.unitPlaceholder')}
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">{t('keysShared.entryInstructions')}</Label>
                    <Textarea
                      id="instructions"
                      placeholder={t('keysShared.instructionsPlaceholder')}
                      value={entryInstructions}
                      onChange={(e) => setEntryInstructions(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('keysShared.instructionsHint')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Key Holders */}
            {step === 'keyholders' && (
              <motion.div
                key="keyholders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {editingNayborId ? (
                  // Editing a specific naybor
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <User className="w-5 h-5 text-tier-naybor" />
                      <span className="font-medium">
                        {naybors.find(n => n.id === editingNayborId)?.name}
                      </span>
                    </div>

                    <div>
                      <Label>{t('keysShared.keyType')}</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {KEY_TYPE_OPTIONS.map(option => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={editKeyType === option.value ? 'default' : 'outline'}
                            className="flex flex-col gap-1 h-auto py-3"
                            onClick={() => setEditKeyType(option.value)}
                          >
                            {option.icon}
                            <span className="text-xs">{t(`keysShared.keyTypes.${option.value}`)}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {(editKeyType === 'digital' || editKeyType === 'both') && (
                      <div>
                        <Label>{t('keysShared.digitalCodeType')}</Label>
                        <Select value={editDigitalCodeType} onValueChange={setEditDigitalCodeType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIGITAL_CODE_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {t(`keysShared.codeTypes.${type.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">{t('keysShared.notes')}</Label>
                      <Textarea
                        id="notes"
                        placeholder={t('keysShared.notesPlaceholder')}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditingNayborId(null)}
                      >
                        {t('actions.cancel')}
                      </Button>
                      <Button
                        className="flex-1 bg-tier-naybor hover:bg-tier-naybor/90"
                        onClick={handleConfirmKeyHolder}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {t('keysShared.confirmKeyHolder')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // List of naybors
                  <div className="space-y-2">
                    {keyHolders.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">{t('keysShared.currentKeyHolders')}</p>
                        <div className="space-y-2">
                          {keyHolders.map(holder => {
                            const naybor = naybors.find(n => n.id === holder.nayborId);
                            if (!naybor) return null;
                            return (
                              <div
                                key={holder.nayborId}
                                className="flex items-center gap-2 p-2 rounded-lg border border-tier-naybor/30 bg-tier-naybor/5"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  {holder.keyType === 'physical' && <Key className="w-4 h-4 text-tier-naybor" />}
                                  {holder.keyType === 'digital' && <Smartphone className="w-4 h-4 text-tier-naybor" />}
                                  {holder.keyType === 'both' && <Lock className="w-4 h-4 text-tier-naybor" />}
                                  <span className="font-medium">{naybor.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({t(`keysShared.keyTypes.${holder.keyType}`)})
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddKeyHolder(holder.nayborId)}
                                >
                                  {t('actions.edit')}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveKeyHolder(holder.nayborId)}
                                >
                                  {t('actions.remove')}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-sm font-medium mb-2">{t('keysShared.selectNaybors')}</p>
                    {naybors.filter(n => !keyHolders.some(h => h.nayborId === n.id)).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {naybors.length === 0
                          ? t('keysShared.noNaybors')
                          : t('keysShared.allNayborsAssigned')}
                      </p>
                    ) : (
                      naybors
                        .filter(n => !keyHolders.some(h => h.nayborId === n.id))
                        .map(naybor => (
                          <button
                            key={naybor.id}
                            className="w-full flex items-center gap-2 p-3 rounded-lg border border-border hover:border-tier-naybor hover:bg-tier-naybor/5 transition-colors text-left"
                            onClick={() => handleAddKeyHolder(naybor.id)}
                          >
                            <div className="p-1.5 rounded-full bg-tier-naybor/10">
                              <User className="w-4 h-4 text-tier-naybor" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{naybor.name}</p>
                              {naybor.phone && (
                                <p className="text-xs text-muted-foreground">{naybor.phone}</p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Permissions */}
            {step === 'permissions' && (
              <motion.div
                key="permissions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Mandatory scenarios */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-destructive" />
                    <p className="text-sm font-medium">{t('keysShared.mandatoryScenarios')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('keysShared.mandatoryScenariosHelp')}
                  </p>
                  <div className="space-y-2">
                    {Object.values(EMERGENCY_SCENARIOS)
                      .filter(s => s.isMandatory)
                      .map(scenario => (
                        <div
                          key={scenario.id}
                          className="flex items-start gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20"
                        >
                          <div className="w-5 h-5 rounded border-2 border-destructive/50 bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-destructive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span>{scenario.icon}</span>
                              <span className="font-medium text-sm">{t(`keysShared.scenarios.${scenario.id}.name`)}</span>
                              {scenario.take10Link && (
                                <a
                                  href={scenario.take10Link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-xs flex items-center gap-0.5"
                                >
                                  Take10.us
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t(`keysShared.scenarios.${scenario.id}.description`)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Optional scenarios */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('keysShared.optionalScenarios')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('keysShared.optionalScenariosHelp')}
                  </p>
                  <div className="space-y-2">
                    {optionalScenarios.map(scenarioId => {
                      const scenario = EMERGENCY_SCENARIOS[scenarioId];
                      const isEnabled = selectedOptionalScenarios.has(scenarioId);
                      return (
                        <label
                          key={scenario.id}
                          className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                            isEnabled
                              ? 'bg-tier-naybor/5 border-tier-naybor/30'
                              : 'border-border hover:border-tier-naybor/50'
                          }`}
                        >
                          <Checkbox
                            checked={isEnabled}
                            onCheckedChange={() => toggleOptionalScenario(scenarioId)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span>{scenario.icon}</span>
                              <span className="font-medium text-sm">{t(`keysShared.scenarios.${scenario.id}.name`)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t(`keysShared.scenarios.${scenario.id}.description`)}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Emergency Worker Sharing Toggle */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-medium">{t('keysShared.emergencyWorkerSharing.title')}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Switch
                        id="share-emergency-workers"
                        checked={shareWithEmergencyWorkers}
                        onCheckedChange={setShareWithEmergencyWorkers}
                      />
                      <div className="flex-1">
                        <Label htmlFor="share-emergency-workers" className="text-sm font-medium cursor-pointer">
                          {shareWithEmergencyWorkers
                            ? t('keysShared.emergencyWorkerSharing.enabled')
                            : t('keysShared.emergencyWorkerSharing.disabled')}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {shareWithEmergencyWorkers
                            ? t('keysShared.emergencyWorkerSharing.enabledDescription')
                            : t('keysShared.emergencyWorkerSharing.disabledDescription')}
                        </p>
                      </div>
                    </div>
                    {!shareWithEmergencyWorkers && (
                      <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            {t('keysShared.emergencyWorkerSharing.warning')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Door Breaking Preference */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('keysShared.doorBreaking.title')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('keysShared.doorBreaking.description')}
                  </p>
                  <div className="space-y-2">
                    {(Object.keys(DOOR_BREAKING_OPTIONS) as DoorBreakingPreference[]).map(optionId => {
                      const option = DOOR_BREAKING_OPTIONS[optionId];
                      const isSelected = doorBreakingPreference === optionId;
                      return (
                        <label
                          key={optionId}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-tier-naybor/5 border-tier-naybor/30'
                              : 'border-border hover:border-tier-naybor/50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-tier-naybor' : 'border-muted-foreground'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-tier-naybor" />}
                          </div>
                          <input
                            type="radio"
                            name="doorBreaking"
                            value={optionId}
                            checked={isSelected}
                            onChange={() => setDoorBreakingPreference(optionId)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              <span className="font-medium text-sm">{t(`keysShared.doorBreaking.options.${optionId}.name`)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t(`keysShared.doorBreaking.options.${optionId}.description`)}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Address summary */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{t('keysShared.yourAddress')}</span>
                  </div>
                  {address ? (
                    <p className="text-sm">
                      {address}
                      {unitNumber && `, ${t('keysShared.unit')} ${unitNumber}`}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t('keysShared.noAddressSet')}</p>
                  )}
                  {entryInstructions && (
                    <p className="text-xs text-muted-foreground mt-1">{entryInstructions}</p>
                  )}
                </div>

                {/* Key holders summary */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-tier-naybor" />
                    <span className="font-medium text-sm">
                      {t('keysShared.keyHoldersSummary', { count: keyHolders.length })}
                    </span>
                  </div>
                  {keyHolders.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {keyHolders.map(holder => {
                        const naybor = naybors.find(n => n.id === holder.nayborId);
                        return naybor ? (
                          <span
                            key={holder.nayborId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-tier-naybor/10 rounded-full text-xs"
                          >
                            {holder.keyType === 'physical' && <Key className="w-3 h-3" />}
                            {holder.keyType === 'digital' && <Smartphone className="w-3 h-3" />}
                            {holder.keyType === 'both' && <Lock className="w-3 h-3" />}
                            {naybor.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t('keysShared.noKeyHolders')}</p>
                  )}
                </div>

                {/* Permissions summary */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{t('keysShared.permissionsSummary')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>
                      {t('keysShared.mandatoryCount', { count: mandatoryScenarios.length })} {t('keysShared.mandatoryLabel')}
                    </p>
                    <p>
                      {t('keysShared.optionalCount', { count: selectedOptionalScenarios.size })} {t('keysShared.optionalLabel')}
                    </p>
                  </div>
                </div>

                {/* Emergency worker sharing summary */}
                <div className={`p-3 rounded-lg border ${
                  shareWithEmergencyWorkers
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className={`w-4 h-4 ${shareWithEmergencyWorkers ? 'text-blue-500' : 'text-amber-500'}`} />
                    <span className="font-medium text-sm">{t('keysShared.emergencyWorkerSharing.title')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shareWithEmergencyWorkers
                      ? t('keysShared.emergencyWorkerSharing.reviewEnabled')
                      : t('keysShared.emergencyWorkerSharing.reviewDisabled')}
                  </p>
                </div>

                {/* Door breaking preference summary */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{t('keysShared.doorBreaking.title')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{DOOR_BREAKING_OPTIONS[doorBreakingPreference].icon}</span>
                    <span className="text-xs text-muted-foreground">
                      {t(`keysShared.doorBreaking.options.${doorBreakingPreference}.name`)}
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {t('keysShared.reviewWarning')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <DialogFooter className="mt-4">
          {step !== 'address' && !editingNayborId && (
            <Button variant="outline" onClick={handleBack}>
              {t('actions.back')}
            </Button>
          )}
          {step !== 'review' && !editingNayborId && (
            <Button
              onClick={handleNext}
              className="bg-tier-naybor hover:bg-tier-naybor/90"
            >
              {t('actions.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {step === 'review' && (
            <Button
              onClick={handleSave}
              className="bg-tier-naybor hover:bg-tier-naybor/90"
            >
              <Check className="w-4 h-4 mr-1" />
              {t('keysShared.savePreferences')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
