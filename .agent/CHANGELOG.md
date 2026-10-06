# Changelog

The single changelog for releases and AI implementation sessions. Versions follow
Semantic Versioning (`docs/versioning.md`). Dates use Asia/Manila.

## [Unreleased]

## [0.13.0] — 2026-10-07

### Added

- The header logo doodles wherever it appears. On hover, the lotus re-sketches its
  strokes and its lines wobble like hand-drawn animation. On click, short
  hand-drawn emphasis strokes pop out as the mark squashes and stretches and the
  diamond hops. Scrolling, or the wheel on Home, sways the lotus on a soft spring
  and briefly sets its lines wobbling. All of this is off under reduced motion.
- Works shows twelve studies; Home keeps its six featured ones. The six new
  concept studies alternate image and video like the first six: Terra (packaging &
  identity), Lumen (software product, video), Folio (editorial website), Grain
  (brand & website, video), Linnea (e-commerce), and Haven (booking platform,
  video). Their media are licensed Pexels assets, stored and optimized locally.
  On the sculpture, twelve studies sit at the midpoints of the cube's edges, with
  the first nearest the viewer.

### Changed

- A cross-browser and mobile pass, with behaviour preserved. The logo uses plain
  transforms (Chrome 90–103 ignore the individual `rotate`/`scale`/`translate`
  properties), and the stepper keyframes no longer use them. A guarded
  `:focus-visible` check no longer throws in Safari 15.0–15.3. The hover re-sketch
  is limited to devices that can hover, so it does not stick after a tap.
- Lighter work per frame. The logo's wobble filter updates only on its boil steps,
  and CSS variables are written only when they change. The wheel no longer forces
  a layout read. Slow idle cruising draws at about 30 fps (interaction and easing
  stay at full rate). The resize glide reads each box once per resize, and the
  particle flight uses fewer particles when more than six studies fly.

### AI session

Changed: `StudioLogo`, a new `useLogoDoodle` hook, `LOGO_DOODLE` in `motion.ts`,
`site.css`; the works content, repository (`getWorks`), service
(`getCollectionWorks`), and hooks (`useCollectionWorks`); a new `ink` art
direction; 12-point anchors; media manifest and script (named assets, per-image
quality); `useTesseract`, `useLayoutGlide`, and `useWorksView` optimizations; tests
and handoff documentation.

Reason: The user asked for hover, click, and scroll animation on the logo across
the site, in a doodle style, and then asked to remove the underline that had been
added. They then asked for a review of the recent work for optimization across
browsers and mobile, with behaviour preserved, and for twelve studies on Works
(six new, alternating image and video) while Home keeps six.

Verification: 2× screenshots of the hover sketch and wobble, the click pop, and
scroll sway settling back to a clean mark. A wheel probe on Home showed the spring
(about 1° peak, settling with a soft overshoot) without scrolling the page. The
browser test covers all three triggers.

Tests: `npm run check` passes (103 unit tests); Playwright 108 passed, 12 skipped
(Firefox in CI; desktop-only checks on touch).

## [0.12.0] — 2026-10-07

### Added

- A heartbeat at the centre of the Works sculpture: a forest dot beats “lub-dub”
  once a second with a faint ripple. It starts once the sculpture has been drawn.
- Spatial → gallery: the sculpture un-draws itself (the trace in reverse) while
  each point streams particles that land on its gallery image; the real cards then
  fade in. Gallery → spatial: the images dissolve into particles that fly into the
  points as the sculpture traces back in.
- New Works music: a warm pad that changes every four beats, a plucked melody that
  wanders over it, and a quiet heartbeat at 60 BPM. The music and the visual heart
  share one clock, so they beat together.
- The idle rotation wanders: every 9–16 s it takes a new heading (a new speed,
  sometimes reversed, and a drift toward a new tilt), blended in over 2.5 s.
- Dragging the window across a breakpoint glides any control or gallery card that
  would jump; continuous resizing is left alone. When the side slot closes, the
  docked preview dissolves where it is.

### Changed

- The floating preview (phones and narrow windows) sits on a sand surface panel
  like the site's cards, keeps clear of the bottom controls, and the contact button
  steps aside while it is open.
