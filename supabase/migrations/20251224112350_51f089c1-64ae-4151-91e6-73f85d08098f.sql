-- Enable realtime for friend_lists table so changes sync across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.friend_lists;