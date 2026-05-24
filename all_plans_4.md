# Phase 4 — Modularisation des Animations et Interactions : Détail d'Implémentation Complet

> **Objectif** : Extraire toutes les logiques d'animation et d'interaction de leur composant hôte vers des hooks autonomes, réutilisables, pilotables par les props API, et systématiquement respectueux de `prefers-reduced-motion`.

---

## Contexte : L'état actuel (problèmes à résoudre)

### 1. Logique d'animation dispersée et couplée

Chaque composant gère ses propres comportements en dur :

```jsx
// ❌ AVANT — Experience.jsx (l. 404–423)
// staggerDelay couplé au nom de composant dans skin.json
const staggerDelay = skin?.animations?.stagger?.experienceDelay || 100;

// L'IntersectionObserver est recréé dans chaque composant qui en a besoin
// (Experience, Skills, TenxyteArchitecture...)
useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay || '0', 10));
      }
    });
  }, { threshold: 0.15 });
  // ...
}, []);

// ❌ AVANT — Skills.jsx (l. 1079)
// Clé couplée au composant : "skillsDelay" au lieu d'une clé générique
const staggerDelay = skin?.animations?.stagger?.skillsDelay || 150;

// ❌ AVANT — DecryptedText.jsx (l. 350)
// Composant-classe qui gère lui-même son état et son timer
// Durée passée directement par props hardcodées dans chaque appelant :
// duration={anims.experienceDesc || 1200}
// duration={anims.formationDesc || 1200}
// duration={anims.tenxyteDesc || 1200}
```

### 2. Pas de `prefers-reduced-motion`

Aucune des animations existantes ne consulte `prefers-reduced-motion`. Les utilisateurs ayant activé cette préférence voient exactement les mêmes animations que les autres — violation des WCAG 2.1 (critère 2.3.3 AAA, recommandé AA).

### 3. Parallaxe codée dans App.jsx

```jsx
// ❌ AVANT — App.jsx (l. 1571–1578)
// Effet parallaxe directement dans App, couplé à une classe CSS hardcodée
useEffect(() => {
  if (!skin) return;
  const handleScroll = () => {
    const heroGrid = document.querySelector('.hero-grid');
    if (heroGrid) {
      heroGrid.style.transform = `translateY(${window.scrollY * skin.animations.parallaxFactor}px)`;
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [skin]);
```

### 4. Clés de durée couplées aux noms de composants

```json
// ❌ AVANT — skin.json
"animations": {
  "decryptedText": {
    "heroTag": 600,
    "heroTitle": 700,
    "tenxyteDesc": 1200,
    "experienceDesc": 1200,
    "formationDesc": 1200,
    "skillsTag": 600
  },
  "stagger": {
    "experienceDelay": 100,
    "skillsDelay": 150
  }
}
```

Ces clés sont couplées à des composants précis, ce qui empêche la réutilisation. En Phase 4, elles sont remplacées par des durées sémantiques génériques.

---

## 1. Nouveau schéma des tokens d'animation dans `skin.json`

Avant d'écrire les hooks, définir le nouveau contrat de données. C'est la source de vérité pour tous les comportements.

### 1.1 Nouveau format (générique et sémantique)

```json
// skin.json (seed de dev) — champ "animations" refondu
{
  "animations": {
    "durations": {
      "short":  400,
      "medium": 800,
      "long":   1200,
      "xlong":  1800
    },
    "stagger": {
      "default": 80,
      "dense":   40,
      "loose":   150
    },
    "parallax": {
      "heroGrid":    0.15,
      "heroPhoto":   0.08
    },
    "intersectionThreshold": 0.15,
    "glitch": {
      "intensity":   0.4,
      "frequency":   200
    }
  }
}
```

### 1.2 Table de correspondance ancien → nouveau

