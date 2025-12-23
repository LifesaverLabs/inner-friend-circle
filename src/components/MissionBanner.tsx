import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MissionBanner() {
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
                <h3 className="font-semibold text-foreground">Face Time, Not Ad Time</h3>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                We win when you leave our site — to share real moments with the people who matter most.
                {!isExpanded && (
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="text-primary hover:underline ml-1"
                  >
                    Learn more...
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
                            <p className="text-sm font-medium">Spark Video Kalls</p>
                            <p className="text-xs text-muted-foreground">When you're apart, one click connects you</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                          <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Tend Your Circles</p>
                            <p className="text-xs text-muted-foreground">Reminders to reach out before connections fade</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                          <Heart className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Pull Closer</p>
                            <p className="text-xs text-muted-foreground">Move meaningful connections into tighter orbits</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/80 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          Our inspiration? This classic Dentyne Ice commercial — the perfect reminder 
                          that the best moments happen when you put down the phone and show up:
                        </p>
                        <div className="aspect-video max-w-md rounded-lg overflow-hidden bg-black">
                          <iframe
                            src="https://www.youtube.com/embed/kAGoqhXtrX4"
                            title="Dentyne Ice - Face Time"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 italic">
                          "Make Face Time" — that's the ideal. When distance separates you, 
                          we'll help you bridge it with video kalls. But always remember: 
                          nothing beats being there.
                        </p>
                      </div>

                      <button 
                        onClick={() => setIsExpanded(false)}
                        className="text-sm text-primary hover:underline"
                      >
                        Show less
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
