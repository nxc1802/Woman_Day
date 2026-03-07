import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/photobooth.css';

/* Each image is a complete 4-frame photobooth strip with its own border & branding */
const PHOTOS = [
  '/assets/images/photobooth/z7596350399168_6f295dc09637e7ff5aad72d3a37329ad.jpg',
  '/assets/images/photobooth/z7596350431285_e097b361d32bd6eab07007bd736b416f.jpg',
  '/assets/images/photobooth/z7596350434610_35ac4c79a3807bd29e703a09b83dace4.jpg',
  '/assets/images/photobooth/z7596350442471_01e2c9786ea4499d3d7fbb6fe7386bc3.jpg',
  '/assets/images/photobooth/z7596350453797_179ff7812008523ac95465478257788e.jpg',
  '/assets/images/photobooth/z7596350465181_ef182412c340a828157f3c17d083e141.jpg',
];

/* Per-strip sway config so each floats at its own rhythm */
const STRIP_CONFIG = [
  { rot: -2.5, swayDur: 5.2, swayDelay: 0    },
  { rot:  1.8, swayDur: 6.1, swayDelay: 0.8  },
  { rot: -1.2, swayDur: 4.8, swayDelay: 1.5  },
  { rot:  3.0, swayDur: 5.7, swayDelay: 0.4  },
  { rot: -3.5, swayDur: 6.4, swayDelay: 1.1  },
  { rot:  2.2, swayDur: 5.0, swayDelay: 1.9  },
];

/* ---- Petal/Snow background (same style as HomePage) ---- */
const BG_ICONS = ['🌸', '💕', '✨', '🌺', '💗', '🎞️', '📷', '🌷'];
function PetalsBg() {
  const petals = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    icon: BG_ICONS[i % BG_ICONS.length],
    left: `${(i / 28) * 100}%`,
    size: `${0.7 + Math.random() * 0.9}rem`,
    dur:  `${13 + Math.random() * 12}s`,
    delay: `${Math.random() * 12}s`,
    drift: `${Math.random() * 80 - 40}px`,
  }));
  return (
    <div className="pb-petals-bg" aria-hidden>
      {petals.map(p => (
        <span key={p.id} className="pb-petal" style={{
          left: p.left, fontSize: p.size,
          animationDuration: p.dur, animationDelay: p.delay,
          '--drift': p.drift,
        }}>{p.icon}</span>
      ))}
    </div>
  );
}

/* ---- Lightbox ---- */
function Lightbox({ src, idx, total, onPrev, onNext, onClose }) {
  const overlayRef = useRef(null);
  const imgRef     = useRef(null);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.22 });
    gsap.from(imgRef.current, { opacity: 0, scale: 0.88, duration: 0.38, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }

  function handleKey(e) {
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'Escape')     close();
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="pb-lightbox" ref={overlayRef} onClick={close}>
      <div className="pb-lightbox-inner" onClick={e => e.stopPropagation()} ref={imgRef}>
        <img src={src} alt="Phóng to" />
        <button className="pb-lb-close" onClick={close}>✕</button>
        <button className="pb-lb-nav pb-lb-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>
        <button className="pb-lb-nav pb-lb-next" onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>
        <div className="pb-lb-counter">{idx + 1} / {total}</div>
      </div>
    </div>
  );
}

/* ---- Main Page ---- */
export default function PhotoboothPage() {
  const headerRef  = useRef(null);
  const stripsRef  = useRef([]);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    /* Header entrance */
    gsap.from(headerRef.current, { opacity: 0, y: -40, duration: 0.9, ease: 'power3.out' });

    /* Strips: alternate from left / right + top, staggered */
    stripsRef.current.forEach((el, i) => {
      if (!el) return;
      const fromLeft = i % 2 === 0;
      gsap.from(el, {
        opacity: 0,
        x: fromLeft ? -80 : 80,
        y: -40,
        rotate: 0,
        duration: 0.75,
        delay: 0.3 + i * 0.12,
        ease: 'back.out(1.4)',
      });
    });
  }, []);

  function prevPhoto() {
    setLightboxIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length);
  }
  function nextPhoto() {
    setLightboxIdx(i => (i + 1) % PHOTOS.length);
  }

  return (
    <div className="photobooth-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="pb-bg" />
      <PetalsBg />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="pb-header" ref={headerRef}>
        <div className="pb-camera-icon">📷</div>
        <h1 className="page-title">Photobooth</h1>
        <p className="page-subtitle">Những khoảnh khắc chụp cùng nhau 🎞️</p>
      </div>

      <div className="pb-gallery">
        {PHOTOS.map((src, i) => {
          const cfg = STRIP_CONFIG[i % STRIP_CONFIG.length];
          return (
            <div
              key={i}
              className="pb-strip"
              ref={el => stripsRef.current[i] = el}
              style={{
                '--rot': `${cfg.rot}deg`,
                '--sway-dur': `${cfg.swayDur}s`,
                '--sway-delay': `${cfg.swayDelay}s`,
              }}
              onClick={() => setLightboxIdx(i)}
            >
              <img src={src} alt={`Photobooth ${i + 1}`} loading="lazy" className="strip-img" />
              {/* Badge */}
              <div className="strip-badge">📸 {String(i + 1).padStart(2, '0')}</div>
              <div className="strip-shine" />
            </div>
          );
        })}
      </div>

      <div className="pb-footer">
        <span className="pb-footer-text">🎞️ Every frame is a memory worth keeping</span>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          src={PHOTOS[lightboxIdx]}
          idx={lightboxIdx}
          total={PHOTOS.length}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
