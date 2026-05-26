// src/components/addons/BootSequenceAddon.jsx
// Renommé depuis components/BootSequence.jsx — imports ajustés
import { useEffect, useState } from 'react';
import '../BootSequence.css';

const TYPE_CLASS = { info: 'ok', ok: 'ok', warn: 'warn', pass: 'ok', dim: 'dim' };

const DEFAULT_BOOT_LINES = [
  { delay: 100, type: 'info',  text: 'Initializing Secure Environment...' },
  { delay: 200, type: 'dim',   text: 'Loading kernel modules — TLS 1.3, AES-256' },
  { delay: 180, type: 'ok',    text: 'Auth Engine (JWT · RBAC · 2FA)' },
  { delay: 200, type: 'ok',    text: 'AIRS Module — AI Responsibility & Security' },
  { delay: 160, type: 'ok',    text: 'Database adapters (PostgreSQL · MongoDB · MySQL)' },
  { delay: 220, type: 'warn',  text: 'Running OWASP compliance checks...' },
  { delay: 180, type: 'pass',  text: 'All 2,300+ tests green' },
  { delay: 200, type: 'ok',    text: 'Deploying to production — CI/CD pipeline' },
];

let _ts = 0;
function formatTimestamp() {
  _ts += Math.random() * 0.2 + 0.1;
  return `${_ts.toFixed(3).padStart(9, ' ')}`;
}

export default function BootSequenceAddon({ data, skin }) {
  const [isDone, setIsDone]           = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);

  const bootData            = data?.boot;
  const rawLines            = bootData?.lines || DEFAULT_BOOT_LINES;
  const nodeName            = data?.meta?.nodeName || 'portfolio.node';
  const accessGrantedSuffix = bootData?.accessGrantedSuffix || 'Welcome to';

  _ts = 0;

  const lines = [
    ...rawLines.map(({ delay, type, text }) => ({
      delay,
      content: (
        <>
          <span className="dim">[{formatTimestamp()}]</span>{' '}
          {type === 'ok'   && <span className="ok">[  OK  ]</span>}
          {type === 'warn' && <span className="warn">[SCAN ]</span>}
          {type === 'pass' && <span className="ok">[PASS ]</span>}
          {' '}<span className={TYPE_CLASS[type] || ''}>{text}</span>
        </>
      ),
    })),
    {
      delay: 300,
      content: (
        <>
          <span className="dim">[    1.200]</span>{' '}
          <span className="ok">ACCESS GRANTED</span>{' — '}{accessGrantedSuffix}{' '}
          <span className="ok">{nodeName}</span>
          <span className="boot-cursor" />
        </>
      ),
    },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isDone) return null;

  const progressWidth = currentLine === -1 ? 0 : ((currentLine + 1) / lines.length) * 100;

  return (
    <div className="boot-overlay" id="bootOverlay">
      {lines.map((line, index) => (
        <div
          key={index}
          className="boot-line"
          style={{
            opacity:   index <= currentLine ? 1 : 0,
            transform: index <= currentLine ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity var(--transition-fast), transform var(--transition-fast)',
          }}
        >
          {line.content}
        </div>
      ))}
      <div
        className="boot-progress"
        style={{ opacity: currentLine >= 0 ? 1 : 0, transition: 'opacity var(--transition-base)' }}
      >
        <div
          className="boot-progress-fill"
          style={{ width: `${progressWidth}%`, transition: 'width var(--transition-fast)' }}
        />
      </div>
    </div>
  );
}
