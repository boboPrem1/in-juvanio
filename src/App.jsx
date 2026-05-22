import { useState, useEffect } from 'react';
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

function App() {
  const [apiMode, setApiMode] = useState(false);
  const [language, setLanguage] = useState('fr'); // 'fr' ou 'en'
  const [theme, setTheme] = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 8) ? 'dark' : 'light';
  });

  const toggleApiMode = () => {
    setApiMode(!apiMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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

  // Handle global scroll behavior like hero grid parallax
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

  return (
    <>
      <BootSequence />
      <CustomCursor />
      <Navbar apiMode={apiMode} toggleApiMode={toggleApiMode} language={language} toggleLanguage={toggleLanguage} theme={theme} toggleTheme={toggleTheme} />
      
      <ApiView apiMode={apiMode} language={language} />

      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          <Hero language={language} />
          <Marquee />
          <TenxyteArchitecture language={language} />
          <Skills language={language} />
          <Experience language={language} />
          <Formation language={language} />
          <Contact language={language} />
        </main>
        
        <footer>
          <span>© 2026 Amouzougan Kangni Juvanio</span>
          <span><DecryptedText text="Backend Architect" /> · <a href="https://github.com/boboprem1" target="_blank" rel="noreferrer" style={{color: 'var(--muted)', textDecoration: 'none'}}>GitHub</a></span>
          <span><DecryptedText text={language === 'fr' ? "Lomé, Togo 🇹🇬" : "Lome, Togo 🇹🇬"} /></span>
        </footer>
      </div>
    </>
  );
}

export default App;
