// src/components/experience/ExperienceTimeline.jsx
// Renommé depuis components/Experience.jsx — imports ajustés
import '../Experience.css';
import DecryptedText from '../shared/DecryptedText';
import { useStaggerReveal } from '../../hooks/useStaggerReveal';

export default function ExperienceTimeline({ language, data, skin }) {
  const t = data.experience[language] || data.experience.fr;
  const d            = skin?.animations?.durations || {};
  const staggerDelay = skin?.animations?.stagger?.default ?? 80;
  const threshold    = skin?.animations?.intersectionThreshold ?? 0.15;

  const { containerRef } = useStaggerReveal('.git-commit', { staggerDelay, threshold });

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
                    <span style={{ color: 'var(--accent)', borderBottom: '1px dashed var(--accent)' }}>
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
                  <DecryptedText text={job.desc} duration={d.long ?? 1200} />
                </p>
              )}

              <div className="git-changes">
                {job.changes.map((change, i) => (
                  <div className="git-change" key={i}>
                    <span className={`git-change-prefix ${change.type}`}>{change.symbol}</span>{' '}
                    <span><DecryptedText text={change.text} duration={d.medium ?? 800} /></span>
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
