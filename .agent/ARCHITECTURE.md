# Architecture at a glance

UI → hooks → services → repositories. Static presentation is the exception.

- Content: local media and replaceable concept data.
- Studio details: `src/constants/founders.json`, `contact.json`, and `social.json`
  feed page content and build-time structured data. Social channels use `primary`
  to select the main tiles; `ContactChannels` owns the remaining channels' disclosure.
- Overview pages: `PageOverview`, `PageDirectory`, `EditorialSection`, and
  `EditorialList` compose Studio.
- Contact: `InquiryForm` → `useInquiryForm` → `inquiry.service`; one page with a
  mail-app hand-off. `CONTACT_LINKS` replace the old inquiry routes, which redirect.
  The static build preserves their HTML shells. `useCopyText` reports clipboard
  failure; the form exposes manual-copy text. Resize animations cancel/re-measure
  on interruption. Envelope CSS pauses via hook-managed visibility/entry/motion.
  Explicit interaction state drives flap/letter opening; `useEnvelopeMotion`
  animates persistent SVG attributes on inquiry changes with a finite 30 fps loop.
- Products: `ProductPanels` + `useProductPanels` with `productArt` drawings that
  assemble into solid objects when opened; templates flow `templates.json` →
  `templates.service` → `useTemplates` → `TemplateCatalog`.
- Studio: `StudioPortals` uses unique visual artwork; presentational `StudioApproach` follows. Works posters use
  `useHeroWorks` → service → repository;
  portraits reuse shared founder constants. Source CSS is imported by the composed
  sections; production styles share the HTML-linked bundle. `useStudioSprig` owns
  visible-only native wind animation and an interaction-only spring/doodle loop
  for the lotus ornament. Motion stops offscreen, hidden, or under reduced motion.
- Services: `ServiceProcess` → `useServiceProcess` (cycle, selection, pause,
  focus/visibility) and `useServiceDrawing` (WebGL timing/lifecycle). Pure stroke
  geometry and trace scheduling live in `serviceDrawing`; `serviceScene` reuses the
  tesseract line shaders.
  Idle drawing runs at 20 fps; transition drawing is capped at 30 fps. Static SVG
  uses the same geometry under reduced motion or unavailable/lost WebGL.
  The current label/caption floats within the drawing panel. The header/footer
  bars are removed; the illustration supports click/tap and arrow-key browsing.
  Triangulated faint faces render with their strokes in WebGL, sharing each part's
  idle pose. SVG faces supply the static fallback. Offscreen/hidden scenes stop.
  `ServiceDirectory` pairs each service with a local stock image from
  `SERVICE_IMAGES`; it makes no commissioned-work claims.
- Founders: shared studio constants; `useFounderShowcase` owns timed selection,
  the WAAPI name marquee, and pause/visibility/reduced-motion lifecycle.
  `useFounderDepth` coalesces pointer input for portrait perspective and lift.
- Repository: cancellable unknown-data boundary, isolated snapshots.
- Service: field validation, local media/posters, identity uniqueness, filtering/order.
- Hooks: data state, preferences, visibility, playback, dialogs.
- Spiral: pure normalized math + one RAF; wrapping outside the clip; no per-frame
  React state; mobile geometry; keyboard foregrounding/pause.
- Motion control: `useSpiralLoop` eases pause/resume over `MOTION.motionDuration`
  and cancels frames at rest. A separate `frozen` flag stops inspection, previews,
  and view switches immediately; overlapping footer labels preserve layout width.
- Wheel: passive listener boosts spiral velocity; scroll direction sets spin.
- View switch: one `WorkCollection` keeps the same card elements in both views;
  `useCollectionMorph` flies them with WAAPI (spiral paused, clip animated) and
  glides the heading, statement, and footer.
- Loader/menu: hooks own WebGL scenes (`src/shaders/`), with SVG/CSS fallbacks.
  Menu GL is prepared when idle; full intro once per session (visit service).
- Menu hover: beige panel + 4:5 preview + `usePointerCue` eyebrow tag (fine pointers),
  styled with the site's radius, colour, and timing tokens.
- Pages: `src/router/pageModules.ts` lazy-loads and sequentially idle-prefetches page
  chunks after entry, skipping reported data-saving/2G connections.
- Startup: readiness waits for DOM/initial route/fonts/visible images and all
  downloaded/decoded audio. Initial route mounting is required; font/image
  readiness may use the 8 s cap. Audio failure
  exposes retry while the page stays inert. Videos do not gate entry. Audio shares
  one offline decoder, caches successful samples, and defers playback to a gesture.
  Finite loader motion uses wall-clock time. Fullscreen WebGL caps
  DPR at 1.5 and the long edge at 2048 px (Works has its own 1800 px cap).
- Hosting: static Vite output in `dist`, Node 24, `build:hostinger`/`deploy:check`;
  per-route HTML and assets are verified without a persistent server.
  Production CSS is extracted into one HTML-linked stylesheet (`cssCodeSplit: false`);
  route JavaScript remains lazy. This avoids delayed/unapplied route CSS on the
  deployed Works page. Source CSS stays scoped in its existing modules.
- Transitions: data router resolves lazy route modules before committing;
  `PageLink` uses ordinary navigation. A keyed ivory overlay reveals live content
  without fading/scaling scene ancestors or taking route snapshots. Scroll/focus
  reset in a layout effect; `useScrollReveal` watches `[data-reveal]`.
- Previews: `useWorkPreview` morphs card ↔ dialog with View Transitions.
- Works: the existing work repository → validation service → `useHeroWorks` feeds
  `WorkExplorer`. `useWorkHover` owns preview intent; `useTesseract` owns rotation,
  easing, momentum, the entrance trace, the front-most focus, and the GPU lifecycle.
  `useParticlePreview` hands studies off (disperse, then assemble) and then shows
  native image/video. `useWorksView` switches views in a view transition.
  `useAppEntered` holds the trace until the loader reveals the page. Pure geometry,
  trace, and placement live in utils; GLSL lives in `src/shaders/`.
- Sound scenes: `useSoundScene` changes interaction feedback only. A single
  shared warm ambient graph persists across routes, including Works. It uses
  crossfaded harmonies and soft key tones; no page-specific music/audio heartbeat.
- Sound: `soundEngine` (Web Audio, samples + synthesis + ambient) driven by
  `useSound`/`useInteractionSounds`; preference via repository → service.
- Sharing: `src/router/pageMeta.json` → runtime titles (`useDocumentMeta`) and
  build-time per-route HTML (`scripts/socialMeta.ts`); images via `media:social`.
- Reduced motion: normal scrolling gallery, posters, no automatic video, static loader.
- UI: composed components, native buttons/dialogs, centralized design tokens.
- Routes: `SiteLayout` (header, menu, route focus) wraps every page; `PageLayout`
  adds main + footer for inner pages. Home is eager; other pages are lazy.
- Navigation: `src/router/navigation.ts` is the single source for header, menu,
  footer, tabs, and tests.

No global store, animation dependency, runtime API, hotlinks, or secrets.
See `DECISIONS.md` and `docs/architecture.md` for rationale.
