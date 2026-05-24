# Phase 2 — Extraction Profonde du Skin (Couche CSS)
> **Portfolio Builder Engine v3.0** — Document d'implémentation complet  
> Prérequis : Phase 0 et Phase 1 terminées

---

## Objectif & Périmètre

Rendre **zéro valeur visuelle hardcodée** dans le CSS ou dans les composants JSX.
Chaque couleur, espacement, durée, rayon de bordure et niveau de z-index doit être
un token CSS custom property injecté depuis le skin API — exactement comme le font
déjà `--bg`, `--accent`, etc. — mais étendu à toute la surface visuelle de l'application.

**Trois catégories de travail :**

1. **Atomisation** — couper `index.css` (2000+ lignes) en fichiers par composant
2. **Expansion des tokens** — ajouter spacing, transitions, z-index, shape, opacities dans `skin.json` et l'API
3. **Élimination des valeurs hardcodées** — inline styles JSX et canvas hex → CSS vars

**Ce que Phase 2 ne fait PAS :**
- Elle ne migre pas vers CSS Modules complets (renommage de classes) — c'est une Phase future
- Elle ne touche pas à la logique métier ni au routage
- Elle ne crée pas le Studio

**Durée estimée : 3–4 jours**

---

## Partie 1 — Audit Complet des Valeurs Hardcodées

### 1.1 Inline styles dans les composants JSX

Recensement exhaustif de tous les `style={{}}` et valeurs fixes dans les `.jsx`, avec leur correction cible.

#### `Hero.jsx`
```
L.717  style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}
       → CSS var --hero-direction (calculé dynamiquement avant inject)
       → OU classe conditionnelle hero--reversed

L.721  style={{ flex: 1, width: '50%' }}                 (hero-left)
       → classes CSS existantes hero-left (à vérifier dans index.css)

L.732  style={{ color: 'var(--accent2)' }}
       → classe CSS hero-leadership → color: var(--accent2)

L.741  style={{ flex: 1, width: '50%' }}                 (hero-right)
       → classe CSS existante hero-right

L.755  style={{ textDecoration: 'none' }}                 (hero-scroll)
       → classe CSS hero-scroll existante — ajouter text-decoration: none
```

#### `Formation.jsx`
```
L.642  style={{ borderTop: '1px solid var(--border)' }}   (section racine)
       → classe CSS formation (ajouter border-top dans Formation.css)

L.646  style={{ fontFamily: "'Fraunces', serif", color: 'var(--accent3)' }}
       → style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent3)' }}
       → (font déjà corrigé Phase 1, ici color reste inline — migrer en classe)

L.666  style={{ color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)' }}  (feature-tag)
       → 'rgba(255,209,102,0.2)' = accent3 à 20% opacity → HARDCODED
       → Remplacer par color: var(--accent3) ; border-color: var(--accent3-subtle)
       → Ajouter --accent3-subtle dans les tokens

L.674  style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px',
               letterSpacing: '1px', lineHeight: '1.8' }}
       → Tout hardcodé → classe CSS formation-intro-text
       → fontSize → var(--text-xs)
       → marginBottom → var(--space-lg)
       → letterSpacing → var(--tracking-wide)
       → lineHeight → var(--leading-loose)
```

#### `Skills.jsx`
```
L.1113  style={{ gridTemplateColumns: `repeat(${skillsColumns || 4}, 1fr)` }}
        → Remplacer par CSS var --skills-cols injectée dans :root
        → grid-template-columns: repeat(var(--skills-cols), 1fr)

L.1138  style={{ gridColumn: 'span 2' }}                  (lang card)
        → Remplacer par --lang-card-span injectée depuis skin.layout.langCardSpan
        → OU classe fixe skill-card--wide (span 2 est intentionnel dans le design)

L.1160  style={{ marginTop: '32px', borderTop: '1px solid var(--border)',
                paddingTop: '24px' }}
        → Tout hardcodé → classe CSS skill-card__langs-footer
        → marginTop → var(--space-xl)
        → paddingTop → var(--space-lg)

L.1162  style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: '16px' }}
        → Tout hardcodé → classe CSS skill-card__section-label
        → fontSize → var(--text-2xs)
        → letterSpacing → var(--tracking-widest)
        → marginBottom → var(--space-md)
```

#### `Experience.jsx`
```
L.433  style={{ fontFamily: "'Fraunces', serif", color: 'var(--accent)' }}
       → style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
       → (corrigé Phase 1) → pousser en classe CSS experience-title-em

L.459  style={{ marginLeft: '10px' }}                     (git-role-badge)
       → classe CSS git-role-badge → margin-left: var(--space-sm) (approx 10px)
```

#### `TenxyteArchitecture.jsx`
```
L.1255  style={{ color: 'var(--accent2)',
                borderColor: 'rgba(255,77,109,0.3)',
                background: 'rgba(255,77,109,0.08)' }}
        → 'rgba(255,77,109,0.3)' et '0.08' : accent2 hardcodé
        → Ajouter tokens --accent2-subtle et --accent2-border
        → Classe CSS arch-block-tag--airs
```

#### `App.jsx` (état loading actuel)
```
L.1582-1595  Inline styles complets sur le div de chargement (background, color,
             fontFamily, fontSize, letterSpacing)
             → Déjà remplacé par <AppSkeleton> en Phase 1
             → Vérifier qu'aucun inline style n'a survécu
```

#### `BootSequence.jsx`
```
L.169  transition: 'opacity 0.15s, transform 0.15s'
       → var(--transition-fast)

L.181  transition: 'opacity 0.3s'
       → var(--transition-base)

L.186  transition: 'width 0.2s'
       → var(--transition-fast)
```

#### `Footer` dans `App.jsx`
```
L.1646  style={{ position: 'relative', overflow: 'hidden' }}
        → Classe CSS footer (ajouter à Footer.css)
```

---

### 1.2 Valeurs hardcodées dans les composants canvas

C'est la catégorie la plus critique : les canvas ne peuvent pas utiliser `var()` directement.
Il faut lire les CSS custom properties via `getComputedStyle` à chaque frame ou à chaque changement de thème.

#### `NetworkCanvas.jsx`
```
L.954   ctx.fillStyle = '#ff4d6d'           → getCssVar('--accent2')
L.955   ctx.shadowColor = '#ff4d6d'         → getCssVar('--accent2')
L.976   ctx.strokeStyle = `rgba(0, 229, 195, ${alpha})`
        → couleur de base = getCssVar('--accent') → parser + alpha manuel
L.983   ctx.fillStyle = `rgba(0, 229, 195, ${alpha})`  → idem
L.996   ctx.fillStyle = `rgba(0, 229, 195, ${alpha})`  → idem
```

