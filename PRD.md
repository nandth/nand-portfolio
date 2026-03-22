# Personal Portfolio — Product Requirements Document (PRD)

## 1. Overview

**Product**: Personal Developer Portfolio  
**Mode**: Dark mode only  
**Design Language**: Minimalist, glassmorphic, monochrome  
**Purpose**: Signal taste, technical restraint, and identity — not to explain everything

This portfolio is not a resume replacement. It is a filter. It should attract technically literate reviewers and quietly repel everyone else.

---

## 2. Goals

- Communicate identity and competence in under 10 seconds
- Avoid clutter, gimmicks, and content bloat
- Emphasize contrast: light vs dark, sharp vs organic, static vs fluid
- Feel intentional, calm, and slightly intimidating

### Non-goals

- SEO optimization
- Blog platform
- CMS or admin panel
- Overly verbose storytelling

---

## 3. Target User

### Primary
- Recruiters with technical literacy
- Senior engineers reviewing portfolios quickly
- Founders or hackers scanning GitHub links

### Secondary
- Peers in CS or tech (low priority)

If someone needs hand-holding, this product is not for them.

---

## 4. Visual Inspiration (Abstracted)

Design principles derived from reference imagery:

- High-contrast monochrome (black, off-white, subtle gray)
- Organic ink-like forms paired with precise geometry
- Repetition and symmetry without noise
- Dominant negative space
- Glass used as a layer, not a gimmick

No literal illustrations are required. These are stylistic cues, not assets.

---

## 5. Design System

### Color Palette
- Background: #0B0B0D (near-black)
- Primary text: #EDEDED
- Secondary text: #9A9A9A
- Accent (optional, single-use): #FFFFFF at low opacity

No additional colors unless strongly justified.

### Typography
- Heading: Modern grotesk or neo-humanist (e.g., Inter, SF Pro, Neue Montreal)
- Body: Same family, different weight
- Maximum two visible font weights per section

### Glassmorphism Rules
- Used sparingly for containers only
- Frosted blur: 8–12px
- Background opacity: 8–12%
- Subtle border: 1px solid white at ~10% opacity
- Never stack glass layers

If everything is glass, nothing is glass.

---

## 6. Layout Structure

### Global Layout
- Single-page layout
- Vertical flow
- Max width: ~1100px
- Generous padding and negative space
- No sidebar

---

### Section 1: Hero

**Purpose**: Identity in one glance

Contents:
- Name
- One-line descriptor (no buzzwords)
- Minimal navigation (Projects, GitHub, Resume)

Constraints:
- No paragraph text
- No heavy animation
- Optional faint abstract background shape

---

### Section 2: Selected Projects

**Purpose**: Demonstrate competence without over-explaining

Format:
- 2–4 projects maximum
- One glass card per project

Each project card includes:
- Title
- One-line problem statement
- Tech stack (inline, muted)
- 1–2 links (GitHub, Demo)

Screenshots are optional and only allowed if they add real value.

---

### Section 3: About (Optional)

**Purpose**: Provide context, not autobiography

Rules:
- 3–4 sentences maximum
- Focus on how you think, not personal history
- No motivational language

This section should feel like a footnote, not a pitch.

---

### Section 4: Footer

Contents:
- GitHub
- LinkedIn
- Email (optional)

No quotes. No slogans. No filler.

---

## 7. Interaction and Motion

- Motion is subtle and rare
- Hover states limited to opacity, slight translation, or blur changes
- No parallax
- No scroll-jacking
- No excessive transitions

The site should feel still, not playful.

---

## 8. Technical Requirements

- Fully responsive (desktop-first)
- Lighthouse performance score >= 90
- Minimal dependencies
- Accessible contrast ratios
- Dark mode only (no toggle)

Suggested (not required):
- Next.js or Astro
- Tailwind or custom CSS
- Deployment via Vercel or Netlify

---

## 9. Content Strategy

Tone:
- Neutral
- Precise
- Confident without bravado

Rules:
- Every word must earn its place
- Remove anything redundant
- Silence and space are part of the design

---

## 10. Success Criteria

- Fast load time
- Viewer understands identity within 10 seconds
- Projects feel intentional, not padded
- Design does not distract from content
- Recruiter clicks GitHub without friction

If someone describes it as "clean" or "sharp" unprompted, it worked.

---

## 11. Explicitly Deferred Features

- Blog
- Writing section
- Case studies
- Light mode
- Analytics dashboards

Ship the core first. Add nothing unless it increases signal.
