# Audit & Roadmap : Projet "Portfolio Builder Engine"

## PARTIE 1 : Audit Complet et Profond du Projet

### 1. État des lieux architectural
Actuellement, le projet est une application front-end React propulsée par Vite. Il a récemment subi une migration majeure d'un fichier HTML monolithique (`juvanio.html`) vers une structure basée sur des composants React modulaires.

**Points forts actuels :**
- **Découplage initial réussi :** Les données (textes, liens, traductions) sont isolées dans `data.json`. Les variables visuelles (couleurs, typographie, timings) sont isolées dans `skin.json`.
- **Mécanisme d'injection dynamique :** L'application est capable de lire des variables de configuration et de les injecter dans le DOM au moment de l'exécution (via les CSS custom properties injectées dans `App.jsx`).
- **Composants réutilisables :** Le code a été scindé en composants distincts (`Hero.jsx`, `Skills.jsx`, `Experience.jsx`, etc.).

**Points de friction (Goulots d'étranglement pour la vision "Studio") :**
- **Le CSS est monolithique :** Le fichier `index.css` fait plus de 2000 lignes. Bien qu'il utilise des variables, toutes les règles de mise en page spécifiques aux composants y sont stockées. Si l'on crée de nouveaux templates (ex: un Hero différent), le fichier CSS deviendra ingérable.
- **Le Squelette est codé en dur :** Dans `App.jsx` et `ui-view`, l'ordre d'appel des composants est figé (`<Hero />`, `<Marquee />`, `<TenxyteArchitecture />`, etc.). Le `skin.json` peut changer les couleurs d'un mur, mais il ne peut pas dire à React *quel* mur construire.
- **Logique d'animation couplée :** Les effets complexes comme le `NetworkCanvas` ou le `CustomCursor` sont liés statiquement à l'arbre React, rendant difficile leur désactivation pure et simple sans ajouter des couches de `if/else` complexes dans le code.

### 2. Le Paradigme Cible
Le projet ne doit plus être "le portfolio de Juvanio". Il doit devenir un **Moteur de Rendu Agnostique**. 
L'application React ne doit rien savoir du design final. Elle doit agir comme une imprimante 3D : elle lit un plan de construction (`skin.json`), elle prend de la matière première (`data.json`), et elle assemble les blocs (Composants React) pour construire l'interface.


---

## PARTIE 2 : Roadmap Détaillée (La Transformation en "Studio")

Cette roadmap détaille, étape par étape, comment nous allons transformer ce projet en un générateur de portfolios administrable par skin.

### Phase 1 : Consolidation de l'Extraction des Données (Data)
*Objectif : Rendre le moteur aveugle à l'identité de l'utilisateur.*
1. **Vérification exhaustive :** S'assurer qu'aucun texte (même un label de bouton, un texte de chargement ou un message d'erreur) ne reste dans les fichiers `.jsx`.
2. **Centralisation des médias :** Tous les chemins vers des images, vidéos, ou icônes doivent être déclarés dans `data.json` ou `skin.json` (selon s'ils relèvent du contenu personnel ou du design de l'interface).
3. **Typage des données (Optionnel mais recommandé) :** Créer un schéma strict (ex: JSON Schema) pour `data.json` afin de garantir que l'interface de création ("Le Studio") sait exactement quels champs le client doit remplir.

### Phase 2 : Extraction Profonde du Skin (La Couche CSS)
*Objectif : Rendre le moteur aveugle au design.*
1. **Atomisation du CSS :** Découper `index.css` en modules CSS (`Hero.module.css`, `Skills.module.css`). Cela permettra au système de ne charger que le CSS des composants réellement utilisés par le skin.
2. **Variables Globales Universelles :** Normaliser le système de tokens dans `skin.json` (typography, palette, spacing, shapes, transitions, z-index).
3. **Gestion des effets globaux :** Isoler le CustomCursor, le bruit de fond, et le boot sequence dans des composants de type "Add-ons", qui ne sont montés par `App.jsx` que si le `skin.json` l'exige.

### Phase 3 : Le "Component Registry" (Le Cœur du Moteur)
*Objectif : Rendre la structure HTML totalement dynamique et dictée par le skin.*
1. **Création du Registre :** Créer un fichier `Registry.js` qui répertorie tous les blocs d'interface disponibles.
   - Ex: `HeroTerminal`, `HeroMinimal`, `SkillsGrid`, `SkillsRadar`, `FooterSimple`.
2. **Évolution de `skin.json` :** Ajouter une propriété `architecture` (ou `sections`) au skin. Le skin dictera l'ordre d'affichage.
   ```json
   "architecture": [
     { "id": "hero_1", "component": "HeroTerminal", "props": { "networkBg": true } },
     { "id": "skills_1", "component": "SkillsServerRack", "props": { "columns": 2 } }
   ]
   ```
3. **Le Rendu Dynamique :** Modifier `App.jsx` pour qu'il ne contienne plus qu'une boucle (map) parcourant `skin.architecture`. À chaque itération, il appelle le composant demandé depuis le Registre, en lui passant les données injectées de `data.json`.

### Phase 4 : Modularisation des Animations et Interactions
*Objectif : Permettre des comportements radicalement différents selon le skin.*
1. **Hooks d'animation indépendants :** Extraire la logique d'animation (ex: texte décrypté, scroll parallaxe) dans des Hooks custom (`useParallax`, `useGlitchText`).
2. **Liaison Conditionnelle :** Les composants React appliqueront ces hooks uniquement si les `props` envoyées par le `skin.json` les activent. Ainsi, un skin peut demander un portfolio très silencieux et statique, et un autre peut demander un portfolio très bruyant et animé.

### Phase 5 : Construction du "Skin Studio" (L'Interface Graphique)
*Objectif : L'interface utilisateur permettant à un non-développeur de générer son site.*
1. **Création d'une application d'administration :** Une route ou une application séparée (`/studio`) qui affiche l'Iframe du portfolio à droite, et un panneau de contrôle à gauche.
2. **Éditeur de Skin en temps réel :** Le panneau de contrôle modifie l'objet JavaScript `skin` en temps réel. Grâce au système de "Component Registry" et de "CSS Variables", le portfolio se re-rendra instantanément (WYSIWYG - What You See Is What You Get).
3. **Bouton d'exportation :** Une fois le design achevé, le studio génère et télécharge le nouveau fichier `skin.json`. Le client n'a plus qu'à déposer ce fichier (et son `data.json`) sur le serveur pour que son portfolio soit en ligne.
