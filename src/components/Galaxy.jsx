import { useEffect, useRef } from 'react';

// ─── galaxy geometry constants ────────────────────────────────────────────
const ARM_COUNT      = 4;
const ARM_STARS      = 420;   // per arm
const CORE_STARS     = 200;
const FIELD_STARS    = 320;

function buildGalaxy(W, H) {
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) * 0.42;
  const stars = [];

  // ── Spiral arm stars ──────────────────────────────────────────────────
  for (let arm = 0; arm < ARM_COUNT; arm++) {
    for (let i = 0; i < ARM_STARS; i++) {
      const t = Math.pow(Math.random(), 0.6);
      const r = (0.08 + t * 0.92) * maxR;
      const baseAngle    = (arm / ARM_COUNT) * Math.PI * 2;
      const spiralAngle  = t * Math.PI * 3.8;
      const scatter      = (Math.random() - 0.5) * (0.18 + t * 0.7);
      const theta        = baseAngle + spiralAngle + scatter;

      stars.push({
        ox:   cx + r * Math.cos(theta),
        oy:   cy + r * Math.sin(theta),
        sz:   Math.max(0.4, (1 - t * 0.55) * (1.1 + Math.random() * 1.5)),
        a:    (0.28 + Math.random() * 0.68) * (1 - t * 0.42),
        tw:   Math.random() * Math.PI * 2,
        type: 'arm',
      });
    }
  }

  // ── Dense core cluster ────────────────────────────────────────────────
  for (let i = 0; i < CORE_STARS; i++) {
    const r     = Math.pow(Math.random(), 2.2) * maxR * 0.18;
    const theta = Math.random() * Math.PI * 2;
    stars.push({
      ox:   cx + r * Math.cos(theta),
      oy:   cy + r * Math.sin(theta),
      sz:   0.5 + Math.random() * 2.2,
      a:    0.42 + Math.random() * 0.55,
      tw:   Math.random() * Math.PI * 2,
      type: 'core',
    });
  }

  // ── Background field stars (no rotation) ─────────────────────────────
  for (let i = 0; i < FIELD_STARS; i++) {
    stars.push({
      ox:   Math.random() * W,
      oy:   Math.random() * H,
      sz:   0.3 + Math.random() * 0.9,
      a:    0.04 + Math.random() * 0.18,
      tw:   Math.random() * Math.PI * 2,
      type: 'field',
    });
  }

  return stars;
}

// ─── component ────────────────────────────────────────────────────────────

/**
 * Galaxy background canvas.
 *
 * bgVal (0-255): 0 = black bg, 255 = white bg.
 * Pass a ref (bgValRef) so the animation loop reads the latest value without
 * restarting when bgVal changes every animation frame.
 */
export default function Galaxy({ bgVal = 0, className = '' }) {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const timeRef   = useRef(0);
  // Sync prop → internal ref so the loop never needs to restart
  const bgRef     = useRef(bgVal);
  useEffect(() => { bgRef.current = bgVal; }, [bgVal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = buildGalaxy(W, H);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const tick = () => {
      timeRef.current += 0.006;
      const t   = timeRef.current;
      const bgV = bgRef.current;
      const isDark = bgV < 128;

      // ── Background fill ─────────────────────────────────────────────
      ctx.fillStyle = `rgb(${bgV},${bgV},${bgV})`;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const dim = Math.min(W, H);

      // ── Nebula haze (only in dark mode) ─────────────────────────────
      if (isDark) {
        const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, dim * 0.46);
        neb.addColorStop(0,   'rgba(110, 70, 210, 0.11)');
        neb.addColorStop(0.45,'rgba(50,  35, 130, 0.06)');
        neb.addColorStop(1,   'rgba(0,   0,   0,  0)');
        ctx.fillStyle = neb;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Bright galactic core ─────────────────────────────────────────
      const coreR  = dim * 0.055;
      const coreGd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      if (isDark) {
        coreGd.addColorStop(0,   'rgba(255, 245, 210, 0.62)');
        coreGd.addColorStop(0.38,'rgba(200, 170, 255, 0.22)');
        coreGd.addColorStop(1,   'rgba(0,   0,   0,  0)');
      } else {
        coreGd.addColorStop(0,   'rgba(20, 10, 70,  0.38)');
        coreGd.addColorStop(0.5, 'rgba(10, 5,  40,  0.12)');
        coreGd.addColorStop(1,   'rgba(0,  0,   0,  0)');
      }
      ctx.fillStyle = coreGd;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // ── Rotating galaxy disc (arms + core) ───────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.024);
      ctx.translate(-cx, -cy);

      const sv = isDark ? 255 : 18;

      for (const s of starsRef.current) {
        if (s.type === 'field') continue;
        const twinkle = s.type === 'core'
          ? 1
          : 1 + 0.11 * Math.sin(t * 1.7 + s.tw);
        const alpha = Math.min(s.a * twinkle * (isDark ? 1 : 0.58), 1);
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = `rgb(${sv},${sv},${sv})`;
        ctx.beginPath();
        ctx.arc(s.ox, s.oy, s.sz, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // ── Static background field stars ────────────────────────────────
      const fv = isDark ? 255 : 22;
      for (const s of starsRef.current) {
        if (s.type !== 'field') continue;
        const twinkle = 1 + 0.22 * Math.sin(t * 0.75 + s.tw);
        ctx.globalAlpha = Math.min(s.a * twinkle * (isDark ? 1 : 0.45), 1);
        ctx.fillStyle   = `rgb(${fv},${fv},${fv})`;
        ctx.beginPath();
        ctx.arc(s.ox, s.oy, s.sz, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []); // intentionally empty — loop reads refs directly

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
