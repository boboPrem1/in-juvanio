import NetworkCanvas from './NetworkCanvas';
import TerminalBackground from './TerminalBackground';

export default function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero-grid"></div>
      <NetworkCanvas />

      <div className="hero-left">
        <div className="hero-tag">Backend Architect · DevSecOps · AI-Ready</div>
        <h1 className="hero-name">
          <span className="line1">Amouzougan</span>
          <span className="line2">Kangni</span>
          <span className="line3">Juvanio</span>
        </h1>
        <p className="hero-title">
          Ingénieur Senior Spécialisé Backend &amp; Sécurité<br />
          <span>Django · NestJS · Laravel · DevSecOps</span><br />
          Fondateur de <span>Tenxyte</span> — Framework Open Source<br /><br />
          Habitué à intervenir en autonomie complète — de la conception à la mise en production — aussi bien en solo qu'en <span style={{color: 'var(--accent2)'}}>leadership technique d'équipe</span>.
        </p>
        <div className="hero-cta">
          <a href="mailto:jamouzougan@gmail.com" className="btn btn-primary">Me contacter</a>
          <a href="G_Curriculum_Vitae.pdf" download className="btn btn-ghost">Télécharger CV</a>
          <a href="#experience" className="btn btn-ghost">Voir l'expérience</a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-visual">
          <TerminalBackground />

          <div className="data-ring data-ring-1"><div className="data-packet"></div></div>
          <div className="data-ring data-ring-2"><div className="data-packet"></div></div>
          <div className="data-ring data-ring-3"><div className="data-packet"></div></div>

          <div className="hero-photo-frame">
            <img src="azerty.jpg" alt="Amouzougan Kangni Juvanio" />
          </div>
        </div>
      </div>

      <a href="#tenxyte" className="hero-scroll" style={{textDecoration: 'none'}}>Scroll</a>
    </section>
  );
}
