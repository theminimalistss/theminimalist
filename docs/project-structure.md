# Project structure

| Location                                                                                  | Responsibility                                                            |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/types/work.ts`                                                                       | Discriminated media types and repository contract                         |
| `src/data/`                                                                               | Central application JSON content; see its README                          |
| `src/data/product-details.json`, `src/types/product.ts`                                   | Product narratives, typed illustration choices, and repository contract   |
| `src/repositories/productDetails.repository.ts`, `src/services/productDetails.service.ts` | Isolated product content, route/choice validation, cancellation           |
| `src/hooks/useProductDetail.ts`, `useProductPreview.ts`                                   | Product loading/retry and input-driven study selection/assembly           |
| `src/hooks/useIllustrationMotion.ts`                                                      | Shared native service/product illustration playback lifecycle             |
| `src/ui/sections/Products/*ProductDetail.tsx`                                             | Distinct workspace, template collection, and exploded-object compositions |
| `src/hooks/useTemplateCatalog.ts`                                                         | Template category state and filtered collection through the service       |
| `src/repositories/works.media.ts`                                                         | Bundler-managed local work media resolution                               |
| `src/repositories/works.repository.ts`                                                    | Infrastructure adapter                                                    |
| `src/services/works.service.ts`                                                           | Validation, normalization, selection, ordering                            |
| `src/repositories/siteContent.repository.ts`, `src/services/siteContent.service.ts`       | Typed snapshots and editorial content/domain validation                   |
| `src/hooks/useSiteContent.ts`, `src/types/content.ts`                                     | Synchronous content selection and shared contracts                        |
| `src/hooks/useBrandDisclosure.ts`, `useServiceMotion.ts`                                  | Aligned drawer transitions and visible-only service artwork motion        |
| `src/hooks/useContactContrast.ts`, `src/services/contactContrast.service.ts`              | Surface sampling and pure adaptive Contact colour selection               |
| `src/hooks/`                                                                              | Loading, observers, visibility, dialogs, animation integration            |
| `src/audio/`                                                                              | Web Audio engine, ambient bed, synthesized sounds                         |
| `src/constants/sounds.ts`                                                                 | Sound map, mix levels, ambient and swell settings                         |
| `src/assets/audio/`                                                                       | CC0 interface sounds (Opus/WebM + MP3)                                    |
| `scripts/prepare-audio.mjs`                                                               | Download and optimize interface sounds                                    |
| `src/utils/spiral.ts`                                                                     | Pure spatial and wheel-velocity math                                      |
| `src/utils/webgl.ts`, `lotusArtwork.ts`                                                   | WebGL scene helpers and loader texture painting                           |
| `src/utils/collectionMorph.ts`                                                            | Keyframes and clip insets for the spiral ↔ gallery flight                 |
| `src/shaders/`                                                                            | GLSL for the loader and menu morph                                        |
| `src/constants/motion.ts`                                                                 | Loop, loader, and menu-morph timing/geometry constants                    |
| `src/constants/brand.ts`                                                                  | Lotus mark geometry and “EST. 2020” lockup                                |
| `src/router/`                                                                             | Route paths, navigation structure, lazy pages                             |
| `src/ui/layouts/`                                                                         | `SiteLayout` (header, menu, focus) and `PageLayout` (footer)              |
| `src/ui/pages/`                                                                           | Home, Works, Studio, Products, Contact, 404                               |
| `src/ui/sections/Hero/`                                                                   | Hero shell, controls, `WorkCollection`, statement, footer                 |
| `src/ui/sections/Page/`                                                                   | Page intro, sections, link cards, tabs, breadcrumbs, placeholders         |
| `src/ui/sections/Products/`                                                               | Interactive product panels and filterable template catalog                |
| `src/ui/sections/Contact/`                                                                | Unified inquiry form, direct details, social disclosure, envelope         |
| `src/hooks/useInquiryForm.ts`, `useCopyText.ts`                                           | Form state, resize/visibility, mail hand-off, clipboard handling          |
| `src/services/inquiry.service.ts`                                                         | Kind-specific validation and pure email composition                       |
| `src/types/inquiry.ts`, `src/data/inquiry.json`                                           | Inquiry contracts and presentation options                                |
| `src/utils/productArt.ts`                                                                 | Pure layered isometric SVG geometry and assembly poses                    |
| `src/hooks/useProductPanels.ts`, `useTemplates.ts`                                        | Panel selection and cancellable template loading                          |
| `src/types/template.ts`                                                                   | Template model, layouts, and repository contract                          |
| `src/data/templates.json`, `src/repositories/templates.repository.ts`                     | Provisional catalog and isolated content snapshots                        |
| `src/services/templates.service.ts`                                                       | Template validation and category derivation                               |
| `src/data/products.json`, `service-process.json`                                          | Product descriptions and process captions                                 |
| `src/data/founders.json`, `src/constants/founders.ts`                                     | Founding partners (names, roles, portraits)                               |
| `src/data/social.json`, `contact.json`, `src/constants/social.ts`                         | Social channels (main/More) and contact details                           |
| `src/constants/menu.ts`                                                                   | Menu section previews and cursor cue labels                               |
| `src/router/pageModules.ts`                                                               | Lazy page imports shared by routes and idle prefetch                      |
| `src/data/page-meta.json`                                                                 | Titles, descriptions, and share-image copy per route                      |
| `scripts/socialMeta.ts`                                                                   | Vite plugin: per-route share HTML, robots, sitemap                        |
| `scripts/create-social-images.mjs`                                                        | Share images, app icons, web manifest                                     |
| `src/ui/components/`                                                                      | Logo, media, metadata, dialogs, error boundary                            |
| `src/ui/styles/`                                                                          | Tokens, typography, global and focused component CSS                      |
| `src/assets/`                                                                             | Optimized production media                                                |
| `src/tests/`, colocated tests, `e2e/`                                                     | Fixtures and behavior tests                                               |
| `scripts/`                                                                                | Media acquisition/processing/audit and version checks                     |
| `.cache/`, `artifacts/`                                                                   | Ignored source cache and QA outputs                                       |
| `.agent/`                                                                                 | Concise AI handoff records                                                |
| `docs/briefs/`                                                                            | Original user-provided master prompts                                     |

Future config/layout modules are added when needed, without empty abstractions.
Imported assets receive content hashes in production.
