# Audit & Roadmap : Projet "Portfolio Builder Engine"
> **Version 3.0** — Pivot vers Architecture Full-Stack / SaaS

---

## PARTIE 0 : Le Pivot Fondamental — De "Moteur Fichiers" à "Plateforme SaaS"

> Ce chapitre redefinit la nature du projet.

`data.json` et `skin.json` ne sont PAS la source de verite du systeme cible.
Ils sont des abstractions temporaires — utiles en developpement, mais destinees a etre remplacees par des donnees issues d'une base de donnees.

### Ce que change la base de donnees

| Dimension | Vision "Fichiers" | Vision "Base de donnees" |
|---|---|---|
| Source de verite | skin.json + data.json sur le serveur | Base de donnees (PostgreSQL) |
| Mise a jour du contenu | Editer un fichier + redeployer | Appel API PATCH => visible immediatement |
| Nombre de clients | 1 (un fichier = un client) | N (multi-tenancy natif) |
| Studio (editeur) | Genere un .json a telecharger | Ecrit directement en base via API |
| Deploiement | Upload du .json + rebuild | Bouton "Publier" => webhook => build/ISR |
| Assets (photos, favicon) | Fichiers locaux dans /public | S3 / Cloudinary avec URL CDN |
| Schema de validation | JSON Schema cote client | Pydantic / Zod cote serveur (source de verite) |
| data.json / skin.json | Fichiers de production | Seeds de developpement + contrats d'API |

### Schema d'architecture global

```
+------------------------------------------------------------------+
|                        SKIN STUDIO                               |
|         (SPA React -- back-office admin, auth protege)           |
|   Editeur visuel  <->  Zustand Store  <->  API Client            |
+---------------------------+--------------------------------------+
                            | REST API
                            v
+------------------------------------------------------------------+
|                      API LAYER (Backend)                         |
|          Django / NestJS / Laravel -- Auth JWT + RBAC            |
|   +-------------+  +--------------+  +------------------------+  |
|   |  /clients   |  |  /skins      |  |  /assets (S3 presign)  |  |
|   |  /sections  |  |  /publish    |  |  /i18n                 |  |
|   +-------------+  +--------------+  +------------------------+  |
+---------------------------+--------------------------------------+
                            |
           +----------------+-----------------+
           v                v                 v
+------------------+ +--------------+ +------------------+
|   PostgreSQL     | |  S3 / CDN    | |  Build Queue     |
|  (clients,skins, | |  (assets,    | |  (declenche      |
|   sections, i18n,| |   photos)    | |   rebuild SSG)   |
|   skin_history)  | |              | |                  |
+------------------+ +--------------+ +------------------+
                            |
                            v
+------------------------------------------------------------------+
|                   PORTFOLIO ENGINE (React/Vite)                  |
|          (Moteur de rendu -- agnostique du contenu)              |
|  +-------------+  +--------------+  +--------------------------+ |
|  | Registry.js |  |  App.jsx     |  |  usePortfolioData(slug)  | |
|  | (catalogue  |<-|  (boucle map |<-|  React Query --          | |
|  |  des blocs) |  |  architecture|  |  fetch skin + data API   | |
|  +-------------+  +--------------+  +--------------------------+ |
+------------------------------------------------------------------+
         Identite client resolue par subdomain ou slug :
         juvanio.portfolioengine.com  =>  SELECT WHERE slug='juvanio'
```

---

## PARTIE 1 : Audit du Projet

### 1. Etat des lieux architectural (front-end)

Application front-end React/Vite issue d'une migration recente d'un HTML monolithique vers des composants modulaires.

**Points forts :**
- Decouplage initial donnees / design (data.json / skin.json) -- ces fichiers restent valides comme contrats d'API et seeds de developpement
- Mecanisme d'injection de CSS custom properties au runtime -- directement reutilisable avec des donnees API
- Composants distincts (Hero.jsx, Skills.jsx, Experience.jsx...)
- i18n structuree (fr / en) dans data.json

**Points de friction a resoudre :**
- CSS monolithique (index.css > 2000 lignes) -- a atomiser en modules
- Squelette de page code en dur dans App.jsx -- a remplacer par une boucle pilotee par l'API
- Add-ons globaux (cursor, noise, NetworkCanvas) lies statiquement a l'arbre React
- **Aucune couche de fetching async** -- l'app lit des imports statiques, pas des appels API

### 2. Role redefini de data.json et skin.json

| Fichier | Avant | Apres |
|---|---|---|
| data.json | Source de verite de production | Seed de dev + reference du contrat API |
| skin.json | Source de verite de production | Seed de dev + reference du contrat API |
| data.schema.json | Validation cote client | Source de verite du schema API (partage front/back) |
| skin.schema.json | Validation cote client | Source de verite du schema API (partage front/back) |