- The mobile stepper thumbnail is lifted with a hairline edge, soft shadow, and a
  slight tilt so it stands off the bar.

### Fixed

- Reset, the stepper, and arrow-key glides no longer leave the sculpture stopped;
  the cruise resumes afterwards.

### AI session

Changed: Works page, stage, explorer, preview, and stepper UI; `useTesseract`,
`useParticlePreview`, `useWorksView`, `useHeartbeat`, and `useLayoutGlide`; the
particle scene (texture slots), trace/heading/point utils, the pulse scheduler and
the Works ambient preset; styles, tests, and handoff documentation. The comments
added during the session were removed at the user's request.

Reason: The user asked for a heartbeat at the sculpture's centre (a circle, with
subtle audio beats), particles that carry the works between the sculpture and the
gallery while the sculpture un-draws, new Works music, a wandering rotation, smooth
breakpoint resizing, framing consistent with the design language, and a fix for
rotation stopping after Reset.

Verification: Frame recordings in headless Chromium and WebKit covered the morph in
both directions, the un-drawing, and drag-resizing across breakpoints (to 600 px
and back to 1100 px). Phone screenshots covered the preview panel and the
thumbnail. A 32 s sample confirmed the heading changes, a beat test covers the
shared clock, and a browser test confirms motion resumes after Reset. Music levels
still need listening on real speakers.

Tests: `npm run check` passes (100 unit tests); Playwright 103 passed, 11 skipped
(Firefox in CI; desktop-only checks on touch). The page loader wait in tests is
20 s because parallel software WebGL can slow first loads.

## [0.11.0] — 2026-10-07

### Added

- Full-viewport Works sculpture: a rigid WebGL tesseract drawn in forest ink on the
  ivory canvas, with faint glass faces and selectable points. On arrival, whether
  after the loader or a navigation, the edges trace themselves in. The outer cube
  draws first, then the edges reaching inward, then the inner cube; the faces,
  points, and first preview follow.
- The study nearest the viewer is shown automatically. On wide screens it sits in
  a fixed slot beside the sculpture, assembled from particles that stream out of
  its point. When the front point changes, the old study flows back into its point
  and the next assembles from its own.
- Hovering, focusing, or tapping a point shows that study instead. Hovering the
  shown study pins it, and choosing it opens the accessible project dialog.
- A focus stepper (← 03 / 06 Solenne →) replaces the row of every title. The
  arrows glide the next study to the front, and the control keeps its size for any
  number of works; the gallery remains the full list.
- Motion eases rather than stops. Hover, keyboard focus, and pause ease the
  rotation to rest and back (0.9 s). A released drag keeps its momentum and blends
  into the slow cruise; arrow keys, Home, and Reset glide.
- Switching between Spatial and Gallery crossfades in a view transition while the
  title and toggle glide, with no colour change between the two.
- A Works sound scene: a brighter, more spacious ambient bed (glassy voicings,
  high air, bell-like chimes) crossfades in. Glass tones replace the sampled
  hover, click, and switch sounds; each point has its own note. Assembly, grabbing,
  and releasing the sculpture have their own sounds.
- Reduced motion defaults to the gallery and shows previews without particles;
  WebGL failures keep static geometry and native previews.

### AI session

Changed: Works page, explorer, stage, preview, and stepper UI; `useTesseract`,
`useParticlePreview`, `useWorkHover`, `useWorksView`, `useAppEntered`, and
`useSoundScene`; geometry, trace, focus, and placement utils; GPU scenes and
shaders; the sound engine, ambient presets, and glass sounds; styles, tests,
version files, and handoff documentation.

Reason: The user requested an immersive tesseract Works page with particle
previews, then refined it. They asked to remove the corner cubes and keep the shape
from deforming, and to ease hover pauses and drag releases. They wanted the front
study shown automatically, a smooth spatial ↔ gallery switch, a control that
scales beyond six works, and a traced entrance. They doubted the green background
and asked for Works-specific sound.

