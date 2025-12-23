-- Create a table for storing friend lists/circles
CREATE TABLE public.friend_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friends jsonb NOT NULL DEFAULT '[]'::jsonb,
  reserved_spots jsonb NOT NULL DEFAULT '{}'::jsonb,
  role_models jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_tended_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.friend_lists ENABLE ROW LEVEL SECURITY;

-- Users can only view their own friend list
CREATE POLICY "Users can view their own friend list"
ON public.friend_lists
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own friend list
CREATE POLICY "Users can insert their own friend list"
ON public.friend_lists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own friend list
CREATE POLICY "Users can update their own friend list"
ON public.friend_lists
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own friend list
CREATE POLICY "Users can delete their own friend list"
ON public.friend_lists
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_friend_lists_updated_at
BEFORE UPDATE ON public.friend_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();