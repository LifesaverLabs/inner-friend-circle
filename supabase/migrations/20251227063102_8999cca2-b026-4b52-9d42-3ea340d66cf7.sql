-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view own or confirmed friends contact methods" ON public.contact_methods;

-- Create a stronger policy that explicitly requires authentication
CREATE POLICY "Authenticated users can view own or confirmed friends contact methods" 
ON public.contact_methods 
FOR SELECT 
TO authenticated
USING (
  (auth.uid() = user_id) 
  OR has_confirmed_connection(auth.uid(), user_id)
);