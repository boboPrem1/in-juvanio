# Phase 1 — Consolidation du Front-End (Moteur)
> **Portfolio Builder Engine v3.0** — Document d'implémentation complet  
> Prérequis : Phase 0 terminée (hook `usePortfolioData` créé, seeds dans `dev-seeds/`)

---

## Objectif & Périmètre

Rendre le moteur React **agnostique de la source de données** : aucun composant ne doit
connaître la différence entre un fichier JSON local et une réponse API. Aucun texte, URL,
nom ou valeur métier ne doit être écrit en dur dans un `.jsx`.

**Ce que Phase 1 corrige dans le code existant :**

| Fichier | Problème actuel | Solution Phase 1 |
|---|---|---|
| `usePortfolioData.js` | `fetch('/data.json')`, pas de slug, cache module-level | Remplacé par le hook Phase 0 |
| `useSkinData.js` | `fetch('/skin2.json')`, cache module-level | Supprimé — fusionné dans le hook Phase 0 |
| `App.jsx` | Deux hooks séparés, `language='fr'` hardcodé, loading basique | Un seul hook, `defaultLang` depuis API, skeletons |
| `Hero.jsx` | Nom "Amouzougan Kangni Juvanio" en dur (3 `<span>`), `"azerty.jpg"` fallback | Nom depuis `data.meta.name`, photo depuis `skin.assets.heroPhoto` |
| `Contact.jsx` | `"juvanio@secure-node ~ /contact"` hardcodé | Terminal title depuis `data.meta` |
| `ApiView.jsx` | `"/api/v1/juvanio/profile"` hardcodé | Endpoint depuis slug résolu |
| `BootSequence.jsx` | Contenu Tenxyte-spécifique + `"juvanio.node"` hardcodé | Lignes depuis `data`, nœud depuis `data.meta.name` |
| `Marquee.jsx` | 26 items tech stack hardcodés (dupliqués) | Items depuis `data` |
| `TerminalBackground.jsx` | `"*.tenxyte.io"` hardcodé dans les logs | Logs depuis `data` ou `skin` |
| `Skills.jsx` | `rackOrder` hardcodé `['arch','sec','back','cloud','db','front']` | Ordre depuis `Object.keys(racks)` ou `skin.architecture` |
| `TenxyteArchitecture.jsx` | `"https://tenxyte.readthedocs.io"` hardcodé | URL depuis `data.tenxyte` |
| `Experience.jsx` | `fontFamily: "'Fraunces', serif"` inline | Variable CSS `var(--font-heading)` |
| `DecryptedText.jsx` | Props nommées couplées (heroTag, heroTitle…) | Normalisées via `anims.medium` etc. |

**Durée estimée : 3–5 jours**

---

## Cartographie exhaustive des hardcodes à extraire

Avant de toucher au code, voici le recensement complet fichier par fichier.

### Hero.jsx — 4 hardcodes
```jsx
// ❌ LIGNE 723-727 — Nom hardcodé en 3 spans
<span className="line1">Amouzougan</span>
<span className="line2">Kangni</span>
<span className="line3">Juvanio</span>

// ❌ LIGNE 750 — Fallback photo hardcodé
<img src={skin?.assets?.heroPhoto || "azerty.jpg"} alt={meta.name} />

// ❌ LIGNE 729 — anims.heroTag (ancienne clé nommée, doit utiliser short/medium/long)
duration={anims.heroTag || 600}

// ❌ LIGNE 733 — fontFamily inline (contourne le système de tokens CSS)
style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}
```

### Contact.jsx — 1 hardcode
```jsx
// ❌ LIGNE 218 — Slug "juvanio" et nom de domaine hardcodés
<span className="contact-terminal-title">juvanio@secure-node ~ /contact</span>
```

### ApiView.jsx — 1 hardcode
```jsx
// ❌ LIGNE 106 — Endpoint hardcodé avec slug "juvanio"
<div className="api-endpoint"><span className="method">GET</span> /api/v1/juvanio/profile</div>
```

### BootSequence.jsx — 2 hardcodes
```jsx
// ❌ LIGNE 139 — "juvanio.node" hardcodé
<span className="ok">ACCESS GRANTED</span> — Welcome to <span className="ok">juvanio.node</span>

// ❌ LIGNES 131-139 — Tout le contenu (lignes de boot) est Tenxyte-spécifique et hardcodé
// En SaaS, chaque client doit avoir ses propres lignes (ou lignes génériques paramétrées)
```

### Marquee.jsx — 26 items hardcodés
```jsx
// ❌ Tout le contenu est hardcodé et dupliqué pour l'effet CSS
// "Django", "NestJS", "Laravel", "FastAPI", etc.
// Doit venir de data.skills ou d'une nouvelle clé data.marquee
```

### TerminalBackground.jsx — 1 hardcode
```jsx
// ❌ LIGNE 1335 — Domaine Tenxyte hardcodé dans les logs
'<span style="color:var(--muted)">[DEBUG]</span> CORS — Origin allowed: *.tenxyte.io'
// Tous les logs sont Tenxyte-spécifiques
```

### Skills.jsx — 1 hardcode
```jsx
// ❌ LIGNE 1099 — Ordre des racks hardcodé
const rackOrder = ['arch', 'sec', 'back', 'cloud', 'db', 'front'];
```

