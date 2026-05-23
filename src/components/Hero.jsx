import NetworkCanvas from './NetworkCanvas';
import TerminalBackground from './TerminalBackground';
import DecryptedText from './DecryptedText';

export default function Hero({ language, data, skin }) {
  const t = data.hero[language] || data.hero.fr;
  const meta = data.meta;
  const anims = skin?.animations?.decryptedText || {};

  return (
    <section className="hero" id="about">
      <div className="hero-grid"></div>
      <NetworkCanvas />

      <div className="hero-left">
        <div className="hero-tag"><DecryptedText text={t.tag} duration={anims.heroTag || 600} /></div>
        <h1 className="hero-name">
          <span className="line1">Amouzougan</span>
          <span className="line2">Kangni</span>
          <span className="line3">Juvanio</span>
        </h1>
        <p className="hero-title">
          <DecryptedText text={t.title} duration={anims.heroTitle || 700} /><br />
          <span>{t.positioning}</span><br />
          <DecryptedText text={t.founder} duration={anims.heroFounder || 500} /> <span>Tenxyte</span> — <DecryptedText text={t.framework} duration={anims.heroFramework || 600} /><br /><br />
          <DecryptedText text={t.desc} duration={anims.heroDesc || 800} /> <span style={{color: 'var(--accent2)'}}><DecryptedText text={t.leadership} duration={anims.heroLeadership || 600} /></span>.
        </p>
        <div className="hero-cta">
          <a href={`mailto:${meta.contact.email}`} className="btn btn-primary"><DecryptedText text={t.contactBtn} duration={anims.heroBtn || 400} /></a>
          <a href={meta.contact.cv} download className="btn btn-ghost"><DecryptedText text={t.cvBtn} duration={anims.heroBtn || 400} /></a>
          <a href="#experience" className="btn btn-ghost"><DecryptedText text={t.expBtn} duration={anims.heroBtn || 400} /></a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-visual">
          <TerminalBackground />

          <div className="data-ring data-ring-1"><div className="data-packet"></div></div>
          <div className="data-ring data-ring-2"><div className="data-packet"></div></div>
          <div className="data-ring data-ring-3"><div className="data-packet"></div></div>

          <div className="hero-photo-frame">
            <img src={skin?.assets?.heroPhoto || "azerty.jpg"} alt={meta.name} />
          </div>
        </div>
      </div>

      <a href="#tenxyte" className="hero-scroll" style={{textDecoration: 'none'}}><DecryptedText text={t.scroll} duration={anims.heroBtn || 400} /></a>
    </section>
  );
}