En developpement local, le moteur lit les fichiers JSON. En production, le meme hook appelle l'API. La difference est invisible pour les composants.

---

## PARTIE 2 : Modele de Donnees (Base de Donnees)

### Entites principales

```sql
-- Un client = un portfolio
CREATE TABLE clients (
  id            UUID PRIMARY KEY,
  slug          VARCHAR(64) UNIQUE NOT NULL,   -- ex: "juvanio"
  subdomain     VARCHAR(64) UNIQUE,             -- ex: "juvanio.portfolioengine.com"
  custom_domain VARCHAR(255),                   -- ex: "juvanio.dev"
  plan          VARCHAR(32) DEFAULT 'free',
  default_lang  VARCHAR(8) DEFAULT 'fr',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Donnees personnelles du client (contenu de data.json)
CREATE TABLE client_data (
  id        UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  lang      VARCHAR(8) NOT NULL,               -- 'fr' | 'en'
  section   VARCHAR(64) NOT NULL,              -- 'hero' | 'skills' | 'experience'...
  content   JSONB NOT NULL,                    -- le contenu de la section
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, lang, section)
);

-- Skin actif du client (contenu de skin.json)
CREATE TABLE skins (
  id           UUID PRIMARY KEY,
  client_id    UUID REFERENCES clients(id),
  name         VARCHAR(128),
  version      VARCHAR(16),
  theme        JSONB,                           -- tokens light/dark
  tokens       JSONB,                           -- spacing, transitions, z-index...
  typography   JSONB,
  animations   JSONB,
  addons       JSONB,                           -- { customCursor: true, ... }
  architecture JSONB,                           -- tableau des sections/composants
  assets       JSONB,                           -- { heroPhoto: "url_cdn", ... }
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Historique des skins (rollback)
CREATE TABLE skin_history (
  id         UUID PRIMARY KEY,
  skin_id    UUID REFERENCES skins(id),
  snapshot   JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets uploades (photos, favicon, pdf CV...)
CREATE TABLE assets (
  id          UUID PRIMARY KEY,
  client_id   UUID REFERENCES clients(id),
  s3_key      VARCHAR(512),
  cdn_url     TEXT,
  type        VARCHAR(32),                      -- 'image' | 'pdf' | 'favicon'
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Endpoints API cibles

```
# Lecture publique (portfolio engine)
GET  /api/v1/portfolio/:slug              -> skin + data complets (caches)
GET  /api/v1/portfolio/:slug/skin         -> skin uniquement
GET  /api/v1/portfolio/:slug/data/:lang   -> data pour une langue

