import { useEffect, useRef } from 'react';

export default function Experience() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay || '0', 10));
        }
      });
    }, { threshold: 0.15 });

    if (containerRef.current) {
      const commits = containerRef.current.querySelectorAll('.git-commit');
      commits.forEach((el, i) => {
        el.dataset.delay = String(i * 100);
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="experience" id="experience">
      <div className="section-label" data-num="03">Parcours</div>
      <h2 className="section-title">Expérience<br /><em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}>Professionnelle</em></h2>

      <div className="git-timeline" ref={containerRef}>
        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">a7f3e1d</div>
            <span className="git-date">Sept. 2025 → Auj.</span>
            <div className="git-company">Tenxyte</div>
          </div>
          <div className="git-content">
            <div className="git-role">Founder &amp; <span style={{color: 'var(--accent)', borderBottom: '1px dashed var(--accent)'}}>Lead Engineer</span></div>
            <p className="git-desc">Conception d'un framework open-source Python dédié à l'architecture backend AI-ready production-grade.</p>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> Conception orientée expérience développeur (DX) et mise en œuvre de patterns backend scalables</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Abstractions framework pour la gestion des APIs et flux d'authentification avancés</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Module AIRS — protection contre prompt injection, rate limiting par intent, audit trail IA</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Suite complète : 2 300+ tests unitaires, intégration et validation multi-DB</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Publication PyPi + documentation complète sur ReadTheDocs</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Pipelines CI/CD pour qualité, stabilité et déploiement continu</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">c9b2d4f</div>
            <span className="git-date">Août 2025 → Jan. 2026</span>
            <div className="git-company">MTN Bénin</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Consultant Fullstack</div>
            <p className="git-desc">Solutions numériques internes à forte exigence de performance et fiabilité — Systèmes Télécoms &amp; Gestion Contractuelle.</p>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> Application USSD pour consultation des consommations télécoms (voix, data, SMS)</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Backend Python de surveillance et notification de trafic</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Plateforme de gestion du cycle de vie des contrats — workflows multi-acteurs, gestion d'états complexes</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Déploiement et optimisation de services backend avec exigences de performance élevées</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">e1a8f5c</div>
            <span className="git-date">Oct. 2023 → Juil. 2025</span>
            <div className="git-company">Expand in Africa</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Fullstack &amp; <span style={{color: 'var(--accent2)', borderBottom: '1px dashed var(--accent2)'}}>CTO</span> — Remote <span className="git-role-badge">LEAD</span></div>
            <p className="git-desc">Responsable technique de plusieurs plateformes numériques africaines.</p>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> possible.africa — plateforme digitale avec front-office, back-office et APIs sécurisées</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> CRM avancé (Pyramide Africa) — pipelines commerciaux, intégrations API, automatisation emails</div>
              <div className="git-change"><span className="git-change-prefix mod">M</span> Architecture applicative, déploiement cloud et sécurité end-to-end</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">b4d7e2a</div>
            <span className="git-date">Jan. 2024 → Juil. 2024</span>
            <div className="git-company">Holam</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Fullstack &amp; <span style={{color: 'var(--accent2)', borderBottom: '1px dashed var(--accent2)'}}>CTO</span> — Mission Parallèle <span className="git-role-badge">LEAD</span></div>
            <p className="git-desc">Backend et back-office de l'application mobile de signalement urbain.</p>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> APIs sécurisées pour la gestion d'incidents urbains</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Back Office avancé avec Laravel Filament</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Services de géolocalisation et triangulation GPS</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Système OTP mobile + intégration paiements FedaPay</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">f2c9a1b</div>
            <span className="git-date">Avr. → Oct. 2023</span>
            <div className="git-company">Pandore</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Fullstack</div>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> Back-office et APIs de possible.africa</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Projets web React, Node.js et Drupal en environnement agile</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">d8e4b3f</div>
            <span className="git-date">Oct. 2022 → Mars 2023</span>
            <div className="git-company">Tarzan · LoveAfrica · ElyDesign</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Fullstack</div>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> Back-office Tarzan Mall — Laravel &amp; Livewire (CRUD, rôles, chat intégré)</div>
              <div className="git-change"><span className="git-change-prefix mod">M</span> Refonte plateforme restaurants — React, Next.js, MySQL, Redux, TypeORM</div>
              <div className="git-change"><span className="git-change-prefix add">+</span> Déploiement Vercel &amp; AWS LightSail en cadre agile</div>
            </div>
          </div>
        </div>

        <div className="git-commit">
          <div className="git-meta">
            <div className="git-hash">a1b2c3d</div>
            <span className="git-date">Oct. → Nov. 2020</span>
            <div className="git-company">Nunyalab · Tech4Rights</div>
          </div>
          <div className="git-content">
            <div className="git-role">Développeur Mobile (Hackathon)</div>
            <div className="git-changes">
              <div className="git-change"><span className="git-change-prefix add">+</span> Développement d'application mobile (Spécifications, tests, correction de bugs)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
