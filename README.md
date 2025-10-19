# Contributions Citoyennes

Plateforme de contributions audio citoyennes avec validation et affichage public.

## 🚀 Déploiement

### 1. Backend Supabase

#### Prérequis
- Compte Supabase créé
- Projet Supabase initialisé

#### Étapes
1. Créer un nouveau projet sur [supabase.com](https://supabase.com)
2. Récupérer l'URL et la clé anonyme du projet
3. Exécuter la migration :
   ```bash
   npx supabase db push
   ```
   Ou copier manuellement le contenu de `supabase/migrations/20251018231910_create_audio_contributions_system.sql` dans l'éditeur SQL de Supabase.

4. Créer un utilisateur admin dans l'onglet Authentication de Supabase

### 2. Frontend Vercel

#### Prérequis
- Compte Vercel créé
- Repository GitHub

#### Étapes
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel :
   - `VITE_SUPABASE_URL` : URL de votre projet Supabase
   - `VITE_SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
3. Déployer

## 🛠 Développement local

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Créer un fichier `.env` avec vos variables Supabase :
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## 📱 Fonctionnalités

- Enregistrement audio via microphone
- Validation des contributions par les administrateurs
- Affichage public des contributions validées
- Interface de gestion (backoffice)
- Authentification sécurisée
