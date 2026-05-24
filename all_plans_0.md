# Phase 0 — Gouvernance du Schéma & Contrats d'API
> **Portfolio Builder Engine v3.0** — Document d'implémentation complet

---

## Objectif & Périmètre

La Phase 0 est le socle de toute l'architecture. Son rôle est de **définir, documenter et distribuer le contrat de données** avant qu'une seule ligne de code métier ne soit écrite. Sans elle, le moteur, le Studio et le back-end peuvent diverger silencieusement sur la structure des données.

**Ce que Phase 0 produit :**
- `packages/schemas/skin.schema.json` — JSON Schema complet du skin (source de vérité)
- `packages/schemas/data.schema.json` — JSON Schema complet du contenu (source de vérité)
- `packages/schemas/SKIN_CONTRACT.md` — Documentation humaine de chaque clé
- `apps/engine/src/hooks/usePortfolioData.js` — Abstraction dev/prod (unique point d'entrée des données)
- `apps/engine/dev-seeds/skin.json` & `data.json` — Seeds de développement (déplacés, pas supprimés)
- `apps/api/schemas/` — Modèles Pydantic (Python) générés depuis les JSON Schemas
- `apps/engine/src/lib/validateSeed.js` — Outil de validation des seeds en dev

**Ce que Phase 0 ne fait PAS :**
- Elle ne crée pas la base de données (Phase 1+)
- Elle ne crée pas les endpoints API (Phase 1+)
- Elle ne modifie pas les composants React (Phase 1+)

**Durée estimée : 2–3 jours**

---

## Livrable 1 — Structure Monorepo (Initialisation)

Avant tout, la structure du monorepo doit exister. Créer les dossiers nécessaires à Phase 0 :

```
portfolio-engine/
├── apps/
│   ├── engine/
│   │   ├── dev-seeds/          ← NOUVEAU (déplacer skin.json + data.json ici)
│   │   │   ├── skin.json
│   │   │   └── data.json
│   │   └── src/
│   │       └── hooks/
│   │           └── usePortfolioData.js   ← CRÉER
│   └── api/
│       └── schemas/            ← CRÉER (modèles Pydantic)
└── packages/
    └── schemas/                ← CRÉER (source de vérité unique)
        ├── skin.schema.json
        ├── data.schema.json
        └── SKIN_CONTRACT.md
```

**Action immédiate :** déplacer `skin.json` et `data.json` de la racine / `src/` vers `apps/engine/dev-seeds/`. Mettre à jour tous les imports existants.

```bash
mkdir -p packages/schemas
mkdir -p apps/engine/dev-seeds
mkdir -p apps/api/schemas

# Déplacer les seeds
mv src/skin.json apps/engine/dev-seeds/skin.json
mv src/data.json apps/engine/dev-seeds/data.json
```

---

## Livrable 2 — `packages/schemas/skin.schema.json`

Schéma JSON complet, dérivé de `skin.json` actuel. Ce fichier est la **source de vérité partagée** entre le front, le back et le Studio.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://portfolioengine.com/schemas/skin.schema.json",
  "title": "PortfolioSkin",
  "description": "Schéma complet d'un skin Portfolio Engine. Utilisé côté API (Pydantic/Zod), Studio (génération de formulaires) et moteur (validation en dev).",
  "type": "object",
  "required": ["theme", "typography", "layout", "animations", "effects", "cursor", "assets"],
  "additionalProperties": false,

  "properties": {

    "theme": {
      "type": "object",
      "required": ["light", "dark"],
      "description": "Tokens de couleur pour les deux modes.",
      "properties": {
        "light": { "$ref": "#/$defs/ThemeTokens" },
        "dark":  { "$ref": "#/$defs/ThemeTokens" }
      }
    },

    "typography": {
      "type": "object",
      "required": ["--font-mono", "--font-heading"],
      "description": "Déclarations de polices utilisées dans le portfolio.",
      "properties": {
        "--font-mono":    { "type": "string", "example": "'DM Mono', monospace" },
        "--font-heading": { "type": "string", "example": "'Fraunces', serif" },
        "--font-body":    { "type": "string", "description": "Optionnel. Défaut: system-ui" }
      },
      "additionalProperties": false
    },

    "layout": {
      "type": "object",
      "required": ["skillsColumns", "--border-radius-base", "--border-radius-large"],
      "description": "Paramètres de mise en page structurelle.",
      "properties": {
        "heroReversed":          { "type": "boolean", "default": false, "description": "Inverse photo/texte dans le Hero." },
        "skillsColumns":         { "type": "integer", "minimum": 1, "maximum": 6, "default": 4 },
        "--border-radius-base":  { "type": "string", "pattern": "^[0-9]+(px|rem|em|%)$", "default": "4px" },
        "--border-radius-large": { "type": "string", "default": "50%" },
        "--hero-gap":            { "type": "string", "default": "0px" }
      },
      "additionalProperties": false
    },

    "animations": {
      "type": "object",
      "description": "Paramètres globaux d'animation.",
      "properties": {
        "parallaxFactor": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "default": 0.3,
          "description": "Intensité de l'effet parallax. 0 = désactivé."
        },
        "stagger": {
          "type": "object",
          "description": "Délais d'apparition en cascade (ms).",
          "properties": {
            "skillsDelay":     { "type": "integer", "minimum": 0, "maximum": 1000, "default": 150 },
            "experienceDelay": { "type": "integer", "minimum": 0, "maximum": 1000, "default": 100 }
          },
          "additionalProperties": false
        },
        "decryptedText": {
          "type": "object",
          "description": "Durées de l'animation de déchiffrement de texte (ms) par zone. Générique en v3: utiliser short/medium/long/xlong.",
          "properties": {
            "short":  { "type": "integer", "minimum": 0, "default": 400 },
            "medium": { "type": "integer", "minimum": 0, "default": 600 },
            "long":   { "type": "integer", "minimum": 0, "default": 900 },
            "xlong":  { "type": "integer", "minimum": 0, "default": 1200 }
          },
          "description": "Note: les clés nommées (heroTag, heroTitle...) du skin.json actuel sont dépréciées en faveur de short/medium/long/xlong. Compatibilité maintenue par le hook.",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },

    "effects": {
      "type": "object",
      "description": "Effets visuels globaux (bruit, grille de fond).",
      "properties": {
        "--noise-opacity": { "type": "string", "pattern": "^0(\\.\\d+)?$|^1$", "default": "0.05" },
        "--grid-opacity":  { "type": "string", "pattern": "^0(\\.\\d+)?$|^1$", "default": "0.6" }
      },
      "additionalProperties": false
    },

    "cursor": {
      "type": "object",
      "required": ["type"],
      "description": "Configuration du curseur personnalisé.",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["default", "custom", "none"],
          "default": "default",
          "description": "'custom' active le composant CustomCursor. 'none' masque le curseur."
        }
      },
      "additionalProperties": false
    },

    "assets": {
      "type": "object",
      "description": "URLs des assets statiques. En dev: chemins relatifs. En prod: URLs CDN complètes.",
      "properties": {
        "heroPhoto": {
          "type": "string",
          "description": "En dev: nom de fichier (ex: 'azerty.jpg'). En prod: URL CDN complète (ex: 'https://cdn.portfolioengine.com/juvanio/photo.jpg')."
        },
        "favicon": {
          "type": "string",
          "description": "En dev: nom de fichier. En prod: URL CDN."
        },
        "cvPdf": {
          "type": "string",
          "description": "Optionnel. URL du CV PDF. En prod: URL CDN signée."
        }
      },
      "additionalProperties": false
    },

    "addons": {
      "type": "object",
      "description": "Activation des add-ons globaux (optionnel — tous à false par défaut).",
      "properties": {
        "customCursor":  { "type": "boolean", "default": false },
        "bootSequence":  { "type": "boolean", "default": false, "description": "Animation de démarrage style terminal." },
        "noiseOverlay":  { "type": "boolean", "default": true },
        "networkCanvas": { "type": "boolean", "default": false, "description": "Canvas de particules en fond." }
      },
      "additionalProperties": false
    },

    "architecture": {
      "type": "array",
      "description": "Définition de la structure de la page (Phase 3). Tableau ordonné des blocs à rendre.",
      "items": {
        "type": "object",
        "required": ["id", "component"],
        "properties": {
          "id":        { "type": "string", "description": "Identifiant unique du bloc (ex: 'hero-main')." },
          "component": { "type": "string", "description": "Nom du composant dans Registry.js (ex: 'HeroTerminal')." },
          "visible":   { "type": "boolean", "default": true },
          "props":     { "type": "object", "description": "Props supplémentaires passées au composant.", "additionalProperties": true }
        },
        "additionalProperties": false
      }
    }
  },

  "$defs": {
    "ThemeTokens": {
      "type": "object",
      "required": ["--bg", "--surface", "--surface2", "--accent", "--accent2", "--accent3", "--text", "--muted", "--border", "--glow"],
      "additionalProperties": false,
      "properties": {
        "--bg":       { "type": "string", "description": "Couleur de fond principale." },
        "--surface":  { "type": "string", "description": "Fond des cartes/panneaux." },
        "--surface2": { "type": "string", "description": "Fond secondaire (hover, séparateurs)." },
        "--accent":   { "type": "string", "description": "Couleur d'accentuation principale (CTA, liens actifs)." },
        "--accent2":  { "type": "string", "description": "Couleur d'accentuation secondaire (badges erreur/alerte)." },
        "--accent3":  { "type": "string", "description": "Couleur d'accentuation tertiaire (warnings, highlights)." },
        "--text":     { "type": "string", "description": "Couleur de texte principal." },
        "--muted":    { "type": "string", "description": "Texte secondaire/désactivé." },
        "--border":   { "type": "string", "description": "Couleur des bordures (rgba recommandé)." },
        "--glow":     { "type": "string", "description": "Couleur des effets de glow/halo (rgba recommandé)." }
      }
    }
  }
}
```

---

## Livrable 3 — `packages/schemas/data.schema.json`

Schéma JSON complet dérivé de `data.json` actuel. Couvre toutes les sections avec i18n.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://portfolioengine.com/schemas/data.schema.json",
  "title": "PortfolioData",
  "description": "Schéma complet des données de contenu d'un portfolio. Multi-langue (fr/en).",
  "type": "object",
  "required": ["meta", "navbar", "footer", "hero", "skills", "experience", "formation", "contact"],
  "additionalProperties": false,

  "properties": {

    "meta": {
      "type": "object",
      "required": ["name", "available", "contact"],
      "properties": {
        "name":      { "type": "string", "description": "Nom complet affiché. Ex: 'Amouzougan Kangni Juvanio'." },
        "available": { "type": "boolean", "description": "Badge de disponibilité affiché dans le Hero." },
        "contact": {
          "type": "object",
          "required": ["email"],
          "properties": {
            "email":            { "type": "string", "format": "email" },
            "phone":            { "type": "string" },
            "linkedin":         { "type": "string", "format": "uri" },
            "linkedin_handle":  { "type": "string" },
            "github":           { "type": "string", "format": "uri" },
            "github_handle":    { "type": "string" },
            "pypi":             { "type": "string", "format": "uri" },
            "pypi_handle":      { "type": "string" },
            "cv":               { "type": "string", "description": "Nom de fichier en dev, URL CDN en prod." }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },

    "navbar": { "$ref": "#/$defs/I18nObject", "description": "Labels de navigation, par langue." },
    "footer": { "$ref": "#/$defs/I18nObject", "description": "Contenu du footer, par langue." },

    "hero": {
      "$ref": "#/$defs/I18nObject",
      "description": "Contenu de la section Hero. Chaque langue contient: tag, title, positioning, founder, framework, desc, leadership, contactBtn, cvBtn, expBtn, scroll."
    },

    "tenxyte": {
      "$ref": "#/$defs/I18nObject",
      "description": "Section projet phare Tenxyte. Contient badge, desc, stats, statsValues, cta, layers (architecture blueprint)."
    },

    "skills": {
      "type": "object",
      "description": "Section compétences, multi-langue.",
      "patternProperties": {
        "^(fr|en)$": {
          "type": "object",
          "required": ["sectionNum", "sectionLabel", "title1", "title2", "racks"],
          "properties": {
            "sectionNum":   { "type": "string" },
            "sectionLabel": { "type": "string" },
            "title1":       { "type": "string" },
            "title2":       { "type": "string" },
            "racks": {
              "type": "object",
              "description": "Map de racks de compétences. Clé = identifiant du rack.",
              "additionalProperties": { "$ref": "#/$defs/SkillRack" }
            }
          }
        }
      },
      "additionalProperties": false
    },

    "experience": {
      "type": "object",
      "description": "Section expérience professionnelle, multi-langue.",
      "patternProperties": {
        "^(fr|en)$": {
          "type": "object",
          "required": ["sectionNum", "sectionLabel", "title1", "title2", "jobs"],
          "properties": {
            "sectionNum":   { "type": "string" },
            "sectionLabel": { "type": "string" },
            "title1":       { "type": "string" },
            "title2":       { "type": "string" },
            "jobs": {
              "type": "array",
              "items": { "$ref": "#/$defs/Job" }
            }
          }
        }
      },
      "additionalProperties": false
    },

    "formation": { "$ref": "#/$defs/I18nObject" },
    "contact":   { "$ref": "#/$defs/I18nObject" }
  },

  "$defs": {
    "I18nObject": {
      "type": "object",
      "patternProperties": {
        "^[a-z]{2}$": { "type": "object", "additionalProperties": true }
      },
      "additionalProperties": false
    },

    "SkillRack": {
      "type": "object",
      "required": ["rackId", "icon", "title"],
      "properties": {
        "rackId": { "type": "string", "pattern": "^RACK-\\d{2}$" },
        "icon":   { "type": "string" },
        "leds":   {
          "type": "array",
          "items": { "type": "string", "enum": ["green", "yellow", "red", "off"] },
          "minItems": 1,
          "maxItems": 5
        },
        "title": { "type": "string" },
        "tags":  { "type": "array", "items": { "type": "string" } },
        "items": {
          "type": "array",
          "description": "Pour les racks avec niveau (langues).",
          "items": {
            "type": "object",
            "required": ["name", "level", "width"],
            "properties": {
              "name":  { "type": "string" },
              "level": { "type": "string" },
              "width": { "type": "string", "pattern": "^\\d+%$" }
            }
          }
        }
      },
      "additionalProperties": false
    },

    "Job": {
      "type": "object",
      "required": ["hash", "date", "company", "isRoleSplit", "role", "changes"],
      "properties": {
        "hash":          { "type": "string", "pattern": "^[a-f0-9]{7}$", "description": "Hash git-style pour identifier l'entrée." },
        "date":          { "type": "string" },
        "company":       { "type": "string" },
        "isRoleSplit":   { "type": "boolean" },
        "rolePrefix":    { "type": "string" },
        "roleHighlight": { "type": "string", "description": "Partie du rôle affichée en couleur accent." },
        "roleSuffix":    { "type": "string" },
        "badge":         { "type": "string", "enum": ["LEAD", "CTO", "FREELANCE", "INTERN"] },
        "role":          { "type": "string" },
        "desc":          { "type": "string" },
        "changes": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["type", "symbol", "text"],
            "properties": {
              "type":   { "type": "string", "enum": ["add", "mod", "del"] },
              "symbol": { "type": "string", "enum": ["+", "M", "-"] },
              "text":   { "type": "string" }
            },
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## Livrable 4 — `packages/schemas/SKIN_CONTRACT.md`

Documentation humaine exhaustive de chaque clé. C'est le document que lit un développeur back-end pour implémenter l'API sans avoir accès au front-end.

```markdown
# SKIN CONTRACT — Portfolio Engine v3.0

