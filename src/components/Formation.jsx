import DecryptedText from './DecryptedText';

export default function Formation({ language, data }) {
  const t = data.formation[language] || data.formation.fr;

  return (
    <section id="formation" style={{borderTop: '1px solid var(--border)'}}>
      <div className="section-label" data-num={t.sectionNum}><DecryptedText text={t.sectionLabel} /></div>
      <h2 className="section-title">
        <DecryptedText text={t.title1} /><br />
        <em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent3)'}}><DecryptedText text={t.title2} /></em>
      </h2>

      <div className="two-col">
        <div>
          <div className="tenxyte-features">
            {t.features1.map((feat, idx) => (
              <div className="feature-row" key={idx}>
                <div className="feature-icon">{feat.icon}</div>
                <div className="feature-info">
                  <div className="feature-name"><DecryptedText text={feat.name} /></div>
                  <div className="feature-desc">
                    {feat.desc.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        <DecryptedText text={line} duration={1200} />
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="feature-tag" style={{color: 'var(--accent3)', borderColor: 'rgba(255,209,102,0.2)'}}>
                  <DecryptedText text={feat.tag} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginBottom: '24px', letterSpacing: '1px', lineHeight: '1.8'}}>
            <DecryptedText text={t.p1} duration={1500} />
          </p>
          <div className="tenxyte-features">
            {t.features2.map((feat, idx) => (
              <div className="feature-row" key={idx}>
                <div className="feature-icon">{feat.icon}</div>
                <div className="feature-info">
                  <div className="feature-name"><DecryptedText text={feat.name} /></div>
                  <div className="feature-desc">
                    {feat.desc.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        <DecryptedText text={line} duration={1200} />
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