#### `FooterBugs.jsx`
```
L.533   ctx.fillStyle = isLight ? '#f8fafc' : '#080a0f'
        → getCssVar('--bg')

L.538   ctx.fillStyle = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.3)'
        → remplacé par token --scanline-opacity (voir tokens)

L.554   ctx.shadowColor = ctx.fillStyle = isLight ? '#be123c' : '#ff4d6d'
        → getCssVar('--accent2')

L.577   ctx.shadowColor = ctx.fillStyle = isLight ? '#0b7a6f' : '#00e5c3'
        → getCssVar('--accent')
```

---

### 1.3 Valeurs hardcodées dans `TerminalBackground.jsx`
```
La couleur des logs (var(--accent), var(--muted), var(--accent3)) est déjà
référencée en innerHTML via style="color:var(--accent)".
Pas de correction nécessaire — correct depuis Phase 1.
```

---

## Partie 2 — Tokens Universels (Extension de `skin.json`)

### 2.1 Structure complète du nouveau `skin.json`

```json
{
  "theme": {
    "light": {
      "--bg":              "#f8fafc",
      "--surface":         "#ffffff",
      "--surface2":        "#e2e8f0",
      "--accent":          "#0b7a6f",
      "--accent2":         "#be123c",
      "--accent3":         "#b45309",
      "--accent-subtle":   "rgba(11, 122, 111, 0.08)",
      "--accent2-subtle":  "rgba(190, 18, 60, 0.08)",
      "--accent2-border":  "rgba(190, 18, 60, 0.3)",
      "--accent3-subtle":  "rgba(180, 83, 9, 0.08)",
      "--accent3-border":  "rgba(180, 83, 9, 0.2)",
      "--text":            "#0f172a",
      "--muted":           "#475569",
      "--border":          "rgba(15, 23, 42, 0.12)",
      "--glow":            "rgba(11, 122, 111, 0.2)"
    },
    "dark": {
      "--bg":              "#080a0f",
      "--surface":         "#0d1017",
      "--surface2":        "#121820",
      "--accent":          "#00e5c3",
      "--accent2":         "#ff4d6d",
      "--accent3":         "#ffd166",
      "--accent-subtle":   "rgba(0, 229, 195, 0.08)",
      "--accent2-subtle":  "rgba(255, 77, 109, 0.08)",
      "--accent2-border":  "rgba(255, 77, 109, 0.3)",
      "--accent3-subtle":  "rgba(255, 209, 102, 0.08)",
      "--accent3-border":  "rgba(255, 209, 102, 0.2)",
      "--text":            "#e8eaf0",
      "--muted":           "#7a859c",
      "--border":          "rgba(255, 255, 255, 0.06)",
      "--glow":            "rgba(0, 229, 195, 0.15)"
    }
  },

  "typography": {
    "--font-mono":    "'DM Mono', monospace",
    "--font-heading": "'Fraunces', serif",
    "--font-body":    "system-ui, sans-serif",

    "--text-2xs":    "10px",
    "--text-xs":     "11px",
    "--text-sm":     "12px",
    "--text-base":   "13px",
    "--text-md":     "14px",
    "--text-lg":     "16px",
    "--text-xl":     "20px",

    "--tracking-tight":   "-0.02em",
    "--tracking-normal":  "0em",
    "--tracking-wide":    "0.05em",
    "--tracking-wider":   "0.1em",
    "--tracking-widest":  "0.15em",

    "--leading-tight":  "1.2",
    "--leading-base":   "1.5",
    "--leading-loose":  "1.8"
  },

  "spacing": {
    "--space-1":   "2px",
    "--space-2":   "4px",
    "--space-3":   "8px",
    "--space-4":   "12px",
    "--space-5":   "16px",
    "--space-6":   "24px",
    "--space-7":   "32px",
    "--space-8":   "40px",
    "--space-9":   "48px",
    "--space-10":  "64px",
    "--space-11":  "80px",
    "--space-12":  "96px",
    "--space-13":  "128px",

    "--space-xs":   "4px",
    "--space-sm":   "8px",
    "--space-md":   "16px",
    "--space-lg":   "24px",
    "--space-xl":   "32px",
    "--space-2xl":  "48px",
    "--space-3xl":  "64px",
    "--space-4xl":  "96px",
    "--space-5xl":  "128px"
  },

  "transitions": {
    "--transition-fast":  "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    "--transition-base":  "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "--transition-slow":  "0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    "--transition-xslow": "1.2s cubic-bezier(0.4, 0, 0.2, 1)"
  },

  "zIndex": {
    "--z-base":      "0",
    "--z-raised":    "10",
    "--z-sticky":    "50",
    "--z-navbar":    "100",
    "--z-overlay":   "200",
    "--z-modal":     "500",
    "--z-cursor":    "9999",
    "--z-boot":      "10000"
  },

  "shape": {
    "--radius-none": "0px",
    "--radius-sm":   "2px",
    "--radius-base": "4px",
    "--radius-md":   "6px",
    "--radius-lg":   "12px",
    "--radius-xl":   "20px",
    "--radius-full": "50%",
    "--radius-pill": "9999px"
  },

  "opacities": {
    "--opacity-full":   "1",
    "--opacity-high":   "0.8",
    "--opacity-medium": "0.6",
    "--opacity-dim":    "0.4",
    "--opacity-ghost":  "0.12",
    "--opacity-noise":  "0.05"
  },

  "effects": {
    "--noise-opacity":   "0.05",
    "--grid-opacity":    "0.6",
    "--scanline-opacity-light": "0.03",
    "--scanline-opacity-dark":  "0.3",
    "--canvas-accent-base":     "#00e5c3",
    "--canvas-accent2-base":    "#ff4d6d"
  },

  "animations": {
    "parallaxFactor": 0.3,
    "stagger": {
      "skillsDelay":     150,
      "experienceDelay": 100
    },
    "decryptedText": {
      "short":  400,
      "medium": 600,
      "long":   900,
      "xlong":  1200
    }
  },

  "layout": {
    "heroReversed":          false,
    "skillsColumns":         4,
    "langCardSpan":          2,
    "--border-radius-base":  "4px",
    "--border-radius-large": "50%",
    "--hero-gap":            "0px",
    "--section-padding-x":  "64px",
    "--section-padding-y":  "96px"
  },

  "cursor": {
    "type": "custom"
  },

  "addons": {
    "customCursor":  true,
    "bootSequence":  true,
    "noiseOverlay":  true,
    "networkCanvas": true
  },

  "typography_extra": {
    "comment": "Aliases lisibles pour usage dans les composants"
  },

  "assets": {
    "heroPhoto": "azerty.jpg",
    "favicon":   "favicon.png"
  }
}
```

