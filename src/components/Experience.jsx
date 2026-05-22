import { useEffect, useRef } from 'react';
import DecryptedText from './DecryptedText';

const translations = {
  fr: {
    sectionNum: "03",
    sectionLabel: "Parcours",
    title1: "Expérience",
    title2: "Professionnelle",
    jobs: [
      {
        hash: "a7f3e1d",
        date: "Sept. 2025 → Auj.",
        company: "Tenxyte",
        isRoleSplit: true,
        rolePrefix: "Founder & ",
        roleHighlight: "Lead Engineer",
        roleSuffix: "",
        role: "Founder & Lead Engineer",
        desc: "Conception d'un framework open-source Python dédié à l'architecture backend AI-ready production-grade.",
        changes: [
          { type: "add", symbol: "+", text: "Conception orientée expérience développeur (DX) et mise en œuvre de patterns backend scalables" },
          { type: "add", symbol: "+", text: "Abstractions framework pour la gestion des APIs et flux d'authentification avancés" },
          { type: "add", symbol: "+", text: "Module AIRS — protection contre prompt injection, rate limiting par intent, audit trail IA" },
          { type: "add", symbol: "+", text: "Suite complète : 2 300+ tests unitaires, intégration et validation multi-DB" },
          { type: "add", symbol: "+", text: "Publication PyPi + documentation complète sur ReadTheDocs" },
          { type: "add", symbol: "+", text: "Pipelines CI/CD pour qualité, stabilité et déploiement continu" }
        ]
      },
      {
        hash: "c9b2d4f",
        date: "Août 2025 → Jan. 2026",
        company: "MTN Bénin",
        isRoleSplit: false,
        role: "Développeur Consultant Fullstack",
        desc: "Solutions numériques internes à forte exigence de performance et fiabilité — Systèmes Télécoms & Gestion Contractuelle.",
        changes: [
          { type: "add", symbol: "+", text: "Application USSD pour consultation des consommations télécoms (voix, data, SMS)" },
          { type: "add", symbol: "+", text: "Backend Python de surveillance et notification de trafic" },
          { type: "add", symbol: "+", text: "Plateforme de gestion du cycle de vie des contrats — workflows multi-acteurs, gestion d'états complexes" },
          { type: "add", symbol: "+", text: "Déploiement et optimisation de services backend avec exigences de performance élevées" }
        ]
      },
      {
        hash: "e1a8f5c",
        date: "Oct. 2023 → Juil. 2025",
        company: "Expand in Africa",
        isRoleSplit: true,
        rolePrefix: "Développeur Fullstack & ",
        roleHighlight: "CTO",
        roleSuffix: " — Remote",
        badge: "LEAD",
        role: "Développeur Fullstack & CTO — Remote",
        desc: "Responsable technique de plusieurs plateformes numériques africaines.",
        changes: [
          { type: "add", symbol: "+", text: "possible.africa — plateforme digitale avec front-office, back-office et APIs sécurisées" },
          { type: "add", symbol: "+", text: "CRM avancé (Pyramide Africa) — pipelines commerciaux, intégrations API, automatisation emails" },
          { type: "mod", symbol: "M", text: "Architecture applicative, déploiement cloud et sécurité end-to-end" }
        ]
      },
      {
        hash: "b4d7e2a",
        date: "Jan. 2024 → Juil. 2024",
        company: "Holam",
        isRoleSplit: true,
        rolePrefix: "Développeur Fullstack & ",
        roleHighlight: "CTO",
        roleSuffix: " — Mission Parallèle",
        badge: "LEAD",
        role: "Développeur Fullstack & CTO — Mission Parallèle",
        desc: "Backend et back-office de l'application mobile de signalement urbain.",
        changes: [
          { type: "add", symbol: "+", text: "APIs sécurisées pour la gestion d'incidents urbains" },
          { type: "add", symbol: "+", text: "Back Office avancé avec Laravel Filament" },
          { type: "add", symbol: "+", text: "Services de géolocalisation et triangulation GPS" },
          { type: "add", symbol: "+", text: "Système OTP mobile + intégration paiements FedaPay" }
        ]
      },
      {
        hash: "f2c9a1b",
        date: "Avr. → Oct. 2023",
        company: "Pandore",
        isRoleSplit: false,
        role: "Développeur Fullstack",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Back-office et APIs de possible.africa" },
          { type: "add", symbol: "+", text: "Projets web React, Node.js et Drupal en environnement agile" }
        ]
      },
      {
        hash: "d8e4b3f",
        date: "Oct. 2022 → Mars 2023",
        company: "Tarzan · LoveAfrica · ElyDesign",
        isRoleSplit: false,
        role: "Développeur Fullstack",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Back-office Tarzan Mall — Laravel & Livewire (CRUD, rôles, chat intégré)" },
          { type: "mod", symbol: "M", text: "Refonte plateforme restaurants — React, Next.js, MySQL, Redux, TypeORM" },
          { type: "add", symbol: "+", text: "Déploiement Vercel & AWS LightSail en cadre agile" }
        ]
      },
      {
        hash: "a1b2c3d",
        date: "Oct. → Nov. 2020",
        company: "Nunyalab · Tech4Rights",
        isRoleSplit: false,
        role: "Développeur Mobile (Hackathon)",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Développement d'application mobile (Spécifications, tests, correction de bugs)" }
        ]
      }
    ]
  },
  en: {
    sectionNum: "03",
    sectionLabel: "Journey",
    title1: "Professional",
    title2: "Experience",
    jobs: [
      {
        hash: "a7f3e1d",
        date: "Sept. 2025 → Pres.",
        company: "Tenxyte",
        isRoleSplit: true,
        rolePrefix: "Founder & ",
        roleHighlight: "Lead Engineer",
        roleSuffix: "",
        role: "Founder & Lead Engineer",
        desc: "Design and development of an open-source Python framework dedicated to AI-ready, production-grade backend architecture.",
        changes: [
          { type: "add", symbol: "+", text: "DX-focused design and implementation of scalable backend patterns" },
          { type: "add", symbol: "+", text: "Framework abstractions for API management and advanced authentication flows" },
          { type: "add", symbol: "+", text: "AIRS Module — prompt injection defense, intent-based rate limiting, AI audit trail" },
          { type: "add", symbol: "+", text: "Complete test suite: 2,300+ unit/integration tests and multi-DB validation" },
          { type: "add", symbol: "+", text: "PyPi publication + full documentation on ReadTheDocs" },
          { type: "add", symbol: "+", text: "CI/CD pipelines ensuring quality, stability, and continuous deployment" }
        ]
      },
      {
        hash: "c9b2d4f",
        date: "Aug. 2025 → Jan. 2026",
        company: "MTN Benin",
        isRoleSplit: false,
        role: "Fullstack Consultant Developer",
        desc: "Internal digital solutions with high performance and reliability requirements — Telecom Systems & Contract Management.",
        changes: [
          { type: "add", symbol: "+", text: "USSD app for querying telecom consumption (voice, data, SMS)" },
          { type: "add", symbol: "+", text: "Python backend for traffic monitoring and notifications" },
          { type: "add", symbol: "+", text: "Contract lifecycle management platform — multi-actor workflows, complex state management" },
          { type: "add", symbol: "+", text: "Deployment and optimization of high-performance backend services" }
        ]
      },
      {
        hash: "e1a8f5c",
        date: "Oct. 2023 → Jul. 2025",
        company: "Expand in Africa",
        isRoleSplit: true,
        rolePrefix: "Fullstack Developer & ",
        roleHighlight: "CTO",
        roleSuffix: " — Remote",
        badge: "LEAD",
        role: "Fullstack Developer & CTO — Remote",
        desc: "Technical lead for multiple African digital platforms.",
        changes: [
          { type: "add", symbol: "+", text: "possible.africa — digital platform with front-office, back-office, and secure APIs" },
          { type: "add", symbol: "+", text: "Advanced CRM (Pyramide Africa) — sales pipelines, API integrations, email automation" },
          { type: "mod", symbol: "M", text: "Application architecture, cloud deployment, and end-to-end security" }
        ]
      },
      {
        hash: "b4d7e2a",
        date: "Jan. 2024 → Jul. 2024",
        company: "Holam",
        isRoleSplit: true,
        rolePrefix: "Fullstack Developer & ",
        roleHighlight: "CTO",
        roleSuffix: " — Parallel Mission",
        badge: "LEAD",
        role: "Fullstack Developer & CTO — Parallel Mission",
        desc: "Backend and back-office for an urban incident reporting mobile app.",
        changes: [
          { type: "add", symbol: "+", text: "Secure APIs for urban incident management" },
          { type: "add", symbol: "+", text: "Advanced Back Office using Laravel Filament" },
          { type: "add", symbol: "+", text: "Geolocation services and GPS triangulation" },
          { type: "add", symbol: "+", text: "Mobile OTP system + FedaPay payment integration" }
        ]
      },
      {
        hash: "f2c9a1b",
        date: "Apr. → Oct. 2023",
        company: "Pandore",
        isRoleSplit: false,
        role: "Fullstack Developer",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Back-office and APIs for possible.africa" },
          { type: "add", symbol: "+", text: "React, Node.js, and Drupal web projects in an agile environment" }
        ]
      },
      {
        hash: "d8e4b3f",
        date: "Oct. 2022 → Mar. 2023",
        company: "Tarzan · LoveAfrica · ElyDesign",
        isRoleSplit: false,
        role: "Fullstack Developer",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Tarzan Mall back-office — Laravel & Livewire (CRUD, roles, built-in chat)" },
          { type: "mod", symbol: "M", text: "Restaurant platform overhaul — React, Next.js, MySQL, Redux, TypeORM" },
          { type: "add", symbol: "+", text: "Vercel & AWS LightSail deployment in an agile setting" }
        ]
      },
      {
        hash: "a1b2c3d",
        date: "Oct. → Nov. 2020",
        company: "Nunyalab · Tech4Rights",
        isRoleSplit: false,
        role: "Mobile Developer (Hackathon)",
        desc: "",
        changes: [
          { type: "add", symbol: "+", text: "Mobile application development (Specifications, testing, bug fixing)" }
        ]
      }
    ]
  }
};

