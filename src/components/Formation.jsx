import DecryptedText from './DecryptedText';

const translations = {
  fr: {
    sectionNum: "04",
    sectionLabel: "Formation",
    title1: "Études &",
    title2: "Certifications",
    features1: [
      {
        icon: "🎓",
        name: "Développeur Web & Mobile — Certifié",
        desc: "Energy Generation / Simplon.co — Fév.–Nov. 2022\nHTML5, CSS3, JS, PHP, Node.js, React, Laravel, Agile",
        tag: "CERTIF"
      },
      {
        icon: "⚡",
        name: "JavaScript Developer",
        desc: "freeCodeCamp — Fév.–Avr. 2022\nES6, Algorithmique, POO, Programmation fonctionnelle",
        tag: "CERTIF"
      },
      {
        icon: "📚",
        name: "Licence Comptabilité–Contrôle–Audit",
        desc: "Université de Lomé — 2018–2021\nReconversion tech réussie",
        tag: "LICENCE"
      },
      {
        icon: "🏅",
        name: "Baccalauréat G2 — Mention Assez Bien",
        desc: "Institut Polytechnique du Golfe — 2015–2018\nComptabilité & Gestion",
        tag: "BAC"
      },
      {
        icon: "📊",
        name: "Formation SAGE 100 Comptabilité",
        desc: "CIGC — Oct.–Nov. 2021",
        tag: "CERTIF"
      }
    ],
    p1: "Formation continue depuis 2019 — autoformation rigoureuse en parallèle des missions professionnelles.",
    features2: [
      { icon: "📖", name: "Grokking Algorithms", desc: "Aditya Bhargava" },
      { icon: "📖", name: "Clean Code", desc: "Robert C. Martin" },
      { icon: "📖", name: "Architecture Patterns", desc: "Harry Percival & Bob Gregory" },
      { icon: "🌐", name: "Sololearn · OpenClassrooms · freeCodeCamp", desc: "HTML, CSS, JS, PHP, Python, Java, SQL, C, C++, Angular, Ionic, Laravel…" },
      { icon: "🏆", name: "Open Code Academy — Summer Camp", desc: "Woelab — Août 2017\nInitiation intensive à la programmation" }
    ]
  },
  en: {
    sectionNum: "04",
    sectionLabel: "Education",
    title1: "Studies &",
    title2: "Certifications",
    features1: [
      {
        icon: "🎓",
        name: "Web & Mobile Developer — Certified",
        desc: "Energy Generation / Simplon.co — Feb.–Nov. 2022\nHTML5, CSS3, JS, PHP, Node.js, React, Laravel, Agile",
        tag: "CERTIF"
      },
      {
        icon: "⚡",
        name: "JavaScript Developer",
        desc: "freeCodeCamp — Feb.–Apr. 2022\nES6, Algorithms, OOP, Functional Programming",
        tag: "CERTIF"
      },
      {
        icon: "📚",
        name: "Bachelor's Degree in Accounting & Audit",
        desc: "University of Lomé — 2018–2021\nSuccessful tech transition",
        tag: "DEGREE"
      },
      {
        icon: "🏅",
        name: "Baccalaureate G2 — With Honors",
        desc: "Institut Polytechnique du Golfe — 2015–2018\nAccounting & Management",
        tag: "HIGH SCH."
      },
      {
        icon: "📊",
        name: "SAGE 100 Accounting Training",
        desc: "CIGC — Oct.–Nov. 2021",
        tag: "CERTIF"
      }
    ],
    p1: "Continuous learning since 2019 — rigorous self-training parallel to professional missions.",
    features2: [
      { icon: "📖", name: "Grokking Algorithms", desc: "Aditya Bhargava" },
      { icon: "📖", name: "Clean Code", desc: "Robert C. Martin" },
      { icon: "📖", name: "Architecture Patterns", desc: "Harry Percival & Bob Gregory" },
      { icon: "🌐", name: "Sololearn · OpenClassrooms · freeCodeCamp", desc: "HTML, CSS, JS, PHP, Python, Java, SQL, C, C++, Angular, Ionic, Laravel…" },
      { icon: "🏆", name: "Open Code Academy — Summer Camp", desc: "Woelab — August 2017\nIntensive programming initiation" }
    ]
  }
};

export default function Formation({ language = 'fr' }) {
  const t = translations[language] || translations.fr;

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
