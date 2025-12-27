import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostContentType, InteractionType } from '@/types/feed';
import { CircleTier } from './useFriendConnections';

export interface DatabasePost {
  id: string;
  author_id: string;
  content_type: PostContentType;
  content: string;
  media_url: string | null;
  scheduled_at: string | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  visibility: CircleTier[];
  is_suggested: boolean;
  is_sponsored: boolean;
  created_at: string;
  updated_at: string;
  author_display_name?: string | null;
  author_user_handle?: string | null;
  author_avatar_url?: string | null;
}

export interface DatabasePostInteraction {
  id: string;
  post_id: string;
  user_id: string;
  interaction_type: InteractionType;
  content: string | null;
  created_at: string;
}

interface UsePostsOptions {
  userId?: string;
}

interface CreatePostData {
  content: string;
  contentType: PostContentType;
  visibility: CircleTier[];
  mediaUrl?: string;
  scheduledAt?: Date;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  isSuggested?: boolean;
  isSponsored?: boolean;
}

export function usePosts({ userId }: UsePostsOptions) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<DatabasePost[]>([]);
  const [interactions, setInteractions] = useState<DatabasePostInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all visible posts for the current user
  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Use the database function to get visible posts
      const { data: postsData, error: postsError } = await supabase
        .rpc('get_visible_posts_for_user', { target_user_id: userId });

      if (postsError) {
        // Check if the error is due to missing tables/functions (migration not applied)
        if (postsError.message?.includes('function get_visible_posts_for_user') || 
            postsError.message?.includes('relation "posts"') ||
            postsError.message?.includes('does not exist')) {
          console.warn('Posts tables not found - migration may not be applied yet. Using empty feed.');
          setPosts([]);
          setInteractions([]);
          setLoading(false);
          return;
        }
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }

      setPosts(postsData || []);

      // Fetch interactions for all visible posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(p => p.id);
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('post_interactions')
          .select(`
            id,
            post_id,
            user_id,
            interaction_type,
            content,
            created_at,
            profiles!post_interactions_user_id_fkey(
              display_name,
              user_handle,
              avatar_url
            )
          `)
          .in('post_id', postIds)
          .order('created_at', { ascending: true });

        if (interactionsError) {
          console.error('Error fetching interactions:', interactionsError);
          throw interactionsError;
        }

        setInteractions(interactionsData || []);
      } else {
        setInteractions([]);
      }
    } catch (err) {
      console.error('Error in fetchPosts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      toast.error(t('posts.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  // Create a new post
  const createPost = useCallback(async (postData: CreatePostData): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('posts.errors.notAuthenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: userId,
          content_type: postData.contentType,
          content: postData.content,
          media_url: postData.mediaUrl || null,
          scheduled_at: postData.scheduledAt?.toISOString() || null,
          location_name: postData.locationName || null,
          location_lat: postData.locationLat || null,
          location_lng: postData.locationLng || null,
          visibility: postData.visibility,
          is_suggested: postData.isSuggested || false,
          is_sponsored: postData.isSponsored || false,
        })
        .select()
        .single();

      if (error) {
        // Check if the error is due to missing tables (migration not applied)
        if (error.message?.includes('relation "posts"') || error.message?.includes('does not exist')) {
          console.warn('Posts table not found - migration may not be applied yet.');
          return { success: false, error: 'Posts feature not available yet. Please contact support.' };
        }
        console.error('Error creating post:', error);
        throw error;
      }

      // Refresh posts to include the new one
      await fetchPosts();

      toast.success(t('posts.toasts.created'));
      return { success: true };
    } catch (err) {
      console.error('Error in createPost:', err);
      const errorMessage = err instanceof Error ? err.message : t('posts.errors.createFailed');
      return { success: false, error: errorMessage };
    }
  }, [userId, fetchPosts, t]);

  // Add an interaction to a post
  const addInteraction = useCallback(async (
    postId: string,
    interactionType: InteractionType,
    content?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('posts.errors.notAuthenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('post_interactions')
        .upsert({
          post_id: postId,
          user_id: userId,
          interaction_type: interactionType,
          content: content || null,
        }, {
          onConflict: 'post_id,user_id,interaction_type'
        })
        .select()
        .single();

      if (error) {
        // Check if the error is due to missing tables (migration not applied)
        if (error.message?.includes('relation "post_interactions"') || error.message?.includes('does not exist')) {
          console.warn('Post interactions table not found - migration may not be applied yet.');
          return { success: false, error: 'Posts feature not available yet. Please contact support.' };
        }
        console.error('Error adding interaction:', error);
        throw error;
      }

      // Refresh interactions
      await fetchPosts();

      return { success: true };
    } catch (err) {
      console.error('Error in addInteraction:', err);
      const errorMessage = err instanceof Error ? err.message : t('posts.errors.interactionFailed');
      return { success: false, error: errorMessage };
    }
  }, [userId, fetchPosts, t]);

  // Remove an interaction from a post
  const removeInteraction = useCallback(async (
    postId: string,
    interactionType: InteractionType
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('posts.errors.notAuthenticated') };
    }

    try {
      const { error } = await supabase
        .from('post_interactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('interaction_type', interactionType);

      if (error) {
        console.error('Error removing interaction:', error);
        throw error;
      }

      // Refresh interactions
      await fetchPosts();

      return { success: true };
    } catch (err) {
      console.error('Error in removeInteraction:', err);
      const errorMessage = err instanceof Error ? err.message : t('posts.errors.interactionFailed');
      return { success: false, error: errorMessage };
    }
  }, [userId, fetchPosts, t]);

  // Update a post (only author can update)
  const updatePost = useCallback(async (
    postId: string,
    updates: Partial<CreatePostData>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('posts.errors.notAuthenticated') };
    }

    try {
      const updateData: any = {};
      
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.contentType !== undefined) updateData.content_type = updates.contentType;
      if (updates.visibility !== undefined) updateData.visibility = updates.visibility;
      if (updates.mediaUrl !== undefined) updateData.media_url = updates.mediaUrl;
      if (updates.scheduledAt !== undefined) updateData.scheduled_at = updates.scheduledAt?.toISOString();
      if (updates.locationName !== undefined) updateData.location_name = updates.locationName;
      if (updates.locationLat !== undefined) updateData.location_lat = updates.locationLat;
      if (updates.locationLng !== undefined) updateData.location_lng = updates.locationLng;
      if (updates.isSuggested !== undefined) updateData.is_suggested = updates.isSuggested;
      if (updates.isSponsored !== undefined) updateData.is_sponsored = updates.isSponsored;

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .eq('author_id', userId); // Ensure only author can update

      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }

      // Refresh posts
      await fetchPosts();

      toast.success(t('posts.toasts.updated'));
      return { success: true };
    } catch (err) {
      console.error('Error in updatePost:', err);
      const errorMessage = err instanceof Error ? err.message : t('posts.errors.updateFailed');
      return { success: false, error: errorMessage };
    }
  }, [userId, fetchPosts, t]);

  // Delete a post (only author can delete)
  const deletePost = useCallback(async (postId: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: t('posts.errors.notAuthenticated') };
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', userId); // Ensure only author can delete

      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }

      // Refresh posts
      await fetchPosts();

      toast.success(t('posts.toasts.deleted'));
      return { success: true };
    } catch (err) {
      console.error('Error in deletePost:', err);
      const errorMessage = err instanceof Error ? err.message : t('posts.errors.deleteFailed');
      return { success: false, error: errorMessage };
    }
  }, [userId, fetchPosts, t]);

  // Get interactions for a specific post
  const getPostInteractions = useCallback((postId: string) => {
    return interactions.filter(interaction => interaction.post_id === postId);
  }, [interactions]);

  // Check if user has interacted with a post
  const hasUserInteracted = useCallback((postId: string, interactionType: InteractionType) => {
    return interactions.some(
      interaction => 
        interaction.post_id === postId && 
        interaction.user_id === userId && 
        interaction.interaction_type === interactionType
    );
  }, [interactions, userId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    fetchPosts();

    // Only set up subscriptions if we're not in migration-pending state
    let postsChannel: any = null;
    let interactionsChannel: any = null;

    // Check if tables exist by trying a simple operation
    supabase.from('posts').select('id').limit(1)
      .then(({ error }) => {
        if (!error) {
          // Tables exist, set up subscriptions
          postsChannel = supabase
            .channel('posts-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'posts',
              },
              () => {
                fetchPosts();
              }
            )
            .subscribe();

          interactionsChannel = supabase
            .channel('interactions-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'post_interactions',
              },
              () => {
                fetchPosts();
              }
            )
            .subscribe();
        }
      });

    return () => {
      if (postsChannel) supabase.removeChannel(postsChannel);
      if (interactionsChannel) supabase.removeChannel(interactionsChannel);
    };
  }, [userId, fetchPosts]);

  return {
    posts,
    interactions,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    addInteraction,
    removeInteraction,
    getPostInteractions,
    hasUserInteracted,
  };
}