Verification: Frame recordings in headless Chromium and WebKit covered the
entrance trace (after the loader and after navigation), the study handoff, both
view switches, and drag momentum. Measurements confirmed the hover ease (motion to
zero over 0.7 s) and the release (momentum decaying into the cruise). A
Web Audio probe confirmed the scene change and gesture sounds without errors;
levels still need listening on real speakers.

Tests: `npm run check` passes (97 unit tests); Playwright 101 passed, 10 skipped
(Firefox in CI; hover-only checks on touch). The five-page accessibility sweep is
marked slow because it can time out under parallel WebGL load.

## [0.10.0] — 2026-10-06

### Added

- Resizing across the mobile breakpoint is animated. The spiral blends from its
  desktop shape to its mobile shape (or back) while it keeps moving. Its clip
  window and top/bottom fade animate with it, the hero text glides and scales to
  its new place and size, and gallery cards fly into the new grid.
- Founder cards link to each partner's LinkedIn (opens in a new tab), with the
  same circle-to-square badge morph as the contact channels. Structured data
  lists each profile under the founder's `sameAs`.

### Fixed

- Opening a work preview no longer flattens or shifts the spiral cards in
  Safari. Perspective now lives in each card's transform instead of being
  inherited from the stage, which Safari dropped while snapshotting the page.
- Switching from spiral to gallery no longer pops cards in front of each other
  or snaps their angle on the first frame. Each card keeps its spiral stacking
  order and vanishing point as it leaves.
- Hero text no longer reshapes suddenly when switching views. “Selected” /
  “works.”, “Less, but” / “with feeling.”, the controls, and the footer items
  glide individually into the new arrangement. Only long moves dip in opacity,
  and newly shown text fades in.

### AI session

Changed: `src/utils/{spiral,collectionMorph}.ts`, `src/hooks/{useSpiralLoop,useCollectionMorph}.ts`,
`src/ui/sections/Hero/{Hero,ViewControls,HeroStatement,HeroFooter,WorkCollection}.tsx`,
`src/ui/styles/{hero,hero-responsive,pages}.css`, `src/constants/{founders.json,founders.ts,motion.ts}`,
`src/ui/pages/FoundersPage.tsx`, `scripts/socialMeta.ts`, tests, docs.

Reason: The user reported spiral cards flickering or changing angle when a
preview opens, sudden size and position changes when switching between spiral
and gallery (cards and text), and asked for a smooth resize between mobile and
desktop. They also supplied the founders' LinkedIn profiles.

Verification: Frame-by-frame screen recordings in headless Chromium and WebKit
located the causes: Safari's snapshot flattening, the stacking order and
vanishing point at the start of the gallery flight, and the whole-block text
glide. The same recordings confirmed the fixes and the breakpoint reshape. A
suspected video-poster swap in Safari was a recording artifact and was left
alone.

Tests: Revalidated before the authorized commit and push: `npm run check` passes
(85 unit tests); `npm run test:e2e` has 78 passed and 9 configured skips (Firefox
runs in CI only). The WebKit intro-timing test passed this run but has previously
been flaky under parallel load, including on 0.9.0.

## [0.9.0] — 2026-10-06

### Added

- Contact page “Follow the studio” section. Facebook, Instagram, and LinkedIn
  are main tiles (icon, name, handle); on hover a tile turns deep green and its
  icon badge morphs from a circle into a tilted ivory square. TikTok and
  Behance sit behind a “More” control that morphs from a round pill into a
  square-cornered tray (+ turns to ×) and glides the chips in; hidden links are
  inert until revealed. Links open in a new tab with a screen-reader notice.
- Line icons for Facebook, Instagram, LinkedIn, TikTok, Behance, and “plus”.
- Real contact details: email `theminimalistss@gmail.com` (mailto) and hours
  7:00 AM – 11:00 AM; the location row is removed. Inquiry placeholders now
  offer the email directly.
- Structured data adds `sameAs` (all five profiles) and the studio email.

### Changed

- Hero motion control: both labels share one grid cell, so toggling “In
  motion” / “Motion paused” crossfades without shifting the footer. Pausing
  eases the spiral to a stop and resuming eases it back up (900 ms
  ease-in-out); previews and view switches still freeze it at once.
