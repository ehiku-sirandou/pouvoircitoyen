# Mise à Jour du Déploiement

## Étapes à Suivre

### 1. Appliquer la Migration de Base de Données

Connectez-vous à votre projet Supabase et exécutez cette migration SQL :

```sql
-- Add user information fields and metadata to audio_contributions table

-- Add columns for user info
ALTER TABLE audio_contributions
ADD COLUMN full_name text,
ADD COLUMN phone_number text,
ADD COLUMN gender text CHECK (gender IN ('homme', 'femme', 'autre', 'non_specifie')),
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

**Comment faire :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Créez une nouvelle requête
5. Collez le code SQL ci-dessus
6. Cliquez sur "Run"

### 2. Déployer le Frontend sur Vercel

Le code est déjà prêt. Il suffit de pousser les changements sur GitHub et Vercel les déploiera automatiquement.

```bash
git add .
git commit -m "Ajout des champs utilisateur et métadonnées + fonction de suppression"
git push origin main
```

### 3. Vérification

Après le déploiement, vérifiez que :

✅ **Page d'accueil :**
- L'enregistrement audio fonctionne
- Les champs "Nom complet" et "Numéro de téléphone" apparaissent après l'enregistrement
- Ces champs sont bien optionnels (on peut envoyer sans les remplir)

✅ **Backoffice :**
- Les informations utilisateur (nom/téléphone) s'affichent si renseignées
- Le formulaire de validation demande obligatoirement :
  - Une description
  - Le sexe (sélection)
  - Les sujets (séparés par des virgules)
- Pour les contributions validées :
  - Les métadonnées (sexe et sujets) s'affichent correctement
  - Un bouton "Supprimer" est disponible

## Nouveaux Champs de la Base de Données

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `full_name` | text | Non | Nom complet de l'utilisateur |
| `phone_number` | text | Non | Numéro de téléphone |
| `gender` | text | Oui (à la validation) | homme, femme, autre, non_specifie |
| `topics` | text[] | Oui (à la validation) | Liste des sujets évoqués |

## Questions Fréquentes

**Q: Que se passe-t-il pour les enregistrements existants ?**
R: Les nouveaux champs seront NULL pour les enregistrements existants. Vous pouvez les modifier dans le backoffice si nécessaire.

**Q: Peut-on supprimer un enregistrement rejeté ?**
R: Pour l'instant, le bouton de suppression n'apparaît que pour les enregistrements validés. Si vous souhaitez aussi supprimer les rejetés, demandez-le !

**Q: Les sujets doivent-ils être prédéfinis ?**
R: Non, l'administrateur peut saisir librement les sujets, séparés par des virgules. Si vous souhaitez une liste prédéfinie, on peut l'ajouter.

