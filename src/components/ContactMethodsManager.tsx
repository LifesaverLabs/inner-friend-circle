import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Video, Calendar } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { useContactMethods } from '@/hooks/useContactMethods';
import { ServiceType, SERVICES, SERVICE_LIST } from '@/types/contactMethod';
import { toast } from 'sonner';

interface ContactMethodsManagerProps {
  userId: string;
  compact?: boolean;
}

export function ContactMethodsManager({ userId, compact = false }: ContactMethodsManagerProps) {
  const {
    contactMethods,
    isLoading,
    addContactMethod,
    removeContactMethod,
    getSpontaneousMethods,
    getScheduledMethods,
  } = useContactMethods(userId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newService, setNewService] = useState<ServiceType>('phone');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [forSpontaneous, setForSpontaneous] = useState(true);
  const [forScheduled, setForScheduled] = useState(true);

  const handleAdd = async () => {
    if (!newIdentifier.trim()) {
      toast.error('Please enter contact information');
      return;
    }

    const result = await addContactMethod(newService, newIdentifier.trim(), {
      forSpontaneous,
      forScheduled,
      label: newLabel.trim() || undefined,
    });

    if (result) {
      setDialogOpen(false);
      setNewIdentifier('');
      setNewLabel('');
      setNewService('phone');
      setForSpontaneous(true);
      setForScheduled(true);
    }
  };

  const spontaneousMethods = getSpontaneousMethods();
  const scheduledMethods = getScheduledMethods();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Contact Methods</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <AddMethodDialogContent
              newService={newService}
              setNewService={setNewService}
              newIdentifier={newIdentifier}
              setNewIdentifier={setNewIdentifier}
              newLabel={newLabel}
              setNewLabel={setNewLabel}
              forSpontaneous={forSpontaneous}
              setForSpontaneous={setForSpontaneous}
              forScheduled={forScheduled}
              setForScheduled={setForScheduled}
              onAdd={handleAdd}
            />
          </Dialog>
        </div>
        <MethodsList methods={contactMethods} onRemove={removeContactMethod} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Contact Methods</h2>
          <p className="text-sm text-muted-foreground">
            Add your preferred video call and messaging services
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact Method
            </Button>
          </DialogTrigger>
          <AddMethodDialogContent
            newService={newService}
            setNewService={setNewService}
            newIdentifier={newIdentifier}
            setNewIdentifier={setNewIdentifier}
            newLabel={newLabel}
            setNewLabel={setNewLabel}
            forSpontaneous={forSpontaneous}
            setForSpontaneous={setForSpontaneous}
            forScheduled={forScheduled}
            setForScheduled={setForScheduled}
            onAdd={handleAdd}
          />
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Spontaneous Kalls
            </CardTitle>
            <CardDescription>
              Services for instant, interruptive video calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {spontaneousMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No spontaneous call methods added yet
              </p>
            ) : (
              <MethodsList
                methods={spontaneousMethods}
                onRemove={removeContactMethod}
                showPriority
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduled Kalls
            </CardTitle>
            <CardDescription>
              Services for planned video meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No scheduled call methods added yet
              </p>
            ) : (
              <MethodsList
                methods={scheduledMethods}
                onRemove={removeContactMethod}
                showPriority
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MethodsListProps {
  methods: Array<{
    id: string;
    service_type: ServiceType;
    contact_identifier: string;
    label?: string;
    spontaneous_priority?: number;
  }>;
  onRemove: (id: string) => void;
  showPriority?: boolean;
}

function MethodsList({ methods, onRemove, showPriority }: MethodsListProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {methods.map((method, index) => {
          const service = SERVICES[method.service_type];
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
            >
              {showPriority && (
                <span className="text-xs font-medium text-muted-foreground w-5">
                  #{index + 1}
                </span>
              )}
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

interface AddMethodDialogContentProps {
  newService: ServiceType;
  setNewService: (s: ServiceType) => void;
  newIdentifier: string;
  setNewIdentifier: (s: string) => void;
  newLabel: string;
  setNewLabel: (s: string) => void;
  forSpontaneous: boolean;
  setForSpontaneous: (b: boolean) => void;
  forScheduled: boolean;
  setForScheduled: (b: boolean) => void;
  onAdd: () => void;
}

function AddMethodDialogContent({
  newService,
  setNewService,
  newIdentifier,
  setNewIdentifier,
  newLabel,
  setNewLabel,
  forSpontaneous,
  setForSpontaneous,
  forScheduled,
  setForScheduled,
  onAdd,
}: AddMethodDialogContentProps) {
  const selectedService = SERVICES[newService];

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Contact Method</DialogTitle>
        <DialogDescription>
          Add a way for your friends to reach you
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Service</Label>
          <Select value={newService} onValueChange={(v) => setNewService(v as ServiceType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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

        <div className="space-y-2">
          <Label>Contact Info</Label>
          <Input
            placeholder={selectedService.placeholder}
            value={newIdentifier}
            onChange={(e) => setNewIdentifier(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Label (optional)</Label>
          <Input
            placeholder="e.g., Personal, Work"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Available for</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Spontaneous Kalls</span>
            <Switch checked={forSpontaneous} onCheckedChange={setForSpontaneous} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scheduled Kalls</span>
            <Switch checked={forScheduled} onCheckedChange={setForScheduled} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={onAdd} disabled={!forSpontaneous && !forScheduled}>
          Add Method
        </Button>
      </div>
    </DialogContent>
  );
}
