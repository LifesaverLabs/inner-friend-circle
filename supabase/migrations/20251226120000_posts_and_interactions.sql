-- Create enum for post content types
CREATE TYPE public.post_content_type AS ENUM (
  'text',
  'photo', 
  'voice_note',
  'video',
  'call_invite',
  'meetup_invite',
  'proximity_ping',
  'life_update'
);

-- Create enum for interaction types
CREATE TYPE public.interaction_type AS ENUM (
  'like',
  'comment',
  'voice_reply',
  'call_accepted',
  'meetup_rsvp',
  'share'
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content_type post_content_type NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  -- For meetup/call invites
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location_name TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  -- Visibility control - array of tiers that can see this post
  visibility circle_tier[] NOT NULL DEFAULT '{core,inner,outer}',
  -- Content flags
  is_suggested BOOLEAN NOT NULL DEFAULT false,
  is_sponsored BOOLEAN NOT NULL DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_interactions table
CREATE TABLE public.post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  interaction_type interaction_type NOT NULL,
  content TEXT, -- For comments/voice replies
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent duplicate interactions of same type on same post by same user
  UNIQUE (post_id, user_id, interaction_type)
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- Posts visibility policy: users can see posts from confirmed friends in appropriate tiers
CREATE POLICY "Users can view posts from connected friends"
ON public.posts
FOR SELECT
TO authenticated
USING (
  -- User can see their own posts
  auth.uid() = author_id
  OR
  -- User can see posts from confirmed friends if:
  -- 1. They have a confirmed connection with the author
  -- 2. The user's tier (from author's perspective) is included in the post's visibility array
  EXISTS (
    SELECT 1 FROM public.friend_connections fc
    WHERE fc.status = 'confirmed'
    AND (
      -- Case 1: Current user is the requester, author is target
      (fc.requester_id = auth.uid() AND fc.target_user_id = author_id AND fc.circle_tier = ANY(visibility))
      OR
      -- Case 2: Current user is the target, author is requester  
      (fc.target_user_id = auth.uid() AND fc.requester_id = author_id AND fc.target_circle_tier = ANY(visibility))
    )
  )
);

-- Users can create their own posts
CREATE POLICY "Users can create their own posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Post interactions visibility: users can see interactions on posts they can see
CREATE POLICY "Users can view interactions on visible posts"
ON public.post_interactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_id
    AND (
      -- User can see their own posts
      auth.uid() = p.author_id
      OR
      -- User can see posts from confirmed friends (same logic as posts policy)
      EXISTS (
        SELECT 1 FROM public.friend_connections fc
        WHERE fc.status = 'confirmed'
        AND (
          (fc.requester_id = auth.uid() AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
          OR
          (fc.target_user_id = auth.uid() AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
        )
      )
    )
  )
);

-- Users can create interactions on posts they can see
CREATE POLICY "Users can interact with visible posts"
ON public.post_interactions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND
  EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_id
    AND (
      -- User can see their own posts
      auth.uid() = p.author_id
      OR
      -- User can see posts from confirmed friends
      EXISTS (
        SELECT 1 FROM public.friend_connections fc
        WHERE fc.status = 'confirmed'
        AND (
          (fc.requester_id = auth.uid() AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
          OR
          (fc.target_user_id = auth.uid() AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
        )
      )
    )
  )
);

-- Users can update/delete their own interactions
CREATE POLICY "Users can update their own interactions"
ON public.post_interactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
ON public.post_interactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add updated_at trigger for posts
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX idx_posts_visibility ON public.posts USING GIN(visibility);
CREATE INDEX idx_post_interactions_post_id ON public.post_interactions(post_id);
CREATE INDEX idx_post_interactions_user_type ON public.post_interactions(user_id, interaction_type);

-- Enable realtime for posts and interactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_interactions;

-- Create a function to get posts visible to a specific user
CREATE OR REPLACE FUNCTION public.get_visible_posts_for_user(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  content_type post_content_type,
  content TEXT,
  media_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location_name TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  visibility circle_tier[],
  is_suggested BOOLEAN,
  is_sponsored BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  author_display_name TEXT,
  author_user_handle TEXT,
  author_avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.author_id,
    p.content_type,
    p.content,
    p.media_url,
    p.scheduled_at,
    p.location_name,
    p.location_lat,
    p.location_lng,
    p.visibility,
    p.is_suggested,
    p.is_sponsored,
    p.created_at,
    p.updated_at,
    prof.display_name,
    prof.user_handle,
    prof.avatar_url
  FROM public.posts p
  JOIN public.profiles prof ON p.author_id = prof.user_id
  WHERE (
    -- User can see their own posts
    target_user_id = p.author_id
    OR
    -- User can see posts from confirmed friends
    EXISTS (
      SELECT 1 FROM public.friend_connections fc
      WHERE fc.status = 'confirmed'
      AND (
        (fc.requester_id = target_user_id AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
        OR
        (fc.target_user_id = target_user_id AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
      )
    )
  )
  ORDER BY p.created_at DESC;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_visible_posts_for_user(UUID) TO authenticated;