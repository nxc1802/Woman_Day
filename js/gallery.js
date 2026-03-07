/* ============================================
   GALLERY PAGE — Dynamic render + AOS + Lightbox
   ============================================ */

/* ---- Photo data ---- */
const GALLERY_PHOTOS = [
  // Solo — Anh_Hong
  { src: '../assets/images/Anh_Hong/IMG_0836.JPG', caption: 'Radiantly beautiful 🌸', type: 'solo', size: 'large' },
  { src: '../assets/images/Anh_Hong/IMG_0837.JPG', caption: 'That smile 💕', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0835.JPG', caption: 'My favorite view ✨', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0574.JPG', caption: 'So stunning 💗', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0577.JPG', caption: 'My world 🌺', type: 'solo', size: 'tall' },
  { src: '../assets/images/Anh_Hong/IMG_0596.JPG', caption: 'Always glowing 💖', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0603.JPG', caption: 'Pure happiness 🥰', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0951.JPG', caption: 'Effortlessly gorgeous ❤️', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0957.JPG', caption: 'That look 💓', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_1099.JPG', caption: 'Perfection 🌷', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_1628.JPG', caption: 'My sunshine ☀️', type: 'solo', size: 'tall' },
  { src: '../assets/images/Anh_Hong/IMG_1839.JPG', caption: 'You are everything 💞', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0570.JPG', caption: 'Beautifully you 🌸', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0571.JPG', caption: 'Light of my life ✨', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0572.JPG', caption: 'Forever stunning 💕', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0573.JPG', caption: 'Always you 🌺', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0575.JPG', caption: 'My heart 💗', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0576.JPG', caption: 'Captivating 💖', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0594.JPG', caption: 'So lovely 🥰', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0595.JPG', caption: 'Beautiful soul ❤️', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0597.JPG', caption: 'You light up everything 🌷', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0598.JPG', caption: 'My favorite person 💓', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0834.JPG', caption: 'Absolutely breathtaking 💞', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0838.JPG', caption: 'Wow 🌸', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_0843.JPG', caption: 'Still can\'t believe you\'re mine ❤️', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_1100.JPG', caption: 'My everything ✨', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_1634.JPG', caption: 'So so beautiful 💕', type: 'solo' },
  { src: '../assets/images/Anh_Hong/IMG_1843.JPG', caption: 'Forever my favorite 💗', type: 'solo' },

  // Couple — Chung_minh
  { src: '../assets/images/Chung_minh/IMG_0716.JPG', caption: 'Us ❤️', type: 'couple', size: 'large' },
  { src: '../assets/images/Chung_minh/IMG_0859.JPG', caption: 'Together is my favorite place 💕', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0909.JPG', caption: 'Every day with you 🌸', type: 'couple', size: 'tall' },
  { src: '../assets/images/Chung_minh/IMG_0970.jpeg', caption: 'Making memories 💗', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1095.jpeg', caption: 'My happy place ✨', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1238.jpeg', caption: 'Two hearts 💖', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1397.jpeg', caption: 'Adventures together 🌺', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1540.jpeg', caption: 'You + me 🥰', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1739.jpeg', caption: 'Infinite love 💞', type: 'couple', size: 'large' },
  { src: '../assets/images/Chung_minh/IMG_1836.jpeg', caption: 'Forever & always ❤️', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0717.JPG', caption: 'Us being us 💕', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0718.JPG', caption: 'My person 🌸', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0860.JPG', caption: 'Side by side 💗', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0910.JPG', caption: 'Happiest with you 🌺', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_0911.JPG', caption: 'My world ✨', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1741.jpeg', caption: 'Perfect moments 💖', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1745.jpeg', caption: 'Cherished 🥰', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1750.jpeg', caption: 'Our story 💓', type: 'couple' },
  { src: '../assets/images/Chung_minh/IMG_1842.jpeg', caption: 'Still falling ❤️', type: 'couple' },
];

/* ---- AOS animation variants ---- */
const AOS_VARIANTS = ['fade-up', 'fade-left', 'fade-right', 'zoom-in', 'fade-up'];

/* ---- State ---- */
let currentFilter = 'all';
let visiblePhotos = [];
let currentLbIdx = 0;

/* ---- Get filtered photos ---- */
function getFiltered(filter) {
  if (filter === 'all') return GALLERY_PHOTOS;
  return GALLERY_PHOTOS.filter(p => p.type === filter);
}

/* ---- Render gallery grid ---- */
function renderGallery(filter) {
  const grid = document.getElementById('galleryGrid');
  visiblePhotos = getFiltered(filter);

  document.getElementById('statCount').textContent = visiblePhotos.length;

  grid.innerHTML = '';

  visiblePhotos.forEach((photo, i) => {
    const item = document.createElement('div');
    const sizeClass = photo.size === 'large' ? 'gallery-item--large'
                    : photo.size === 'tall'  ? 'gallery-item--tall'
                    : '';
    item.className = `gallery-item ${sizeClass}`;
    item.dataset.index = i;
    item.setAttribute('data-aos', AOS_VARIANTS[i % AOS_VARIANTS.length]);
    item.setAttribute('data-aos-duration', 900 + (i % 3) * 150 + '');
    item.setAttribute('data-aos-delay', Math.min(i % 4 * 60, 200) + '');

    item.innerHTML = `
      <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
      <div class="gallery-overlay">
        <div class="overlay-heart">${photo.type === 'couple' ? '💕' : '🌸'}</div>
        <p class="overlay-caption">${photo.caption}</p>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });

  AOS.refreshHard();
}

/* ---- Filter tabs ---- */
function filterGallery(filter, btn) {
  currentFilter = filter;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.getElementById('galleryGrid');

  if (typeof gsap !== 'undefined') {
    gsap.to(grid, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      onComplete: () => {
        renderGallery(filter);
        gsap.fromTo(grid,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  } else {
    renderGallery(filter);
  }
}

/* ---- Lightbox ---- */
function openLightbox(idx) {
  currentLbIdx = idx;
  const photo = visiblePhotos[idx];
  document.getElementById('lbImage').src = photo.src;
  document.getElementById('lbCaption').textContent = photo.caption;
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function lbNav(dir) {
  currentLbIdx = (currentLbIdx + dir + visiblePhotos.length) % visiblePhotos.length;
  const photo = visiblePhotos[currentLbIdx];
  const lbImage = document.getElementById('lbImage');

  if (typeof gsap !== 'undefined') {
    gsap.to(lbImage, {
      opacity: 0,
      x: dir * -30,
      duration: 0.18,
      onComplete: () => {
        lbImage.src = photo.src;
        document.getElementById('lbCaption').textContent = photo.caption;
        gsap.fromTo(lbImage,
          { opacity: 0, x: dir * 30 },
          { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out' }
        );
      }
    });
  } else {
    lbImage.src = photo.src;
    document.getElementById('lbCaption').textContent = photo.caption;
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ---- Init ---- */
window.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 1000, once: false, offset: 50, easing: 'ease-out-cubic' });
  renderGallery('all');

  if (typeof gsap !== 'undefined') {
    gsap.from('#galleryHeader', { opacity: 0, y: -30, duration: 0.8, ease: 'power2.out' });
    gsap.from('#galleryTabs', { opacity: 0, y: 15, duration: 0.7, delay: 0.2, ease: 'power2.out' });
    gsap.from('#galleryStats', { opacity: 0, y: 15, duration: 0.7, delay: 0.35, ease: 'power2.out' });
  }

  document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'Escape') closeLightbox();
  });
});
