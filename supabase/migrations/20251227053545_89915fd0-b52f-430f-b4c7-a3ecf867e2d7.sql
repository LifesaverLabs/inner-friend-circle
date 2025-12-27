-- Create pending_invitations table to track friend additions for non-users
CREATE TABLE public.pending_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NULL,
  invitee_phone TEXT NULL,
  circle_tier public.circle_tier NOT NULL,
  friend_name TEXT NOT NULL,
  invitation_sent_at TIMESTAMP WITH TIME ZONE NULL,
  matched_at TIMESTAMP WITH TIME ZONE NULL,
  matched_user_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure at least email or phone is provided
  CONSTRAINT email_or_phone_required CHECK (invitee_email IS NOT NULL OR invitee_phone IS NOT NULL)
);

-- Add index for quick lookups when users sign up
CREATE INDEX idx_pending_invitations_email ON public.pending_invitations(invitee_email) WHERE invitee_email IS NOT NULL AND matched_at IS NULL;
CREATE INDEX idx_pending_invitations_phone ON public.pending_invitations(invitee_phone) WHERE invitee_phone IS NOT NULL AND matched_at IS NULL;
CREATE INDEX idx_pending_invitations_inviter ON public.pending_invitations(inviter_id);

-- Enable RLS
ALTER TABLE public.pending_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view their own pending invitations
CREATE POLICY "Users can view their own pending invitations"
ON public.pending_invitations
FOR SELECT
USING (auth.uid() = inviter_id);

-- Users can create pending invitations
CREATE POLICY "Users can create pending invitations"
ON public.pending_invitations
FOR INSERT
WITH CHECK (auth.uid() = inviter_id);

-- Users can update their own pending invitations
CREATE POLICY "Users can update their own pending invitations"
ON public.pending_invitations
FOR UPDATE
USING (auth.uid() = inviter_id);

-- Users can delete their own pending invitations
CREATE POLICY "Users can delete their own pending invitations"
ON public.pending_invitations
FOR DELETE
USING (auth.uid() = inviter_id);

-- Service role policy for auto-matching on signup
CREATE POLICY "Service role can update pending invitations"
ON public.pending_invitations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_pending_invitations_updated_at
BEFORE UPDATE ON public.pending_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to match pending invitations when user adds contact methods
CREATE OR REPLACE FUNCTION public.match_pending_invitations_for_user(new_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation RECORD;
  contact RECORD;
  matched_count INTEGER := 0;
BEGIN
  -- Get all contact methods for the new user
  FOR contact IN 
    SELECT contact_identifier, id as contact_method_id
    FROM public.contact_methods 
    WHERE user_id = new_user_id
  LOOP
    -- Find pending invitations matching this contact
    FOR invitation IN
      SELECT pi.*
      FROM public.pending_invitations pi
      WHERE pi.matched_at IS NULL
        AND (
          (pi.invitee_email IS NOT NULL AND LOWER(pi.invitee_email) = LOWER(contact.contact_identifier))
          OR (pi.invitee_phone IS NOT NULL AND pi.invitee_phone = contact.contact_identifier)
        )
        AND pi.inviter_id != new_user_id
    LOOP
      -- Create friend connection request
      INSERT INTO public.friend_connections (
        requester_id,
        target_user_id,
        circle_tier,
        matched_contact_method_id,
        status,
        disclose_circle
      ) VALUES (
        invitation.inviter_id,
        new_user_id,
        invitation.circle_tier,
        contact.contact_method_id,
        'pending',
        true
      )
      ON CONFLICT DO NOTHING;
      
      -- Mark invitation as matched
      UPDATE public.pending_invitations
      SET matched_at = now(), matched_user_id = new_user_id
      WHERE id = invitation.id;
      
      matched_count := matched_count + 1;
    END LOOP;
  END LOOP;
  
  RETURN matched_count;
END;
$$;