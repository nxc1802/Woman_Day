/* ============================================
   GALLERY PAGE — Logic (AOS + Lightbox)
   ============================================ */

/* ---- Photo data (captions for lightbox) ---- */
const GALLERY_PHOTOS = [
  { src: '../assets/images/gf1.jpg', caption: 'The day everything changed 💕' },
  { src: '../assets/images/gf2.jpg', caption: 'Your beautiful smile 🌸' },
  { src: '../assets/images/gf3.jpg', caption: 'Our favorite place ✨' },
  { src: '../assets/images/gf4.jpg', caption: 'Always glowing 💗' },
  { src: '../assets/images/gf5.jpg', caption: 'A moment in time 🌺' },
  { src: '../assets/images/gf6.jpg', caption: 'Pure happiness 💖' },
  { src: '../assets/images/gf7.jpg', caption: 'My world 🥰' },
  { src: '../assets/images/gf8.jpg', caption: 'Forever and always ❤️' },
];

let currentLbIdx = 0;

/* ---- Init AOS ---- */
window.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1200,
    once: false,
    offset: 60,
    easing: 'ease-out-cubic',
  });

  if (typeof gsap !== 'undefined') {
    gsap.from('#galleryHeader', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.out',
    });
    gsap.from('#galleryStats', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      delay: 0.3,
      ease: 'power2.out',
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'Escape') closeLightbox();
  });
});

/* ---- Lightbox open ---- */
function openLightbox(idx) {
  currentLbIdx = idx;
  const photo = GALLERY_PHOTOS[idx];
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');

  lbImage.src = photo.src;
  lbCaption.textContent = photo.caption;
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/* ---- Lightbox navigate ---- */
function lbNav(dir) {
  currentLbIdx = (currentLbIdx + dir + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  const photo = GALLERY_PHOTOS[currentLbIdx];
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');

  if (typeof gsap !== 'undefined') {
    gsap.to(lbImage, {
      opacity: 0,
      x: dir * -30,
      duration: 0.2,
      onComplete: () => {
        lbImage.src = photo.src;
        lbCaption.textContent = photo.caption;
        gsap.fromTo(lbImage,
          { opacity: 0, x: dir * 30 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  } else {
    lbImage.src = photo.src;
    lbCaption.textContent = photo.caption;
  }
}

/* ---- Lightbox close ---- */
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (typeof gsap !== 'undefined') {
    gsap.to(lb, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        lb.classList.add('hidden');
        lb.style.opacity = '';
        document.body.style.overflow = '';
      }
    });
  } else {
    lb.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
