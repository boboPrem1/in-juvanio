// src/components/formation/FormationGrid.jsx
// Renommé depuis components/Formation.jsx — imports ajustés
import '../Formation.css';
import DecryptedText from '../shared/DecryptedText';

export default function FormationGrid({ language, data, skin }) {
  const t = data.formation[language] || data.formation.fr;
  const anims = skin?.animations?.decryptedText || {};

  return (
    <section id="formation">
      <div className="section-label" data-num={t.sectionNum}><DecryptedText text={t.sectionLabel} /></div>
      <h2 className="section-title">
        <DecryptedText text={t.title1} /><br />
        <em className="formation-title-em"><DecryptedText text={t.title2} /></em>
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
                        <DecryptedText text={line} duration={anims.formationDesc || 1200} />
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="feature-tag feature-tag--accent3">
                  <DecryptedText text={feat.tag} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="formation-intro-text">
            <DecryptedText text={t.p1} duration={anims.formationP1 || 1500} />
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
                        <DecryptedText text={line} duration={anims.formationDesc || 1200} />
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
