# Current project state

PROJECT: The Minimalist — independent design studio website
VERSION: 0.2.0
STATUS: Phase 1 implemented with WebGL loader, menu morph, wheel steering, view morph
CURRENT TASK: Review 0.2.0 motion work.

## Completed

- Strict React/TypeScript/Vite; repository → service → hooks → UI.
- Six local licensed concepts, responsive images, silent loops/posters, media scripts.
- Spatial hero, gallery, menu, concept previews, and fallback route.
- Pause/reduced-motion support, keyboard foregrounding, native dialogs.
- Unit/browser tests, CI, tokens, source briefs, docs, and handoff records.
- 0.2.0: WebGL lotus loader with boot splash, WebGL menu morph, wheel-steered spiral,
  animated spiral ↔ gallery switching.

## Known issues / limits

- Concepts and provisional copy need approved replacements before launch.
- The header still uses the provisional leaf mark; the loader uses the lotus mark.
- WebGL frames were reviewed in headless Chromium/WebKit only; check real devices.
- No production domain, actual client work, contact integration, or later pages yet.
- TypeScript stays at 6.0.3 pending parser support for 7.x.

## Important files

`src/repositories/works.content.ts`, `src/services/works.service.ts`,
`src/hooks/useSpiralLoop.ts`, `src/hooks/useLoaderScene.ts`,
`src/hooks/useMenuMorph.ts`, `src/hooks/useCollectionMorph.ts`, `src/shaders/`,
`src/constants/brand.ts`,
`src/ui/sections/Hero/Hero.tsx`, `src/ui/styles/`, `docs/media-sources.md`.

NEXT RECOMMENDED TASK: Decide whether the lotus mark replaces the header leaf mark.