| Ancienne clé | Nouvelle clé | Valeur par défaut |
|---|---|---|
| `animations.decryptedText.heroTag` | `animations.durations.short` | 400 |
| `animations.decryptedText.heroTitle` | `animations.durations.medium` | 800 |
| `animations.decryptedText.tenxyteDesc` | `animations.durations.long` | 1200 |
| `animations.decryptedText.experienceDesc` | `animations.durations.long` | 1200 |
| `animations.decryptedText.formationDesc` | `animations.durations.long` | 1200 |
| `animations.decryptedText.skillsTag` | `animations.durations.short` | 400 |
| `animations.stagger.experienceDelay` | `animations.stagger.default` | 80 |
| `animations.stagger.skillsDelay` | `animations.stagger.loose` | 150 |
| `animations.parallaxFactor` | `animations.parallax.heroGrid` | 0.15 |

### 1.3 Mise à jour du schéma JSON

```json
// packages/schemas/skin.schema.json — fragment "animations"
{
  "animations": {
    "type": "object",
    "properties": {
      "durations": {
        "type": "object",
        "properties": {
          "short":  { "type": "number", "minimum": 0 },
          "medium": { "type": "number", "minimum": 0 },
          "long":   { "type": "number", "minimum": 0 },
          "xlong":  { "type": "number", "minimum": 0 }
        }
      },
      "stagger": {
        "type": "object",
        "properties": {
          "default": { "type": "number", "minimum": 0 },
          "dense":   { "type": "number", "minimum": 0 },
          "loose":   { "type": "number", "minimum": 0 }
        }
      },
      "parallax": {
        "type": "object",
        "additionalProperties": { "type": "number" }
      },
      "intersectionThreshold": { "type": "number", "minimum": 0, "maximum": 1 },
      "glitch": {
        "type": "object",
        "properties": {
          "intensity":  { "type": "number", "minimum": 0, "maximum": 1 },
          "frequency":  { "type": "number", "minimum": 0 }
        }
      }
    }
  }
}
```

---

## 2. Utilitaire central : `prefersReducedMotion`

Toute la Phase 4 repose sur ce seul point d'entrée. Il est implémenté une fois, utilisé partout.

```js
// src/hooks/utils/prefersReducedMotion.js

/**
 * Retourne true si l'utilisateur a activé prefers-reduced-motion.
 * Lecture synchrone (pas de hook) — utilisable dans n'importe quel contexte.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook React qui s'abonne aux changements de prefers-reduced-motion en temps réel.
 * Utile si l'utilisateur change sa préférence système pendant la session.
 */
import { useState, useEffect } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

**Règle d'utilisation** :
- `prefersReducedMotion()` (fonction) dans les hooks qui ne sont pas des composants React (ex: logique interne de hook).
- `usePrefersReducedMotion()` (hook) dans les composants qui ont besoin de re-rendre quand la préférence change.

---

## 3. Hook `useDecryptText` — Refactoring de `DecryptedText`

### 3.1 Problème actuel

`DecryptedText.jsx` est un composant qui encapsule l'état ET le rendu. Il ne peut pas être réutilisé dans un contexte différent (ex: titre animé avec un `<h1>` custom, ou animation déclenchée par IntersectionObserver).

### 3.2 Le hook extrait

```js
// src/hooks/useDecryptText.js
import { useState, useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * @param {string}  text      — texte cible final
 * @param {number}  duration  — durée totale de l'animation en ms (défaut: 800)
 * @param {number}  speed     — intervalle de tick en ms (défaut: 40)
 * @param {boolean} trigger   — si false, l'animation ne démarre pas (pour activation différée)
 *
 * @returns {string} displayText — texte courant à afficher
 */
export function useDecryptText(text, { duration = 800, speed = 40, trigger = true } = {}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Si prefers-reduced-motion ou trigger non activé : affiche directement le texte final
    if (prefersReducedMotion() || !trigger) {
      setDisplayText(text);
      return;
    }

    // Reset au cas où le texte change en cours d'animation
    setDisplayText(text);
    let startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * text.length);

      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, duration, speed, trigger]);

  return displayText;
}
```

### 3.3 Composant `DecryptedText` refactorisé (rétrocompatible)

Le composant existant devient une fine enveloppe autour du hook — **aucune modification requise dans les composants appelants**.

```jsx
// src/components/shared/DecryptedText.jsx
import { useDecryptText } from '../../hooks/useDecryptText';

