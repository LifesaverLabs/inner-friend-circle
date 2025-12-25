-- Add is_public column to profiles (default true - public by default)
ALTER TABLE public.profiles
ADD COLUMN is_public boolean NOT NULL DEFAULT true;

-- Update the SELECT policy to respect privacy settings
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view public profiles or own profile"
ON public.profiles
FOR SELECT
USING (
  is_public = true 
  OR auth.uid() = user_id 
  OR has_confirmed_connection(auth.uid(), user_id)
);