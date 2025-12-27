import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Video, Calendar, HelpCircle, Info, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useContactMethods } from '@/hooks/useContactMethods';
import { ServiceType, SERVICES, SERVICE_LIST, ContactMethod } from '@/types/contactMethod';
import { toast } from 'sonner';

// Detailed guidance for each service
const SERVICE_GUIDANCE: Record<ServiceType, { howToFind: string; example: string; tip?: string }> = {
  real_face_time: {
    howToFind: 'Specify your city, neighborhood, or favorite meeting spot. This helps friends know where you\'re available for in-person connection.',
    example: 'San Francisco, CA or "Coffee at Blue Bottle"',
    tip: 'Nothing beats real face time — prioritize meeting in person when possible!',
  },
  phone: {
    howToFind: 'Use your mobile or landline phone number with country code.',
    example: '+1 555-123-4567',
  },
  facetime: {
    howToFind: 'Use the phone number or Apple ID email linked to your FaceTime account. Find it in Settings → FaceTime on your iPhone/Mac.',
    example: '+1 555-123-4567 or you@icloud.com',
    tip: 'FaceTime only works between Apple devices.',
  },
  whatsapp: {
    howToFind: 'Use the phone number registered with WhatsApp, including country code. Find it in WhatsApp → Settings → tap your profile.',
    example: '+1 555-123-4567',
    tip: 'Include the + and country code without spaces or dashes.',
  },
  signal: {
    howToFind: 'Use the phone number registered with Signal. Find it in Signal → Settings → tap your profile picture.',
    example: '+1 555-123-4567',
    tip: 'Signal requires both parties to have the app installed.',
  },
  telegram: {
    howToFind: 'Use your Telegram username (without @) or phone number. Find your username in Telegram → Settings → Username.',
    example: 'your_username or +1 555-123-4567',
    tip: 'Usernames work better than phone numbers for privacy.',
  },
  zoom: {
    howToFind: 'Use your Personal Meeting ID (PMI) or personal meeting link. Find it in Zoom → Meetings → Personal Meeting ID.',
    example: '123-456-7890 or https://zoom.us/j/1234567890',
    tip: 'Your PMI stays the same across all meetings.',
  },
  google_meet: {
    howToFind: 'Use your Gmail address. Friends can start a Meet and invite you, or use your personal meeting link from Google Calendar.',
    example: 'you@gmail.com',
    tip: 'Works best when both parties have Google accounts.',
  },
  teams: {
    howToFind: 'Use your Microsoft work or personal email. Find it in Teams → click your profile picture.',
    example: 'you@company.com or you@outlook.com',
  },
  discord: {
    howToFind: 'Use your Discord username or User ID. Find your username in Discord → Settings → My Account.',
    example: 'username#1234 or 123456789012345678',
    tip: 'For User ID: Enable Developer Mode, right-click your name, Copy ID.',
  },
  skype: {
    howToFind: 'Use your Skype Name. Find it in Skype → Settings → Account & Profile → Skype Name.',
    example: 'live:your.name or your.skypename',
  },
  webex: {
    howToFind: 'Use your Webex Personal Room link or email. Find your room link in Webex → Preferences → My Personal Room.',
    example: 'https://meet.webex.com/your.room or you@company.com',
  },
  slack: {
    howToFind: 'Use your Slack email or workspace member ID. Note: Slack Huddles only work within shared workspaces.',
    example: 'you@company.com',
    tip: 'Both parties must be in the same Slack workspace.',
  },
};

interface ContactMethodsManagerProps {
  userId: string;
  compact?: boolean;
}

