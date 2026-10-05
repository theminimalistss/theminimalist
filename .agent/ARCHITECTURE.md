# Architecture at a glance

UI → hooks → services → repositories. Static presentation is the exception.

- Content: local media and replaceable concept data.
- Repository: cancellable unknown-data boundary, isolated snapshots.
- Service: field validation, local media/posters, identity uniqueness, filtering/order.
- Hooks: data state, preferences, visibility, playback, dialogs.
- Spiral: pure normalized math + one RAF; wrapping outside the clip; no per-frame
  React state; mobile geometry; keyboard foregrounding/pause.
- Wheel: passive listener boosts spiral velocity; scroll direction sets spin.
- View switch: `useCollectionMorph` snapshots card poses, then WAAPI flies them
  into the new layout while the spiral is paused and the clip animates.
- Loader/menu: hooks own WebGL scenes (`src/shaders/`), with SVG/CSS fallbacks.
- Reduced motion: normal scrolling gallery, posters, no automatic video, static loader.
- UI: composed components, native buttons/dialogs, centralized design tokens.
- Routes: eager homepage, lazy 404; no later site pages.

No global store, animation dependency, runtime API, hotlinks, or secrets.
See `DECISIONS.md` and `docs/architecture.md` for rationale.
