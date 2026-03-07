import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/gallery.css';

const ALL_PHOTOS = [
  // Solo — Anh_Hong
  { src: '/assets/images/Anh_Hong/IMG_0836.JPG', caption: 'Radiantly beautiful 🌸', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0837.JPG', caption: 'That smile 💕', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0835.JPG', caption: 'My favorite view ✨', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0574.JPG', caption: 'So stunning 💗', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0577.JPG', caption: 'My world 🌺', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0596.JPG', caption: 'Always glowing 💖', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0603.JPG', caption: 'Pure happiness 🥰', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0951.JPG', caption: 'Effortlessly gorgeous ❤️', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0957.JPG', caption: 'That look 💓', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1099.JPG', caption: 'Perfection 🌷', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1628.JPG', caption: 'My sunshine ☀️', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1839.JPG', caption: 'You are everything 💞', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0570.JPG', caption: 'Beautifully you 🌸', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0575.JPG', caption: 'My heart 💗', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0594.JPG', caption: 'So lovely 🥰', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0834.JPG', caption: 'Absolutely breathtaking 💞', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0838.JPG', caption: 'Wow 🌸', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_0843.JPG', caption: "Still can't believe you're mine ❤️", type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1100.JPG', caption: 'My everything ✨', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1634.JPG', caption: 'So so beautiful 💕', type: 'solo' },
  { src: '/assets/images/Anh_Hong/IMG_1843.JPG', caption: 'Forever my favorite 💗', type: 'solo' },
  // Couple — Chung_minh
  { src: '/assets/images/Chung_minh/IMG_0716.JPG', caption: 'Us ❤️', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0859.JPG', caption: 'Together is my favorite place 💕', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0909.JPG', caption: 'Every day with you 🌸', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0970.jpeg', caption: 'Making memories 💗', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1095.jpeg', caption: 'My happy place ✨', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1238.jpeg', caption: 'Two hearts 💖', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1397.jpeg', caption: 'Adventures together 🌺', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1540.jpeg', caption: 'You + me 🥰', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1739.jpeg', caption: 'Infinite love 💞', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1836.jpeg', caption: 'Forever & always ❤️', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0717.JPG', caption: 'Us being us 💕', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0860.JPG', caption: 'Side by side 💗', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_0910.JPG', caption: 'Happiest with you 🌺', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1741.jpeg', caption: 'Perfect moments 💖', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1745.jpeg', caption: 'Cherished 🥰', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1750.jpeg', caption: 'Our story 💓', type: 'couple' },
  { src: '/assets/images/Chung_minh/IMG_1842.jpeg', caption: 'Still falling ❤️', type: 'couple' },
];

/* Shuffle an array deterministically by offset */
function rotate(arr, offset) {
  const n = arr.length;
  return [...arr.slice(offset % n), ...arr.slice(0, offset % n)];
}

/* Single marquee row */
function MarqueeRow({ photos, direction = 'left', speed = 40, rowHeight = 220, onPhotoClick }) {
  // Duplicate to create seamless infinite loop
  const doubled = [...photos, ...photos];
  const dur = `${(photos.length * speed)}s`;
  const animName = direction === 'left' ? 'marqueeLeft' : 'marqueeRight';

  return (
    <div className="marquee-row" style={{ height: `${rowHeight}px` }}>
      <div
        className="marquee-track"
        style={{ animationDuration: dur, animationName: animName }}
      >
        {doubled.map((photo, i) => (
          <div
            key={`${photo.src}-${i}`}
            className="marquee-photo"
            style={{ height: `${rowHeight}px` }}
            onClick={() => onPhotoClick(photo)}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <div className="marquee-overlay">
              <p className="marquee-caption">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [lbIdx, setLbIdx] = useState(0);
  const headerRef = useRef(null);
  const stripRef = useRef(null);

  const photos = useMemo(() =>
    filter === 'all' ? ALL_PHOTOS : ALL_PHOTOS.filter(p => p.type === filter),
  [filter]);

  // Split photos into 3 rows with different starting offsets
  const row1 = useMemo(() => rotate(photos, 0), [photos]);
  const row2 = useMemo(() => rotate(photos, Math.floor(photos.length / 3)), [photos]);
  const row3 = useMemo(() => rotate(photos, Math.floor(photos.length * 2 / 3)), [photos]);

  // Open lightbox
  const openLightbox = useCallback((photo) => {
    const idx = photos.findIndex(p => p.src === photo.src);
    setLbIdx(idx >= 0 ? idx : 0);
    setLightbox(true);
  }, [photos]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + photos.length) % photos.length);
      if (e.key === 'Escape') closeLightbox();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, photos.length, closeLightbox]);

  // GSAP entrance
  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.8 });
    gsap.from(stripRef.current, { opacity: 0, duration: 1, delay: 0.4 });
  }, []);

  return (
    <div className="gallery-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <Link to="/home" className="back-btn">← Back</Link>

      {/* Header */}
      <header className="gallery-header" ref={headerRef}>
        <h1 className="page-title">Our Memories</h1>
        <p className="page-subtitle">{photos.length} precious moments</p>

        <div className="gallery-tabs">
          {[['all','All ❤️'], ['solo','Hong 🌸'], ['couple','Us 💕']].map(([val, label]) => (
            <button key={val}
              className={`tab-btn ${filter === val ? 'active' : ''}`}
              onClick={() => setFilter(val)}
            >{label}</button>
          ))}
        </div>
      </header>

      {/* Infinite marquee strips */}
      <div className="marquee-strips" ref={stripRef}>
        <MarqueeRow photos={row1} direction="left"  speed={5} rowHeight={230} onPhotoClick={openLightbox} />
        <MarqueeRow photos={row2} direction="right" speed={6} rowHeight={200} onPhotoClick={openLightbox} />
        <MarqueeRow photos={row3} direction="left"  speed={4.5} rowHeight={215} onPhotoClick={openLightbox} />
      </div>

      {/* Footer hint */}
      <p className="gallery-hint">Click any photo to view full size ✨</p>

      {/* Lightbox */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="lb-close" onClick={closeLightbox}>✕</button>
          <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); setLbIdx(i => (i - 1 + photos.length) % photos.length); }}>‹</button>
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={photos[lbIdx]?.src} alt={photos[lbIdx]?.caption} />
            <p className="lb-caption">{photos[lbIdx]?.caption}</p>
            <p className="lb-counter">{lbIdx + 1} / {photos.length}</p>
          </div>
          <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); setLbIdx(i => (i + 1) % photos.length); }}>›</button>
        </div>
      )}
    </div>
  );
}
