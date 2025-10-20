# 🚀 CORRECTION RAPIDE - COPIER-COLLER CE SCRIPT

## ❌ Erreur Actuelle
```
403 (Forbidden)
new row violates row-level security policy for table "audio_contributions"
```

## ✅ Solution en 2 Minutes

### Étape 1 : Connectez-vous à Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"**
4. Créez une **"New query"**

### Étape 2 : Copiez-Collez CE Script Complet

**COPIER TOUT ÇA ↓↓↓**

```sql
-- ============================================================================
-- MIGRATION COMPLÈTE - POUVOIR CITOYEN
-- ============================================================================

-- Ajout des nouveaux champs
ALTER TABLE audio_contributions
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('homme', 'femme')),
ADD COLUMN IF NOT EXISTS topics text[];

-- Fix RLS TABLE : Permettre insertion anonyme
DROP POLICY IF EXISTS "Allow anonymous users to insert contributions" ON audio_contributions;
CREATE POLICY "Allow anonymous users to insert contributions"
ON audio_contributions FOR INSERT TO public WITH CHECK (true);

-- Fix RLS TABLE : Lecture publique des validés
DROP POLICY IF EXISTS "Anyone can view validated contributions" ON audio_contributions;
CREATE POLICY "Anyone can view validated contributions"
ON audio_contributions FOR SELECT TO public USING (status = 'validated');

-- Fix RLS TABLE : Admins peuvent tout voir
DROP POLICY IF EXISTS "Authenticated users can view all contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can view all contributions"
ON audio_contributions FOR SELECT TO authenticated USING (true);

-- Fix RLS TABLE : Admins peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can update contributions"
ON audio_contributions FOR UPDATE TO authenticated USING (true);

-- Fix RLS TABLE : Admins peuvent supprimer
DROP POLICY IF EXISTS "Authenticated users can delete contributions" ON audio_contributions;
CREATE POLICY "Authenticated users can delete contributions"
ON audio_contributions FOR DELETE TO authenticated USING (true);

-- Fix RLS STORAGE : Upload public
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'audio-contributions');

-- Fix RLS STORAGE : Lecture publique
DROP POLICY IF EXISTS "Allow public access to audio files" ON storage.objects;
CREATE POLICY "Allow public access to audio files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'audio-contributions');

-- Fix RLS STORAGE : Suppression admin
DROP POLICY IF EXISTS "Allow authenticated users to delete audio files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete audio files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'audio-contributions');
```

### Étape 3 : Exécutez
Cliquez sur le bouton **"Run"** (ou Ctrl+Enter)

### Étape 4 : Testez
1. Rechargez votre site
2. Enregistrez un audio
3. Envoyez-le
4. ✅ **Ça devrait marcher !**

---

## 🎯 Ce Script Fait Tout en Une Fois

- ✅ Ajoute les champs nom/téléphone/sexe/sujets
- ✅ Permet aux utilisateurs anonymes d'uploader des fichiers
- ✅ Permet aux utilisateurs anonymes d'insérer des contributions
- ✅ Permet aux admins de tout gérer dans le backoffice
- ✅ N'affiche que les contributions validées au public

---

## 📞 Ça Ne Marche Toujours Pas ?

Envoyez-moi :
1. La capture d'écran de l'erreur dans la console Supabase (si elle est rouge)
2. La nouvelle erreur dans la console du navigateur (F12)

---

## 🎉 Ça Marche ?

Une fois que c'est bon :
1. N'oubliez pas de remplacer l'audio placeholder par celui d'Omar Africa
2. Testez l'envoi d'un audio avec nom/téléphone
3. Testez la validation dans le backoffice avec sexe/sujets
4. Testez la suppression d'une contribution validée

Tout est prêt ! 🚀