Toute clé absente dans une réponse API doit être fournie avec sa valeur par défaut.
Toute clé non listée ici est ignorée par le moteur (additionalProperties: false).

## `theme`

| Clé CSS Custom Property | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `--bg` | string (color) | ✅ | `#f8fafc` (light) / `#080a0f` (dark) | Fond principal de la page |
| `--surface` | string (color) | ✅ | `#ffffff` / `#0d1017` | Fond des cartes, modales |
| `--surface2` | string (color) | ✅ | `#e2e8f0` / `#121820` | Fond hover, séparateurs |
| `--accent` | string (color) | ✅ | `#0b7a6f` / `#00e5c3` | CTA, liens actifs, barres de progression |
| `--accent2` | string (color) | ✅ | `#be123c` / `#ff4d6d` | Badges erreur, led rouge, alertes |
| `--accent3` | string (color) | ✅ | `#b45309` / `#ffd166` | Warnings, highlights secondaires |
| `--text` | string (color) | ✅ | `#0f172a` / `#e8eaf0` | Texte courant |
| `--muted` | string (color) | ✅ | `#475569` / `#7a859c` | Texte secondaire, placeholders |
| `--border` | string (rgba) | ✅ | `rgba(15,23,42,0.12)` / `rgba(255,255,255,0.06)` | Bordures |
| `--glow` | string (rgba) | ✅ | `rgba(11,122,111,0.2)` / `rgba(0,229,195,0.15)` | box-shadow glow sur éléments actifs |

