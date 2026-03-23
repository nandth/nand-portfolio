import { useCallback, useEffect, useRef, useState } from 'react';
import SplitText from './components/SplitText';
import BlurReveal from './components/BlurReveal';
import MiniBeatPlayer from './components/MiniBeatPlayer';
import TechMatrix from './components/TechMatrix';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import modelRouterImg from './assets/model-router.png';
import AnalyticsModal from './components/AnalyticsModal';

// ─── data ──────────────────────────────────────────────────────────────────

const projects = [
  {
    id: '01',
    title: 'Cost-Aware LLM Router',
    problem:
      'Routes requests across model tiers using prompt complexity scoring, confidence checks, and fail-closed parsing.',
    stack: ['Python', 'FastAPI', 'Pydantic', 'React', 'Vite', 'TailwindCSS'],
    github: 'https://github.com/nandth/model-router-ai',
    demo: 'https://model-router-ai-five.vercel.app/',
    image: modelRouterImg,
    featured: true,
  },
  {
    id: '02',
    title: 'Broccolli URL Shortener',
    problem:
      'Full-stack short-link service with deterministic IDs, analytics, and a restrained WebGL front end.',
    stack: ['React', 'Vite', 'TailwindCSS', 'Express', 'PostgreSQL', 'OGL'],
    github: 'https://github.com/notaarryan/broccolli-url-shortener',
    demo: null,
  },
  {
    id: '03',
    title: 'Math Game',
    problem:
      'Java quiz engine with multiple game modes built on a shared interface and event-driven desktop UI.',
    stack: ['Java', 'Swing', 'OOP'],
    github: 'https://github.com/nandth/kids-game-java',
    demo: null,
  },
  {
    id: '04',
    title: 'Macro Recorder',
    problem:
      'Desktop automation tool that records keyboard and mouse actions and replays them from readable JSON.',
    stack: ['Python', 'customtkinter', 'pynput', 'JSON'],
    github: 'https://github.com/nandth/macro-recorder',
    demo: null,
  },
];

const links = {
  github: 'https://github.com/nandth',
  linkedin: 'https://www.linkedin.com/in/nand-thaker-b919482aa/',
  email: 'thaker31@uwindsor.ca',
};


// ─── hooks ─────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

function useScrolled(px = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > px);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, [px]);
  return scrolled;
}

// ─── theme utils ───────────────────────────────────────────────────────────

/** Returns inline CSS vars + color for a given bgVal (0=black, 255=white). */
function themeVars(bgVal) {
  const tv = Math.round(255 - bgVal); // text value
  const bg = `rgb(${bgVal},${bgVal},${bgVal})`;
  const fg = `rgb(${tv},${tv},${tv})`;
  return {
    '--background': bg,
    '--foreground': fg,
    '--primary': fg,
    '--card': bg,
    '--card-foreground': fg,
    '--popover': bg,
    '--popover-foreground': fg,
    '--muted-foreground': `rgba(${tv},${tv},${tv},0.68)`,
    '--color-background': bg,
    '--color-foreground': fg,
    '--color-primary': fg,
    color: fg,
  };
}

// ─── global UI ─────────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const { scrollTop: st, scrollHeight: sh, clientHeight: ch } = document.documentElement;
      setPct(sh > ch ? st / (sh - ch) : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-px origin-left pointer-events-none"
      style={{
        width: '100%',
        transform: `scaleX(${pct})`,
        background: 'linear-gradient(90deg, rgba(128,128,128,0.1), rgba(128,128,128,0.5))',
        transition: 'transform 60ms linear',
      }}
    />
  );
}

function ScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 pointer-events-none"
    >
      <span className="text-[0.58rem] uppercase tracking-[0.32em] text-primary/20">Scroll</span>
      <div className="scroll-caret" />
    </div>
  );
}

// Sun icon (shown in dark mode → click to go light)
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2"   x2="12" y2="5"   />
      <line x1="12" y1="19"  x2="12" y2="22"  />
      <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34"   />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12"  x2="5"   y2="12"  />
      <line x1="19" y1="12"  x2="22"  y2="12"  />
      <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

// Moon icon (shown in light mode → click to go dark)
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ThemeButton({ onClick, isLight }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="theme-btn"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function ResumeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-xl border"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50">Resume</span>
          <div className="flex items-center gap-4">
            <a
              href="/NandThaker.pdf"
              download
              className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50 transition hover:text-white"
            >
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume"
              className="text-white/40 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <iframe
          src="/NandThaker.pdf"
          title="Nand Thaker Resume"
          className="h-full w-full flex-1"
          style={{ border: 'none', minHeight: 0 }}
        />
      </div>
    </div>
  );
}

// ─── reusable UI ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>;
}

function StackBadge({ tech }) {
  return (
    <Badge
      variant="outline"
      className="stack-badge h-auto rounded-full px-2.5 py-1 text-[0.65rem] font-normal uppercase tracking-[0.14em] transition-colors"
    >
      {tech}
    </Badge>
  );
}