- Refreshed `.agent` state, architecture, decisions, handoff instructions, and
  remaining tasks for the populated Founders and Contact pages. Release versions
  are aligned at 0.9.0 in the package, lockfile, README, and agent records.

### AI session

Changed: `src/constants/{social,contact}.json`, `src/constants/social.ts`,
`src/ui/sections/Page/SocialLinks.tsx`, `src/ui/pages/{ContactPage,InquiryPage}.tsx`,
`src/ui/components/Icon.tsx`, `src/ui/styles/{pages,hero}.css`, `scripts/socialMeta.ts`,
`src/hooks/useSpiralLoop.ts`, `src/constants/motion.ts`,
`src/ui/sections/Hero/{Hero,HeroFooter,WorkCollection}.tsx`, tests, docs, and
`.agent` handoff records.

Reason: The user supplied social links (with Facebook, Instagram, LinkedIn as
the main channels), an email address, and opening hours, and asked to drop the
location; they also asked for the motion button not to shift the layout and for
a smooth stop and start. A services rewording of “Brand · Digital ·
Experience” was tried and reverted at the user's request. The release handoff
was refreshed and versions checked before the authorized commit and push.

Tests: Revalidated for release on 2026-10-06: `npm run check` passes (81 unit
tests); `npm run test:e2e` has 76 passed and 8 configured skips across desktop
Chromium, desktop WebKit, and mobile WebKit (Firefox runs in CI only).

## [0.8.0] — 2026-10-06

### Added

- Founders page with the real founding partners: Daisy Nuique (Product /
  Visual Designer) and Rex Pinili (Software Engineer). Both carry the same
  “Founding partner” title, equal card sizes, and are listed alphabetically by
  surname, since the studio is a partnership with no hierarchy.
- Founder portraits cropped to matching 4:5 half-length frames and encoded as
  480/960 AVIF and WebP with all metadata (including location) removed;
  reproducible with `npm run media:founders` from `.cache/founders/`.
- Structured data lists both founders; the Founders share description names
  them.

### AI session

Changed: `src/constants/founders.{json,ts}`, `src/ui/pages/FoundersPage.tsx`,
`src/assets/images/founders/`, `scripts/{prepare-founders,audit-media}.mjs`,
`scripts/socialMeta.ts`, `src/router/pageMeta.json`, styles, tests, docs.

Reason: The user supplied founder photos, names, and roles.

## [0.7.0] — 2026-10-06

### Added

- Floating “Let’s talk” button (lower right, every page except Contact and
  inquiries) that opens the Contact page. At rest it is a deep-green circle with
  the lotus and a soft pulse ring; on hover or keyboard focus it morphs into the
  site’s square-cornered shape, reveals “Let’s talk”, and the lotus redraws
  itself while its diamond hops. Touch screens show it as a compact labelled
  pill. It sits above the hero’s bottom rail on the home page.

### AI session

Changed: `src/ui/components/{ContactFab,LotusMark}.tsx`,
`src/ui/layouts/SiteLayout.tsx`, `src/ui/styles/site.css`,
`e2e/navigation.spec.ts`.

Reason: The user first asked for a hero CTA, then a more familiar booking
button, and finally replaced both with a floating contact button with a playful
hover morph. The earlier variants were removed before release.

Tests: `npm run check` passed (79 unit tests). `npm run test:e2e` passed 70,
8 skipped on mobile, including the floating button → Contact test.

## [0.6.0] — 2026-10-06

### Added

- Interface sound: hover, click, page navigation, menu open/close, spiral ↔
  gallery switch, a speed-following whoosh and soft detent ticks while steering
  the spiral, and a soft synthesized swell when a work preview opens or closes.
  Samples are CC0 (Kenney Interface Sounds and UI Audio), trimmed, softened, and
  encoded as Opus/WebM with MP3 fallback (about 1–3.5 KB each).
- Soothing generative ambient bed: slow sine chords in D major drifting every
  36 s, a low “ocean wash”, rare soft chimes, long reverb; fades in over 8 s.
- Header “Sound” toggle (remembered); audio starts only after the first click
  or key press and suspends when hidden or off.
- Work hover/focus feedback: lift shadow, gentle media zoom and dim, title rise,
  and the spiral slows to a fifth of its speed under the pointer.