Injection dans le DOM : `document.documentElement.style.setProperty(key, value)`

## `typography`

| Clé | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `--font-mono` | string | ✅ | `'DM Mono', monospace` | Police monospace (code, hashes, tags) |
| `--font-heading` | string | ✅ | `'Fraunces', serif` | Police des titres de sections |
| `--font-body` | string | ❌ | `system-ui, sans-serif` | Police du corps de texte |

Les polices doivent être disponibles via Google Fonts ou un CDN déclaré dans le `<head>`.

## `layout`

| Clé | Type | Obligatoire | Défaut | Valeurs valides |
|---|---|---|---|---|
| `heroReversed` | boolean | ❌ | `false` | true = photo à gauche, texte à droite |
| `skillsColumns` | integer | ✅ | `4` | 1–6 |
| `--border-radius-base` | string | ✅ | `4px` | CSS length |
| `--border-radius-large` | string | ✅ | `50%` | CSS length ou `%` |
| `--hero-gap` | string | ❌ | `0px` | CSS length (gap entre photo et texte) |

## `animations`

| Clé | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `parallaxFactor` | number [0–1] | ❌ | `0.3` | 0 = parallax désactivé |
| `stagger.skillsDelay` | integer (ms) | ❌ | `150` | Délai entre chaque rack de skills |
| `stagger.experienceDelay` | integer (ms) | ❌ | `100` | Délai entre chaque job |
| `decryptedText.short` | integer (ms) | ❌ | `400` | Durée courte de déchiffrement |
| `decryptedText.medium` | integer (ms) | ❌ | `600` | Durée moyenne |
| `decryptedText.long` | integer (ms) | ❌ | `900` | Durée longue |
| `decryptedText.xlong` | integer (ms) | ❌ | `1200` | Durée très longue (descriptions) |

