import { useEffect, useRef } from 'react';
import './Experience.css';
import DecryptedText from './DecryptedText';

export default function Experience({ language, data, skin }) {
  const containerRef = useRef(null);
  const t = data.experience[language] || data.experience.fr;
  const anims = skin?.animations?.decryptedText || {};
  const staggerDelay = skin?.animations?.stagger?.experienceDelay || 100;

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
        el.dataset.delay = String(i * staggerDelay);
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
        <em className="experience-title-em">
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
                {job.badge && <span className="git-role-badge"><DecryptedText text={job.badge} /></span>}
              </div>

              {job.desc && (
                <p className="git-desc">
                  <DecryptedText text={job.desc} duration={anims.experienceDesc || 1200} />
                </p>
              )}

              <div className="git-changes">
                {job.changes.map((change, i) => (
                  <div className="git-change" key={i}>
                    <span className={`git-change-prefix ${change.type}`}>{change.symbol}</span>{' '}
                    <span><DecryptedText text={change.text} duration={anims.experienceChange || 1000} /></span>
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
