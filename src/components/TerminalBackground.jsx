import { useEffect, useRef } from 'react';

// Fallback si data.terminal absent (compatibilité dev seeds sans la clé)
const DEFAULT_LOGS = [
  { level: 'INFO',  color: 'accent',  text: 'Auth.JWT — Token issued for user_8a3f' },
  { level: 'DEBUG', color: 'muted',   text: 'RBAC — Role check: admin → ALLOW' },
  { level: 'INFO',  color: 'accent',  text: 'AIRS.Sentinel — Prompt scan: CLEAN' },
  { level: 'DEBUG', color: 'muted',   text: 'DB.Pool — Connection acquired (pg:5432)' },
  { level: 'INFO',  color: 'accent',  text: 'API.Gateway — POST /auth/login 200 12ms' },
  { level: 'WARN',  color: 'accent3', text: 'RateLimit — Intent "delete" near threshold' },
  { level: 'INFO',  color: 'accent',  text: 'WebAuthn — Credential verified OK' },
  { level: 'DEBUG', color: 'muted',   text: 'Cache.Redis — HIT session:a8f3e1' },
  { level: 'INFO',  color: 'accent',  text: 'AIRS.AuditTrail — Action logged: ai_query' },
  { level: 'INFO',  color: 'accent',  text: 'CI/CD — Pipeline #847 passed (2,312 tests)' },
];

// Construit le HTML d'une ligne de log à partir de l'objet data
function buildLogHtml(log) {
  const levelPad = log.level.padEnd(5, ' ');
  return `<span style="color:var(--${log.color})">[${levelPad}]</span> ${log.text}`;
}

export default function TerminalBackground({ data }) {
  const scrollRef = useRef(null);

  // ✅ Logs depuis data.terminal.logs (avec fallback)
  const logs = (data?.terminal?.logs || DEFAULT_LOGS).map(buildLogHtml);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let index = 0;
    let timeoutId;

    // Remplissage initial
    for (let i = 0; i < Math.min(15, logs.length); i++) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logs[i % logs.length];
      el.appendChild(line);
      index++;
    }
    el.scrollTop = el.scrollHeight;

    const addLog = () => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logs[index % logs.length];
      line.style.cssText =
        'opacity:0;transform:translateY(10px);transition:all 0.4s cubic-bezier(0.4,0,0.2,1)';
      el.appendChild(line);
      void line.offsetWidth; // Force reflow
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
      el.scrollTop = el.scrollHeight;
      if (el.children.length > 30) el.removeChild(el.firstChild);
      index++;
      timeoutId = setTimeout(addLog, Math.random() * 800 + 200);
    };

    timeoutId = setTimeout(addLog, 1000);
    return () => clearTimeout(timeoutId);
  }, [logs]);

  return (
    <div className="hero-terminal-bg">
      <div className="terminal-scroll" id="terminalScroll" ref={scrollRef} />
    </div>
  );
}
