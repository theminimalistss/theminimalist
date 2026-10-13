# Current project state

PROJECT: The Minimalist — Design Studio website
VERSION: 0.21.0
STATUS: Landing experience complete; Founders and Contact populated; remaining pages provisional
CURRENT TASK: 0.21.0 shared overview layouts, lotus ornament, and Hostinger build readiness completed; user authorized commit and push to main.

## Completed

- Strict React/TypeScript/Vite; repository → service → hooks → UI.
- Twelve local licensed concepts (six featured on Home), responsive images, silent
  loops/posters, media scripts.
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
- 0.11.0: Works tesseract on ivory: traced entrance, automatic front-study preview,
  focus stepper, eased hover/drag motion, view-transition gallery switch, and a
  Works sound scene; reduced-motion and WebGL fallbacks.
- 0.12.0: Works heartbeat in time with new 60 BPM music; particle morph with
  un-drawing between sculpture and gallery; wandering rotation; breakpoint glide;
  card-consistent floating preview; rotation resumes after Reset.
- 0.13.0: Doodle logo (hover sketch, click pop, scroll sway); cross-browser and
  battery pass; Works collection of twelve alternating studies (Home keeps six).
- 0.13.1: Points orbit outside the cube with faint dashed tethers; two-row bottom controls
  below 1,100 px; the contact button clears Reset view.
- 0.14.0: Founders hero: portraits on a rotating drum that bend in transit and
  flatten at rest, a scrolling name behind, and no duplicated cards.

- 0.14.1: Single foreground portrait with a smoothly scrolling full name behind;
  synchronized founder crossfades, pointer-driven portrait depth, direct selection,
  and pause control. Responsive
  local media, reduced-motion presentation, and hidden/offscreen suspension.
- 0.19.0: Testimonials Spatial and Gallery views; frames and the intro glide
  between the falling field and a scrollable grid; gallery hover focus and video
  playback; a fresh, evenly spaced field on each visit.
- 0.20.0: Studio overview with a forest ethos panel, editorial point of view, numbered principles,
  and visual portals to Founders, Testimonials, and Works in the opening screen.
  The SVG sprig has wind, hover doodling, and tap response with motion safeguards.
- 0.21.0: Services, Products, and Contact reuse the Studio overview/directory and
  forest editorial section, with existing destinations and shared contact data.
  The ornament is a layered lotus with native wind animation and an interaction-only
  spring loop. Optional audio/video no longer block entry; WebGL buffers are bounded
  and route prefetch is deferred/sequential. Node 24 and a static Hostinger build
  audit are documented. Browser builds/reports are isolated per test port.

## Latest verification — 2026-10-13

- `npm run check`: passed, including 123 unit tests, production build, version
  consistency, and local media audit.
- Node 24.21.0: `build:hostinger` passed; `deploy:check` verified 17 route pages,
  the 404 fallback, and 126 entry asset references. Local media totals 10.58 MiB.
- Full isolated production browser run: 144 passed, 14 skipped, one far-frame
  Testimonials failure. Corrected that test's covered/moving frame selection;
  focused follow-up found and fixed Safari click interception and mobile tap
  highlight cleanup. The interception fix is limited to Spatial view.
- Final overview/flower/startup checks: 12 passed across Chromium and
  desktop/mobile WebKit. Final Testimonials regression: 16 passed, 2 skipped
  (mobile hover and no unobscured far frame in one random desktop arrangement).
  Gallery transitions, accessibility, video playback, and reduced motion pass.
  The far-frame click also passed in Chromium and WebKit in the focused fix run.
  A final WebKit repeat verified three more far-frame clicks without failures/skips.
- Reviewed four overview pages at 320, 390, 768, and 1440 px; all destinations
  are visible in the opening layout, no horizontal overflow, and the lotus clears
  the statement/footer. Firefox remains a CI check.

## Known issues / limits

- Set `VITE_SITE_URL` to the production origin before launch; without it share
  images are relative and canonical URLs and the sitemap are omitted.
- Concepts and provisional copy need approved replacements before launch.
- About, Products, and Inquiries hold placeholder
  content; inquiry forms are not live (they point to the studio email).
- WebGL frames were reviewed in headless Chromium/WebKit only; check real devices.
- Sound was designed by measurement and synthesis, not by ear in this session;
  listen on real speakers/headphones and adjust `SOUNDS`/`AMBIENT` levels.
- Playwright Firefox cannot launch on macOS 27 locally; Firefox runs in CI.
- “The full intro plays once per session” can fail in WebKit under parallel load
  (reload timing). It predates 0.10.0; consider timing with a single worker.
- No production domain, commissioned portfolio content, or inquiry submission backend yet.
- Hostinger live routing/cache/headers and real-device GPU performance require
  post-deployment verification; no Hostinger deployment was performed.
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
