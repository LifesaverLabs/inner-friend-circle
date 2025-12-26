import { motion } from 'framer-motion';
import { Heart, LogOut, Settings, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VersionBadge } from './VersionBadge';
import { LanguageSelector } from './i18n/LanguageSelector';

interface AppHeaderProps {
  isLoggedIn: boolean;
  userEmail?: string;
  onSignIn: () => void;
  onSignOut: () => void;
  onSettings?: () => void;
}

export function AppHeader({
  isLoggedIn,
  userEmail,
  onSignIn,
  onSignOut,
  onSettings
}: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.a 
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Heart className="w-7 h-7 text-primary fill-primary/20" />
          <span className="font-display text-xl font-bold text-foreground">Inner Friend</span>
          <VersionBadge />
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <LanguageSelector variant="prominent" />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[150px] truncate">
                    {userEmail}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onSettings && (
                  <>
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      {t('nav.settings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={onSignIn}>
              {t('nav.signIn')}
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}