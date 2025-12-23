-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view all contact methods" ON public.contact_methods;

-- Create a secure policy that only allows users to see their own contact methods
CREATE POLICY "Users can view their own contact methods"
ON public.contact_methods
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);