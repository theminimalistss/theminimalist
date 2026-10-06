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

## 2026-10-06 — Session-aware intro and idle work

Decision: The full loader intro plays once per session (a `sessionStorage` flag
behind `visit.repository` and `visit.service`); later loads get a brief intro.
Non-critical work (menu WebGL setup, page chunk prefetch) runs in idle callbacks.

Reason: The brand intro should not tax every reload; startup should only do what
the first frame needs.

Impact: Repeat loads are about 2s faster in testing; navigation is instant after
idle. Blocked storage falls back to the full intro.

## 2026-10-06 — Data router for view transitions

Decision: Use `createBrowserRouter` + `RouterProvider` (react-router/dom) and a
`PageLink` that sets `viewTransition`. CSS animates only the old snapshot; the
new page uses its own enter and scroll-reveal animations.

Reason: React Router runs View Transitions only in data mode; animating the new
page with CSS keeps one entrance style whether or not the API exists.

Impact: All links except the menu (which has its own morph) transition. The
fixed header has its own view-transition name so it stays still.

## 2026-10-06 — Tab modality holds the spiral

Decision: Only Tab navigation (tracked by `useKeyboardModality`) holds and
foregrounds a spiral study; pointer input clears it.

Reason: WebKit treats programmatic focus as `:focus-visible`, so restoring focus
after a preview kept the spiral paused for mouse and touch users.

Impact: Keyboard users keep the accessible hold; everyone else sees motion
resume when a preview closes.

## 2026-10-06 — Build-time share HTML for every route

Decision: A Vite plugin (`scripts/socialMeta.ts`) writes the head tags for each
route from `src/router/pageMeta.json` into `<route>/index.html` and
`<route>.html`, plus `404.html`, `robots.txt`, and a sitemap.

Reason: Social and ad crawlers do not run JavaScript; a single SPA shell would
preview every link as the home page.

Impact: `VITE_SITE_URL` must be set for absolute URLs. Adding a route means
adding a `pageMeta.json` entry (a unit test enforces it) and re-running
`npm run media:social`.

## 2026-10-06 — Preview morph with View Transitions

Decision: `useWorkPreview` names the card's parts and the dialog's parts only
during a `document.startViewTransition` and swaps the dialog synchronously.

Reason: A real shared-element morph (box, media, and type) is not practical
with hand-built FLIP across fonts; the browser cross-fades text natively.

Impact: Browsers without the API (or reduced motion) open instantly. The spiral
stays paused while a morph runs so the card lands where it left.

## 2026-10-06 — Sound: CC0 samples plus synthesis, on by default

Decision: Short interface sounds are CC0 Kenney samples processed by
`npm run media:audio`; the spiral whoosh, preview swell, and ambient bed are
synthesized with Web Audio. Sound is on by default, starts only after the first
user gesture, and is controlled by a remembered header toggle.

Reason: Licensed, tiny, reproducible assets; synthesis follows speed and key,
never loops audibly, and costs no download. A visible control satisfies audio
control expectations (WCAG 1.4.2).

Impact: All playback goes through `soundEngine`; UI uses `useSound`. Elements
with `data-sound="off"` skip the generic click.

## 2026-10-06 — Explicit browser targets

Decision: Build for Chrome/Edge 90, Firefox 90, and Safari 15 with CSS fallbacks
and runtime guards; test Chromium, WebKit (desktop and mobile), and Firefox (CI).

Reason: Visitors arrive from many browsers and in-app web views.

Impact: Avoid APIs newer than these targets without a fallback.

## 2026-10-06 — Founders shown as equal partners

Decision: Both founders carry the title “Founding partner”, identical card
treatment, and are listed alphabetically by surname. Names and roles live in
`src/constants/founders.json`, shared by the page and the structured data.

Reason: The studio is a partnership; order and labels must not imply seniority.

Impact: Add future partners to the JSON (and a portrait via
`npm run media:founders`); keep alphabetical order.

## 2026-10-06 — Contact data and social hierarchy in shared JSON

