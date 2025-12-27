-- Update the handle_new_user trigger to also add email as a contact method
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  
  -- Auto-add signup email as a contact method
  INSERT INTO public.contact_methods (user_id, service_type, contact_identifier, for_spontaneous, for_scheduled, label)
  VALUES (new.id, 'email', new.email, true, true, 'Signup Email');
  
  RETURN new;
END;
$$;