import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PenLine, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComposePostDialog } from './ComposePostDialog';
import { ContactMethod, CONTACT_METHODS, ContactMethodInfo } from '@/types/friend';

type FeedTier = 'core' | 'inner' | 'outer';

interface FeedHeaderProps {
  tier: FeedTier;
  isLoggedIn: boolean;
  postCount: number;
  defaultContactMethod?: ContactMethod;
  onDefaultContactMethodChange?: (method: ContactMethod) => void;
  composeOpen?: boolean;
  onComposeOpenChange?: (open: boolean) => void;
}

// Default methods that make sense for each tier
const DEFAULT_CONTACT_METHODS: Record<FeedTier, ContactMethod> = {
  core: 'facetime',  // Core: Most intimate - FaceTime
  inner: 'tel',      // Inner: Phone call
  outer: 'tel',      // Outer: Phone call
};

export function FeedHeader({
  tier,
  isLoggedIn,
  postCount,
  defaultContactMethod,
  onDefaultContactMethodChange,
  composeOpen: externalComposeOpen,
  onComposeOpenChange,
}: FeedHeaderProps) {
  const { t } = useTranslation();
  // Use internal state if no external control provided
  const [internalComposeOpen, setInternalComposeOpen] = useState(false);
  const composeOpen = externalComposeOpen ?? internalComposeOpen;
  const setComposeOpen = onComposeOpenChange ?? setInternalComposeOpen;

  const effectiveDefaultMethod = defaultContactMethod || DEFAULT_CONTACT_METHODS[tier];

  return (
    <>
      <div
        data-testid="feed-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-inherit gap-3"
      >
        <div>
          <h2 className="text-lg font-semibold">{t(`feedHeader.tierNames.${tier}`)} {t('feedHeader.feed')}</h2>
          <p className="text-sm text-muted-foreground">
            {t(`feedHeader.tierDescriptions.${tier}`)}
            {postCount > 0 && (
              <span className="ml-2">• {t('feedHeader.postCount', { count: postCount })}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Default contact method selector */}
          {onDefaultContactMethodChange && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <Select
                value={effectiveDefaultMethod}
                onValueChange={(value) => onDefaultContactMethodChange(value as ContactMethod)}
              >
                <SelectTrigger
                  className="w-[130px] h-8 text-xs"
                  data-testid="default-contact-method-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(CONTACT_METHODS) as [ContactMethod, ContactMethodInfo][]).map(([key, method]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className={`text-xs ${method.warning ? 'text-amber-600 dark:text-amber-500' : ''}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                        {method.warning && <span title={method.warning}>⚠️</span>}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isLoggedIn && (
            <Button
              onClick={() => setComposeOpen(true)}
              size="sm"
              className="gap-2"
            >
              <PenLine className="w-4 h-4" />
              {t('feedHeader.share')}
            </Button>
          )}
        </div>
      </div>

      <ComposePostDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        defaultVisibility={[tier]}
      />
    </>
  );
}
