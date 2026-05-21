import { useEffect, useRef } from 'react';

const logLines = [
  '<span style="color:var(--accent)">[INFO ]</span> Auth.JWT — Token issued for user_8a3f',
  '<span style="color:var(--muted)">[DEBUG]</span> RBAC — Role check: admin → ALLOW',
  '<span style="color:var(--accent)">[INFO ]</span> AIRS.Sentinel — Prompt scan: CLEAN',
  '<span style="color:var(--muted)">[DEBUG]</span> DB.Pool — Connection acquired (pg:5432)',
  '<span style="color:var(--accent)">[INFO ]</span> API.Gateway — POST /auth/login 200 12ms',
  '<span style="color:var(--accent3)">[WARN ]</span> RateLimit — Intent "delete" near threshold',
  '<span style="color:var(--accent)">[INFO ]</span> WebAuthn — Credential verified OK',
  '<span style="color:var(--muted)">[DEBUG]</span> Cache.Redis — HIT session:a8f3e1',
  '<span style="color:var(--accent)">[INFO ]</span> AIRS.AuditTrail — Action logged: ai_query',
  '<span style="color:var(--accent)">[INFO ]</span> CI/CD — Pipeline #847 passed (2,312 tests)',
  '<span style="color:var(--muted)">[DEBUG]</span> TLS — Handshake complete (TLS 1.3)',
  '<span style="color:var(--accent)">[INFO ]</span> Deploy — Container pushed to registry',
  '<span style="color:var(--muted)">[DEBUG]</span> Auth.2FA — TOTP verified for user_c7d2',
  '<span style="color:var(--accent)">[INFO ]</span> OWASP — Injection scan: PASS',
  '<span style="color:var(--muted)">[DEBUG]</span> DB.Mongo — Document indexed (users)',
  '<span style="color:var(--accent)">[INFO ]</span> API.Gateway — GET /api/v1/users 200 3ms',
  '<span style="color:var(--accent3)">[WARN ]</span> Memory — Heap at 72% capacity',
  '<span style="color:var(--accent)">[INFO ]</span> Auth.Session — Refresh token rotated',
  '<span style="color:var(--muted)">[DEBUG]</span> CORS — Origin allowed: *.tenxyte.io',
  '<span style="color:var(--accent)">[INFO ]</span> AIRS.Guard — AI rate limit: 45/100 req/min'
];

export default function TerminalBackground() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let index = 0;
    let timeoutId;

    // Initial fill
    for (let i = 0; i < 15; i++) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logLines[i % logLines.length];
      el.appendChild(line);
      index++;
    }
    el.scrollTop = el.scrollHeight;

    const addLog = () => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = logLines[index % logLines.length];
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';
      line.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      
      el.appendChild(line);
      
      void line.offsetWidth; // Force reflow
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
      el.scrollTop = el.scrollHeight;

      if (el.children.length > 30) {
        el.removeChild(el.firstChild);
      }

      index++;
      const delay = Math.random() * 800 + 200;
      timeoutId = setTimeout(addLog, delay);
    };

    timeoutId = setTimeout(addLog, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="hero-terminal-bg">
      <div className="terminal-scroll" id="terminalScroll" ref={scrollRef}></div>
    </div>
  );
}
