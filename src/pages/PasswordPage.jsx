import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/password.css';

const CORRECT_PASSWORD = '05102025';

const BG_EMOJIS = ['❤️', '🌸', '💕', '💗', '🌺', '💖', '✨', '🌷'];

function HeartsBg() {
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: BG_EMOJIS[i % BG_EMOJIS.length],
    left: `${Math.random() * 100}%`,
    size: `${0.8 + Math.random() * 1.2}rem`,
    dur: `${9 + Math.random() * 10}s`,
    delay: `${Math.random() * 9}s`,
  }));
  return (
    <div className="hearts-bg">
      {items.map(it => (
        <span key={it.id} className="bg-heart" style={{
          left: it.left, fontSize: it.size,
          animationDuration: it.dur, animationDelay: it.delay,
        }}>{it.emoji}</span>
      ))}
    </div>
  );
}

export default function PasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const explosionRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('love_unlocked') === 'true') {
      navigate('/home', { replace: true });
      return;
    }
    gsap.from(cardRef.current, { opacity: 0, y: 60, scale: 0.88, duration: 1.1, ease: 'back.out(1.6)' });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (password.trim().toLowerCase() === CORRECT_PASSWORD) {
      handleSuccess();
    } else {
      handleError();
    }
  }

  function handleError() {
    setError(true);
    setPassword('');
    setTimeout(() => setError(false), 3000);
    gsap.to(cardRef.current, { keyframes: { x: [-10, 10, -8, 8, -4, 4, 0] }, duration: 0.55, ease: 'none' });
    gsap.to(iconRef.current, { rotation: -15, duration: 0.1, yoyo: true, repeat: 5 });
  }

  function handleSuccess() {
    triggerExplosion();
    gsap.timeline()
      .to(iconRef.current, { rotation: 360, scale: 1.3, duration: 0.7, ease: 'back.out(2)' })
      .to(cardRef.current, { opacity: 0, scale: 0.88, y: -40, duration: 0.55, delay: 1.1,
        onComplete: () => {
          sessionStorage.setItem('love_unlocked', 'true');
          navigate('/home');
        }
      });
  }

  function triggerExplosion() {
    const container = explosionRef.current;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const emojis = ['❤️', '💕', '💗', '💖', '🌸', '✨', '💓', '🌺'];
    for (let i = 0; i < 48; i++) {
      const el = document.createElement('div');
      el.className = 'explode-heart';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (i / 48) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const d1 = 70 + Math.random() * 180;
      const d2 = 150 + Math.random() * 320;
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      el.style.setProperty('--vx', Math.cos(angle) * d1 + 'px');
      el.style.setProperty('--vy', Math.sin(angle) * d1 + 'px');
      el.style.setProperty('--vx2', Math.cos(angle) * d2 + 'px');
      el.style.setProperty('--vy2', Math.sin(angle) * d2 + 'px');
      el.style.setProperty('--rot', (Math.random() - 0.5) * 360 + 'deg');
      el.style.setProperty('--rot2', (Math.random() - 0.5) * 500 + 'deg');
      el.style.setProperty('--dur', (0.8 + Math.random() * 0.7) + 's');
      el.style.animationDelay = (Math.random() * 0.3) + 's';
      el.style.fontSize = (1 + Math.random() * 1.8) + 'rem';
      container.appendChild(el);
      setTimeout(() => el.remove(), 2200);
    }
  }

  return (
    <div className="pw-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <HeartsBg />
      <div className="explosion-container" ref={explosionRef} />

      <div className="pw-card glass-card" ref={cardRef}>
        <div className="pw-icon animate-float" ref={iconRef}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f9a8c9"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
            <path d="M50 85C50 85 12 56 12 33C12 18 24 8 38 8C44 8 50 11 50 11C50 11 56 8 62 8C76 8 88 18 88 33C88 56 50 85 50 85Z" fill="url(#lg)"/>
          </svg>
        </div>

        <h1 className="pw-title">For My Love</h1>
        <p className="pw-subtitle">Enter the password to open your gift 💕</p>

        <form className="pw-form" onSubmit={handleSubmit}>
          <div className={`pw-input-wrap ${error ? 'shake-active' : ''}`}>
            <input
              type="password"
              className="pw-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your secret password..."
              autoComplete="off"
              spellCheck="false"
              maxLength={30}
            />
          </div>
          {error && <p className="pw-error">💔 Wrong password, try again...</p>}
          <button type="submit" className="btn-pink">Unlock ✨</button>
        </form>

        <p className="pw-hint">Gợi ý: Ngày mình quen nhau 🥺</p>
      </div>
    </div>
  );
}
