import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <TabsList className="grid w-full grid-cols-4 mb-6" aria-label={t('accessibility.feed.tabList')}>
        <TabsTrigger
          value="core"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-core"
          aria-label={t('accessibility.feed.coreTab')}
        >
          <div className="w-2 h-2 rounded-full bg-tier-core" aria-hidden="true" />
          {t('feed.coreFeed')}
        </TabsTrigger>
        <TabsTrigger
          value="inner"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-inner"
          aria-label={t('accessibility.feed.innerTab')}
        >
          <div className="w-2 h-2 rounded-full bg-tier-inner" aria-hidden="true" />
          {t('feed.innerFeed')}
        </TabsTrigger>
        <TabsTrigger
          value="outer"
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-tier-outer"
          aria-label={t('accessibility.feed.outerTab')}
        >
          <div className="w-2 h-2 rounded-full bg-tier-outer" aria-hidden="true" />
          {t('feed.outerFeed')}
        </TabsTrigger>
        <TabsTrigger
          value="manage"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
          aria-label={t('accessibility.feed.manageTab')}
        >
          {t('feed.manage')}
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
