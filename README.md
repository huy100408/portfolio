# Brian Nguyen — Portfolio

Personal portfolio for **Brian Nguyen**, Developer & Software Engineer.
A single-page site with a minimal design and a full motion system. It is exported as static files, so it can be hosted on GitHub Pages or Vercel.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, `output: "export"`), React 19, TypeScript
- Tailwind CSS 4
- Framer Motion for component animations; GSAP + ScrollTrigger for scroll-linked animations
- next-themes for the light/dark theme
- lucide-react and simple-icons for icons
- Geist Sans and Geist Mono fonts, self-hosted at build time by `next/font`

There is no backend, database or WebGL.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server. Shows dev-only notes where content still needs filling in. |
| `npm run build` | Refreshes the GitHub snapshot, then builds the static site into `out/`. |
| `npm run preview` | Serves `out/` locally. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript with no output. |
| `npm run snapshot` | Refreshes `src/data/github-snapshot.json` only. |

## Editing content

All content lives in `src/config/`. You don't need to touch any components to change it.

| File | Contents |
| --- | --- |
| `site.ts` | Name, title, intro, email, Discord, GitHub, LinkedIn (`null` hides it), navigation |
| `projects.ts` | The five projects. Entries marked `needsInfo: true` are placeholders; see the TODO comments |
| `skills.ts` | Skill categories and icons |
| `journey.ts` | Timeline milestones |
| `education.ts` | Education. The section is hidden while the list is empty |
| `achievements.ts` | Certifications and awards. The section is hidden while the list is empty |

Project screenshots go in `src/assets/projects/` and are imported in `projects.ts`. Static imports keep image paths correct under any base path.

## GitHub integration

The GitHub section calls the public GitHub REST API from the visitor's browser, without a token:

- It fetches only when the section is about to scroll into view.
- Responses are cached in `sessionStorage` for 30 minutes.
- Without a token, the API allows 60 requests per hour per IP. When that limit is reached, the section shows the reset time and falls back to the snapshot.
- The snapshot (`src/data/github-snapshot.json`) is written by `scripts/snapshot-github.mjs` before every build. If that request fails, the previous snapshot is kept.
- The build can use an optional `GITHUB_TOKEN` for a higher rate limit. It is used only by the build script and never sent to the browser.

The activity grid covers the last 90 days of **public events**, which is all the events API returns. It is not the GitHub contribution graph.

## Environment variables

All are optional. See `.env.example`.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served from, e.g. `/portfolio` for `https://huy100408.github.io/portfolio/`. Leave empty for a root domain or Vercel. |
| `NEXT_PUBLIC_SITE_URL` | Full public URL, used for Open Graph metadata. |
| `GITHUB_TOKEN` | Build time only: higher API limit for the snapshot script. |

## Deployment

### GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`. You can also run it by hand from the Actions tab.

1. Push this project to a GitHub repository.
2. In the repository, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow from the **Actions** tab.

The workflow reads the base path from `actions/configure-pages`:

- A repository named `portfolio` is served from `/portfolio`.
- A repository named `huy100408.github.io` is served from the root.

You don't need to configure either case by hand.

To test a sub-path build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
mkdir -p /tmp/site && rm -rf /tmp/site/portfolio && cp -R out /tmp/site/portfolio
npx serve /tmp/site   # open http://localhost:3000/portfolio/
```

### Vercel

Import the repository in Vercel. It detects Next.js and serves the static export. Leave `NEXT_PUBLIC_BASE_PATH` unset.

## Motion and accessibility

- With `prefers-reduced-motion` enabled:
  - Framer Motion animations, GSAP scroll effects, CSS loops and the intro loader are turned off.
  - Content still appears.
- On touch devices and small screens:
  - Magnetic buttons, 3D tilt and pointer parallax are off.
  - The pinned horizontal project scroll becomes a grid.
- The particle canvas pauses when off screen.
- All GSAP contexts are reverted on unmount.
- The intro loader shows once per browser session. Click it or press any key to skip.
- Without JavaScript, the full content is still visible.

## Project structure

```
src/
  app/            layout, page, global styles, icon, Open Graph image
  assets/         project screenshots
  components/
    layout/       Navbar, Footer
    motion/       Reveal, SplitText, Magnetic, TiltCard, particles, shapes…
    providers/    theme, motion config, intro state
    sections/     Hero, About, Skills, Projects, GitHub, Journey, Education, Achievements, Contact
    ui/           buttons, cards, modal, loader…
  config/         all editable content
  data/           GitHub snapshot (generated)
  hooks/          small React hooks
  lib/            GitHub client, GSAP setup, motion tokens, helpers
scripts/          build-time GitHub snapshot
```
