import React, { useState } from 'react';
import ChromaGrid from './components/ChromaGrid/ChromaGrid';

const projects = [];

const projectTemplate = {
  title: 'AI Model Router',
  problem:
    'Routing every prompt to a single LLM is inefficient, costly, and often overkill for simple tasks.',
  stack: [
    'Python',
    'FastAPI',
    'OpenAI API',
    'Rule-based heuristics',
    'React + Vite',
    'JavaScript',
  ],
  context:
    'Built to explore systems-level decision making in AI applications, where cost, latency, and capability must be balanced dynamically rather than hard-coded to one model.',
  constraints: [
    'No fine-tuned classifier model (had to rely on lightweight heuristics)',
    'Low-latency routing required before inference',
    'Must remain extensible to new models without refactoring core logic',
  ],
  decisions: [
    'Used a pre-routing evaluation step to score prompts on complexity instead of embedding-based similarity',
    'Abstracted model providers behind a common interface to avoid vendor lock-in',
  ],
  outcome:
    'Successfully routed prompts to different models based on complexity, reducing average cost per request while preserving response quality.',
};

const techStack = [
  { category: 'Languages', items: ['Python', 'Java', 'C', 'JavaScript'] },
  {
    category: 'Frameworks',
    items: ['React', 'Next.js', 'Astro', 'FastAPI', 'Node.js'],
  },
  { category: 'UI + Motion', items: ['Tailwind', 'Radix UI'] },
  { category: 'Tooling', items: ['Vite', 'Storybook', 'Playwright'] },
];

const highlights = [
  {
    label: 'Now',
    text: 'Designing systems that reduce operational entropy and make engineering work feel calm.',
  },
  {
    label: 'Focus',
    text: 'Frontend architecture, interaction design, and tooling that enforces consistency.',
  },
  {
    label: 'Tooling',
    text: 'React, Vite, Next.js, Astro, Tailwind, Framer Motion, Playwright.',
  },
];

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%25' height='100%25' fill='%2310161f'/><circle cx='140' cy='140' r='90' fill='%237ad0ff' opacity='0.25'/><text x='50%25' y='50%25' fill='%23ffffff' font-size='30' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>Add preview</text></svg>";

const chromaItems = [
  {
    image: placeholderImage,
    title: 'Case Study Slot',
    subtitle: 'Replace with a real project card',
    handle: 'Template',
    borderColor: '#7ad0ff',
    gradient: 'linear-gradient(145deg, #7ad0ff, #10161f)',
    url: '#projects',
  },
  {
    image: placeholderImage,
    title: 'Experiment',
    subtitle: 'Prototype or side project highlight',
    handle: 'Template',
    borderColor: '#9b7dff',
    gradient: 'linear-gradient(145deg, #9b7dff, #10161f)',
    url: '#projects',
  },
  {
    image: placeholderImage,
    title: 'Product Launch',
    subtitle: 'Narrate an end-to-end build',
    handle: 'Template',
    borderColor: '#7dd6ff',
    gradient: 'linear-gradient(145deg, #7dd6ff, #0f141d)',
    url: '#projects',
  },
  {
    image: placeholderImage,
    title: 'System Upgrade',
    subtitle: 'Show infra or architecture improvements',
    handle: 'Template',
    borderColor: '#86e1b6',
    gradient: 'linear-gradient(145deg, #86e1b6, #0f141d)',
    url: '#projects',
  },
];

const ghostButton =
  'rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#7ad0ff]/60 hover:bg-[#7ad0ff]/10 hover:text-[#7ad0ff]';

const primaryButton =
  'inline-flex items-center gap-2 rounded-full border border-[#7ad0ff]/50 bg-[#7ad0ff]/20 px-5 py-2.5 text-sm font-semibold text-[#7ad0ff] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(122,208,255,0.18)]';

function Badge({ label }) {
  return (
    <span className="rounded-full border border-[#7ad0ff]/30 bg-[#7ad0ff]/10 px-3 py-1 text-xs font-medium text-[#7ad0ff]">
      {label}
    </span>
  );
}

function ProjectCard({ project, onOpen, disabled = false, label = 'Case Study' }) {
  return (
    <button
      type="button"
      className={`grid gap-4 rounded-2xl border border-white/10 bg-[#161b23]/90 p-6 text-left shadow-[0_20px_45px_rgba(0,0,0,0.4)] transition ${
        disabled
          ? 'cursor-default opacity-70'
          : 'hover:-translate-y-1 hover:border-[#7ad0ff]/60'
      }`}
      onClick={() => onOpen(project)}
      disabled={disabled}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-['Space_Grotesk',_sans-serif] text-xl text-white">
          {project.title}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.12em] text-white/50">
          {label}
        </span>
      </div>
      <p className="text-sm text-white">{project.problem}</p>
      <div className="flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <Badge key={item} label={item} />
        ))}
      </div>
      <div className="text-xs text-white/50">View details</div>
    </button>
  );
}