---

### 2.2 Tokens canvas (`--canvas-*`)

Les composants canvas ne peuvent pas lire `var()` dans `ctx.fillStyle`.
La solution : stocker les couleurs de base (sans alpha) comme tokens séparés
que `getCssVar()` peut lire pour construire des `rgba()` manuellement.

```json
"effects": {
  "--canvas-accent-base":  "#00e5c3",
  "--canvas-accent2-base": "#ff4d6d",
  "--canvas-bg-base":      "#080a0f"
}
```

En mode light, ces tokens changent dans le theme block :
```json
"theme": {
  "light": {
    "--canvas-accent-base":  "#0b7a6f",
    "--canvas-accent2-base": "#be123c",
    "--canvas-bg-base":      "#f8fafc"
  }
}
```

---

### 2.3 Ajout dans `skin.schema.json` — nouvelles sections

Ajouter dans `packages/schemas/skin.schema.json` :

```json
"spacing": {
  "type": "object",
  "description": "Échelle d'espacement. Toutes les valeurs sont des CSS lengths.",
  "patternProperties": {
    "^--space-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|[0-9]+)$": {
      "type": "string",
      "pattern": "^[0-9]+(px|rem|em)$"
    }
  },
  "additionalProperties": false
},

"transitions": {
  "type": "object",
  "properties": {
    "--transition-fast":  { "type": "string" },
    "--transition-base":  { "type": "string" },
    "--transition-slow":  { "type": "string" },
    "--transition-xslow": { "type": "string" }
  },
  "additionalProperties": false
},

"zIndex": {
  "type": "object",
  "patternProperties": {
    "^--z-": { "type": "string", "pattern": "^-?[0-9]+$" }
  },
  "additionalProperties": false
},

"shape": {
  "type": "object",
  "patternProperties": {
    "^--radius-": { "type": "string" }
  },
  "additionalProperties": false
},

"opacities": {
  "type": "object",
  "patternProperties": {
    "^--opacity-": { "type": "string", "pattern": "^0(\\.\\d+)?$|^1$" }
  },
  "additionalProperties": false
}
```

---

## Partie 3 — Fonction `injectCssVariables` mise à jour

### `src/lib/injectCssVariables.js` — Extraire hors de `App.jsx`

```js
// src/lib/injectCssVariables.js
// ============================================================
// Injecte TOUS les tokens du skin en tant que CSS custom
// properties sur :root (document.documentElement).
// Appelé dans useLayoutEffect à chaque changement de theme.
// ============================================================

/**
 * Catégories du skin qui contiennent des CSS custom properties (clés "--").
 * Layout contient un mix : heroReversed (boolean), skillsColumns (int)
 * et --border-radius-base (string). On filtre par préfixe "--".
 */
const CSS_VAR_CATEGORIES = [
  'theme',        // theme.light ou theme.dark → objets de tokens
  'typography',   // --font-mono, --font-heading, --text-xs, --tracking-wide...
  'spacing',      // --space-xs, --space-sm...
  'transitions',  // --transition-fast, --transition-base...
  'zIndex',       // --z-navbar, --z-cursor...
  'shape',        // --radius-base, --radius-full...
  'opacities',    // --opacity-noise, --opacity-dim...
  'effects',      // --noise-opacity, --grid-opacity, --canvas-accent-base...
  'layout',       // filtré par clé commençant par "--"
];

/**
 * Injecte les custom properties dans :root.
 * @param {object} skin   - Objet skin complet (normalisé par Phase 0)
 * @param {string} theme  - 'dark' | 'light'
 */
export function injectCssVariables(skin, theme) {
  if (!skin) return;
  const root = document.documentElement;

  for (const category of CSS_VAR_CATEGORIES) {
    let tokens;

    if (category === 'theme') {
      // theme est l'objet { light: {...}, dark: {...} }
      // On injecte uniquement le mode actif
      tokens = skin.theme?.[theme];
    } else if (category === 'layout') {
      // layout mélange booleans/integers et CSS vars — filtrer
      tokens = Object.fromEntries(
        Object.entries(skin.layout || {}).filter(([k]) => k.startsWith('--'))
      );
    } else {
      tokens = skin[category];
    }

    if (!tokens) continue;

    for (const [key, value] of Object.entries(tokens)) {
      if (!key.startsWith('--')) continue; // Sécurité supplémentaire
      root.style.setProperty(key, String(value));
    }
  }

  // ── Tokens calculés ─────────────────────────────────────────
  // --skills-cols : convertit le integer skillsColumns en CSS var
  const cols = skin.layout?.skillsColumns ?? 4;
  root.style.setProperty('--skills-cols', String(cols));

  // --lang-card-span
  const span = skin.layout?.langCardSpan ?? 2;
  root.style.setProperty('--lang-card-span', String(span));

  // --hero-direction : contrôle flexDirection du Hero
  const isReversed = skin.layout?.heroReversed ?? false;
  root.style.setProperty('--hero-direction', isReversed ? 'row-reverse' : 'row');
}
```

### Mise à jour de `App.jsx` — utiliser la fonction externalisée

```jsx
// src/App.jsx — excerpt
import { injectCssVariables } from './lib/injectCssVariables';

// ...

useLayoutEffect(() => {
  injectCssVariables(skin, theme);
}, [theme, skin]);
```

---

## Partie 4 — Utilitaire Canvas `getCssVar`

### `src/lib/getCssVar.js`

