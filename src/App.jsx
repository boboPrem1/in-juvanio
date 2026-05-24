import { useState, useEffect, useLayoutEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useSkinData } from './hooks/useSkinData';
import BootSequence from './components/BootSequence';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ApiView from './components/ApiView';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import TenxyteArchitecture from './components/TenxyteArchitecture';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Formation from './components/Formation';
import Contact from './components/Contact';
import DecryptedText from './components/DecryptedText';
import FooterBugs from './components/FooterBugs';

function App() {
  const { data, loading: dataLoading, error: dataError } = usePortfolioData();
  const { skin, loading: skinLoading, error: skinError } = useSkinData();

  const loading = dataLoading || skinLoading;
  const error = dataError || skinError;

  const [apiMode, setApiMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 8) ? 'dark' : 'light';
  });

  const toggleApiMode = () => setApiMode(!apiMode);
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useLayoutEffect(() => {
    if (!skin) return;
    const currentTheme = skin.theme[theme];
    
    // Combine all style objects from the skin into one for injection
    const cssVariables = {
      ...currentTheme,
      ...(skin.typography || {}),
      ...(skin.layout || {}),
      ...(skin.effects || {})
    };

    if (cssVariables) {
      Object.entries(cssVariables).forEach(([key, value]) => {
        // Only set if key starts with '--' (e.g. skip 'heroReversed' which is a boolean)
        if (key.startsWith('--')) {
          document.documentElement.style.setProperty(key, value);
        }
      });
    }
  }, [theme, skin]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  useEffect(() => {
    if (apiMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [apiMode]);

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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--accent)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '14px',
        letterSpacing: '2px'
      }}>
        <span>Initializing...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--accent2)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        letterSpacing: '1px'
      }}>
        <span>Error loading data: {error}</span>
      </div>
    );
  }

  const footer = data.footer[language] || data.footer.fr;

  return (
    <>
      <BootSequence />
      <CustomCursor cursorData={skin?.cursor || { type: 'custom' }} />
      <Navbar
        apiMode={apiMode}
        toggleApiMode={toggleApiMode}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        navData={data.navbar[language] || data.navbar.fr}
      />

      <ApiView apiMode={apiMode} language={language} data={data} />

      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          <Hero language={language} data={data} skin={skin} />
          <Marquee />
          <TenxyteArchitecture language={language} data={data} skin={skin} />
          <Skills language={language} data={data} skin={skin} />
          <Experience language={language} data={data} skin={skin} />
          <Formation language={language} data={data} skin={skin} />
          <Contact language={language} data={data} skin={skin} />
        </main>

        <footer style={{ position: 'relative', overflow: 'hidden' }}>
          <FooterBugs />
          <span style={{ position: 'relative', zIndex: 1 }}>{footer.copyright}</span>
          <span style={{ position: 'relative', zIndex: 1 }}>
            <DecryptedText text={footer.role} /> · <a href={data.meta.contact.github} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>GitHub</a>
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