# Studio (JWT requis)
PATCH /api/v1/studio/:slug/skin                    -> mise a jour partielle du skin
PATCH /api/v1/studio/:slug/data/:lang/:section     -> mise a jour d'une section
POST  /api/v1/studio/:slug/publish                 -> declenche le build/ISR
POST  /api/v1/studio/:slug/assets                  -> URL presignee S3
GET   /api/v1/studio/:slug/skin/history            -> historique des versions
POST  /api/v1/studio/:slug/skin/rollback/:id       -> restaure une version
```

---

## PARTIE 3 : Roadmap Detaillee (Version Full-Stack)

---

### Phase 0 : Gouvernance du Schema & Contrats d'API
*Objectif : Definir le contrat de donnees partage entre moteur, Studio et back-end.*

1. **Schemas JSON comme source de verite unique :**
   - skin.schema.json et data.schema.json definissent la structure attendue
   - Utilises cote back-end (Pydantic / Zod), cote Studio (generation auto des formulaires), cote moteur (validation en dev)

2. **Couche d'abstraction usePortfolioData(slug) :**
   ```js
   // src/hooks/usePortfolioData.js
   export function usePortfolioData(slug) {
     if (import.meta.env.DEV) {
       // Lit les seeds locaux en dev
       return { data: localData, skin: localSkin, status: 'success' };
     }
     // Appelle l'API en production
     return useQuery(['portfolio', slug], () => fetchPortfolio(slug));
   }
   ```
   Ce hook est l'unique point d'entree des donnees dans le moteur React.
   Aucun composant ne sait si les donnees viennent d'un fichier ou d'une API.

3. **SKIN_CONTRACT.md** : documente chaque cle, son type, sa valeur par defaut, si obligatoire.

---

### Phase 1 : Consolidation du Front-End (Moteur)
*Objectif : Rendre le moteur pret a consommer des donnees API sans en connaitre la source.*

1. **Extraction exhaustive** des textes hardcodes des .jsx vers data.json / l'API.
2. **heroPhoto et favicon** references par URL CDN (ex: https://cdn.portfolioengine.com/juvanio/photo.jpg) -- plus de chemins locaux.
3. **defaultLang** expose par l'API via clients.default_lang -- pas hardcode.
4. **Gestion des etats asynchrones dans App.jsx :**
   ```jsx
   function App() {
     const slug = resolveSlugFromHostname();
     const { skin, data, status, error } = usePortfolioData(slug);
     if (status === 'loading') return <BootSequenceSkeleton />;
     if (status === 'error')  return <ErrorScreen message={error.message} />;
     return <PortfolioEngine skin={skin} data={data} />;
   }
   ```
5. **Skeleton screens** : chaque composant a un composant de squelette affiche pendant le chargement.

---

### Phase 2 : Extraction Profonde du Skin (Couche CSS)
*Objectif : Tous les tokens visuels viennent de l'API, zero valeur hardcodee en CSS.*

1. **Atomisation du CSS** : index.css => modules CSS par composant.
2. **Tokens universels complets** dans la reponse API : `spacing`, `transitions`, `z-index`, `shape` en plus des couleurs et typographie actuelles.
3. **Injection des CSS custom properties** depuis l'objet API (meme mecanique qu'actuellement, alimentee par l'API au lieu du fichier local).
4. **Genericite des durees d'animation** : `short / medium / long / xlong` au lieu de cles couplees aux noms de composants.
5. **Section addons** dans le skin API : `{ customCursor, bootSequence, noiseOverlay, networkCanvas }`.

---

### Phase 3 : Le "Component Registry" (Le Coeur du Moteur)
*Objectif : La structure de la page est dictee par skin.architecture venu de l'API.*

1. **Registry.js** : catalogue statique de tous les composants disponibles.
   ```js
   // src/registry/Registry.js
   const HeroTerminal  = React.lazy(() => import('../components/hero/HeroTerminal'));
   const HeroMinimal   = React.lazy(() => import('../components/hero/HeroMinimal'));
   const SkillsServerRack = React.lazy(() => import('../components/skills/SkillsServerRack'));
   // ...

   export const REGISTRY = {
     HeroTerminal, HeroMinimal, SkillsServerRack, SkillsRadar,
     MarqueeBar, TenxyteShowcase, ExperienceTimeline, FormationGrid, ContactTerminal,
   };
   ```

2. **App.jsx -- boucle dynamique + Lazy Loading :**
   ```jsx
   skin.architecture.map(({ id, component, props }) => {
     const Block = REGISTRY[component];
     if (!Block) return <MissingComponentFallback key={id} name={component} />;
     return (
       <Suspense key={id} fallback={<BlockSkeleton />}>
         <Block data={data} skin={skin} lang={lang} {...props} />
       </Suspense>
     );
   })
   ```

3. **Cache React Query** : reponse API mise en cache avec `staleTime: 5min`.

---

### Phase 4 : Modularisation des Animations et Interactions
*Objectif : Comportements pilotes par les props API, respectueux de l'accessibilite.*

1. **Hooks generiques :** useDecryptText, useParallax, useGlitchText, useIntersectionReveal.
2. **Activation conditionnelle** via les props de skin.architecture.
3. **prefers-reduced-motion** respecte dans tous les hooks d'animation.

---

### Phase 5 : Construction du Skin Studio (Back-Office)
*Objectif : Interface admin qui ecrit directement en base de donnees via API.*

> **Changement majeur vs v2.0** : le Studio ne genere plus un fichier .json. Il effectue des appels PATCH vers l'API. Le bouton "Exporter JSON" devient optionnel (backup uniquement).

1. **Authentification** : JWT + RBAC. Seul le proprietaire du portfolio peut acceder a /studio/:slug.

2. **Architecture du Studio :**
   - SPA React separee (ou route /studio)
   - Panneau gauche : editeur de skin (tokens, architecture, addons)
   - Panneau droit : iframe du moteur en mode preview
   - Communication iframe <-> Studio via postMessage

3. **Gestion d'etat Zustand :**
   - Chaque modification => PATCH /api/studio/:slug/skin + postMessage pour preview instantanee
   - Middleware temporal() => undo/redo (Ctrl+Z)
   - Persistance localStorage pour recuperer le travail en cours

4. **Upload d'assets** : l'API retourne une URL presignee S3. Upload direct navigateur -> S3, URL CDN enregistree en base.

5. **Bibliotheque de skins de base** : 3 skins prets (Terminal Dark, Corporate Light, Creative Minimal). Possibilite de cloner un skin existant.

6. **Bouton "Publier"** :
   - Appelle POST /api/studio/:slug/publish
   - Backend : is_published = true, published_at = NOW()
   - Snapshot dans skin_history (rollback possible)
   - Webhook vers le systeme de build

7. **Previsualisation responsive** : 375px / 768px / 100% dans l'iframe.

---

### Phase 6 : Pipeline de Deploiement & Rendu
*Objectif : Transformer un skin publie en site accessible a l'utilisateur final.*

> Completement differente de la v2.0. Plus de "telecharger un JSON". Deploiement automatise.

#### Option A : SSG avec Revalidation (Recommandee)

```
Bouton "Publier" dans le Studio
  => POST /api/studio/:slug/publish
  => Backend declenche webhook vers CI/CD (GitHub Actions / Jenkins)
  => Pipeline : GET /api/portfolio/:slug (skin + data)
  => Astro / Vite SSG genere le HTML statique du client
  => dist/ deploye sur CDN (Vercel / Netlify / S3+CloudFront)
  => Portfolio en ligne en ~30 secondes
