import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor({ cursorData = { type: 'custom' } }) {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ cx: 0, cy: 0, mx: 0, my: 0, rx: 0, ry: 0 });

  const type = cursorData.type || 'custom';

  useEffect(() => {
    const handleMouseMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };

    const animateRing = () => {
      pos.current.cx += (pos.current.mx - pos.current.cx) * 0.5;
      pos.current.cy += (pos.current.my - pos.current.cy) * 0.5;
      
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.cx + 'px';
        cursorRef.current.style.top = pos.current.cy + 'px';
      }

      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12;
      
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px';
        ringRef.current.style.top = pos.current.ry + 'px';
      }
      
      requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(animateRing);

    const handleMouseEnter = () => {
      cursorRef.current?.classList.add('hover');
      ringRef.current?.classList.add('hover');
    };
    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove('hover');
      ringRef.current?.classList.remove('hover');
    };

    // Attach hover effect to interactive elements using mutation observer or event delegation
    // For simplicity, we delegate hover styles to the document body
    const handleMouseOverDelegation = (e) => {
      const target = e.target.closest('a, button, .skill-card, .feature-row, .git-commit, .arch-block, .contact-cmd, .api-toggle-switch');
      if (target) handleMouseEnter();
    };
    const handleMouseOutDelegation = (e) => {
      const target = e.target.closest('a, button, .skill-card, .feature-row, .git-commit, .arch-block, .contact-cmd, .api-toggle-switch');
      if (target) handleMouseLeave();
    };

    document.addEventListener('mouseover', handleMouseOverDelegation);
    document.addEventListener('mouseout', handleMouseOutDelegation);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOverDelegation);
      document.removeEventListener('mouseout', handleMouseOutDelegation);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (type === 'default' || type === 'none') {
    return null;
  }

  return (
    <>
      <div className={`cursor ${type}`} id="cursor" ref={cursorRef}></div>
      {type === 'custom' && <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>}
    </>
  );
}
