import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Howl } from 'howler';
import gsap from 'gsap';
import '../styles/music.css';
import { getSongs, getPhotos } from '../lib/prefetch';

function pickUniqueCovers(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MusicPage() {
  const [songs, setSongs] = useState([]);
  const [covers, setCovers] = useState([]);
  const [ready, setReady] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const howlRef = useRef(null);
  const progressInterval = useRef(null);
  const headerRef = useRef(null);
  const playerRef = useRef(null);

  // Load songs & covers from DB
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [dbSongs, dbPhotos] = await Promise.all([
        getSongs().catch(() => []),
        getPhotos().catch(() => []),
      ]);

      if (cancelled) return;

      const songList  = dbSongs ?? [];
      const coverPool = (dbPhotos ?? []).filter(p => p.type === 'solo').map(p => p.src);

      const selectedCovers = coverPool.length > 0
        ? pickUniqueCovers(coverPool, songList.length)
        : [];

      setSongs(songList.map((s, i) => ({ ...s, cover: selectedCovers[i] ?? null })));
      setCovers(selectedCovers);
      setReady(true);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.8 });
    gsap.from(playerRef.current, { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: 'back.out(1.4)' });
    return () => { howlRef.current?.unload(); clearInterval(progressInterval.current); };
  }, []);

  const stopProgress = useCallback(() => {
    clearInterval(progressInterval.current);
    progressInterval.current = null;
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    progressInterval.current = setInterval(() => {
      if (!howlRef.current) return;
      const seek = howlRef.current.seek() || 0;
      const dur = howlRef.current.duration() || 1;
      setCurrentTime(seek);
      setDuration(dur);
      setProgress((seek / dur) * 100);
    }, 500);
  }, [stopProgress]);

  const loadSong = useCallback((idx, autoPlay = false) => {
    if (howlRef.current) { howlRef.current.stop(); howlRef.current.unload(); }
    stopProgress();
    setCurrentIdx(idx);
    setProgress(0); setCurrentTime(0); setDuration(0);

    const song = songs[idx];
    if (!song) return;
    howlRef.current = new Howl({
      src: [song.src],
      html5: true,
      onplay: () => { setIsPlaying(true); startProgress(); },
      onpause: () => { setIsPlaying(false); stopProgress(); },
      onstop: () => { setIsPlaying(false); stopProgress(); setProgress(0); },
      onend: () => { setCurrentIdx(i => { const next = (i + 1) % songs.length; loadSong(next, true); return i; }); },
      onloaderror: () => console.warn('Could not load:', song.src),
    });
    if (autoPlay) howlRef.current.play();
  }, [startProgress, stopProgress, songs]);

  const togglePlay = useCallback(() => {
    if (!howlRef.current) { if (songs.length) loadSong(0, true); return; }
    isPlaying ? howlRef.current.pause() : howlRef.current.play();
  }, [isPlaying, loadSong, songs.length]);

  const prevSong = useCallback(() => {
    if (currentIdx < 0) return;
    if (howlRef.current?.seek() > 2) { howlRef.current.seek(0); return; }
    loadSong((currentIdx - 1 + songs.length) % songs.length, isPlaying);
  }, [currentIdx, isPlaying, loadSong, songs.length]);

  const nextSong = useCallback(() => {
    loadSong(((currentIdx < 0 ? 0 : currentIdx) + 1) % songs.length, isPlaying);
  }, [currentIdx, isPlaying, loadSong, songs.length]);

  const handleProgressClick = useCallback((e) => {
    if (!howlRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const dur = howlRef.current.duration() || 0;
    howlRef.current.seek(pct * dur);
    setProgress(pct * 100);
    setCurrentTime(pct * dur);
  }, []);

  const currentSong = currentIdx >= 0 ? songs[currentIdx] : null;
  const defaultCover = covers[0] ?? null;

  return (
    <div className="music-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="viz-bg">{Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="viz-bar" style={{ '--dur': `${0.4 + Math.random() * 0.8}s`, '--delay': `${Math.random() * 0.8}s`, '--min': `${4 + Math.random() * 8}px`, '--max': `${20 + Math.random() * 90}px` }} />
      ))}</div>

      <Link to="/home" className="back-btn">← Back</Link>

      <header ref={headerRef} style={{ textAlign: 'center', marginBottom: '2rem', zIndex: 2, position: 'relative' }}>
        <h1 className="page-title">Our Songs</h1>
        <p className="page-subtitle">Songs that remind me of you</p>
      </header>

      {/* Now Playing */}
      <div className="now-playing glass-card" ref={playerRef}>
        <div className={`np-vinyl ${isPlaying ? 'playing' : ''}`}>
          <div className="vinyl-outer">
            <div className="vinyl-inner">
              <img src={currentSong?.cover || defaultCover} alt="cover" />
            </div>
          </div>
          {isPlaying && <>
            <div className="vinyl-ring ring-1" />
            <div className="vinyl-ring ring-2" />
            <div className="vinyl-ring ring-3" />
          </>}
        </div>
        <div className="np-info">
          <h2 className="np-title">{currentSong?.title ?? 'Select a song'}</h2>
          <p className="np-artist">{currentSong?.artist ?? '— tap a song below to play —'}</p>
          <div className="progress-wrap">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-thumb" style={{ left: `${progress}%` }} />
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>
          <div className="np-controls">
            <button className="ctrl-btn" onClick={prevSong}>⏮</button>
            <button className={`ctrl-btn ctrl-play ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="ctrl-btn" onClick={nextSong}>⏭</button>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="playlist">
        {songs.map((song, i) => (
          <div key={song.id}
            className={`song-item ${currentIdx === i ? 'active' : ''} ${currentIdx === i && isPlaying ? 'playing' : ''}`}
            onClick={() => loadSong(i, true)}
          >
            <div className="song-thumb"><img src={song.cover} alt={song.title} /></div>
            <div className="song-info">
              <div className="song-name">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <div className="song-play-ind">
              {currentIdx === i && isPlaying
                ? <><div className="ind-bar" /><div className="ind-bar" /><div className="ind-bar" /></>
                : <span style={{ color: 'rgba(249,168,201,0.35)', fontSize: '1rem' }}>▶</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