**Note de migration:** Les clés nommées de l'ancien skin (heroTag, heroTitle, tenxyteDesc...) sont dépréciées.
Le hook `usePortfolioData` les normalise automatiquement vers short/medium/long/xlong.

## `effects`

| Clé | Type | Obligatoire | Défaut |
|---|---|---|---|
| `--noise-opacity` | string [0–1] | ❌ | `0.05` |
| `--grid-opacity` | string [0–1] | ❌ | `0.6` |

## `cursor`

| Clé | Type | Obligatoire | Défaut | Valeurs |
|---|---|---|---|---|
| `type` | enum | ✅ | `"default"` | `"default"` / `"custom"` / `"none"` |

`"custom"` charge le composant CustomCursor dynamiquement (lazy import).

## `assets`

| Clé | Type | Obligatoire | En dev | En prod |
|---|---|---|---|---|
| `heroPhoto` | string | ❌ | nom de fichier dans `/public` | URL CDN complète |
| `favicon` | string | ❌ | nom de fichier dans `/public` | URL CDN complète |
| `cvPdf` | string | ❌ | nom de fichier dans `/public` | URL CDN signée (expirée après 1h si S3 presign) |

## `addons`

| Clé | Type | Défaut | Description |
|---|---|---|---|
| `customCursor` | boolean | `false` | Active le curseur personnalisé |
| `bootSequence` | boolean | `false` | Animation de démarrage style terminal |
| `noiseOverlay` | boolean | `true` | Overlay de bruit de fond |
| `networkCanvas` | boolean | `false` | Canvas de particules en fond |

