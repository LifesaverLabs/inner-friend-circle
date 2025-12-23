-- Create enum for circle tiers
CREATE TYPE public.circle_tier AS ENUM ('core', 'inner', 'outer');

-- Create enum for connection status
CREATE TYPE public.connection_status AS ENUM ('pending', 'confirmed', 'declined');

-- Create friend_connections table
CREATE TABLE public.friend_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  circle_tier circle_tier NOT NULL,
  status connection_status NOT NULL DEFAULT 'pending',
  disclose_circle BOOLEAN NOT NULL DEFAULT true,
  matched_contact_method_id UUID REFERENCES public.contact_methods(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- Prevent duplicate connections
  UNIQUE (requester_id, target_user_id),
  -- Prevent self-connections
  CHECK (requester_id != target_user_id)
);

-- Enable RLS
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;

-- Users can view connections where they are requester OR target
CREATE POLICY "Users can view their connections"
ON public.friend_connections
FOR SELECT
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

-- Users can create connections where they are the requester
CREATE POLICY "Users can create connection requests"
ON public.friend_connections
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

-- Users can update connections where they are the target (to confirm/decline)
CREATE POLICY "Targets can respond to connection requests"
ON public.friend_connections
FOR UPDATE
TO authenticated
USING (auth.uid() = target_user_id);

-- Users can delete their own outgoing requests
CREATE POLICY "Users can delete their outgoing requests"
ON public.friend_connections
FOR DELETE
TO authenticated
USING (auth.uid() = requester_id);

-- Add updated_at trigger
CREATE TRIGGER update_friend_connections_updated_at
BEFORE UPDATE ON public.friend_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to check if two users have a confirmed connection
CREATE OR REPLACE FUNCTION public.has_confirmed_connection(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.friend_connections
    WHERE status = 'confirmed'
    AND (
      (requester_id = user1_id AND target_user_id = user2_id)
      OR (requester_id = user2_id AND target_user_id = user1_id)
    )
  )
$$;

-- Update contact_methods RLS to allow confirmed friends to see each other's contact methods
DROP POLICY IF EXISTS "Users can view their own contact methods" ON public.contact_methods;

CREATE POLICY "Users can view own or confirmed friends contact methods"
ON public.contact_methods
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.has_confirmed_connection(auth.uid(), user_id)
);

-- Enable realtime for friend_connections
ALTER PUBLICATION supabase_realtime ADD TABLE public.friend_connections;