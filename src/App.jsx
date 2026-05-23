import { useState, useEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
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
  const { data, loading, error } = usePortfolioData();

  const [apiMode, setApiMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 8) ? 'dark' : 'light';
  });

  const toggleApiMode = () => setApiMode(!apiMode);
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

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
    const handleScroll = () => {
      const heroGrid = document.querySelector('.hero-grid');
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <CustomCursor />
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
          <Hero language={language} data={data} />
          <Marquee />
          <TenxyteArchitecture language={language} data={data} />
          <Skills language={language} data={data} />
          <Experience language={language} data={data} />
          <Formation language={language} data={data} />
          <Contact language={language} data={data} />
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