```

Avantages : SEO natif, performance maximale (TTFB < 100ms), cout d'hebergement minimal.

#### Option B : SSR avec Cache (Alternative)

Next.js / Remix -- chaque requete appelle l'API, HTML rendu serveur et mis en cache Redis / CDN edge.
Avantage : contenu toujours frais. Inconvenient : cout serveur plus eleve.

#### Resolution du client (Multi-tenancy)

```
juvanio.portfolioengine.com  =>  slug = "juvanio"  =>  GET /api/portfolio/juvanio
alice.portfolioengine.com    =>  slug = "alice"    =>  GET /api/portfolio/alice
juvanio.dev (custom domain)  =>  lookup DNS        =>  slug = "juvanio"
```

#### Versionning des skins en base

- Chaque "Publier" cree un snapshot dans skin_history
- Studio : historique des 10 dernieres publications
- Bouton "Revenir a cette version" => POST /rollback => rebuild automatique

---

## PARTIE 4 : Structure de Fichiers (Monorepo)

```
portfolio-engine/
+-- apps/
|   +-- engine/                  <- Moteur React (Vite / Astro)
|   |   +-- src/
|   |   |   +-- components/
|   |   |   |   +-- hero/
|   |   |   |   |   +-- HeroTerminal.jsx
|   |   |   |   |   +-- HeroTerminal.module.css
|   |   |   |   +-- skills/
|   |   |   |   +-- addons/
|   |   |   +-- registry/
|   |   |   |   +-- Registry.js
|   |   |   +-- hooks/
|   |   |   |   +-- usePortfolioData.js   <- abstraction dev/prod
|   |   |   |   +-- useDecryptText.js
|   |   |   |   +-- useParallax.js
|   |   |   +-- App.jsx
|   |   +-- dev-seeds/
|   |       +-- data.json         <- seed de developpement
|   |       +-- skin.json         <- seed de developpement
|   |
|   +-- studio/                  <- Back-office admin (React SPA)
|   |   +-- src/
|   |       +-- store/           <- Zustand (skin editor state)
|   |       +-- components/      <- Panneaux editeur
|   |       +-- api/             <- Appels API studio
|   |
|   +-- api/                     <- Backend (Django / NestJS / Laravel)
|       +-- clients/
|       +-- skins/
|       +-- assets/
|       +-- publish/
|
+-- packages/
    +-- schemas/                 <- Schemas partages (source de verite unique)
        +-- skin.schema.json
        +-- data.schema.json
        +-- SKIN_CONTRACT.md
```

---

## PARTIE 5 : Recapitulatif des Changements (v2.0 -> v3.0)

| # | Changement | Impact |
|---|---|---|
| 1 | data.json / skin.json -> seeds + contrats d'API (plus source de verite) | Architectural |
| 2 | Nouveau schema global (API Layer, DB, CDN, Build Queue) | Architectural |
| 3 | Modele de donnees SQL (clients, skins, client_data, assets, skin_history) | Architectural |
| 4 | usePortfolioData(slug) -- abstraction dev/prod | Architectural |
| 5 | Multi-tenancy natif -- resolution client par subdomain/slug | Architectural |
| 6 | Phase 5 Studio : PATCH API au lieu de "generer un JSON" | Majeur |
| 7 | Phase 6 : pipeline webhook -> build SSG au lieu de "telecharger" | Majeur |
| 8 | Assets -> S3 / CDN au lieu de fichiers locaux | Majeur |
| 9 | Auth JWT + RBAC pour le Studio | Majeur |
| 10 | skin_history -> undo/rollback des publications | Confort |
| 11 | Monorepo (apps/engine, apps/studio, apps/api, packages/schemas) | Confort |
| 12 | Endpoints API definis (GET portfolio, PATCH skin, POST publish...) | Confort |