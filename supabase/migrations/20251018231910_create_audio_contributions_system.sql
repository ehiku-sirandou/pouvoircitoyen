/*
  # Create Audio Contributions System

  1. New Tables
    - `audio_contributions`
      - `id` (uuid, primary key)
      - `audio_url` (text) - URL to the audio file in storage
      - `status` (text) - Status: pending, validated, rejected
      - `description` (text, nullable) - Text description added during validation
      - `created_at` (timestamptz) - When the contribution was submitted
      - `validated_at` (timestamptz, nullable) - When it was validated
      - `validated_by` (text, nullable) - Email or identifier of validator
      - `duration` (integer, nullable) - Audio duration in seconds
      - `file_size` (integer, nullable) - File size in bytes

  2. Security
    - Enable RLS on `audio_contributions` table
    - Add policy for anyone to insert contributions (public submission)
    - Add policy for anyone to read validated contributions
    - Add policy for authenticated users to read all contributions (backoffice)
    - Add policy for authenticated users to update contributions (validation)

  3. Storage
    - Create storage bucket for audio files
    - Configure public access for validated audio files
*/

-- Create the audio_contributions table
CREATE TABLE IF NOT EXISTS audio_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  description text,
  created_at timestamptz DEFAULT now(),
  validated_at timestamptz,
  validated_by text,
  duration integer,
  file_size integer
);

-- Enable RLS
ALTER TABLE audio_contributions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert new contributions (public submission)
CREATE POLICY "Anyone can submit audio contributions"
  ON audio_contributions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Anyone can read validated contributions (public display)
CREATE POLICY "Anyone can view validated contributions"
  ON audio_contributions
  FOR SELECT
  TO anon
  USING (status = 'validated');

-- Policy: Authenticated users can read all contributions (backoffice)
CREATE POLICY "Authenticated users can view all contributions"
  ON audio_contributions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update contributions (validation)
CREATE POLICY "Authenticated users can validate contributions"
  ON audio_contributions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-contributions', 'audio-contributions', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload audio files
CREATE POLICY "Anyone can upload audio files"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'audio-contributions');

-- Allow anyone to read audio files
CREATE POLICY "Anyone can read audio files"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'audio-contributions');

-- Allow authenticated users to delete audio files (cleanup)
CREATE POLICY "Authenticated users can delete audio files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'audio-contributions');