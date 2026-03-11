import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/gift.css';
import { getPhotos, getMessages } from '../lib/prefetch';

// Mutable pools — populated from DB after load
let messagePool = [];
let photosReady  = false;

const MSG_COLORS = [
  'rgba(249,168,201,0.88)',
  'rgba(236,72,153,0.9)',
  'rgba(255,210,230,0.78)',
  'rgba(253,244,255,0.85)',
  'rgba(255,182,210,0.88)',
];

let idCounter = 0;
function genId() { return ++idCounter; }

function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* Queue that cycles through all photos in shuffled order, never repeating
   until every photo has been shown once */
let photoQueue = [];
let photoPool  = [];

function nextPhoto() {
  if (photoQueue.length === 0) {
    photoQueue = [...photoPool].sort(() => Math.random() - 0.5);
  }
  return photoQueue.pop();
}

/* ---- Single falling item (photo or message) ---- */
function FallingItem({ item, onEnd, onPhotoClick }) {
  const style = {
    left: item.left,
    animationDuration: `${item.duration}s`,
    animationDelay: `${item.delay}s`,
    '--rot': `${item.rot}deg`,
    '--rot2': `${item.rot2}deg`,
  };

  if (item.type === 'photo') {
    return (
      <div className="falling-photo" style={style}
        onClick={() => onPhotoClick(item.src)}
        onAnimationEnd={onEnd}
        title="Click to set as center photo"
      >
        <img src={item.src} alt="" draggable={false} />
        <div className="falling-photo-ring" />
      </div>
    );
  }
  return (
    <div className="falling-message" style={{ ...style, '--msg-color': item.color }}
      onAnimationEnd={onEnd}
    >
      {item.content}
    </div>
  );
}

/* ---- Snow Canvas ---- */
function SnowCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const flakesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeFlake() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: 1.2 + Math.random() * 3,
        speed: 0.7 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 0.6,
        wobble: Math.random() * Math.PI * 2,
        ws: 0.012 + Math.random() * 0.022,
        op: 0.25 + Math.random() * 0.55,
      };
    }

    flakesRef.current = Array.from({ length: 200 }, () => {
      const f = makeFlake(); f.y = Math.random() * canvas.height; return f;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakesRef.current.forEach(f => {
        f.wobble += f.ws;
        f.x += f.drift + Math.sin(f.wobble) * 0.35;
        f.y += f.speed;
        if (f.y > canvas.height + f.r) { f.y = -f.r; f.x = Math.random() * canvas.width; }
        if (f.x > canvas.width + f.r) f.x = -f.r;
        if (f.x < -f.r) f.x = canvas.width + f.r;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253,244,255,${f.op})`;
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(249,168,201,0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="snow-canvas" />;
}

/* ---- Main Gift Page ---- */
export default function GiftPage() {
  const [fallingItems, setFallingItems] = useState([]);
  const [centerPhoto, setCenterPhoto] = useState(null);
  const [centerFlash, setCenterFlash] = useState(false);
  const cardRef = useRef(null);
  const frameRef = useRef(null);

  // Load photos and messages from DB
  useEffect(() => {
    getPhotos().then(data => {
      const soloPhotos = (data ?? []).filter(p => p.type === 'solo').map(p => p.src);
      photoPool    = soloPhotos;
      photoQueue   = [];
      photosReady  = soloPhotos.length > 0;
      if (soloPhotos.length > 0) {
        setCenterPhoto(soloPhotos[Math.floor(Math.random() * soloPhotos.length)]);
      }
    });
    getMessages().then(data => {
      if (data && data.length > 0) messagePool = data.map(m => m.text);
    });
  }, []);

  // GSAP entrance
  useEffect(() => {
    gsap.from(frameRef.current, { opacity: 0, scale: 0.5, duration: 1.2, ease: 'back.out(2)', delay: 0.3 });
    gsap.from(cardRef.current, { opacity: 0, y: 50, duration: 0.9, delay: 0.8, ease: 'back.out(1.4)' });
  }, []);

  // Spawn falling items — only starts after photos are loaded from DB
  useEffect(() => {
    function spawn() {
      // Don't spawn photos until pool is loaded; still spawn messages early
      const canPhoto = photosReady && photoPool.length > 0;
      const canMsg   = messagePool.length > 0;
      if (!canPhoto && !canMsg) return;

      const isPhoto = canPhoto && (!canMsg || Math.random() > 0.38);
      setFallingItems(prev => {
        if (prev.length >= 22) return prev;
        return [...prev, {
          id: genId(),
          type: isPhoto ? 'photo' : 'message',
          src: isPhoto ? nextPhoto() : undefined,
          content: !isPhoto ? randomPick(messagePool) : undefined,
          color: !isPhoto ? randomPick(MSG_COLORS) : undefined,
          left: `${2 + Math.random() * 92}%`,
          duration: 7 + Math.random() * 6,
          delay: Math.random() * 0.3,
          rot: (Math.random() - 0.5) * 22,
          rot2: (Math.random() - 0.5) * 32,
        }];
      });
    }
    const timer = setInterval(spawn, 850);
    setTimeout(() => { for (let i = 0; i < 8; i++) setTimeout(spawn, i * 200); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const removeItem = useCallback((id) => {
    setFallingItems(prev => prev.filter(it => it.id !== id));
  }, []);

  const handlePhotoClick = useCallback((src) => {
    setCenterPhoto(src);
    setCenterFlash(true);
    setTimeout(() => setCenterFlash(false), 600);
    if (frameRef.current) {
      gsap.fromTo(frameRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 0.5, ease: 'back.out(2)' }
      );
    }
  }, []);

  return (
    <div className="gift-page">
      <SnowCanvas />
      <div className="falling-layer">
        {fallingItems.map(item => (
          <FallingItem
            key={item.id}
            item={item}
            onEnd={() => removeItem(item.id)}
            onPhotoClick={handlePhotoClick}
          />
        ))}
      </div>

      <Link to="/home" className="back-btn">← Back</Link>

      <div className="gift-content">
        {/* Center photo frame */}
        <div className={`center-frame ${centerFlash ? 'flash' : ''}`} ref={frameRef}>
          <div className="frame-ring ring-outer" />
          <div className="frame-ring ring-middle" />
          <div className="frame-photo">
            {centerPhoto
              ? <img src={centerPhoto} alt="My love" />
              : <div className="frame-loading">💕</div>
            }
          </div>
          <div className="frame-hearts">
            {['❤️', '💕', '💗', '✨'].map((e, i) => (
              <span key={i} className="orbit-heart" style={{ '--delay': `${i * 0.5}s`, '--i': i }}>{e}</span>
            ))}
          </div>
          <p className="frame-hint">Click any falling photo ✨</p>
        </div>

        {/* Gift card */}
        <div className="gift-card glass-card" ref={cardRef}>
          <span className="gift-card-top animate-heartbeat">🎁</span>
          <h1 className="gift-title">Happy Women's Day</h1>
          <p className="gift-date">March 8, 2026</p>
          <p className="gift-message">
            This little website is my heart, wrapped up just for you.<br />
            Thank you for being my sunshine every single day. 🌸
          </p>
          <div className="gift-hearts">
            {['❤️', '💕', '❤️'].map((e, i) => (
              <span key={i} className="animate-heartbeat" style={{ display: 'inline-block', fontSize: i === 1 ? '1.4rem' : '1.8rem', animationDelay: `${i * 0.3}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
