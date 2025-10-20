# Instructions de Migration

## Nouvelle Migration : Ajout des Champs Utilisateur et Métadonnées

### Fichier de Migration
`supabase/migrations/20251019_add_user_info_and_metadata.sql`

### Ce qui a été ajouté :

1. **Champs utilisateur (optionnels)**
   - `full_name` : Nom complet de l'utilisateur
   - `phone_number` : Numéro de téléphone de l'utilisateur

2. **Champs métadonnées (obligatoires lors de la validation)**
   - `gender` : Sexe (homme, femme, autre, non_specifie)
   - `topics` : Liste des sujets évoqués dans l'enregistrement (tableau de texte)

3. **Nouvelle politique RLS**
   - Permet aux utilisateurs authentifiés de supprimer les contributions

### Pour appliquer la migration sur Supabase :

1. Connectez-vous à votre projet Supabase
2. Allez dans l'onglet "SQL Editor"
3. Copiez-collez le contenu du fichier de migration
4. Exécutez le script SQL

### Ou via la CLI Supabase :

```bash
supabase db push
```

### Modifications Frontend :

1. **AudioRecorder** : Ajout de champs optionnels nom complet et téléphone
2. **Backoffice** : 
   - Affichage des informations utilisateur si disponibles
   - Formulaire pour saisir le sexe et les sujets lors de la validation
   - Affichage des métadonnées pour les contributions validées
   - Bouton de suppression pour les contributions validées

### Workflow Utilisateur :

1. L'utilisateur enregistre un audio
2. Il peut optionnellement renseigner son nom et téléphone
3. L'administrateur dans le backoffice :
   - Voit les informations utilisateur si renseignées
   - Doit obligatoirement saisir le sexe et les sujets avant de valider
   - Peut supprimer une contribution même si elle est validée