/**
 * Composant de présentation — wrapper rétrocompatible autour de useDecryptText.
 * Interface identique à l'ancien composant.
 */
export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const displayText = useDecryptText(text, { duration, speed });
  return <span>{displayText}</span>;
}
```

### 3.4 Usage avancé avec `trigger` (activation au scroll)

```jsx
// Exemple dans ExperienceTimeline.jsx — déclenche le decrypt à l'entrée dans le viewport
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { useDecryptText } from '../../hooks/useDecryptText';

function AnimatedTitle({ text, duration }) {
  const { ref, isVisible } = useIntersectionReveal({ threshold: 0.2 });
  const display = useDecryptText(text, { duration, trigger: isVisible });
  return <span ref={ref}>{display}</span>;
}
```

### 3.5 Lecture de la durée depuis `skin.animations.durations`

Dans les composants, remplacer les clés couplées par des durées sémantiques :

```jsx
// ❌ AVANT
const anims = skin?.animations?.decryptedText || {};
<DecryptedText text={t.desc} duration={anims.tenxyteDesc || 1200} />

// ✅ APRÈS
const d = skin?.animations?.durations || {};
<DecryptedText text={t.desc} duration={d.long ?? 1200} />
```

Table de migration pour chaque composant :

| Composant | Ancienne prop | Nouvelle prop |
|---|---|---|
| `Hero.jsx` — tag | `anims.heroTag \|\| 600` | `d.short ?? 400` |
| `Hero.jsx` — title, desc | `anims.heroTitle \|\| 700` | `d.medium ?? 800` |
| `TenxyteArchitecture.jsx` | `anims.tenxyteDesc \|\| 1200` | `d.long ?? 1200` |
| `Experience.jsx` — desc | `anims.experienceDesc \|\| 1200` | `d.long ?? 1200` |
| `Experience.jsx` — change | `anims.experienceChange \|\| 1000` | `d.medium ?? 800` |
| `Formation.jsx` — desc | `anims.formationDesc \|\| 1200` | `d.long ?? 1200` |
| `Skills.jsx` — tag | `anims.skillsTag \|\| 600` | `d.short ?? 400` |

---

## 4. Hook `useIntersectionReveal` — Remplacement des observers inline

### 4.1 Problème actuel

`IntersectionObserver` est recréé à l'identique dans `Experience.jsx` (l. 406–423) et `Skills.jsx` (l. 1081–1096). Chaque composant manipule directement le DOM pour ajouter la classe `visible`.

### 4.2 Le hook

```js
// src/hooks/useIntersectionReveal.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Observe un élément et signale son entrée dans le viewport.
 *
 * @param {object} options
 * @param {number}  options.threshold     — fraction visible pour déclencher (défaut: 0.15)
 * @param {string}  options.rootMargin    — marge CSS autour du viewport (défaut: '0px')
 * @param {boolean} options.once          — arrêter d'observer après la première entrée (défaut: true)
 *
 * @returns {{ ref, isVisible }}
 *   ref       — à attacher à l'élément DOM observé
 *   isVisible — true quand l'élément est dans le viewport
 */
