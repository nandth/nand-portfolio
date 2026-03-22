import { startTransition, useMemo, useRef, useState } from 'react';

const beatModules = import.meta.glob('/beats/*.mp3', {
  eager: true,
  import: 'default',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatTrackMeta(path) {
  const filename = path.split('/').pop()?.replace(/\.mp3$/i, '') ?? 'untitled';
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})_(.+)$/);

  if (!match) {
    return {
      id: filename,
      title: filename.replace(/[-_]/g, ' '),
      subtitle: 'Beat',
    };
  }

  const [, year, month, day, beatId] = match;
  const parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);

  return {
    id: filename,
    title: `Beat ${beatId.toUpperCase()}`,
    subtitle: monthFormatter.format(parsedDate),
  };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function MiniBeatPlayer() {
  const tracks = useMemo(
    () =>
      Object.entries(beatModules)
        .map(([path, src]) => ({
          ...formatTrackMeta(path),
          src,
        }))
        .sort((a, b) => b.id.localeCompare(a.id)),
    []
  );

  const audioRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!tracks.length) {
    return null;
  }

  const activeTrack = tracks[trackIndex];

  const syncPlaybackState = (nextPlaying) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (nextPlaying) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const jumpToTrack = (nextIndex, options = {}) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const safeIndex = (nextIndex + tracks.length) % tracks.length;
    const shouldResume = options.resumePlayback ?? !audio.paused;

    setTrackIndex(safeIndex);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(shouldResume);

    audio.src = tracks[safeIndex].src;
    audio.load();

    if (shouldResume) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        src={activeTrack.src}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
        }}
        onTimeUpdate={(event) => {
          const nextTime = event.currentTarget.currentTime;
          startTransition(() => {
            setCurrentTime(nextTime);
          });
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          jumpToTrack(trackIndex + 1, { resumePlayback: true });
        }}
      />

      <aside className="beat-player intro-reveal stagger-4">
        <div className="beat-player__label">
          <span className="beat-player__dot" aria-hidden="true" />
          Beats
        </div>

        <div className="beat-player__meta">
          <div>
            <p className="beat-player__title">{activeTrack.title}</p>
            <p className="beat-player__subtitle">{activeTrack.subtitle}</p>
          </div>
          <span className="beat-player__count">
            {trackIndex + 1}/{tracks.length}
          </span>
        </div>

        <div className="beat-player__transport">
          <button
            type="button"
            className="beat-player__button"
            aria-label="Previous beat"
            onClick={() => jumpToTrack(trackIndex - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5v14" />
              <path d="M18 7l-8 5 8 5V7z" />
            </svg>
          </button>

          <button
            type="button"
            className="beat-player__button beat-player__button--primary"
            aria-label={isPlaying ? 'Pause beat' : 'Play beat'}
            onClick={() => syncPlaybackState(!isPlaying)}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6h2v12H9z" />
                <path d="M13 6h2v12h-2z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 6l10 6-10 6V6z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="beat-player__button"
            aria-label="Next beat"
            onClick={() => jumpToTrack(trackIndex + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 5v14" />
              <path d="M6 7l8 5-8 5V7z" />
            </svg>
          </button>
        </div>

        <div className="beat-player__timeline">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            className="beat-player__slider"
            aria-label="Seek beat"
            onChange={(event) => {
              const nextTime = Number(event.target.value);
              const audio = audioRef.current;
              if (!audio) {
                return;
              }
              audio.currentTime = nextTime;
              setCurrentTime(nextTime);
            }}
          />
          <div className="beat-player__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MiniBeatPlayer;
