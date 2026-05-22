import { useEffect, useRef } from 'react';
import DecryptedText from './DecryptedText';

const translations = {
  fr: {
    sectionNum: "02",
    sectionLabel: "Compétences",
    title1: "Boîte à",
    title2: "outils",
    racks: {
      arch: { title: "Architecture", tags: ["Microservices", "DDD", "Algorithmes", "Clean Arch.", "SOLID", "TDD", "REST API", "OpenAPI"] },
      sec: { title: "Sécurité", tags: ["OWASP", "ISO 27001", "SOC2", "GDPR", "AML/KYC", "JWT", "RBAC", "2FA"] },
      back: { title: "Backend", tags: ["Python", "Django", "FastAPI", "Node.js", "NestJS", "Express", "PHP", "Laravel", "TypeScript"] },
      cloud: { title: "Cloud & DevOps", tags: ["AWS EC2/S3/LightSail", "AWS IAM/SES", "Docker", "Linux", "Nginx", "GitHub Actions", "GitLab", "Agile/Scrum", "Jenkins", "Kubernetes", "Terraform"] },
      db: { title: "Bases de données", tags: ["PostgreSQL", "MySQL", "MongoDB", "Modélisation", "Optimisation"] },
      front: { title: "Frontend", tags: ["React.js", "Next.js", "Vue.js", "Redux", "Tailwind", "TypeORM"] },
      lang: { 
        title: "Langues",
        items: [
          { name: "Éwé", level: "Natif", width: "100%" },
          { name: "Français", level: "Officiel", width: "100%" },
          { name: "Anglais", level: "Professionnel", width: "85%" },
          { name: "Allemand", level: "Débutant", width: "20%" }
        ]
      },
      hobbies: {
        title: "Loisirs & Centres d'intérêt",
        tags: ["Musique", "Écriture", "Lecture", "Danse", "Mangas", "Arts Martiaux", "Gymnastique", "Sports (Football, Basket)"]
      }
    }
  },
  en: {
    sectionNum: "02",
    sectionLabel: "Skills",
    title1: "Tool",
    title2: "box",
    racks: {
      arch: { title: "Architecture", tags: ["Microservices", "DDD", "Algorithms", "Clean Arch.", "SOLID", "TDD", "REST API", "OpenAPI"] },
      sec: { title: "Security", tags: ["OWASP", "ISO 27001", "SOC2", "GDPR", "AML/KYC", "JWT", "RBAC", "2FA"] },
      back: { title: "Backend", tags: ["Python", "Django", "FastAPI", "Node.js", "NestJS", "Express", "PHP", "Laravel", "TypeScript"] },
      cloud: { title: "Cloud & DevOps", tags: ["AWS EC2/S3/LightSail", "AWS IAM/SES", "Docker", "Linux", "Nginx", "GitHub Actions", "GitLab", "Agile/Scrum", "Jenkins", "Kubernetes", "Terraform"] },
      db: { title: "Databases", tags: ["PostgreSQL", "MySQL", "MongoDB", "Modeling", "Optimization"] },
      front: { title: "Frontend", tags: ["React.js", "Next.js", "Vue.js", "Redux", "Tailwind", "TypeORM"] },
      lang: { 
        title: "Languages",
        items: [
          { name: "Ewe", level: "Native", width: "100%" },
          { name: "French", level: "Official", width: "100%" },
          { name: "English", level: "Professional", width: "85%" },
          { name: "German", level: "Beginner", width: "20%" }
        ]
      },
      hobbies: {
        title: "Hobbies & Interests",
        tags: ["Music", "Writing", "Reading", "Dance", "Manga", "Martial Arts", "Gymnastics", "Sports (Soccer, Basketball)"]
      }
    }
  }
};

export default function Skills({ language = 'fr' }) {
  const langsRef = useRef(null);
  const t = translations[language] || translations.fr;

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
      <div className="section-label" data-num={t.sectionNum}>
        <DecryptedText text={t.sectionLabel} />
      </div>
      <h2 className="section-title">
        <DecryptedText text={t.title1} /><br />
        <em style={{fontFamily: "'Fraunces', serif", color: 'var(--accent)'}}>
          <DecryptedText text={t.title2} />
        </em>
      </h2>
      
      <div className="skills-grid">
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-green"></div>
              <div className="led led-yellow"></div>
            </div>
            <span className="skill-rack-id">RACK-01</span>
          </div>
          <span className="skill-card-icon">🏗️</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.arch.title} /></div>
          <div className="skill-tags">
            {t.racks.arch.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-red"></div>
              <div className="led led-green"></div>
              <div className="led led-green"></div>
            </div>
            <span className="skill-rack-id">RACK-02</span>
          </div>
          <span className="skill-card-icon">🔒</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.sec.title} /></div>
          <div className="skill-tags">
            {t.racks.sec.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-green"></div>
              <div className="led led-green"></div>
            </div>
            <span className="skill-rack-id">RACK-03</span>
          </div>
          <span className="skill-card-icon">⚙️</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.back.title} /></div>
          <div className="skill-tags">
            {t.racks.back.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-yellow"></div>
              <div className="led led-green"></div>
            </div>
            <span className="skill-rack-id">RACK-04</span>
          </div>
          <span className="skill-card-icon">☁️</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.cloud.title} /></div>
          <div className="skill-tags">
            {t.racks.cloud.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-green"></div>
              <div className="led led-yellow"></div>
            </div>
            <span className="skill-rack-id">RACK-05</span>
          </div>
          <span className="skill-card-icon">🗄️</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.db.title} /></div>
          <div className="skill-tags">
            {t.racks.db.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-green"></div>
              <div className="led led-green"></div>
            </div>
            <span className="skill-rack-id">RACK-06</span>
          </div>
          <span className="skill-card-icon">🖥️</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.front.title} /></div>
          <div className="skill-tags">
            {t.racks.front.tags.map(tag => (
              <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
            ))}
          </div>
        </div>
        
        <div className="skill-card" style={{gridColumn: 'span 2'}}>
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              <div className="led led-green"></div>
              <div className="led led-green"></div>
              <div className="led led-green"></div>
            </div>
            <span className="skill-rack-id">RACK-07</span>
          </div>
          <span className="skill-card-icon">🌍</span>
          <div className="skill-card-title"><DecryptedText text={t.racks.lang.title} /></div>
          
          <div className="langs" ref={langsRef}>
            {t.racks.lang.items.map((item, idx) => (
              <div className="lang-item" key={idx}>
                <span className="lang-name"><DecryptedText text={item.name} /></span>
                <div className="lang-bar"><div className="lang-fill" style={{width: item.width}}></div></div>
                <span className="lang-level"><DecryptedText text={item.level} /></span>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px'}}>
            <div className="skill-card-title" style={{fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px'}}>
              <DecryptedText text={t.racks.hobbies.title} />
            </div>
            <div className="skill-tags">
              {t.racks.hobbies.tags.map(tag => (
                <span key={tag} className="skill-tag"><DecryptedText text={tag} duration={600} /></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
