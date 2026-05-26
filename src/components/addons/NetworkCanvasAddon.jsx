// src/components/addons/NetworkCanvasAddon.jsx
// Migré Phase 4 — respect de prefers-reduced-motion (canvas non rendu si activé)
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/utils/prefersReducedMotion';
import { getCssVarRgba } from '../../lib/getCssVar';

export default function NetworkCanvasAddon() {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Si reduced motion : ne pas rendre le canvas du tout
  if (prefersReducedMotion()) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    if (!hero) return;

    let W, H;
    const isMobile = window.innerWidth <= 600;
    const NODE_COUNT = isMobile ? 30 : 70;
    const CONNECTION_DIST = isMobile ? 120 : 160;
    const MOUSE_RADIUS = 200;
    let nodes = [];
    let packets = [];
    let packetTimer = 0;
    let animId;

    const resize = () => {
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    class Node {
      constructor() {
        this.x = Math.random() * (W || 1440);
        this.y = Math.random() * (H || 900);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = 1.5 + Math.random() * 1.5;
        this.baseAlpha = 0.15 + Math.random() * 0.35;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
    }

    class Packet {
      constructor(from, to) {
        this.from = from; this.to = to;
        this.progress = 0; this.speed = 0.02 + Math.random() * 0.02;
      }
      update() { this.progress += this.speed; return this.progress < 1; }
      draw(ctx) {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        const packetColor = getCssVarRgba('--canvas-accent2-base', 1);
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = packetColor; ctx.shadowBlur = 8; ctx.shadowColor = packetColor;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    }

    const initNodes = () => {
      nodes = []; packets = [];
      for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = getCssVarRgba('--canvas-accent-base', alpha);
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const dx = n.x - mousePos.current.x, dy = n.y - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.4;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.radius + 2, 0, Math.PI * 2);
          ctx.fillStyle = getCssVarRgba('--canvas-accent-base', alpha); ctx.fill();
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = getCssVarRgba('--canvas-accent-base', n.baseAlpha); ctx.fill();
      }
      packetTimer++;
      if (packetTimer % 60 === 0 && nodes.length > 1) {
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const to   = nodes[Math.floor(Math.random() * nodes.length)];
        const dx = from.x - to.x, dy = from.y - to.y;
        if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST * 1.5) packets.push(new Packet(from, to));
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        if (!packets[i].update()) { packets.splice(i, 1); continue; }
        packets[i].draw(ctx);
      }
      animId = requestAnimationFrame(animate);
    };

    resize(); initNodes(); animate();
    const handleResize = () => { resize(); initNodes(); };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mousePos.current.x = -1000; mousePos.current.y = -1000; };
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    const netObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { canvas.style.display = e.isIntersecting ? '' : 'none'; });
    }, { threshold: 0 });
    netObserver.observe(hero);

    return () => {
      window.removeEventListener('resize', handleResize);
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      netObserver.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="networkCanvas" ref={canvasRef}></canvas>;
}
