import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MissionBanner() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('mission-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mission-banner-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-xl p-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-primary fill-primary/30" />
                <h3 className="font-semibold text-foreground">{t('mission.title')}</h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('mission.description')}
                {!isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-primary hover:underline ml-1"
                  >
                    {t('mission.learnMore')}
                  </button>
                )}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                          <Video className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{t('mission.features.spark.title')}</p>
                            <p className="text-xs text-muted-foreground">{t('mission.features.spark.description')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                          <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{t('mission.features.tend.title')}</p>
                            <p className="text-xs text-muted-foreground">{t('mission.features.tend.description')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                          <Heart className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{t('mission.features.pull.title')}</p>
                            <p className="text-xs text-muted-foreground">{t('mission.features.pull.description')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/80 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('mission.inspiration')}
                        </p>
                        <div className="aspect-video max-w-md rounded-lg overflow-hidden bg-black">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/kAGoqhXtrX4"
                            title={t('mission.videoTitle')}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 italic">
                          {t('mission.quote')}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-sm text-primary hover:underline"
                      >
                        {t('mission.showLess')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
