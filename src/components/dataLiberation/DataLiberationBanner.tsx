import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'data-liberation-banner-dismissed';
const DAYS_UNTIL_REMIND = 30;

interface DataLiberationBannerProps {
  onExportClick: () => void;
  onLearnMore?: () => void;
}

export function DataLiberationBanner({
  onExportClick,
  onLearnMore,
}: DataLiberationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissedData = localStorage.getItem(STORAGE_KEY);

    if (!dismissedData) {
      setIsVisible(true);
      return;
    }

    try {
      const { dismissedAt } = JSON.parse(dismissedData);
      const daysSinceDismissed = Math.floor(
        (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Show again after 30 days as a gentle reminder
      if (daysSinceDismissed >= DAYS_UNTIL_REMIND) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dismissedAt: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          data-testid="data-liberation-banner"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-card border rounded-xl shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">
                    Your Data, Your Choice
                  </h3>
                  <button
                    onClick={handleDismiss}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Dismiss banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Export your social graph anytime to use with other
                  Dunbar-compliant networks. Your data belongs to you.
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={onExportClick}
                    className="gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export My Data
                  </Button>

                  {onLearnMore && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onLearnMore}
                      className="gap-1.5 text-muted-foreground"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
