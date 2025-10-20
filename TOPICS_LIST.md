# 📋 Liste des Sujets Disponibles

## Sujets Prédéfinis

Voici la liste complète des sujets que les administrateurs peuvent sélectionner lors de la validation d'une contribution audio :

1. **Éducation** - Système éducatif, écoles, universités, formation
2. **Santé** - Système de santé, hôpitaux, médicaments, accès aux soins
3. **Emploi** - Chômage, création d'emplois, conditions de travail
4. **Infrastructure** - Routes, ponts, bâtiments publics
5. **Sécurité** - Police, justice, sécurité des citoyens
6. **Justice** - Système judiciaire, droits, accès à la justice
7. **Économie** - Situation économique, prix, coût de la vie
8. **Environnement** - Pollution, déchets, changement climatique
9. **Agriculture** - Agriculture, pêche, élevage, développement rural
10. **Jeunesse** - Problématiques des jeunes, éducation, emploi jeune
11. **Transport** - Transports en commun, mobilité urbaine
12. **Logement** - Accès au logement, loyers, construction
13. **Culture** - Arts, patrimoine, identité culturelle
14. **Sport** - Infrastructures sportives, soutien aux sportifs
15. **Gouvernance** - Gestion publique, politique, démocratie
16. **Corruption** - Lutte contre la corruption, transparence
17. **Droits humains** - Libertés, droits fondamentaux
18. **Femmes** - Droits des femmes, égalité de genre
19. **Électricité** - Accès à l'électricité, délestages, énergie
20. **Eau** - Accès à l'eau potable, assainissement
21. **Autre** - Pour les sujets ne correspondant pas aux catégories ci-dessus

## Interface de Sélection

Dans le backoffice, lors de la validation d'une contribution :

### ✅ Fonctionnalité
- **Sélection multiple** : Vous pouvez sélectionner plusieurs sujets pour un même enregistrement
- **Interface intuitive** : Cliquez sur un badge pour le sélectionner/désélectionner
- **Visuel** : 
  - Sujets sélectionnés : Badge vert avec texte blanc
  - Sujets non sélectionnés : Badge blanc avec bordure grise
- **Obligation** : Au moins un sujet doit être sélectionné pour valider

### 💡 Exemple d'Utilisation

Si un citoyen parle des problèmes d'accès à l'eau et d'électricité dans son quartier, vous sélectionnerez :
- ✅ **Eau**
- ✅ **Électricité**
- ✅ **Infrastructure** (si pertinent)

## Modification de la Liste

Pour ajouter, modifier ou retirer des sujets, modifiez le tableau `AVAILABLE_TOPICS` dans le fichier :
```
src/pages/Backoffice.tsx
```

Lignes 8-30 :
```typescript
const AVAILABLE_TOPICS = [
  'Éducation',
  'Santé',
  // ... ajoutez vos sujets ici
];
```

## Statistiques Futures

Cette liste de sujets permettra dans le futur de :
- 📊 Générer des statistiques par sujet
- 🔍 Filtrer les contributions par thématique
- 📈 Analyser les préoccupations principales des citoyens
- 🗺️ Créer des visualisations par région et par sujet

