-- Add user_handle column to profiles
ALTER TABLE public.profiles
ADD COLUMN user_handle text UNIQUE;

-- Add check constraint for handle format (alphanumeric, underscores, 3-30 chars)
ALTER TABLE public.profiles
ADD CONSTRAINT user_handle_format CHECK (
  user_handle IS NULL OR (
    user_handle ~ '^[a-zA-Z0-9_]{3,30}$'
  )
);

-- Create index for faster handle lookups
CREATE INDEX idx_profiles_user_handle ON public.profiles(user_handle);

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create permissive SELECT policy for authenticated users to view all profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Create function to check for basic obscenity (expandable list)
CREATE OR REPLACE FUNCTION public.is_handle_appropriate(handle text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  blocked_words text[] := ARRAY['fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick', 'cock', 'pussy', 'nigger', 'faggot', 'retard'];
  lower_handle text := lower(handle);
  word text;
BEGIN
  IF handle IS NULL THEN
    RETURN true;
  END IF;
  
  FOREACH word IN ARRAY blocked_words LOOP
    IF lower_handle LIKE '%' || word || '%' THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$;

-- Add check constraint using the function
ALTER TABLE public.profiles
ADD CONSTRAINT user_handle_appropriate CHECK (
  user_handle IS NULL OR public.is_handle_appropriate(user_handle)
);