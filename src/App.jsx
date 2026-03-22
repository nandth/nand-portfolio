import Grainient from './components/Grainient/Grainient';
import MiniBeatPlayer from './components/MiniBeatPlayer';

const projects = [
  {
    id: '01',
    title: 'Cost-Aware LLM Router',
    problem:
      'Routes requests across model tiers using prompt complexity scoring, confidence checks, and fail-closed parsing.',
    stack: ['Python', 'FastAPI', 'Pydantic', 'React', 'Vite', 'TailwindCSS'],
    github: 'https://github.com/nandth/model-router-ai',
    demo: 'https://model-router-ai-five.vercel.app/',
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

const heroMeta = [
  {
    label: 'Based in',
    value: 'Windsor, Ontario',
  },
  {
    label: 'Focus',
    value: 'Full-stack systems, backend reliability, and careful interfaces',
  },
  {
    label: 'Currently',
    value: 'Computer Science, Software Engineering specialization at the University of Windsor',
  },
];

const principles = [
  {
    title: 'Reliable by default',
    description:
      'I like software that holds up under the boring parts: validation, retries, rate limits, and test coverage.',
  },
  {
    title: 'Fast to understand',
    description:
      'Good interfaces and APIs should explain themselves quickly. I optimize for clean structure and low friction.',
  },
  {
    title: 'Built with restraint',
    description:
      'I keep the moving parts that earn their place and cut the ones that only add noise.',
  },
];

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>;
}

function InfoPanel() {
  return (
    <aside className="glass-panel intro-reveal stagger-2 flex flex-col gap-6 p-6 md:p-7">
      <div className="flex items-center justify-between">
        <SectionLabel>Snapshot</SectionLabel>
        <span className="soft-pill">Open to internships</span>
      </div>

      <div className="grid gap-5">
        {heroMeta.map((item) => (
          <div key={item.label} className="grid gap-1.5">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-primary/40">
              {item.label}
            </p>
            <p className="max-w-[34ch] text-sm leading-6 text-primary/78">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="hairline" />

      <p className="max-w-[32ch] text-sm leading-6 text-primary/58">
        Resume available on request. The best starting point is the code.
      </p>
    </aside>
  );
}

function ProjectCard({ project, className = '', delayClass = '' }) {
  return (
    <article
      className={`project-card intro-reveal ${delayClass} ${
        project.featured ? 'project-card-featured' : ''
      } ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-6">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-primary/36">
          {project.id}
        </p>
        <div className="soft-pill shrink-0">{project.featured ? 'Featured' : 'Selected'}</div>
      </div>

      <div className="mt-8 grid gap-4">
        <h3 className="project-title max-w-[16ch] text-balance font-medium text-primary">
          {project.title}
        </h3>
        <p className="max-w-[34ch] text-sm leading-7 text-primary/68">
          {project.problem}
        </p>
      </div>

      <p className="mt-8 max-w-[42ch] text-xs uppercase tracking-[0.18em] text-primary/40">
        {project.stack.join(' / ')}
      </p>

      <div className="mt-auto flex flex-wrap gap-5 pt-10 text-sm text-primary/70">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition hover:text-primary"
        >
          GitHub
          <span aria-hidden="true">/</span>
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-primary"
          >
            Live demo
            <span aria-hidden="true">/</span>
          </a>
        )}
      </div>
    </article>
  );
}

function PrincipleCard({ item, delayClass = '' }) {
  return (
    <article className={`principle-card intro-reveal ${delayClass}`.trim()}>
      <h3 className="text-lg font-medium text-primary">{item.title}</h3>
      <p className="max-w-[32ch] text-sm leading-7 text-primary/64">{item.description}</p>
    </article>
  );
}

function App() {
  return (
    <div className="site-shell text-primary">
      <div className="pointer-events-none fixed inset-0 -z-30">
        <Grainient
          color1="#d8ddd8"
          color2="#1e2124"
          color3="#050506"
          timeSpeed={0.3}
          colorBalance={0}
          warpStrength={1.25}
          warpFrequency={8.2}
          warpSpeed={0.45}
          warpAmplitude={55}
          blendAngle={20}
          blendSoftness={0.05}
          rotationAmount={180}
          noiseScale={1.3}
          grainAmount={0.08}
          grainScale={2.2}
          grainAnimated={false}
          contrast={1.28}
          gamma={1}
          saturation={0.48}
          centerX={0.04}
          centerY={-0.08}
          zoom={0.92}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_22%),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.07),transparent_18%),linear-gradient(180deg,rgba(4,4,5,0.2),rgba(4,4,5,0.84)_46%,rgba(4,4,5,0.96))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_160px)]" />
      <MiniBeatPlayer />

      <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col px-6 pb-10 pt-6 md:px-10 md:pb-14 md:pt-8">
        <header className="intro-reveal stagger-1 flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
          <a
            href="#top"
            className="font-['Instrument_Serif',_serif] text-[1.6rem] italic tracking-[0.02em] text-primary"
          >
            Nand
          </a>

          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-5 text-[0.78rem] uppercase tracking-[0.22em] text-primary/54"
          >
            <a href="#projects" className="transition hover:text-primary">
              Projects
            </a>
            <a href="#about" className="transition hover:text-primary">
              About
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="transition hover:text-primary">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-primary">
              LinkedIn
            </a>
          </nav>
        </header>

        <main id="top" className="flex flex-1 flex-col gap-[4.5rem] pt-12 md:gap-24 md:pt-[4.5rem]">
          <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-14">
            <div className="intro-reveal stagger-2 flex flex-col gap-8">
              <SectionLabel>Software Engineer Portfolio</SectionLabel>

              <div className="grid gap-6">
                <h1 className="max-w-[11ch] text-balance text-5xl font-medium leading-[0.94] tracking-[-0.05em] text-primary md:text-7xl">
                  Nand Thaker
                </h1>
                <p className="max-w-[30rem] text-balance text-lg leading-8 text-primary/74 md:text-[1.35rem] md:leading-9">
                  I build full-stack systems that feel quiet, fast, and dependable.
                </p>
              </div>

              <p className="max-w-[38rem] text-base leading-8 text-primary/58">
                Computer Science student at the University of Windsor, focused on backend-heavy products,
                thoughtful frontends, and the details that make software hold together.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#projects" className="action-chip action-chip-primary">
                  View projects
                </a>
                <a href={`mailto:${links.email}`} className="action-chip">
                  thaker31@uwindsor.ca
                </a>
              </div>
            </div>

            <InfoPanel />
          </section>

          <div className="hairline intro-reveal stagger-3" />

          <section id="projects" className="grid gap-8 md:gap-10">
            <div className="intro-reveal stagger-1 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid gap-3">
                <SectionLabel>Selected Projects</SectionLabel>
                <h2 className="max-w-[14ch] text-balance text-3xl font-medium tracking-[-0.04em] text-primary md:text-5xl">
                  Work that carries its own weight.
                </h2>
              </div>

              <p className="max-w-[32rem] text-sm leading-7 text-primary/56 md:text-right">
                Production-minded full-stack work, small enough to scan quickly and dense enough to prove how I think.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  className={project.featured ? 'md:col-span-2' : ''}
                  delayClass={`stagger-${Math.min(index + 1, 4)}`}
                />
              ))}
            </div>
          </section>

          <div className="hairline" />

          <section id="about" className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
            <div className="intro-reveal stagger-1 grid gap-5">
              <SectionLabel>About</SectionLabel>
              <h2 className="max-w-[12ch] text-balance text-3xl font-medium tracking-[-0.04em] text-primary md:text-5xl">
                Calm surface, serious internals.
              </h2>
              <p className="max-w-[38rem] text-base leading-8 text-primary/62">
                I care about software that reads clearly and fails predictably. Most of my work starts with the
                system shape: data flow, constraints, and the edge cases that usually get ignored. Once the
                structure is solid, I like making the interface feel as considered as the backend.
              </p>
            </div>

            <div className="grid gap-4">
              {principles.map((item, index) => (
                <PrincipleCard key={item.title} item={item} delayClass={`stagger-${index + 2}`} />
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-16 flex flex-col gap-5 border-t border-white/8 pt-6 text-sm text-primary/50 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[32rem] leading-7">
            Open to software engineering internships and projects where reliability matters as much as speed.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a href={links.github} target="_blank" rel="noreferrer" className="transition hover:text-primary">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-primary">
              LinkedIn
            </a>
            <a href={`mailto:${links.email}`} className="transition hover:text-primary">
              Email
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
