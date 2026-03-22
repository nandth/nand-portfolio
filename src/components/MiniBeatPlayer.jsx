import { startTransition, useEffect, useMemo, useRef, useState } from 'react';

const beatModules = import.meta.glob('/beats/*.mp3', {
  eager: true,
  import: 'default',
});

const PLAYER_MARGIN    = 16;
const VISUAL_BAR_COUNT = 14;

// Spring physics
const STIFFNESS = 0.10;  // pull strength (higher = snappier)
const DAMPING   = 0.72;  // velocity retention per frame
const BOUNCE    = 0.38;  // wall restitution (0 = dead stop, 1 = perfect bounce)

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function getTrackMeta(path, src) {
  const title = path.split('/').pop() ?? 'untitled.mp3';
  return { id: title, title, src };
}

function MiniBeatPlayer() {
  const tracks = useMemo(
    () =>
      Object.entries(beatModules)
        .map(([path, src]) => getTrackMeta(path, src))
        .sort((a, b) => b.id.localeCompare(a.id)),
    []
  );

  const bars = useMemo(() => Array.from({ length: VISUAL_BAR_COUNT }), []);

  // DOM
  const audioRef   = useRef(null);
  const panelRef   = useRef(null);
  const barRefs    = useRef([]);

  // physics — all in refs, never state
  const posRef        = useRef({ x: 0, y: 0 }); // current rendered position
  const velRef        = useRef({ x: 0, y: 0 }); // velocity
  const targetRef     = useRef({ x: 0, y: 0 }); // spring target (follows mouse)
  const physicsRafRef = useRef(0);

  // drag session
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startMouseX: 0,
    startMouseY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  // audio graph
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const freqDataRef = useRef(null);
  const vizRafRef   = useRef(0);

  // react state (only things that affect rendered output)
  const [trackIndex,   setTrackIndex]  = useState(0);
  const [isPlaying,    setIsPlaying]   = useState(false);
  const [currentTime,  setCurrentTime] = useState(0);
  const [duration,     setDuration]    = useState(0);
  const [volume,       setVolume]      = useState(0.7);
  const [windowMode,   setWindowMode]  = useState('default');
  const [isClosed,     setIsClosed]    = useState(true);

  if (!tracks.length) return null;
  const activeTrack = tracks[trackIndex];

  // ── helpers ─────────────────────────────────────────────────────────────────

  const setInitialPos = (x, y) => {
    posRef.current    = { x, y };
    targetRef.current = { x, y };
    velRef.current    = { x: 0, y: 0 };
    if (panelRef.current) {
      panelRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    }
  };

  const clampedPos = (x, y) => {
    const panel = panelRef.current;
    if (!panel) return { x, y };
    return {
      x: Math.min(Math.max(x, PLAYER_MARGIN), window.innerWidth  - panel.offsetWidth  - PLAYER_MARGIN),
      y: Math.min(Math.max(y, PLAYER_MARGIN), window.innerHeight - panel.offsetHeight - PLAYER_MARGIN),
    };
  };

  // ── drag – pointer events (attached to topbar in JSX) ─────────────────────

  const onPointerDown = (e) => {
    if (e.target.closest('button, input')) return;
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: posRef.current.x,
      startPosY: posRef.current.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    if ((e.buttons & 1) !== 1) return;
    const { startMouseX, startMouseY, startPosX, startPosY } = dragRef.current;
    // Update spring target; physics loop handles the smoothed follow
    targetRef.current = {
      x: startPosX + (e.clientX - startMouseX),
      y: startPosY + (e.clientY - startMouseY),
    };
  };

  const stopDragging = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    // Clamp target so spring settles inside viewport
    const { x, y } = clampedPos(targetRef.current.x, targetRef.current.y);
    targetRef.current = { x, y };
  };

  const onPointerUp = (e) => {
    if (dragRef.current.pointerId !== null && dragRef.current.pointerId !== e.pointerId) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    stopDragging();
  };

  useEffect(() => {
    const handleWindowPointerUp = () => {
      stopDragging();
    };

    const handleWindowPointerCancel = () => {
      stopDragging();
    };

    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerCancel);

    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerCancel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── physics loop (runs always) ───────────────────────────────────────────────

  useEffect(() => {
    const tick = () => {
      const panel = panelRef.current;
      if (panel) {
        const pos    = posRef.current;
        const vel    = velRef.current;
        const target = targetRef.current;

        vel.x = (vel.x + (target.x - pos.x) * STIFFNESS) * DAMPING;
        vel.y = (vel.y + (target.y - pos.y) * STIFFNESS) * DAMPING;

        let nx = pos.x + vel.x;
        let ny = pos.y + vel.y;

        // Bounce off walls
        const minX = PLAYER_MARGIN;
        const minY = PLAYER_MARGIN;
        const maxX = window.innerWidth  - panel.offsetWidth  - PLAYER_MARGIN;
        const maxY = window.innerHeight - panel.offsetHeight - PLAYER_MARGIN;

        if (nx < minX) { nx = minX; vel.x =  Math.abs(vel.x) * BOUNCE; }
        if (nx > maxX) { nx = maxX; vel.x = -Math.abs(vel.x) * BOUNCE; }
        if (ny < minY) { ny = minY; vel.y =  Math.abs(vel.y) * BOUNCE; }
        if (ny > maxY) { ny = maxY; vel.y = -Math.abs(vel.y) * BOUNCE; }

        posRef.current = { x: nx, y: ny };
        panel.style.transform = `translate3d(${nx}px,${ny}px,0)`;
      }
      physicsRafRef.current = requestAnimationFrame(tick);
    };
    physicsRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(physicsRafRef.current);
  }, []);

  // ── mount: place bottom-left, keep in bounds on resize ──────────────────────

  useEffect(() => {
    if (isClosed) return;
    const panel = panelRef.current;
    if (!panel) return;

    const place = () => {
      const x = PLAYER_MARGIN;
      const y = window.innerHeight - panel.offsetHeight - PLAYER_MARGIN;
      setInitialPos(x, y);
    };

    const id = requestAnimationFrame(place);

    const onResize = () => {
      const { x, y } = clampedPos(posRef.current.x, posRef.current.y);
      targetRef.current = { x, y };
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed]);

  // re-clamp target when panel resizes (mode change)
  useEffect(() => {
    if (isClosed) return;
    const panel = panelRef.current;
    if (!panel) return;
    const ro = new ResizeObserver(() => {
      const { x, y } = clampedPos(posRef.current.x, posRef.current.y);
      targetRef.current = { x, y };
    });
    ro.observe(panel);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed, windowMode]);

  // ── visualizer loop ──────────────────────────────────────────────────────────

  useEffect(() => {
    const tick = () => {
      const analyser = analyserRef.current;
      const freq     = freqDataRef.current;
      if (analyser && freq) {
        analyser.getByteFrequencyData(freq);
        barRefs.current.forEach((bar, i) => {
          if (!bar) return;
          const v = freq[Math.min(i * 2, freq.length - 1)] / 255;
          bar.style.transform = `scaleY(${isPlaying ? 0.22 + v * 1.2 : 0.18})`;
          bar.style.opacity   = `${isPlaying ? 0.34 + v * 0.66 : 0.28}`;
        });
      } else {
        barRefs.current.forEach((bar) => {
          if (!bar) return;
          bar.style.transform = 'scaleY(0.18)';
          bar.style.opacity   = '0.28';
        });
      }
      vizRafRef.current = requestAnimationFrame(tick);
    };
    vizRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(vizRafRef.current);
  }, [isPlaying]);

  // pause on close
  useEffect(() => {
    if (!isClosed) return;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [isClosed]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // ── audio helpers ──────────────────────────────────────────────────────────

  const setupVisualizer = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const Ctx = window.AudioContext || window['webkitAudioContext'];
    if (!Ctx) return;
    if (!audioCtxRef.current) {
      const ctx      = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.82;
      ctx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current  = analyser;
      freqDataRef.current  = new Uint8Array(analyser.frequencyBinCount);
    }
    if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
  };

  const syncPlayback = async (play) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (play) {
      try { await setupVisualizer(); await audio.play(); setIsPlaying(true); }
      catch { setIsPlaying(false); }
    } else {
      audio.pause(); setIsPlaying(false);
    }
  };

  const jumpToTrack = async (next, opts = {}) => {
    const audio = audioRef.current;
    if (!audio) return;
    const idx = (next + tracks.length) % tracks.length;
    const resume = opts.resumePlayback ?? !audio.paused;
    setTrackIndex(idx); setCurrentTime(0); setDuration(0);
    audio.src = tracks[idx].src;
    audio.load();
    if (!resume) { setIsPlaying(false); return; }
    try { await setupVisualizer(); await audio.play(); setIsPlaying(true); }
    catch { setIsPlaying(false); }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        src={activeTrack.src}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {
          startTransition(() => setCurrentTime(e.currentTarget.currentTime));
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => jumpToTrack(trackIndex + 1, { resumePlayback: true })}
      />

      {isClosed ? (
        <button
          type="button"
          className="beat-player__reopen"
          onClick={() => { setIsClosed(false); setWindowMode('default'); }}
        >
          🎶
        </button>
      ) : (
        <aside
          ref={panelRef}
          className={`beat-player beat-player--${windowMode}`}
        >
          <div
            className="beat-player__topbar"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="beat-player__traffic">
              <button
                type="button"
                className="beat-player__traffic-button beat-player__traffic-button--close"
                aria-label="Close beat player"
                onClick={() => setIsClosed(true)}
              />
              <button
                type="button"
                className="beat-player__traffic-button beat-player__traffic-button--minimize"
                aria-label={windowMode === 'minimized' ? 'Restore beat player' : 'Minimize beat player'}
                onClick={() => setWindowMode((m) => (m === 'minimized' ? 'default' : 'minimized'))}
              />
              <button
                type="button"
                className="beat-player__traffic-button beat-player__traffic-button--expand"
                aria-label={windowMode === 'expanded' ? 'Restore beat player size' : 'Expand beat player'}
                onClick={() => setWindowMode((m) => (m === 'expanded' ? 'default' : 'expanded'))}
              />
            </div>
            <div className="beat-player__window-label">Beat player</div>
          </div>

          <div className="beat-player__meta">
            <div className="min-w-0">
              <p className="beat-player__label">Now playing</p>
              <p className="beat-player__title">{activeTrack.title}</p>
            </div>
            <span className="beat-player__count">{trackIndex + 1}/{tracks.length}</span>
          </div>

          <div className="beat-player__visualizer" aria-hidden="true">
            {bars.map((_, i) => (
              <span
                key={`bar-${i}`}
                ref={(el) => { barRefs.current[i] = el; }}
                className="beat-player__visualizer-bar"
              />
            ))}
          </div>

          <div className="beat-player__transport">
            <button type="button" className="beat-player__button" aria-label="Previous beat"
              onClick={() => jumpToTrack(trackIndex - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 5v14" /><path d="M18 7l-8 5 8 5V7z" />
              </svg>
            </button>

            <button type="button" className="beat-player__button beat-player__button--primary"
              aria-label={isPlaying ? 'Pause beat' : 'Play beat'}
              onClick={() => syncPlayback(!isPlaying)}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6h2v12H9z" /><path d="M13 6h2v12h-2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 6l10 6-10 6V6z" />
                </svg>
              )}
            </button>

            <button type="button" className="beat-player__button" aria-label="Next beat"
              onClick={() => jumpToTrack(trackIndex + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 5v14" /><path d="M6 7l8 5-8 5V7z" />
              </svg>
            </button>
          </div>

          {windowMode !== 'minimized' && (
            <>
              <div className="beat-player__timeline">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  className="beat-player__slider"
                  aria-label="Seek beat"
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = t;
                    setCurrentTime(t);
                  }}
                />
                <div className="beat-player__time">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="beat-player__volume">
                <span className="beat-player__volume-label">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  className="beat-player__slider beat-player__slider--volume"
                  aria-label="Volume"
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                  }}
                />
                <span className="beat-player__volume-value">{Math.round(volume * 100)}</span>
              </div>

              {windowMode === 'expanded' && (
                <div className="beat-player__playlist">
                  {tracks.map((track, i) => (
                    <button
                      key={track.id}
                      type="button"
                      className={`beat-player__playlist-item${
                        i === trackIndex ? ' beat-player__playlist-item--active' : ''
                      }`}
                      onClick={() => jumpToTrack(i)}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </aside>
      )}
    </>
  );
}

export default MiniBeatPlayer;