Decision: `src/constants/social.json` (with a `primary` flag) and
`src/constants/contact.json` feed both the Contact page and the build-time
structured data.

Reason: Facebook, Instagram, and LinkedIn are the main channels; the rest stay
one click away. One source keeps the page and search metadata in step.

Impact: Promote or demote a channel by flipping `primary`; update contact
details in one file.

## 2026-10-06 — Separate motion easing from interaction freezes

Decision: `useSpiralLoop` eases pause/resume over `MOTION.motionDuration`, while
the separate `frozen` input stops movement for inspection, previews, and view
switches. Both footer labels share a grid cell to keep the control's width stable.

Reason: The motion control should settle smoothly without shifting the footer;
preview and collection transitions need stationary cards.

Impact: Keep browser timing in the hook and tune the duration in `motion.ts`.
Wheel impulses are ignored while paused or frozen, and the frame loop stops at rest.

## 2026-10-06 — Spiral perspective in each card's transform

Decision: Spiral cards carry `perspective(MOTION.perspective)` at the start of their own
transform. The stage no longer sets `perspective`. Breakpoint changes blend
between two spiral layouts in `useSpiralLoop` rather than re-running the effect.

Reason: Safari drops inherited perspective while a view transition snapshots
the page, so cards flattened when a preview opened. Re-running the loop on a
breakpoint change snapped every card.

Impact: Keyframes that move a spiral card (`getSpiralKeyframes`,
`getGalleryKeyframes`) must start with the same `perspective()` so transforms
interpolate per function. Text that should morph needs its own transformable
element (`.morph-word`) and a unique `data-morph-chrome` key.

## 2026-10-07 — Works sculpture on ivory, with automatic focus

Decision: Native WebGL 1 draws a rigid projected hypercube (16 vertices, 32 edges,
12 translucent faces) in forest ink on the ivory canvas, with a separate textured
point-cloud preview. Project media and selection stay in semantic DOM controls,
and the canvas is decorative to assistive technology. The point nearest the
viewer is the focus: it is shown in a fixed slot on wide screens and named in a
single-study stepper everywhere. Hover, focus, and tap override it.

Reason: The forest field set Works apart from every other page, clashed with the
green studies, and forced a colour flip on the gallery switch. Ivory keeps one
palette across the site. The animated 4D fold read as the shape deforming, and the
corner cells as clutter. A title row cannot grow with the collection, but a
stepper and the gallery can.

Impact: No new runtime dependencies or media. GPU math lives in utils and
shaders; input, easing, loading, playback, and lifecycle live in hooks. Frames run
at display rate only while moving, tracing, or easing, and stop at rest; back
buffers are capped at 1.5× DPR and 1800 px. Only the shown poster is uploaded for
particles; native image or video takes over once assembled. The sculpture waits
for the loader (`useAppEntered`) before tracing in. Pages may switch the sound
scene with `useSoundScene`; the Works palette is synthesized, so it adds no audio
files.

## 2026-10-07 — One heartbeat clock; particles carried through view transitions

Decision: Beats fall on multiples of `HEARTBEAT.period` since page load. The music
schedules on that grid, and the visual heart aligns its CSS animation to it with
`--beat-delay`. Spatial ↔ gallery particles draw on a fixed overlay canvas. That
canvas and the sculpture canvas carry their own view-transition names with no
animation, so they stay live above the crossfade. Breakpoint jumps are detected
as movement larger than the resize itself and glided (`useLayoutGlide`).

Reason: A shared clock keeps sound and picture together without coupling the audio
engine to the UI. Live named layers let the particles and the un-drawing play
through a view transition. Detecting jumps covers every breakpoint without listing
them.

Impact: Keep beat timing in `HEARTBEAT`; adjust the music in `AMBIENT_WORKS.pulse`.
Elements that should glide on reflow need `data-glide` and no CSS transform of
their own. Only floating previews get the surface panel; docked ones caption
directly on the page, like the gallery.
