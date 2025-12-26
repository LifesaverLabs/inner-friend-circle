import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mic, Calendar, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SunsetNudge } from '@/types/feed';

interface SunsetNudgePanelProps {
  nudges: SunsetNudge[];
  onDismiss: (nudgeId: string) => void;
  onAction?: (nudgeId: string, action: 'schedule_call' | 'send_voice_note' | 'plan_meetup') => void;
}

const ACTION_ICONS = {
  schedule_call: Phone,
  send_voice_note: Mic,
  plan_meetup: Calendar,
};

const ACTION_LABELS = {
  schedule_call: 'Schedule Call',
  send_voice_note: 'Send Voice Note',
  plan_meetup: 'Plan Meetup',
};

export function SunsetNudgePanel({
  nudges,
  onDismiss,
  onAction,
}: SunsetNudgePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (nudges.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="sunset-nudge-panel"
      className="mx-4 mb-4"
    >
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-sm">Time to Reconnect</span>
            <Badge variant="secondary" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
              {nudges.length}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Nudge list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 pt-0 space-y-2">
                {nudges.map((nudge) => (
                  <NudgeCard
                    key={nudge.id}
                    nudge={nudge}
                    onDismiss={() => onDismiss(nudge.id)}
                    onAction={onAction ? (action) => onAction(nudge.id, action) : undefined}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

interface NudgeCardProps {
  nudge: SunsetNudge;
  onDismiss: () => void;
  onAction?: (action: 'schedule_call' | 'send_voice_note' | 'plan_meetup') => void;
}

function NudgeCard({ nudge, onDismiss, onAction }: NudgeCardProps) {
  const ActionIcon = ACTION_ICONS[nudge.suggestedAction];
  const actionLabel = ACTION_LABELS[nudge.suggestedAction];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-background/50"
    >
      {/* Friend avatar */}
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-medium">
          {nudge.friendName.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{nudge.friendName}</p>
        <p className="text-xs text-muted-foreground">
          {nudge.daysSinceContact === Infinity
            ? 'Never contacted'
            : `${nudge.daysSinceContact} days since last contact`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          size="sm"
          variant="default"
          onClick={() => onAction?.(nudge.suggestedAction)}
          className="gap-1 h-8"
        >
          <ActionIcon className="w-3 h-3" />
          <span className="hidden sm:inline text-xs">{actionLabel}</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDismiss}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
