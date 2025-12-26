import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LandingHero } from '@/components/LandingHero';
import { FriendDashboard } from '@/components/FriendDashboard';
import { DevPanel } from '@/components/DevPanel';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    // Reset showDashboard first to ensure we go back to landing
    setShowDashboard(false);
    const { error } = await signOut();
    if (error) {
      toast.error(t('auth.toasts.signOutError'));
    } else {
      toast.success(t('auth.toasts.signOutSuccess'));
    }
  };

  if (showDashboard || isAuthenticated) {
    return (
      <>
        <FriendDashboard
          isLoggedIn={isAuthenticated}
          userEmail={user?.email}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
        <DevPanel user={user} onSignOut={handleSignOut} />
      </>
    );
  }

  return (
    <>
      <LandingHero onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
      <DevPanel user={user} onSignOut={handleSignOut} />
    </>
  );
};

export default Index;