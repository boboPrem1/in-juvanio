# Phase 0 — Gouvernance du Schéma & Contrats d'API ✅

> **Portfolio Builder Engine v3.0** — Implémentation complète

---

## Ce qui a été fait

### Structure créée

```
homelab/
├── packages/
│   └── schemas/                        ← [NEW] Source de vérité unique
│       ├── skin.schema.json            ← [NEW] Schéma JSON complet du skin
│       ├── data.schema.json            ← [NEW] Schéma JSON complet des données
│       ├── SKIN_CONTRACT.md            ← [NEW] Documentation humaine de chaque clé
│       └── skin.zod.ts                 ← [NEW] Schémas Zod (Studio TypeScript Phase 5)
├── apps/
│   ├── engine/
│   │   └── dev-seeds/                  ← [NEW] Seeds de développement
│   │       ├── skin.json               ← [NEW] Skin v3 normalisé (decryptedText: short/medium/long/xlong)
│   │       └── data.json               ← [MOVED] Copie depuis public/data.json
│   └── api/
│       └── schemas/                    ← [NEW] Modèles Python/Pydantic
│           ├── skin_schema.py          ← [NEW] SkinSchema + SkinPatchSchema
│           └── data_schema.py          ← [NEW] PortfolioDataSchema + sous-modèles
├── src/
│   ├── hooks/
│   │   └── usePortfolioData.js         ← [REWRITTEN] Hook unifié (remplace usePortfolioData + useSkinData)
│   ├── lib/
│   │   └── validateSeed.js             ← [NEW] Validation AJV au démarrage dev
│   ├── App.jsx                         ← [UPDATED] Utilise le hook unifié
│   └── main.jsx                        ← [UPDATED] QueryClientProvider + validateDevSeeds
├── .env.development                    ← [NEW] VITE_DEV_SLUG=juvanio
└── .env.production                     ← [NEW] VITE_API_BASE_URL=https://api...
```

---

## Livrables — Checklist DoD

| Livrable | Status | Notes |
|---|---|---|
| `packages/schemas/skin.schema.json` | ✅ | Valide contre skin.json (0 erreur) |
| `packages/schemas/data.schema.json` | ✅ | Valide contre data.json (0 erreur) |
| `packages/schemas/SKIN_CONTRACT.md` | ✅ | Toutes les clés documentées |
| `packages/schemas/skin.zod.ts` | ✅ | Studio TypeScript Phase 5 |
| `apps/engine/dev-seeds/skin.json` | ✅ | Skin v3 avec `decryptedText.short/medium/long/xlong` |
| `apps/engine/dev-seeds/data.json` | ✅ | Copié depuis `public/data.json` |
| `apps/api/schemas/skin_schema.py` | ✅ | `SkinSchema` + `SkinPatchSchema` Pydantic |
| `apps/api/schemas/data_schema.py` | ✅ | `PortfolioDataSchema` + sous-modèles |
| `usePortfolioData(slug)` | ✅ | Retourne `{ skin, data, status, error, isLoading }` |
| `usePortfolioData` DEV | ✅ | Lit les seeds locaux, status='success' immédiat |
| `usePortfolioData` PROD | ✅ | Appelle `/api/v1/portfolio/:slug` via React Query |
| `normalizeSkin()` | ✅ | Migre `decryptedText` ancien format → `short/medium/long/xlong` |
| `resolveSlugFromHostname()` | ✅ | `localhost` → `VITE_DEV_SLUG`, subdomain → slug |
| `validateDevSeeds()` | ✅ | S'exécute au démarrage dev, log les erreurs AJV |
| `.env.development` | ✅ | `VITE_DEV_SLUG=juvanio`, `VITE_API_BASE_URL` |
| `npm run dev` | ✅ | Démarre sans erreur (Vite 8.0.14) |
| Aucun composant n'importe skin/data directement | ✅ | `useSkinData.js` deprecated, seul le hook est utilisé |

---

## Décisions techniques

### Paths adaptés au monorepo progressif
Le plan référençait `apps/engine/src/hooks/` mais le projet est encore à la racine. Le hook a donc été placé à `src/hooks/usePortfolioData.js` avec les imports relatifs ajustés (`../../apps/engine/dev-seeds/`). La migration dans `apps/engine/` est prévue Phase 1+.

### Pas de top-level await dans le hook
Pour une compatibilité maximale avec Vite, les seeds JSON sont importés statiquement (Vite's dead-code elimination les exclut du bundle prod grâce à `if (import.meta.env.DEV)`).

### `useSkinData.js` conservé mais non utilisé
Le fichier `src/hooks/useSkinData.js` n'a pas été supprimé pour éviter de casser d'éventuelles branches en cours. Il peut être supprimé en Phase 1.

### Seeds publics conservés
`public/skin.json`, `public/skin2.json` et `public/data.json` sont conservés pour éviter de casser l'état actuel. Les seeds canoniques sont maintenant dans `apps/engine/dev-seeds/`.

---

## Dépendances installées

```bash
npm install @tanstack/react-query ajv ajv-formats
# → 7 packages ajoutés
```

---

## Comment vérifier

1. Ouvrir `http://localhost:5175/` — l'app se charge normalement
2. Dans la **console du navigateur** :
   - `[PortfolioEngine] ✅ Seeds valides — skin.json + data.json (0 erreur AJV)`
3. Si les seeds sont invalides, les erreurs AJV apparaissent en rouge avec le chemin exact

---

## Prochaine étape : Phase 1

Voir `all_plans_1.md` — Intégration React Query complète, API endpoints, migration des composants.