### TenxyteArchitecture.jsx — 1 hardcode
```jsx
// ❌ LIGNE 1222 — URL docs hardcodée
<a href="https://tenxyte.readthedocs.io" ...>
```

### Experience.jsx — 1 hardcode
```jsx
// ❌ LIGNE 433 — Font inline au lieu de var(--font-heading)
style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}
```

### App.jsx — 3 hardcodes
```jsx
// ❌ LIGNE 1524 — defaultLang hardcodé
const [language, setLanguage] = useState('fr');

// ❌ LIGNES 1516-1518 — Deux hooks séparés (à fusionner)
const { data, loading: dataLoading, error: dataError } = usePortfolioData();
const { skin, loading: skinLoading, error: skinError } = useSkinData();

// ❌ LIGNES 1581-1615 — Loading et Error states sans design ni skeleton
```

---

## Livrable 1 — Suppression de `useSkinData.js` et migration de `App.jsx`

`useSkinData.js` est supprimé. `usePortfolioData` (Phase 0) le remplace.

### `src/App.jsx` — Version complète refactorisée

```jsx
// src/App.jsx
import { useState, useEffect, useLayoutEffect } from 'react';
import { usePortfolioData, resolveSlugFromHostname } from './hooks/usePortfolioData';
import BootSequence         from './components/BootSequence';
import CustomCursor         from './components/CustomCursor';
import Navbar               from './components/Navbar';
import ApiView              from './components/ApiView';
import Hero                 from './components/Hero';
import Marquee              from './components/Marquee';
import TenxyteArchitecture  from './components/TenxyteArchitecture';
import Skills               from './components/Skills';
import Experience           from './components/Experience';
import Formation            from './components/Formation';
import Contact              from './components/Contact';
import DecryptedText        from './components/DecryptedText';
import FooterBugs           from './components/FooterBugs';

// Skeletons (Livrable 5 — créés ci-dessous)
import AppSkeleton          from './components/skeletons/AppSkeleton';
import AppErrorScreen       from './components/AppErrorScreen';

// ─── Injection des CSS Custom Properties ─────────────────────────
// Injecte toutes les clés "--" du skin dans :root
function injectCssVariables(skin, theme) {
  if (!skin) return;
  const tokens = {
    ...(skin.theme?.[theme] || {}),
    ...(skin.typography     || {}),
    ...(skin.effects        || {}),
    // layout: on injecte seulement les clés CSS (pas heroReversed, skillsColumns)
    ...(Object.fromEntries(
      Object.entries(skin.layout || {}).filter(([k]) => k.startsWith('--'))
    )),
  };
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

// ─── Résolution du thème par défaut ──────────────────────────────
function getDefaultTheme() {
  const hour = new Date().getHours();
  return (hour >= 18 || hour < 8) ? 'dark' : 'light';
}

function App() {
  // ── Résolution slug ──────────────────────────────────────────────
  const slug = resolveSlugFromHostname();

  // ── Données (hook unique Phase 0) ────────────────────────────────
  const { skin, data, status, error } = usePortfolioData(slug);

  // ── États UI ─────────────────────────────────────────────────────
  const [apiMode, setApiMode]     = useState(false);
  const [theme, setTheme]         = useState(getDefaultTheme);

  // defaultLang vient de l'API (data.meta.defaultLang) ou 'fr'
  // Initialisé à null, mis à jour dès que data arrive
  const [language, setLanguage]   = useState(null);

  useEffect(() => {
    if (data && language === null) {
      // data.meta.defaultLang vient de l'API (clients.default_lang en prod)
      // En dev, data.json ne l'a pas encore → fallback 'fr'
      setLanguage(data.meta?.defaultLang || 'fr');
    }
  }, [data, language]);

  const toggleApiMode  = () => setApiMode(prev => !prev);
  const toggleLanguage = () => setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  const toggleTheme    = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // ── Injection CSS Custom Properties ──────────────────────────────
  // useLayoutEffect pour éviter le flash de styles non-thémés
  useLayoutEffect(() => {
    injectCssVariables(skin, theme);
  }, [theme, skin]);

  // ── Classe body pour le thème ─────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  // ── Scroll vers top en mode API ───────────────────────────────────
  useEffect(() => {
    if (apiMode) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [apiMode]);

  // ── Parallax (depuis skin.animations.parallaxFactor) ─────────────
  useEffect(() => {
    if (!skin) return;
    const factor = skin.animations?.parallaxFactor ?? 0.3;
    if (factor === 0) return; // Parallax désactivé

    const handleScroll = () => {
      const heroGrid = document.querySelector('.hero-grid');
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${window.scrollY * factor}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [skin]);

  // ── États de chargement / erreur ──────────────────────────────────
  if (status === 'loading' || language === null) {
    return <AppSkeleton theme={theme} />;
  }

  if (status === 'error') {
    return <AppErrorScreen message={error?.message} slug={slug} theme={theme} />;
  }

  // ── Rendu principal ───────────────────────────────────────────────
  const footer    = data.footer[language] || data.footer.fr;
  const isCustomCursor = skin?.cursor?.type === 'custom' ||
                         skin?.addons?.customCursor === true;

  return (
    <>
      {/* Add-ons conditionnels (contrôlés par skin.addons) */}
      {(skin?.addons?.bootSequence !== false) && (
        <BootSequence data={data} skin={skin} />
      )}
      {isCustomCursor && (
        <CustomCursor cursorData={skin.cursor} />
      )}

      <Navbar
        apiMode={apiMode}
        toggleApiMode={toggleApiMode}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        navData={data.navbar[language] || data.navbar.fr}
      />

      <ApiView apiMode={apiMode} language={language} data={data} slug={slug} />

      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          <Hero       language={language} data={data} skin={skin} />
          <Marquee    data={data} />
          <TenxyteArchitecture language={language} data={data} skin={skin} />
          <Skills     language={language} data={data} skin={skin} />
          <Experience language={language} data={data} skin={skin} />
          <Formation  language={language} data={data} skin={skin} />
          <Contact    language={language} data={data} skin={skin} />
        </main>

        <footer style={{ position: 'relative', overflow: 'hidden' }}>
          <FooterBugs />
          <span style={{ position: 'relative', zIndex: 1 }}>{footer.copyright}</span>
          <span style={{ position: 'relative', zIndex: 1 }}>
            <DecryptedText text={footer.role} /> · {' '}
            <a
              href={data.meta.contact.github}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              GitHub
            </a>
          </span>
          <span style={{ position: 'relative', zIndex: 1 }}>
            <DecryptedText text={footer.location} />
          </span>
        </footer>
      </div>
    </>
  );
}

export default App;
```

