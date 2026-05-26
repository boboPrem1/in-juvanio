import './Hero.css';
import NetworkCanvas      from './NetworkCanvas';
import TerminalBackground from './TerminalBackground';
import DecryptedText      from './DecryptedText';

export default function Hero({ language, data, skin, showNetworkCanvas = true }) {
  const t      = data.hero[language] || data.hero.fr;
  const meta   = data.meta;
  // ✅ Clés normalisées (short/medium/long)
  const anims  = skin?.animations?.decryptedText || {};
  const isReversed = skin?.layout?.heroReversed || false;

  // ✅ nameLines depuis data.meta (tableau générique, pas de nom hardcodé)
  const nameLines = meta.nameLines || [meta.name];

  // ✅ Photo depuis skin.assets (pas de fallback hardcodé "azerty.jpg")
  const heroPhoto = skin?.assets?.heroPhoto;

  return (
    <section className="hero" id="about">
      <div className="hero-grid" />
      {showNetworkCanvas && <NetworkCanvas />}

      <div className="hero-left">
        {/* ✅ medium au lieu de heroTag */}
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
          <span>Tenxyte</span>{' — '}
          <DecryptedText text={t.framework}   duration={anims.medium} /><br /><br />
          <DecryptedText text={t.desc}        duration={anims.long} />{' '}
          <span className="hero-leadership">
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

      <div className="hero-right">
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

      <a href="#tenxyte" className="hero-scroll">
        <DecryptedText text={t.scroll} duration={anims.short} />
      </a>
    </section>
  );
}
