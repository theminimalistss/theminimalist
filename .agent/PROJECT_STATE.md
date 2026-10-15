# Current project state

PROJECT: The Minimalist — Design Studio website
VERSION: 0.26.2
STATUS: Landing experience complete; Founders and Contact populated; remaining pages provisional
CURRENT TASK: 0.26.2 release (consistent SVG icons across devices). Deployment remains pending.

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
- 0.22.0: Services pairs its intro with a looping Listen / Shape / Build / Launch
  process, original technical symbols constructed in WebGL, one description at
  a time, stage selection and pause controls. The three service links move below
  with responsive local imagery. Production CSS is HTML-linked in one bundle,
  avoiding the late route stylesheet failure observed on Hostinger Works.
- 0.23.0: Services drawing shares the tesseract line style (traced strokes, faint
  WebGL faces, per-drawing idle motion, sound waves tucked behind the bubbles);
  clicks keep the cycle running; professional local Unsplash images per service;
  Branding add-ons item; fourteenth testimonial (Cebu Social Club).
- 0.24.0: Products opens with three numbered panels that expand on hover/focus,
  assembling layered isometric drawings into textured objects. Touch opens a
  panel before following its link. Website templates has a filterable, validated
  provisional catalog; software and hardware remain coming soon.
- 0.25.0: One Contact form for hello, quotes, and meetings, with local validation,
  email-app hand-off, manual copy fallback, interrupted resize handling, and
  visible-only envelope motion. Legacy inquiry HTML/redirects remain available;
  selected options and collapsed channels have explicit accessibility fallbacks.
- 0.26.0: Stable page entry without shell transforms or route snapshots; modules
  resolve before navigation commits and scroll/focus reset before paint. Loader
  progress includes downloaded/decoded audio, with strict completion and retry.
  One warm ambient continues across every page; Contact's envelope responds to
  inquiry interaction independently of Safari pointer-focus behavior.

## Latest verification — 0.26.2, 2026-10-15

- Replaced UI arrow glyphs and testimonial rating stars with shared SVGs, including
  page actions, work cards, Contact sending, and founder/testimonial navigation.
  Inline sizing, colour inheritance, accessibility, and hover motion are retained.
- Browser guidance now requires vector symbols for consistent mobile rendering.
- `npm run check`: 145 unit tests passed. Focused production browser suite:
  29 passed, one configured mobile-hover skip across Chromium and desktop/mobile
  WebKit, including accessibility and existing controls/previews.
- An 11-route desktop/mobile audit found no icon text or horizontal overflow;
  forced emoji fonts did not change SVG geometry. WebKit arrow hover motion and
  deployment audit passed. No dependency/media added; release records aligned at 0.26.2.

## Previous verification — 0.26.1, 2026-10-15

- Meeting radios now use paired cards with icons, descriptions, and clear checks.
  Appointment fields align into organisation, date/time, and full-width meeting rows.
- A locally styled date calendar replaces the browser popup, with keyboard
  navigation, disabled past dates, selection persistence, responsive positioning,
  dialog fallback, and focus return. UI → hook → calendar service stays intact.
- `npm run check` passed with 145 unit tests; deployment audit passed. All 36
  Contact checks verified across Chromium and desktop/mobile WebKit: 32 passed
  in the final serial run, four existing timing failures passed on rerun. Earlier
  runs also had long local host/startup stalls; no loading deadline was relaxed.
  All six new control checks passed, including calendar axe/fallback coverage.
- Visual checks at 320/390/768/1440 px in both engines found no overflow. No
  dependency/media added. Release records aligned at 0.26.1; no hosting deployment.

## Latest release verification — 0.26.0, 2026-10-15

- `npm run check`: passed with 142 unit tests, formatting, lint, strict types,
  production build, version consistency, and media audit (10.96 MiB).
- `deploy:check`: verified 14 routes, three legacy aliases, the 404 fallback,
  and 126 asset references. Shared CSS: 20.51 KB gzip.
- Final production browser suite: 210 passed, 18 platform/visibility skips across
  Chromium and desktop/mobile WebKit. Covers audio/initial-page completion beyond
  the visual timeout, retry, cold navigation, stable header geometry, Contact
  envelope interaction/tweening, reduced motion, and existing scene regressions.
  One conditional skip had no unobscured far testimonial frame in that arrangement;
  the equivalent desktop WebKit check passed.
- Safari's inquiry-label focus mismatch was reproduced: Chrome focused the radio,
  WebKit kept focus outside the form. Explicit interaction state now opens the
  envelope in each engine; the SVG tween stays finite and cancels cleanly.
- One ambient graph persists across page scenes. A 14 s offline preview measured
  peak 0.0244 / RMS 0.00593 without clipping, stored in ignored QA artifacts.
  Firefox remains Linux-CI-only; real-device listening/GPU checks remain outside
  local automated coverage. No hosting publication performed.

## Previous verification — 0.25.0, 2026-10-14

- `npm run check`: passed with 136 unit tests, formatting, lint, strict types,
  production build, version consistency, and local media audit (10.96 MiB).
- `npm run deploy:check`: verified 14 current routes, three legacy aliases,
  the 404 fallback, and 126 asset references. Shared CSS: 20.51 KB gzip.
- Full isolated production browser suite: 190 passed, 17 configured skips across
  desktop Chromium and desktop/mobile WebKit. Covers clipboard failures/manual
  copying, legacy shells/redirects, rapid form switching, reduced motion,
  collapsed-channel navigation, accessibility, and all existing scene regressions.