export default function Experience({ language = 'fr' }) {
  const containerRef = useRef(null);
  const t = translations[language] || translations.fr;

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
      <div className="section-label" data-num={t.sectionNum}>
        <DecryptedText text={t.sectionLabel} />
      </div>
      <h2 className="section-title">
        <DecryptedText text={t.title1} /><br />
        <em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}>
          <DecryptedText text={t.title2} />
        </em>
      </h2>

      <div className="git-timeline" ref={containerRef}>
        {t.jobs.map((job, index) => (
          <div className="git-commit" key={job.hash + index}>
            <div className="git-meta">
              <div className="git-hash">{job.hash}</div>
              <span className="git-date"><DecryptedText text={job.date} /></span>
              <div className="git-company"><DecryptedText text={job.company} /></div>
            </div>
            <div className="git-content">
              <div className="git-role">
                {job.isRoleSplit ? (
                  <>
                    <DecryptedText text={job.rolePrefix} />
                    <span style={{color: 'var(--accent)', borderBottom: '1px dashed var(--accent)'}}>
                      <DecryptedText text={job.roleHighlight} />
                    </span>
                    <DecryptedText text={job.roleSuffix} />
                  </>
                ) : (
                  <DecryptedText text={job.role} />
                )}
                {job.badge && <span className="git-role-badge" style={{ marginLeft: '10px' }}><DecryptedText text={job.badge} /></span>}
              </div>
              
              {job.desc && (
                <p className="git-desc">
                  <DecryptedText text={job.desc} duration={1200} />
                </p>
              )}
              
              <div className="git-changes">
                {job.changes.map((change, i) => (
                  <div className="git-change" key={i}>
                    <span className={`git-change-prefix ${change.type}`}>{change.symbol}</span> 
                    <span><DecryptedText text={change.text} duration={1000} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
