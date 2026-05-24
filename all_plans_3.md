# Phase 3 — Le "Component Registry" : Détail d'Implémentation Complet

> **Objectif** : La structure de la page n'est plus codée en dur dans `App.jsx`. Elle est dictée par le tableau `skin.architecture` retourné par l'API. Le moteur devient un interpréteur de configuration.

---

## Contexte : L'état actuel (problème à résoudre)

Dans le code existant (`App.jsx`), l'ordre et la présence des composants sont hardcodés :

```jsx
// ❌ AVANT — App.jsx (lignes 1636–1644 dans all_codes.txt)
<main>
  <Hero language={language} data={data} skin={skin} />
  <Marquee />
  <TenxyteArchitecture language={language} data={data} skin={skin} />
  <Skills language={language} data={data} skin={skin} />
  <Experience language={language} data={data} skin={skin} />
  <Formation language={language} data={data} skin={skin} />
  <Contact language={language} data={data} skin={skin} />
</main>
```

**Problèmes** :
- Ajouter un nouveau bloc = modifier `App.jsx` manuellement
- Réordonner les sections = modifier le code source
- Activer/désactiver un bloc par client = impossible sans code
- Multi-tenancy impossible (chaque client a la même structure)

---

## 1. Structure de `skin.architecture` (contrat API)

Avant d'écrire le registry, il faut définir le format exact du tableau `architecture` dans la réponse API / `skin.json` (seed de dev).

### 1.1 Format JSON de `skin.architecture`

```json
// skin.json (seed de dev) — champ "architecture"
{
  "architecture": [
    {
      "id": "boot-sequence-addon",
      "component": "BootSequenceAddon",
      "enabled": true,
      "props": {}
    },
    {
      "id": "navbar-main",
      "component": "Navbar",
      "enabled": true,
      "props": {}
    },
    {
      "id": "hero-terminal",
      "component": "HeroTerminal",
      "enabled": true,
      "props": {
        "variant": "split",
        "showApiToggle": true
      }
    },
    {
      "id": "marquee-bar",
      "component": "MarqueeBar",
      "enabled": true,
      "props": {}
    },
    {
      "id": "tenxyte-showcase",
      "component": "TenxyteShowcase",
      "enabled": true,
      "props": {}
    },
    {
      "id": "skills-server-rack",
      "component": "SkillsServerRack",
      "enabled": true,
      "props": {}
    },
    {
      "id": "experience-timeline",
      "component": "ExperienceTimeline",
      "enabled": true,
      "props": {}
    },
    {
      "id": "formation-grid",
      "component": "FormationGrid",
      "enabled": true,
      "props": {}
    },
    {
      "id": "contact-terminal",
      "component": "ContactTerminal",
      "enabled": true,
      "props": {}
    }
  ]
}
```

### 1.2 Description des champs

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Identifiant unique de l'entrée (clé React + référence Studio) |
| `component` | `string` | ✅ | Clé dans le REGISTRY — correspond au nom d'export du composant |
| `enabled` | `boolean` | ✅ | Si `false`, le bloc est ignoré (pas rendu, pas importé) |
| `props` | `object` | ✅ (peut être `{}`) | Props spécifiques à cette instance du composant |

### 1.3 Mise à jour du schema JSON (source de vérité partagée)

```json
// packages/schemas/skin.schema.json — fragment
{
  "architecture": {
    "type": "array",
    "items": {
      "type": "object",
      "required": ["id", "component", "enabled", "props"],
      "properties": {
        "id":        { "type": "string", "minLength": 1 },
        "component": { "type": "string", "minLength": 1 },
        "enabled":   { "type": "boolean" },
        "props":     { "type": "object" }
      },
      "additionalProperties": false
    }
  }
}
```

---

## 2. `Registry.js` — Le catalogue des composants

Le registry est un **objet statique** qui mappe les noms de composants (strings) vers les composants React réels, importés en **lazy loading**.

### 2.1 Structure complète du fichier