## `architecture` (Phase 3)

Tableau ordonné des blocs à rendre. Vide = le moteur utilise la liste par défaut.

```json
[
  { "id": "hero-main",  "component": "HeroTerminal",      "visible": true },
  { "id": "tenxyte-1", "component": "TenxyteShowcase",   "visible": true },
  { "id": "skills-1",  "component": "SkillsServerRack",  "visible": true, "props": { "variant": "compact" } },
  { "id": "xp-1",      "component": "ExperienceTimeline","visible": true },
  { "id": "form-1",    "component": "FormationGrid",     "visible": true },
  { "id": "contact-1", "component": "ContactTerminal",   "visible": true }
]
```
```

---

## Livrable 5 — `apps/engine/src/hooks/usePortfolioData.js`

C'est le livrable le plus critique de Phase 0. Ce hook est **l'unique point d'entrée des données dans le moteur**. Aucun composant ne sait si les données viennent d'un fichier ou d'une API.

```js
// apps/engine/src/hooks/usePortfolioData.js
// ============================================================
// UNIQUE POINT D'ENTRÉE DES DONNÉES DANS LE MOTEUR REACT
// En dev  : lit apps/engine/dev-seeds/skin.json + data.json
// En prod : appelle GET /api/v1/portfolio/:slug
// ============================================================

import { useQuery } from '@tanstack/react-query';

// Seeds importés statiquement en dev uniquement.
// Vite les tree-shake en production (import.meta.env.DEV = false).
let localSkin = null;
let localData = null;

if (import.meta.env.DEV) {
  // Import dynamique pour éviter d'inclure les seeds en prod
  const skinModule = await import('../../dev-seeds/skin.json', { assert: { type: 'json' } });
  const dataModule = await import('../../dev-seeds/data.json', { assert: { type: 'json' } });
  localSkin = skinModule.default;
  localData = dataModule.default;
}

// ─────────────────────────────────────────
// Normalisation du skin (compatibilité v2 -> v3)
// Convertit les anciennes clés nommées de decryptedText
// vers le système générique short/medium/long/xlong
// ─────────────────────────────────────────
function normalizeSkin(rawSkin) {
  if (!rawSkin) return null;

  const skin = structuredClone(rawSkin);

  // Migration decryptedText : si l'ancien format est présent, le normaliser
  const dt = skin.animations?.decryptedText;
  if (dt && !dt.short) {
    const durations = Object.values(dt).filter(v => typeof v === 'number').sort((a, b) => a - b);
    skin.animations.decryptedText = {
      short:  durations[0] ?? 400,
      medium: durations[1] ?? 600,
      long:   durations[2] ?? 900,
      xlong:  durations[3] ?? 1200,
    };
  }

  // Assurer les valeurs par défaut des addons
  skin.addons = {
    customCursor:  false,
    bootSequence:  false,
    noiseOverlay:  true,
    networkCanvas: false,
    ...skin.addons,
  };

  return skin;
}

// ─────────────────────────────────────────
// Fetcher API production
// ─────────────────────────────────────────
async function fetchPortfolio(slug) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
  const res = await fetch(`${BASE_URL}/api/v1/portfolio/${slug}`);

  if (!res.ok) {
    const error = new Error(`Portfolio non trouvé pour le slug: ${slug}`);
    error.status = res.status;
    throw error;
  }

  const payload = await res.json();
  // Réponse API attendue: { skin: {...}, data: {...} }
  return {
    skin: normalizeSkin(payload.skin),
    data: payload.data,
  };
}

// ─────────────────────────────────────────
// Résolution du slug depuis l'hostname
// juvanio.portfolioengine.com → "juvanio"
// localhost:5173 → valeur de VITE_DEV_SLUG
// ─────────────────────────────────────────
export function resolveSlugFromHostname() {
  const hostname = window.location.hostname;

  // Dev local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_DEV_SLUG ?? 'dev';
  }

  // Domaine personnalisé: lookup en base (géré côté API, pas ici)
  // portfolioengine.com elle-même: slug = "home" (landing page)
  if (hostname === 'portfolioengine.com' || hostname === 'www.portfolioengine.com') {
    return 'home';
  }

  // Sous-domaine: juvanio.portfolioengine.com → "juvanio"
  const parts = hostname.split('.');
  if (parts.length >= 3) return parts[0];

  // Domaine custom (alice.dev): l'API résout le slug via DNS lookup
  // Le moteur envoie l'hostname complet, l'API renvoie le bon portfolio
  return hostname;
}

