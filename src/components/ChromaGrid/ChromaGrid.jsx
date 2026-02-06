import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const cn = (...args) => args.filter(Boolean).join(' ');

const DEFAULT_ITEMS = [
  {
    image: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%25' height='100%25' fill='%2310161f'/><circle cx='140' cy='140' r='90' fill='%237ad0ff' opacity='0.25'/><text x='50%25' y='50%25' fill='%23ffffff' font-size='30' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>Add a project</text></svg>`,
    title: 'Project Slot',
    subtitle: 'Replace with your work',
    handle: 'Template',
    borderColor: '#7ad0ff',
    gradient: 'linear-gradient(145deg, #7ad0ff, #10161f)',
    url: '#projects',
  },
];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const ChromaGrid = ({
  items,
  className,
  radius = 280,
  columns = 3,
  damping = 0.45,
  fadeOut = 0.65,
  ease = 'power3.out',
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const isMobile = useIsMobile();
  const rafRef = useRef(null);

  const resolvedItems = useMemo(() => {
    const list = items && items.length ? items : DEFAULT_ITEMS;
    return list;
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    cardsRef.current = Array.from(container.querySelectorAll('.chroma-card'));

    const handleMove = (event) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        cardsRef.current.forEach((card) => {
          if (!card) return;

          const cardRect = card.getBoundingClientRect();
          const cardX = cardRect.left - rect.left + cardRect.width / 2;
          const cardY = cardRect.top - rect.top + cardRect.height / 2;

          const distanceX = mouseX - cardX;
          const distanceY = mouseY - cardY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          const cardEl = card;
          if (distance < radius) {
            const proximity = 1 - distance / radius;
            gsap.to(cardEl, {
              '--glow-opacity': proximity,
              '--glow-intensity': proximity * 0.9,
              '--glow-radius': `${radius}px`,
              '--glow-x': `${distanceX}px`,
              '--glow-y': `${distanceY}px`,
              duration: damping,
              ease,
            });
          } else {
            gsap.to(cardEl, {
              '--glow-opacity': 0,
              '--glow-intensity': 0,
              duration: fadeOut,
              ease,
            });
          }
        });
      });
    };

    const handleMouseLeave = () => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          '--glow-opacity': 0,
          '--glow-intensity': 0,
          duration: fadeOut,
          ease,
        });
      });
    };

    if (!isMobile) {
      container.addEventListener('mousemove', handleMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (!container) return;
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [radius, damping, ease, fadeOut, isMobile]);

  const getGridColumn = (colSpan) => `span ${Math.min(colSpan, columns)}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-full w-full',
        !isMobile && 'transition-all duration-300',
        className
      )}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1.25rem',
      }}
    >
      {resolvedItems.map((c, index) => (
        <div
          key={c.title + index}
          className="chroma-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          style={{
            gridColumn: getGridColumn(c.colSpan || 1),
            '--glow-opacity': '0',
            '--glow-intensity': '0',
            '--glow-radius': '0px',
            '--glow-x': '0px',
            '--glow-y': '0px',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: c.gradient,
              opacity: 'var(--glow-opacity)',
              maskImage: `radial-gradient(${radius}px circle at var(--glow-x) var(--glow-y), black 0%, transparent 65%)`,
              WebkitMaskImage: `radial-gradient(${radius}px circle at var(--glow-x) var(--glow-y), black 0%, transparent 65%)`,
            }}
          />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                {c.handle}
              </p>
              <h3 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
                {c.title}
              </h3>
              <p className="text-sm text-white/70">{c.subtitle}</p>
            </div>
            <a
              href={c.url || '#projects'}
              target={(c.url || '#projects').startsWith('#') ? '_self' : '_blank'}
              rel={(c.url || '#projects').startsWith('#') ? undefined : 'noreferrer'}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7ad0ff] transition hover:text-white"
            >
              View
            </a>
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              border: `1px solid ${c.borderColor || 'rgba(255, 255, 255, 0.12)'}`,
              opacity: 0.7,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ChromaGrid;
