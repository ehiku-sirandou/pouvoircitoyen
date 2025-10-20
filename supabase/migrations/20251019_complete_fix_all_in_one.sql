-- ============================================================================
-- MIGRATION COMPLÈTE - POUVOIR CITOYEN
-- Ajout des champs utilisateur + Fix de toutes les permissions RLS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PARTIE 1 : Ajout des nouveaux champs à la table audio_contributions
-- ----------------------------------------------------------------------------

ALTER TABLE audio_contributions
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('homme', 'femme')),
ADD COLUMN IF NOT EXISTS topics text[];

-- Commentaires pour documentation
COMMENT ON COLUMN audio_contributions.full_name IS 'Nom complet de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.phone_number IS 'Numéro de téléphone de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.gender IS 'Sexe attribué par l''administrateur lors de la validation';
COMMENT ON COLUMN audio_contributions.topics IS 'Liste des sujets évoqués dans l''enregistrement';

-- ----------------------------------------------------------------------------
-- PARTIE 2 : Fix RLS sur la TABLE audio_contributions
-- ----------------------------------------------------------------------------

-- Permettre aux utilisateurs anonymes d'insérer des contributions
DROP POLICY IF EXISTS "Allow anonymous users to insert contributions" ON audio_contributions;
CREATE POLICY "Allow anonymous users to insert contributions"
ON audio_contributions
FOR INSERT
TO public
WITH CHECK (true);

-- Permettre à tout le monde de voir les contributions validées
DROP POLICY IF EXISTS "Anyone can view validated contributions" ON audio_contributions;
CREATE POLICY "Anyone can view validated contributions"
ON audio_contributions
FOR SELECT
TO public
USING (status = 'validated');

-- Permettre aux admins de voir toutes les contributions (pour le backoffice)
DROP POLICY IF EXISTS "Authenticated users can view all contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can view all contributions"
ON audio_contributions
FOR SELECT
TO authenticated
USING (true);

-- Permettre aux admins de mettre à jour les contributions
DROP POLICY IF EXISTS "Authenticated users can update contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can update contributions"
ON audio_contributions
FOR UPDATE
TO authenticated
USING (true);

-- Permettre aux admins de supprimer les contributions
DROP POLICY IF EXISTS "Authenticated users can delete contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can delete contributions"
ON audio_contributions
FOR DELETE
TO authenticated
USING (true);

-- ----------------------------------------------------------------------------
-- PARTIE 3 : Fix RLS sur STORAGE (bucket audio-contributions)
-- ----------------------------------------------------------------------------

-- Permettre aux utilisateurs anonymes d'uploader des fichiers
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'audio-contributions');

-- Permettre à tout le monde de lire les fichiers audio
DROP POLICY IF EXISTS "Allow public access to audio files" ON storage.objects;
CREATE POLICY "Allow public access to audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audio-contributions');

-- Permettre aux admins de supprimer des fichiers
DROP POLICY IF EXISTS "Allow authenticated users to delete audio files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'audio-contributions');

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================

-- Vérification : Afficher toutes les policies créées
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'audio_contributions';