// ─────────────────────────────────────────
// HOOK PRINCIPAL — exporté et utilisé dans App.jsx
// ─────────────────────────────────────────
export function usePortfolioData(slug) {
  // ── MODE DEV ──────────────────────────────────
  if (import.meta.env.DEV) {
    // En dev, on valide les seeds contre le schéma (voir Livrable 6)
    // Retour synchrone : pas de loading state en dev
    return {
      skin: normalizeSkin(localSkin),
      data: localData,
      status: 'success',
      error: null,
      isLoading: false,
      isFetching: false,
    };
  }

  // ── MODE PRODUCTION ────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const query = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => fetchPortfolio(slug),
    staleTime: 5 * 60 * 1000,       // 5 minutes en cache
    gcTime:    30 * 60 * 1000,      // 30 minutes avant garbage collect
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    skin: query.data?.skin ?? null,
    data: query.data?.data ?? null,
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
```

**Configuration `.env` requise :**

```bash
# apps/engine/.env.development
VITE_DEV_SLUG=juvanio
VITE_API_BASE_URL=http://localhost:8000

# apps/engine/.env.production
VITE_API_BASE_URL=https://api.portfolioengine.com
```

**Intégration dans `App.jsx` (aperçu — implémentation complète en Phase 1) :**

```jsx
// apps/engine/src/App.jsx
import { resolveSlugFromHostname, usePortfolioData } from './hooks/usePortfolioData';

function App() {
  const slug = resolveSlugFromHostname();
  const { skin, data, status, error } = usePortfolioData(slug);

  if (status === 'loading') return <BootSequenceSkeleton />;
  if (status === 'error')   return <ErrorScreen message={error.message} />;

  return <PortfolioEngine skin={skin} data={data} />;
}
```

---

## Livrable 6 — Validation des Seeds en Dev

Script de validation à exécuter au démarrage du serveur de dev. Évite de travailler avec des seeds corrompus.

```js
// apps/engine/src/lib/validateSeed.js
// Exécuté uniquement en mode DEV (import conditionnel dans main.jsx)

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import skinSchema from '../../../packages/schemas/skin.schema.json' assert { type: 'json' };
import dataSchema from '../../../packages/schemas/data.schema.json' assert { type: 'json' };
import localSkin from '../../dev-seeds/skin.json' assert { type: 'json' };
import localData from '../../dev-seeds/data.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validateDevSeeds() {
  const validateSkin = ajv.compile(skinSchema);
  const validateData = ajv.compile(dataSchema);

  const skinValid = validateSkin(localSkin);
  const dataValid = validateData(localData);

  if (!skinValid) {
    console.error('[PortfolioEngine] ❌ skin.json invalide:');
    validateSkin.errors.forEach(e => console.error(`  - ${e.instancePath} ${e.message}`));
  }

  if (!dataValid) {
    console.error('[PortfolioEngine] ❌ data.json invalide:');
    validateData.errors.forEach(e => console.error(`  - ${e.instancePath} ${e.message}`));
  }

  if (skinValid && dataValid) {
    console.log('[PortfolioEngine] ✅ Seeds valides (skin.json + data.json)');
  }
}
```

```jsx
// apps/engine/src/main.jsx  — Ajouter au démarrage
if (import.meta.env.DEV) {
  const { validateDevSeeds } = await import('./lib/validateSeed.js');
  validateDevSeeds();
}
```

---

## Livrable 7 — Modèles Pydantic (Back-End Python)

Modèles directement dérivés des schémas JSON. À placer dans `apps/api/schemas/`.

```python
# apps/api/schemas/skin_schema.py
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class ThemeTokens(BaseModel):
    bg:       str = Field(alias="--bg")
    surface:  str = Field(alias="--surface")
    surface2: str = Field(alias="--surface2")
    accent:   str = Field(alias="--accent")
    accent2:  str = Field(alias="--accent2")
    accent3:  str = Field(alias="--accent3")
    text:     str = Field(alias="--text")
    muted:    str = Field(alias="--muted")
    border:   str = Field(alias="--border")
    glow:     str = Field(alias="--glow")

    model_config = {"populate_by_name": True}

class Theme(BaseModel):
    light: ThemeTokens
    dark:  ThemeTokens

class Typography(BaseModel):
    font_mono:    str = Field(alias="--font-mono",    default="'DM Mono', monospace")
    font_heading: str = Field(alias="--font-heading", default="'Fraunces', serif")
    font_body:    Optional[str] = Field(alias="--font-body", default=None)

    model_config = {"populate_by_name": True}

class Layout(BaseModel):
    heroReversed:          bool = False
    skillsColumns:         int  = Field(default=4, ge=1, le=6)
    border_radius_base:    str  = Field(alias="--border-radius-base",  default="4px")
    border_radius_large:   str  = Field(alias="--border-radius-large", default="50%")
    hero_gap:              str  = Field(alias="--hero-gap",            default="0px")

    model_config = {"populate_by_name": True}

class DecryptedText(BaseModel):
    short:  int = 400
    medium: int = 600
    long:   int = 900
    xlong:  int = 1200

class Stagger(BaseModel):
    skillsDelay:     int = 150
    experienceDelay: int = 100

