# Architecture at a glance

UI → hooks → services → repositories. Static presentation is the exception.

- Content: local media and replaceable concept data.
- Studio details: `src/constants/founders.json`, `contact.json`, and `social.json`
  feed page content and build-time structured data. Social channels use `primary`
  to select the main tiles; `SocialLinks` owns the remaining channels' disclosure.
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
- Pages: `src/router/pageModules.ts` lazy-loads and idle-prefetches page chunks.
- Transitions: data router + `PageLink` (view transitions), keyed route fade,
  `useScrollReveal` (one IntersectionObserver for `[data-reveal]`).
- Previews: `useWorkPreview` morphs card ↔ dialog with View Transitions.
- Works: the existing work repository → validation service → `useHeroWorks` feeds
  `WorkExplorer`. `useWorkHover` owns preview intent; `useTesseract` owns rotation,
  easing, momentum, the entrance trace, the front-most focus, and the GPU lifecycle.
  `useParticlePreview` hands studies off (disperse, then assemble) and then shows
  native image/video. `useWorksView` switches views in a view transition.
  `useAppEntered` holds the trace until the loader reveals the page. Pure geometry,
  trace, and placement live in utils; GLSL lives in `src/shaders/`.
- Sound scenes: `useSoundScene` swaps the ambient preset; Works synthesizes glass
  feedback in `soundEngine` with no extra audio files.
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