function NavLink({ href, children, tooltip, external = false }) {
  const linkProps = external ? { target: '_blank', rel: 'noreferrer' } : {};
  if (!tooltip) {
    return (
      <a href={href} {...linkProps} className="transition hover:text-primary">
        {children}
      </a>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={href} {...linkProps} className="transition hover:text-primary">
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent
        className="border border-white/10 bg-[#1a1a1d] text-[0.72rem] tracking-wide text-white/80"
        sideOffset={8}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}


// ─── ProjectCard ───────────────────────────────────────────────────────────

function ProjectLinks({ project, onAnalytics }) {
  return (
    <div className="mt-auto flex flex-wrap gap-5 pt-8 text-sm text-primary/65">
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 transition hover:text-primary"
      >
        GitHub <span aria-hidden="true">/</span>
      </a>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition hover:text-primary"
        >
          Live demo <span aria-hidden="true">/</span>
        </a>
      )}
      {onAnalytics && (
        <button
          type="button"
          onClick={onAnalytics}
          className="inline-flex items-center gap-2 transition hover:text-primary"
        >
          Analytics <span aria-hidden="true">/</span>
        </button>
      )}
    </div>
  );
}

function ProjectCard({ project, className = '', delay = 0, onAnalytics }) {
  const [ref, on] = useReveal(0.07);
  const isFeatured = project.featured;

  return (
    <article
      ref={ref}
      className={`project-card reveal-up ${on ? 'revealed' : ''} ${
        isFeatured ? 'project-card-featured' : ''
      } ${className}`.trim()}
      style={{ transitionDelay: on ? `${delay}ms` : '0ms' }}
    >
      {isFeatured && project.image ? (
        <div className="flex h-full flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-primary/32">{project.id}</p>
              <span className="soft-pill shrink-0">Featured</span>
            </div>
            <div className="mt-8 grid gap-4">
              <h3 className="project-title max-w-[16ch] text-balance font-medium text-primary">
                {project.title}
              </h3>
              <p className="max-w-[34ch] text-sm leading-7 text-primary/70">{project.problem}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => <StackBadge key={tech} tech={tech} />)}
            </div>
            <ProjectLinks project={project} onAnalytics={onAnalytics} />
          </div>
          <div className="hidden shrink-0 overflow-hidden rounded-xl border border-white/8 md:flex md:w-[46%]">
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-primary/32">{project.id}</p>
            <span className="soft-pill shrink-0">Selected</span>
          </div>
          <div className="mt-8 grid gap-4">
            <h3 className="project-title max-w-[16ch] text-balance font-medium text-primary">
              {project.title}
            </h3>
            <p className="max-w-[34ch] text-sm leading-7 text-primary/70">{project.problem}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => <StackBadge key={tech} tech={tech} />)}
          </div>
          <ProjectLinks project={project} onAnalytics={onAnalytics} />
        </>
      )}
    </article>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

const BG_SPEED = 255 / 20; // faster black/white toggle

