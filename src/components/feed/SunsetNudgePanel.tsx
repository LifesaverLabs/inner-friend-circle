import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mic, Calendar, X, Clock, Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SunsetNudge } from '@/types/feed';
import { TFunction } from 'i18next';

interface SunsetNudgePanelProps {
  nudges: SunsetNudge[];
  onDismiss: (nudgeId: string) => void;
  onAction?: (nudgeId: string, action: 'schedule_call' | 'send_voice_note' | 'plan_meetup') => void;
  onMarkConnected?: (nudgeId: string, friendId: string, date: Date) => void;
}

const ACTION_ICONS = {
  schedule_call: Phone,
  send_voice_note: Mic,
  plan_meetup: Calendar,
};

const ACTION_LABEL_KEYS: Record<string, string> = {
  schedule_call: 'sunsetNudge.actions.scheduleCall',
  send_voice_note: 'sunsetNudge.actions.sendVoiceNote',
  plan_meetup: 'sunsetNudge.actions.planMeetup',
};

// Generate date options for the "Connected" dropdown
function getConnectionDateOptions(t: TFunction): { label: string; date: Date }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return [
    { label: t('sunsetNudge.dateOptions.today'), date: today },
    { label: t('sunsetNudge.dateOptions.yesterday'), date: yesterday },
    { label: t('sunsetNudge.dateOptions.twoDaysAgo'), date: twoDaysAgo },
    { label: t('sunsetNudge.dateOptions.threeDaysAgo'), date: threeDaysAgo },
    { label: t('sunsetNudge.dateOptions.oneWeekAgo'), date: oneWeekAgo },
    { label: t('sunsetNudge.dateOptions.twoWeeksAgo'), date: twoWeeksAgo },
  ];
}

export function SunsetNudgePanel({
  nudges,
  onDismiss,
  onAction,
  onMarkConnected,
}: SunsetNudgePanelProps) {
  const { t } = useTranslation();
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
        {/* Header - expandable section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors rounded-t-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          aria-expanded={isExpanded}
          aria-controls="nudge-list"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="font-medium text-sm">{t('nudge.timeToReconnect')}</span>
            <Badge variant="secondary" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
              <span className="sr-only">{t('nudge.friendsNeedAttention', { count: nudges.length })}</span>
              <span aria-hidden="true">{nudges.length}</span>
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {/* Nudge list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="nudge-list"
              role="list"
              aria-label={t('accessibility.nudge.friendsList')}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 pt-0 space-y-2">
                {/* Mobile recommendation note */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pb-1">
                  <Smartphone className="w-3 h-3" aria-hidden="true" />
                  <span>{t('tending.mobileHint')}</span>
                </div>
                {nudges.map((nudge) => (
                  <NudgeCard
                    key={nudge.id}
                    nudge={nudge}
                    onDismiss={() => onDismiss(nudge.id)}
                    onAction={onAction ? (action) => onAction(nudge.id, action) : undefined}
                    onMarkConnected={onMarkConnected ? (date) => onMarkConnected(nudge.id, nudge.friendId, date) : undefined}
                    t={t}
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
  onMarkConnected?: (date: Date) => void;
  t: TFunction;
}

function NudgeCard({ nudge, onDismiss, onAction, onMarkConnected, t }: NudgeCardProps) {
  const ActionIcon = ACTION_ICONS[nudge.suggestedAction];
  const actionLabel = t(ACTION_LABEL_KEYS[nudge.suggestedAction]);
  const dateOptions = getConnectionDateOptions(t);

  // Handle clicking the main "Connected" button (defaults to today)
  const handleConnectedClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onMarkConnected?.(today);
  };

  const contactStatus = nudge.daysSinceContact === Infinity
    ? t('nudge.neverContacted')
    : t('nudge.daysSinceContact', { days: nudge.daysSinceContact });

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-background/50"
    >
      {/* Friend avatar - decorative */}
      <div
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <span className="text-sm font-medium">
          {nudge.friendName.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{nudge.friendName}</p>
        <p className="text-xs text-muted-foreground">
          {contactStatus}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0" role="group" aria-label={t('accessibility.nudge.actionGroup', { name: nudge.friendName })}>
        {/* Primary action button */}
        <Button
          size="sm"
          variant="default"
          onClick={() => onAction?.(nudge.suggestedAction)}
          className="gap-1 h-8"
          aria-label={t('accessibility.nudge.actionButton', { action: actionLabel, name: nudge.friendName })}
        >
          <ActionIcon className="w-3 h-3" aria-hidden="true" />
          <span className="hidden sm:inline text-xs">{actionLabel}</span>
        </Button>

        {/* Connected button with optional date picker */}
        {onMarkConnected && (
          <DropdownMenu>
            <div className="flex items-center">
              {/* Main Connected button - clicks default to today */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleConnectedClick}
                className="gap-1 h-8 rounded-r-none pr-1 border-r-0"
                data-testid="connected-button"
                aria-label={t('accessibility.nudge.connectedButton', { name: nudge.friendName })}
              >
                <Check className="w-3 h-3" aria-hidden="true" />
                <span className="hidden sm:inline text-xs">{t('nudge.connected')}</span>
              </Button>

              {/* Dropdown trigger for date selection */}
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-l-none pl-0 px-1"
                  data-testid="connected-date-dropdown"
                  aria-label={t('accessibility.nudge.selectDateButton', { name: nudge.friendName })}
                >
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent align="end">
              {dateOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => onMarkConnected(option.date)}
                  className="text-sm"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Dismiss button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onDismiss}
          className="h-8 w-8"
          aria-label={t('accessibility.nudge.dismissButton', { name: nudge.friendName })}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
}