- The loader now waits for fonts, the page, every sound file, on-screen images,
  and on-screen playing videos (12 s safety cap), and shows a loading indicator
  (hairline progress and counter, exposed as a progress bar).
- `npm run media:audio` reproduces the sound set; the media audit checks audio
  size, length, mono, and format pairs.

### Changed

- Cross-browser: explicit build targets (Chrome/Edge 90, Firefox 90, Safari 15),
  `vh` fallbacks for `svh`, iOS text-size adjustment, `<dialog>` fallback,
  prefixed Web Audio for older Safari, and no `structuredClone`/`throwIfAborted`.
- Firefox joins the browser test matrix in CI (`E2E_FIREFOX=1` locally).

### AI session

Changed: `src/audio/`, `src/constants/sounds.ts`, `src/assets/audio/`,
`src/repositories/preferences.repository.ts`, `src/services/sound.service.ts`,
`src/hooks/{useSound,useInteractionSounds,useSpiralLoop,useWorkPreview,useDialog}.ts`,
`src/ui/components/{SoundToggle,SiteHeader,WorkItem,WorkDialog}.tsx`, styles,
`scripts/{prepare-audio,audit-media}.mjs`, `vite.config.ts`,
`playwright.config.ts`, CI, tests, docs.

Reason: The user asked for tactile, immersive sound on every interaction, a
soothing background bed, gentler preview sounds, hover feedback on works, and
support across browsers.

Tests: `npm run check` passed (79 unit tests, audio audit). `npm run test:e2e`
passed 67 locally (8 skipped on mobile) including real sound playback and a
remembered toggle. Firefox could not launch locally (Playwright Firefox on
macOS 27 cannot create a profile); it runs in CI on Linux.

## [0.5.0] — 2026-10-06

### Added

- Link previews for Facebook, Instagram, Threads, LinkedIn, X, Reddit, WhatsApp,
  Slack, and ad placements: the build writes HTML for every route (`/about`,
  `/about/index.html`, and `/about.html`) with title, description, canonical
  URL, Open Graph, and X card tags, plus `404.html`, `robots.txt`, and (with
  `VITE_SITE_URL`) `sitemap.xml` and Organization/WebSite structured data.
- Per-page 1200×630 share images (center-safe for square crops), an Apple
  touch icon, app icons, and a web manifest (`npm run media:social`).
- Visitors arriving from ads or social campaigns (`utm_*`, `fbclid`, `gclid`,
  and similar) get the brief intro.

### Changed

- Work previews morph with the View Transitions API: the card becomes the
  preview panel, its media becomes the preview image, and the title, tagline,
  and category glide and cross-fade into the preview typography (and back).
- On phones the spiral runs the full screen height, behind the header and
  footer, with a soft fade so headings stay readable.
- Page titles and descriptions come from one source (`src/router/pageMeta.json`).

### Fixed

- Preview panel no longer shows a scrollbar or translucent half-open state.
- Close requests made during a preview animation are queued, not dropped.

### Removed

- WAAPI preview flight (`useMediaFlight`), the static social preview image, and
  the static `robots.txt` (now generated).

### AI session

Changed: `scripts/{socialMeta.ts,create-social-images.mjs}`, `vite.config.ts`,
`index.html`, `src/router/pageMeta.{json,ts}`, `src/hooks/{useWorkPreview,useDocumentMeta,useDialog}.ts`,
`src/services/visit.service.ts`, `src/ui/components/WorkDialog.tsx`, styles,
`public/` icons and share images, tests, docs.

Reason: The user reported the preview's mid-animation state, asked for a text
and media morph into the preview, a full-bleed mobile spiral, and link previews
that work on every social platform and in ads.

Tests: `npm run check` passed (77 unit tests). `npm run test:e2e` passed 64,
8 skipped on mobile, including crawler-style requests for per-route share tags
and images, and campaign links. Morph frames reviewed in Chromium; mobile
spiral reviewed in WebKit (iPhone 13).

## [0.4.0] — 2026-10-06

### Added

