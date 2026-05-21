import { useEffect, useState } from 'react';

export default function BootSequence() {
  const [isDone, setIsDone] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);

  const lines = [
    { delay: 100, content: <><span className="dim">[    0.000]</span> Initializing <span className="ok">Secure Environment</span>...</> },
    { delay: 200, content: <><span className="dim">[    0.142]</span> Loading kernel modules <span className="dim">— TLS 1.3, AES-256</span></> },
    { delay: 180, content: <><span className="dim">[    0.318]</span> <span className="ok">[  OK  ]</span> Auth Engine <span className="dim">(JWT · RBAC · 2FA)</span></> },
    { delay: 200, content: <><span className="dim">[    0.487]</span> <span className="ok">[  OK  ]</span> AIRS Module <span className="dim">— AI Responsibility & Security</span></> },
    { delay: 160, content: <><span className="dim">[    0.612]</span> <span className="ok">[  OK  ]</span> Database adapters <span className="dim">(PostgreSQL · MongoDB · MySQL)</span></> },
    { delay: 220, content: <><span className="dim">[    0.734]</span> <span className="warn">[SCAN ]</span> Running OWASP compliance checks...</> },
    { delay: 180, content: <><span className="dim">[    0.891]</span> <span className="ok">[PASS ]</span> All 2,300+ tests green</> },
    { delay: 200, content: <><span className="dim">[    1.024]</span> <span className="ok">[  OK  ]</span> Deploying to production <span className="dim">— CI/CD pipeline</span></> },
    { delay: 300, content: <><span className="dim">[    1.200]</span> <span className="ok">ACCESS GRANTED</span> — Welcome to <span className="ok">juvanio.node</span><span className="boot-cursor"></span></> },
  ];

  useEffect(() => {
    let timeoutId;
    const playSequence = (index) => {
      if (index >= lines.length) {
        setTimeout(() => setIsDone(true), 400);
        return;
      }
      setCurrentLine(index);
      timeoutId = setTimeout(() => playSequence(index + 1), lines[index].delay);
    };

    timeoutId = setTimeout(() => playSequence(0), 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const progressWidth = currentLine === -1 ? 0 : ((currentLine + 1) / lines.length) * 100;

  if (isDone) return null;

  return (
    <div className={`boot-overlay ${currentLine >= lines.length ? 'done' : ''}`} id="bootOverlay">
      {lines.map((line, index) => (
        <div
          key={index}
          className="boot-line"
          style={{
            opacity: index <= currentLine ? 1 : 0,
            transform: index <= currentLine ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
        >
          {line.content}
        </div>
      ))}
      <div
        className="boot-progress"
        style={{
          opacity: currentLine >= 0 ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <div
          className="boot-progress-fill"
          style={{ width: `${progressWidth}%`, transition: 'width 0.2s' }}
        ></div>
      </div>
    </div>
  );
}