```js
// src/registry/Registry.js
import React from 'react';

// --- Blocs de contenu ---
const HeroTerminal       = React.lazy(() => import('../components/hero/HeroTerminal'));
const HeroMinimal        = React.lazy(() => import('../components/hero/HeroMinimal'));   // variante future
const MarqueeBar         = React.lazy(() => import('../components/MarqueeBar'));
const TenxyteShowcase    = React.lazy(() => import('../components/TenxyteShowcase'));
const SkillsServerRack   = React.lazy(() => import('../components/skills/SkillsServerRack'));
const SkillsRadar        = React.lazy(() => import('../components/skills/SkillsRadar')); // variante future
const ExperienceTimeline = React.lazy(() => import('../components/experience/ExperienceTimeline'));
const FormationGrid      = React.lazy(() => import('../components/formation/FormationGrid'));
const ContactTerminal    = React.lazy(() => import('../components/contact/ContactTerminal'));

// --- Add-ons (rendus en dehors du <main>) ---
const BootSequenceAddon  = React.lazy(() => import('../components/addons/BootSequenceAddon'));
const CustomCursorAddon  = React.lazy(() => import('../components/addons/CustomCursorAddon'));
const NoiseOverlayAddon  = React.lazy(() => import('../components/addons/NoiseOverlayAddon'));
const NetworkCanvasAddon = React.lazy(() => import('../components/addons/NetworkCanvasAddon'));

// --- Navigation & structure ---
const Navbar             = React.lazy(() => import('../components/Navbar'));
const ApiViewPanel       = React.lazy(() => import('../components/ApiViewPanel'));

/**
 * REGISTRY — catalogue de tous les composants disponibles dans le moteur.
 * Clé = valeur de skin.architecture[n].component (string)
 * Valeur = composant React lazy-loadé
 *
 * RÈGLE : ne jamais supprimer une clé sans migration de base de données.
 * Pour retirer un composant, le marquer `DEPRECATED` en commentaire.
 */
export const REGISTRY = {
  // Blocs de contenu
  HeroTerminal,
  HeroMinimal,
  MarqueeBar,
  TenxyteShowcase,
  SkillsServerRack,
  SkillsRadar,
  ExperienceTimeline,
  FormationGrid,
  ContactTerminal,

  // Add-ons
  BootSequenceAddon,
  CustomCursorAddon,
  NoiseOverlayAddon,
  NetworkCanvasAddon,

  // Navigation & structure
  Navbar,
  ApiViewPanel,
};

/**
 * Vérifie qu'un nom de composant est bien enregistré dans le registry.
 * Utile pour les erreurs de dev et la validation Studio.
 */
export function isRegistered(componentName) {
  return componentName in REGISTRY;
}
```

### 2.2 Règles de nommage et organisation

- **Nom de composant** = PascalCase, correspond au nom d'export du fichier
- **Fichier** = même nom que le composant (`HeroTerminal.jsx`)
- **Dossier** = nom de section en minuscule (`hero/`, `skills/`, `addons/`)
- **Variantes** = suffixe descriptif (`HeroMinimal`, `SkillsRadar`) — jamais de numéros
- Un composant est **enregistré une fois** même s'il est utilisé plusieurs fois dans `architecture`

---

## 3. Skeleton screens par composant

Chaque composant lazy a un skeleton affiché pendant le chargement. Ils sont **co-localisés** avec le composant.

### 3.1 Convention de fichiers

```
src/components/hero/
├── HeroTerminal.jsx
├── HeroTerminal.module.css
└── HeroTerminal.skeleton.jsx    ← skeleton co-localisé
```

### 3.2 Skeleton générique réutilisable (`BlockSkeleton`)

```jsx
// src/components/shared/BlockSkeleton.jsx
import styles from './BlockSkeleton.module.css';

/**
 * Squelette générique affiché en fallback Suspense.
 * height : hauteur estimée du bloc (défaut 400px).
 * label : nom du composant attendu (dev uniquement).
 */
export default function BlockSkeleton({ height = 400, label }) {
  return (
    <div
      className={styles.skeleton}
      style={{ minHeight: height }}
      aria-hidden="true"
      data-component={label}
    >
      <div className={styles.shimmer} />
    </div>
  );
}
```

