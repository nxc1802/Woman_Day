import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const KB_ANIMS = ['kenBurns1', 'kenBurns2', 'kenBurns3'];

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index or null
  const autoTimer = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);

  const photos = useMemo(() =>
    filter === 'all' ? ALL_PHOTOS : ALL_PHOTOS.filter(p => p.type === filter),
  [filter]);

  // Ensure currentIdx is valid after filter change
  const safeIdx = Math.min(currentIdx, photos.length - 1);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setCurrentIdx((idx + photos.length) % photos.length);
      setFading(false);
    }, 450);
  }, [photos.length]);

  const goNext = useCallback(() => goTo(safeIdx + 1), [goTo, safeIdx]);
  const goPrev = useCallback(() => goTo(safeIdx - 1), [goTo, safeIdx]);

  // Auto-advance
  useEffect(() => {
    autoTimer.current = setInterval(goNext, 4500);
    return () => clearInterval(autoTimer.current);
  }, [goNext]);

  // Reset on filter change
  useEffect(() => { setCurrentIdx(0); }, [filter]);

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (lightbox !== null) {
        if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % photos.length);
        if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + photos.length) % photos.length);
        if (e.key === 'Escape') setLightbox(null);
        return;
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, photos.length, goNext, goPrev]);

  // GSAP entrance
  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.8 });
    gsap.from(carouselRef.current, { opacity: 0, scale: 0.95, duration: 0.9, delay: 0.3, ease: 'power2.out' });
  }, []);

  const photo = photos[safeIdx] ?? photos[0];
  const kbAnim = KB_ANIMS[safeIdx % KB_ANIMS.length];

  return (
    <div className="gallery-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <Link to="/home" className="back-btn">← Back</Link>

      {/* Header */}
      <header className="gallery-header" ref={headerRef}>
        <h1 className="page-title">Our Memories</h1>
        <p className="page-subtitle">{photos.length} precious moments</p>

        {/* Filter tabs */}
        <div className="gallery-tabs">
          {[['all','All ❤️'],['solo','Hong 🌸'],['couple','Us 💕']].map(([val, label]) => (
            <button key={val}
              className={`tab-btn ${filter === val ? 'active' : ''}`}
              onClick={() => setFilter(val)}
            >{label}</button>
          ))}
        </div>
      </header>

      {/* Carousel */}
      <div className="carousel-wrap" ref={carouselRef}>
        <div className={`carousel-stage ${fading ? 'fading' : ''}`}>
          {photo && (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.caption}
              className="carousel-img"
              style={{ animationName: kbAnim }}
              onClick={() => setLightbox(safeIdx)}
            />
          )}
          {/* Caption */}
          <div className={`carousel-caption ${fading ? 'fading' : ''}`}>
            <p>{photo?.caption}</p>
          </div>
          {/* Counter */}
          <div className="carousel-counter">
            {safeIdx + 1} / {photos.length}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button className="carousel-arrow arrow-left" onClick={() => { clearInterval(autoTimer.current); goPrev(); }}>‹</button>
        <button className="carousel-arrow arrow-right" onClick={() => { clearInterval(autoTimer.current); goNext(); }}>›</button>

        {/* Dot indicators */}
        <div className="carousel-dots">
          {photos.map((_, i) => (
            <button key={i} className={`dot ${i === safeIdx ? 'active' : ''}`}
              onClick={() => { clearInterval(autoTimer.current); goTo(i); }} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + photos.length) % photos.length); }}>‹</button>
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={photos[lightbox]?.src} alt={photos[lightbox]?.caption} />
            <p className="lb-caption">{photos[lightbox]?.caption}</p>
          </div>
          <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % photos.length); }}>›</button>
        </div>
      )}
    </div>
  );
}
