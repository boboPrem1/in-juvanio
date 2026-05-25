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
import AppSkeleton          from './components/skeletons/AppSkeleton';
import AppErrorScreen       from './components/AppErrorScreen';

// ─── Injection des CSS Custom Properties ─────────────────────────────────────
// Injecte les clés "--" du skin dans :root (évite le flash de styles non-thémés)
function injectCssVariables(skin, theme) {
  if (!skin) return;
  const tokens = {
    ...(skin.theme?.[theme] || {}),
    ...(skin.typography     || {}),
    ...(skin.effects        || {}),
    // layout : seulement les clés CSS (pas heroReversed, skillsColumns)
    ...(Object.fromEntries(
      Object.entries(skin.layout || {}).filter(([k]) => k.startsWith('--'))
    )),
  };
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

// ─── Thème par défaut ─────────────────────────────────────────────────────────
function getDefaultTheme() {
  const hour = new Date().getHours();
  return (hour >= 18 || hour < 8) ? 'dark' : 'light';
}

function App() {
  // ── Résolution slug ───────────────────────────────────────────────────────
  const slug = resolveSlugFromHostname();

  // ── Données (hook unique Phase 0) ─────────────────────────────────────────
  const { skin, data, status, error, isLoading } = usePortfolioData(slug);

  // ── États UI ──────────────────────────────────────────────────────────────
  const [apiMode, setApiMode]   = useState(false);
  const [theme, setTheme]       = useState(getDefaultTheme);

  // defaultLang vient de data.meta.defaultLang une fois chargé (null en attendant)
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    if (data && language === null) {
      setLanguage(data.meta?.defaultLang || 'fr');
    }
  }, [data, language]);

  const toggleApiMode  = () => setApiMode(prev => !prev);
  const toggleLanguage = () => setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  const toggleTheme    = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // ── Injection CSS Custom Properties ──────────────────────────────────────
  useLayoutEffect(() => {
    injectCssVariables(skin, theme);
  }, [theme, skin]);

  // ── Classe body pour le thème ─────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  // ── Scroll vers top en mode API ───────────────────────────────────────────
  useEffect(() => {
    if (apiMode) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [apiMode]);

  // ── Parallax (depuis skin.animations.parallaxFactor) ─────────────────────
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

  // ── États de chargement / erreur ──────────────────────────────────────────
  if (isLoading || status === 'loading' || language === null) {
    return <AppSkeleton theme={theme} />;
  }

  if (status === 'error' || error) {
    return <AppErrorScreen message={error?.message} slug={slug} theme={theme} />;
  }

  // ── Rendu principal ───────────────────────────────────────────────────────
  const footer         = data.footer[language] || data.footer.fr;
  const isCustomCursor = skin?.cursor?.type === 'custom' ||
                         skin?.addons?.customCursor === true;

  return (
    <>
      {/* Add-ons conditionnels (contrôlés par skin.addons) */}
      {skin?.addons?.bootSequence !== false && (
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
            <DecryptedText text={footer.role} />{' · '}
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
