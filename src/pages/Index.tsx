import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHero } from '@/components/LandingHero';
import { FriendDashboard } from '@/components/FriendDashboard';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Index = () => {
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
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  if (showDashboard || isAuthenticated) {
    return (
      <FriendDashboard
        isLoggedIn={isAuthenticated}
        userEmail={user?.email}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
    );
  }

  return <LandingHero onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
};

export default Index;