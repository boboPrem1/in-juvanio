# Phase 1 — Walkthrough : Consolidation du Front-End

## Résumé

Phase 1 terminée avec succès. Le moteur React est désormais **agnostique de la source de données** — aucun composant ne contient de slug, de nom propre, d'URL ou de valeur métier écrite en dur.

---

## Build

```
✓ 84 modules transformed
✓ Built in 4.09s (0 erreurs)
```

---

## Modifications effectuées

### Seeds — `apps/engine/dev-seeds/data.json`

| Clé ajoutée | Valeur |
|---|---|
| `meta.slug` | `"juvanio"` |
| `meta.defaultLang` | `"fr"` |
| `meta.nameLines` | `["Amouzougan","Kangni","Juvanio"]` |
| `meta.nodeName` | `"juvanio.node"` |
| `meta.terminalUser` | `"juvanio@secure-node"` |
| `tenxyte.docsUrl` | `"https://tenxyte.readthedocs.io"` |
| `marquee.items` | 13 technologies |
| `boot.lines` | 8 lignes de démarrage paramétrées |
| `boot.accessGrantedSuffix` | `"Welcome to"` |
| `terminal.logs` | 11 lignes de logs génériques |

### Hooks & Architecture

| Action | Détail |
|---|---|
| ❌ Supprimé | `src/hooks/useSkinData.js` |
| ✅ Déjà en place | `usePortfolioData(slug)` (Phase 0) |

### `src/App.jsx`

- `language` initialisé à `null` → mis à jour depuis `data.meta.defaultLang` une fois les données chargées
- `injectCssVariables` factorisé hors du composant (filtre les clés non-CSS du layout)
- Parallax : guard `factor === 0` → coupe le listener scroll
- `BootSequence` et `CustomCursor` désormais conditionnels via `skin.addons`
- `ApiView` reçoit `slug` comme prop
- `Marquee` reçoit `data` comme prop
- Skeleton et erreur via `AppSkeleton` / `AppErrorScreen`

### Composants — hardcodes éliminés

| Fichier | Hardcode supprimé | Remplacé par |
|---|---|---|
| [Hero.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Hero.jsx) | Nom `"Amouzougan Kangni Juvanio"` (3 spans fixes) | `meta.nameLines.map()` |
| [Hero.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Hero.jsx) | `"azerty.jpg"` fallback photo | Photo conditionnelle (`heroPhoto && ...`) |
| [Hero.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Hero.jsx) | Clés `heroTag`, `heroTitle`, etc. | `anims.short/medium/long` |
| [Contact.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Contact.jsx) | `"juvanio@secure-node ~ /contact"` | `meta.terminalUser` |
| [ApiView.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/ApiView.jsx) | `"/api/v1/juvanio/profile"` | `/api/v1/{slug}/profile` |
| [ApiView.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/ApiView.jsx) | `"https://tenxyte.readthedocs.io"` | `data.tenxyte.docsUrl` |
| [BootSequence.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/BootSequence.jsx) | `"juvanio.node"` hardcodé + 8 lignes JSX fixes | `data.boot.lines` + `data.meta.nodeName` |
| [Marquee.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Marquee.jsx) | 26 items dupliqués hardcodés | `data.marquee.items` (×2 via JS) |
| [TerminalBackground.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/TerminalBackground.jsx) | `"*.tenxyte.io"` + logs fixes | `data.terminal.logs` |
| [Skills.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Skills.jsx) | `rackOrder = ['arch','sec','back','cloud','db','front']` | `Object.keys(racks).filter(...)` |
| [Skills.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Skills.jsx) | `fontFamily: "'Fraunces', serif"` inline | `var(--font-heading)` |
| [TenxyteArchitecture.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/TenxyteArchitecture.jsx) | `"https://tenxyte.readthedocs.io"` | `data.tenxyte.docsUrl \|\| fallback` |
| [Experience.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Experience.jsx) | `fontFamily: "'Fraunces', serif"` inline | `var(--font-heading)` |
| [Formation.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/Formation.jsx) | `fontFamily: "'Fraunces', serif"` inline | `var(--font-heading)` |

### Nouveaux fichiers

| Fichier | Rôle |
|---|---|
| [AppErrorScreen.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/AppErrorScreen.jsx) | Écran d'erreur stylé (slug + message + bouton Retry) |
| [AppSkeleton.jsx](file:///c:/Users/bobop/Documents/own/homelab/src/components/skeletons/AppSkeleton.jsx) | Squelette global avec shimmer (navbar + hero + 2 sections) |

### CSS — `src/index.css`

- `@keyframes skeleton-shimmer` ajouté
- `.skeleton-block` utilitaire ajouté (gradient animé 1.6s)

### `DecryptedText.jsx`

- `prefers-reduced-motion` détecté au module-level (stable, pas de re-render)
- Si actif → texte affiché directement sans effet scramble

---

## Vérification

| Check | Résultat |
|---|---|
| `vite build` | ✅ 0 erreurs, 84 modules |
| `useSkinData` dans `src/` | ✅ 0 occurrence |
| `"juvanio"` hardcodé dans `src/` | ✅ 0 occurrence (hors commentaires) |
| `"azerty"` dans `src/` | ✅ 0 occurrence (seulement en commentaire) |
| `tenxyte.readthedocs.io` | ✅ Uniquement dans les fallbacks `\|\|` (ApiView + TenxyteArchitecture) |
