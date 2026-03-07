import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/photobooth.css';

/* Each image is already a complete photobooth strip (4-frame print) */
const PHOTOS = [
  '/assets/images/photobooth/IMG_0718.JPG',
  '/assets/images/photobooth/IMG_0859.JPG',
  '/assets/images/photobooth/IMG_0860.JPG',
  '/assets/images/photobooth/IMG_0861.JPG',
  '/assets/images/photobooth/IMG_0862.JPG',
  '/assets/images/photobooth/IMG_0909.JPG',
  '/assets/images/photobooth/IMG_0910.JPG',
  '/assets/images/photobooth/IMG_0911.JPG',
];

/* Slight rotation for each strip — alternating for a scattered look */
const ROTATIONS = [-2.5, 1.8, -1.2, 3, -3.5, 2.2, -1.8, 2.8];

function Lightbox({ src, onClose }) {
  const overlayRef = useRef(null);
  const imgRef     = useRef(null);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.from(imgRef.current,     { opacity: 0, scale: 0.88, duration: 0.35, ease: 'back.out(1.4)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }

  return (
    <div className="pb-lightbox" ref={overlayRef} onClick={close}>
      <div className="pb-lightbox-inner" onClick={e => e.stopPropagation()} ref={imgRef}>
        <img src={src} alt="Phóng to" />
        <button className="pb-lb-close" onClick={close}>✕</button>
      </div>
    </div>
  );
}

export default function PhotoboothPage() {
  const headerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.8 });
    gsap.from('.pb-strip', {
      opacity: 0, y: 50, rotate: 0,
      stagger: 0.1, duration: 0.6, delay: 0.3,
      ease: 'back.out(1.3)',
    });
  }, []);

  return (
    <div className="photobooth-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="pb-bg" />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="pb-header" ref={headerRef}>
        <div className="pb-camera-icon">📷</div>
        <h1 className="page-title">Photobooth</h1>
        <p className="page-subtitle">Những khoảnh khắc chụp cùng nhau 🎞️</p>
      </div>

      <div className="pb-gallery">
        {PHOTOS.map((src, i) => (
          <div
            key={i}
            className="pb-strip"
            style={{ '--rot': `${ROTATIONS[i % ROTATIONS.length]}deg` }}
            onClick={() => setLightbox(src)}
          >
            {/* Tape strip at top */}
            <div className="strip-tape" />
            {/* The photobooth print */}
            <div className="strip-print">
              <img src={src} alt={`Photobooth ${i + 1}`} loading="lazy" />
            </div>
            {/* Caption area at bottom */}
            <div className="strip-caption">📸 {String(i + 1).padStart(2, '0')}</div>
            <div className="strip-shine" />
          </div>
        ))}
      </div>

      <div className="pb-footer">
        <span className="pb-footer-text">🎞️ Every frame is a memory worth keeping</span>
      </div>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
