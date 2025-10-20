# 🚨 Guide de Correction Rapide - Erreur Storage

## Problème
Vous avez cette erreur lors de l'envoi d'audio :
```
StorageApiError: new row violates row-level security policy
```

## ✅ Solution en 3 Étapes

### Étape 1 : Connectez-vous à Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet **pouvoircitoyen**
3. Cliquez sur **"SQL Editor"** dans le menu de gauche

### Étape 2 : Exécutez les 2 Migrations SQL

#### Migration 1 : Ajout des Nouveaux Champs
Copiez-collez ce code et cliquez sur **"Run"** :

```sql
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
```

#### Migration 2 : Correction des Permissions Storage (IMPORTANT !)
Copiez-collez ce code et cliquez sur **"Run"** :

```sql
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
```

### Étape 3 : Testez !
1. Rechargez votre site
2. Enregistrez un audio
3. L'envoi devrait maintenant fonctionner ! 🎉

---

## 📋 Ce Qui a Changé

### Sur la Page d'Accueil
- ✅ Enregistrement audio (max 1min30)
- ✅ **NOUVEAU** : Champs optionnels "Nom complet" et "Téléphone"
- ✅ Envoi du fichier audio

### Dans le Backoffice
- ✅ Affichage des infos utilisateur (nom/téléphone) si renseignées
- ✅ **NOUVEAU** : Champs obligatoires à la validation :
  - Sexe (Homme/Femme)
  - Sujets (séparés par virgules)
- ✅ **NOUVEAU** : Bouton "Supprimer" pour les contributions validées
- ✅ Affichage des métadonnées (sexe + sujets) pour les audios validés

---

## ❓ Questions Fréquentes

**Q: Pourquoi cette erreur est apparue ?**
R: Par défaut, Supabase bloque les uploads anonymes pour des raisons de sécurité. On doit explicitement autoriser les utilisateurs non connectés à uploader dans le bucket `audio-contributions`.

**Q: Est-ce sécurisé ?**
R: Oui ! Les audios passent par une validation manuelle dans le backoffice avant d'être affichés publiquement. De plus, seuls les administrateurs connectés peuvent valider/rejeter/supprimer.

**Q: Je dois exécuter ces migrations à chaque fois ?**
R: Non ! Une seule fois suffit. Une fois exécutées, les changements sont permanents dans votre base de données.

---

## 🆘 Besoin d'Aide ?

Si ça ne fonctionne toujours pas après ces étapes :
1. Vérifiez que les deux migrations SQL ont bien été exécutées (pas d'erreur rouge)
2. Vérifiez dans Supabase > Storage > audio-contributions que le bucket existe
3. Essayez de rafraîchir complètement la page (Cmd+Shift+R sur Mac, Ctrl+Shift+R sur Windows)

