import { motion } from 'framer-motion';
import { Heart, Users, ArrowRight, Shield, Sparkles, Video, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DunbarVisualization } from './DunbarVisualization';
import { VersionBadge } from './VersionBadge';

interface LandingHeroProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export function LandingHero({ onGetStarted, onSignIn }: LandingHeroProps) {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Heart className="w-8 h-8 text-primary fill-primary/20" />
          <span className="font-display text-2xl font-bold text-foreground">Inner Friend</span>
          <VersionBadge />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="outline" onClick={onSignIn || onGetStarted}>
            Sign In
          </Button>
        </motion.div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 max-w-xl text-center lg:text-left"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Curate Your
            <br />
            <span className="text-primary">Closest Friendships</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Based on Dunbar's research, we can only truly maintain about 5 intimate friendships, 
            15 close friends, and 150 meaningful connections. Inner Friend helps you intentionally 
            nurture the relationships that matter most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={onGetStarted} className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onGetStarted}>
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0"
        >
          <DunbarVisualization />
        </motion.div>
      </main>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Intentional Limits"
            description="Science shows we have natural limits to meaningful relationships. Embrace them to focus on who truly matters."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Private by Default"
            description="Your lists stay on your device. Create an account only if you want persistence and optional mutual matching."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Mutual Discovery"
            description="Optionally learn when someone you've listed as close has also listed you — a gentle celebration of reciprocity."
          />
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
            <Video className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Face Time, Not Ad Time
            </h2>
            <p className="text-muted-foreground mb-6 text-balance">
              We win when you leave our site — to share real moments with the people who matter most.
              When distance separates you, we'll help you spark video kalls. But nothing beats being there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.youtube.com/watch?v=kAGoqhXtrX4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Our inspiration: Dentyne Ice "Make Face Time"
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Asymmetry Message */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <blockquote className="font-display text-xl md:text-2xl text-foreground/80 italic">
            "Not all relationships are symmetrical — and that's perfectly natural. 
            The goal isn't perfect balance, but intentional presence."
          </blockquote>
        </motion.div>
      </section>
    </section>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}