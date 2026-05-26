// src/App.jsx — Phase 3 : boucle dynamique pilotée par skin.architecture
import { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { usePortfolioData, resolveSlugFromHostname } from './hooks/usePortfolioData';
import { injectCssVariables } from './lib/injectCssVariables';
import { REGISTRY } from './registry/Registry';
import BlockSkeleton            from './components/shared/BlockSkeleton';
import MissingComponentFallback from './components/shared/MissingComponentFallback';
import BootSequenceSkeleton     from './components/shared/BootSequenceSkeleton';
import ErrorScreen              from './components/shared/ErrorScreen';
import FooterBugs               from './components/FooterBugs';
import DecryptedText            from './components/shared/DecryptedText';

// ── Constantes de classification des composants ───────────────────────────────
const ADDON_COMPONENTS     = new Set(['BootSequenceAddon', 'CustomCursorAddon', 'NoiseOverlayAddon', 'NetworkCanvasAddon']);
const STRUCTURE_COMPONENTS = new Set(['Navbar', 'ApiViewPanel']);

// ── Hauteurs des skeletons co-localisés (Phase 3) ─────────────────────────────
const SKELETON_HEIGHTS = {
  HeroTerminal:      600,
  MarqueeBar:         80,
  TenxyteShowcase:   400,
  SkillsServerRack:  500,
  ExperienceTimeline: 600,
  FormationGrid:     400,
  ContactTerminal:   400,
};

function App() {
  const slug = resolveSlugFromHostname();
  const { skin, data, status, error, isLoading } = usePortfolioData(slug);

  // ── États UI ──────────────────────────────────────────────────────────────
  const [apiMode,   setApiMode]   = useState(false);
  const [theme,     setTheme]     = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 8) ? 'dark' : 'light';
  });
  const [language,  setLanguage]  = useState(null);

  // ── Injection CSS vars depuis skin ────────────────────────────────────────
  useLayoutEffect(() => {
    injectCssVariables(skin, theme);
  }, [theme, skin]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  // ── Language par défaut depuis data.meta ──────────────────────────────────
  useEffect(() => {
    if (data && language === null) {
      setLanguage(data.meta?.defaultLang || 'fr');
    }
  }, [data, language]);

  // ── Scroll to top en mode API ─────────────────────────────────────────────
  useEffect(() => {
    if (apiMode) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [apiMode]);

  // ── États de chargement / erreur ──────────────────────────────────────────
  if (isLoading || status === 'loading' || language === null) {
    return <BootSequenceSkeleton />;
  }
  if (status === 'error' || error) {
    return <ErrorScreen message={error?.message} slug={slug} />;
  }

  // ── Props communes injectées dans tous les blocs ──────────────────────────
  const sharedProps = {
    data,
    skin,
    language,
    theme,
    apiMode,
    // Handlers normalisés (interface BlockProps §6.2)
    onToggleApi:      () => setApiMode(m => !m),
    onToggleLanguage: () => setLanguage(l => l === 'fr' ? 'en' : 'fr'),
    onToggleTheme:    () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    // Compatibilité descendante avec Navbar/ApiView qui utilisent les anciens noms de props
    toggleApiMode:    () => setApiMode(m => !m),
    toggleLanguage:   () => setLanguage(l => l === 'fr' ? 'en' : 'fr'),
    toggleTheme:      () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    navData: data.navbar?.[language] || data.navbar?.fr,
    slug,
  };

  // ── Filtrage et classification des blocs ──────────────────────────────────
  const activeBlocks  = (skin.architecture || []).filter(b => b.enabled !== false);
  const addonBlocks   = activeBlocks.filter(b => ADDON_COMPONENTS.has(b.component));
  const structBlocks  = activeBlocks.filter(b => STRUCTURE_COMPONENTS.has(b.component));
  const contentBlocks = activeBlocks.filter(b =>
    !ADDON_COMPONENTS.has(b.component) && !STRUCTURE_COMPONENTS.has(b.component)
  );

  // ── Fonction de rendu d'un bloc ───────────────────────────────────────────
  const renderBlock = ({ id, component, props = {} }) => {
    const Block = REGISTRY[component];
    if (!Block) return <MissingComponentFallback key={id} name={component} />;
    const height = SKELETON_HEIGHTS[component] ?? 400;
    return (
      <Suspense key={id} fallback={<BlockSkeleton height={height} label={component} />}>
        <Block {...sharedProps} {...props} />
      </Suspense>
    );
  };

  // ── Footer data ───────────────────────────────────────────────────────────
  const footer = data.footer?.[language] || data.footer?.fr;

  return (
    <>
      {/* Add-ons globaux (curseur, boot, noise...) */}
      {addonBlocks.map(renderBlock)}

      {/* Navigation et panneaux de structure */}
      {structBlocks.map(renderBlock)}

      {/* Corps principal — ordre dicté par skin.architecture */}
      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          {contentBlocks.map(renderBlock)}
        </main>

        <footer style={{ position: 'relative', overflow: 'hidden' }}>
          <FooterBugs />
          <span style={{ position: 'relative', zIndex: 1 }}>{footer?.copyright}</span>
          <span style={{ position: 'relative', zIndex: 1 }}>
            <DecryptedText text={footer?.role} />{' · '}
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
            <DecryptedText text={footer?.location} />
          </span>
        </footer>
      </div>
    </>
  );
}

export default App;