```css
/* src/components/shared/BlockSkeleton.module.css */
.skeleton {
  width: 100%;
  background: var(--surface, #0d1117);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  position: relative;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.04) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Respecte prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .shimmer { animation: none; opacity: 0.5; }
}
```

### 3.3 Fallback spécifique (exemple `HeroTerminal`)

```jsx
// src/components/hero/HeroTerminal.skeleton.jsx
import BlockSkeleton from '../shared/BlockSkeleton';

export default function HeroTerminalSkeleton() {
  return <BlockSkeleton height={600} label="HeroTerminal" />;
}
```

---

## 4. Composant `MissingComponentFallback`

Affiché quand `skin.architecture` référence une clé absente du registry (erreur de config, typo Studio, composant non encore implémenté).

```jsx
// src/components/shared/MissingComponentFallback.jsx
export default function MissingComponentFallback({ name }) {
  // N'affiche rien en production
  if (import.meta.env.PROD) return null;

  // En développement : bloc d'alerte visible
  return (
    <div style={{
      border: '2px dashed var(--accent2, #ff4d6d)',
      borderRadius: '8px',
      padding: '2rem',
      margin: '1rem 0',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '13px',
      color: 'var(--accent2, #ff4d6d)',
      background: 'rgba(255,77,109,0.05)',
    }}>
      <strong>[DEV] Composant introuvable dans le registry :</strong>{' '}
      <code>&quot;{name}&quot;</code>
      <p style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>
        Vérifier que ce composant est bien enregistré dans{' '}
        <code>src/registry/Registry.js</code>
        {' '}et que la clé correspond exactement à{' '}
        <code>skin.architecture[n].component</code>.
      </p>
    </div>
  );
}
```

---

## 5. `App.jsx` — La boucle dynamique complète

C'est le changement central de la Phase 3. L'`App.jsx` passe de la liste statique à une boucle pilotée par `skin.architecture`.

### 5.1 Nouveau `App.jsx` complet

