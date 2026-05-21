import { useState, useEffect } from 'react';

export default function ApiView({ apiMode }) {
  const [copyText, setCopyText] = useState('Copier');
  
  const data = {
    status: "success",
    data: {
      identity: {
        name: "Amouzougan Kangni Juvanio",
        title: "Ingénieur Senior Spécialisé Backend & Sécurité",
        positioning: "Backend Architect · DevSecOps · AI-Ready",
        location: "Lomé, Togo 🇹🇬",
        available: true,
        leadership: "Habitué à intervenir en autonomie complète — de la conception à la mise en production — aussi bien en solo qu'en leadership technique d'équipe."
      },
      flagship_project: {
        name: "Tenxyte",
        type: "Framework Python Open Source",
        description: "Authentification & sécurité production-ready pour backends AI-Ready",
        modules: ["Auth Engine (JWT/RBAC/2FA)", "WebAuthn", "AIRS (AI Responsibility & Security)", "Multi-DB Support"],
        tests: "2,300+",
        coverage: "~100%",
        links: { pypi: "https://pypi.org/project/tenxyte/", docs: "https://tenxyte.readthedocs.io" }
      },
      skills: {
        architecture: ["Microservices", "DDD", "Clean Architecture", "SOLID", "TDD", "REST API", "OpenAPI", "Algorithmes"],
        security: ["OWASP", "ISO 27001", "SOC2", "GDPR", "AML/KYC", "JWT", "RBAC", "2FA"],
        backend: ["Python", "Django", "FastAPI", "Node.js", "NestJS", "Express", "PHP", "Laravel", "TypeScript"],
        cloud_devops: ["AWS (EC2/S3/LightSail/IAM/SES)", "Docker", "Linux", "Nginx", "GitHub Actions", "GitLab", "Jenkins", "Kubernetes", "Terraform", "Agile/Scrum"],
        databases: ["PostgreSQL", "MySQL", "MongoDB"],
        frontend: ["React.js", "Next.js", "Vue.js", "Redux", "Tailwind"]
      },
      experience: [
        { period: "Sept. 2025 → Aujourd'hui", company: "Tenxyte", role: "Founder & Lead Engineer", type: "open_source" },
        { period: "Août 2025 → Jan. 2026", company: "MTN Bénin", role: "Développeur Consultant Fullstack", type: "telecom" },
        { period: "Oct. 2023 → Juil. 2025", company: "Expand in Africa", role: "Développeur Fullstack & CTO", type: "remote" },
        { period: "Jan. 2024 → Juil. 2024", company: "Holam", role: "Développeur Fullstack & CTO", type: "parallel" },
        { period: "Avr. → Oct. 2023", company: "Pandore", role: "Développeur Fullstack", type: "agile" },
        { period: "Oct. 2022 → Mars 2023", company: "Tarzan · LoveAfrica · ElyDesign", role: "Développeur Fullstack", type: "multi" },
        { period: "Oct. → Nov. 2020", company: "Nunyalab · Tech4Rights", role: "Développeur Mobile (Hackathon)", type: "hackathon" }
      ],
      languages: [
        { lang: "Éwé", level: "Natif" },
        { lang: "Français", level: "Officiel" },
        { lang: "Anglais", level: "Professionnel" },
        { lang: "Allemand", level: "Débutant" }
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
      setCopyText('✓ Copié');
      setTimeout(() => setCopyText('Copier'), 1500);
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
        <button className="api-copy-btn" onClick={copyApiJson}>{copyText}</button>
        <div dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
}
