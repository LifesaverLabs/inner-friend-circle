-- Add DELETE policy for profiles table to comply with GDPR
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);