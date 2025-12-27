-- Update match_pending_invitations_for_user to also match on signup email
CREATE OR REPLACE FUNCTION public.match_pending_invitations_for_user(new_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  invitation RECORD;
  contact RECORD;
  user_email TEXT;
  matched_count INTEGER := 0;
BEGIN
  -- Get the user's signup email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = new_user_id;
  
  -- First, match invitations based on signup email
  IF user_email IS NOT NULL THEN
    FOR invitation IN
      SELECT pi.*
      FROM public.pending_invitations pi
      WHERE pi.matched_at IS NULL
        AND pi.invitee_email IS NOT NULL
        AND LOWER(pi.invitee_email) = LOWER(user_email)
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
        NULL,
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
  END IF;
  
  -- Then, match invitations based on contact methods
  FOR contact IN 
    SELECT contact_identifier, id as contact_method_id
    FROM public.contact_methods 
    WHERE user_id = new_user_id
  LOOP
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