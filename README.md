# Supratik Das — Portfolio

Personal portfolio website for **[bytefront.dev](https://bytefront.dev)** — built as a single-page static site with no framework or build step required.

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | HTML5 (semantic — `<main>`, `<nav>`, `<section>`, `<footer>`) |
| Styling | [Tailwind CSS](https://tailwindcss.com) via CDN + custom CSS |
| Fonts | Manrope · Inter · Space Grotesk (Google Fonts) |
| Deployment | [Vercel](https://vercel.com) (static, zero-config) |

## Project Structure

```
my-portfolio/
├── index.html              # Single-page portfolio (all sections)
├── Supratik_Das_CV_2026.pdf # CV — linked as a download on the page
├── vercel.json             # Vercel static deployment config
├── robots.txt              # Crawler directives + sitemap pointer
└── sitemap.xml             # XML sitemap for Google indexing
```

## Sections

1. **Hero** — Name, role, CTAs (View Work · Say Hello · Download CV)
2. **About** — Profile summary, info cards (role, education, location, contact, certification)
3. **Tech Stack** — Frontend, backend, DevOps skill breakdown with animated mastery bars
4. **Experience** — Timeline: Valuelabs (Shutterfly), HCLTech, LegalKart
5. **Projects** — Photo Product Builder (Shutterfly), JS Execution Visualizer
6. **Productivity Stack** — Daily tooling grid
7. **Contact** — CV download + email, LinkedIn, GitHub links

## Running Locally

No build step needed — open directly in a browser:

```bash
open index.html
```

Or serve with any static file server:

```bash
npx serve .
# → http://localhost:3000
```

## Deployment

The repo is configured for zero-config Vercel deployment via [`vercel.json`](vercel.json):

```json
{ "buildCommand": null, "outputDirectory": ".", "framework": null }
```

**Deploy steps:**
1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add custom domain `bytefront.dev` under Project → Settings → Domains
4. Point your domain's DNS to Vercel's nameservers

## SEO

- Canonical URL, meta description, keywords, and author tags
- Open Graph tags for LinkedIn / Slack / social previews
- Twitter Card metadata
- JSON-LD structured data — `Person`, `WebSite`, and `WebPage` schemas
- `robots.txt` allowing all crawlers
- `sitemap.xml` submitted to Google Search Console at `https://bytefront.dev/sitemap.xml`

## CV Download

[`Supratik_Das_CV_2026.pdf`](Supratik_Das_CV_2026.pdf) is bundled in the repo and linked via the `download` attribute on both the hero CTA and the contact section button.

---

© 2026 Supratik Das
