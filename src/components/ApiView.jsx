import { useState } from 'react';
import './ApiView.css';

export default function ApiView({ apiMode, language, data, slug }) {
  const [copyText, setCopyText] = useState('');

  const defaultCopyText = language === 'fr' ? 'Copier' : 'Copy';
  const copiedText = language === 'fr' ? '✓ Copié' : '✓ Copied';

  // Build the API response JSON from the shared data source
  const expLang = data.experience[language] || data.experience.fr;
  const formLang = data.formation[language] || data.formation.fr;
  const skillsLang = data.skills[language] || data.skills.fr;
  const heroLang = data.hero[language] || data.hero.fr;
  const tenxyteLang = data.tenxyte[language] || data.tenxyte.fr;
  const meta = data.meta;

  const apiData = {
    status: "success",
    data: {
      identity: {
        name: meta.name,
        title: heroLang.title,
        positioning: heroLang.tag,
        location: (data.footer[language] || data.footer.fr).location,
        available: meta.available,
        leadership: `${heroLang.desc} ${heroLang.leadership}.`
      },
      flagship_project: {
        name: "Tenxyte",
        type: tenxyteLang.badge,
        description: tenxyteLang.desc,
        modules: [
          "Auth Engine (JWT/RBAC/2FA)",
          "WebAuthn",
          "AIRS (AI Responsibility & Security)",
          "Multi-DB Support"
        ],
        tests: tenxyteLang.statsValues.tests,
        coverage: tenxyteLang.statsValues.coverage,
        links: {
          pypi: meta.contact.pypi,
          docs: data.tenxyte?.docsUrl || "https://tenxyte.readthedocs.io"
        }
      },
      skills: {
        architecture: skillsLang.racks.arch.tags,
        security: skillsLang.racks.sec.tags,
        backend: skillsLang.racks.back.tags,
        cloud_devops: skillsLang.racks.cloud.tags,
        databases: skillsLang.racks.db.tags,
        frontend: skillsLang.racks.front.tags,
        hobbies: skillsLang.racks.hobbies.tags
      },
      experience: expLang.jobs.map(job => ({
        period: job.date,
        company: job.company,
        role: job.role,
        description: job.desc,
        achievements: job.changes.map(c => c.text)
      })),
      education: formLang.features1.map(f => ({
        degree: f.name,
        details: f.desc.replace('\n', ' — '),
        tag: f.tag
      })),
      continuous_learning: formLang.features2.map(f => ({
        topic: f.name,
        author_source: f.desc.replace('\n', ' — ')
      })),
      languages: skillsLang.racks.lang.items.map(item => ({
        lang: item.name,
        level: item.level
      })),
      contact: {
        email: meta.contact.email,
        phone: meta.contact.phone,
        linkedin: meta.contact.linkedin,
        github: meta.contact.github,
        pypi: meta.contact.pypi
      }
    },
    meta: { api_version: "1.1.0", response_time_ms: 1.2 }
  };

  const jsonString = JSON.stringify(apiData, null, 2);
  const highlighted = jsonString
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"(,?)/g, ': <span class="json-string">"$1"</span>$2')
    .replace(/: (\d+\.?\d*)(,?)/g, ': <span class="json-number">$1</span>$2')
    .replace(/: (true|false)(,?)/g, ': <span class="json-bool">$1</span>$2')
    .replace(/: (null)(,?)/g, ': <span class="json-null">$1</span>$2')
    .replace(/[\[\]{}]/g, '<span class="json-bracket">$&</span>');

  const copyApiJson = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopyText(copiedText);
      setTimeout(() => setCopyText(''), 1500);
    });
  };

  return (
    <div className={`api-view ${apiMode ? 'visible' : ''}`} id="apiView">
      <div className="api-endpoint"><span className="method">GET</span> /api/v1/{slug || data.meta?.slug || 'portfolio'}/profile</div>
      <div className="api-status">
        <span className="api-status-code">200 OK</span>
        <span className="api-status-text">application/json · 1.2ms</span>
      </div>
      <div className="api-json" id="apiJson">
        <button className="api-copy-btn" onClick={copyApiJson}>{copyText || defaultCopyText}</button>
        <div dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
}
