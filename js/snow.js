/* ============================================
   GIFT PAGE — Snow Canvas + Falling Messages
   ============================================ */

/* ============================================
   SNOW CANVAS
   ============================================ */

const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let W, H;
let snowflakes = [];
const SNOW_COUNT = 200;

/* Resize handler */
function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initSnow();
});

/* Snowflake constructor */
function createFlake() {
  return {
    x: Math.random() * W,
    y: Math.random() * H - H,
    radius: 1.2 + Math.random() * 3.5,
    speed: 0.8 + Math.random() * 2.2,
    drift: (Math.random() - 0.5) * 0.8,
    opacity: 0.3 + Math.random() * 0.6,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.025,
  };
}

function initSnow() {
  snowflakes = [];
  for (let i = 0; i < SNOW_COUNT; i++) {
    const f = createFlake();
    f.y = Math.random() * H; // spread initially
    snowflakes.push(f);
  }
}

/* Draw a single snowflake */
function drawFlake(f) {
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 245, 247, ${f.opacity})`;
  ctx.shadowBlur = 4;
  ctx.shadowColor = 'rgba(255, 107, 129, 0.4)';
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* Animation loop */
function animateSnow() {
  ctx.clearRect(0, 0, W, H);

  snowflakes.forEach((f) => {
    f.wobble += f.wobbleSpeed;
    f.x += f.drift + Math.sin(f.wobble) * 0.4;
    f.y += f.speed;

    if (f.y > H + f.radius) {
      f.y = -f.radius;
      f.x = Math.random() * W;
    }
    if (f.x > W + f.radius) f.x = -f.radius;
    if (f.x < -f.radius) f.x = W + f.radius;

    drawFlake(f);
  });

  requestAnimationFrame(animateSnow);
}

initSnow();
animateSnow();

/* ============================================
   FALLING LOVE MESSAGES
   ============================================ */

const LOVE_MESSAGES = [
  'I Love You ❤️',
  'You Are My World 🌍',
  'Forever With You 💕',
  'My Beautiful Girl 🌸',
  'Happy Women\'s Day 🌺',
  'You\'re Everything ✨',
  'My Sunshine ☀️',
  'Always & Forever 💗',
  'You Amaze Me 💖',
  'My Heart is Yours ❤️',
  'Beyond Words 🥰',
  '8/3 💌',
  'So in Love 💓',
  'You\'re My Home 🏡',
  'Endlessly Yours 💞',
];

const COLORS = [
  'rgba(255, 107, 129, 0.85)',
  'rgba(255, 77, 109, 0.9)',
  'rgba(255, 200, 210, 0.75)',
  'rgba(255, 245, 247, 0.8)',
  'rgba(255, 150, 170, 0.85)',
];

const messagesContainer = document.getElementById('loveMessages');
let messageIntervalId = null;

function createFallingMessage() {
  const el = document.createElement('div');
  el.className = 'love-msg';

  const msg = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
  el.textContent = msg;

  const size = (0.75 + Math.random() * 0.85) + 'rem';
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const left = (Math.random() * 95) + '%';
  const dur = (6 + Math.random() * 6) + 's';
  const delay = (Math.random() * 0.5) + 's';
  const rot = (Math.random() * 16 - 8) + 'deg';
  const rot2 = (Math.random() * 20 - 10) + 'deg';

  el.style.setProperty('--size', size);
  el.style.setProperty('--color', color);
  el.style.setProperty('--left', left);
  el.style.setProperty('--dur', dur);
  el.style.setProperty('--delay', delay);
  el.style.setProperty('--rot', rot);
  el.style.setProperty('--rot2', rot2);

  messagesContainer.appendChild(el);

  const totalMs = (parseFloat(dur) + parseFloat(delay)) * 1000 + 500;
  setTimeout(() => el.remove(), totalMs);
}

/* Start spawning messages */
function startMessages() {
  createFallingMessage();
  createFallingMessage();
  messageIntervalId = setInterval(createFallingMessage, 1000);
}

/* ============================================
   GSAP ENTRANCE
   ============================================ */

window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();

    tl.from('#photoFrame', {
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      ease: 'back.out(2)',
    })
    .from('#giftCard', {
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: 'back.out(1.4)',
    }, '-=0.4');
  }

  /* Delay messages slightly so they appear after entrance */
  setTimeout(startMessages, 1500);
});
