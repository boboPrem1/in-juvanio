export default function Formation() {
  return (
    <section id="formation" style={{borderTop: '1px solid var(--border)'}}>
      <div className="section-label" data-num="04">Formation</div>
      <h2 className="section-title">Études &amp;<br /><em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent3)'}}>Certifications</em></h2>

      <div className="two-col">
        <div>
          <div className="tenxyte-features">
            <div className="feature-row">
              <div className="feature-icon">🎓</div>
              <div className="feature-info">
                <div className="feature-name">Développeur Web &amp; Mobile — Certifié</div>
                <div className="feature-desc">Energy Generation / Simplon.co — Fév.–Nov. 2022<br />HTML5, CSS3, JS, PHP, Node.js, React, Laravel, Agile</div>
              </div>
              <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>CERTIF</span>
            </div>
            <div className="feature-row">
              <div className="feature-icon">⚡</div>
              <div className="feature-info">
                <div className="feature-name">JavaScript Developer</div>
                <div className="feature-desc">freeCodeCamp — Fév.–Avr. 2022<br />ES6, Algorithmique, POO, Programmation fonctionnelle</div>
              </div>
              <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>CERTIF</span>
            </div>
            <div className="feature-row">
              <div className="feature-icon">📚</div>
              <div className="feature-info">
                <div className="feature-name">Licence Comptabilité–Contrôle–Audit</div>
                <div className="feature-desc">Université de Lomé — 2018–2021<br />Reconversion tech réussie</div>
              </div>
              <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>LICENCE</span>
            </div>
            <div className="feature-row">
              <div className="feature-icon">🏅</div>
              <div className="feature-info">
                <div className="feature-name">Baccalauréat G2 — Mention Assez Bien</div>
                <div className="feature-desc">Institut Polytechnique du Golfe — 2015–2018<br />Comptabilité &amp; Gestion</div>
              </div>
              <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>BAC</span>
            </div>
            <div className="feature-row">
              <div className="feature-icon">📊</div>
              <div className="feature-info">
                <div className="feature-name">Formation SAGE 100 Comptabilité</div>
                <div className="feature-desc">CIGC — Oct.–Nov. 2021</div>
              </div>
              <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>CERTIF</span>
            </div>
          </div>
        </div>
        <div>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginBottom: '24px', letterSpacing: '1px', lineHeight: '1.8'}}>
            Formation continue depuis 2019 — autoformation rigoureuse en parallèle des missions professionnelles.
          </p>
          <div className="tenxyte-features">
            <div className="feature-row">
              <div className="feature-icon">📖</div>
              <div className="feature-info">
                <div className="feature-name">Grokking Algorithms</div>
                <div className="feature-desc">Aditya Bhargava</div>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon">📖</div>
              <div className="feature-info">
                <div className="feature-name">Clean Code</div>
                <div className="feature-desc">Robert C. Martin</div>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon">📖</div>
              <div className="feature-info">
                <div className="feature-name">Architecture Patterns</div>
                <div className="feature-desc">Harry Percival &amp; Bob Gregory</div>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon">🌐</div>
              <div className="feature-info">
                <div className="feature-name">Sololearn · OpenClassrooms · freeCodeCamp</div>
                <div className="feature-desc">HTML, CSS, JS, PHP, Python, Java, SQL, C, C++, Angular, Ionic, Laravel…</div>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon">🏆</div>
              <div className="feature-info">
                <div className="feature-name">Open Code Academy — Summer Camp</div>
                <div className="feature-desc">Woelab — Août 2017<br />Initiation intensive à la programmation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
