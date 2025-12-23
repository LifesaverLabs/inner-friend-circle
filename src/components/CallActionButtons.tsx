import { useState } from 'react';
import { Video, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ContactMethod, SERVICES, ServiceType } from '@/types/contactMethod';
import { toast } from 'sonner';

interface CallActionButtonsProps {
  friendName: string;
  myMethods: ContactMethod[];
  theirMethods: ContactMethod[];
  onRequestContactInfo?: () => void;
}

export function CallActionButtons({
  friendName,
  myMethods,
  theirMethods,
  onRequestContactInfo,
}: CallActionButtonsProps) {
  const [spontaneousOpen, setSpontaneousOpen] = useState(false);
  const [scheduledOpen, setScheduledOpen] = useState(false);

  // Find compatible methods between users
  const findCompatibleMethods = (callType: 'spontaneous' | 'scheduled') => {
    const myFiltered = callType === 'spontaneous'
      ? myMethods.filter(m => m.for_spontaneous)
      : myMethods.filter(m => m.for_scheduled);
    
    const theirFiltered = callType === 'spontaneous'
      ? theirMethods.filter(m => m.for_spontaneous)
      : theirMethods.filter(m => m.for_scheduled);

    // Find shared service types
    const compatible: Array<{
      myMethod: ContactMethod;
      theirMethod: ContactMethod;
      service: ServiceType;
    }> = [];

    for (const myMethod of myFiltered) {
      const match = theirFiltered.find(t => t.service_type === myMethod.service_type);
      if (match) {
        compatible.push({
          myMethod,
          theirMethod: match,
          service: myMethod.service_type,
        });
      }
    }

    return compatible;
  };

  // Get their preferred methods (when no match exists)
  const getTheirPreferred = (callType: 'spontaneous' | 'scheduled') => {
    const methods = callType === 'spontaneous'
      ? theirMethods.filter(m => m.for_spontaneous).sort((a, b) => a.spontaneous_priority - b.spontaneous_priority)
      : theirMethods.filter(m => m.for_scheduled).sort((a, b) => a.scheduled_priority - b.scheduled_priority);
    
    return methods;
  };

  const handleCall = (method: ContactMethod) => {
    const service = SERVICES[method.service_type];
    if (service.getCallUrl) {
      const url = service.getCallUrl(method.contact_identifier);
      window.open(url, '_blank');
      toast.success(`Connecting via ${service.name}`);
    } else {
      toast.info(`Open ${service.name} to connect`);
    }
    setSpontaneousOpen(false);
    setScheduledOpen(false);
  };

  const spontaneousCompatible = findCompatibleMethods('spontaneous');
  const scheduledCompatible = findCompatibleMethods('scheduled');
  const theirSpontaneous = getTheirPreferred('spontaneous');
  const theirScheduled = getTheirPreferred('scheduled');

  const hasAnySpontaneous = spontaneousCompatible.length > 0 || theirSpontaneous.length > 0;
  const hasAnyScheduled = scheduledCompatible.length > 0 || theirScheduled.length > 0;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Spontaneous Call Button */}
        <Popover open={spontaneousOpen} onOpenChange={setSpontaneousOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:text-primary/80"
                >
                  <Video className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a kall</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-64 p-2" align="end">
            <p className="text-sm font-medium mb-2">Kall {friendName} now</p>
            {!hasAnySpontaneous ? (
              <NoContactMethods onRequest={onRequestContactInfo} />
            ) : (
              <MethodList
                compatible={spontaneousCompatible}
                fallback={theirSpontaneous}
                onSelect={handleCall}
                isCompatible={spontaneousCompatible.length > 0}
              />
            )}
          </PopoverContent>
        </Popover>

        {/* Schedule Call Button */}
        <Popover open={scheduledOpen} onOpenChange={setScheduledOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule a kall</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-64 p-2" align="end">
            <p className="text-sm font-medium mb-2">Schedule with {friendName}</p>
            {!hasAnyScheduled ? (
              <NoContactMethods onRequest={onRequestContactInfo} />
            ) : (
              <MethodList
                compatible={scheduledCompatible}
                fallback={theirScheduled}
                onSelect={handleCall}
                isCompatible={scheduledCompatible.length > 0}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}

interface MethodListProps {
  compatible: Array<{
    myMethod: ContactMethod;
    theirMethod: ContactMethod;
    service: ServiceType;
  }>;
  fallback: ContactMethod[];
  onSelect: (method: ContactMethod) => void;
  isCompatible: boolean;
}

function MethodList({ compatible, fallback, onSelect, isCompatible }: MethodListProps) {
  if (isCompatible) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground mb-2">Shared services:</p>
        {compatible.map(({ theirMethod, service }) => {
          const serviceInfo = SERVICES[service];
          return (
            <button
              key={theirMethod.id}
              onClick={() => onSelect(theirMethod)}
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="text-lg">{serviceInfo.icon}</span>
              <span className="text-sm">{serviceInfo.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground mb-2">Their preferences:</p>
      {fallback.map((method) => {
        const serviceInfo = SERVICES[method.service_type];
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method)}
            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
          >
            <span className="text-lg">{serviceInfo.icon}</span>
            <span className="text-sm">{serviceInfo.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function NoContactMethods({ onRequest }: { onRequest?: () => void }) {
  return (
    <div className="text-center py-2">
      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground mb-2">
        No contact methods available
      </p>
      {onRequest && (
        <Button size="sm" variant="outline" onClick={onRequest} className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Request contact info
        </Button>
      )}
    </div>
  );
}