**Changements clés vs l'existant :**
- `useSkinData` supprimé → `usePortfolioData(slug)` unique
- `language` initialisé à `null` → mis à jour depuis `data.meta.defaultLang` une fois chargé
- `injectCssVariables` factoriser hors du composant (plus propre, testable)
- `factor === 0` coupe le scroll listener (performance)
- `BootSequence` et `CustomCursor` conditionnels via `skin.addons`
- `ApiView` reçoit le `slug` (pour l'endpoint dynamique)
- `Marquee` reçoit `data` (items dynamiques)

---

## Livrable 2 — `data.json` : ajout des clés manquantes

Pour couvrir tous les hardcodes, deux nouvelles clés doivent être ajoutées au seed `dev-seeds/data.json`.

### `data.meta` — Ajouter `defaultLang` et `slug`
```json
{
  "meta": {
    "slug": "juvanio",
    "defaultLang": "fr",
    "name": "Amouzougan Kangni Juvanio",
    "nameLines": ["Amouzougan", "Kangni", "Juvanio"],
    "nodeName": "juvanio.node",
    "terminalUser": "juvanio@secure-node",
    "available": true,
    "contact": { ... }
  }
}
```

- `slug` : utilisé par `ApiView` pour l'endpoint dynamique
- `defaultLang` : langue par défaut de ce portfolio (`"fr"` ou `"en"`)
- `nameLines` : tableau de 1 à N lignes pour le nom héro (générique, pas forcément 3 lignes)
- `nodeName` : utilisé par `BootSequence` (`"juvanio.node"`)
- `terminalUser` : utilisé par `Contact.jsx` (`"juvanio@secure-node"`)

### `data.marquee` — Nouvelle clé pour Marquee
```json
{
  "marquee": {
    "items": [
      "Django", "NestJS", "Laravel", "FastAPI", "React.js",
      "PostgreSQL", "Docker", "AWS", "CI/CD", "OWASP",
      "ISO 27001", "DDD", "Clean Architecture"
    ]
  }
}
```

### `data.boot` — Lignes de BootSequence paramétrées
```json
{
  "boot": {
    "lines": [
      { "delay": 100, "type": "info",  "text": "Initializing Secure Environment..." },
      { "delay": 200, "type": "dim",   "text": "Loading kernel modules — TLS 1.3, AES-256" },
      { "delay": 180, "type": "ok",    "text": "Auth Engine (JWT · RBAC · 2FA)" },
      { "delay": 200, "type": "ok",    "text": "AIRS Module — AI Responsibility & Security" },
      { "delay": 160, "type": "ok",    "text": "Database adapters (PostgreSQL · MongoDB · MySQL)" },
      { "delay": 220, "type": "warn",  "text": "Running OWASP compliance checks..." },
      { "delay": 180, "type": "pass",  "text": "All 2,300+ tests green" },
      { "delay": 200, "type": "ok",    "text": "Deploying to production — CI/CD pipeline" }
    ],
    "accessGrantedSuffix": "Welcome to"
  }
}
```

### `data.tenxyte` — Ajouter `docsUrl`
```json
{
  "tenxyte": {
    "docsUrl": "https://tenxyte.readthedocs.io",
    "fr": { ... },
    "en": { ... }
  }
}
```

### `data.terminal` — Logs du TerminalBackground (optionnel)
```json
{
  "terminal": {
    "logs": [
      { "level": "INFO",  "color": "accent",  "text": "Auth.JWT — Token issued for user_8a3f" },
      { "level": "DEBUG", "color": "muted",   "text": "RBAC — Role check: admin → ALLOW" },
      { "level": "INFO",  "color": "accent",  "text": "AIRS.Sentinel — Prompt scan: CLEAN" },
      { "level": "WARN",  "color": "accent3", "text": "RateLimit — Intent \"delete\" near threshold" },
      { "level": "INFO",  "color": "accent",  "text": "CI/CD — Pipeline #847 passed (2,312 tests)" },
      { "level": "DEBUG", "color": "muted",   "text": "CORS — Origin allowed: *.portfolioengine.com" }
    ]
  }
}
```

---

## Livrable 3 — Composants : corrections fichier par fichier

### `Hero.jsx` — Nom dynamique + photo CDN + clés anims normalisées

```jsx
// src/components/Hero.jsx
import NetworkCanvas     from './NetworkCanvas';
import TerminalBackground from './TerminalBackground';
import DecryptedText     from './DecryptedText';

export default function Hero({ language, data, skin }) {
  const t      = data.hero[language]   || data.hero.fr;
  const meta   = data.meta;
  // ✅ Clés normalisées (Phase 0 : short/medium/long/xlong)
  const anims  = skin?.animations?.decryptedText || {};
  const isReversed = skin?.layout?.heroReversed || false;

  // ✅ nameLines depuis data.meta (tableau générique)
  const nameLines = meta.nameLines || [meta.name];

  // ✅ Photo depuis skin.assets (URL CDN en prod, chemin local en dev)
  //    Pas de fallback hardcodé — si absent, pas d'img rendu
  const heroPhoto = skin?.assets?.heroPhoto;

  return (
    <section
      className="hero"
      id="about"
      style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}
    >
      <div className="hero-grid" />
      <NetworkCanvas />

      <div className="hero-left" style={{ flex: 1, width: '50%' }}>
        {/* ✅ Clés normalisées : medium au lieu de heroTag */}
        <div className="hero-tag">
          <DecryptedText text={t.tag} duration={anims.medium} />
        </div>

        {/* ✅ Nom dynamique depuis data.meta.nameLines */}
        <h1 className="hero-name">
          {nameLines.map((line, i) => (
            <span key={i} className={`line${i + 1}`}>{line}</span>
          ))}
        </h1>

        <p className="hero-title">
          <DecryptedText text={t.title}       duration={anims.long} /><br />
          <span>{t.positioning}</span><br />
          <DecryptedText text={t.founder}     duration={anims.short} />{' '}
          <span>Tenxyte</span> — {' '}
          <DecryptedText text={t.framework}   duration={anims.medium} /><br /><br />
          <DecryptedText text={t.desc}        duration={anims.long} />{' '}
          <span style={{ color: 'var(--accent2)' }}>
            <DecryptedText text={t.leadership} duration={anims.medium} />
          </span>.
        </p>

        <div className="hero-cta">
          <a href={`mailto:${meta.contact.email}`} className="btn btn-primary">
            <DecryptedText text={t.contactBtn} duration={anims.short} />
          </a>
          {/* ✅ CV depuis skin.assets.cvPdf (URL CDN) ou data.meta.contact.cv */}
          <a
            href={skin?.assets?.cvPdf || meta.contact.cv}
            download
            className="btn btn-ghost"
          >
            <DecryptedText text={t.cvBtn} duration={anims.short} />
          </a>
          <a href="#experience" className="btn btn-ghost">
            <DecryptedText text={t.expBtn} duration={anims.short} />
          </a>
        </div>
      </div>

      <div className="hero-right" style={{ flex: 1, width: '50%' }}>
        <div className="hero-visual">
          <TerminalBackground data={data} />
          <div className="data-ring data-ring-1"><div className="data-packet" /></div>
          <div className="data-ring data-ring-2"><div className="data-packet" /></div>
          <div className="data-ring data-ring-3"><div className="data-packet" /></div>
          {/* ✅ Photo conditionnelle — pas de fallback hardcodé */}
          {heroPhoto && (
            <div className="hero-photo-frame">
              <img src={heroPhoto} alt={meta.name} />
            </div>
          )}
        </div>
      </div>

      <a href="#tenxyte" className="hero-scroll" style={{ textDecoration: 'none' }}>
        <DecryptedText text={t.scroll} duration={anims.short} />
      </a>
    </section>
  );
}
```

---

### `Contact.jsx` — Terminal user depuis `data.meta`

```jsx
// src/components/Contact.jsx — Changement minimal ciblé
// Remplacer la ligne hardcodée (ligne ~218) :

// ❌ AVANT
<span className="contact-terminal-title">juvanio@secure-node ~ /contact</span>

// ✅ APRÈS
<span className="contact-terminal-title">
  {meta.terminalUser || meta.slug || 'portfolio'} ~ /contact
</span>
```

---

### `ApiView.jsx` — Endpoint dynamique depuis `slug`

```jsx
// src/components/ApiView.jsx
// Ajouter `slug` aux props : export default function ApiView({ apiMode, language, data, slug })

// ❌ AVANT (ligne ~106)
<div className="api-endpoint">
  <span className="method">GET</span> /api/v1/juvanio/profile
</div>

// ✅ APRÈS
<div className="api-endpoint">
  <span className="method">GET</span> /api/v1/{slug || data.meta.slug}/profile
</div>
```

---

### `BootSequence.jsx` — Lignes depuis `data.boot`, nœud depuis `data.meta`

```jsx
// src/components/BootSequence.jsx
import { useEffect, useState } from 'react';

// Mapping type → className CSS
const TYPE_CLASS = {
  info: 'ok',
  ok:   'ok',
  warn: 'warn',
  pass: 'ok',
  dim:  'dim',
};

export default function BootSequence({ data, skin }) {
  const [isDone, setIsDone]         = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);

  // ✅ Lignes depuis data.boot (avec fallback sur les lignes par défaut)
  const bootData = data?.boot;
  const rawLines = bootData?.lines || DEFAULT_BOOT_LINES;
  const nodeName = data?.meta?.nodeName || 'portfolio.node';
  const accessGrantedSuffix = bootData?.accessGrantedSuffix || 'Welcome to';

  // Construction des lignes React à partir des données
  const lines = [
    ...rawLines.map(({ delay, type, text }) => ({
      delay,
      content: (
        <>
          <span className="dim">[{formatTimestamp()}]</span>{' '}
          {type === 'ok'   && <span className="ok">[  OK  ]</span>}
          {type === 'warn' && <span className="warn">[SCAN ]</span>}
          {type === 'pass' && <span className="ok">[PASS ]</span>}
          {' '}<span className={TYPE_CLASS[type] || ''}>{text}</span>
        </>
      ),
    })),
    // Dernière ligne toujours dynamique (nodeName)
    {
      delay: 300,
      content: (
        <>
          <span className="dim">[1.200]</span>{' '}
          <span className="ok">ACCESS GRANTED</span> — {accessGrantedSuffix}{' '}
          <span className="ok">{nodeName}</span>
          <span className="boot-cursor" />
        </>
      ),
    },
  ];

  useEffect(() => {
    let timeoutId;
    const playSequence = (index) => {
      if (index >= lines.length) {
        setTimeout(() => setIsDone(true), 400);
        return;
      }
      setCurrentLine(index);
      timeoutId = setTimeout(() => playSequence(index + 1), lines[index].delay);
    };
    timeoutId = setTimeout(() => playSequence(0), 300);
    return () => clearTimeout(timeoutId);
  }, []);

  if (isDone) return null;

  const progressWidth =
    currentLine === -1 ? 0 : ((currentLine + 1) / lines.length) * 100;

  return (
    <div className="boot-overlay" id="bootOverlay">
      {lines.map((line, index) => (
        <div
          key={index}
          className="boot-line"
          style={{
            opacity:   index <= currentLine ? 1 : 0,
            transform: index <= currentLine ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
        >
          {line.content}
        </div>
      ))}
      <div
        className="boot-progress"
        style={{ opacity: currentLine >= 0 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <div
          className="boot-progress-fill"
          style={{ width: `${progressWidth}%`, transition: 'width 0.2s' }}
        />
      </div>
    </div>
  );
}

// Timestamps pseudo-réalistes (fonction pure, pas de state)
let _ts = 0;
function formatTimestamp() {
  _ts += Math.random() * 0.2 + 0.1;
  return `${_ts.toFixed(3).padStart(9, ' ')}`;
}

// Fallback si data.boot absent (compatibilité dev seeds v2)
const DEFAULT_BOOT_LINES = [
  { delay: 100, type: 'info',  text: 'Initializing Secure Environment...' },
  { delay: 200, type: 'dim',   text: 'Loading kernel modules — TLS 1.3, AES-256' },
  { delay: 180, type: 'ok',    text: 'Auth Engine (JWT · RBAC · 2FA)' },
  { delay: 200, type: 'ok',    text: 'AIRS Module — AI Responsibility & Security' },
  { delay: 160, type: 'ok',    text: 'Database adapters (PostgreSQL · MongoDB · MySQL)' },
  { delay: 220, type: 'warn',  text: 'Running OWASP compliance checks...' },
  { delay: 180, type: 'pass',  text: 'All 2,300+ tests green' },
  { delay: 200, type: 'ok',    text: 'Deploying to production — CI/CD pipeline' },
];
```

---

### `Marquee.jsx` — Items depuis `data.marquee`

```jsx
// src/components/Marquee.jsx
export default function Marquee({ data }) {
  // ✅ Items depuis data.marquee.items (avec fallback vide)
  const items = data?.marquee?.items || [];

  // On duplique pour l'effet CSS de défilement infini
  const doubled = [...items, ...items];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
```

---

### `TerminalBackground.jsx` — Logs depuis `data.terminal`

```jsx
// src/components/TerminalBackground.jsx
import { useEffect, useRef } from 'react';

// Fallback si data.terminal absent
const DEFAULT_LOGS = [
  { level: 'INFO',  color: 'accent',  text: 'Auth.JWT — Token issued for user_8a3f' },
  { level: 'DEBUG', color: 'muted',   text: 'RBAC — Role check: admin → ALLOW' },
  { level: 'INFO',  color: 'accent',  text: 'AIRS.Sentinel — Prompt scan: CLEAN' },
  { level: 'DEBUG', color: 'muted',   text: 'DB.Pool — Connection acquired (pg:5432)' },
  { level: 'INFO',  color: 'accent',  text: 'API.Gateway — POST /auth/login 200 12ms' },
  { level: 'WARN',  color: 'accent3', text: 'RateLimit — Intent "delete" near threshold' },
  { level: 'INFO',  color: 'accent',  text: 'WebAuthn — Credential verified OK' },
  { level: 'DEBUG', color: 'muted',   text: 'Cache.Redis — HIT session:a8f3e1' },
  { level: 'INFO',  color: 'accent',  text: 'AIRS.AuditTrail — Action logged: ai_query' },
  { level: 'INFO',  color: 'accent',  text: 'CI/CD — Pipeline #847 passed (2,312 tests)' },
];

// Construit le HTML d'une ligne de log à partir de l'objet data
function buildLogHtml(log) {
  const levelPad = log.level.padEnd(5, ' ');
  return `<span style="color:var(--${log.color})">[${levelPad}]</span> ${log.text}`;
}

export default function TerminalBackground({ data }) {
  const scrollRef = useRef(null);

  // ✅ Logs depuis data.terminal.logs (avec fallback)
  const logs = (data?.terminal?.logs || DEFAULT_LOGS).map(buildLogHtml);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let index = 0;
    let timeoutId;

    // Remplissage initial
    for (let i = 0; i < Math.min(15, logs.length); i++) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logs[i % logs.length];
      el.appendChild(line);
      index++;
    }
    el.scrollTop = el.scrollHeight;

    const addLog = () => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logs[index % logs.length];
      line.style.cssText = 'opacity:0;transform:translateY(10px);transition:all 0.4s cubic-bezier(0.4,0,0.2,1)';
      el.appendChild(line);
      void line.offsetWidth;
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
      el.scrollTop = el.scrollHeight;
      if (el.children.length > 30) el.removeChild(el.firstChild);
      index++;
      timeoutId = setTimeout(addLog, Math.random() * 800 + 200);
    };

    timeoutId = setTimeout(addLog, 1000);
    return () => clearTimeout(timeoutId);
  }, [logs]);

  return (
    <div className="hero-terminal-bg">
      <div className="terminal-scroll" id="terminalScroll" ref={scrollRef} />
    </div>
  );
}
```

---

### `Skills.jsx` — Ordre des racks dynamique

```jsx
// src/components/Skills.jsx
// Remplacer la ligne hardcodée (ligne ~1099) :

// ❌ AVANT
const rackOrder = ['arch', 'sec', 'back', 'cloud', 'db', 'front'];

// ✅ APRÈS — Ordre depuis les clés du JSON (préserve l'ordre d'insertion)
// Exclure 'lang' et 'hobbies' qui ont un rendu spécial (card à span 2)
const SPECIAL_RACKS = ['lang', 'hobbies'];
const rackOrder = Object.keys(racks).filter(k => !SPECIAL_RACKS.includes(k));

// Note: si on veut un ordre personnalisé depuis skin.architecture en Phase 3,
// rackOrder sera fourni par le skin. En Phase 1, Object.keys() suffit.
```

---

### `TenxyteArchitecture.jsx` — URL docs depuis `data`

```jsx
// src/components/TenxyteArchitecture.jsx
// Remplacer href hardcodé (ligne ~1222) :

// ❌ AVANT
<a href="https://tenxyte.readthedocs.io" target="_blank" rel="noreferrer" className="btn btn-ghost">

// ✅ APRÈS — URL depuis data (clé non-i18n car même URL dans les deux langues)
<a href={data.tenxyte.docsUrl || 'https://tenxyte.readthedocs.io'} target="_blank" rel="noreferrer" className="btn btn-ghost">
```

---

### `Experience.jsx` — Font depuis variable CSS

```jsx
// src/components/Experience.jsx — Ligne ~433

// ❌ AVANT
<em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}>

// ✅ APRÈS — var(--font-heading) injecté depuis skin.typography
<em style={{fontFamily: 'var(--font-heading)', color: 'var(--accent)'}}>
```

Même correction dans `Formation.jsx` (ligne ~646) et `Skills.jsx` (ligne ~1108).

---

### `DecryptedText.jsx` — Respect de `prefers-reduced-motion`

Phase 4 couvre les hooks d'animation, mais une amélioration mineure s'applique dès Phase 1 :

```jsx
// src/components/DecryptedText.jsx
import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ✅ Détecté une seule fois au module level (stable)
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    // ✅ Pas d'animation si l'utilisateur a désactivé les animations
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let intervalId;
    const startTime = Date.now();

    const tick = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * text.length);

      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved)  return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);
      if (progress >= 1) clearInterval(intervalId);
    };

    intervalId = setInterval(tick, speed);
    return () => clearInterval(intervalId);
  }, [text, speed, duration]);

  return <span>{displayText}</span>;
}
```

---

## Livrable 4 — Gestion des états asynchrones dans `App.jsx`

### `AppErrorScreen.jsx` — Écran d'erreur stylé

```jsx
// src/components/AppErrorScreen.jsx
export default function AppErrorScreen({ message, slug, theme }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: theme === 'dark' ? '#080a0f' : '#f8fafc',
        color: theme === 'dark' ? '#ff4d6d' : '#be123c',
        fontFamily: "'DM Mono', monospace",
        gap: '16px',
        padding: '32px',
      }}
    >
      <div style={{ fontSize: '11px', letterSpacing: '3px', opacity: 0.5 }}>
        PORTFOLIO ENGINE — ERROR
      </div>
      <div style={{ fontSize: '13px', letterSpacing: '1px' }}>
        Failed to load portfolio: <strong>{slug}</strong>
      </div>
      {message && (
        <div style={{
          fontSize: '11px',
          opacity: 0.6,
          background: 'rgba(255,77,109,0.08)',
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid rgba(255,77,109,0.2)',
        }}>
          {message}
        </div>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '16px',
          padding: '8px 24px',
          background: 'transparent',
          border: '1px solid currentColor',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: '11px',
          letterSpacing: '2px',
          cursor: 'pointer',
        }}
      >
        RETRY
      </button>
    </div>
  );
}
```

---

## Livrable 5 — Skeleton Screens

Un squelette par section. Principe : **même structure HTML que le vrai composant, sans contenu**,
avec un effet shimmer CSS. Affichés pendant le chargement (status === 'loading').

### CSS Shimmer — Ajouter à `index.css`

```css
/* ── Skeleton shimmer ─────────────────────────────────────────── */
@keyframes skeleton-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}

.skeleton-block {
  background: linear-gradient(
    90deg,
    var(--surface2) 25%,
    var(--surface)  50%,
    var(--surface2) 75%
  );
  background-size: 1200px 100%;
  animation: skeleton-shimmer 1.6s infinite linear;
  border-radius: var(--border-radius-base, 4px);
}
```

### `src/components/skeletons/AppSkeleton.jsx` — Squelette global

```jsx
// src/components/skeletons/AppSkeleton.jsx
// Affiché pendant status === 'loading' || language === null
// Reproduit la structure Nav + Hero + sections

export default function AppSkeleton({ theme }) {
  const bg      = theme === 'dark' ? '#080a0f' : '#f8fafc';
  const surface = theme === 'dark' ? '#0d1017' : '#ffffff';

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      {/* Navbar skeleton */}
      <div style={{
        height: '60px',
        borderBottom: '1px solid rgba(128,128,128,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: '32px',
      }}>
        {[80, 70, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            className="skeleton-block"
            style={{ width: w, height: 12, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* Hero skeleton */}
      <HeroSkeleton />

      {/* Sections minimales */}
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section style={{
      display: 'flex',
      padding: '120px 64px',
      gap: '64px',
      minHeight: '80vh',
      alignItems: 'center',
    }}>
      {/* Left col */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton-block" style={{ width: 200, height: 14 }} />
        <div className="skeleton-block" style={{ width: 320, height: 48 }} />
        <div className="skeleton-block" style={{ width: 280, height: 48 }} />
        <div className="skeleton-block" style={{ width: 240, height: 48 }} />
        <div className="skeleton-block" style={{ width: '80%', height: 12, marginTop: 16 }} />
        <div className="skeleton-block" style={{ width: '65%', height: 12 }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: 24 }}>
          <div className="skeleton-block" style={{ width: 140, height: 44, borderRadius: 4 }} />
          <div className="skeleton-block" style={{ width: 120, height: 44, borderRadius: 4 }} />
          <div className="skeleton-block" style={{ width: 130, height: 44, borderRadius: 4 }} />
        </div>
      </div>
      {/* Right col — photo frame */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          className="skeleton-block"
          style={{ width: 360, height: 420, borderRadius: 8 }}
        />
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section style={{ padding: '80px 64px', borderTop: '1px solid rgba(128,128,128,0.08)' }}>
      <div className="skeleton-block" style={{ width: 100, height: 11, marginBottom: 24 }} />
      <div className="skeleton-block" style={{ width: 280, height: 40, marginBottom: 8 }} />
      <div className="skeleton-block" style={{ width: 220, height: 40, marginBottom: 40 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-block"
            style={{ height: 180, borderRadius: 4 }}
          />
        ))}
      </div>
    </section>
  );
}
```

### Skeletons individuels (pour les futures phases avec chargement par section)

```jsx
// src/components/skeletons/HeroSkeleton.jsx — standalone, réutilisable
// src/components/skeletons/SkillsSkeleton.jsx
// src/components/skeletons/ExperienceSkeleton.jsx
// src/components/skeletons/ContactSkeleton.jsx
// (même pattern que ci-dessus, adaptés à la structure de chaque section)
```

---

## Livrable 6 — Suppression de `useSkinData.js`

```bash
# Supprimer le fichier
rm src/hooks/useSkinData.js

# Vérifier qu'aucun import ne reste
grep -r "useSkinData" src/
# Doit retourner 0 résultat
```

---

## Livrable 7 — `main.jsx` mis à jour

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';

// Validation des seeds en dev (défini en Phase 0)
if (import.meta.env.DEV) {
  import('./lib/validateSeed.js').then(({ validateDevSeeds }) => validateDevSeeds());
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
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

---

## Livrable 8 — Ordre d'exécution et instructions Git

### Ordre de travail recommandé (ne pas mélanger)

```
Étape 1  : Ajouter les nouvelles clés dans dev-seeds/data.json
           (meta.slug, meta.nameLines, meta.terminalUser, meta.nodeName,
            meta.defaultLang, marquee, boot, terminal, tenxyte.docsUrl)

Étape 2  : Supprimer useSkinData.js
           Mettre à jour usePortfolioData.js (hook Phase 0 avec signature slug)

Étape 3  : Mettre à jour main.jsx (QueryClientProvider)

Étape 4  : Mettre à jour App.jsx (logique language, skeletons, hook unique)

Étape 5  : Hero.jsx — nom dynamique, photo conditionnelle, clés anims

Étape 6  : Contact.jsx — terminalUser dynamique

Étape 7  : ApiView.jsx — slug dynamique

Étape 8  : BootSequence.jsx — lignes depuis data.boot

Étape 9  : Marquee.jsx — items depuis data.marquee

Étape 10 : TerminalBackground.jsx — logs depuis data.terminal

Étape 11 : Skills.jsx — rackOrder dynamique

Étape 12 : TenxyteArchitecture.jsx — docsUrl depuis data

Étape 13 : Experience.jsx + Formation.jsx — var(--font-heading)

Étape 14 : DecryptedText.jsx — prefers-reduced-motion

Étape 15 : Créer AppSkeleton.jsx + AppErrorScreen.jsx

Étape 16 : Lancer npm run dev — valider que tout fonctionne avec les seeds
```

### Convention de commits

```bash
git commit -m "feat(phase1): merge useSkinData into usePortfolioData"
git commit -m "feat(phase1): dynamic defaultLang from data.meta"
git commit -m "feat(phase1): extract hero name lines from data.meta.nameLines"
git commit -m "feat(phase1): dynamic boot sequence from data.boot"
git commit -m "feat(phase1): dynamic marquee items from data.marquee"
git commit -m "feat(phase1): dynamic terminal logs from data.terminal"
git commit -m "feat(phase1): remove all hardcoded slugs (contact, apiview)"
git commit -m "feat(phase1): skeleton screens (AppSkeleton, AppErrorScreen)"
git commit -m "feat(phase1): prefers-reduced-motion in DecryptedText"
git commit -m "feat(phase1): css var(--font-heading) replaces inline fontFamily"
```

---

## Checklist — Définition of Done (Phase 1)

```
SEEDS
[ ] data.meta.slug ajouté              ("juvanio")
[ ] data.meta.defaultLang ajouté       ("fr")
[ ] data.meta.nameLines ajouté         (["Amouzougan","Kangni","Juvanio"])
[ ] data.meta.terminalUser ajouté      ("juvanio@secure-node")
[ ] data.meta.nodeName ajouté          ("juvanio.node")
[ ] data.marquee ajouté                ({ items: [...] })
[ ] data.boot ajouté                   ({ lines: [...], accessGrantedSuffix })
[ ] data.terminal ajouté               ({ logs: [...] })
[ ] data.tenxyte.docsUrl ajouté        ("https://tenxyte.readthedocs.io")

HOOKS & ARCHITECTURE
[ ] useSkinData.js supprimé            (0 import restant : grep -r "useSkinData" src/)
[ ] usePortfolioData accepte (slug)    (signature mise à jour depuis Phase 0)
[ ] App.jsx utilise un seul hook       (usePortfolioData)
[ ] language initialisé depuis API     (data.meta.defaultLang || 'fr')
[ ] QueryClientProvider dans main.jsx  (React Query configuré)

COMPOSANTS — HARDCODES ÉLIMINÉS
[ ] Hero.jsx — nom depuis nameLines    (pas de "Amouzougan" hardcodé)
[ ] Hero.jsx — photo conditionnelle    (pas de fallback "azerty.jpg")
[ ] Hero.jsx — clés anims normalisées  (short/medium/long au lieu de heroTag etc.)
[ ] Contact.jsx — terminalUser API     (pas de "juvanio@secure-node" hardcodé)
[ ] ApiView.jsx — slug dynamique       (pas de "/api/v1/juvanio/" hardcodé)
[ ] BootSequence.jsx — lignes depuis data.boot
[ ] BootSequence.jsx — nodeName depuis data.meta.nodeName
[ ] Marquee.jsx — items depuis data.marquee.items
[ ] TerminalBackground.jsx — logs depuis data.terminal.logs
[ ] Skills.jsx — rackOrder = Object.keys() (pas de tableau hardcodé)
[ ] TenxyteArchitecture.jsx — docsUrl depuis data.tenxyte.docsUrl
[ ] Experience.jsx — var(--font-heading) (pas de fontFamily inline)
[ ] Formation.jsx — var(--font-heading)
[ ] Skills.jsx — var(--font-heading)

SKELETON & STATES
[ ] AppSkeleton.jsx créé               (navbar + hero + 2 sections)
[ ] AppErrorScreen.jsx créé            (message + slug + bouton Retry)
[ ] App.jsx affiche AppSkeleton        (status === 'loading' || language === null)
[ ] App.jsx affiche AppErrorScreen     (status === 'error')
[ ] DecryptedText — prefers-reduced-motion respecté

VALIDATION FINALE
[ ] npm run dev démarre sans erreur
[ ] 0 warning AJV dans la console (seeds valides)
[ ] grep -r "juvanio" src/ retourne 0 résultat (hors commentaires/tests)
[ ] grep -r "azerty" src/ retourne 0 résultat
[ ] grep -r "tenxyte.readthedocs.io" src/ retourne 0 résultat
[ ] grep -r "useSkinData" src/ retourne 0 résultat
[ ] Thème dark/light fonctionne (CSS vars injectées)
[ ] Toggle langue fonctionne (fr ↔ en)
[ ] Parallax fonctionne (factor depuis skin.animations.parallaxFactor)
```

---

*Document généré pour Portfolio Builder Engine v3.0 — Phase 1 uniquement.*  
*Basé sur l'analyse complète du code existant (all_codes.txt) et du plan (all_plans.md).*