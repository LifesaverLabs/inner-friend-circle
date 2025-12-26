-- Add target_circle_tier to support asymmetric tier classification
-- This allows the target user to classify the requester in a different tier
-- than the requester classified the target.
--
-- Example: User A requests User B with circle_tier='core' (A considers B core)
-- When B accepts, B can set target_circle_tier='outer' (B considers A outer)

ALTER TABLE public.friend_connections
ADD COLUMN target_circle_tier circle_tier;

-- Add comment to explain the columns
COMMENT ON COLUMN public.friend_connections.circle_tier IS
  'The tier that the REQUESTER places the TARGET in (how requester sees target)';

COMMENT ON COLUMN public.friend_connections.target_circle_tier IS
  'The tier that the TARGET places the REQUESTER in (how target sees requester). NULL until confirmed.';

-- Update the existing confirmed connections to have symmetric tier by default
-- (target_circle_tier = circle_tier for backwards compatibility)
UPDATE public.friend_connections
SET target_circle_tier = circle_tier
WHERE status = 'confirmed' AND target_circle_tier IS NULL;

-- Create a function to get the tier for a specific user's view of another user
CREATE OR REPLACE FUNCTION public.get_connection_tier_for_user(
  connection_row friend_connections,
  viewer_id UUID
)
RETURNS circle_tier
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN connection_row.requester_id = viewer_id THEN connection_row.circle_tier
    WHEN connection_row.target_user_id = viewer_id THEN connection_row.target_circle_tier
    ELSE NULL
  END
$$;

-- Create a view for easier querying of connections from a user's perspective
CREATE OR REPLACE VIEW public.user_connections_view AS
SELECT
  fc.id,
  fc.requester_id,
  fc.target_user_id,
  fc.circle_tier AS requester_tier_for_target,
  fc.target_circle_tier AS target_tier_for_requester,
  fc.status,
  fc.disclose_circle,
  fc.matched_contact_method_id,
  fc.created_at,
  fc.updated_at,
  fc.confirmed_at
FROM public.friend_connections fc;

-- Grant access to the view
GRANT SELECT ON public.user_connections_view TO authenticated;
