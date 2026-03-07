/* ============================================
   PASSWORD PAGE — Logic
   ============================================ */

const CORRECT_PASSWORD = '05102025';

const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const inputGroup = document.getElementById('inputGroup');
const explosionContainer = document.getElementById('explosionContainer');
const lockCard = document.getElementById('lockCard');
const lockIcon = document.getElementById('lockIcon');

/* ---- Background hearts ---- */
(function spawnBgHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['❤️', '🌸', '💕', '💗', '🌺', '💖', '✨'];
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'bg-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.setProperty('--left', Math.random() * 100 + '%');
    heart.style.setProperty('--size', (0.8 + Math.random() * 1.2) + 'rem');
    heart.style.setProperty('--dur', (8 + Math.random() * 10) + 's');
    heart.style.setProperty('--delay', (Math.random() * 8) + 's');
    heart.style.setProperty('--rot', (Math.random() * 30 - 15) + 'deg');
    heart.style.setProperty('--rot2', (Math.random() * 40 - 20) + 'deg');
    container.appendChild(heart);
  }
})();

/* ---- GSAP entrance animation ---- */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    gsap.from(lockCard, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.5)',
    });
  }
});

/* ---- Enter key support ---- */
passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPassword();
});

/* ---- Clear error on typing ---- */
passwordInput.addEventListener('input', () => {
  if (!errorMsg.classList.contains('hidden')) {
    errorMsg.classList.add('hidden');
  }
  inputGroup.classList.remove('shake');
});

/* ---- Main check function ---- */
function checkPassword() {
  const val = passwordInput.value.trim().toLowerCase();

  if (val === CORRECT_PASSWORD) {
    handleSuccess();
  } else {
    handleError();
  }
}

/* ---- Wrong password ---- */
function handleError() {
  inputGroup.classList.remove('shake');
  void inputGroup.offsetWidth; // force reflow to restart animation
  inputGroup.classList.add('shake');

  errorMsg.classList.remove('hidden');
  passwordInput.value = '';

  if (typeof gsap !== 'undefined') {
    gsap.to(lockIcon, {
      rotation: -15,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
    });
  }
}

/* ---- Correct password ---- */
function handleSuccess() {
  unlockBtn.disabled = true;
  passwordInput.disabled = true;

  triggerHeartExplosion();

  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();

    tl.to(lockCard, {
      scale: 1.03,
      duration: 0.25,
      ease: 'power1.out',
    })
    .to(lockIcon, {
      rotation: 360,
      duration: 0.6,
      ease: 'back.out(2)',
    }, '<')
    .to(lockCard, {
      opacity: 0,
      scale: 0.85,
      y: -30,
      duration: 0.5,
      delay: 1.2,
      ease: 'power2.in',
      onComplete: () => {
        window.location.href = 'home.html';
      },
    });
  } else {
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 2000);
  }
}

/* ---- Heart explosion effect ---- */
function triggerHeartExplosion() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const emojis = ['❤️', '💕', '💗', '💖', '🌸', '✨', '💓', '🌺'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'explode-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist1 = 80 + Math.random() * 200;
    const dist2 = 150 + Math.random() * 350;
    const rot = (Math.random() - 0.5) * 360;
    const rot2 = rot + (Math.random() - 0.5) * 180;
    const dur = 0.8 + Math.random() * 0.7;

    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    el.style.setProperty('--vx', Math.cos(angle) * dist1 + 'px');
    el.style.setProperty('--vy', Math.sin(angle) * dist1 + 'px');
    el.style.setProperty('--vx2', Math.cos(angle) * dist2 + 'px');
    el.style.setProperty('--vy2', Math.sin(angle) * dist2 + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    el.style.setProperty('--rot2', rot2 + 'deg');
    el.style.setProperty('--dur', dur + 's');
    el.style.animationDelay = (Math.random() * 0.3) + 's';
    el.style.fontSize = (1 + Math.random() * 1.8) + 'rem';

    explosionContainer.appendChild(el);

    setTimeout(() => el.remove(), (dur + 0.5) * 1000);
  }
}