export function useIntersectionReveal({
  threshold  = 0.15,
  rootMargin = '0px',
  once       = true,
} = {}) {
  const ref = useRef(null);
  // Si reduced motion : considère tout comme "visible" immédiatement
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
```

### 4.3 Hook complémentaire `useStaggerReveal` — remplace le stagger manuel

```js
// src/hooks/useStaggerReveal.js
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Observe un conteneur et ajoute la classe `visible` à chaque enfant
 * correspondant au sélecteur, avec un délai échelonné.
 *
 * @param {string} selector      — sélecteur CSS des enfants à animer (ex: '.git-commit')
 * @param {number} staggerDelay  — délai entre chaque enfant en ms (défaut: 80)
 * @param {number} threshold     — fraction visible du conteneur pour déclencher (défaut: 0.15)
 *
 * @returns {{ containerRef }}   — à attacher au conteneur parent
 */
export function useStaggerReveal(selector, { staggerDelay = 80, threshold = 0.15 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Sans animation : tout visible immédiatement
    if (prefersReducedMotion()) {
      container.querySelectorAll(selector).forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.querySelectorAll(selector).forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * staggerDelay);
          });
          observer.disconnect(); // déclencher une seule fois
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [selector, staggerDelay, threshold]);

  return { containerRef };
}
```

### 4.4 Migration de `Experience.jsx`

```jsx
// ✅ APRÈS — ExperienceTimeline.jsx
import { useStaggerReveal } from '../../hooks/useStaggerReveal';

export default function ExperienceTimeline({ language, data, skin }) {
  const t = data.experience[language] || data.experience.fr;
  const staggerDelay = skin?.animations?.stagger?.default ?? 80;
  const threshold    = skin?.animations?.intersectionThreshold ?? 0.15;

  const { containerRef } = useStaggerReveal('.git-commit', { staggerDelay, threshold });

  return (
    <section className="experience" id="experience">
      {/* ... rendu identique ... */}
      <div className="git-timeline" ref={containerRef}>
        {/* ... */}
      </div>
    </section>
  );
}
```

### 4.5 Migration de `Skills.jsx`

```jsx
// ✅ APRÈS — SkillsServerRack.jsx
import { useStaggerReveal } from '../../hooks/useStaggerReveal';

export default function SkillsServerRack({ language, data, skin }) {
  const staggerDelay = skin?.animations?.stagger?.loose ?? 150;
  const threshold    = skin?.animations?.intersectionThreshold ?? 0.15;

  const { containerRef } = useStaggerReveal('.lang-item', {
    staggerDelay,
    threshold: 0.3, // Skills utilise un threshold plus élevé
  });

  return (
    <section id="skills">
      {/* ... */}
      <div className="langs" ref={containerRef}>
        {/* ... */}
      </div>
    </section>
  );
}
```

---

## 5. Hook `useParallax` — Extraction du parallaxe de `App.jsx`

### 5.1 Problème actuel

Le parallaxe est dans `App.jsx` (l. 1569–1579), couplé au sélecteur `.hero-grid` et lu depuis `skin.animations.parallaxFactor` (une seule valeur globale). En Phase 4, chaque élément peut avoir son propre facteur.

### 5.2 Le hook

```js
// src/hooks/useParallax.js
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Applique un effet parallaxe vertical à un élément en fonction du scroll de la page.
 *
 * @param {number} factor   — multiplicateur du scroll (ex: 0.15 = 15% de vitesse)
 *                            positif = défile vers le bas, négatif = défile vers le haut
 * @param {object} options
 * @param {boolean} options.clampToViewport — limite le déplacement à la hauteur de la fenêtre
 *
 * @returns {{ ref }}  — à attacher à l'élément à animer
 */
export function useParallax(factor = 0.15, { clampToViewport = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || factor === 0) return;

    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      let offset = window.scrollY * factor;

      if (clampToViewport) {
        const limit = window.innerHeight;
        offset = Math.max(-limit, Math.min(limit, offset));
      }

      // Utiliser transform pour ne pas déclencher de reflow
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Position initiale

    return () => window.removeEventListener('scroll', handleScroll);
  }, [factor, clampToViewport]);

  return { ref };
}
```

### 5.3 Migration dans `HeroTerminal.jsx`

```jsx
// ✅ APRÈS — HeroTerminal.jsx
import { useParallax } from '../../hooks/useParallax';

