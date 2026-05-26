// src/components/MarqueeBar.jsx
// Renommé depuis components/Marquee.jsx — clé registry : MarqueeBar
import './Marquee.css';

export default function MarqueeBar({ data }) {
  const items = data?.marquee?.items || [];
  const doubled = [...items, ...items];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
