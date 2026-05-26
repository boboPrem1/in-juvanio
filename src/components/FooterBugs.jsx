import { useEffect, useRef } from 'react';
import { getCssVar } from '../lib/getCssVar';

export default function FooterBugs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];
    let bugs = [];

    const initArrays = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      bugs = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
        if (Math.random() > 0.85) {
          bugs[x] = { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 };
        } else {
          bugs[x] = null;
        }
      }
    };
    initArrays();

    let animationId;

    const draw = () => {
      // ✅ Fond depuis --bg (pas de hardcode dark/light)
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = getCssVar('--bg');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;

      // ✅ Scanlines — opacité depuis --noise-opacity (approximation)
      const noiseOpacity = parseFloat(getCssVar('--noise-opacity') || '0.05');
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(noiseOpacity * 6, 0.3)})`;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      ctx.font = `bold ${fontSize}px var(--font-mono, 'JetBrains Mono', monospace)`;
      ctx.shadowBlur = 8;

      const bugY = Math.floor(canvas.height / fontSize) - 1;

      for (let i = 0; i < drops.length; i++) {
        // Draw bug
        if (bugs[i]) {
          if (bugs[i].active) {
            // ✅ accent2 depuis CSS var
            ctx.shadowColor = getCssVar('--accent2');
            ctx.fillStyle   = getCssVar('--accent2');
            ctx.fillText(bugs[i].char, i * fontSize, bugY * fontSize);
          } else if (bugs[i].timer > 0) {
            // ✅ accent2 depuis CSS var
            ctx.shadowColor = getCssVar('--accent2');
            ctx.fillStyle   = getCssVar('--accent2');
            const glitchChars = '!<>-_\\/[]{}—=+*^?#_';
            ctx.fillText(glitchChars[Math.floor(Math.random() * glitchChars.length)], i * fontSize, bugY * fontSize);
            bugs[i].timer--;
            if (bugs[i].timer <= 0) {
              bugs[i] = Math.random() > 0.5
                ? { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 }
                : null;
            }
          }
        }

        // ✅ Pluie binaire — couleur depuis --accent
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.shadowColor = getCssVar('--accent');
        ctx.fillStyle   = getCssVar('--accent');
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;

        // Collision logic
        if (bugs[i] && bugs[i].active && Math.floor(drops[i]) === bugY) {
          bugs[i].active = false;
          bugs[i].timer = 25;
        }

        // Reset drop
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
          if (!bugs[i] && Math.random() > 0.8) {
            bugs[i] = { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 };
          }
        }

        drops[i] += 0.25;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.05,
      }}
    />
  );
}
