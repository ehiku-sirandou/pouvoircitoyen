-- Fix Storage RLS policies to allow anonymous uploads

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to audio files" ON storage.objects;

-- Allow anyone (including anonymous users) to upload to audio-contributions bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'audio-contributions');

-- Allow anyone to read audio files
CREATE POLICY "Allow public access to audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audio-contributions');

-- Allow authenticated users to delete files (for admin cleanup if needed)
CREATE POLICY "Allow authenticated users to delete audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'audio-contributions');

