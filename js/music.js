/* ============================================
   MUSIC PAGE — Logic (Howler.js)
   ============================================ */

/* ---- Song data — replace src with actual files ---- */
const SONGS = [
  {
    id: 0,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    src: '../assets/music/song1.mp3',
    cover: '../assets/images/gf1.jpg',
    duration: '4:23',
  },
  {
    id: 1,
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    src: '../assets/music/song2.mp3',
    cover: '../assets/images/gf2.jpg',
    duration: '4:45',
  },
  {
    id: 2,
    title: 'Can\'t Help Falling in Love',
    artist: 'Elvis Presley',
    src: '../assets/music/song3.mp3',
    cover: '../assets/images/gf3.jpg',
    duration: '3:00',
  },
  {
    id: 3,
    title: 'All of Me',
    artist: 'John Legend',
    src: '../assets/music/song4.mp3',
    cover: '../assets/images/gf4.jpg',
    duration: '4:29',
  },
];

/* ---- State ---- */
let currentIdx = -1;
let currentSound = null;
let isPlaying = false;
let progressInterval = null;

/* ---- DOM refs ---- */
const npTitle = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const npCover = document.getElementById('npCover');
const npVinyl = document.getElementById('npVinyl');
const btnPlay = document.getElementById('btnPlay');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const playlist = document.getElementById('playlist');

/* ---- Build visualizer background bars ---- */
(function buildVizBg() {
  const container = document.getElementById('vizBg');
  for (let i = 0; i < 60; i++) {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    bar.style.setProperty('--dur', (0.4 + Math.random() * 0.8) + 's');
    bar.style.setProperty('--delay', (Math.random() * 0.8) + 's');
    bar.style.setProperty('--min', (4 + Math.random() * 10) + 'px');
    bar.style.setProperty('--max', (20 + Math.random() * 100) + 'px');
    container.appendChild(bar);
  }
})();

/* ---- Build playlist ---- */
function buildPlaylist() {
  playlist.innerHTML = '';
  SONGS.forEach((song, i) => {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.dataset.index = i;
    item.innerHTML = `
      <div class="song-thumb">
        <img src="${song.cover}" alt="${song.title}"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22200%22 height=%22200%22 fill=%22%23330d1a%22/><text x=%22100%22 y=%22108%22 font-size=%2248%22 text-anchor=%22middle%22>🎵</text></svg>'" />
      </div>
      <div class="song-info">
        <div class="song-name">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-playing-indicator">
        <div class="indicator-bar"></div>
        <div class="indicator-bar"></div>
        <div class="indicator-bar"></div>
      </div>
      <div class="song-duration">${song.duration}</div>
    `;
    item.addEventListener('click', () => loadSong(i, true));
    playlist.appendChild(item);
  });

  if (typeof gsap !== 'undefined') {
    gsap.from('.song-item', {
      opacity: 0,
      x: -30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }
}

/* ---- Load a song ---- */
function loadSong(idx, autoPlay = false) {
  if (currentSound) {
    currentSound.stop();
    clearInterval(progressInterval);
  }

  currentIdx = idx;
  const song = SONGS[idx];

  npTitle.textContent = song.title;
  npArtist.textContent = song.artist;
  npCover.src = song.cover;
  timeTotal.textContent = song.duration;
  updateProgress(0);

  currentSound = new Howl({
    src: [song.src],
    html5: true,
    onplay: () => {
      isPlaying = true;
      updatePlayUI(true);
      startProgress();
    },
    onpause: () => {
      isPlaying = false;
      updatePlayUI(false);
      clearInterval(progressInterval);
    },
    onstop: () => {
      isPlaying = false;
      updatePlayUI(false);
      clearInterval(progressInterval);
    },
    onend: () => {
      nextSong();
    },
    onloaderror: () => {
      npArtist.textContent = '— file not found, add mp3 to assets/music/ —';
    },
  });

  updateActiveCard(idx);

  if (autoPlay) {
    currentSound.play();
  }
}

/* ---- Play / Pause toggle ---- */
function togglePlay() {
  if (!currentSound) {
    if (SONGS.length > 0) loadSong(0, true);
    return;
  }

  if (isPlaying) {
    currentSound.pause();
  } else {
    currentSound.play();
  }
}

/* ---- Next / Prev ---- */
function nextSong() {
  const next = (currentIdx + 1) % SONGS.length;
  loadSong(next, isPlaying);
}

function prevSong() {
  if (currentSound && currentSound.seek() > 3) {
    currentSound.seek(0);
    updateProgress(0);
    return;
  }
  const prev = (currentIdx - 1 + SONGS.length) % SONGS.length;
  loadSong(prev, isPlaying);
}

/* ---- Update play button & vinyl UI ---- */
function updatePlayUI(playing) {
  btnPlay.textContent = playing ? '⏸' : '▶';
  btnPlay.classList.toggle('playing', playing);
  npVinyl.classList.toggle('playing', playing);

  const activeItem = playlist.querySelector('.song-item.active');
  if (activeItem) {
    activeItem.classList.toggle('playing', playing);
  }
}

/* ---- Highlight active song in playlist ---- */
function updateActiveCard(idx) {
  playlist.querySelectorAll('.song-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.classList.remove('playing');
  });
}

/* ---- Progress tracking ---- */
function startProgress() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!currentSound || !isPlaying) return;
    const seek = currentSound.seek() || 0;
    const duration = currentSound.duration() || 1;
    const pct = (seek / duration) * 100;
    updateProgress(pct, seek);
  }, 500);
}

function updateProgress(pct, seconds) {
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  if (seconds !== undefined) {
    timeCurrent.textContent = formatTime(seconds);
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ---- Progress bar click to seek ---- */
document.getElementById('progressBar').addEventListener('click', (e) => {
  if (!currentSound) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  const seek = pct * currentSound.duration();
  currentSound.seek(seek);
  updateProgress(pct * 100, seek);
});

/* ---- GSAP entrance ---- */
window.addEventListener('DOMContentLoaded', () => {
  buildPlaylist();

  if (typeof gsap !== 'undefined') {
    gsap.from('#musicHeader', { opacity: 0, y: -30, duration: 0.8, ease: 'power2.out' });
    gsap.from('#nowPlaying', { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: 'back.out(1.4)' });
  }
});