```js
// src/lib/getCssVar.js
// ============================================================
// Lit une CSS custom property depuis :root au moment de l'appel.
// Utilisé par les composants canvas qui ne peuvent pas utiliser var().
// Doit être appelé DANS la boucle d'animation (pas mis en cache)
// pour réagir aux changements de thème à chaud.
// ============================================================

/**
 * Lit la valeur actuelle d'une CSS custom property.
 * @param {string} varName - ex: '--accent', '--bg'
 * @returns {string} - la valeur brute (ex: '#00e5c3', 'rgba(0,229,195,0.15)')
 */
export function getCssVar(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

/**
 * Construit un rgba() à partir d'une CSS var contenant une couleur hex.
 * Utilisé pour les canvas qui ont besoin de couleur + alpha.
 *
 * @param {string} varName - ex: '--canvas-accent-base'
 * @param {number} alpha   - 0.0 → 1.0
 * @returns {string}       - ex: 'rgba(0, 229, 195, 0.15)'
 */
export function getCssVarRgba(varName, alpha) {
  const hex = getCssVar(varName);
  if (!hex || !hex.startsWith('#')) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

---

## Partie 5 — Atomisation de `index.css`

### 5.1 Nouvelle arborescence CSS

```
src/
├── styles/
│   ├── base.css              ← reset, body, html, :root (vide — tokens injectés par JS)
│   ├── animations.css        ← tous les @keyframes
│   ├── utilities.css         ← btn, two-col, section-label, section-title, json-*
│   └── skeleton.css          ← .skeleton-block, @keyframes skeleton-shimmer
│
└── components/
    ├── Navbar/
    │   ├── Navbar.jsx
    │   └── Navbar.css
    ├── Hero/
    │   ├── Hero.jsx
    │   └── Hero.css
    ├── Marquee/
    │   ├── Marquee.jsx
    │   └── Marquee.css
    ├── TenxyteArchitecture/
    │   ├── TenxyteArchitecture.jsx
    │   └── TenxyteArchitecture.css
    ├── Skills/
    │   ├── Skills.jsx
    │   └── Skills.css
    ├── Experience/
    │   ├── Experience.jsx
    │   └── Experience.css
    ├── Formation/
    │   ├── Formation.jsx
    │   └── Formation.css
    ├── Contact/
    │   ├── Contact.jsx
    │   └── Contact.css
    ├── BootSequence/
    │   ├── BootSequence.jsx
    │   └── BootSequence.css
    ├── CustomCursor/
    │   ├── CustomCursor.jsx
    │   └── CustomCursor.css
    ├── ApiView/
    │   ├── ApiView.jsx
    │   └── ApiView.css
    ├── FooterBugs/
    │   ├── FooterBugs.jsx
    │   └── FooterBugs.css     (vide — canvas géré en JS)
    ├── NetworkCanvas/
    │   ├── NetworkCanvas.jsx
    │   └── NetworkCanvas.css  (vide — canvas géré en JS)
    ├── DecryptedText/
    │   └── DecryptedText.jsx  (pas de CSS propre)
    └── skeletons/
        ├── AppSkeleton.jsx
        └── AppSkeleton.css
```

### 5.2 `src/styles/base.css` — Reset et fondations

```css
/* src/styles/base.css */

/* ── Reset ───────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── HTML & Body ─────────────────────────────────────────────── */
html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  line-height: var(--leading-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Transitions du thème */
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

/* ── Scrollbar ───────────────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: var(--radius-pill); }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }

/* ── Selection ───────────────────────────────────────────────── */
::selection {
  background-color: var(--accent);
  color: var(--bg);
}

/* ── Focus visible ───────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Images ──────────────────────────────────────────────────── */
img { max-width: 100%; display: block; }

/* ── Liens ───────────────────────────────────────────────────── */
a { color: inherit; }
```

### 5.3 `src/styles/animations.css` — Tous les keyframes

```css
/* src/styles/animations.css */
/* Centralisés ici — ne jamais dupliquer dans les fichiers composant */

/* ── Marquee ─────────────────────────────────────────────────── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Data rings (Hero) ───────────────────────────────────────── */
@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes pulse-packet {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 1; }
}

/* ── Glow pulse ──────────────────────────────────────────────── */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px var(--glow); }
  50%       { box-shadow: 0 0 24px var(--glow); }
}

/* ── Blink cursor ────────────────────────────────────────────── */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Skeleton shimmer ────────────────────────────────────────── */
@keyframes skeleton-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}

/* ── Fade in up ──────────────────────────────────────────────── */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Scan line (Boot) ────────────────────────────────────────── */
@keyframes scan {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
```

### 5.4 `src/styles/utilities.css` — Utilitaires globaux

```css
/* src/styles/utilities.css */

/* ── Boutons ─────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  text-decoration: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border: 1px solid var(--accent);
}
.btn-primary:hover {
  box-shadow: 0 0 16px var(--glow);
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}
.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ── Layout deux colonnes ────────────────────────────────────── */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  align-items: start;
}
@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr; }
}

/* ── Étiquette de section ────────────────────────────────────── */
.section-label {
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.section-label::before {
  content: attr(data-num);
  color: var(--accent);
  font-size: var(--text-xs);
}

/* ── Titre de section ────────────────────────────────────────── */
.section-title {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-3xl);
  color: var(--text);
}
.section-title em {
  font-style: italic;
  color: var(--accent);
}

/* ── ui-view / api-view ──────────────────────────────────────── */
.ui-view  { transition: opacity var(--transition-base); }
.ui-view.hidden { opacity: 0; pointer-events: none; }
.api-view { display: none; }
.api-view.visible { display: block; }

/* ── Skeleton block ──────────────────────────────────────────── */
.skeleton-block {
  background: linear-gradient(
    90deg,
    var(--surface2) 25%,
    var(--surface)  50%,
    var(--surface2) 75%
  );
  background-size: 1200px 100%;
  animation: skeleton-shimmer 1.6s infinite linear;
  border-radius: var(--radius-base);
}

/* ── JSON syntax highlighting (ApiView) ─────────────────────── */
.json-key    { color: var(--accent); }
.json-string { color: var(--accent3); }
.json-number { color: var(--accent2); }
.json-bool   { color: var(--accent2); }
.json-null   { color: var(--muted); }
.json-bracket{ color: var(--text); opacity: var(--opacity-medium); }
```

### 5.5 `src/components/Hero/Hero.css`

```css
/* src/components/Hero/Hero.css */
/* Classes spécifiques au Hero — layout, photo, data-rings, scroll */

.hero {
  position: relative;
  display: flex;
  flex-direction: var(--hero-direction, row); /* ← token injecté */
  align-items: center;
  min-height: 100vh;
  padding: 0 var(--section-padding-x, 64px);
  gap: var(--hero-gap, 0px);
  overflow: hidden;
}

.hero-left,
.hero-right {
  flex: 1;
  width: 50%;
}

.hero-tag {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: var(--space-md);
}

.hero-name {
  font-family: var(--font-heading);
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 900;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-lg);
  color: var(--text);
}

.hero-title {
  font-size: var(--text-base);
  line-height: var(--leading-loose);
  color: var(--muted);
  margin-bottom: var(--space-2xl);
}

