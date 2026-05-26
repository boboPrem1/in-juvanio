// src/components/TenxyteShowcase.jsx
// Renommé depuis components/TenxyteArchitecture.jsx — clé registry : TenxyteShowcase
import './TenxyteArchitecture.css';
import DecryptedText   from './shared/DecryptedText';
import AnimatedSection from './shared/AnimatedSection';
import { useGlitchText } from '../hooks/useGlitchText';

export default function TenxyteShowcase({ language, data, skin, glitchBadge = false }) {
  const t = data.tenxyte[language] || data.tenxyte.fr;
  const d = skin?.animations?.durations || {};

  const { displayText: badgeText, glitchHandlers } = useGlitchText(t.badge, {
    intensity: glitchBadge ? (skin?.animations?.glitch?.intensity ?? 0.4) : 0,
    frequency: skin?.animations?.glitch?.frequency ?? 200,
  });

  return (
    <section className="tenxyte" id="tenxyte">

      <AnimatedSection animation="fadeUp">
        <div className="tenxyte-header">
          <div className="tenxyte-header-left">
            <div className="tenxyte-badge" {...glitchHandlers} style={{ cursor: 'default' }}>
              {badgeText}
            </div>
            <h2 className="tenxyte-title">Ten<span className="highlight">xyte</span></h2>
            <p className="tenxyte-desc">
              <DecryptedText text={t.desc} duration={d.long ?? 1200} />
            </p>
            <div className="tenxyte-stats">
              <div className="stat-item">
                <span className="stat-num">{t.statsValues.tests}</span>
                <span className="stat-label"><DecryptedText text={t.stats.tests} /></span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{t.statsValues.coverage}</span>
                <span className="stat-label"><DecryptedText text={t.stats.coverage} /></span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{t.statsValues.published}</span>
                <span className="stat-label"><DecryptedText text={t.stats.published} /></span>
              </div>
            </div>
            <div className="hero-cta">
              <a href={data.meta.contact.pypi} target="_blank" rel="noreferrer" className="btn btn-primary">
                <DecryptedText text={t.cta.package} />
              </a>
              <a href={data.tenxyte?.docsUrl || 'https://tenxyte.readthedocs.io'} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <DecryptedText text={t.cta.docs} />
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" delay={100}>
        <div className="section-label" data-num="⬡">
          <DecryptedText text={t.label} />
        </div>
        <div className="arch-diagram">
          <div className="arch-layer arch-layer-1">
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer0.label} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer0.name} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer0.desc} duration={d.medium ?? 800} /></div>
              <span className="arch-block-tag">HTTPS · TLS 1.3</span>
            </div>
          </div>

          <div className="arch-arrow">▼ ▼ ▼</div>

          <div className="arch-layer arch-layer-2">
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer1.authLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer1.authName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer1.authDesc} /></div>
              <span className="arch-block-tag">AUTH</span>
            </div>
            <div className="arch-block airs">
              <div className="arch-block-label"><DecryptedText text={t.layer1.airsLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer1.airsName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer1.airsDesc} duration={d.medium ?? 800} /></div>
              <span className="arch-block-tag arch-block-tag--airs">AI-READY</span>
            </div>
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer1.secLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer1.secName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer1.secDesc} /></div>
              <span className="arch-block-tag">SECURITY</span>
            </div>
          </div>

          <div className="arch-arrow">▼ ▼ ▼</div>

          <div className="arch-layer arch-layer-3">
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer2.apiLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer2.apiName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer2.apiDesc} /></div>
              <span className="arch-block-tag">CORE</span>
            </div>
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer2.bizLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer2.bizName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer2.bizDesc} /></div>
              <span className="arch-block-tag">DOMAIN</span>
            </div>
          </div>

          <div className="arch-arrow">▼ ▼ ▼</div>

          <div className="arch-layer arch-layer-4">
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer3.persistLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer3.pgName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer3.pgDesc} /></div>
              <span className="arch-block-tag">SQL</span>
            </div>
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer3.persistLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer3.mongoName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer3.mongoDesc} /></div>
              <span className="arch-block-tag">NOSQL</span>
            </div>
            <div className="arch-block">
              <div className="arch-block-label"><DecryptedText text={t.layer3.persistLabel} /></div>
              <div className="arch-block-name"><DecryptedText text={t.layer3.mysqlName} /></div>
              <div className="arch-block-desc"><DecryptedText text={t.layer3.mysqlDesc} /></div>
              <span className="arch-block-tag">SQL</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

    </section>
  );
}