export default function HeroTerminal({ language, data, skin }) {
  const gridFactor  = skin?.animations?.parallax?.heroGrid  ?? 0.15;
  const photoFactor = skin?.animations?.parallax?.heroPhoto ?? 0.08;

  const { ref: gridRef  } = useParallax(gridFactor);
  const { ref: photoRef } = useParallax(photoFactor);

  return (
    <section className="hero" id="about">
      <div className="hero-grid" ref={gridRef}></div>
      {/* ... */}
      <div className="hero-photo-frame" ref={photoRef}>
        <img src={skin?.assets?.heroPhoto} alt={data.meta.name} />
      </div>
    </section>
  );
}
```

**Suppression dans `App.jsx`** : retirer le `useEffect` du parallaxe (l. 1569–1579) — il est maintenant géré dans `HeroTerminal`.

---

## 6. Hook `useGlitchText` — Effet glitch on-hover

Cet effet est absent de l'implémentation actuelle mais présent dans la roadmap Phase 4. Il est utilisable sur des éléments interactifs (titres, badges, boutons).

### 6.1 Le hook

```js
// src/hooks/useGlitchText.js
import { useState, useRef, useCallback } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

const GLITCH_CHARS = '!<>-_\\/[]{}=+*^?#@&%$';

/**
 * Applique un effet glitch (caractères aléatoires) au survol ou sur déclenchement.
 *
 * @param {string}  text       — texte original à glitcher
 * @param {object}  options
 * @param {number}  options.intensity  — fraction du texte glitchée (0 à 1, défaut: 0.4)
 * @param {number}  options.frequency  — intervalle du tick en ms (défaut: 50)
 * @param {number}  options.duration   — durée totale de l'effet en ms (défaut: 400)
 *
 * @returns {{ displayText, glitchHandlers }}
 *   displayText    — texte courant à afficher
 *   glitchHandlers — { onMouseEnter, onMouseLeave } à spreader sur l'élément
 */
export function useGlitchText(text, {
  intensity = 0.4,
  frequency = 50,
  duration  = 400,
} = {}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);

  const startGlitch = useCallback(() => {
    if (prefersReducedMotion()) return;

    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      const glitched = text.split('').map(char => {
        if (char === ' ') return ' ';
        if (Math.random() < intensity) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        return char;
      }).join('');
      setDisplayText(glitched);
    }, frequency);

    // Arrêt automatique après `duration`
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setDisplayText(text);
    }, duration);
  }, [text, intensity, frequency, duration]);

  const stopGlitch = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setDisplayText(text);
  }, [text]);

  return {
    displayText,
    glitchHandlers: {
      onMouseEnter: startGlitch,
      onMouseLeave: stopGlitch,
      onFocus:      startGlitch, // Accessibilité clavier
      onBlur:       stopGlitch,
    },
  };
}
```

### 6.2 Usage dans un composant

```jsx
// Exemple : badge de section animé au hover
import { useGlitchText } from '../../hooks/useGlitchText';

function GlitchBadge({ text, skin }) {
  const intensity = skin?.animations?.glitch?.intensity ?? 0.4;
  const frequency = skin?.animations?.glitch?.frequency ?? 50;

  const { displayText, glitchHandlers } = useGlitchText(text, { intensity, frequency });

  return (
    <span className="tenxyte-badge" {...glitchHandlers} style={{ cursor: 'default' }}>
      {displayText}
    </span>
  );
}
```

### 6.3 Activation conditionnelle via `skin.architecture` props

```json
// skin.architecture — props spécifiques au bloc TenxyteShowcase
{
  "id": "tenxyte-showcase",
  "component": "TenxyteShowcase",
  "enabled": true,
  "props": {
    "glitchBadge":  true,
    "glitchTitles": false
  }
}
```

```jsx
// Dans TenxyteShowcase.jsx
export default function TenxyteShowcase({ language, data, skin, glitchBadge = false }) {
  // Le hook est inerte si prefers-reduced-motion ou si glitchBadge=false
  const badge = useGlitchText(t.badge, {
    intensity: glitchBadge ? (skin?.animations?.glitch?.intensity ?? 0.4) : 0,
  });
  // ...
}
```

---

## 7. Activation conditionnelle des add-ons via `skin.addons`

Les quatre add-ons globaux (`BootSequence`, `CustomCursor`, `NoiseOverlay`, `NetworkCanvas`) doivent être activables/désactivables par config API. En Phase 3, l'architecture les place déjà dans `skin.architecture`. En Phase 4, on s'assure que chaque add-on respecte également `prefers-reduced-motion`.

### 7.1 `BootSequenceAddon` — respect de `prefers-reduced-motion`

```jsx
// src/components/addons/BootSequenceAddon.jsx
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../hooks/utils/prefersReducedMotion';

