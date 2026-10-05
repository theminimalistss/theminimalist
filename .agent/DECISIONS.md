# Architecture decisions

## 2026-10-06 — Native spatial animation

Decision: One RAF loop, normalized math, CSS transforms, ResizeObserver.

Reason: Continuous depth/wrapping needs no timeline library.

Impact: No animation dependency or per-frame React renders; testable geometry,
clean suspension for paused/hidden states.

## 2026-10-06 — Compatible current toolchain

Decision: Stable pinned dependencies and TypeScript 6.0.3.

Reason: TypeScript 7.0.2 is outside typescript-eslint 8.71.0's supported
`>=4.8.4 <6.1.0` range. Do not force unsupported peer dependencies.

Impact: Upgrade compiler and parser together when support arrives.

## 2026-10-06 — Concept collection and local media

Decision: Six labeled concepts with licensed, optimized, locally stored Pexels media.

Reason: No approved portfolio assets were supplied; the brief permits placeholders
and forbids hotlinking/false client claims.

Impact: Replace content in one module; source provenance and regeneration are documented.

## 2026-10-06 — Accessible alternate presentation

Decision: Gallery/pause controls, reduced-motion gallery, keyboard foregrounding,
and native dialogs with focus restoration.

Reason: Reading and discovery cannot require chasing moving content.

Impact: Every study remains usable with keyboard, reduced motion, or denied autoplay.

## 2026-10-06 — Validated boundary and version history

Decision: Unknown repository data validated in a React-independent service;
Semantic Versioning from 0.1.0, separate release and AI-session logs.

Reason: Future CMS replacement and efficient developer/AI handoff.

Impact: Tested data contract and automated version consistency checking.

## 2026-10-06 — Raw WebGL for brand moments

Decision: Loader and menu morph use small fullscreen WebGL 1 shaders driven by
hooks; no Three.js or animation library.

Reason: Two single-quad effects do not justify a dependency; WebGL 1 has the
widest support.

Impact: Each effect has a static/CSS fallback for reduced motion, missing WebGL,
or context loss. Colors come from CSS tokens at runtime.

## 2026-10-06 — Wheel steers, never intercepts

Decision: A passive window wheel listener adds velocity to the spiral and sets its
cruise direction; it never calls `preventDefault`.

Reason: Users asked for scroll-driven speed/direction; page scrolling and
accessibility (pause, reduced motion) must keep working.

Impact: Steering only runs while the spiral is moving; pause stops it.

## 2026-10-06 — Single changelog in `.agent`

Decision: `.agent/CHANGELOG.md` holds release notes and AI session logs; the root
`CHANGELOG.md` was removed. `npm run version:check` reads the `.agent` file.

Reason: User direction — the changelog belongs with the AI handoff records.

## 2026-10-06 — View switching flies cards with the Web Animations API

Decision: Before a view change, read each card's on-screen pose; after React
commits the new view, animate each card from that pose with `element.animate`.
The spiral pauses until the flight lands, and the clip region animates with it.

Reason: The spiral and gallery are different DOM trees; a pose snapshot bridges
them without a layout library, and WAAPI avoids per-frame React work.

Impact: Spiral cards keep their scale and tilt into the flight; reversing
mid-flight starts from the in-flight position. Reduced motion never switches views.

## 2026-10-06 — One navigation structure, layout routes

Decision: `src/router/navigation.ts` defines four groups (Works, Studio, Products,
Contact) used by the header, menu, footer, tabs, and tests. `SiteLayout` and
`PageLayout` are React Router layout routes; menu open state is shared through a
small context.

Reason: Eight requested pages (two with sub-pages) need one predictable map;
grouping keeps the header to four links.

Impact: Adding a page means adding a route and a navigation entry. Inner pages
are lazy. Placeholder copy stays in UI constants until a CMS exists.

## 2026-10-06 — Persistent cards across collection views

Decision: Replace separate spiral and gallery trees with one `WorkCollection`
whose list items change layout class; the spiral loop clears its transforms
when disabled.

Reason: Remounting reloaded images and videos mid-transition and caused flashes.

Impact: Switching is continuous; the spiral header links stay hidden over the
moving spiral (desktop) and appear in gallery view and on other pages.
