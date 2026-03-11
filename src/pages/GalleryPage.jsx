import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/gallery.css';
import { getPhotos } from '../lib/prefetch';

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
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [lbIdx, setLbIdx] = useState(0);
  const headerRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    getPhotos().then(data => {
      const galleryPhotos = (data ?? []).filter(p => p.category === 'gallery' || !p.category);
      setAllPhotos(galleryPhotos);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const photos = useMemo(() =>
    filter === 'all' ? allPhotos : allPhotos.filter(p => p.type === filter),
    [filter, allPhotos]);

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
          {[['all', 'All ❤️'], ['solo', 'Hong 🌸'], ['couple', 'Us 💕']].map(([val, label]) => (
            <button key={val}
              className={`tab-btn ${filter === val ? 'active' : ''}`}
              onClick={() => setFilter(val)}
            >{label}</button>
          ))}
        </div>
      </header>

      {/* Infinite marquee strips */}
      <div className="marquee-strips" ref={stripRef}>
        {loading ? (
          <div className="gallery-loading">Đang tải ảnh... 💕</div>
        ) : photos.length === 0 ? (
          <div className="gallery-loading">Chưa có ảnh nào 🌸</div>
        ) : (
          <>
            <MarqueeRow photos={row1} direction="left" speed={5} rowHeight={230} onPhotoClick={openLightbox} />
            <MarqueeRow photos={row2} direction="right" speed={6} rowHeight={200} onPhotoClick={openLightbox} />
            <MarqueeRow photos={row3} direction="left" speed={4.5} rowHeight={215} onPhotoClick={openLightbox} />
          </>
        )}
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