export default function BootSequenceAddon() {
  const [isDone, setIsDone] = useState(() => prefersReducedMotion());
  const [currentLine, setCurrentLine] = useState(-1);

  const lines = [/* ... identique à l'existant ... */];

  useEffect(() => {
    // Si reduced motion : skip immédiatement l'animation
    if (prefersReducedMotion()) {
      setIsDone(true);
      return;
    }
    // ... logique existante inchangée
  }, []);

  if (isDone) return null;
  // ... rendu identique
}
```

### 7.2 `CustomCursorAddon` — respect de `prefers-reduced-motion`

```jsx
// src/components/addons/CustomCursorAddon.jsx
import { prefersReducedMotion } from '../../hooks/utils/prefersReducedMotion';

export default function CustomCursorAddon({ skin }) {
  const type = skin?.cursor?.type || 'custom';

  // Pas de curseur custom si reduced motion ou type 'default'/'none'
  if (type === 'default' || type === 'none' || prefersReducedMotion()) {
    return null;
  }

  // ... logique existante avec le rAF d'interpolation
  // Note : le rAF est inoffensif côté reduced-motion car le curseur ne fait
  // que suivre la position de la souris, sans animation décorative.
  // Cependant, respecter la préférence globale est la décision la plus conservatrice.
}
```

### 7.3 `NetworkCanvasAddon` — respect de `prefers-reduced-motion`

```jsx
// src/components/addons/NetworkCanvasAddon.jsx
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/utils/prefersReducedMotion';

export default function NetworkCanvasAddon() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Si reduced motion : ne pas démarrer le canvas animé du tout
    if (prefersReducedMotion()) return;
    // ... logique existante (classe Network du canvas héros)
  }, []);

  if (prefersReducedMotion()) return null;
  return <canvas id="networkCanvas" ref={canvasRef}></canvas>;
}
```

---

## 8. Composant `AnimatedSection` — wrapper d'entrée générique

Pour éviter de répéter le pattern "section invisible → visible au scroll" dans chaque composant, un wrapper générique encapsule `useIntersectionReveal`.

### 8.1 Le composant

```jsx
// src/components/shared/AnimatedSection.jsx
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './AnimatedSection.module.css';

/**
 * Wrapper qui applique une animation d'entrée (fade + slide) au scroll.
 * Si prefers-reduced-motion, le contenu est rendu immédiatement sans animation.
 *
 * @prop {string}   animation  — 'fadeUp' | 'fadeIn' | 'slideLeft' (défaut: 'fadeUp')
 * @prop {number}   threshold  — fraction visible pour déclencher (défaut: 0.15)
 * @prop {number}   delay      — délai avant déclenchement en ms (défaut: 0)
 */
