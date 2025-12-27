import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Friend } from '@/types/friend';
import {
  getSOSNetworkStatus,
  getQuickSOSContacts,
  hasMinimumSOSNetwork,
} from '@/types/nayborSOS';
import { NayborSOSDialog } from './NayborSOSDialog';
import { NayborSOSQuickPanel } from './NayborSOSQuickPanel';

interface NayborSOSBannerProps {
  naybors: Friend[];
  onContactNaybor?: (naybor: Friend) => void;
}

export function NayborSOSBanner({ naybors, onContactNaybor }: NayborSOSBannerProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quickPanelExpanded, setQuickPanelExpanded] = useState(false);

  const status = getSOSNetworkStatus(naybors.length);
  const quickContacts = getQuickSOSContacts(naybors, 3);
  const hasMinNetwork = hasMinimumSOSNetwork(naybors.length);

  // Don't show banner if no naybors
  if (naybors.length === 0) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl border border-tier-naybor/30 bg-tier-naybor/5 overflow-hidden"
      >
        {/* Main Banner */}
        <div className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-tier-naybor/20" aria-hidden="true">
              <Shield className="w-5 h-5 text-tier-naybor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{t('nayborSOS.title')}</span>
                {!hasMinNetwork && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-warning/20 text-warning">
                    {t('nayborSOS.addMoreNaybors')}
                  </span>
                )}
              </div>
              <p className={`text-xs ${status.color}`}>{status.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick expand toggle for mobile */}
            {quickContacts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuickPanelExpanded(!quickPanelExpanded)}
                className="gap-1 text-tier-naybor hover:text-tier-naybor hover:bg-tier-naybor/10"
                aria-expanded={quickPanelExpanded}
                aria-controls="quick-sos-panel"
                aria-label={quickPanelExpanded ? t('accessibility.naybor.hideQuickContacts') : t('accessibility.naybor.showQuickContacts')}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t('nayborSOS.quick')}
                {quickPanelExpanded ? (
                  <ChevronUp className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                )}
              </Button>
            )}

            {/* Full SOS Dialog Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="gap-1 bg-tier-naybor hover:bg-tier-naybor/90 text-white"
              aria-label="Open Naybor SOS emergency contact dialog"
            >
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              SOS
            </Button>
          </div>
        </div>

        {/* Quick Panel (expandable) */}
        <AnimatePresence>
          {quickPanelExpanded && quickContacts.length > 0 && (
            <motion.div
              id="quick-sos-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-tier-naybor/20"
            >
              <NayborSOSQuickPanel
                contacts={quickContacts}
                onContact={onContactNaybor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full SOS Dialog */}
      <NayborSOSDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        naybors={naybors}
        onContactNaybor={onContactNaybor}
      />
    </>
  );
}
