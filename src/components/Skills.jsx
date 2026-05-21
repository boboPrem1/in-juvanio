import { useEffect, useRef } from 'react';

export default function Skills() {
  const langsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.lang-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 150);
          });
        }
      });
    }, { threshold: 0.3 });

    if (langsRef.current) {
      observer.observe(langsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills">
      <div className="section-label" data-num="02">Compétences</div>
      <h2 className="section-title">Boîte à<br /><em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}>outils</em></h2>
      <div className="skills-grid">
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-green"></div><div className="led led-yellow"></div></div>
            <span className="skill-rack-id">RACK-01</span>
          </div>
          <span className="skill-card-icon">🏗️</span>
          <div className="skill-card-title">Architecture</div>
          <div className="skill-tags">
            <span className="skill-tag">Microservices</span>
            <span className="skill-tag">DDD</span>
            <span className="skill-tag">Algorithmes</span>
            <span className="skill-tag">Clean Arch.</span>
            <span className="skill-tag">SOLID</span>
            <span className="skill-tag">TDD</span>
            <span className="skill-tag">REST API</span>
            <span className="skill-tag">OpenAPI</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-red"></div><div className="led led-green"></div><div className="led led-green"></div></div>
            <span className="skill-rack-id">RACK-02</span>
          </div>
          <span className="skill-card-icon">🔒</span>
          <div className="skill-card-title">Sécurité</div>
          <div className="skill-tags">
            <span className="skill-tag">OWASP</span>
            <span className="skill-tag">ISO 27001</span>
            <span className="skill-tag">SOC2</span>
            <span className="skill-tag">GDPR</span>
            <span className="skill-tag">AML/KYC</span>
            <span className="skill-tag">JWT</span>
            <span className="skill-tag">RBAC</span>
            <span className="skill-tag">2FA</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-green"></div><div className="led led-green"></div></div>
            <span className="skill-rack-id">RACK-03</span>
          </div>
          <span className="skill-card-icon">⚙️</span>
          <div className="skill-card-title">Backend</div>
          <div className="skill-tags">
            <span className="skill-tag">Python</span>
            <span className="skill-tag">Django</span>
            <span className="skill-tag">FastAPI</span>
            <span className="skill-tag">Node.js</span>
            <span className="skill-tag">NestJS</span>
            <span className="skill-tag">Express</span>
            <span className="skill-tag">PHP</span>
            <span className="skill-tag">Laravel</span>
            <span className="skill-tag">TypeScript</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-yellow"></div><div className="led led-green"></div></div>
            <span className="skill-rack-id">RACK-04</span>
          </div>
          <span className="skill-card-icon">☁️</span>
          <div className="skill-card-title">Cloud &amp; DevOps</div>
          <div className="skill-tags">
            <span className="skill-tag">AWS EC2/S3/LightSail</span>
            <span className="skill-tag">AWS IAM/SES</span>
            <span className="skill-tag">Docker</span>
            <span className="skill-tag">Linux</span>
            <span className="skill-tag">Nginx</span>
            <span className="skill-tag">GitHub Actions</span>
            <span className="skill-tag">GitLab</span>
            <span className="skill-tag">Agile/Scrum</span>
            <span className="skill-tag">Jenkins</span>
            <span className="skill-tag">Kubernetes</span>
            <span className="skill-tag">Terraform</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-green"></div><div className="led led-yellow"></div></div>
            <span className="skill-rack-id">RACK-05</span>
          </div>
          <span className="skill-card-icon">🗄️</span>
          <div className="skill-card-title">Bases de données</div>
          <div className="skill-tags">
            <span className="skill-tag">PostgreSQL</span>
            <span className="skill-tag">MySQL</span>
            <span className="skill-tag">MongoDB</span>
            <span className="skill-tag">Modélisation</span>
            <span className="skill-tag">Optimisation</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-green"></div><div className="led led-green"></div></div>
            <span className="skill-rack-id">RACK-06</span>
          </div>
          <span className="skill-card-icon">🖥️</span>
          <div className="skill-card-title">Frontend</div>
          <div className="skill-tags">
            <span className="skill-tag">React.js</span>
            <span className="skill-tag">Next.js</span>
            <span className="skill-tag">Vue.js</span>
            <span className="skill-tag">Redux</span>
            <span className="skill-tag">Tailwind</span>
            <span className="skill-tag">TypeORM</span>
          </div>
        </div>
        <div className="skill-card" style={{gridColumn: 'span 2'}}>
          <div className="skill-rack-header">
            <div className="skill-rack-leds"><div className="led led-green"></div><div className="led led-green"></div><div className="led led-green"></div></div>
            <span className="skill-rack-id">RACK-07</span>
          </div>
          <span className="skill-card-icon">🌍</span>
          <div className="skill-card-title">Langues</div>
          <div className="langs" ref={langsRef}>
            <div className="lang-item">
              <span className="lang-name">Éwé</span>
              <div className="lang-bar"><div className="lang-fill" style={{width: '100%'}}></div></div>
              <span className="lang-level">Natif</span>
            </div>
            <div className="lang-item">
              <span className="lang-name">Français</span>
              <div className="lang-bar"><div className="lang-fill" style={{width: '100%'}}></div></div>
              <span className="lang-level">Officiel</span>
            </div>
            <div className="lang-item">
              <span className="lang-name">Anglais</span>
              <div className="lang-bar"><div className="lang-fill" style={{width: '85%'}}></div></div>
              <span className="lang-level">Professionnel</span>
            </div>
            <div className="lang-item">
              <span className="lang-name">Allemand</span>
              <div className="lang-bar"><div className="lang-fill" style={{width: '20%'}}></div></div>
              <span className="lang-level">Débutant</span>
            </div>
          </div>
          <div style={{marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px'}}>
            <div className="skill-card-title" style={{fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px'}}>
              Loisirs &amp; Centres d'intérêt
            </div>
            <div className="skill-tags">
              <span className="skill-tag">Musique</span>
              <span className="skill-tag">Écriture</span>
              <span className="skill-tag">Lecture</span>
              <span className="skill-tag">Danse</span>
              <span className="skill-tag">Mangas</span>
              <span className="skill-tag">Arts Martiaux</span>
              <span className="skill-tag">Gymnastique</span>
              <span className="skill-tag">Sports (Football, Basket)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