```jsx
// src/App.jsx
import { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { REGISTRY } from './registry/Registry';
import BlockSkeleton from './components/shared/BlockSkeleton';
import MissingComponentFallback from './components/shared/MissingComponentFallback';
import BootSequenceSkeleton from './components/shared/BootSequenceSkeleton';
import ErrorScreen from './components/shared/ErrorScreen';

// Résout le slug depuis le hostname (ex: "juvanio.portfolioengine.com" => "juvanio")
function resolveSlugFromHostname() {
  if (import.meta.env.DEV) return import.meta.env.VITE_DEV_SLUG || 'juvanio';
  const host = window.location.hostname; // "juvanio.portfolioengine.com"
  return host.split('.')[0];
}

function App() {
  const slug = resolveSlugFromHostname();
  const { skin, data, status, error } = usePortfolioData(slug);

  const [apiMode, setApiMode]     = useState(false);
  const [language, setLanguage]   = useState('fr');
  const [theme, setTheme]         = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 8) ? 'dark' : 'light';
  });

  // Injection des CSS custom properties depuis skin (identique à l'existant)
  useLayoutEffect(() => {
    if (!skin) return;
    const currentTheme = skin.theme[theme];
    const cssVariables = {
      ...currentTheme,
      ...(skin.typography || {}),
      ...(skin.tokens?.spacing   ? flattenTokens('--spacing', skin.tokens.spacing) : {}),
      ...(skin.tokens?.zIndex    ? flattenTokens('--z',       skin.tokens.zIndex)  : {}),
      ...(skin.layout || {}),
      ...(skin.effects || {}),
    };
    Object.entries(cssVariables).forEach(([key, value]) => {
      if (key.startsWith('--')) document.documentElement.style.setProperty(key, value);
    });
  }, [theme, skin]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  // defaultLang exposé par l'API
  useEffect(() => {
    if (skin?.defaultLang) setLanguage(skin.defaultLang);
  }, [skin]);

  if (status === 'loading') return <BootSequenceSkeleton />;
  if (status === 'error')   return <ErrorScreen message={error?.message} />;

  // Props communes injectées dans tous les blocs
  const sharedProps = {
    data,
    skin,
    language,
    theme,
    apiMode,
    onToggleApi:      () => setApiMode(m => !m),
    onToggleLanguage: () => setLanguage(l => l === 'fr' ? 'en' : 'fr'),
    onToggleTheme:    () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
  };

  // Filtre les blocs activés, puis les sépare en add-ons et blocs de contenu
  const activeBlocks = (skin.architecture || []).filter(b => b.enabled !== false);
  const ADDON_COMPONENTS = new Set(['BootSequenceAddon', 'CustomCursorAddon', 'NoiseOverlayAddon', 'NetworkCanvasAddon']);
  const STRUCTURE_COMPONENTS = new Set(['Navbar', 'ApiViewPanel']);

  const addonBlocks    = activeBlocks.filter(b => ADDON_COMPONENTS.has(b.component));
  const structBlocks   = activeBlocks.filter(b => STRUCTURE_COMPONENTS.has(b.component));
  const contentBlocks  = activeBlocks.filter(b => !ADDON_COMPONENTS.has(b.component) && !STRUCTURE_COMPONENTS.has(b.component));

  const renderBlock = ({ id, component, props = {} }) => {
    const Block = REGISTRY[component];
    if (!Block) return <MissingComponentFallback key={id} name={component} />;
    return (
      <Suspense key={id} fallback={<BlockSkeleton height={400} label={component} />}>
        <Block {...sharedProps} {...props} />
      </Suspense>
    );
  };

  return (
    <>
      {/* Add-ons globaux (curseur, bruit, boot screen...) */}
      {addonBlocks.map(renderBlock)}

      {/* Navigation et panneaux de structure */}
      {structBlocks.map(renderBlock)}

      {/* Corps principal — ordre dicté par skin.architecture */}
      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          {contentBlocks.map(renderBlock)}
        </main>

        {/* Footer — sera migré en composant FooterBlock en Phase 3.2 */}
        <footer style={{ position: 'relative', overflow: 'hidden' }}>
          <span>{(data.footer?.[language] || data.footer?.fr)?.copyright}</span>
        </footer>
      </div>
    </>
  );
}

// Utilitaire : aplatit { sm: '8px', md: '16px' } => { '--spacing-sm': '8px', '--spacing-md': '16px' }
function flattenTokens(prefix, obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${prefix}-${k}`, v])
  );
}

export default App;
```

---

## 6. Migration des composants existants vers la nouvelle interface

Les composants actuels (`Hero.jsx`, `Skills.jsx`, etc.) doivent être renommés et leurs props normalisées pour correspondre à la convention du registry.

### 6.1 Table de correspondance (ancien → nouveau)

| Ancien fichier | Nouveau fichier | Clé registry |
|---|---|---|
| `components/Hero.jsx` | `components/hero/HeroTerminal.jsx` | `HeroTerminal` |
| `components/Marquee.jsx` | `components/MarqueeBar.jsx` | `MarqueeBar` |
| `components/TenxyteArchitecture.jsx` | `components/TenxyteShowcase.jsx` | `TenxyteShowcase` |
| `components/Skills.jsx` | `components/skills/SkillsServerRack.jsx` | `SkillsServerRack` |
| `components/Experience.jsx` | `components/experience/ExperienceTimeline.jsx` | `ExperienceTimeline` |
| `components/Formation.jsx` | `components/formation/FormationGrid.jsx` | `FormationGrid` |
| `components/Contact.jsx` | `components/contact/ContactTerminal.jsx` | `ContactTerminal` |
| `components/BootSequence.jsx` | `components/addons/BootSequenceAddon.jsx` | `BootSequenceAddon` |
| `components/CustomCursor.jsx` | `components/addons/CustomCursorAddon.jsx` | `CustomCursorAddon` |

### 6.2 Interface de props normalisée (contrat de tous les blocs)

Chaque composant enregistré **doit** accepter ces props (toutes optionnelles, jamais destructurées de force) :

```ts
interface BlockProps {
  // Données et skin (obligatoires pour les blocs de contenu)
  data:     PortfolioData;
  skin:     SkinConfig;
  language: 'fr' | 'en';
  theme:    'dark' | 'light';

