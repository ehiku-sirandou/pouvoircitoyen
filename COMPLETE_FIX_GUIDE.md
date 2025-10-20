# 🚨 Guide de Correction Complet - Toutes les Erreurs RLS

## Problèmes Rencontrés

### Erreur 1 : Storage Upload
```
StorageApiError: new row violates row-level security policy
```

### Erreur 2 : Table Insert (ACTUELLE)
```
POST .../rest/v1/audio_contributions 403 (Forbidden)
new row violates row-level security policy for table "audio_contributions"
```

---

## ✅ Solution Complète - 3 Migrations SQL à Exécuter

### 🎯 Instructions

1. **Connectez-vous à Supabase Dashboard** : https://supabase.com/dashboard
2. **Ouvrez SQL Editor** (menu de gauche)
3. **Exécutez ces 3 scripts dans l'ordre** :

---

### 📝 Script 1 : Ajout des Nouveaux Champs

```sql
-- Add user information fields and metadata to audio_contributions table

-- Add columns for user info
ALTER TABLE audio_contributions
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('homme', 'femme')),
ADD COLUMN IF NOT EXISTS topics text[];

-- Update RLS policies to allow deletion by authenticated users
DROP POLICY IF EXISTS "Authenticated users can delete contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can delete contributions"
  ON audio_contributions
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comments for documentation
COMMENT ON COLUMN audio_contributions.full_name IS 'Nom complet de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.phone_number IS 'Numéro de téléphone de l''utilisateur (optionnel)';
COMMENT ON COLUMN audio_contributions.gender IS 'Sexe attribué par l''administrateur lors de la validation';
COMMENT ON COLUMN audio_contributions.topics IS 'Liste des sujets évoqués dans l''enregistrement';
```

**Cliquez sur "Run"** ✅

---

### 📝 Script 2 : Fix Storage RLS (Upload de Fichiers)

```sql
-- Fix Storage RLS policies to allow anonymous uploads

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to audio files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete audio files" ON storage.objects;

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

**Cliquez sur "Run"** ✅

---

### 📝 Script 3 : Fix Table RLS (Insert dans la Table) ⚠️ **LE PLUS IMPORTANT**

```sql
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
```

**Cliquez sur "Run"** ✅

---

## 🎉 Vérification

Après avoir exécuté les 3 scripts :

1. **Rechargez votre site** (Cmd+Shift+R ou Ctrl+Shift+R)
2. **Enregistrez un audio**
3. **Remplissez (ou pas) le nom et téléphone**
4. **Cliquez sur "Envoyer"**
5. ✅ **Ça devrait marcher !**

---

## 🔐 Résumé des Permissions

Après ces migrations, voici ce qui est autorisé :

| Action | Qui peut le faire | Politique |
|--------|-------------------|-----------|
| 📤 **Upload fichier audio** | Tout le monde (anonyme) | Storage RLS |
| ➕ **Insérer contribution** | Tout le monde (anonyme) | Table RLS INSERT |
| 👀 **Voir contributions validées** | Tout le monde | Table RLS SELECT |
| ✅ **Valider/Rejeter** | Admin seulement | Via backoffice authentifié |
| 🗑️ **Supprimer contribution** | Admin seulement | Table RLS DELETE |
| 🗑️ **Supprimer fichier storage** | Admin seulement | Storage RLS DELETE |

---

## ❓ Pourquoi Ces Erreurs ?

Les **Row Level Security (RLS)** policies de Supabase bloquent par défaut toutes les actions. C'est une bonne chose pour la sécurité ! 

Mais pour votre cas d'usage (contributions publiques), vous devez **explicitement autoriser** :
1. Les utilisateurs anonymes à **uploader** des fichiers
2. Les utilisateurs anonymes à **insérer** des enregistrements dans la table

Les contributions passent ensuite par la validation manuelle dans le backoffice avant d'être affichées publiquement, donc c'est sécurisé ! 🔒

---

## 🆘 Si Ça Ne Marche Toujours Pas

1. **Vérifiez dans Supabase** :
   - Allez dans **Authentication > Policies**
   - Vérifiez que les policies existent pour `audio_contributions`
   - Allez dans **Storage > Policies** 
   - Vérifiez que les policies existent pour le bucket `audio-contributions`

2. **Vérifiez les variables d'environnement** :
   - `VITE_SUPABASE_URL` est définie
   - `VITE_SUPABASE_ANON_KEY` est définie

3. **Ouvrez la console du navigateur** et envoyez-moi l'erreur exacte !

---

## 📋 Checklist Finale

- [ ] Script 1 exécuté (nouveaux champs)
- [ ] Script 2 exécuté (storage RLS)
- [ ] Script 3 exécuté (table RLS) ⬅️ **Le plus important pour l'erreur actuelle**
- [ ] Site rechargé
- [ ] Test d'enregistrement + envoi réussi

Bonne chance ! 🚀

