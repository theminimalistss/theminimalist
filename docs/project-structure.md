# Project structure

| Location                                | Responsibility                                                    |
| --------------------------------------- | ----------------------------------------------------------------- |
| `src/types/work.ts`                     | Discriminated media types and repository contract                 |
| `src/repositories/works.content.ts`     | Replaceable concept data/local asset references                   |
| `src/repositories/works.repository.ts`  | Infrastructure adapter                                            |
| `src/services/works.service.ts`         | Validation, normalization, selection, ordering                    |
| `src/hooks/`                            | Loading, observers, visibility, dialogs, animation integration    |
| `src/audio/`                            | Web Audio engine, ambient bed, synthesized sounds                 |
| `src/constants/sounds.ts`               | Sound map, mix levels, ambient and swell settings                 |
| `src/assets/audio/`                     | CC0 interface sounds (Opus/WebM + MP3)                            |
| `scripts/prepare-audio.mjs`             | Download and optimize interface sounds                            |
| `src/utils/spiral.ts`                   | Pure spatial and wheel-velocity math                              |
| `src/utils/webgl.ts`, `lotusArtwork.ts` | WebGL scene helpers and loader texture painting                   |
| `src/utils/collectionMorph.ts`          | Keyframes and clip insets for the spiral ↔ gallery flight         |
| `src/shaders/`                          | GLSL for the loader and menu morph                                |
| `src/constants/motion.ts`               | Loop, loader, and menu-morph timing/geometry constants            |
| `src/constants/brand.ts`                | Lotus mark geometry and “EST. 2020” lockup                        |
| `src/router/`                           | Route paths, navigation structure, lazy pages                     |
| `src/ui/layouts/`                       | `SiteLayout` (header, menu, focus) and `PageLayout` (footer)      |
| `src/ui/pages/`                         | Home, Works, Studio, Products, Contact, inquiries, 404            |
| `src/ui/sections/Hero/`                 | Hero shell, controls, `WorkCollection`, statement, footer         |
| `src/ui/sections/Page/`                 | Page intro, sections, link cards, tabs, breadcrumbs, placeholders |
| `src/constants/pages.ts`                | Temporary product and inquiry copy                                |
| `src/constants/founders.{json,ts}`      | Founding partners (names, roles, portraits)                       |
| `src/constants/menu.ts`                 | Menu section previews and cursor cue labels                       |
| `src/router/pageModules.ts`             | Lazy page imports shared by routes and idle prefetch              |
| `src/router/pageMeta.json`              | Titles, descriptions, and share-image copy per route              |
| `scripts/socialMeta.ts`                 | Vite plugin: per-route share HTML, robots, sitemap                |
| `scripts/create-social-images.mjs`      | Share images, app icons, web manifest                             |
| `src/ui/components/`                    | Logo, media, metadata, dialogs, error boundary                    |
| `src/ui/styles/`                        | Tokens, typography, global and focused component CSS              |
| `src/assets/`                           | Optimized production media                                        |
| `src/tests/`, colocated tests, `e2e/`   | Fixtures and behavior tests                                       |
| `scripts/`                              | Media acquisition/processing/audit and version checks             |
| `.cache/`, `artifacts/`                 | Ignored source cache and QA outputs                               |
| `.agent/`                               | Concise AI handoff records                                        |
| `docs/briefs/`                          | Original user-provided master prompts                             |

Future config/layout modules are added when needed, without empty abstractions.
Imported assets receive content hashes in production.
