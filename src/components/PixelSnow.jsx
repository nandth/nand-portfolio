import { useEffect, useRef } from 'react';

const COUNT = 140;

function makeFlake(w, h, scatter = false) {
  return {
    x: Math.random() * w,
    y: scatter ? Math.random() * h : -(Math.random() * h * 0.5),
    sz: 1.5 + Math.random() * 2.8,
    vy: 0.28 + Math.random() * 0.82,
    vx: (Math.random() - 0.5) * 0.22,
    a: 0.06 + Math.random() * 0.3,
  };
}

export default function PixelSnow({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let flakes = [];
    let raf;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!flakes.length) {
        flakes = Array.from({ length: COUNT }, () => makeFlake(W, H, true));
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        ctx.globalAlpha = f.a;
        ctx.fillStyle = '#fff';
        ctx.fillRect(Math.round(f.x), Math.round(f.y), Math.ceil(f.sz), Math.ceil(f.sz));
        f.y += f.vy;
        f.x += f.vx;
        if (f.y > H + f.sz) {
          const n = makeFlake(W, H, false);
          n.x = Math.random() * W;
          Object.assign(f, n);
        }
        if (f.x < -f.sz) f.x = W + f.sz;
        else if (f.x > W + f.sz) f.x = -f.sz;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
