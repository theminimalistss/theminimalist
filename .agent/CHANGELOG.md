# Changelog

The single changelog for releases and AI implementation sessions. Versions follow
Semantic Versioning (`docs/versioning.md`). Dates use Asia/Manila.

## [Unreleased]

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