- Contact was checked at 320, 390, 768, and 1440 px in both engines with no
  horizontal overflow, correct selected colours, and offscreen motion suspension.
- Firefox launch limitation reproduced locally, including an alternate temporary
  directory. The Linux CI project remains enabled; real-device/browser-version
  coverage is documented in `docs/browser-support.md`. No hosting publication
  performed. Set the final `VITE_SITE_URL` before the production hosting build.

## Previous verification — 0.24.0, 2026-10-14

- `npm run check`: passed with 132 unit tests, formatting, lint, strict types,
  production build, version consistency, and local media audit (10.96 MiB).
- `npm run deploy:check`: verified 17 routes, the 404 fallback, and 126 asset
  references. `VITE_SITE_URL` still needs the final production origin.
- Full isolated production browser suite: 169 passed, 17 configured skips across
  desktop Chromium and desktop/mobile WebKit. Products hover/focus, keyboard
  navigation, two-step touch navigation, template filtering, and accessibility
  passed alongside the existing motion and WebGL regression checks.
- Package/lockfile, README, changelog, state, architecture, testing/deployment
  docs, and catalog follow-up tasks aligned at 0.24.0. No hosting publication
  performed; Firefox remains covered in CI.

## Previous verification — 0.23.0, 2026-10-14

- `npm run check`: passed with 130 unit tests; full browser suite: 160 passed,
  14 configured skips across Chromium and desktop/mobile WebKit.

## Previous verification — 0.22.0, 2026-10-14

- `npm run check`: passed with 126 unit tests, strict types/lint/format, build,
  version consistency, and local media audit. `deploy:check` verified 17 routes,
  the 404 fallback, and 126 asset references. Shared production CSS: 17.35 KB gzip.
- Services final browser suite: 15 passed across Chromium and desktop/mobile
  WebKit, including live WebGL, cycling/manual selection, pause/offscreen holding,
  image navigation, accessibility, reduced motion, missing/lost WebGL, and
  HTML-linked Works/Services CSS. Works regression: all 28 applicable checks passed
  (2 configured mobile skips); shared Home/Studio/Testimonials checks: 15 passed.
- Reviewed Services at 320, 390, 1024, and 1440 px with no horizontal overflow.
  The label and caption float inside the illustration panel, with their drift
  paused alongside the cycle. Top stage tabs and the fixed description row are
  removed. The requested header/footer bars are also removed; the illustration
  itself provides keyboard/tap navigation and hover/focus holding. The drawing
  now combines GL strokes with shaded SVG planes, thickness, and soft shadows.
  Existing staged testimonial/content/media edits were preserved; this task adds
  no media or runtime dependency.
- The live Hostinger Works stylesheet failure was reproduced and investigated.
  The stylesheet refetch restored its rules; production now removes that lazy
  stylesheet dependency. Local build verified; the hosted site requires redeployment.

## Previous verification — 2026-10-13

- `npm run check`: passed, including 130 unit tests, production build, version
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

- The six website templates (Atelier, Mercer, Hearth, Quill, Meridian, Linen) are
  provisional catalog entries with schematic previews until real templates,
  previews, and pricing are supplied; software and hardware are marked coming soon.
- Set `VITE_SITE_URL` to the production origin before launch; without it share
  images are relative and canonical URLs and the sitemap are omitted.
- Concepts and provisional copy need approved replacements before launch.
- About and Products hold placeholder content. Contact's one form has no
  backend: sending opens the visitor's email app with the message composed (with a
  copy fallback); `/inquiries/*` links redirect to `/contact?inquiry=…`.
- WebGL frames were reviewed in headless Chromium/WebKit only; check real devices.
- Sound was designed by measurement and synthesis, not by ear in this session;
  listen on real speakers/headphones and adjust `SOUNDS`/`AMBIENT` levels.
- Playwright Firefox cannot launch on macOS 27 locally; Firefox runs in CI.
- “The full intro plays once per session” can fail in WebKit under parallel load
  (reload timing). It predates 0.10.0; consider timing with a single worker.
- No production domain, commissioned portfolio content, or inquiry submission backend yet.
- The temporary Hostinger deployment was inspected read-only. The CSS fix must
  be redeployed; live cache/headers and real-device GPU performance still need
  post-deployment verification. No hosting publication was performed.
- TypeScript stays at 6.0.3 pending parser support for 7.x.

## Important files

`src/repositories/works.content.ts`, `src/services/works.service.ts`,
`src/hooks/useSpiralLoop.ts`, `src/hooks/useLoaderScene.ts`,
`src/hooks/useMenuMorph.ts`, `src/hooks/useCollectionMorph.ts`, `src/hooks/usePointerCue.ts`,
`src/router/pageModules.ts`, `src/shaders/`,
`src/constants/brand.ts`, `src/constants/founders.json`,
`src/constants/contact.json`, `src/constants/social.json`, `src/constants/social.ts`,
`src/ui/sections/Contact/ContactChannels.tsx`, `scripts/socialMeta.ts`,
`src/router/navigation.ts`, `src/ui/layouts/`, `src/ui/pages/`, `src/audio/`,
`src/constants/sounds.ts`,
`src/ui/sections/Hero/Hero.tsx`, `src/ui/styles/`, `docs/media-sources.md`.

NEXT RECOMMENDED TASK: Supply approved catalog/portfolio content and a production
origin. If direct inquiry delivery is required, define the backend contract before
adding a repository; the current form only composes mail and never confirms delivery.
