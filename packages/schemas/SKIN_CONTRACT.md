# SKIN CONTRACT — Portfolio Engine v3.0

> Source de vérité documentaire du schéma `skin.schema.json`.
> Toute clé absente dans une réponse API doit être fournie avec sa valeur par défaut.
> Toute clé non listée ici est ignorée par le moteur (`additionalProperties: false`).

---

## `theme`

Tokens de couleur pour les deux modes (light/dark). Injectés dans le DOM via :
```js
document.documentElement.style.setProperty(key, value)
```

| CSS Custom Property | Type | Obligatoire | Défaut (light) | Défaut (dark) | Description |
|---|---|---|---|---|---|
| `--bg`       | string (color) | ✅ | `#f8fafc`             | `#080a0f`              | Fond principal de la page |
| `--surface`  | string (color) | ✅ | `#ffffff`             | `#0d1017`              | Fond des cartes, modales |
| `--surface2` | string (color) | ✅ | `#e2e8f0`             | `#121820`              | Fond hover, séparateurs |
| `--accent`   | string (color) | ✅ | `#0b7a6f`             | `#00e5c3`              | CTA, liens actifs, barres de progression |
| `--accent2`  | string (color) | ✅ | `#be123c`             | `#ff4d6d`              | Badges erreur, led rouge, alertes |
| `--accent3`  | string (color) | ✅ | `#b45309`             | `#ffd166`              | Warnings, highlights secondaires |
| `--text`     | string (color) | ✅ | `#0f172a`             | `#e8eaf0`              | Texte courant |
| `--muted`    | string (color) | ✅ | `#475569`             | `#7a859c`              | Texte secondaire, placeholders |
| `--border`   | string (rgba)  | ✅ | `rgba(15,23,42,0.12)` | `rgba(255,255,255,0.06)` | Bordures |
| `--glow`     | string (rgba)  | ✅ | `rgba(11,122,111,0.2)`| `rgba(0,229,195,0.15)` | box-shadow glow sur éléments actifs |

---

## `typography`

Déclarations de polices. Les polices doivent être disponibles via Google Fonts ou un CDN déclaré dans le `<head>`.

| Clé | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `--font-mono`    | string | ✅ | `'DM Mono', monospace`   | Police monospace (code, hashes, tags) |
| `--font-heading` | string | ✅ | `'Fraunces', serif`      | Police des titres de sections |
| `--font-body`    | string | ❌ | `system-ui, sans-serif`  | Police du corps de texte |

---

## `layout`

Paramètres de mise en page structurelle.

| Clé | Type | Obligatoire | Défaut | Valeurs valides | Description |
|---|---|---|---|---|---|
| `heroReversed`          | boolean | ❌ | `false` | `true` / `false` | `true` = photo à gauche, texte à droite |
| `skillsColumns`         | integer | ✅ | `4`     | `1`–`6`          | Nombre de colonnes pour les racks de skills |
| `--border-radius-base`  | string  | ✅ | `4px`   | CSS length       | Rayon de bordure des éléments courants |
| `--border-radius-large` | string  | ✅ | `50%`   | CSS length ou `%` | Rayon des photos/badges ronds |
| `--hero-gap`            | string  | ❌ | `0px`   | CSS length       | Gap entre la photo et le texte dans le Hero |

---

## `animations`

Paramètres globaux d'animation.

| Clé | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `parallaxFactor`          | number [0–1]  | ❌ | `0.3` | Intensité de l'effet parallax. `0` = désactivé |
| `stagger.skillsDelay`     | integer (ms)  | ❌ | `150` | Délai entre chaque rack de skills en cascade |
| `stagger.experienceDelay` | integer (ms)  | ❌ | `100` | Délai entre chaque job en cascade |
| `decryptedText.short`     | integer (ms)  | ❌ | `400` | Durée courte de déchiffrement (boutons, tags) |
| `decryptedText.medium`    | integer (ms)  | ❌ | `600` | Durée moyenne (titres courts) |
| `decryptedText.long`      | integer (ms)  | ❌ | `900` | Durée longue (titres longs, sous-titres) |
| `decryptedText.xlong`     | integer (ms)  | ❌ | `1200`| Durée très longue (descriptions, paragraphes) |

> **Note de migration v2 → v3 :** Les clés nommées de l'ancien format (`heroTag`, `heroTitle`, `tenxyteDesc`…) sont **dépréciées**.
> Le hook `usePortfolioData` les normalise automatiquement vers `short`/`medium`/`long`/`xlong` à la lecture.
> Les anciens skins continuent de fonctionner sans modification.

---

## `effects`

Effets visuels de fond appliqués globalement.

| Clé | Type | Obligatoire | Défaut | Description |
|---|---|---|---|---|
| `--noise-opacity` | string [0–1] | ❌ | `0.05` | Opacité de l'overlay de bruit de fond |
| `--grid-opacity`  | string [0–1] | ❌ | `0.6`  | Opacité de la grille de fond |

---

## `cursor`

Configuration du curseur personnalisé.

| Clé | Type | Obligatoire | Défaut | Valeurs | Description |
|---|---|---|---|---|---|
| `type` | enum | ✅ | `"default"` | `"default"` / `"custom"` / `"none"` | `"custom"` charge le composant `CustomCursor` dynamiquement. `"none"` masque le curseur. |

---

## `assets`

URLs des assets statiques. Le moteur résout le chemin selon l'environnement.

| Clé | Type | Obligatoire | En dev | En prod | Description |
|---|---|---|---|---|---|
| `heroPhoto` | string | ❌ | nom de fichier dans `/public` (ex: `azerty.jpg`) | URL CDN complète | Photo principale du Hero |
| `favicon`   | string | ❌ | nom de fichier dans `/public` (ex: `favicon.png`) | URL CDN complète | Favicon du portfolio |
| `cvPdf`     | string | ❌ | nom de fichier dans `/public` (ex: `G_CV.pdf`)   | URL CDN signée (expirée après 1h si S3 presign) | CV téléchargeable |

---

## `addons`

Activation des add-ons globaux. Tous optionnels, tous désactivés par défaut sauf `noiseOverlay`.

| Clé | Type | Défaut | Description |
|---|---|---|---|
| `customCursor`  | boolean | `false` | Active le composant `CustomCursor` |
| `bootSequence`  | boolean | `false` | Animation de démarrage style terminal au chargement |
| `noiseOverlay`  | boolean | `true`  | Overlay de bruit de fond (texture grain) |
| `networkCanvas` | boolean | `false` | Canvas de particules interconnectées en fond |

---

## `architecture` *(Phase 3 — optionnel)*

Tableau ordonné des blocs à rendre. Si absent ou vide, le moteur utilise la liste par défaut codée dans `Registry.js`.

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

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id`        | string  | ✅ | Identifiant unique du bloc (ex: `"hero-main"`) |
| `component` | string  | ✅ | Nom du composant dans `Registry.js` (ex: `"HeroTerminal"`) |
| `visible`   | boolean | ❌ | `false` masque le bloc sans le supprimer. Défaut: `true` |
| `props`     | object  | ❌ | Props supplémentaires transmises au composant |

---

*Document généré pour Portfolio Builder Engine v3.0 — Phase 0.*
*Synchronisé avec `skin.schema.json` v3.0.*
