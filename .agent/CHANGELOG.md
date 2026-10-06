# Changelog

The single changelog for releases and AI implementation sessions. Versions follow
Semantic Versioning (`docs/versioning.md`). Dates use Asia/Manila.

## [Unreleased]

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