.hero-leadership { color: var(--accent2); }

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.hero-scroll {
  position: absolute;
  bottom: var(--space-3xl);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-widest);
  color: var(--muted);
  text-decoration: none;
  text-transform: uppercase;
  animation: blink 2s infinite;
}

/* ── Photo frame ─────────────────────────────────────────────── */
.hero-photo-frame {
  position: relative;
  z-index: var(--z-raised);
  border-radius: var(--radius-base);
  overflow: hidden;
  border: 1px solid var(--border);
}
.hero-photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Data rings ──────────────────────────────────────────────── */
.data-ring {
  position: absolute;
  border-radius: var(--radius-full);
  border: 1px solid var(--accent);
  opacity: var(--opacity-ghost);
  animation: rotate-ring 20s linear infinite;
}
.data-ring-1 { width: 340px; height: 340px; animation-duration: 20s; }
.data-ring-2 { width: 420px; height: 420px; animation-duration: 30s; animation-direction: reverse; }
.data-ring-3 { width: 500px; height: 500px; animation-duration: 45s; }

.data-packet {
  position: absolute;
  top: -3px;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--accent2);
  border-radius: var(--radius-full);
  animation: pulse-packet 2s ease-in-out infinite;
}

/* ── Hero grid background ────────────────────────────────────── */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: var(--grid-opacity);
  pointer-events: none;
}
```

### 5.6 `src/components/Skills/Skills.css`

```css
/* src/components/Skills/Skills.css */

#skills {
  padding: var(--section-padding-y, 96px) var(--section-padding-x, 64px);
  border-top: 1px solid var(--border);
}

/* ── Grille de racks ─────────────────────────────────────────── */
.skills-grid {
  display: grid;
  /* ← --skills-cols injecté dynamiquement depuis skin.layout.skillsColumns */
  grid-template-columns: repeat(var(--skills-cols, 4), 1fr);
  gap: var(--space-md);
}
@media (max-width: 1024px) { .skills-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .skills-grid { grid-template-columns: 1fr; } }

/* ── Carte de compétence ─────────────────────────────────────── */
.skill-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-base);
  padding: var(--space-lg);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.skill-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 12px var(--glow);
}

/* ── Carte langues : span configurable ───────────────────────── */
.skill-card--wide {
  grid-column: span var(--lang-card-span, 2);
}

/* ── En-tête du rack ─────────────────────────────────────────── */
.skill-rack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}
.skill-rack-id {
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-widest);
  color: var(--muted);
}

/* ── LEDs ────────────────────────────────────────────────────── */
.skill-rack-leds { display: flex; gap: var(--space-2); }
.led {
  width: 8px; height: 8px;
  border-radius: var(--radius-full);
}
.led-green  { background: #22c55e; box-shadow: 0 0 6px #22c55e66; }
.led-yellow { background: var(--accent3); box-shadow: 0 0 6px var(--accent3)66; }
.led-red    { background: var(--accent2); box-shadow: 0 0 6px var(--accent2)66; }
.led-off    { background: var(--surface2); }

/* ── Tags ────────────────────────────────────────────────────── */
.skill-card-icon { font-size: 28px; display: block; margin-bottom: var(--space-sm); }
.skill-card-title {
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text);
  margin-bottom: var(--space-md);
}
.skill-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.skill-tag {
  font-size: var(--text-2xs);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--muted);
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.skill-tag:hover { border-color: var(--accent); color: var(--accent); }

/* ── Section langues (footer de la carte wide) ───────────────── */
.skill-card__langs-footer {
  margin-top: var(--space-xl);
  border-top: 1px solid var(--border);
  padding-top: var(--space-lg);
}
.skill-card__section-label {
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: var(--space-md);
}

/* ── Barres de langue ────────────────────────────────────────── */
.lang-item {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  opacity: 0;
  transform: translateX(-12px);
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}
.lang-item.visible { opacity: 1; transform: translateX(0); }
.lang-bar {
  height: 3px;
  background: var(--surface2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.lang-fill {
  height: 100%;
  background: var(--accent);
  border-radius: var(--radius-pill);
  transition: width var(--transition-slow);
}
.lang-name  { font-size: var(--text-xs); color: var(--text); }
.lang-level { font-size: var(--text-2xs); color: var(--muted); text-align: right; }
```

### 5.7 `src/components/Formation/Formation.css`

```css
/* src/components/Formation/Formation.css */

#formation {
  padding: var(--section-padding-y, 96px) var(--section-padding-x, 64px);
  border-top: 1px solid var(--border);  /* ← était inline style */
}

.formation-intro-text {
  font-size: var(--text-sm);
  color: var(--muted);
  margin-bottom: var(--space-lg);
  letter-spacing: var(--tracking-wide);
  line-height: var(--leading-loose);
}

/* ── feature-tag variante accent3 ───────────────────────────── */
.feature-tag--accent3 {
  color: var(--accent3);
  border-color: var(--accent3-border);
  background: var(--accent3-subtle);
}

/* ── Section title em — accent3 ─────────────────────────────── */
.formation-title-em {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--accent3);
}
```

### 5.8 `src/components/Experience/Experience.css`

```css
/* src/components/Experience/Experience.css */

.experience {
  padding: var(--section-padding-y, 96px) var(--section-padding-x, 64px);
  border-top: 1px solid var(--border);
}

.experience-title-em {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--accent);  /* ← était inline */
}

/* ── Timeline git ────────────────────────────────────────────── */
.git-timeline { position: relative; padding-left: var(--space-3xl); }
.git-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
}

.git-commit {
  position: relative;
  margin-bottom: var(--space-3xl);
  opacity: 0;
  transform: translateX(-16px);
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}
.git-commit.visible { opacity: 1; transform: translateX(0); }

.git-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}
.git-hash { font-size: var(--text-xs); color: var(--accent); font-family: var(--font-mono); }
.git-date { font-size: var(--text-xs); color: var(--muted); }
.git-company { font-size: var(--text-xs); color: var(--text); }

.git-role {
  font-size: var(--text-md);
  color: var(--text);
  margin-bottom: var(--space-sm);
}
.git-role-badge {
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-widest);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--accent);
  margin-left: var(--space-sm); /* ← était marginLeft: '10px' inline */
}

.git-desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: var(--leading-loose);
  margin-bottom: var(--space-md);
}