function ProjectDrawer({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 backdrop-blur">
      <div className="max-h-[85vh] w-[min(860px,90vw)] overflow-auto rounded-[24px] border border-[#7ad0ff]/20 bg-[#0a0c10]/95 p-7 text-white shadow-[0_40px_90px_rgba(0,0,0,0.55)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Project Detail
            </p>
            <h2 className="font-['Space_Grotesk',_sans-serif] text-3xl">
              {project.title}
            </h2>
          </div>
          <button type="button" className={ghostButton} onClick={onClose}>
            Close
          </button>
        </div>
        <div className="grid gap-6 text-sm text-white/70">
          <section className="grid gap-2">
            <h4 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
              Context
            </h4>
            <p>{project.context}</p>
          </section>
          <section className="grid gap-2">
            <h4 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
              Constraints
            </h4>
            <ul className="grid gap-1 pl-5 text-white/70">
              {project.constraints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="grid gap-2">
            <h4 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
              Key Decisions
            </h4>
            <ul className="grid gap-1 pl-5 text-white/70">
              {project.decisions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="grid gap-2">
            <h4 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
              Outcome
            </h4>
            <p>{project.outcome}</p>
          </section>
          <section className="grid gap-3">
            <h4 className="font-['Space_Grotesk',_sans-serif] text-lg text-white">
              Architecture Snapshot
            </h4>
            <div className="grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-sm text-white">
                Client UI
              </div>
              <div className="h-px bg-[#7ad0ff]/30" />
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-sm text-white">
                Static Index
              </div>
              <div className="h-px bg-[#7ad0ff]/30" />
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-sm text-white">
                Audit Modules
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CommandPalette({ open, onClose, onSelect }) {
  const commands = [
    { label: 'Jump to Projects', target: '#projects' },
    { label: 'Jump to Tech Stack', target: '#stack' },
    { label: 'Jump to About', target: '#about' },
    { label: 'Open Resume', target: '#resume' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 backdrop-blur">
      <div className="grid w-[min(480px,90vw)] gap-4 rounded-[22px] border border-[#7ad0ff]/20 bg-[#0a0c10]/95 p-5 shadow-[0_40px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between text-white/60">
          <p>Command Palette</p>
          <button type="button" className={ghostButton} onClick={onClose}>
            Esc
          </button>
        </div>
        <div className="grid gap-2">
          {commands.map((cmd) => (
            <button
              key={cmd.target}
              type="button"
              className="rounded-xl border border-transparent bg-[#7ad0ff]/10 px-4 py-3 text-left text-sm text-white transition hover:border-[#7ad0ff]/60"
              onClick={() => onSelect(cmd.target)}
            >
              {cmd.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/50">Press Cmd+K / Ctrl+K to open</p>
      </div>
    </div>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const paletteHandler = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setPaletteOpen((prev) => !prev);
    }
    if (event.key === 'Escape') {
      setPaletteOpen(false);
      setSelectedProject(null);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', paletteHandler);
    return () => window.removeEventListener('keydown', paletteHandler);
  }, []);

  const openPaletteTarget = (target) => {
    setPaletteOpen(false);
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d10] text-[#f2f4f7]">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(122,208,255,0.08),transparent_45%),radial-gradient(circle_at_30%_80%,rgba(122,208,255,0.04),transparent_55%),linear-gradient(120deg,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:42px_42px] opacity-60" />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={openPaletteTarget}
      />
      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-16 pt-6 font-['Spline_Sans',_sans-serif]">
        <header className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0b0d10]/75 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#7ad0ff]/30 bg-[#7ad0ff]/10 text-lg font-bold text-[#7ad0ff]">
              N
            </span>
            <span>Nand</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <a className="transition hover:text-white" href="#projects">
              Projects
            </a>
            <a className="transition hover:text-white" href="#stack">
              Tech Stack
            </a>
            <a className="transition hover:text-white" href="#about">
              About
            </a>
          </nav>
          <button type="button" className={ghostButton} onClick={() => setPaletteOpen(true)}>
            Command
          </button>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="grid gap-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">
              Portfolio
            </p>
            <h1 className="font-['Space_Grotesk',_sans-serif] text-[clamp(2.4rem,5vw,3.6rem)] leading-tight text-white">
              I design and build interface systems with a focus on clarity,
              rhythm, and reliable UX.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/70">
              A curated collection of product work, experiments, and systems that
              scale from first sketch to production UI.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a className={primaryButton} href="#projects">
                View Projects
              </a>
              <button
                type="button"
                className={ghostButton}
                onClick={() => setPaletteOpen(true)}
              >
                Open Command Palette
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Based in
                </p>
                <p className="text-sm text-white/80">Chicago / Remote</p>
              </div>
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Focus
                </p>
                <p className="text-sm text-white/80">Product UI Systems</p>
              </div>
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Currently
                </p>
                <p className="text-sm text-white/80">Exploring systems & motion</p>
              </div>
            </div>
          </div>

          <div className="h-[440px] w-full rounded-[20px] border border-[#7ad0ff]/20 bg-white/5 p-5 shadow-[0_40px_90px_rgba(0,0,0,0.45)] backdrop-blur">
            <ChromaGrid items={chromaItems} columns={2} className="h-full" />
          </div>
        </section>

        <section className="grid gap-6" id="projects">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Selected Work
              </p>
              <h2 className="font-['Space_Grotesk',_sans-serif] text-[clamp(1.8rem,3vw,2.5rem)] text-white">
                Projects with system-level thinking.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Add your own case studies below. The template card shows the layout
              and fields to fill in.
            </p>
          </div>
          {projects.length === 0 ? (
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
              <ProjectCard project={projectTemplate} onOpen={() => {}} disabled label="Template" />
              <div className="grid gap-3 rounded-2xl border border-[#7ad0ff]/30 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Add your work
                </p>
                <p className="text-sm text-white/70">
                  Edit the <span className="rounded-lg bg-[#7ad0ff]/15 px-2 py-0.5 text-white">projects</span> array
                  in <span className="rounded-lg bg-[#7ad0ff]/15 px-2 py-0.5 text-white">src/App.jsx</span> to add your
                  real projects.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id ?? project.title}
                  project={project}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 rounded-[20px] border border-[#7ad0ff]/20 bg-white/5 p-10 shadow-[0_40px_90px_rgba(0,0,0,0.45)] backdrop-blur" id="stack">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Toolbox
              </p>
              <h2 className="font-['Space_Grotesk',_sans-serif] text-[clamp(1.8rem,3vw,2.5rem)] text-white">
                Tech stack and frameworks.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              A quick snapshot of the tools, frameworks, and platforms I reach for
              when building production UI.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {techStack.map((group) => (
              <div
                className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
                key={group.category}
              >
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} label={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-[20px] border border-[#7ad0ff]/20 bg-white/5 p-10 shadow-[0_40px_90px_rgba(0,0,0,0.45)] backdrop-blur" id="about">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                About
              </p>
              <h2 className="font-['Space_Grotesk',_sans-serif] text-[clamp(1.8rem,3vw,2.5rem)] text-white">
                Quietly obsessive about detail.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              I build product UIs that scale across teams. My work pairs visual
              restraint with clear interaction logic so complexity feels calm.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            <div className="grid gap-4 text-sm text-white/70">
              <p>
                I am a frontend engineer focused on systems, interaction design,
                and component architecture. I have led UI foundations for
                cross-functional teams, shipping experiences that prioritize
                clarity under pressure.
              </p>
              <p>
                My approach is deliberate: I map constraints first, then translate
                them into a visual language that is consistent and resilient.
              </p>
              <p>
                Outside of work I explore generative typography, hardware
                controls, and new ways to make software feel humane.
              </p>
            </div>
            <div className="grid gap-4">
              {highlights.map((item) => (
                <div
                  className="grid gap-2 rounded-2xl border border-white/10 bg-[#0d1014]/80 p-4"
                  key={item.label}
                >
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                    {item.label}
                  </p>
                  <p className="text-sm text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6" id="resume">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Resume
              </p>
              <h2 className="font-['Space_Grotesk',_sans-serif] text-[clamp(1.8rem,3vw,2.5rem)] text-white">
                Resume snapshot.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              A concise overview of experience, scope, and technical depth.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-[#0d1014]/80 p-6">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-white/50">
                PDF
              </p>
              <p className="text-sm text-white/70">Updated January 2026</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className={primaryButton} href="/resume.pdf" download>
                Download Resume
              </a>
            </div>
          </div>
        </section>

        <footer className="grid gap-2 pb-8 text-center text-xs text-white/50">
          <p>Designed for clarity. Built with restraint.</p>
          <p>(c) 2026 Nand Thaker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
