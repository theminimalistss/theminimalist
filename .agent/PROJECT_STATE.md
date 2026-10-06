# Current project state

PROJECT: The Minimalist — Design Studio website
VERSION: 0.10.0
STATUS: Landing experience complete; Founders and Contact populated; remaining pages provisional
CURRENT TASK: 0.10.0 reviewed and verified; ready for the next scoped change.

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
- 0.6.0: Interface sound + generative ambient with a remembered toggle, work
  hover feedback, spiral hover slowdown, cross-browser targets and fallbacks.
- 0.7.0: Floating “Let’s talk” contact button with a lotus morph on hover.
- 0.8.0: Real Founders page (Daisy Nuique, Rex Pinili) with matched portraits.
- 0.9.0: Contact social channels (main + More), email, and hours; smooth hero
  pause/resume with a layout-stable motion label.
- 0.10.0: Animated mobile ↔ desktop resize; per-word text glide on view switch;
  Safari preview flatten fix; spiral → gallery stacking/angle fix; founder LinkedIn.

## Latest verification — 2026-10-06

- `npm run check`: passed, including 85 unit tests, production build, version
  consistency, and local media audit.
- `npm run test:e2e`: 78 passed, 9 configured skips across desktop Chromium,
  desktop WebKit, and mobile WebKit. Firefox remains a CI check.

## Known issues / limits

- Set `VITE_SITE_URL` to the production origin before launch; without it share
  images are relative and canonical URLs and the sitemap are omitted.
- Concepts and provisional copy need approved replacements before launch.
- About, Testimonials, Products, and Inquiries hold placeholder
  content; inquiry forms are not live (they point to the studio email).
- WebGL frames were reviewed in headless Chromium/WebKit only; check real devices.
- Sound was designed by measurement and synthesis, not by ear in this session;
  listen on real speakers/headphones and adjust `SOUNDS`/`AMBIENT` levels.
- Playwright Firefox cannot launch on macOS 27 locally; Firefox runs in CI.
- “The full intro plays once per session” can fail in WebKit under parallel load
  (reload timing). It predates 0.10.0; consider timing with a single worker.
- No production domain, commissioned portfolio content, or inquiry submission backend yet.
- TypeScript stays at 6.0.3 pending parser support for 7.x.

## Important files

`src/repositories/works.content.ts`, `src/services/works.service.ts`,
`src/hooks/useSpiralLoop.ts`, `src/hooks/useLoaderScene.ts`,
`src/hooks/useMenuMorph.ts`, `src/hooks/useCollectionMorph.ts`, `src/hooks/usePointerCue.ts`,
`src/router/pageModules.ts`, `src/shaders/`,
`src/constants/brand.ts`, `src/constants/founders.json`,
`src/constants/contact.json`, `src/constants/social.json`, `src/constants/social.ts`,
`src/ui/sections/Page/SocialLinks.tsx`, `scripts/socialMeta.ts`,
`src/router/navigation.ts`, `src/ui/layouts/`, `src/ui/pages/`, `src/audio/`,
`src/constants/sounds.ts`,
`src/ui/sections/Hero/Hero.tsx`, `src/ui/styles/`, `docs/media-sources.md`.

NEXT RECOMMENDED TASK: Supply approved content for the remaining provisional pages
and define inquiry requirements before building forms
(form → hook → service validation → repository).
