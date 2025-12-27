import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Friend, CONTACT_METHODS } from '@/types/friend';

interface NayborSOSQuickPanelProps {
  contacts: Friend[];
  onContact?: (naybor: Friend) => void;
}

export function NayborSOSQuickPanel({ contacts, onContact }: NayborSOSQuickPanelProps) {
  const { t } = useTranslation();

  const handleCall = (naybor: Friend) => {
    if (naybor.phone) {
      window.open(`tel:${naybor.phone}`, '_self');
    }
    onContact?.(naybor);
  };

  const handleMessage = (naybor: Friend) => {
    if (naybor.phone) {
      // Use preferred contact method or default to SMS
      const method = naybor.preferredContact || 'tel';
      if (method === 'tel') {
        window.open(`sms:${naybor.phone}`, '_self');
      } else if (CONTACT_METHODS[method]) {
        window.open(CONTACT_METHODS[method].getUrl(naybor.phone), '_blank');
      }
    }
    onContact?.(naybor);
  };

  return (
    <div className="p-3 bg-tier-naybor/5" role="region" aria-label={t('accessibility.naybor.sosRegion')}>
      <p className="text-xs text-muted-foreground mb-2" id="quick-contacts-label">{t('accessibility.naybor.sosContactsList')}</p>
      <div className="space-y-2" role="list" aria-labelledby="quick-contacts-label">
        {contacts.map((naybor) => (
          <div
            key={naybor.id}
            role="listitem"
            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background/50 border border-tier-naybor/10"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-full bg-tier-naybor/10 shrink-0" aria-hidden="true">
                <User className="w-3.5 h-3.5 text-tier-naybor" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{naybor.name}</p>
                {naybor.phone && (
                  <p className="text-xs text-muted-foreground truncate">{naybor.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0" role="group" aria-label={t('accessibility.naybor.contactOptions', { name: naybor.name })}>
              {naybor.phone ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-tier-naybor hover:text-tier-naybor hover:bg-tier-naybor/10"
                    onClick={() => handleCall(naybor)}
                    aria-label={t('accessibility.naybor.callButton', { name: naybor.name })}
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-tier-naybor hover:text-tier-naybor hover:bg-tier-naybor/10"
                    onClick={() => handleMessage(naybor)}
                    aria-label={t('accessibility.naybor.messageButton', { name: naybor.name })}
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <span className="text-xs text-muted-foreground px-2">{t('nayborSOS.noPhone')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {t('nayborSOS.tapSOSForMore')}
      </p>
    </div>
  );
}
