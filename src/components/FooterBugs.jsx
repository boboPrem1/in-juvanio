import { useEffect, useRef } from 'react';

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
      const isLight = document.body.classList.contains('light-mode');

      // Clear with trail effect
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = isLight ? '#f8fafc' : '#080a0f'; // Solid background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;

      // Draw subtle CRT scanlines
      ctx.fillStyle = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.3)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;

      // Bloom effect for text
      ctx.shadowBlur = isLight ? 4 : 10;

      const bugY = Math.floor(canvas.height / fontSize) - 1;

      for (let i = 0; i < drops.length; i++) {
        // Draw bug
        if (bugs[i]) {
          if (bugs[i].active) {
            ctx.shadowColor = isLight ? '#be123c' : '#ff4d6d';
            ctx.fillStyle = isLight ? '#be123c' : '#ff4d6d';
            ctx.fillText(bugs[i].char, i * fontSize, bugY * fontSize);
          } else if (bugs[i].timer > 0) {
            ctx.shadowColor = isLight ? '#be123c' : '#ff4d6d';
            ctx.fillStyle = isLight ? '#be123c' : '#ff4d6d';
            // Glitch effect text
            const glitchChars = '!<>-_\\\\/[]{}—=+*^?#_';
            const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            ctx.fillText(randomChar, i * fontSize, bugY * fontSize);
            bugs[i].timer--;
            if (bugs[i].timer <= 0) {
              if (Math.random() > 0.5) {
                bugs[i] = { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 };
              } else {
                bugs[i] = null;
              }
            }
          }
        }

        // Draw binary drop
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.shadowColor = isLight ? '#0b7a6f' : '#00e5c3';
        ctx.fillStyle = isLight ? '#0b7a6f' : '#00e5c3';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset shadow to avoid affecting other draws
        ctx.shadowBlur = 0;

        // Collision logic
        if (bugs[i] && bugs[i].active && Math.floor(drops[i]) === bugY) {
          bugs[i].active = false;
          bugs[i].timer = 25; // Longer glitch frames
        }

        // Reset drop
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
          if (!bugs[i] && Math.random() > 0.8) {
            bugs[i] = { active: true, char: Math.random() > 0.5 ? '🐛' : '🐞', timer: 0 };
          }
        }

        // Slower speed!
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.05
      }}
    />
  );
}