.git-changes { display: flex; flex-direction: column; gap: var(--space-2); }
.git-change  { font-size: var(--text-xs); display: flex; gap: var(--space-sm); }
.git-change-prefix       { font-weight: 700; }
.git-change-prefix.add   { color: var(--accent); }
.git-change-prefix.mod   { color: var(--accent3); }
.git-change-prefix.del   { color: var(--accent2); }
```

### 5.9 `src/components/BootSequence/BootSequence.css`

```css
/* src/components/BootSequence/BootSequence.css */

.boot-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: var(--z-boot);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--section-padding-x, 64px);
  font-family: var(--font-mono);
  font-size: var(--text-base);
}

.boot-line {
  /* Opacity et transform gérés inline (valeurs dynamiques) */
  /* Les transitions sont converties en vars dans le JSX */
  margin-bottom: var(--space-3);
  line-height: var(--leading-base);
}

/* Couleurs des spans */
.boot-line .ok   { color: var(--accent); }
.boot-line .warn { color: var(--accent3); }
.boot-line .dim  { color: var(--muted); }

.boot-cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--accent);
  margin-left: var(--space-2);
  animation: blink 1s infinite;
  vertical-align: middle;
}

/* ── Barre de progression ────────────────────────────────────── */
.boot-progress {
  position: absolute;
  bottom: var(--section-padding-x, 64px);
  left: var(--section-padding-x, 64px);
  right: var(--section-padding-x, 64px);
  height: 2px;
  background: var(--surface2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.boot-progress-fill {
  height: 100%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--glow);
  border-radius: var(--radius-pill);
  /* transition: width gérée inline (valeur dynamique — voir JSX) */
}
```

### 5.10 `src/components/TenxyteArchitecture/TenxyteArchitecture.css`

```css
/* src/components/TenxyteArchitecture/TenxyteArchitecture.css */

/* ── arch-block-tag variante AIRS (accent2) ──────────────────── */
.arch-block-tag--airs {
  color: var(--accent2);
  border-color: var(--accent2-border);   /* ← était rgba(255,77,109,0.3) */
  background: var(--accent2-subtle);     /* ← était rgba(255,77,109,0.08) */
}
```

---

## Partie 6 — Corrections JSX après atomisation

### `BootSequence.jsx` — transitions via vars

```jsx
// Avant :
style={{ opacity: ..., transform: ..., transition: 'opacity 0.15s, transform 0.15s' }}

// Après :
style={{
  opacity:    index <= currentLine ? 1 : 0,
  transform:  index <= currentLine ? 'translateX(0)' : 'translateX(-20px)',
  transition: `opacity var(--transition-fast), transform var(--transition-fast)`,
}}

// BootProgress opacity :
style={{ opacity: currentLine >= 0 ? 1 : 0, transition: 'opacity var(--transition-base)' }}

// BootProgress fill width :
style={{ width: `${progressWidth}%`, transition: 'width var(--transition-fast)' }}
```

### `Formation.jsx` — inline styles → classes

```jsx
// ❌ Avant
<section id="formation" style={{ borderTop: '1px solid var(--border)' }}>
<em style={{ fontFamily: "'Fraunces', serif", color: 'var(--accent3)' }}>
<span className="feature-tag" style={{ color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)' }}>
<p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px',
            letterSpacing: '1px', lineHeight: '1.8' }}>

// ✅ Après
<section id="formation">                   {/* border dans Formation.css */}
<em className="formation-title-em">        {/* classe Formation.css */}
<span className="feature-tag feature-tag--accent3">  {/* classe Formation.css */}
<p className="formation-intro-text">       {/* classe Formation.css */}
```

### `Skills.jsx` — inline styles → classes et CSS vars

```jsx
// ❌ Avant
<div className="skills-grid"
     style={{ gridTemplateColumns: `repeat(${skin?.layout?.skillsColumns || 4}, 1fr)` }}>
<div className="skill-card" style={{ gridColumn: 'span 2' }}>
<div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
<div className="skill-card-title"
     style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: '16px' }}>

// ✅ Après
// skills-grid : grid-template-columns vient de var(--skills-cols) dans Skills.css
<div className="skills-grid">
// lang card : classe CSS skill-card--wide
<div className="skill-card skill-card--wide">
// Langs footer
<div className="skill-card__langs-footer">
// Section label langues
<div className="skill-card__section-label">
  <DecryptedText text={racks.hobbies.title} />
</div>
```

### `TenxyteArchitecture.jsx` — classe AIRS

```jsx
// ❌ Avant
<span className="arch-block-tag"
      style={{ color: 'var(--accent2)',
               borderColor: 'rgba(255,77,109,0.3)',
               background: 'rgba(255,77,109,0.08)' }}>

// ✅ Après
<span className="arch-block-tag arch-block-tag--airs">
```

### `Experience.jsx` — classe + var(--font-heading)

```jsx
// ❌ Avant
<em style={{ fontFamily: "'Fraunces', serif", color: 'var(--accent)' }}>

// ✅ Après
<em className="experience-title-em">
```

### `Hero.jsx` — retirer les inline styles de layout

```jsx
// ❌ Avant
<section className="hero" id="about"
         style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}>
<div className="hero-left" style={{ flex: 1, width: '50%' }}>
<div className="hero-right" style={{ flex: 1, width: '50%' }}>
<a href="#tenxyte" className="hero-scroll" style={{ textDecoration: 'none' }}>

// ✅ Après — flexDirection depuis --hero-direction injecté dans :root par injectCssVariables
<section className="hero" id="about">
<div className="hero-left">
<div className="hero-right">
<a href="#tenxyte" className="hero-scroll">
```

---

## Partie 7 — `NetworkCanvas.jsx` et `FooterBugs.jsx` — Couleurs canvas

### `NetworkCanvas.jsx` mis à jour

```jsx
// src/components/NetworkCanvas/NetworkCanvas.jsx
import { useEffect, useRef } from 'react';
import { getCssVar, getCssVarRgba } from '../../lib/getCssVar';

// ... (code existant jusqu'aux classes Node/Packet)

class Packet {
  // ...
  draw(ctx) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    // ✅ Couleur depuis CSS var — lue à chaque draw pour réagir au changement de thème
    const packetColor = getCssVarRgba('--canvas-accent2-base', 1);

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle   = packetColor;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = packetColor;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const animate = () => {
  ctx.clearRect(0, 0, W, H);

  // Connexions entre nœuds
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        // ✅ Couleur depuis CSS var
        ctx.strokeStyle = getCssVarRgba('--canvas-accent-base', alpha);
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  // Interaction souris
  for (const n of nodes) {
    const dx = n.x - mousePos.current.x;
    const dy = n.y - mousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_RADIUS) {
      const alpha = (1 - dist / MOUSE_RADIUS) * 0.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = getCssVarRgba('--canvas-accent-base', alpha);  // ✅
      ctx.fill();
    }
  }