export default function AnimatedSection({
  children,
  animation = 'fadeUp',
  threshold = 0.15,
  delay     = 0,
  className = '',
  as: Tag   = 'div',
}) {
  const { ref, isVisible } = useIntersectionReveal({ threshold });

  return (
    <Tag
      ref={ref}
      className={[
        styles.base,
        styles[animation],
        isVisible ? styles.visible : '',
        className,
      ].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
```

```css
/* src/components/shared/AnimatedSection.module.css */

.base {
  transition: opacity var(--duration-medium, 0.5s) ease,
              transform var(--duration-medium, 0.5s) ease;
}

/* fadeUp */
.fadeUp             { opacity: 0; transform: translateY(24px); }
.fadeUp.visible     { opacity: 1; transform: translateY(0); }

/* fadeIn */
.fadeIn             { opacity: 0; }
.fadeIn.visible     { opacity: 1; }

/* slideLeft */
.slideLeft          { opacity: 0; transform: translateX(-24px); }
.slideLeft.visible  { opacity: 1; transform: translateX(0); }

/* prefers-reduced-motion : tout visible sans transition */
@media (prefers-reduced-motion: reduce) {
  .base             { transition: none !important; }
  .fadeUp,
  .fadeIn,
  .slideLeft        { opacity: 1; transform: none; }
}
```

### 8.2 Usage dans les sections

```jsx
// FormationGrid.jsx
import AnimatedSection from '../shared/AnimatedSection';

export default function FormationGrid({ language, data, skin }) {
  return (
    <section id="formation">
      <AnimatedSection animation="fadeUp">
        <div className="section-label">...</div>
        <h2 className="section-title">...</h2>
      </AnimatedSection>
      <AnimatedSection animation="fadeUp" delay={100}>
        <div className="two-col">...</div>
      </AnimatedSection>
    </section>
  );
}
```

---

## 9. CSS : variables de durée injectées depuis `skin.animations.durations`

En Phase 2, les tokens CSS sont injectés depuis la réponse API. En Phase 4, on y ajoute les durées d'animation pour que les composants CSS les consomment directement via `var()`.

### 9.1 Injection dans `App.jsx`

```js
// App.jsx — dans useLayoutEffect, ajouter le mapping des durées
const durationMap = {
  '--duration-short':  `${skin.animations?.durations?.short  ?? 400}ms`,
  '--duration-medium': `${skin.animations?.durations?.medium ?? 800}ms`,
  '--duration-long':   `${skin.animations?.durations?.long   ?? 1200}ms`,
  '--duration-xlong':  `${skin.animations?.durations?.xlong  ?? 1800}ms`,
};

Object.entries({ ...cssVariables, ...durationMap }).forEach(([key, value]) => {
  if (key.startsWith('--')) document.documentElement.style.setProperty(key, value);
});
```

### 9.2 Utilisation dans les CSS modules

```css
/* ExperienceTimeline.module.css */
.gitCommit {
  opacity: 0;
  transform: translateX(-16px);
  transition:
    opacity  var(--duration-medium, 500ms) ease,
    transform var(--duration-medium, 500ms) ease;
}

.gitCommit.visible {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .gitCommit { transition: none; opacity: 1; transform: none; }
}
```

---

## 10. Structure de fichiers après Phase 4

```
apps/engine/src/
├── hooks/
│   ├── utils/
│   │   └── prefersReducedMotion.js      ← NOUVEAU — utilitaire central
│   ├── useDecryptText.js                ← NOUVEAU — extrait de DecryptedText.jsx
│   ├── useIntersectionReveal.js         ← NOUVEAU — observer générique
│   ├── useStaggerReveal.js              ← NOUVEAU — stagger pilotable
│   ├── useParallax.js                   ← NOUVEAU — extrait de App.jsx
│   ├── useGlitchText.js                 ← NOUVEAU
│   ├── usePortfolioData.js              ← MIS À JOUR (Phase 3)
│   └── useSkinData.js                   ← DÉPRÉCIÉ
│
├── components/
│   ├── shared/
│   │   ├── DecryptedText.jsx            ← REFACTORISÉ — wrapper de useDecryptText
│   │   ├── AnimatedSection.jsx          ← NOUVEAU — wrapper d'entrée générique
│   │   ├── AnimatedSection.module.css   ← NOUVEAU
│   │   ├── BlockSkeleton.jsx            ← (Phase 3)
│   │   └── ...
│   │
│   ├── hero/
│   │   └── HeroTerminal.jsx             ← MIS À JOUR — useParallax, plus de parallax dans App
│   ├── experience/
│   │   └── ExperienceTimeline.jsx       ← MIS À JOUR — useStaggerReveal
│   ├── skills/
│   │   └── SkillsServerRack.jsx         ← MIS À JOUR — useStaggerReveal
│   ├── formation/
│   │   └── FormationGrid.jsx            ← MIS À JOUR — AnimatedSection
│   │
│   └── addons/
│       ├── BootSequenceAddon.jsx        ← MIS À JOUR — prefersReducedMotion
│       ├── CustomCursorAddon.jsx        ← MIS À JOUR — prefersReducedMotion
│       └── NetworkCanvasAddon.jsx       ← MIS À JOUR — prefersReducedMotion
│
└── App.jsx                              ← MIS À JOUR — suppression du parallax inline,
                                            injection des --duration-* variables
```

---

## 11. Tableau récapitulatif des hooks Phase 4

| Hook | Remplace | `prefers-reduced-motion` | Pilotable par API |
|---|---|---|---|
| `useDecryptText` | Logique interne de `DecryptedText.jsx` | ✅ Affiche le texte final directement | `skin.animations.durations.*` |
| `useIntersectionReveal` | Observers inline dans chaque composant | ✅ `isVisible` = true immédiatement | `skin.animations.intersectionThreshold` |
| `useStaggerReveal` | `observer + querySelectorAll + setTimeout` dans Experience, Skills | ✅ Ajoute `visible` immédiatement | `skin.animations.stagger.*` |
| `useParallax` | `useEffect + scroll` dans `App.jsx` | ✅ `transform` non appliqué | `skin.animations.parallax.*` |
| `useGlitchText` | Aucun équivalent (nouveau) | ✅ Retourne le texte original sans modification | `skin.architecture[n].props.glitch*` |
| `usePrefersReducedMotion` | Aucun (utilitaire React) | — source de vérité | — |

---

## 12. Checklist de livraison Phase 4

- [ ] `skin.json` (seed dev) : champ `animations` refondu avec `durations`, `stagger`, `parallax`, `glitch`
- [ ] `packages/schemas/skin.schema.json` : section `animations` mise à jour
- [ ] `src/hooks/utils/prefersReducedMotion.js` créé (fonction + hook)
- [ ] `src/hooks/useDecryptText.js` créé et testé (reduced-motion, trigger, texte changeant)
- [ ] `src/components/shared/DecryptedText.jsx` refactorisé en wrapper — interface identique
- [ ] `src/hooks/useIntersectionReveal.js` créé
- [ ] `src/hooks/useStaggerReveal.js` créé
- [ ] `Experience.jsx` migré vers `useStaggerReveal` + durées sémantiques
- [ ] `Skills.jsx` migré vers `useStaggerReveal` + durées sémantiques
- [ ] `src/hooks/useParallax.js` créé
- [ ] `HeroTerminal.jsx` migré vers `useParallax`
- [ ] Parallaxe inline supprimé de `App.jsx`
- [ ] `src/hooks/useGlitchText.js` créé
- [ ] `AnimatedSection.jsx` + CSS Module créés
- [ ] `Formation.jsx` et `TenxyteArchitecture.jsx` migrés vers `AnimatedSection`
- [ ] `BootSequenceAddon`, `CustomCursorAddon`, `NetworkCanvasAddon` mis à jour avec `prefersReducedMotion`
- [ ] Injection des variables `--duration-*` dans `App.jsx` (`useLayoutEffect`)
- [ ] Tous les CSS modules des composants animés utilisent `var(--duration-*)` + règle `@media (prefers-reduced-motion: reduce)`
- [ ] Test manuel : activer "Réduire les animations" dans l'OS → toutes les animations absentes, contenu immédiatement visible
- [ ] Test manuel : désactiver un effet via `skin.architecture[n].props` → effet absent, texte/contenu toujours présent

---

## 13. Dépendances introduites en Phase 4

Aucune — toute la Phase 4 repose exclusivement sur des API Web natives (`IntersectionObserver`, `matchMedia`, `requestAnimationFrame`, `window.scrollY`) et React natif (`useEffect`, `useRef`, `useState`, `useCallback`).