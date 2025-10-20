-- Add user information fields and metadata to audio_contributions table

-- Add columns for user info
ALTER TABLE audio_contributions
ADD COLUMN full_name text,
ADD COLUMN phone_number text,
ADD COLUMN gender text CHECK (gender IN ('homme', 'femme')),
ADD COLUMN topics text[];

-- Update RLS policies to allow deletion by authenticated users
CREATE POLICY "Authenticated users can delete contributions"
  ON audio_contributions
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment for documentation
COMMENT ON COLUMN audio_contributions.full_name IS 'Nom complet de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.phone_number IS 'Numéro de téléphone de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.gender IS 'Sexe attribué par l''administrateur lors de la validation';
COMMENT ON COLUMN audio_contributions.topics IS 'Liste des sujets évoqués dans l''enregistrement';