- Menu hover effect inspired by list-style project indexes, drawn in the site's
  own language: the hovered row opens a square Cashmere Beige panel (like the
  link cards), a 4:5 section preview slides in (like the work cards), the title
  shifts, and an eyebrow tag (“Meet the studio ↗”) follows the cursor. Keyboard
  focus shows the same panel. Timing uses the shared reveal/ease tokens.
- Page transitions: the old page lifts and fades (View Transitions API) while the
  header stays put; the new page fades in. Browsers without View Transitions get
  the fade-in only. The menu keeps its own morph.
- Scroll reveal: page intros, section heads, cards, lists, placeholders, Works
  gallery items, and the footer rise into place as they enter the viewport.
- Work previews: the tapped card's media flies into the preview and flies back
  into the card on close, with a fading backdrop and panel.

### Changed

- Studio name is “The Minimalist — Design Studio” everywhere (logo, titles,
  meta, footer, menu, About, share image). Page titles use the page name.
- Router moved to `createBrowserRouter` + `RouterProvider` so links can use view
  transitions; router errors render the studio error page.
- Skip link reads “Skip to main content” now that it serves every page.
- Section tabs use the square radius token instead of pills.

### Fixed

- The spiral now resumes when a work preview closes. Only Tab navigation (not a
  click or programmatic focus) holds and foregrounds a study.
- Loader shine: the sweep now starts after the bloom in both intro lengths, and
  the loader waits for one full sweep before opening; glow strengthened.

### Performance

- Full loader intro plays once per session; repeat loads use a brief intro
  (≈2s faster to interactive in testing).
- Inner page chunks prefetch when idle; navigation no longer waits or shows a
  fallback.
- Menu WebGL is prepared when idle instead of at startup; the loader releases
  its WebGL context after exiting.
- Spiral skips unchanged z-index writes; shared status, index formatting, and
  e2e helpers remove duplication; unused CSS removed.

### AI session

Changed: `src/hooks/{usePointerCue,useIntro,useMenuMorph,useLoaderScene,useSpiralLoop,useHeroWorks}.ts`,
`src/repositories/visit.repository.ts`, `src/services/visit.service.ts`,
`src/router/pageModules.ts`, `src/constants/{menu,motion}.ts`, `src/utils/{idle,format}.ts`,
`src/ui/components/{StudioMenu,CollectionStatus,PageLoader}.tsx`, `src/App.tsx`,
styles, tests, docs.

