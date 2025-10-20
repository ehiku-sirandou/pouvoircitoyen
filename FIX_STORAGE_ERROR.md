# 🔧 Correction de l'Erreur de Upload Audio

## Erreur Rencontrée
```
StorageApiError: new row violates row-level security policy
```

## Cause
Les utilisateurs anonymes (non connectés) n'ont pas la permission d'uploader des fichiers dans le bucket `audio-contributions` sur Supabase Storage.

## Solution : Exécuter cette Migration SQL

### 📝 Étapes à Suivre

1. **Connectez-vous à Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Créez une nouvelle requête

3. **Exécutez ce Script SQL**

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

4. **Cliquez sur "Run"**

## ✅ Vérification

Après avoir exécuté le script :
1. Rechargez la page d'accueil de votre application
2. Enregistrez un audio
3. Cliquez sur "Envoyer"
4. L'upload devrait maintenant fonctionner ! 🎉

## 🔐 Note de Sécurité

Cette configuration permet à **tout le monde** d'uploader des fichiers audio dans le bucket `audio-contributions`. C'est normal pour votre cas d'usage car :
- Les utilisateurs doivent pouvoir enregistrer et envoyer des audios sans créer de compte
- Les contributions passent par un processus de validation dans le backoffice
- Seuls les audios validés sont affichés publiquement

Si vous voulez ajouter des limites (taille de fichier, nombre d'uploads par IP, etc.), faites-le moi savoir !

## 📋 Migrations à Appliquer au Total

Pour que tout fonctionne, vous devez exécuter **DEUX** migrations SQL :

### 1️⃣ Migration des Champs (déjà créée)
Fichier : `supabase/migrations/20251019_add_user_info_and_metadata.sql`

### 2️⃣ Migration Storage RLS (celle-ci)
Fichier : `supabase/migrations/20251019_fix_storage_rls.sql`

**Ordre d'exécution :** Vous pouvez les exécuter dans n'importe quel ordre, mais assurez-vous d'exécuter les DEUX !

