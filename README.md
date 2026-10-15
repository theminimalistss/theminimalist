# The Minimalist

**Design studio · v0.26.2 · Immersive studio portfolio**

A warm editorial portfolio with a continuous spatial work loop, mixed image and
video studies, an accessible gallery, and studio navigation. The landing
experience, Works explorer, Founders, and Contact are implemented; remaining
pages contain provisional content.

The twelve projects (six featured on Home, all twelve on Works) are **independent
concept studies with licensed stock media**,
not commissioned client work. Replace them with approved portfolio content
before a public studio launch.

## Experience

Spatial spiral and gallery with morphing transitions, a WebGL lotus intro and
menu, page transitions, scroll reveals, and quiet interface sound with a
generative ambient bed (toggle “Sound” in the header). Supports current Chrome,
Edge, Firefox, and Safari/iOS with feature fallbacks; see
[browser support](docs/browser-support.md) for tested coverage and limits.

Works fills the viewport with an interactive WebGL tesseract on the ivory canvas.
It traces itself in, wanders slowly with a heartbeat at its centre, and shows the
study nearest the viewer, assembled from particles. Drag (with momentum) or use
the arrow keys to rotate. Hover, focus, or tap a point to preview it, and step
through studies with the focus control. Switching to the gallery un-draws the
sculpture as its points stream into the images. A warm ambient with soft keys
continues across every page; Works retains its visual heart and glass-like feedback.
A gallery, a reduced-motion
presentation, and WebGL fallbacks keep every study accessible.

Products presents three expanding panels with isometric SVG artwork that
assembles into textured objects. Hover or keyboard focus opens a panel; on touch,
tap once to open and again to navigate. Website templates has a filterable grid
of six provisional entries with schematic previews. Software and hardware are
coming soon; approved template files, previews, and pricing remain pending.

## Site map

| Section  | Pages                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| Home     | `/` — the collection in motion (spiral ↔ gallery)                                  |
| Works    | `/works`                                                                           |
| Services | `/services`, `/services/software`, `/services/websites`, `/services/branding`      |
| Studio   | `/about`, `/founders`, `/testimonials`                                             |
| Products | `/products`, `/products/software`, `/products/templates`, `/products/hardware`     |
| Contact  | `/contact` (`?inquiry=quote` or `appointment` preselects; `/inquiries/*` redirect) |

Every page is reachable from the header (desktop), the menu, and the footer
sitemap. Sub-pages add breadcrumbs and section tabs. Pages other than Home, Works,
Founders, and Contact hold clearly marked placeholder content. Contact's form sends
through the PHP Brevo service in `server/` when `VITE_CONTACT_ENDPOINT` is set, and
otherwise composes an email in the visitor's mail app.

## Run locally

Requires Node.js 22.12+ and npm. Node 24 is specified in `.nvmrc` for Hostinger parity.

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
src/repositories/    Local collection, contact endpoint, and future CMS boundary
server/              PHP contact mail service (Brevo); see server/README.md
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
| `npm run build:hostinger`                 | Production build and deployment output audit                 |
| `npm run deploy:check`                    | Verify built route HTML and local asset references           |
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
| `npm run media:founders`                  | Crop and encode founder portraits from `.cache/founders/`    |
| `npm run media:audit`                     | Image, video, and sound budgets and format checks            |
| `npm run version:check`                   | Synchronized Semantic Version records                        |
| `npm run media:email-logo`                | Render the lotus PNG used in emails                          |
| `npm run api:dev` / `npm run test:php`    | Run the PHP contact service locally / its tests (PHP 8.1+)   |
| `npm run build:api`                       | Write `dist-api/` for upload to the PHP subdomain            |

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

Semantic Versioning (currently `0.26.2`). Keep `package.json`, `package-lock.json`,
`.agent/CHANGELOG.md`, and `.agent/PROJECT_STATE.md` synchronized. Use Conventional
Commits. Preparing a version is local; pushing/publishing requires authorization.

Future agents start with [project state](.agent/PROJECT_STATE.md),
[decisions](.agent/DECISIONS.md), and [architecture](.agent/ARCHITECTURE.md), then
inspect only relevant modules. Update the state and changelog after meaningful
changes. [`.agent/CHANGELOG.md`](.agent/CHANGELOG.md) is the single changelog for
releases and implementation sessions.