function App() {
  const scrolled = useScrolled(50);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // bgVal: 0 = black, 255 = white
  const [bgVal, setBgVal] = useState(0);
  const bgRef     = useRef(0);
  const targetRef = useRef(0);
  const animRef   = useRef(null);

  const toggleTheme = useCallback(() => {
    targetRef.current = bgRef.current < 128 ? 255 : 0;
    cancelAnimationFrame(animRef.current);

    const step = () => {
      const diff = targetRef.current - bgRef.current;
      if (Math.abs(diff) <= BG_SPEED) {
        bgRef.current = targetRef.current;
        setBgVal(targetRef.current);
        return;
      }
      bgRef.current += diff > 0 ? BG_SPEED : -BG_SPEED;
      setBgVal(Math.round(bgRef.current));
      animRef.current = requestAnimationFrame(step);
    };
    step();
  }, []);

  const isLight  = bgVal >= 128;
  const textVal  = Math.round(255 - bgVal);

  // Hero bottom-fade gradient matches the current bg color
  // Sticky header bg
  const headerBg = scrolled
    ? `rgba(${bgVal},${bgVal},${bgVal},0.72)`
    : 'transparent';
  const headerBorder = scrolled
    ? `rgba(${textVal},${textVal},${textVal},0.08)`
    : 'transparent';

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="site-shell"
        style={{
          ...themeVars(bgVal),
          backgroundColor: `rgb(${bgVal},${bgVal},${bgVal})`,
        }}
      >
        <ScrollProgress />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
        <AnalyticsModal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

        {/* ── Galaxy background (full-screen, fixed) ─────────────────── */}

        {/* ── Frosted blur overlay for readability ───────────────────── */}

        <MiniBeatPlayer />

        {/* ── Sticky nav ─────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-40 w-full"
          style={{
            background: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
            backdropFilter: scrolled ? 'blur(22px) saturate(1.1)' : 'none',
            transition: 'background 180ms ease, border-color 180ms ease',
          }}
        >
          <div className="intro-reveal stagger-1 mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-10">
            <a
              href="#top"
              className="logo-glow font-['Abril_Fatface',_serif] text-[1.6rem] not-italic tracking-[0.01em] text-primary"
            >
              nandth.xyz
            </a>
            <nav
              aria-label="Primary"
              className="flex flex-wrap items-center gap-5 text-[0.78rem] uppercase tracking-[0.22em] text-primary/50"
            >
              <button
                type="button"
                onClick={() => setResumeOpen(true)}
                className="transition hover:text-primary"
              >
                Resume
              </button>
              <a href="#projects" className="transition hover:text-primary">Projects</a>
              <NavLink href={links.github} tooltip="github.com/nandth" external>GitHub</NavLink>
              <NavLink href={links.linkedin} tooltip="linkedin.com/in/nand-thaker" external>LinkedIn</NavLink>
              <ThemeButton onClick={toggleTheme} isLight={isLight} />
            </nav>
          </div>
        </header>

        {/* ── Hero section ───────────────────────────────────────────── */}
        <section
          id="top"
          className="hero-section relative flex min-h-screen w-full flex-col justify-center overflow-hidden"
        >
          {/* Bottom gradient blends hero into the content below */}
          <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] items-start gap-10 px-6 py-20 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-14">
            <div className="flex flex-col gap-8">
              <BlurReveal triggerOnMount delay={80}>
                <SectionLabel>Software Engineer</SectionLabel>
              </BlurReveal>

              <div className="grid gap-5">
                <SplitText
                  as="h1"
                  triggerOnMount
                  initialDelay={260}
                  charDelay={40}
                  className="max-w-[11ch] text-balance text-5xl font-medium leading-[0.94] tracking-[-0.05em] text-primary md:text-7xl"
                >
                  Nand Thaker
                </SplitText>

                <BlurReveal triggerOnMount delay={820}>
                  <p className="max-w-[30rem] text-balance text-lg leading-8 text-primary/82 md:text-[1.35rem] md:leading-9">
                    CS @ UWindsor
                  </p>
                </BlurReveal>
              </div>

              <BlurReveal triggerOnMount delay={1080}>
                <p className="max-w-[38rem] text-base leading-8 text-primary/62">
                  I'm a second year student in Computer Science. Most of my time outside class goes into making beats, building things, or playing video games. I'm a dual citizen (Canada/US) and don't need sponsorship. Open to internships and co-ops in backend or full-stack roles.
                </p>
              </BlurReveal>

              <BlurReveal triggerOnMount delay={1280}>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a href="#projects" className="action-chip action-chip-primary">
                    View projects
                  </a>
                  <a href={`mailto:${links.email}`} className="action-chip">
                    thaker31@uwindsor.ca
                  </a>
                </div>
              </BlurReveal>
            </div>

            <BlurReveal triggerOnMount delay={640}>
              <TechMatrix />
            </BlurReveal>
          </div>

          <ScrollIndicator />
        </section>

        {/* ── Scrollable content ─────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-[1120px] px-6 pb-10 md:px-10 md:pb-16">
          <main className="flex flex-col gap-[4.5rem] pt-16 md:gap-24 md:pt-20">
            <div className="hairline" />

            {/* Projects */}
            <section id="projects" className="grid gap-8 md:gap-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <BlurReveal>
                  <div className="grid gap-3">
                    <SectionLabel>Selected Projects</SectionLabel>
                    <h2 className="max-w-[14ch] text-balance text-3xl font-medium tracking-[-0.04em] text-primary md:text-5xl">
                      Some of my favourite projects.
                    </h2>
                  </div>
                </BlurReveal>
                <BlurReveal delay={120}>
                  <p className="max-w-[32rem] text-sm leading-7 text-primary/55 md:text-right">
                    
                  </p>
                </BlurReveal>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    className={project.featured ? 'md:col-span-2' : ''}
                    delay={index * 75}
                    onAnalytics={project.featured ? () => setAnalyticsOpen(true) : undefined}
                  />
                ))}
              </div>
            </section>

          </main>

          <footer className="mt-16 flex flex-col gap-5 border-t pt-6 text-sm text-primary/48 md:mt-20 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: `rgba(${textVal},${textVal},${textVal},0.08)` }}
          >
            <p className="max-w-[32rem] leading-7">
              😎
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <NavLink href={links.github} tooltip="github.com/nandth" external>GitHub</NavLink>
              <NavLink href={links.linkedin} tooltip="linkedin.com/in/nand-thaker" external>LinkedIn</NavLink>
              <a href={`mailto:${links.email}`} className="transition hover:text-primary">Email</a>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
