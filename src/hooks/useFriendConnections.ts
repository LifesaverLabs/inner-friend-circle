import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CircleTier = 'core' | 'inner' | 'outer';
export type ConnectionStatus = 'pending' | 'confirmed' | 'declined';

export interface FriendConnection {
  id: string;
  requester_id: string;
  target_user_id: string;
  circle_tier: CircleTier;
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
      return { success: false, error: 'Not authenticated' };
    }

    if (targetUserId === userId) {
      return { success: false, error: "You can't add yourself as a friend" };
    }

    // Check if connection already exists
    const existing = connections.find(
      c => c.target_user_id === targetUserId || c.requester_id === targetUserId
    );
    if (existing) {
      return { success: false, error: 'Connection already exists' };
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
          return { success: false, error: 'Connection request already exists' };
        }
        throw error;
      }

      toast.success('Connection request sent!');
      return { success: true };
    } catch (error) {
      console.error('Error creating connection:', error);
      return { success: false, error: 'Failed to create connection request' };
    }
  }, [userId, connections]);

  // Respond to a connection request (confirm or decline)
  const respondToRequest = useCallback(async (
    connectionId: string,
    accept: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('friend_connections')
        .update({
          status: accept ? 'confirmed' : 'declined',
          confirmed_at: accept ? new Date().toISOString() : null,
        })
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(accept ? 'Connection confirmed! You can now see each other\'s contact methods.' : 'Connection declined.');
      return { success: true };
    } catch (error) {
      console.error('Error responding to request:', error);
      return { success: false, error: 'Failed to respond to request' };
    }
  }, []);

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

      toast.success('Connection removed.');
      return { success: true };
    } catch (error) {
      console.error('Error deleting connection:', error);
      return { success: false, error: 'Failed to delete connection' };
    }
  }, []);

  // Get confirmed friends for a specific tier
  const getConfirmedFriendsInTier = useCallback((tier: CircleTier): FriendConnection[] => {
    return connections.filter(c => {
      // Only show connections where this user is the requester and they set this tier
      const isRequester = c.requester_id === userId;
      return c.status === 'confirmed' && isRequester && c.circle_tier === tier;
    });
  }, [connections, userId]);

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
  };
}
