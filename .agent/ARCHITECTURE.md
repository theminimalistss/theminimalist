# Architecture at a glance

UI → hooks → services → repositories. Static presentation is the exception.

- Content: local media and replaceable concept data.
- Repository: cancellable unknown-data boundary, isolated snapshots.
- Service: field validation, local media/posters, identity uniqueness, filtering/order.
- Hooks: data state, preferences, visibility, playback, dialogs.
- Spiral: pure normalized math + one RAF; wrapping outside the clip; no per-frame
  React state; mobile geometry; keyboard foregrounding/pause.
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
