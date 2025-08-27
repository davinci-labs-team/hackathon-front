# Davinci Hackathon – Frontend

Une application frontend construite avec Vue.js 3, TypeScript, Pinia et Vite.

## Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm ou yarn
- Navigateur compatible Chromium (Google Chrome, Edge, Brave...)

## Installation

1. **Clonez le repository** :

   ```
   git clone <votre-repo>
   cd <nom-du-projet-frontend>
   ```

2. **Installez les dépendances** :
   `npm install`

## Configuration

### Variables d'environnement

Créez un fichier .env à la racine du projet avec les variables suivantes :

## URL de l'API Backend

VITE_API_URL=http://localhost:3000

## Mode de l'application

VITE_APP_ENV=development

Note : Les variables doivent commencer par VITE\_ pour être accessibles dans le code via import.meta.env.

## Démarrage de l'application

### Mode développement :

`npm run dev`
(L'application sera disponible à l'adresse : http://localhost:5173)

### Build de production :

`npm run build`
(Les fichiers statiques seront générés dans le dossier dist/.)

### Prévisualisation du build :

`npm run preview`

## Scripts disponibles

- npm run dev - Démarre le serveur de développement (Vite)
- npm run build - Build l'application pour la production
- npm run preview - Prévisualise le build de production
- npm run lint - Vérifie le code avec ESLint
- npm run format - Formate le code avec Prettier

## Structure du projet

```
src/
├── assets/           # Fichiers statiques (images, icônes)
├── components/       # Composants Vue réutilisables
├── stores/           # Stores Pinia
├── views/            # Pages principales
├── router/           # Configuration du router
├── App.vue           # Composant racine
└── main.ts           # Point d'entrée
```

## Technologies utilisées

- Vue.js v3.5.17 - Framework JavaScript
- TypeScript v5.8.3 - Typage statique
- Pinia v3.0.3 - Gestion d'état
- TailwindCSS v4.1.11 - Framework CSS utilitaire
- Vuetify v3.8.11 - Librairie UI
- Vite v7.0.0 - Bundler et dev server
- ESLint & Prettier - Qualité et formatage du code

## Compatibilité & Responsivité

- Navigateurs supportés : uniquement les navigateurs basés sur Chromium.
- Responsive : optimisé uniquement pour les écrans au ratio 16:9.

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le repository.