class Animations(BaseModel):
    parallaxFactor: float = Field(default=0.3, ge=0.0, le=1.0)
    stagger:        Stagger = Stagger()
    decryptedText:  DecryptedText = DecryptedText()

class Effects(BaseModel):
    noise_opacity: str = Field(alias="--noise-opacity", default="0.05")
    grid_opacity:  str = Field(alias="--grid-opacity",  default="0.6")

    model_config = {"populate_by_name": True}

class CursorType(str, Enum):
    default = "default"
    custom  = "custom"
    none    = "none"

class Cursor(BaseModel):
    type: CursorType = CursorType.default

class Assets(BaseModel):
    heroPhoto: Optional[str] = None
    favicon:   Optional[str] = None
    cvPdf:     Optional[str] = None

class Addons(BaseModel):
    customCursor:  bool = False
    bootSequence:  bool = False
    noiseOverlay:  bool = True
    networkCanvas: bool = False

class ArchitectureBlock(BaseModel):
    id:        str
    component: str
    visible:   bool = True
    props:     dict = {}

class SkinSchema(BaseModel):
    """Modèle complet d'un skin. Utilisé pour valider les PATCH /api/studio/:slug/skin."""
    theme:        Theme
    typography:   Typography       = Typography()
    layout:       Layout           = Layout()
    animations:   Animations       = Animations()
    effects:      Effects          = Effects()
    cursor:       Cursor           = Cursor()
    assets:       Assets           = Assets()
    addons:       Addons           = Addons()
    architecture: list[ArchitectureBlock] = []

class SkinPatchSchema(BaseModel):
    """Modèle pour les mises à jour partielles (PATCH). Toutes les clés optionnelles."""
    theme:        Optional[Theme]       = None
    typography:   Optional[Typography]  = None
    layout:       Optional[Layout]      = None
    animations:   Optional[Animations]  = None
    effects:      Optional[Effects]     = None
    cursor:       Optional[Cursor]      = None
    assets:       Optional[Assets]      = None
    addons:       Optional[Addons]      = None
    architecture: Optional[list[ArchitectureBlock]] = None
```

```python
# apps/api/schemas/data_schema.py  (extrait — les sections complètes suivent le même pattern)
from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, Literal

class Contact(BaseModel):
    email:            EmailStr
    phone:            Optional[str]  = None
    linkedin:         Optional[str]  = None
    linkedin_handle:  Optional[str]  = None
    github:           Optional[str]  = None
    github_handle:    Optional[str]  = None
    pypi:             Optional[str]  = None
    pypi_handle:      Optional[str]  = None
    cv:               Optional[str]  = None

class Meta(BaseModel):
    name:      str
    available: bool
    contact:   Contact

class JobChange(BaseModel):
    type:   Literal["add", "mod", "del"]
    symbol: Literal["+", "M", "-"]
    text:   str

class Job(BaseModel):
    hash:          str
    date:          str
    company:       str
    isRoleSplit:   bool
    role:          str
    desc:          str
    changes:       list[JobChange]
    rolePrefix:    Optional[str] = None
    roleHighlight: Optional[str] = None
    roleSuffix:    Optional[str] = None
    badge:         Optional[Literal["LEAD", "CTO", "FREELANCE", "INTERN"]] = None

class SkillItem(BaseModel):
    name:  str
    level: str
    width: str

class SkillRack(BaseModel):
    rackId: str
    icon:   str
    leds:   Optional[list[Literal["green", "yellow", "red", "off"]]] = None
    title:  str
    tags:   Optional[list[str]]      = None
    items:  Optional[list[SkillItem]] = None
```

---

## Livrable 8 — Schémas Zod (Studio TypeScript)

Pour le Studio React (Phase 5), les mêmes contraintes exprimées en Zod.

```typescript
// packages/schemas/skin.zod.ts
import { z } from 'zod';

const ThemeTokensSchema = z.object({
  '--bg':       z.string(),
  '--surface':  z.string(),
  '--surface2': z.string(),
  '--accent':   z.string(),
  '--accent2':  z.string(),
  '--accent3':  z.string(),
  '--text':     z.string(),
  '--muted':    z.string(),
  '--border':   z.string(),
  '--glow':     z.string(),
});

const AnimationsSchema = z.object({
  parallaxFactor: z.number().min(0).max(1).default(0.3),
  stagger: z.object({
    skillsDelay:     z.number().int().min(0).max(1000).default(150),
    experienceDelay: z.number().int().min(0).max(1000).default(100),
  }).default({}),
  decryptedText: z.object({
    short:  z.number().int().default(400),
    medium: z.number().int().default(600),
    long:   z.number().int().default(900),
    xlong:  z.number().int().default(1200),
  }).default({}),
}).default({});