Reason: The user asked for the grigoletti.ch project-list hover effect (in the
site's design language), an optimization pass, the correct studio name, page
transitions and scroll reveals, a preview media flight, the spiral to resume
after a preview, and the loader shine back.

Tests: `npm run check` passed (69 unit tests, build, version, media audit).
`npm run test:e2e` passed 54 tests, 3 skipped for mobile (keyboard, wheel,
hover), including preview flight + spiral resume, scroll reveal, and axe after
reveal. Hover, shine, flight, and page-transition frames reviewed in Chromium.

## [0.3.0] — 2026-10-06

### Added

- Site structure from the project brief: Works, About, Founders, Testimonials,
  Products (Software solutions, Website templates, Hardware products), Contact,
  and Inquiries (General, Quote, Appointment), each with temporary content.
- Fixed site header with the lotus logo and primary links (Works, Studio,
  Products, Contact); it gains a background once the page scrolls.
- Site menu rebuilt as a full site map with sub-page links and current-page state.
- Footer sitemap, breadcrumbs, and section tabs on sub-pages; page titles per route.
- Shared page blocks: intro, section, link cards, checklist, placeholder.

### Changed

- Spiral ↔ gallery switching keeps the same card, image, and video elements, so
  nothing reloads mid-flight; heading, statement, and footer now glide instead
  of fading out and back in. Slightly longer, softer easing.
- Header logo uses the lotus mark from the brand board.
- Route changes scroll to the top and move focus to the new page's main content.
- Menu no longer switches collection views (the hero controls do).

### AI session

Changed: `src/router/`, `src/ui/layouts/`, `src/ui/pages/`, `src/ui/sections/Page/`,
`src/ui/sections/Hero/{Hero,WorkCollection}.tsx`, `src/ui/components/{SiteHeader,SiteFooter,StudioMenu,StudioLogo,Icon}.tsx`,
`src/hooks/{useSiteMenu,useRouteFocus,useScrolledPast,useDocumentTitle,useSpiralLoop,useCollectionMorph}.ts`,
`src/constants/pages.ts`, styles, tests, docs.

Reason: The user asked for a smoother spiral ↔ grid transition and a clear,
on-brand place for every page in their task list (with temporary content), so
visitors can navigate easily.

Tests: `npm run check` passed (67 unit tests, build, version, media audit).
`npm run test:e2e` passed 43 tests, 2 skipped for mobile (keyboard, wheel),
including footer-sitemap traversal, menu navigation focus, tabs/breadcrumbs,
and axe checks on new pages. Pages and transitions reviewed at desktop and phone
widths.

## [0.2.0] — 2026-10-06

### Added

- WebGL page loader: the lotus mark and “EST. 2020” bloom from the base of the
  flower, shimmer while the page loads, then open onto the hero with an organic
  reveal. A static SVG version covers reduced motion and missing WebGL.
- Boot splash in `index.html`, so the loader colour shows before JavaScript runs.
- WebGL morph for the studio menu: an organic shape grows from the menu button and
  fills the screen, then contracts back on close. Falls back to a CSS clip-path.
- Mouse-wheel steering for the spiral: scrolling boosts its speed, and the scroll
  direction sets its spin direction, easing back to cruising speed.
- Spiral ↔ gallery transition: each card flies from its current position, scale,
  and tilt into the other layout, staggered, while the clipping window grows or
  shrinks with it. Headings, statement, footer, and captions fade into place.

### Changed

- The app shell is inert until the page is ready and eases into place on reveal.
- Menu content waits for the morph to cover the screen; Escape plays the close
  animation before focus returns to the menu button.
- Reduced motion also zeroes animation and transition delays.
- Lotus mark redrawn from the clearer reference: two mirrored strokes that cross
  under the bud, rounded tips, bowl-shaped side petals; softer loader glow.
- Release notes and AI session logs now share this file; the root changelog is gone.

### AI session

Changed: `src/constants/`, `src/shaders/`, `src/utils/{spiral,webgl,easing,lotusArtwork}.ts`,
`src/hooks/{useSpiralLoop,usePageReady,useLoaderScene,useMenuMorph,useCollectionMorph}.ts`,
`src/utils/collectionMorph.ts`,
`src/ui/components/{PageLoader,LotusMark,StudioMenu}.tsx`, `src/App.tsx`, styles,
`index.html`, unit and browser tests, version tooling, docs.

Reason: The user asked for wheel-driven spiral speed and direction, a morphing
menu, an animated WebGL loader based on their lotus “EST. 2020” artwork, a
faithful redraw of that mark, and animated spiral ↔ gallery switching.

Tests: `npm run check` passed (64 unit tests, build, version, media audit).
`npm run test:e2e` passed 31 tests, 2 skipped for mobile (keyboard, wheel).
WebGL renders in Chromium and WebKit; loader, menu, and view-switch frames were
reviewed at desktop and phone widths; the mark was compared against the reference.

## [0.1.0] — 2026-10-06

### Added

- Phase 1 editorial landing page with a continuous spatial selected-work loop.
- Six labeled concept studies alternating images and silent video.
- Gallery, accessible project previews, menu, pause control, and 404 route.
- Reduced-motion gallery, keyboard navigation, focus restoration, media fallbacks.
- Strict React/TypeScript/Vite foundation and repository → service → hooks → UI.
- Local responsive AVIF/WebP images, WebM/MP4 loops, self-hosted fonts, media scripts.
- Unit/component/browser tests, accessibility scans, CI, and version checks.
- `.agent` AI context, engineering documentation, and source briefs.

### Performance

- One transform-only animation loop with no per-frame React state updates.
- Observer-controlled video playback, hidden-tab suspension, and asset budgets.

### AI session

Changed: configuration, `src/`, `scripts/`, `e2e/`, `.github/`, `.agent/`, `docs/`,
and README.

Reason: Implement the two master briefs and the requested documentation, AI logs,
and versioned code while retaining Phase 1 scope.

Tests: Final validation was in progress at handoff.
