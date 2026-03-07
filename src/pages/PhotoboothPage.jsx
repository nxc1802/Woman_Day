import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/photobooth.css';

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

const STRIP_COLORS = [
  '#fff0f6', '#fce7f3', '#fdf2f8', '#fdf4ff', '#fff1f2',
  '#fce4ec', '#f3e5f5', '#fce7f3',
];

function PhotoStrip({ photos, color, label, delay = 0 }) {
  const [lightbox, setLightbox] = useState(null);
  const stripRef = useRef(null);

  useEffect(() => {
    if (stripRef.current) {
      gsap.from(stripRef.current, { opacity: 0, y: 50, duration: 0.7, delay, ease: 'back.out(1.3)' });
    }
  }, [delay]);

  return (
    <>
      <div className="strip-wrapper" ref={stripRef}>
        <div className="strip-label">{label}</div>
        <div className="photo-strip" style={{ '--strip-bg': color }}>
          <div className="strip-holes">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="hole" />)}
          </div>
          <div className="strip-frames">
            {photos.map((src, i) => (
              <div key={i} className="frame" onClick={() => setLightbox(src)}>
                <img src={src} alt={`Photobooth ${i + 1}`} loading="lazy" />
                <div className="frame-shine" />
              </div>
            ))}
          </div>
          <div className="strip-holes strip-holes-bottom">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="hole" />)}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="pb-lightbox" onClick={() => setLightbox(null)}>
          <div className="pb-lightbox-inner">
            <img src={lightbox} alt="Phóng to" />
            <button className="pb-lb-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="pb-empty">
      <div className="empty-film">
        <div className="ef-holes">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="ef-hole" />)}
        </div>
        <div className="ef-frames">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ef-frame">
              <span className="ef-icon">{['📷','🌸','💕','✨'][i]}</span>
            </div>
          ))}
        </div>
        <div className="ef-holes">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="ef-hole" />)}
        </div>
      </div>
      <p className="empty-title">Chưa có ảnh photobooth nào 📸</p>
      <p className="empty-hint">
        Thêm ảnh vào <code>public/assets/images/photobooth/</code><br />
        rồi cập nhật danh sách trong <code>PhotoboothPage.jsx</code>
      </p>
    </div>
  );
}

/* Split photos into strips of 4 */
function splitIntoStrips(photos, size = 4) {
  const strips = [];
  for (let i = 0; i < photos.length; i += size) {
    strips.push(photos.slice(i, i + size));
  }
  return strips;
}

export default function PhotoboothPage() {
  const headerRef = useRef(null);
  const hasPhotos = PHOTOS.length > 0;
  const strips = splitIntoStrips(PHOTOS, 4);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.8 });
    }
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

      <div className="pb-content">
        {!hasPhotos ? (
          <EmptyState />
        ) : (
          <div className="strips-grid">
            {strips.map((stripPhotos, idx) => (
              <PhotoStrip
                key={idx}
                photos={stripPhotos}
                color={STRIP_COLORS[idx % STRIP_COLORS.length]}
                label={`Strip #${idx + 1}`}
                delay={idx * 0.12}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pb-footer">
        <span className="pb-footer-text">🎞️ Every frame is a memory worth keeping</span>
      </div>
    </div>
  );
}
