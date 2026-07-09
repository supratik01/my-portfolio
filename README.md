# Supratik Das — Portfolio

Personal portfolio website for **[bytefront.dev](https://bytefront.dev)** — a 3D, interactive single-page showcase built with React, Three.js, and Framer Motion.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build | [Vite](https://vitejs.dev) |
| 3D | [Three.js](https://threejs.org) via [React Three Fiber](https://r3f.docs.pmnd.rs) + [drei](https://github.com/pmndrs/drei) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Icons | [Lucide](https://lucide.dev) |
| Fonts | Manrope · Onest · JetBrains Mono (Google Fonts) |
| Deployment | [Vercel](https://vercel.com) |

## Project Structure

```
my-portfolio/
├── index.html                 # Vite entry — preserves SEO head + JSON-LD
├── src/
│   ├── main.tsx               # App bootstrap (+ Vercel Analytics)
│   ├── App.tsx                # Section composition
│   ├── data.ts                # All content (profile, experience, projects, skills)
│   ├── index.css              # Tailwind layers + reduced-motion + theme tokens
│   └── components/
│       ├── Scene.tsx          # React Three Fiber 3D hero centerpiece
│       ├── Nav.tsx            # Sticky nav with animated active pill
│       ├── Hero.tsx           # Hero (lazy-loads the 3D scene)
│       ├── About.tsx          # Portrait (ai_profile.png) + bio + facts
│       ├── TechStack.tsx      # Skill grid
│       ├── Experience.tsx     # Career timeline
│       ├── Projects.tsx       # Tilt-card project showcase
│       ├── Contact.tsx        # CTA + socials
│       ├── Footer.tsx
│       ├── CursorGlow.tsx     # Cursor-trailing glow (fine-pointer only)
│       ├── ScrollProgress.tsx # Top scroll-progress bar
│       └── ui/
│           └── motion-primitives.tsx  # Reveal, stagger, AnimatedHeading, Magnetic, TiltCard
├── public/                    # Static assets (ai_profile.png, CV, og-image, robots, sitemap)
├── vercel.json                # Vite build config
├── tailwind.config.js         # Design tokens (colors, fonts, easing)
└── vite.config.ts             # Build + manual chunking (three / motion split)
```

## Sections

1. **Hero** — Name, role, CTAs, and an interactive 3D distorted icosahedron that reacts to the cursor
2. **About** — Portrait, bio, and a facts grid (role, education, certification, availability)
3. **Tech Stack** — Skill grid with proficiency labels
4. **Experience** — Career timeline: Valuelabs (Shutterfly), HCLTech, LegalKart
5. **Projects** — Photo Product Builder (Shutterfly), JS Execution Visualizer
6. **Contact** — Email, LinkedIn, GitHub, CV download

## Motion & Interaction

- Word-by-word headline reveals and scroll-triggered staggered section reveals (Framer Motion)
- Magnetic CTAs, cursor-trailing glow, and 3D tilt on project cards
- Cursor-parallax + morphing distortion on the Three.js centerpiece
- All motion respects `prefers-reduced-motion`; the 3D scene freezes and reveals fall back to fades

## Running Locally

```bash
npm install
npm run dev      # → http://localhost:5173
```

Production build:

```bash
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build locally
```

## Deployment

Zero-config Vercel deployment via [`vercel.json`](vercel.json):

```json
{ "framework": "vite", "buildCommand": "npm run build", "outputDirectory": "dist" }
```

**Deploy steps:**
1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new) — it auto-detects Vite
3. Custom domain `bytefront.dev` is configured under Project → Settings → Domains

## SEO

The SEO surface is preserved in [`index.html`](index.html) so search ranking carries over from the static build:

- Canonical URL, meta description, keywords, and author tags
- Open Graph + Twitter Card metadata (uses `og-image.jpg`)
- JSON-LD structured data — `Person`, `WebSite`, and `WebPage` schemas
- `robots.txt` + `sitemap.xml` (served from `public/`)

## CV Download

[`Supratik_Das_CV_2026.pdf`](public/Supratik_Das_CV_2026.pdf) ships in `public/` and is linked via the `download` attribute on the hero and contact CTAs.

---

© 2026 Supratik Das
