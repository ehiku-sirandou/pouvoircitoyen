# 📤 Guide : Uploader l'Audio d'Omar Africa sur Supabase

## 🎯 Objectif
Remplacer l'audio placeholder par le vrai message audio d'Omar Africa.

---

## 📋 Étapes Détaillées

### Étape 1 : Créer un Bucket Public (si pas encore fait)

1. **Connectez-vous à Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre projet** "Pouvoir Citoyen"
3. **Menu "Storage"** (icône 📦 dans le menu de gauche)
4. **Cliquez sur "Create new bucket"**
5. **Remplissez le formulaire** :
   - **Name** : `public-assets`
   - **Public bucket** : ✅ **Cochez cette case** (IMPORTANT!)
   - **File size limit** : Laissez par défaut ou mettez 10 MB
6. **Cliquez sur "Create bucket"**

---

### Étape 2 : Uploader le Fichier Audio

1. **Cliquez sur le bucket** `public-assets` que vous venez de créer
2. **Cliquez sur "Upload file"** (bouton en haut à droite)
3. **Sélectionnez le fichier audio d'Omar Africa** depuis votre ordinateur
   - Formats supportés : MP3, WAV, OGG, M4A, etc.
   - Taille recommandée : < 5 MB
4. **Renommez le fichier** (optionnel mais recommandé) :
   - Nom suggéré : `omar-africa-message.mp3`
5. **Cliquez sur "Upload"**
6. **Attendez la fin de l'upload** ✅

---

### Étape 3 : Obtenir l'URL Publique

1. **Dans la liste des fichiers**, trouvez votre audio uploadé
2. **Cliquez sur le fichier** pour le sélectionner
3. **Cliquez sur "Copy URL"** ou cherchez le bouton "Get public URL"
4. **L'URL sera copiée** dans votre presse-papier

**Format de l'URL :**
```
https://[VOTRE-PROJET-ID].supabase.co/storage/v1/object/public/public-assets/omar-africa-message.mp3
```

**Exemple réel :**
```
https://qfjhnlmqcuksqlggdtfw.supabase.co/storage/v1/object/public/public-assets/omar-africa-message.mp3
```

---

### Étape 4 : Mettre à Jour le Code

Une fois que vous avez copié l'URL, **remplacez-la dans le code** :

#### Fichier à Modifier : `src/pages/Home.tsx`

**Ligne 117** - Remplacez :
```tsx
src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
```

**Par votre nouvelle URL :**
```tsx
src="https://qfjhnlmqcuksqlggdtfw.supabase.co/storage/v1/object/public/public-assets/omar-africa-message.mp3"
```

**Code complet :**
```tsx
<audio
  ref={audioRef}
  src="https://VOTRE-URL-SUPABASE-ICI.mp3"
  onEnded={() => setIsPlaying(false)}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>
```

---

### Étape 5 : Tester et Déployer

```bash
# Tester en local
npm run dev

# Vérifier que l'audio se charge et joue correctement
# Ouvrez http://localhost:5173 dans votre navigateur

# Si tout fonctionne, déployer
git add .
git commit -m "Ajout du message audio d'Omar Africa"
git push origin main
```

---

## 🔧 Méthode Alternative : Via la CLI Supabase

Si vous préférez utiliser la ligne de commande :

```bash
# Installer la CLI Supabase (si pas encore fait)
npm install -g supabase

# Se connecter
supabase login

# Uploader le fichier
supabase storage cp ./chemin/vers/audio.mp3 public-assets/omar-africa-message.mp3 --project-ref VOTRE-PROJECT-REF
```

---

## ⚠️ Points Importants

### 1. Le Bucket DOIT être Public
- ❌ Si le bucket est **privé**, l'audio ne jouera pas
- ✅ Assurez-vous que le bucket est **public**

### 2. Formats Audio Supportés
- ✅ **MP3** (recommandé) - Compatible tous navigateurs
- ✅ **OGG** - Bonne compression
- ✅ **WAV** - Qualité maximale mais fichier lourd
- ✅ **M4A** - Bonne qualité, taille raisonnable

### 3. Taille du Fichier
- 📊 Recommandé : **< 5 MB**
- ⚠️ Maximum : **10 MB**
- 💡 Astuce : Compressez l'audio si trop lourd (utilisez Audacity, ffmpeg, ou un site en ligne)

### 4. Nom du Fichier
- ✅ Utilisez des **tirets** ou **underscores** : `omar-africa-message.mp3`
- ❌ Évitez les **espaces** : `omar africa message.mp3`
- ❌ Évitez les **caractères spéciaux** : `omar_africa_message.mp3` ✅

---

## 🔐 Vérifier les Permissions

Si l'audio ne joue pas après l'upload, vérifiez les policies RLS du bucket :

1. **Allez dans Storage**
2. **Cliquez sur votre bucket** `public-assets`
3. **Onglet "Policies"**
4. **Assurez-vous qu'il y a une policy** pour `SELECT` (lecture publique)

**Policy SQL nécessaire :**
```sql
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'public-assets');
```

---

## 🧪 Test Rapide

Pour vérifier que l'URL fonctionne :

1. **Copiez l'URL** de votre audio
2. **Collez-la dans un nouvel onglet** du navigateur
3. **L'audio doit se télécharger ou jouer** directement
4. ✅ Si ça marche → L'URL est bonne !
5. ❌ Si erreur 403/404 → Vérifiez que le bucket est public

---

## 📝 Récapitulatif des Modifications

### Avant
```tsx
src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
```

### Après
```tsx
src="https://qfjhnlmqcuksqlggdtfw.supabase.co/storage/v1/object/public/public-assets/omar-africa-message.mp3"
```

---

## 🎉 C'est Tout !

Une fois l'URL mise à jour :
1. L'audio d'Omar Africa jouera automatiquement au chargement de la page
2. Il se mettra en pause quand l'utilisateur commence à enregistrer
3. Les utilisateurs peuvent le contrôler (play/pause/mute)

---

## 🆘 Problèmes Fréquents

### L'audio ne joue pas
- ✅ Vérifiez que le bucket est **public**
- ✅ Vérifiez que l'URL est **correcte** (copiez-la dans un navigateur)
- ✅ Vérifiez que le fichier est au bon format (MP3 recommandé)
- ✅ Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur 403 Forbidden
- ❌ Le bucket n'est **pas public**
- 🔧 Solution : Recréez le bucket en cochant "Public bucket"

### Erreur 404 Not Found
- ❌ L'URL est **incorrecte**
- 🔧 Solution : Revérifiez l'URL copiée depuis Supabase

---

✅ **Guide complet ! Suivez ces étapes et votre audio sera en ligne.**

