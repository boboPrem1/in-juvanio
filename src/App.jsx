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

function App() {
  const [apiMode, setApiMode] = useState(false);
  const [language, setLanguage] = useState('fr'); // 'fr' ou 'en'

  const toggleApiMode = () => {
    setApiMode(!apiMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

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
      <Navbar apiMode={apiMode} toggleApiMode={toggleApiMode} language={language} toggleLanguage={toggleLanguage} />
      
      <ApiView apiMode={apiMode} />

      <div className={`ui-view ${apiMode ? 'hidden' : ''}`} id="uiView">
        <main>
          <Hero language={language} />
          <Marquee />
          <TenxyteArchitecture language={language} />
          <Skills />
          <Experience />
          <Formation />
          <Contact />
        </main>
        
        <footer>
          <span>© 2026 Amouzougan Kangni Juvanio</span>
          <span>Backend Architect · <a href="https://github.com/boboprem1" target="_blank" rel="noreferrer" style={{color: 'var(--muted)', textDecoration: 'none'}}>GitHub</a></span>
          <span>Lomé, Togo 🇹🇬</span>
        </footer>
      </div>
    </>
  );
}

export default App;
