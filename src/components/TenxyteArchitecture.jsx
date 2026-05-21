export default function TenxyteArchitecture() {
  return (
    <section className="tenxyte" id="tenxyte">
      <div className="tenxyte-header">
        <div className="tenxyte-header-left">
          <div className="tenxyte-badge">Projet Phare · Open Source</div>
          <h2 className="tenxyte-title">Ten<span className="highlight">xyte</span></h2>
          <p className="tenxyte-desc">
            Framework Python open-source d'authentification &amp; sécurité production-ready. Conçu pour des backends
            exposés à des agents IA, avec un module AIRS dédié à la sécurité des interactions entre IA et systèmes
            critiques.
          </p>
          <div className="tenxyte-stats">
            <div className="stat-item">
              <span className="stat-num">2 300+</span>
              <span className="stat-label">Tests Auto.</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">~100%</span>
              <span className="stat-label">Couverture</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">PyPi</span>
              <span className="stat-label">Publié</span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="https://pypi.org/project/tenxyte/" target="_blank" rel="noreferrer" className="btn btn-primary">PyPi Package</a>
            <a href="https://tenxyte.readthedocs.io" target="_blank" rel="noreferrer" className="btn btn-ghost">Documentation</a>
          </div>
        </div>
      </div>

      <div className="section-label" data-num="⬡">Architecture Blueprint</div>
      <div className="arch-diagram">
        <div className="arch-layer arch-layer-1">
          <div className="arch-block">
            <div className="arch-block-label">Layer 0 — Entrypoint</div>
            <div className="arch-block-name">Client / Agent IA</div>
            <div className="arch-block-desc">Frontend, Mobile App, LLM Agent, Service Externe</div>
            <span className="arch-block-tag">HTTPS · TLS 1.3</span>
          </div>
        </div>

        <div className="arch-arrow">▼ ▼ ▼</div>

        <div className="arch-layer arch-layer-2">
          <div className="arch-block">
            <div className="arch-block-label">Middleware</div>
            <div className="arch-block-name">🔐 Auth Engine</div>
            <div className="arch-block-desc">JWT · RBAC · 2FA · WebAuthn</div>
            <span className="arch-block-tag">AUTH</span>
          </div>
          <div className="arch-block airs">
            <div className="arch-block-label">Middleware — AI Security</div>
            <div className="arch-block-name">🤖 Module AIRS</div>
            <div className="arch-block-desc">Prompt injection defense, rate limiting par intent, audit trail IA</div>
            <span className="arch-block-tag" style={{color: 'var(--accent2)', borderColor: 'rgba(255,77,109,0.3)', background: 'rgba(255,77,109,0.08)'}}>AI-READY</span>
          </div>
          <div className="arch-block">
            <div className="arch-block-label">Middleware</div>
            <div className="arch-block-name">🛡️ Security Layer</div>
            <div className="arch-block-desc">OWASP · CORS · Rate Limit · CSRF · XSS</div>
            <span className="arch-block-tag">SECURITY</span>
          </div>
        </div>

        <div className="arch-arrow">▼ ▼ ▼</div>

        <div className="arch-layer arch-layer-3">
          <div className="arch-block">
            <div className="arch-block-label">Core</div>
            <div className="arch-block-name">⚙️ API Gateway</div>
            <div className="arch-block-desc">REST APIs · OpenAPI · Validation · Serialization</div>
            <span className="arch-block-tag">CORE</span>
          </div>
          <div className="arch-block">
            <div className="arch-block-label">Core</div>
            <div className="arch-block-name">🧩 Business Logic</div>
            <div className="arch-block-desc">Clean Architecture · DDD · SOLID · Services</div>
            <span className="arch-block-tag">DOMAIN</span>
          </div>
        </div>

        <div className="arch-arrow">▼ ▼ ▼</div>

        <div className="arch-layer arch-layer-4">
          <div className="arch-block">
            <div className="arch-block-label">Persistence</div>
            <div className="arch-block-name">🗄️ PostgreSQL</div>
            <div className="arch-block-desc">Primary store</div>
            <span className="arch-block-tag">SQL</span>
          </div>
          <div className="arch-block">
            <div className="arch-block-label">Persistence</div>
            <div className="arch-block-name">🍃 MongoDB</div>
            <div className="arch-block-desc">Document store</div>
            <span className="arch-block-tag">NOSQL</span>
          </div>
          <div className="arch-block">
            <div className="arch-block-label">Persistence</div>
            <div className="arch-block-name">🐬 MySQL</div>
            <div className="arch-block-desc">Relational store</div>
            <span className="arch-block-tag">SQL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
