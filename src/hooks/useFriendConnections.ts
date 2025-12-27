import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CircleTier = 'core' | 'inner' | 'outer';
export type ConnectionStatus = 'pending' | 'confirmed' | 'declined';

export interface FriendConnection {
  id: string;
  requester_id: string;
  target_user_id: string;
  circle_tier: CircleTier; // How the REQUESTER classifies the TARGET
  target_circle_tier: CircleTier | null; // How the TARGET classifies the REQUESTER (set on confirmation)
  status: ConnectionStatus;
  disclose_circle: boolean;
  matched_contact_method_id: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  // Joined data
  requester_profile?: {
    display_name: string | null;
    user_handle: string | null;
    avatar_url: string | null;
  };
  target_profile?: {
    display_name: string | null;
    user_handle: string | null;
    avatar_url: string | null;
  };
  matched_contact_method?: {
    service_type: string;
    contact_identifier: string;
  };
}

export function useFriendConnections(userId: string | undefined) {
  const { t } = useTranslation();
  const [connections, setConnections] = useState<FriendConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!userId) {
      setConnections([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('friend_connections')
        .select(`
          *,
          requester_profile:profiles!friend_connections_requester_id_fkey(
            display_name, user_handle, avatar_url
          ),
          target_profile:profiles!friend_connections_target_user_id_fkey(
            display_name, user_handle, avatar_url
          ),
          matched_contact_method:contact_methods(
            service_type, contact_identifier
          )
        `)
        .or(`requester_id.eq.${userId},target_user_id.eq.${userId}`);

      if (error) throw error;

      const allConnections = (data || []) as unknown as FriendConnection[];
      
      // Separate confirmed connections and pending requests for the current user
      const confirmed = allConnections.filter(c => c.status === 'confirmed');
      const pending = allConnections.filter(
        c => c.status === 'pending' && c.target_user_id === userId
      );

      setConnections(confirmed);
      setPendingRequests(pending);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    fetchConnections();

    const channel = supabase
      .channel('friend-connections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_connections',
        },
        () => {
          fetchConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchConnections]);

  // Find a user by their contact identifier
  const findUserByContactInfo = useCallback(async (
    serviceType: string,
    contactIdentifier: string
  ): Promise<{ userId: string; contactMethodId: string } | null> => {
    try {
      const { data, error } = await supabase
        .from('contact_methods')
        .select('id, user_id')
        .eq('service_type', serviceType)
        .eq('contact_identifier', contactIdentifier)
        .single();

      if (error || !data) return null;
      
      return { userId: data.user_id, contactMethodId: data.id };
    } catch {
      return null;
    }
  }, []);

  // Create a connection request
  const createConnectionRequest = useCallback(async (
    targetUserId: string,
    circleTier: CircleTier,
    matchedContactMethodId: string | null,
    discloseCircle: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('connections.errors.notAuthenticated') };
    }

    if (targetUserId === userId) {
      return { success: false, error: t('connections.errors.cannotAddSelf') };
    }

    // Check if connection already exists
    const existing = connections.find(
      c => c.target_user_id === targetUserId || c.requester_id === targetUserId
    );
    if (existing) {
      return { success: false, error: t('connections.errors.alreadyExists') };
    }

    try {
      const { error } = await supabase
        .from('friend_connections')
        .insert({
          requester_id: userId,
          target_user_id: targetUserId,
          circle_tier: circleTier,
          matched_contact_method_id: matchedContactMethodId,
          disclose_circle: discloseCircle,
        });

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: t('connections.errors.requestExists') };
        }
        throw error;
      }

      toast.success(t('connections.toasts.requestSent'));
      return { success: true };
    } catch (error) {
      console.error('Error creating connection:', error);
      return { success: false, error: t('connections.errors.createFailed') };
    }
  }, [userId, connections, t]);

  // Respond to a connection request (confirm or decline)
  // When accepting, the target can optionally specify their own tier for the requester
  // This enables asymmetric tier classification (e.g., A considers B "core" but B considers A "outer")
  const respondToRequest = useCallback(async (
    connectionId: string,
    accept: boolean,
    targetTier?: CircleTier // The tier that the TARGET places the REQUESTER in
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const updateData: Record<string, unknown> = {
        status: accept ? 'confirmed' : 'declined',
        confirmed_at: accept ? new Date().toISOString() : null,
      };

      // If accepting and a tier is specified, set target_circle_tier
      // If not specified, we'll need to get the original circle_tier from the pending request
      if (accept && targetTier) {
        updateData.target_circle_tier = targetTier;
      } else if (accept) {
        // Default: target classifies requester in the same tier requester used
        // Find the pending request to get the original tier
        const pendingRequest = pendingRequests.find(r => r.id === connectionId);
        if (pendingRequest) {
          updateData.target_circle_tier = pendingRequest.circle_tier;
        }
      }

      const { error } = await supabase
        .from('friend_connections')
        .update(updateData)
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(accept ? t('connections.toasts.confirmed') : t('connections.toasts.declined'));
      return { success: true };
    } catch (error) {
      console.error('Error responding to request:', error);
      return { success: false, error: t('connections.errors.respondFailed') };
    }
  }, [pendingRequests, t]);

  // Delete a connection
  const deleteConnection = useCallback(async (
    connectionId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('friend_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(t('connections.toasts.removed'));
      return { success: true };
    } catch (error) {
      console.error('Error deleting connection:', error);
      return { success: false, error: t('connections.errors.deleteFailed') };
    }
  }, [t]);

  // Get confirmed friends for a specific tier from this user's perspective
  // This handles asymmetric tier classification:
  // - If I'm the requester, I see target in circle_tier
  // - If I'm the target, I see requester in target_circle_tier
  const getConfirmedFriendsInTier = useCallback((tier: CircleTier): FriendConnection[] => {
    return connections.filter(c => {
      if (c.status !== 'confirmed') return false;

      const isRequester = c.requester_id === userId;
      const isTarget = c.target_user_id === userId;

      if (isRequester) {
        // I'm the requester - check my tier classification (circle_tier)
        return c.circle_tier === tier;
      } else if (isTarget) {
        // I'm the target - check my tier classification (target_circle_tier)
        return c.target_circle_tier === tier;
      }

      return false;
    });
  }, [connections, userId]);

  // Get the friend user ID from a connection (the "other" person)
  const getFriendIdFromConnection = useCallback((connection: FriendConnection): string => {
    if (connection.requester_id === userId) {
      return connection.target_user_id;
    }
    return connection.requester_id;
  }, [userId]);

  // Get my tier classification for a connected friend
  const getMyTierForFriend = useCallback((connection: FriendConnection): CircleTier | null => {
    if (connection.requester_id === userId) {
      return connection.circle_tier;
    }
    if (connection.target_user_id === userId) {
      return connection.target_circle_tier;
    }
    return null;
  }, [userId]);

  // Get the friend's tier classification for me
  const getFriendTierForMe = useCallback((connection: FriendConnection): CircleTier | null => {
    if (connection.requester_id === userId) {
      return connection.target_circle_tier;
    }
    if (connection.target_user_id === userId) {
      return connection.circle_tier;
    }
    return null;
  }, [userId]);

  // Check if a user is already connected
  const isConnectedTo = useCallback((otherUserId: string): FriendConnection | null => {
    return connections.find(
      c => c.requester_id === otherUserId || c.target_user_id === otherUserId
    ) || null;
  }, [connections]);

  return {
    connections,
    pendingRequests,
    loading,
    fetchConnections,
    findUserByContactInfo,
    createConnectionRequest,
    respondToRequest,
    deleteConnection,
    getConfirmedFriendsInTier,
    isConnectedTo,
    getFriendIdFromConnection,
    getMyTierForFriend,
    getFriendTierForMe,
  };
}
