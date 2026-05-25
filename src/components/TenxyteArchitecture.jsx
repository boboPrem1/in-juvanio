import DecryptedText from './DecryptedText';

export default function TenxyteArchitecture({ language, data, skin }) {
  const t = data.tenxyte[language] || data.tenxyte.fr;
  const anims = skin?.animations?.decryptedText || {};

  return (
    <section className="tenxyte" id="tenxyte">
      <div className="tenxyte-header">
        <div className="tenxyte-header-left">
          <div className="tenxyte-badge">
            <DecryptedText text={t.badge} />
          </div>
          <h2 className="tenxyte-title">Ten<span className="highlight">xyte</span></h2>
          <p className="tenxyte-desc">
            <DecryptedText text={t.desc} duration={anims.tenxyteDesc || 1200} />
          </p>
          <div className="tenxyte-stats">
            <div className="stat-item">
              <span className="stat-num">{t.statsValues.tests}</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.tests} />
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{t.statsValues.coverage}</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.coverage} />
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{t.statsValues.published}</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.published} />
              </span>
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

      <div className="section-label" data-num="⬡">
        <DecryptedText text={t.label} />
      </div>
      <div className="arch-diagram">
        <div className="arch-layer arch-layer-1">
          <div className="arch-block">
            <div className="arch-block-label"><DecryptedText text={t.layer0.label} /></div>
            <div className="arch-block-name"><DecryptedText text={t.layer0.name} /></div>
            <div className="arch-block-desc"><DecryptedText text={t.layer0.desc} duration={anims.archLayerDesc || 1000} /></div>
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
            <div className="arch-block-desc"><DecryptedText text={t.layer1.airsDesc} duration={anims.archLayerDesc || 1000} /></div>
            <span className="arch-block-tag" style={{color: 'var(--accent2)', borderColor: 'rgba(255,77,109,0.3)', background: 'rgba(255,77,109,0.08)'}}>AI-READY</span>
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
    </section>
  );
}
