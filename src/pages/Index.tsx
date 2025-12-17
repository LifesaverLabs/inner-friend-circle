import { useState } from 'react';
import { LandingHero } from '@/components/LandingHero';
import { FriendDashboard } from '@/components/FriendDashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  const handleSignIn = () => {
    setShowDashboard(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setShowDashboard(false);
  };

  if (showDashboard) {
    return (
      <FriendDashboard
        isLoggedIn={isLoggedIn}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
    );
  }

  return <LandingHero onGetStarted={handleGetStarted} />;
};

export default Index;