-- Create contact_methods table for storing user communication preferences
CREATE TABLE public.contact_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'facetime', 'whatsapp', 'signal', 'telegram', 'zoom', 'google_meet', 'teams', 'phone', 'discord', 'skype'
  contact_identifier TEXT NOT NULL, -- phone number, email, meeting link, or username
  for_spontaneous BOOLEAN NOT NULL DEFAULT true,
  for_scheduled BOOLEAN NOT NULL DEFAULT true,
  spontaneous_priority INTEGER DEFAULT 0, -- lower = higher priority for spontaneous calls
  scheduled_priority INTEGER DEFAULT 0, -- lower = higher priority for scheduled calls
  label TEXT, -- optional label like "Personal", "Work"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;

-- Users can view contact methods of all authenticated users (for finding compatible channels)
CREATE POLICY "Authenticated users can view all contact methods"
ON public.contact_methods
FOR SELECT
TO authenticated
USING (true);

-- Users can only insert their own contact methods
CREATE POLICY "Users can insert their own contact methods"
ON public.contact_methods
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own contact methods
CREATE POLICY "Users can update their own contact methods"
ON public.contact_methods
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can only delete their own contact methods
CREATE POLICY "Users can delete their own contact methods"
ON public.contact_methods
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster user lookups
CREATE INDEX idx_contact_methods_user_id ON public.contact_methods(user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_contact_methods_updated_at
BEFORE UPDATE ON public.contact_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add contact_setup_complete flag to profiles to track onboarding
ALTER TABLE public.profiles
ADD COLUMN contact_setup_complete BOOLEAN NOT NULL DEFAULT false;