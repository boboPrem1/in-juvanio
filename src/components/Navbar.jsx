import { useState } from 'react';

export default function Navbar({ apiMode, toggleApiMode, language, toggleLanguage, theme, toggleTheme, navData }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  const t = navData || {};

  return (
    <>
      <button
        className={`nav-toggle ${isOpen ? 'open' : ''}`}
        id="navToggle"
        aria-label="Menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <span></span><span></span><span></span>
      </button>

      <nav id="mainNav" className={isOpen ? 'open' : ''}>
        <a href="#about" onClick={closeNav}>{t.profil || 'Profil'}</a>
        <a href="#tenxyte" onClick={closeNav}>{t.tenxyte || 'Tenxyte'}</a>
        <a href="#skills" onClick={closeNav}>{t.skills || 'Skills'}</a>
        <a href="#experience" onClick={closeNav}>{t.experience || 'Expérience'}</a>
        <a href="#contact" onClick={closeNav}>{t.contact || 'Contact'}</a>

        <div className="nav-toggles">
          {/* Theme Toggle */}
          <div className="api-toggle" style={{ borderLeft: 'none', paddingLeft: 0, marginLeft: 0 }}>
            <span className={`api-toggle-label ${theme === 'dark' ? 'active' : ''}`}>{t.dark || 'DARK'}</span>
            <div
              className={`api-toggle-switch ${theme === 'light' ? 'active' : ''}`}
              role="switch"
              aria-checked={theme === 'light'}
              tabIndex="0"
              onClick={toggleTheme}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }}}
            ></div>
            <span className={`api-toggle-label ${theme === 'light' ? 'active' : ''}`}>{t.light || 'LIGHT'}</span>
          </div>

          {/* Language Toggle */}
          <div className="api-toggle">
            <span className={`api-toggle-label ${language === 'fr' ? 'active' : ''}`}>FR</span>
            <div
              className={`api-toggle-switch ${language === 'en' ? 'active' : ''}`}
              role="switch"
              aria-checked={language === 'en'}
              tabIndex="0"
              onClick={toggleLanguage}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLanguage(); }}}
            ></div>
            <span className={`api-toggle-label ${language === 'en' ? 'active' : ''}`}>EN</span>
          </div>

          {/* UI/API Toggle */}
          <div className="api-toggle" id="apiToggle">
            <span className={`api-toggle-label ${!apiMode ? 'active' : ''}`} id="labelUI">UI</span>
            <div
              className={`api-toggle-switch ${apiMode ? 'active' : ''}`}
              id="apiSwitch"
              role="switch"
              aria-checked={apiMode}
              tabIndex="0"
              onClick={toggleApiMode}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleApiMode(); }}}
            ></div>
            <span className={`api-toggle-label ${apiMode ? 'active' : ''}`} id="labelAPI">API</span>
          </div>
        </div>
      </nav>
    </>
  );
}
