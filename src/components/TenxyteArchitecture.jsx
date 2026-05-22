import DecryptedText from './DecryptedText';

const translations = {
  fr: {
    badge: "Projet Phare · Open Source",
    desc: "Framework Python open-source d'authentification & sécurité production-ready. Conçu pour des backends exposés à des agents IA, avec un module AIRS dédié à la sécurité des interactions entre IA et systèmes critiques.",
    stats: {
      tests: "Tests Auto.",
      coverage: "Couverture",
      published: "Publié"
    },
    cta: {
      package: "PyPi Package",
      docs: "Documentation"
    },
    label: "Architecture Blueprint",
    layer0: {
      label: "Layer 0 — Entrypoint",
      name: "Client / Agent IA",
      desc: "Frontend, Mobile App, LLM Agent, Service Externe"
    },
    layer1: {
      authLabel: "Middleware",
      authName: "🔐 Auth Engine",
      authDesc: "JWT · RBAC · 2FA · WebAuthn",
      airsLabel: "Middleware — AI Security",
      airsName: "🤖 Module AIRS",
      airsDesc: "Prompt injection defense, rate limiting par intent, audit trail IA",
      secLabel: "Middleware",
      secName: "🛡️ Security Layer",
      secDesc: "OWASP · CORS · Rate Limit · CSRF · XSS"
    },
    layer2: {
      apiLabel: "Core",
      apiName: "⚙️ API Gateway",
      apiDesc: "REST APIs · OpenAPI · Validation · Serialization",
      bizLabel: "Core",
      bizName: "🧩 Business Logic",
      bizDesc: "Clean Architecture · DDD · SOLID · Services"
    },
    layer3: {
      persistLabel: "Persistence",
      pgName: "🗄️ PostgreSQL",
      pgDesc: "Primary store",
      mongoName: "🍃 MongoDB",
      mongoDesc: "Document store",
      mysqlName: "🐬 MySQL",
      mysqlDesc: "Relational store"
    }
  },
  en: {
    badge: "Flagship Project · Open Source",
    desc: "Production-ready open-source Python authentication & security framework. Designed for backends exposed to AI agents, featuring a dedicated AIRS module for securing AI-system interactions.",
    stats: {
      tests: "Auto Tests",
      coverage: "Coverage",
      published: "Published"
    },
    cta: {
      package: "PyPi Package",
      docs: "Documentation"
    },
    label: "Architecture Blueprint",
    layer0: {
      label: "Layer 0 — Entrypoint",
      name: "Client / AI Agent",
      desc: "Frontend, Mobile App, LLM Agent, External Service"
    },
    layer1: {
      authLabel: "Middleware",
      authName: "🔐 Auth Engine",
      authDesc: "JWT · RBAC · 2FA · WebAuthn",
      airsLabel: "Middleware — AI Security",
      airsName: "🤖 AIRS Module",
      airsDesc: "Prompt injection defense, intent-based rate limiting, AI audit trail",
      secLabel: "Middleware",
      secName: "🛡️ Security Layer",
      secDesc: "OWASP · CORS · Rate Limit · CSRF · XSS"
    },
    layer2: {
      apiLabel: "Core",
      apiName: "⚙️ API Gateway",
      apiDesc: "REST APIs · OpenAPI · Validation · Serialization",
      bizLabel: "Core",
      bizName: "🧩 Business Logic",
      bizDesc: "Clean Architecture · DDD · SOLID · Services"
    },
    layer3: {
      persistLabel: "Persistence",
      pgName: "🗄️ PostgreSQL",
      pgDesc: "Primary store",
      mongoName: "🍃 MongoDB",
      mongoDesc: "Document store",
      mysqlName: "🐬 MySQL",
      mysqlDesc: "Relational store"
    }
  }
};

export default function TenxyteArchitecture({ language = 'fr' }) {
  const t = translations[language] || translations.fr;

  return (
    <section className="tenxyte" id="tenxyte">
      <div className="tenxyte-header">
        <div className="tenxyte-header-left">
          <div className="tenxyte-badge">
            <DecryptedText text={t.badge} />
          </div>
          <h2 className="tenxyte-title">Ten<span className="highlight">xyte</span></h2>
          <p className="tenxyte-desc">
            <DecryptedText text={t.desc} duration={1200} />
          </p>
          <div className="tenxyte-stats">
            <div className="stat-item">
              <span className="stat-num">2 300+</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.tests} />
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-num">~100%</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.coverage} />
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-num">PyPi</span>
              <span className="stat-label">
                <DecryptedText text={t.stats.published} />
              </span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="https://pypi.org/project/tenxyte/" target="_blank" rel="noreferrer" className="btn btn-primary">
              <DecryptedText text={t.cta.package} />
            </a>
            <a href="https://tenxyte.readthedocs.io" target="_blank" rel="noreferrer" className="btn btn-ghost">
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
            <div className="arch-block-desc"><DecryptedText text={t.layer0.desc} duration={1000} /></div>
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
            <div className="arch-block-desc"><DecryptedText text={t.layer1.airsDesc} duration={1000} /></div>
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
