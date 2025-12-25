-- Add parasocial personality opt-in to profiles
ALTER TABLE public.profiles 
ADD COLUMN is_parasocial_personality boolean NOT NULL DEFAULT false;

-- Create table for parasocial content shares
CREATE TABLE public.parasocial_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on parasocial_shares
ALTER TABLE public.parasocial_shares ENABLE ROW LEVEL SECURITY;

-- Creators can manage their own shares
CREATE POLICY "Creators can insert their own shares"
ON public.parasocial_shares
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own shares"
ON public.parasocial_shares
FOR UPDATE
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own shares"
ON public.parasocial_shares
FOR DELETE
USING (auth.uid() = creator_id);

-- Anyone authenticated can view active shares from parasocial personalities
CREATE POLICY "Authenticated users can view active shares"
ON public.parasocial_shares
FOR SELECT
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = parasocial_shares.creator_id 
    AND profiles.is_parasocial_personality = true
  )
);

-- Create table for tracking parasocial follows (who follows which parasocial)
CREATE TABLE public.parasocial_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  parasocial_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(follower_id, parasocial_id)
);

-- Enable RLS
ALTER TABLE public.parasocial_follows ENABLE ROW LEVEL SECURITY;

-- Users can follow parasocial personalities
CREATE POLICY "Users can create their own follows"
ON public.parasocial_follows
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
ON public.parasocial_follows
FOR DELETE
USING (auth.uid() = follower_id);

-- Users can see their own follows, parasocials can see who follows them
CREATE POLICY "Users can view follows"
ON public.parasocial_follows
FOR SELECT
USING (auth.uid() = follower_id OR auth.uid() = parasocial_id);

-- Create table for tracking content engagement
CREATE TABLE public.parasocial_engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id uuid NOT NULL REFERENCES public.parasocial_shares(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(share_id, user_id)
);

-- Enable RLS
ALTER TABLE public.parasocial_engagements ENABLE ROW LEVEL SECURITY;

-- Users can record their own engagements
CREATE POLICY "Users can insert their own engagements"
ON public.parasocial_engagements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can see their own engagements, creators can see engagements on their shares
CREATE POLICY "Users and creators can view engagements"
ON public.parasocial_engagements
FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.parasocial_shares 
    WHERE parasocial_shares.id = parasocial_engagements.share_id 
    AND parasocial_shares.creator_id = auth.uid()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_parasocial_shares_creator ON public.parasocial_shares(creator_id);
CREATE INDEX idx_parasocial_shares_active ON public.parasocial_shares(is_active, created_at DESC);
CREATE INDEX idx_parasocial_follows_parasocial ON public.parasocial_follows(parasocial_id);
CREATE INDEX idx_parasocial_engagements_share ON public.parasocial_engagements(share_id);

-- Add trigger for updated_at on shares
CREATE TRIGGER update_parasocial_shares_updated_at
BEFORE UPDATE ON public.parasocial_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();