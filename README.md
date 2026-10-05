# The Minimalist

**Design studio · v0.6.0 · Landing experience + site structure**

A warm editorial portfolio with a continuous spatial work loop, mixed image and
video studies, an accessible gallery, and studio navigation. The landing
experience is complete; the other pages exist with temporary content.

The six projects are **independent concept studies with licensed stock media**,
not commissioned client work. Replace them with approved portfolio content
before a public studio launch.

## Experience

Spatial spiral and gallery with morphing transitions, a WebGL lotus intro and
menu, page transitions, scroll reveals, and quiet interface sound with a
generative ambient bed (toggle “Sound” in the header). Built for Chrome/Edge 90+,
Firefox 90+, and Safari/iOS 15+, with fallbacks for older features.

## Site map

| Section  | Pages                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Home     | `/` — the collection in motion (spiral ↔ gallery)                              |
| Works    | `/works`                                                                       |
| Studio   | `/about`, `/founders`, `/testimonials`                                         |
| Products | `/products`, `/products/software`, `/products/templates`, `/products/hardware` |
| Contact  | `/contact`, `/inquiries`, `/inquiries/quote`, `/inquiries/appointment`         |

Every page is reachable from the header (desktop), the menu, and the footer
sitemap. Sub-pages add breadcrumbs and section tabs. Pages other than Home and
Works hold clearly marked placeholder content; inquiry forms are not live yet.

## Run locally

Requires Node.js 22.12+ and npm. Node 22 is specified in `.nvmrc`.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173`). No API keys are
required. For production, set `VITE_SITE_URL` to the site origin so link previews
use absolute URLs (see [deployment](docs/deployment.md)). Assets are local.

## Stack and architecture

React 19, TypeScript 6, Vite 8, React Router, native CSS transforms and
`requestAnimationFrame`. Vitest, Testing Library, and Playwright cover data,
lifecycles, UI, and browser interactions. Fonts are self-hosted.

```text
UI → hooks → services → repositories → local content
```

The repository returns unknown data; the service validates and selects work.
Hooks own loading, browser subscriptions, animation, and media lifecycles.
UI composes typed media and accessible controls. Static design tokens/copy
do not require data-layer indirection.

```text
.agent/              AI state, decisions, tasks, and session history
docs/                Engineering docs, media sources, original briefs
scripts/             Media processing and consistency checks
src/repositories/    Local collection and future CMS boundary
src/services/        React-independent validation and selection
src/hooks/           Loading, motion, observers, dialogs
src/types/           Work domain model
src/utils/           Pure spatial math, WebGL and morph helpers
src/shaders/         GLSL for the loader and menu morph
src/router/          Routes, navigation structure, lazy pages
src/ui/              Layouts, components, sections, pages, design tokens
src/assets/          Local AVIF/WebP and WebM/MP4 media
src/tests/           Test setup and fixtures
e2e/                 Browser acceptance tests
```

## Commands

| Command                                   | Purpose                                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                             | Local development server                                     |
| `npm run build`                           | Strict types and production bundle                           |
| `npm run preview`                         | Serve the production bundle                                  |
| `npm run check`                           | Format, lint, types, tests, build, version, and media checks |
| `npm run lint` / `npm run typecheck`      | Lint/architecture and strict type checks                     |
| `npm run test` / `npm run test:watch`     | Unit/component tests                                         |
| `npm run test:coverage`                   | Service/hook/math coverage report                            |
| `npm run test:e2e`                        | Chromium and WebKit browser tests (Firefox in CI)            |
| `npm run format` / `npm run format:check` | Apply/check formatting                                       |
| `npm run media:prepare`                   | Cache sources and regenerate media; needs FFmpeg             |
| `npm run media:audio`                     | Download (CC0) and optimize interface sounds; needs FFmpeg   |
| `npm run media:social`                    | Render share images, app icons, and the web manifest         |
| `npm run media:audit`                     | Image, video, and sound budgets and format checks            |
| `npm run version:check`                   | Synchronized Semantic Version records                        |

First install browsers with `npx playwright install chromium firefox webkit`. On Linux,
add `--with-deps`. FFmpeg/ffprobe are required for media commands and `check`.

## Documentation

- [Architecture](docs/architecture.md) and [project structure](docs/project-structure.md)
- [Coding standards](docs/coding-standards.md) and [testing](docs/testing.md)
- [Accessibility](docs/accessibility.md) and [performance](docs/performance.md)
- [Media pipeline](docs/media-pipeline.md) and [source/creator log](docs/media-sources.md)
- [Deployment](docs/deployment.md) and [versioning](docs/versioning.md)

The interaction concept is inspired by [Loop's spatial portfolio](https://loop-agency.framer.website/home-spiral).
No reference-site assets, copy, code, or branding are included.

## Versioning and AI handoff

Semantic Versioning (currently `0.2.0`). Keep `package.json`, `package-lock.json`,
`.agent/CHANGELOG.md`, and `.agent/PROJECT_STATE.md` synchronized. Use Conventional
Commits. Preparing a version is local; pushing/publishing requires authorization.

Future agents start with [project state](.agent/PROJECT_STATE.md),
[decisions](.agent/DECISIONS.md), and [architecture](.agent/ARCHITECTURE.md), then
inspect only relevant modules. Update the state and changelog after meaningful
changes. [`.agent/CHANGELOG.md`](.agent/CHANGELOG.md) is the single changelog for
releases and implementation sessions.