  // Handlers de navigation globaux (optionnels — uniquement pour Navbar/ApiViewPanel)
  apiMode?:          boolean;
  onToggleApi?:      () => void;
  onToggleLanguage?: () => void;
  onToggleTheme?:    () => void;

  // Props spécifiques au bloc (viennent de skin.architecture[n].props)
  [key: string]: unknown;
}
```

### 6.3 Exemple de migration — `Experience.jsx` → `ExperienceTimeline.jsx`

Seul le nom de fichier, le nom de fonction et l'emplacement changent. Le code interne reste identique :

```jsx
// src/components/experience/ExperienceTimeline.jsx
// (migration de src/components/Experience.jsx — contenu inchangé)
import { useEffect, useRef } from 'react';
import DecryptedText from '../shared/DecryptedText';

export default function ExperienceTimeline({ language, data, skin }) {
  // ... code identique à Experience.jsx
}
```

> Les composants `data`, `skin`, `language` sont déjà les bons props — **aucun refactoring interne requis pour la Phase 3**.

---

## 7. Cache React Query

### 7.1 Installation

```bash
npm install @tanstack/react-query
```

### 7.2 Setup dans `main.jsx`

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  5 * 60 * 1000,  // 5 minutes — données considérées fraîches
      gcTime:    10 * 60 * 1000,  // 10 minutes — durée de vie en cache après démontage
      retry:     2,               // 2 tentatives avant erreur
      refetchOnWindowFocus: false, // pas de refetch au focus (portfolio = lecture seule)
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

### 7.3 `usePortfolioData` mis à jour (Phase 0 → Phase 3)

```js
// src/hooks/usePortfolioData.js
import { useQuery } from '@tanstack/react-query';
import localData from '../../dev-seeds/data.json';
import localSkin from '../../dev-seeds/skin.json';

