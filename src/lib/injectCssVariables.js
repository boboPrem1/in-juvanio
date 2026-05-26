// src/lib/injectCssVariables.js
// ============================================================
// Injecte TOUS les tokens du skin en tant que CSS custom
// properties sur :root (document.documentElement).
// Appelé dans useLayoutEffect à chaque changement de thème.
// ============================================================

/**
 * Catégories du skin qui contiennent des CSS custom properties (clés "--").
 * Chaque catégorie est injectée sauf 'theme' (traitement spécial)
 * et 'layout' (mix de booléens/integers et CSS vars — filtré par "--").
 */
const CSS_VAR_CATEGORIES = [
  'typography',   // --font-mono, --text-xs, --tracking-wide…
  'spacing',      // --space-xs, --space-sm…
  'transitions',  // --transition-fast, --transition-base…
  'zIndex',       // --z-navbar, --z-cursor…
  'shape',        // --radius-base, --radius-full…
  'opacities',    // --opacity-noise, --opacity-dim…
  'effects',      // --noise-opacity, --grid-opacity…
];

/**
 * Injecte toutes les custom properties du skin dans :root.
 * @param {object} skin   — Objet skin complet (normalisé Phase 0)
 * @param {string} theme  — 'dark' | 'light'
 */
export function injectCssVariables(skin, theme) {
  if (!skin) return;
  const root = document.documentElement;

  // 1. Theme tokens (dark ou light)
  const themeTokens = skin.theme?.[theme] ?? {};
  for (const [key, value] of Object.entries(themeTokens)) {
    if (key.startsWith('--')) root.style.setProperty(key, String(value));
  }

  // 2. Catégories génériques
  for (const category of CSS_VAR_CATEGORIES) {
    const tokens = skin[category];
    if (!tokens) continue;
    for (const [key, value] of Object.entries(tokens)) {
      if (!key.startsWith('--')) continue;
      root.style.setProperty(key, String(value));
    }
  }

  // 3. Layout : filtrer seulement les clés CSS ("--")
  const layout = skin.layout ?? {};
  for (const [key, value] of Object.entries(layout)) {
    if (!key.startsWith('--')) continue;
    root.style.setProperty(key, String(value));
  }

  // ── Tokens calculés ─────────────────────────────────────────

  // --skills-cols : integer → CSS var (utilisé dans Skills.css grid)
  const cols = layout.skillsColumns ?? 4;
  root.style.setProperty('--skills-cols', String(cols));

  // --lang-card-span : integer → CSS var (carte langues span)
  const span = layout.langCardSpan ?? 2;
  root.style.setProperty('--lang-card-span', String(span));

  // --hero-direction : booléen → CSS var (flex-direction du Hero)
  const isReversed = layout.heroReversed ?? false;
  root.style.setProperty('--hero-direction', isReversed ? 'row-reverse' : 'row');

  // ── Durées d'animation (Phase 4) ────────────────────────────
  // Injectées depuis skin.animations.durations pour être utilisables en CSS
  const dur = skin.animations?.durations ?? {};
  const durDefaults = { short: 400, medium: 800, long: 1200, xlong: 1800 };
  for (const [key, def] of Object.entries(durDefaults)) {
    root.style.setProperty(`--duration-${key}`, `${dur[key] ?? def}ms`);
  }

  // ── Addon noiseOverlay ───────────────────────────────────────
  // Si désactivé, écrase --noise-opacity à 0 (pseudo-element body::after invisible)
  if (skin.addons?.noiseOverlay === false) {
    root.style.setProperty('--noise-opacity', '0');
    root.style.setProperty('--grid-opacity', '0');
  }
}