export const SkinSchema = z.object({
  theme: z.object({
    light: ThemeTokensSchema,
    dark:  ThemeTokensSchema,
  }),
  typography: z.object({
    '--font-mono':    z.string().default("'DM Mono', monospace"),
    '--font-heading': z.string().default("'Fraunces', serif"),
    '--font-body':    z.string().optional(),
  }).default({}),
  layout: z.object({
    heroReversed:          z.boolean().default(false),
    skillsColumns:         z.number().int().min(1).max(6).default(4),
    '--border-radius-base':  z.string().default('4px'),
    '--border-radius-large': z.string().default('50%'),
    '--hero-gap':            z.string().default('0px'),
  }).default({}),
  animations: AnimationsSchema,
  effects: z.object({
    '--noise-opacity': z.string().default('0.05'),
    '--grid-opacity':  z.string().default('0.6'),
  }).default({}),
  cursor: z.object({
    type: z.enum(['default', 'custom', 'none']).default('default'),
  }).default({}),
  assets: z.object({
    heroPhoto: z.string().optional(),
    favicon:   z.string().optional(),
    cvPdf:     z.string().optional(),
  }).default({}),
  addons: z.object({
    customCursor:  z.boolean().default(false),
    bootSequence:  z.boolean().default(false),
    noiseOverlay:  z.boolean().default(true),
    networkCanvas: z.boolean().default(false),
  }).default({}),
  architecture: z.array(z.object({
    id:        z.string(),
    component: z.string(),
    visible:   z.boolean().default(true),
    props:     z.record(z.unknown()).default({}),
  })).default([]),
});

export type Skin = z.infer<typeof SkinSchema>;

// Utilitaire de validation avec logs détaillés
export function validateSkin(raw: unknown): Skin {
  const result = SkinSchema.safeParse(raw);
  if (!result.success) {
    console.error('[SkinSchema] Erreurs de validation:', result.error.flatten());
    throw new Error('Skin invalide');
  }
  return result.data;
}
```

---

## Livrable 9 — Dépendances à installer

```bash
# apps/engine (React/Vite)
npm install @tanstack/react-query ajv ajv-formats

# Peer dependency React Query (si pas encore présent)
npm install @tanstack/react-query-devtools --save-dev

# packages/schemas (validation partagée)
# Pas de dépendances npm — JSON Schema pur

# apps/studio (TypeScript)
npm install zod

# apps/api (Python/Django)
pip install pydantic[email]
```

**Configurer React Query dans `main.jsx` :**

```jsx
// apps/engine/src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
```

---

## Checklist — Définition of Done (Phase 0)

Phase 0 est considérée **complète** quand tous ces points sont verts :

```
[ ] packages/schemas/skin.schema.json    — créé et validé contre skin.json actuel (0 erreur)
[ ] packages/schemas/data.schema.json    — créé et validé contre data.json actuel (0 erreur)
[ ] packages/schemas/SKIN_CONTRACT.md    — chaque clé documentée avec type, défaut, description
[ ] apps/engine/dev-seeds/skin.json      — déplacé depuis src/ ou racine
[ ] apps/engine/dev-seeds/data.json      — déplacé depuis src/ ou racine
[ ] usePortfolioData(slug) créé          — retourne { skin, data, status, error, isLoading }
[ ] usePortfolioData en DEV              — lit les seeds locaux, status='success' immédiat
[ ] usePortfolioData en PROD             — appelle /api/v1/portfolio/:slug via React Query
[ ] normalizeSkin() actif                — migre decryptedText ancien format → short/medium/long/xlong
[ ] resolveSlugFromHostname() fonctionnel— localhost → VITE_DEV_SLUG, subdomain → slug
[ ] validateDevSeeds() fonctionnel       — s'exécute au démarrage dev, log les erreurs AJV
[ ] SkinSchema Pydantic créé             — SkinSchema + SkinPatchSchema dans apps/api/schemas/
[ ] SkinSchema Zod créé                  — dans packages/schemas/skin.zod.ts
[ ] .env.development configuré           — VITE_DEV_SLUG=juvanio, VITE_API_BASE_URL défini
[ ] Aucun composant n'importe            — skin.json ou data.json directement (seulement via hook)
[ ] `npm run dev` démarre sans erreur    — 0 warning AJV dans la console
```

---

## Ordre d'exécution recommandé

```
Jour 1 (matin)   : Créer la structure de dossiers + déplacer les seeds
Jour 1 (après-m) : Écrire skin.schema.json + le valider avec AJV en CLI
Jour 2 (matin)   : Écrire data.schema.json + le valider avec AJV en CLI
Jour 2 (après-m) : Implémenter usePortfolioData.js + validateSeed.js
Jour 3 (matin)   : Écrire les modèles Pydantic + Zod
Jour 3 (après-m) : Écrire SKIN_CONTRACT.md + Checklist DoD
```

**Commande de validation AJV en CLI (Jour 1/2) :**

```bash
# Installer AJV CLI
npm install -g ajv-cli

# Valider les seeds contre les schémas
ajv validate -s packages/schemas/skin.schema.json -d apps/engine/dev-seeds/skin.json --all-errors
ajv validate -s packages/schemas/data.schema.json -d apps/engine/dev-seeds/data.json --all-errors
```

---

*Document généré pour Portfolio Builder Engine v3.0 — Phase 0 uniquement.*
*Basé sur skin.json (Juvanio Amouzougan) et data.json existants.*