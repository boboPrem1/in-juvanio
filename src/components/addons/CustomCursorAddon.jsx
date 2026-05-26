// src/components/addons/CustomCursorAddon.jsx
// Migré Phase 4 — respect de prefers-reduced-motion (désactive le curseur custom)
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/utils/prefersReducedMotion';
import '../CustomCursor.css';

export default function CustomCursorAddon({ skin, cursorData }) {
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const pos = useRef({ cx: 0, cy: 0, mx: 0, my: 0, rx: 0, ry: 0 });

  // Support skin.cursor.type ou l'ancienne prop cursorData
  const type = skin?.cursor?.type || cursorData?.type || 'custom';

  // Pas de curseur custom si reduced motion ou type 'default'/'none'
  if (type === 'default' || type === 'none' || prefersReducedMotion()) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleMouseMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };

    let animId;
    const animateRing = () => {
      pos.current.cx += (pos.current.mx - pos.current.cx) * 0.5;
      pos.current.cy += (pos.current.my - pos.current.cy) * 0.5;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.cx + 'px';
        cursorRef.current.style.top  = pos.current.cy + 'px';
      }
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px';
        ringRef.current.style.top  = pos.current.ry + 'px';
      }
      animId = requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animateRing);

    const handleMouseEnter = () => {
      cursorRef.current?.classList.add('hover');
      ringRef.current?.classList.add('hover');
    };
    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove('hover');
      ringRef.current?.classList.remove('hover');
    };

    const handleOver = (e) => {
      if (e.target.closest('a, button, .skill-card, .feature-row, .git-commit, .arch-block, .contact-cmd, .api-toggle-switch'))
        handleMouseEnter();
    };
    const handleOut = (e) => {
      if (e.target.closest('a, button, .skill-card, .feature-row, .git-commit, .arch-block, .contact-cmd, .api-toggle-switch'))
        handleMouseLeave();
    };

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className={`cursor ${type}`} id="cursor" ref={cursorRef}></div>
      {type === 'custom' && <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>}
    </>
  );
}
