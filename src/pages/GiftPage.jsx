import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/gift.css';
import { getPhotos, getMessages } from '../lib/prefetch';

/* Static fallback — All 65 solo photos */
const STATIC_PHOTOS = [
  'IMG_0570', 'IMG_0571', 'IMG_0572', 'IMG_0573', 'IMG_0574',
  'IMG_0575', 'IMG_0576', 'IMG_0577', 'IMG_0594', 'IMG_0595',
  'IMG_0596', 'IMG_0597', 'IMG_0598', 'IMG_0599', 'IMG_0600',
  'IMG_0601', 'IMG_0602', 'IMG_0603', 'IMG_0604', 'IMG_0605',
  'IMG_0606', 'IMG_0607', 'IMG_0814', 'IMG_0817', 'IMG_0819',
  'IMG_0820', 'IMG_0821', 'IMG_0823', 'IMG_0830', 'IMG_0833',
  'IMG_0834', 'IMG_0835', 'IMG_0836', 'IMG_0837', 'IMG_0838',
  'IMG_0839', 'IMG_0840', 'IMG_0841', 'IMG_0842', 'IMG_0843',
  'IMG_0844', 'IMG_0845', 'IMG_0846', 'IMG_0847', 'IMG_0848',
  'IMG_0851', 'IMG_0852', 'IMG_0951', 'IMG_0952', 'IMG_0953',
  'IMG_0955', 'IMG_0956', 'IMG_0957', 'IMG_0966', 'IMG_1099',
  'IMG_1100', 'IMG_1628', 'IMG_1633', 'IMG_1634', 'IMG_1647',
  'IMG_1648', 'IMG_1649', 'IMG_1839', 'IMG_1842', 'IMG_1843',
].map(n => `/assets/images/Anh_Hong/${n}.JPG`);

const FALLBACK_MESSAGES = [
  'I Love You ❤️',
  'You Are My World 🌍',
  'Forever With You 💕',
  'My Beautiful Girl 🌸',
  "Happy Women's Day 🌺",
  "You're Everything ✨",
  'My Sunshine ☀️',
  'Always & Forever 💗',
  'You Amaze Me 💖',
  'My Heart is Yours ❤️',
  'Beyond Words 🥰',
  '8/3 💌',
  'So in Love 💓',
  'Endlessly Yours 💞',
];

// Mutable pool — replaced by DB data once loaded
let messagePool = [...FALLBACK_MESSAGES];

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
let photoPool = STATIC_PHOTOS;

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
  const [centerPhoto, setCenterPhoto] = useState(() => STATIC_PHOTOS[Math.floor(Math.random() * STATIC_PHOTOS.length)]);
  const [centerFlash, setCenterFlash] = useState(false);
  const cardRef = useRef(null);
  const frameRef = useRef(null);

  // Load photos and messages from Supabase
  useEffect(() => {
    getPhotos().then(data => {
      if (data && data.length > 0) {
        const soloPhotos = data.filter(p => p.type === 'solo').map(p => p.src);
        if (soloPhotos.length > 0) {
          photoPool = soloPhotos;
          photoQueue = [];
          setCenterPhoto(soloPhotos[Math.floor(Math.random() * soloPhotos.length)]);
        }
      }
    });
    getMessages().then(data => {
      if (data && data.length > 0) {
        messagePool = data.map(m => m.text);
      }
    });
  }, []);

  // GSAP entrance
  useEffect(() => {
    gsap.from(frameRef.current, { opacity: 0, scale: 0.5, duration: 1.2, ease: 'back.out(2)', delay: 0.3 });
    gsap.from(cardRef.current, { opacity: 0, y: 50, duration: 0.9, delay: 0.8, ease: 'back.out(1.4)' });
  }, []);

  // Spawn falling items
  useEffect(() => {
    function spawn() {
      const isPhoto = Math.random() > 0.38;   // ~62% photos
      setFallingItems(prev => {
        if (prev.length >= 22) return prev;   // higher cap
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
    const timer = setInterval(spawn, 850);    // faster spawn
    // Seed more items immediately
    setTimeout(() => { for (let i = 0; i < 8; i++) setTimeout(spawn, i * 200); }, 600);
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
            <img src={centerPhoto} alt="My love" />
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