  // Nœuds
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = getCssVarRgba('--canvas-accent-base', n.baseAlpha);  // ✅
    ctx.fill();
  }

  // ... paquets, timer, etc.
};
```

### `FooterBugs.jsx` mis à jour

```jsx
// src/components/FooterBugs/FooterBugs.jsx
import { useEffect, useRef } from 'react';
import { getCssVar, getCssVarRgba } from '../../lib/getCssVar';

const draw = () => {
  // ✅ Fond depuis --bg (pas de hardcode dark/light)
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = getCssVar('--bg');                 // ← était '#080a0f' / '#f8fafc'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;

  // ✅ Scanlines depuis token --noise-opacity (approximation)
  // La distinction dark/light est gérée par le token lui-même
  const scanlineAlpha = parseFloat(getCssVar('--noise-opacity') || '0.05');
  ctx.fillStyle = `rgba(0, 0, 0, ${scanlineAlpha * 6})`;  // facteur x6 pour les scanlines
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.font = `bold ${fontSize}px var(--font-mono, 'JetBrains Mono', monospace)`;

  ctx.shadowBlur = 8;
  const bugY = Math.floor(canvas.height / fontSize) - 1;

  for (let i = 0; i < drops.length; i++) {
    if (bugs[i]) {
      if (bugs[i].active) {
        ctx.shadowColor = getCssVar('--accent2');    // ✅ était '#ff4d6d'
        ctx.fillStyle   = getCssVar('--accent2');
        ctx.fillText(bugs[i].char, i * fontSize, bugY * fontSize);
      } else if (bugs[i].timer > 0) {
        ctx.shadowColor = getCssVar('--accent2');    // ✅
        ctx.fillStyle   = getCssVar('--accent2');
        const gc = '!<>-_\\\\/[]{}—=+*^?#_';
        ctx.fillText(gc[Math.floor(Math.random() * gc.length)], i * fontSize, bugY * fontSize);
        bugs[i].timer--;
        if (bugs[i].timer <= 0) {
          bugs[i] = Math.random() > 0.5
            ? { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 }
            : null;
        }
      }
    }

    // ✅ Pluie binaire — couleur depuis --accent
    const text = Math.random() > 0.5 ? '1' : '0';
    ctx.shadowColor = getCssVar('--accent');          // ✅ était '#00e5c3'
    ctx.fillStyle   = getCssVar('--accent');
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    ctx.shadowBlur = 0;

    // ... (reste inchangé)
  }

  animationId = requestAnimationFrame(draw);
};
```

**Note importante :** `getCssVar` est appelé à chaque frame (dans `requestAnimationFrame`).
C'est intentionnel : `getComputedStyle` sur `:root` est très rapide (lecture du cache CSSOM),
et c'est le seul moyen de réagir au changement de thème sans re-monter le composant.

---

## Partie 8 — Addons : implémentation complète

### 8.1 Comportement de chaque addon

| Addon | Clé `skin.addons` | Comportement quand `false` |
|---|---|---|
| `customCursor` | `addons.customCursor` | `<CustomCursor>` non rendu, curseur navigateur par défaut |
| `bootSequence` | `addons.bootSequence` | `<BootSequence>` non rendu, page s'affiche directement |
| `noiseOverlay` | `addons.noiseOverlay` | `--noise-opacity: 0` injecté, pseudo-element invisible |
| `networkCanvas` | `addons.networkCanvas` | `<NetworkCanvas>` non rendu dans Hero |

### 8.2 Injection de `--noise-opacity` via addon

```js
// Dans injectCssVariables.js — après l'injection des catégories
// Override --noise-opacity si addon noiseOverlay désactivé
if (skin.addons?.noiseOverlay === false) {
  root.style.setProperty('--noise-opacity', '0');
  root.style.setProperty('--grid-opacity', '0');
}
```

### 8.3 `App.jsx` — Addons conditionnels

```jsx
// src/App.jsx — section addons
const addons = skin?.addons ?? {};

return (
  <>
    {addons.bootSequence !== false && (
      <BootSequence data={data} skin={skin} />
    )}

    {addons.customCursor !== false && skin?.cursor?.type === 'custom' && (
      <CustomCursor cursorData={skin.cursor} />
    )}

    {/* ... Navbar, ApiView, etc. */}

    {/* NetworkCanvas passé en prop à Hero — Hero décide de le rendre */}
    <Hero
      language={language}
      data={data}
      skin={skin}
      showNetworkCanvas={addons.networkCanvas !== false}
    />
  </>
);
```

### 8.4 `Hero.jsx` — NetworkCanvas conditionnel

```jsx
export default function Hero({ language, data, skin, showNetworkCanvas = true }) {
  // ...
  return (
    <section className="hero" id="about">
      <div className="hero-grid" />
      {showNetworkCanvas && <NetworkCanvas />}
      {/* ... */}
    </section>
  );
}
```

### 8.5 Overlay de bruit — pseudo-element CSS (pas de composant React)

Le noise overlay est un pseudo-element `::after` sur `body` — pas un composant React.
C'est plus performant (pas de nœud DOM supplémentaire).

```css
/* src/styles/base.css — ajouter */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: var(--noise-opacity);     /* ← token injecté */
  pointer-events: none;
  z-index: var(--z-overlay);
}
```

Quand `addons.noiseOverlay === false`, `injectCssVariables` injecte `--noise-opacity: 0`
et le pseudo-element devient invisible. **Zéro code conditionnel React.**

---

## Partie 9 — `main.jsx` : imports CSS dans l'ordre correct

```jsx
// src/main.jsx

// 1. Base (reset, body, :root)
import './styles/base.css';

// 2. Animations globales (keyframes)
import './styles/animations.css';

// 3. Utilitaires (btn, two-col, section-label, skeleton)
import './styles/utilities.css';

// 4. App
import App from './App.jsx';
// Les composants importent leur propre CSS au niveau du composant
```

Chaque composant importe son CSS :
```jsx
// src/components/Hero/Hero.jsx
import './Hero.css';

// src/components/Skills/Skills.jsx
import './Skills.css';

