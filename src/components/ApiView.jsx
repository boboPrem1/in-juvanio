import { useState, useEffect } from 'react';

export default function ApiView({ apiMode, language }) {
  const [copyText, setCopyText] = useState('');
  
  const defaultCopyText = language === 'fr' ? 'Copier' : 'Copy';
  const copiedText = language === 'fr' ? '✓ Copié' : '✓ Copied';

  const data = {
    status: "success",
    data: {
      identity: {
        name: "Amouzougan Kangni Juvanio",
        title: language === 'fr' ? "Ingénieur Senior Spécialisé Backend & Sécurité" : "Senior Backend & Security Engineer",
        positioning: "Backend Architect · DevSecOps · AI-Ready",
        location: language === 'fr' ? "Lomé, Togo 🇹🇬" : "Lome, Togo 🇹🇬",
        available: true,
        leadership: language === 'fr' 
          ? "Habitué à intervenir en autonomie complète — de la conception à la mise en production — aussi bien en solo qu'en leadership technique d'équipe." 
          : "Accustomed to working with full autonomy — from design to production — both solo and as a technical team lead."
      },
      flagship_project: {
        name: "Tenxyte",
        type: language === 'fr' ? "Framework Python Open Source" : "Open Source Python Framework",
        description: language === 'fr' 
          ? "Authentification & sécurité production-ready pour backends AI-Ready" 
          : "Production-ready authentication & security for AI-Ready backends",
        modules: ["Auth Engine (JWT/RBAC/2FA)", "WebAuthn", "AIRS (AI Responsibility & Security)", "Multi-DB Support"],
        tests: "2,300+",
        coverage: "~100%",
        links: { pypi: "https://pypi.org/project/tenxyte/", docs: "https://tenxyte.readthedocs.io" }
      },
      skills: {
        architecture: ["Microservices", "DDD", "Clean Architecture", "SOLID", "TDD", "REST API", "OpenAPI", language === 'fr' ? "Algorithmes" : "Algorithms"],
        security: ["OWASP", "ISO 27001", "SOC2", "GDPR", "AML/KYC", "JWT", "RBAC", "2FA"],
        backend: ["Python", "Django", "FastAPI", "Node.js", "NestJS", "Express", "PHP", "Laravel", "TypeScript"],
        cloud_devops: ["AWS (EC2/S3/LightSail/IAM/SES)", "Docker", "Linux", "Nginx", "GitHub Actions", "GitLab", "Jenkins", "Kubernetes", "Terraform", "Agile/Scrum"],
        databases: ["PostgreSQL", "MySQL", "MongoDB"],
        frontend: ["React.js", "Next.js", "Vue.js", "Redux", "Tailwind"]
      },
      experience: language === 'fr' ? [
        { period: "Sept. 2025 → Aujourd'hui", company: "Tenxyte", role: "Founder & Lead Engineer", type: "open_source" },
        { period: "Août 2025 → Jan. 2026", company: "MTN Bénin", role: "Développeur Consultant Fullstack", type: "telecom" },
        { period: "Oct. 2023 → Juil. 2025", company: "Expand in Africa", role: "Développeur Fullstack & CTO", type: "remote" },
        { period: "Jan. 2024 → Juil. 2024", company: "Holam", role: "Développeur Fullstack & CTO", type: "parallel" },
        { period: "Avr. → Oct. 2023", company: "Pandore", role: "Développeur Fullstack", type: "agile" },
        { period: "Oct. 2022 → Mars 2023", company: "Tarzan · LoveAfrica · ElyDesign", role: "Développeur Fullstack", type: "multi" },
        { period: "Oct. → Nov. 2020", company: "Nunyalab · Tech4Rights", role: "Développeur Mobile (Hackathon)", type: "hackathon" }
      ] : [
        { period: "Sept. 2025 → Present", company: "Tenxyte", role: "Founder & Lead Engineer", type: "open_source" },
        { period: "Aug. 2025 → Jan. 2026", company: "MTN Benin", role: "Fullstack Consultant Developer", type: "telecom" },
        { period: "Oct. 2023 → Jul. 2025", company: "Expand in Africa", role: "Fullstack Developer & CTO", type: "remote" },
        { period: "Jan. 2024 → Jul. 2024", company: "Holam", role: "Fullstack Developer & CTO", type: "parallel" },
        { period: "Apr. → Oct. 2023", company: "Pandore", role: "Fullstack Developer", type: "agile" },
        { period: "Oct. 2022 → Mar. 2023", company: "Tarzan · LoveAfrica · ElyDesign", role: "Fullstack Developer", type: "multi" },
        { period: "Oct. → Nov. 2020", company: "Nunyalab · Tech4Rights", role: "Mobile Developer (Hackathon)", type: "hackathon" }
      ],
      languages: language === 'fr' ? [
        { lang: "Éwé", level: "Natif" },
        { lang: "Français", level: "Officiel" },
        { lang: "Anglais", level: "Professionnel" },
        { lang: "Allemand", level: "Débutant" }
      ] : [
        { lang: "Ewe", level: "Native" },
        { lang: "French", level: "Official" },
        { lang: "English", level: "Professional" },
        { lang: "German", level: "Beginner" }
      ],
      contact: {
        email: "jamouzougan@gmail.com",
        phone: "+228 96 85 89 12",
        linkedin: "linkedin.com/in/kangni-juvanio-amouzougan-709918189",
        github: "github.com/boboprem1",
        pypi: "pypi.org/project/tenxyte"
      }
    },
    meta: { api_version: "1.0.0", response_time_ms: 1.2 }
  };

  const jsonString = JSON.stringify(data, null, 2);
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
      <div className="api-endpoint"><span className="method">GET</span> /api/v1/juvanio/profile</div>
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
