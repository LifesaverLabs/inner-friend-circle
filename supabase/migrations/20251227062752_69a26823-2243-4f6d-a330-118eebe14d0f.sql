-- Remove the duplicate anonymous INSERT policy
DROP POLICY IF EXISTS "Anonymous can register a dispatch account" ON public.emergency_dispatch_accounts;

-- The remaining "Anyone can register a dispatch account" policy is intentional:
-- Emergency dispatch accounts use a separate authentication system (password_hash column)
-- and are verified by admins before gaining access. The SELECT policies already correctly
-- restrict viewing to admin roles only.