// etc.
```

---

## Partie 10 — Mise à jour `skin.schema.json` — `ThemeTokens`

Ajouter les tokens `*-subtle` et `*-border` au schéma :

```json
"ThemeTokens": {
  "type": "object",
  "required": ["--bg","--surface","--surface2","--accent","--accent2","--accent3",
               "--text","--muted","--border","--glow"],
  "properties": {
    "--bg":             { "type": "string" },
    "--surface":        { "type": "string" },
    "--surface2":       { "type": "string" },
    "--accent":         { "type": "string" },
    "--accent2":        { "type": "string" },
    "--accent3":        { "type": "string" },
    "--accent-subtle":  { "type": "string", "description": "accent à 8% opacity" },
    "--accent2-subtle": { "type": "string" },
    "--accent2-border": { "type": "string", "description": "accent2 à 30% opacity" },
    "--accent3-subtle": { "type": "string" },
    "--accent3-border": { "type": "string" },
    "--text":           { "type": "string" },
    "--muted":          { "type": "string" },
    "--border":         { "type": "string" },
    "--glow":           { "type": "string" },
    "--canvas-accent-base":  { "type": "string", "description": "Couleur hex pure pour canvas getCssVarRgba" },
    "--canvas-accent2-base": { "type": "string" },
    "--canvas-bg-base":      { "type": "string" }
  },
  "additionalProperties": false
}
```

---

## Checklist — Définition of Done (Phase 2)

```
TOKENS
[ ] skin.json mis à jour (spacing, transitions, zIndex, shape, opacities, *-subtle, *-border)
[ ] skin.schema.json mis à jour (ThemeTokens, nouvelles catégories)
[ ] data.schema.json non impacté — pas de changement

INJECTION
[ ] injectCssVariables.js extrait de App.jsx dans src/lib/
[ ] Toutes les catégories injectées : theme, typography, spacing,
    transitions, zIndex, shape, opacities, effects, layout (clés --)
[ ] Tokens calculés injectés : --skills-cols, --lang-card-span, --hero-direction
[ ] Addon noiseOverlay === false → --noise-opacity: 0 injecté

ATOMISATION CSS
[ ] src/styles/base.css créé (reset, body, pseudo-element noise)
[ ] src/styles/animations.css créé (tous les @keyframes centralisés)
[ ] src/styles/utilities.css créé (btn, two-col, section-label, section-title, json-*)
[ ] Hero.css créé — importé dans Hero.jsx
[ ] Skills.css créé — importé dans Skills.jsx
[ ] Formation.css créé — importé dans Formation.jsx
[ ] Experience.css créé — importé dans Experience.jsx
[ ] TenxyteArchitecture.css créé — importé dans TenxyteArchitecture.jsx
[ ] BootSequence.css créé — importé dans BootSequence.jsx
[ ] Contact.css créé — importé dans Contact.jsx
[ ] Navbar.css créé — importé dans Navbar.jsx
[ ] ApiView.css créé — importé dans ApiView.jsx
[ ] CustomCursor.css créé — importé dans CustomCursor.jsx
[ ] index.css taille finale < 50 lignes (ou supprimé — remplacé par les imports)

INLINE STYLES ÉLIMINÉS
[ ] Formation.jsx — 0 inline style (classes formation-intro-text, feature-tag--accent3)
[ ] Skills.jsx — 0 inline style (classes skill-card--wide, skill-card__langs-footer)
[ ] Experience.jsx — git-role-badge margin via var(--space-sm)
[ ] TenxyteArchitecture.jsx — arch-block-tag--airs classe CSS
[ ] Hero.jsx — flexDirection via var(--hero-direction), flex/width via Hero.css
[ ] BootSequence.jsx — transitions via var(--transition-fast) / var(--transition-base)
[ ] App.jsx Footer — position/overflow via classe CSS footer

CANVAS
[ ] getCssVar.js + getCssVarRgba() créés dans src/lib/
[ ] NetworkCanvas.jsx — 0 couleur hex hardcodée (getCssVarRgba)
[ ] FooterBugs.jsx — 0 couleur hex hardcodée (getCssVar)
[ ] Changement de thème → canvas se recolore sans re-mount

ADDONS
[ ] skin.addons.customCursor contrôle le rendu de <CustomCursor>
[ ] skin.addons.bootSequence contrôle le rendu de <BootSequence>
[ ] skin.addons.noiseOverlay contrôle --noise-opacity via injectCssVariables
[ ] skin.addons.networkCanvas contrôle le rendu de <NetworkCanvas> dans Hero

VALIDATION FINALE
[ ] npm run dev — 0 erreur CSS, 0 warning AJV
[ ] Thème dark/light toggle → tous les tokens changent (couleurs + canvas)
[ ] skin.addons.bootSequence: false → pas d'animation de démarrage
[ ] skin.addons.noiseOverlay: false → grain invisible
[ ] skin.addons.networkCanvas: false → canvas hero absent
[ ] skin.layout.skillsColumns: 2 → grille en 2 colonnes
[ ] grep -r "rgba(0, 229" src/ → 0 résultat (hors commentaires)
[ ] grep -r "rgba(255, 77" src/ → 0 résultat
[ ] grep -r "#ff4d6d" src/ → 0 résultat
[ ] grep -r "#080a0f" src/ → 0 résultat
[ ] grep -r "Fraunces" src/ → 0 résultat (remplacé par var(--font-heading))
[ ] grep -r "style={{" src/ → uniquement des valeurs dynamiques (pas de px hardcodés)
```

---

## Ordre d'exécution recommandé

```
Jour 1 matin   : Mettre à jour skin.json + skin.schema.json (nouveaux tokens)
Jour 1 après-m : Créer getCssVar.js + injectCssVariables.js
                 Valider que l'injection fonctionne avec les nouveaux tokens

Jour 2 matin   : Créer base.css + animations.css + utilities.css
                 Supprimer les keyframes et utilitaires de index.css

Jour 2 après-m : Hero.css + Skills.css + Formation.css + Experience.css
                 Retirer les inline styles correspondants des JSX

Jour 3 matin   : BootSequence.css + TenxyteArchitecture.css + Contact.css
                 Navbar.css + ApiView.css + CustomCursor.css

Jour 3 après-m : NetworkCanvas.jsx + FooterBugs.jsx — couleurs canvas
                 Implémenter addons (injectCssVariables + App.jsx + Hero.jsx)

Jour 4         : Tests complets — toggle thème, chaque addon ON/OFF
                 Grep de validation — 0 couleur hardcodée
                 Nettoyage final de index.css
```

---

*Document généré pour Portfolio Builder Engine v3.0 — Phase 2 uniquement.*  
*Basé sur analyse complète du code réel (all_codes.txt) et du plan architectural (all_plans.md).*