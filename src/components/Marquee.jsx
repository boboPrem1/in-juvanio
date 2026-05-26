import './Marquee.css';

export default function Marquee({ data }) {
  // ✅ Items depuis data.marquee.items (pas de hardcode)
  const items = data?.marquee?.items || [];

  // Dupliqués pour l'effet CSS de défilement infini
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
