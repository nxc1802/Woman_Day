import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/home.css';

const CARDS = [
  { to: '/music',      icon: '🎵', title: 'Our Songs',     desc: 'Songs that remind me of us',       color: 'card-music' },
  { to: '/letter',     icon: '💊', title: 'Lọ Thuốc',      desc: 'Những viên thuốc tình yêu của mình', color: 'card-letter' },
  { to: '/gallery',    icon: '🖼️', title: 'Our Memories',  desc: 'Moments I\'ll never forget',       color: 'card-gallery' },
  { to: '/photobooth', icon: '📷', title: 'Photobooth',    desc: 'Ảnh booth chụp cùng nhau 🎞️',     color: 'card-photobooth' },
  { to: '/gift',       icon: '🎁', title: 'My Gift',       desc: 'Something magical awaits...',      color: 'card-gift', special: true },
];

function PetalsBg() {
  const icons = ['🌸', '🌺', '🌷', '✨', '💮', '💕'];
  const petals = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    icon: icons[i % icons.length],
    left: `${Math.random() * 100}%`,
    size: `${0.7 + Math.random() * 0.9}rem`,
    dur: `${13 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    drift: `${Math.random() * 80 - 40}px`,
  }));
  return (
    <div className="petals-bg">
      {petals.map(p => (
        <span key={p.id} className="petal" style={{
          left: p.left, fontSize: p.size,
          animationDuration: p.dur, animationDelay: p.delay,
          '--drift': p.drift,
        }}>{p.icon}</span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(headerRef.current, { opacity: 0, y: -40, duration: 0.9 })
      .from(gridRef.current.children, { opacity: 0, y: 65, scale: 0.87, stagger: 0.14, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.4')
      .from(footerRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.2');
  }, []);

  return (
    <div className="home-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <PetalsBg />

      <header className="home-header" ref={headerRef}>
        <p className="home-date">Happy Women's Day 🌸 — March 8, 2025</p>
        <h1 className="page-title home-title">Choose Your Gift</h1>
        <p className="page-subtitle">A little something made with all my love for you</p>
      </header>

      <nav className="menu-grid" ref={gridRef}>
        {CARDS.map(card => (
          <Link key={card.to} to={card.to} className={`menu-card ${card.color} ${card.special ? 'card-special' : ''}`}>
            <div className="card-glow" />
            {card.special && <span className="card-badge">Special ✨</span>}
            <div className="card-icon">{card.icon}</div>
            <div className="card-text-wrap">
              <h2 className="card-title">{card.title}</h2>
              <p className="card-desc">{card.desc}</p>
            </div>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </nav>

      <footer className="home-footer" ref={footerRef}>
        <p>Made with <span className="animate-heartbeat" style={{ display: 'inline-block' }}>❤️</span> just for you</p>
      </footer>
    </div>
  );
}