async function fetchPortfolio(slug) {
  const res = await fetch(`/api/v1/portfolio/${slug}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json(); // { skin, data }
}

export function usePortfolioData(slug) {
  if (import.meta.env.DEV) {
    // Mode développement : seeds locaux, aucun appel réseau
    return { skin: localSkin, data: localData, status: 'success', error: null };
  }

  // Mode production : React Query avec cache 5 min
  const { data, status, error } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn:  () => fetchPortfolio(slug),
    enabled:  !!slug,
  });

  return {
    skin:   data?.skin   ?? null,
    data:   data?.data   ?? null,
    status: status === 'pending' ? 'loading' : status,
    error,
  };
}
```

---

## 8. `ErrorScreen` et `BootSequenceSkeleton`

### 8.1 `ErrorScreen`

```jsx
// src/components/shared/ErrorScreen.jsx
export default function ErrorScreen({ message }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'var(--bg, #080a0f)', color: 'var(--accent2, #ff4d6d)',
      fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
      gap: '1rem', padding: '2rem',
    }}>
      <span style={{ fontSize: '2rem' }}>⚠</span>
      <strong>Erreur de chargement</strong>
      {message && <code style={{ color: 'var(--muted)' }}>{message}</code>}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem', padding: '0.5rem 1.5rem',
          background: 'transparent', border: '1px solid var(--accent2)',
          color: 'var(--accent2)', cursor: 'pointer',
          fontFamily: 'inherit', borderRadius: '4px',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
```

### 8.2 `BootSequenceSkeleton`

```jsx
// src/components/shared/BootSequenceSkeleton.jsx
// Affiché pendant le premier chargement de l'API, avant que BootSequenceAddon prenne le relais
export default function BootSequenceSkeleton() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg, #080a0f)',
      color: 'var(--accent, #00e5c3)',
      fontFamily: "'JetBrains Mono', monospace", fontSize: '14px',
      letterSpacing: '2px',
    }}>
      <span className="boot-cursor-blink">Initializing...</span>
    </div>
  );
}
```

---

## 9. Structure de fichiers après Phase 3

```
apps/engine/src/
├── registry/
│   └── Registry.js                      ← NOUVEAU — catalogue des composants
│
├── hooks/
│   ├── usePortfolioData.js              ← MIS À JOUR — React Query + slug
│   ├── useSkinData.js                   ← DÉPRÉCIÉ (fusionné dans usePortfolioData)
│   ├── useDecryptText.js
│   └── useParallax.js
│
├── components/
│   ├── hero/
│   │   ├── HeroTerminal.jsx             ← renommé depuis Hero.jsx
│   │   ├── HeroTerminal.module.css
│   │   └── HeroTerminal.skeleton.jsx
│   ├── skills/
│   │   ├── SkillsServerRack.jsx         ← renommé depuis Skills.jsx
│   │   └── SkillsServerRack.skeleton.jsx
│   ├── experience/
│   │   └── ExperienceTimeline.jsx       ← renommé depuis Experience.jsx
│   ├── formation/
│   │   └── FormationGrid.jsx            ← renommé depuis Formation.jsx
│   ├── contact/
│   │   └── ContactTerminal.jsx          ← renommé depuis Contact.jsx
│   ├── addons/
│   │   ├── BootSequenceAddon.jsx        ← renommé depuis BootSequence.jsx
│   │   ├── CustomCursorAddon.jsx        ← renommé depuis CustomCursor.jsx
│   │   ├── NoiseOverlayAddon.jsx        ← extrait depuis index.css / global
│   │   └── NetworkCanvasAddon.jsx       ← extrait si existant
│   └── shared/
│       ├── BlockSkeleton.jsx            ← NOUVEAU
│       ├── BlockSkeleton.module.css     ← NOUVEAU
│       ├── MissingComponentFallback.jsx ← NOUVEAU
│       ├── BootSequenceSkeleton.jsx     ← NOUVEAU
│       ├── ErrorScreen.jsx              ← NOUVEAU
│       └── DecryptedText.jsx            ← déplacé depuis components/
│
├── App.jsx                              ← REFACTORISÉ — boucle dynamique
└── main.jsx                             ← MIS À JOUR — QueryClientProvider
```

---

## 10. Checklist de livraison Phase 3

- [ ] `skin.json` (seed dev) : ajout du champ `architecture` au format défini en §1.1
- [ ] `packages/schemas/skin.schema.json` : ajout de la validation `architecture`
- [ ] `src/registry/Registry.js` : créé avec tous les composants existants
- [ ] Tous les composants renommés selon la table §6.1 et déplacés dans leurs dossiers
- [ ] `BlockSkeleton.jsx` + CSS créés
- [ ] `MissingComponentFallback.jsx` créé
- [ ] `ErrorScreen.jsx` créé
- [ ] `BootSequenceSkeleton.jsx` créé
- [ ] `App.jsx` refactorisé avec la boucle `architecture.map(renderBlock)`
- [ ] `@tanstack/react-query` installé
- [ ] `main.jsx` wrappe avec `QueryClientProvider`
- [ ] `usePortfolioData.js` mis à jour (slug, React Query, mode dev/prod)
- [ ] `useSkinData.js` marqué déprécié (sera supprimé en Phase 5)
- [ ] Tests manuels : désactiver un bloc dans `skin.json` (`enabled: false`) → vérifié absent du rendu
- [ ] Tests manuels : ajouter une clé inconnue dans `architecture` → `MissingComponentFallback` visible en dev, rien en prod
- [ ] Tests manuels : réordonner les blocs dans `architecture` → ordre respecté dans le rendu

---

## 11. Dépendances introduites en Phase 3

| Package | Version | Raison |
|---|---|---|
| `@tanstack/react-query` | `^5.x` | Cache API, gestion loading/error |

Aucune autre dépendance — `React.lazy` et `Suspense` sont natifs React 18.