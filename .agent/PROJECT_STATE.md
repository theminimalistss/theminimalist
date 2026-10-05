# Current project state

PROJECT: The Minimalist — Design Studio website
VERSION: 0.5.0
STATUS: Landing experience complete; site structure in place with temporary pages
CURRENT TASK: Audio feedback for navigation, spiral, hover, and clicks.

## Completed

- Strict React/TypeScript/Vite; repository → service → hooks → UI.
- Six local licensed concepts, responsive images, silent loops/posters, media scripts.
- Spatial hero, gallery, menu, concept previews, and fallback route.
- Pause/reduced-motion support, keyboard foregrounding, native dialogs.
- Unit/browser tests, CI, tokens, source briefs, docs, and handoff records.
- 0.2.0: WebGL lotus loader with boot splash, WebGL menu morph, wheel-steered spiral,
  animated spiral ↔ gallery switching.
- 0.3.0: Site structure (Works, Studio, Products, Contact/Inquiries), fixed header,
  site-map menu, footer, breadcrumbs/tabs; persistent cards for smooth switching.
- 0.4.0: Menu hover panel/preview/cursor cue; page transitions, scroll reveal,
  preview media flight; session-aware intro, idle prefetch, deferred menu WebGL;
  name corrected to “The Minimalist — Design Studio”.
- 0.5.0: Preview morph (View Transitions), full-bleed mobile spiral, per-route
  share HTML/images/icons, campaign-aware intro.

## Known issues / limits

- Set `VITE_SITE_URL` to the production origin before launch; without it share
  images are relative and canonical URLs and the sitemap are omitted.

- Concepts and provisional copy need approved replacements before launch.
- About, Founders, Testimonials, Products, Contact, and Inquiries hold placeholder
  content; contact details are "To be confirmed"; inquiry forms are not live.
- WebGL frames were reviewed in headless Chromium/WebKit only; check real devices.
- No production domain, actual client work, contact integration, or later pages yet.
- TypeScript stays at 6.0.3 pending parser support for 7.x.

## Important files

`src/repositories/works.content.ts`, `src/services/works.service.ts`,
`src/hooks/useSpiralLoop.ts`, `src/hooks/useLoaderScene.ts`,
`src/hooks/useMenuMorph.ts`, `src/hooks/useCollectionMorph.ts`, `src/hooks/usePointerCue.ts`,
`src/router/pageModules.ts`, `src/shaders/`,
`src/constants/brand.ts`,
`src/router/navigation.ts`, `src/ui/layouts/`, `src/ui/pages/`,
`src/ui/sections/Hero/Hero.tsx`, `src/ui/styles/`, `docs/media-sources.md`.

NEXT RECOMMENDED TASK: Supply real page copy/contact details, then build inquiry forms
(form → hook → service validation → repository).
