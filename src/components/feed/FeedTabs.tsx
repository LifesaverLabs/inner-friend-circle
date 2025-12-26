import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TierFeed } from './TierFeed';
import { Friend, TierType } from '@/types/friend';

type FeedTab = 'core' | 'inner' | 'outer' | 'manage';

interface FeedTabsProps {
  friends: Friend[];
  isLoggedIn: boolean;
  userId?: string;
  // Manage tab content render prop
  renderManageContent?: () => React.ReactNode;
}

const VALID_TABS: FeedTab[] = ['core', 'inner', 'outer', 'manage'];

export function FeedTabs({
  friends,
  isLoggedIn,
  userId,
  renderManageContent,
}: FeedTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine default tab based on user state
  const defaultTab = useMemo((): FeedTab => {
    // If logged out or no friends, show Manage tab
    if (!isLoggedIn || friends.length === 0) {
      return 'manage';
    }
    // Returning users with friends see Core Feed
    return 'core';
  }, [isLoggedIn, friends.length]);

  // Get initial tab from URL or use default
  const getTabFromUrl = (): FeedTab => {
    const urlTab = searchParams.get('tab') as FeedTab | null;
    if (urlTab && VALID_TABS.includes(urlTab)) {
      return urlTab;
    }
    return defaultTab;
  };

  // Use local state for immediate updates, synced with URL
  const [currentTab, setCurrentTab] = useState<FeedTab>(getTabFromUrl);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlTab = getTabFromUrl();
    if (urlTab !== currentTab) {
      setCurrentTab(urlTab);
    }
  }, [searchParams, defaultTab]);

  // Handle tab change - update both local state and URL
  const handleTabChange = (value: string) => {
    const newTab = value as FeedTab;
    setCurrentTab(newTab);

    if (newTab === defaultTab) {
      // Remove tab param if it's the default
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', newTab);
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6" aria-label="Friend circle feeds">
        <TabsTrigger
          value="core"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-core"
          aria-label="Core Feed - Your closest friends"
        >
          <div className="w-2 h-2 rounded-full bg-tier-core" aria-hidden="true" />
          Core Feed
        </TabsTrigger>
        <TabsTrigger
          value="inner"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-inner"
          aria-label="Inner Feed - Close friends"
        >
          <div className="w-2 h-2 rounded-full bg-tier-inner" aria-hidden="true" />
          Inner Feed
        </TabsTrigger>
        <TabsTrigger
          value="outer"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-outer"
          aria-label="Outer Plus Feed - Extended circle including naybors"
        >
          <div className="w-2 h-2 rounded-full bg-tier-outer" aria-hidden="true" />
          Outer+
        </TabsTrigger>
        <TabsTrigger
          value="manage"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
          aria-label="Manage your friend circle"
        >
          Manage
        </TabsTrigger>
      </TabsList>

      <TabsContent value="core">
        <TierFeed
          tier="core"
          friends={friends}
          userId={userId}
          isLoggedIn={isLoggedIn}
          onGoToManage={() => handleTabChange('manage')}
        />
      </TabsContent>

      <TabsContent value="inner">
        <TierFeed
          tier="inner"
          friends={friends}
          userId={userId}
          isLoggedIn={isLoggedIn}
          onGoToManage={() => handleTabChange('manage')}
        />
      </TabsContent>

      <TabsContent value="outer">
        <TierFeed
          tier="outer"
          friends={friends}
          userId={userId}
          isLoggedIn={isLoggedIn}
          onGoToManage={() => handleTabChange('manage')}
        />
      </TabsContent>

      <TabsContent value="manage" data-testid="manage-content">
        {renderManageContent ? renderManageContent() : null}
      </TabsContent>
    </Tabs>
  );
}
