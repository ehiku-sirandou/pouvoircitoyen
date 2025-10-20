-- Fix RLS policies to allow anonymous users to insert audio contributions

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Allow anonymous users to insert contributions" ON audio_contributions;

-- Allow anyone (including anonymous users) to insert contributions
CREATE POLICY "Allow anonymous users to insert contributions"
ON audio_contributions
FOR INSERT
TO public
WITH CHECK (true);

-- Verify other policies are in place
-- Users should be able to read validated contributions (public access)
DROP POLICY IF EXISTS "Anyone can view validated contributions" ON audio_contributions;
CREATE POLICY "Anyone can view validated contributions"
ON audio_contributions
FOR SELECT
TO public
USING (status = 'validated');