export function ContactMethodsManager({ userId, compact = false }: ContactMethodsManagerProps) {
  const { t } = useTranslation();
  const {
    contactMethods,
    isLoading,
    addContactMethod,
    removeContactMethod,
    reorderPriorities,
    getSpontaneousMethods,
    getScheduledMethods,
  } = useContactMethods(userId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newService, setNewService] = useState<ServiceType>('phone');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [forSpontaneous, setForSpontaneous] = useState(true);
  const [forScheduled, setForScheduled] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = async () => {
    if (!newIdentifier.trim()) {
      toast.error(t('contactMethods.toasts.enterInfo'));
      return;
    }

    const result = await addContactMethod(newService, newIdentifier.trim(), {
      forSpontaneous,
      forScheduled,
      label: newLabel.trim() || undefined,
    });

    if (result) {
      setDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewIdentifier('');
    setNewLabel('');
    setNewService('phone');
    setForSpontaneous(true);
    setForScheduled(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleDragEnd = (callType: 'spontaneous' | 'scheduled') => (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const methods = callType === 'spontaneous' ? getSpontaneousMethods() : getScheduledMethods();
      const oldIndex = methods.findIndex((m) => m.id === active.id);
      const newIndex = methods.findIndex((m) => m.id === over.id);
      
      const reordered = arrayMove(methods, oldIndex, newIndex);
      reorderPriorities(reordered.map(m => m.id), callType);
    }
  };

  const spontaneousMethods = getSpontaneousMethods();
  const scheduledMethods = getScheduledMethods();
  const selectedService = SERVICES[newService];
  const guidance = SERVICE_GUIDANCE[newService];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const AddMethodDialog = (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      setDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size={compact ? 'sm' : 'default'} variant={compact ? 'outline' : 'default'}>
          <Plus className="w-4 h-4 mr-1" />
          {compact ? t('contactMethods.addButtonCompact') : t('contactMethods.addButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('contactMethods.addDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('contactMethods.addDialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label>{t('contactMethods.serviceLabel')}</Label>
            <Select value={newService} onValueChange={(v) => setNewService(v as ServiceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
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

          {/* Guidance Box */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-foreground">{guidance.howToFind}</p>
                <p className="text-muted-foreground mt-1">
                  <span className="font-medium">{t('contactMethods.guidance.example')}:</span> {guidance.example}
                </p>
                {guidance.tip && (
                  <p className="text-primary/80 mt-1 text-xs">
                    💡 {guidance.tip}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info Input */}
          <div className="space-y-2">
            <Label htmlFor="contact-identifier">
              {t('contactMethods.contactInfoLabel', { service: selectedService.name })}
            </Label>
            <Input
              id="contact-identifier"
              placeholder={selectedService.placeholder}
              value={newIdentifier}
              onChange={(e) => setNewIdentifier(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newIdentifier.trim()) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="contact-label">{t('contactMethods.labelOptional')}</Label>
            <Input
              id="contact-label"
              placeholder={t('contactMethods.labelPlaceholder')}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t('contactMethods.labelHint')}
            </p>
          </div>

          {/* Call Type Toggles */}
          <div className="space-y-3 pt-2">
            <Label>{t('contactMethods.availableFor')}</Label>
            <TooltipProvider>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('contactMethods.spontaneousKalls')}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{t('contactMethods.spontaneousTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch checked={forSpontaneous} onCheckedChange={setForSpontaneous} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('contactMethods.scheduledKalls')}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{t('contactMethods.scheduledTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch checked={forScheduled} onCheckedChange={setForScheduled} />
              </div>
            </TooltipProvider>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!newIdentifier.trim() || (!forSpontaneous && !forScheduled)}
          >
            {t('contactMethods.addMethod')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{t('contactMethods.title')}</h3>
          {AddMethodDialog}
        </div>
        <MethodsList methods={contactMethods} onRemove={removeContactMethod} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('contactMethods.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('contactMethods.subtitle')}
          </p>
        </div>
        {AddMethodDialog}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              {t('contactMethods.spontaneousKalls')}
            </CardTitle>
            <CardDescription>
              {t('contactMethods.dragReorderHint')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {spontaneousMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('contactMethods.noSpontaneousMethods')}
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd('spontaneous')}
              >
                <SortableContext
                  items={spontaneousMethods.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {spontaneousMethods.map((method, index) => (
                      <SortableMethodItem
                        key={method.id}
                        method={method}
                        index={index}
                        onRemove={removeContactMethod}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('contactMethods.scheduledKalls')}
            </CardTitle>
            <CardDescription>
              {t('contactMethods.dragReorderHint')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('contactMethods.noScheduledMethods')}
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd('scheduled')}
              >
                <SortableContext
                  items={scheduledMethods.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {scheduledMethods.map((method, index) => (
                      <SortableMethodItem
                        key={method.id}
                        method={method}
                        index={index}
                        onRemove={removeContactMethod}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface SortableMethodItemProps {
  method: ContactMethod;
  index: number;
  onRemove: (id: string) => void;
}

function SortableMethodItem({ method, index, onRemove }: SortableMethodItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: method.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const service = SERVICES[method.service_type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-muted/50 rounded-lg group ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="text-xs font-medium text-muted-foreground w-5">
        #{index + 1}
      </span>
      <span className="text-xl">{service.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{service.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {method.label ? `${method.label}: ` : ''}
          {method.contact_identifier}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(method.id)}
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}

interface MethodsListProps {
  methods: ContactMethod[];
  onRemove: (id: string) => void;
}

function MethodsList({ methods, onRemove }: MethodsListProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {methods.map((method) => {
          const service = SERVICES[method.service_type];
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
            >
              <span className="text-xl">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{service.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {method.label ? `${method.label}: ` : ''}
                  {method.contact_identifier}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(method.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
