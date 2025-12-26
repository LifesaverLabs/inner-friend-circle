import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ParasocialShare {
  id: string;
  creator_id: string;
  title: string;
  url: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
  creator_profile?: {
    display_name: string | null;
    user_handle: string | null;
  };
}

export interface ParasocialFollow {
  id: string;
  follower_id: string;
  parasocial_id: string;
  created_at: string;
}

export interface EngagementStats {
  share_id: string;
  total_clicks: number;
  follower_count: number;
  click_percentage: number;
}

export function useParasocial(userId: string | undefined) {
  const [isParasocialPersonality, setIsParasocialPersonality] = useState(false);
  const [myShares, setMyShares] = useState<ParasocialShare[]>([]);
  const [feedShares, setFeedShares] = useState<ParasocialShare[]>([]);
  const [myFollows, setMyFollows] = useState<ParasocialFollow[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [engagementStats, setEngagementStats] = useState<Record<string, EngagementStats>>({});
  const [seenShares, setSeenShares] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch user's parasocial status
  const fetchParasocialStatus = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_parasocial_personality')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setIsParasocialPersonality(data.is_parasocial_personality);
    }
  }, [userId]);

  // Fetch shares created by this user (if they are a parasocial personality)
  const fetchMyShares = useCallback(async () => {
    if (!userId || !isParasocialPersonality) {
      setMyShares([]);
      return;
    }

    const { data, error } = await supabase
      .from('parasocial_shares')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyShares(data);
    }
  }, [userId, isParasocialPersonality]);

  // Fetch follower count
  const fetchFollowerCount = useCallback(async () => {
    if (!userId || !isParasocialPersonality) {
      setFollowerCount(0);
      return;
    }

    const { count, error } = await supabase
      .from('parasocial_follows')
      .select('*', { count: 'exact', head: true })
      .eq('parasocial_id', userId);

    if (!error && count !== null) {
      setFollowerCount(count);
    }
  }, [userId, isParasocialPersonality]);

  // Fetch engagement stats for creator's shares
  const fetchEngagementStats = useCallback(async () => {
    if (!userId || !isParasocialPersonality || myShares.length === 0) {
      setEngagementStats({});
      return;
    }

    const shareIds = myShares.map(s => s.id);
    const { data: engagements, error } = await supabase
      .from('parasocial_engagements')
      .select('share_id')
      .in('share_id', shareIds);

    if (!error && engagements) {
      const stats: Record<string, EngagementStats> = {};
      
      for (const share of myShares) {
        const clicks = engagements.filter(e => e.share_id === share.id).length;
        stats[share.id] = {
          share_id: share.id,
          total_clicks: clicks,
          follower_count: followerCount,
          click_percentage: followerCount > 0 ? (clicks / followerCount) * 100 : 0,
        };
      }
      
      setEngagementStats(stats);
    }
  }, [userId, isParasocialPersonality, myShares, followerCount]);

  // Fetch content feed from parasocials the user follows
  const fetchFeedShares = useCallback(async () => {
    if (!userId) {
      setFeedShares([]);
      return;
    }

    // Get list of parasocials user follows
    const { data: follows, error: followError } = await supabase
      .from('parasocial_follows')
      .select('parasocial_id')
      .eq('follower_id', userId);

    if (followError || !follows || follows.length === 0) {
      setFeedShares([]);
      return;
    }

    const parasocialIds = follows.map(f => f.parasocial_id);

    // Get active shares from followed parasocials
    const { data: shares, error: shareError } = await supabase
      .from('parasocial_shares')
      .select(`
        *,
        creator_profile:profiles!parasocial_shares_creator_id_fkey(display_name, user_handle)
      `)
      .in('creator_id', parasocialIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!shareError && shares) {
      setFeedShares(shares as ParasocialShare[]);
    }

    // Fetch which shares user has already clicked
    const { data: engagements } = await supabase
      .from('parasocial_engagements')
      .select('share_id')
      .eq('user_id', userId);

    if (engagements) {
      setSeenShares(new Set(engagements.map(e => e.share_id)));
    }
  }, [userId]);

  // Toggle parasocial personality status
  const setParasocialPersonality = async (enabled: boolean) => {
    if (!userId) return { success: false, error: 'Not logged in' };

    const { error } = await supabase
      .from('profiles')
      .update({ is_parasocial_personality: enabled })
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    setIsParasocialPersonality(enabled);
    return { success: true };
  };

  // Create a new share
  const createShare = async (title: string, url: string, description?: string) => {
    if (!userId) return { success: false, error: 'Not logged in' };
    if (!isParasocialPersonality) return { success: false, error: 'Not a parasocial personality' };

    const { data, error } = await supabase
      .from('parasocial_shares')
      .insert({
        creator_id: userId,
        title,
        url,
        description,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    setMyShares(prev => [data, ...prev]);
    return { success: true, share: data };
  };

  // Delete a share
  const deleteShare = async (shareId: string) => {
    if (!userId) return { success: false, error: 'Not logged in' };

    const { error } = await supabase
      .from('parasocial_shares')
      .delete()
      .eq('id', shareId)
      .eq('creator_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    setMyShares(prev => prev.filter(s => s.id !== shareId));
    return { success: true };
  };

  // Follow a parasocial personality
  const followParasocial = async (parasocialId: string) => {
    if (!userId) return { success: false, error: 'Not logged in' };

    const { data, error } = await supabase
      .from('parasocial_follows')
      .insert({
        follower_id: userId,
        parasocial_id: parasocialId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Already following' };
      }
      return { success: false, error: error.message };
    }

    setMyFollows(prev => [...prev, data]);
    return { success: true };
  };

  // Unfollow a parasocial personality
  const unfollowParasocial = async (parasocialId: string) => {
    if (!userId) return { success: false, error: 'Not logged in' };

    const { error } = await supabase
      .from('parasocial_follows')
      .delete()
      .eq('follower_id', userId)
      .eq('parasocial_id', parasocialId);

    if (error) {
      return { success: false, error: error.message };
    }

    setMyFollows(prev => prev.filter(f => f.parasocial_id !== parasocialId));
    return { success: true };
  };

  // Record engagement (click) on a share
  const recordEngagement = async (shareId: string) => {
    if (!userId) return { success: false, error: 'Not logged in' };

    const { error } = await supabase
      .from('parasocial_engagements')
      .upsert({
        share_id: shareId,
        user_id: userId,
      }, { onConflict: 'share_id,user_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    setSeenShares(prev => new Set([...prev, shareId]));
    return { success: true };
  };

  // Check if a user is a parasocial personality by their handle or name
  const findParasocialByHandle = async (handle: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, user_handle, is_parasocial_personality')
      .eq('is_parasocial_personality', true)
      .or(`user_handle.ilike.${handle},display_name.ilike.%${handle}%`)
      .limit(10);

    if (error) {
      return { success: false, error: error.message, results: [] };
    }

    return { success: true, results: data || [] };
  };

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([
        fetchParasocialStatus(),
        fetchFeedShares(),
      ]).finally(() => setLoading(false));
    }
  }, [userId, fetchParasocialStatus, fetchFeedShares]);

  // Fetch creator-specific data when status changes
  useEffect(() => {
    if (isParasocialPersonality) {
      fetchMyShares();
      fetchFollowerCount();
    }
  }, [isParasocialPersonality, fetchMyShares, fetchFollowerCount]);

  // Fetch engagement stats when shares or follower count changes
  useEffect(() => {
    if (myShares.length > 0 && followerCount >= 0) {
      fetchEngagementStats();
    }
  }, [myShares, followerCount, fetchEngagementStats]);

  return {
    isParasocialPersonality,
    setParasocialPersonality,
    myShares,
    feedShares,
    followerCount,
    engagementStats,
    seenShares,
    loading,
    createShare,
    deleteShare,
    followParasocial,
    unfollowParasocial,
    recordEngagement,
    findParasocialByHandle,
    refetch: () => {
      fetchParasocialStatus();
      fetchMyShares();
      fetchFeedShares();
      fetchFollowerCount();
    },
  };
}
