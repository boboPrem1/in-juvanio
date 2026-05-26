// src/components/skills/SkillsServerRack.jsx
// Renommé depuis components/Skills.jsx — imports ajustés
import { useEffect, useRef } from 'react';
import '../Skills.css';
import DecryptedText from '../shared/DecryptedText';

export default function SkillsServerRack({ language, data, skin }) {
  const langsRef = useRef(null);
  const t = data.skills[language] || data.skills.fr;
  const racks = t.racks;
  const anims = skin?.animations?.decryptedText || {};
  const staggerDelay = skin?.animations?.stagger?.skillsDelay || 150;

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.lang-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * staggerDelay);
          });
        }
      });
    }, { threshold: 0.3 });

    if (langsRef.current) observer.observe(langsRef.current);
    return () => observer.disconnect();
  }, []);

  const SPECIAL_RACKS = ['lang', 'hobbies'];
  const rackOrder = Object.keys(racks).filter(k => !SPECIAL_RACKS.includes(k));

  return (
    <section id="skills">
      <div className="section-label" data-num={t.sectionNum}>
        <DecryptedText text={t.sectionLabel} />
      </div>
      <h2 className="section-title">
        <DecryptedText text={t.title1} /><br />
        <em><DecryptedText text={t.title2} /></em>
      </h2>

      <div className="skills-grid">
        {rackOrder.map((key) => {
          const rack = racks[key];
          return (
            <div className="skill-card" key={key}>
              <div className="skill-rack-header">
                <div className="skill-rack-leds">
                  {rack.leds.map((color, i) => (
                    <div key={i} className={`led led-${color}`}></div>
                  ))}
                </div>
                <span className="skill-rack-id">{rack.rackId}</span>
              </div>
              <span className="skill-card-icon">{rack.icon}</span>
              <div className="skill-card-title"><DecryptedText text={rack.title} /></div>
              <div className="skill-tags">
                {rack.tags.map(tag => (
                  <span key={tag} className="skill-tag">
                    <DecryptedText text={tag} duration={anims.skillsTag || 600} />
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* Languages card — span via CSS var --lang-card-span */}
        <div className="skill-card skill-card--wide">
          <div className="skill-rack-header">
            <div className="skill-rack-leds">
              {racks.lang.leds.map((color, i) => (
                <div key={i} className={`led led-${color}`}></div>
              ))}
            </div>
            <span className="skill-rack-id">{racks.lang.rackId}</span>
          </div>
          <span className="skill-card-icon">{racks.lang.icon}</span>
          <div className="skill-card-title"><DecryptedText text={racks.lang.title} /></div>

          <div className="langs" ref={langsRef}>
            {racks.lang.items.map((item, idx) => (
              <div className="lang-item" key={idx}>
                <span className="lang-name"><DecryptedText text={item.name} /></span>
                <div className="lang-bar"><div className="lang-fill" style={{ width: item.width }}></div></div>
                <span className="lang-level"><DecryptedText text={item.level} /></span>
              </div>
            ))}
          </div>

          <div className="skill-card__langs-footer">
            <div className="skill-card__section-label">
              <DecryptedText text={racks.hobbies.title} />
            </div>
            <div className="skill-tags">
              {racks.hobbies.tags.map(tag => (
                <span key={tag} className="skill-tag">
                  <DecryptedText text={tag} duration={anims.skillsTag || 600} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
