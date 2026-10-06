# Architecture

Selected work is a future CMS-backed feature and follows **UI → hooks → services
→ repositories**. Static presentation labels and tokens remain local constants.

`works.repository.ts` exposes `WorksRepository`, returning unknown data so future
network content cannot bypass validation. The local adapter returns an isolated
snapshot of `works.content.ts`; Vite resolves its local assets. `getHeroWorks`
validates fields, forbids remote media URLs, requires video posters, rejects
duplicate IDs/slugs, filters featured work, and sorts by order with an ID tie-break.
Empty collections are valid.

`useHeroWorks` owns cancellable loading, error, and retry. Invalid entries fail
the collection rather than silently publishing malformed work. Images fall back
to an intentional surface; denied/failed video retains its poster.

## Motion

`getSpiralPosition` maps wrapped normalized progress to horizontal orbit, vertical
travel, perspective-derived scale, and mild rotation. Unique works have evenly
spaced visual offsets. The path wraps beyond the clipping region; content is not
duplicated. A 90-second cycle creates slow exhibition movement.

`useSpiralLoop` updates DOM transforms without React state and measures only when
resized. Pause eases the spiral to rest over `MOTION.motionDuration` before
cancelling frames, and resume eases back up; inspecting, previews, and view
switches freeze it immediately. It also stops while hidden or behind a dialog.
Keyboard-focused work moves to the foreground and holds still. Reduced motion
selects a normal scrolling gallery and prevents video playback. Compact geometry
changes radius, depth, and rotation; CSS handles other layout differences.

Each card's transform starts with `perspective()` (its origin is the stage
centre), not an inherited `perspective` on the stage: Safari flattens inherited
perspective while a view transition snapshots the page. When the window crosses
`COMPACT_QUERY`, `getSpiralBlend` mixes the old and new layouts (stage centre,
card size, depth, rotation) over the collection-morph duration while the spiral
keeps moving. The viewport's clip animates between the old and new regions, and
the registered `--spiral-fade-depth` property transitions the mobile edge fade.

A passive wheel listener steers the moving spiral: each wheel delta adds velocity
(capped), the scroll direction sets the cruise direction, and velocity eases back
to cruising speed. Normal scrolling is never intercepted.

## View switching

`WorkCollection` renders one list for both views, so cards, images, and videos
persist across a switch; only the layout classes change. `useCollectionMorph`
captures each card's pose (`data-work-id`) when the view changes: centre, width, and, for spiral cards, the scale and tilt read from the
spiral transform. After React commits the new view, a layout effect animates
each card from that pose with the Web Animations API (staggered). Gallery cards
settle flat; spiral cards land on their live spiral transform, which stays
paused until the flight ends. Cards leaving the spiral keep its stacking order
and vanishing point until they land. The clip window animates between the spiral
viewport and the full window so cards never cut off abruptly. Each text piece
marked `data-morph-chrome` (title words, controls, statement lines, footer items,
gallery captions) glides and scales from its old box. Long moves dip in opacity,
and pieces that only exist in the new view fade in. The same FLIP runs when the
window crosses the mobile breakpoint, along with gallery cards reflowing.

## Transitions and reveals

`AppRouter` uses `createBrowserRouter` with `RouterProvider` from
`react-router/dom`. `PageLink` (all links except the menu's) sets
`viewTransition`: CSS lifts and fades the old snapshot while the header, which
has its own `view-transition-name`, stays still. `SiteLayout` keys the outlet by
path so every new page fades in, with or without the API. `useScrollReveal`
watches `[data-reveal="item"]` elements and `[data-reveal="stagger"]` groups with
one IntersectionObserver (plus a MutationObserver for new routes) and marks them
`data-revealed`; CSS provides the rise. Reduced motion shows everything at once.

`useWorkPreview` opens and closes `WorkDialog` inside
`document.startViewTransition`. Before the swap it names the card's parts
(`work-card`, `work-media`, `work-title`, `work-tagline`, `work-category`); after
the synchronous swap the same names move to the dialog's parts, so the browser
morphs the box, the media (cropped with `object-fit: cover`), and the type
(cross-faded between fonts). Closing reverses it. Without the API or with
reduced motion the dialog opens instantly. The spiral stays paused while a morph
runs, and requests made mid-morph are queued.

## Sound

`soundEngine` (`src/audio/`) owns one `AudioContext`, created on the first click
or key press (browsers block audio before a gesture). It decodes short samples
(Opus/WebM, MP3 fallback) with slight pitch variation, throttles hover and
detent sounds, and lets only one “transition” sound play per 150 ms so a menu
link does not stack sounds. Synthesized sounds: the spiral whoosh (filtered
noise that follows wheel speed), the preview swell (air sweep plus two soft sine
notes in the ambient key), and the ambient bed (`ambient.ts`: detuned sine chords
through a low-pass and long generated reverb, a slow ocean wash, rare chimes).
The context suspends when sound is off or the tab is hidden.
`useInteractionSounds` adds delegated hover/click listeners and navigation/menu
sounds in `SiteLayout`; `useSpiralLoop` and `useWorkPreview` call the engine
directly. The preference flows `preferences.repository` → `sound.service` →
`useSound` → `SoundToggle`.

## Sharing and metadata

`src/router/pageMeta.json` holds each route's title, description, share image,
and the headline used on that image. `useDocumentMeta` applies the title and
description at runtime. At build time `scripts/socialMeta.ts` writes the head
(title, description, canonical, Open Graph, X card, image size/alt, structured
data on home) into `index.html` and emits per-route HTML (`/about/index.html`
and `/about.html`), `404.html` (noindex), `robots.txt`, and `sitemap.xml`.
`VITE_SITE_URL` supplies the origin for absolute URLs; image URLs carry the
package version so platforms refetch after a release.
`scripts/create-social-images.mjs` renders the 1200×630 share images (content
centered so square crops keep it), app icons, and the web manifest.

## Loader and menu morph

`usePageReady` waits for the window load event, fonts, and a minimum intro (with
a maximum cap). `PageLoader` keeps the app shell `inert` until then.
`useLoaderScene` paints the lotus mark and “EST. 2020” into a texture
(`lotusArtwork.ts`) and renders `src/shaders/loader.ts`: a bloom from the
flower's base, a shimmer while waiting, then an organic opening onto the hero. A
boot splash in `index.html` matches the loader before JavaScript runs.

`usePageLoad` tracks the window load, fonts, every sound file (when sound is
on), and the images and playing videos on screen, reports progress to the
loader's indicator, and resolves after the minimum intro (12 s cap).

`useIntro` asks `visit.service` whether this session has already seen the intro
(`visit.repository` wraps `sessionStorage` and tolerates blocked storage); the
first load gets the full bloom, later loads a brief one.

Menu rows reveal a square Cashmere Beige panel, a 4:5 section preview
(`src/constants/menu.ts`), and a cursor-following eyebrow tag on fine pointers (`usePointerCue`, eased RAF only
while moving). Keyboard focus shows the same panel without the cue. Each row's
link is stretched over the row; sub-links sit above it.

`useMenuMorph` keeps the menu dialog rendered through `opening` → `open` →
`closing` → `closed`, rendering `src/shaders/menuMorph.ts` from the close button's
position. Without WebGL it animates a CSS `clip-path` circle; with reduced motion
the phases switch instantly.

## Media and dialogs

`useMediaPlayback` gates `play()` with intersection, user preference, dialog state,
and page visibility. Autoplay starts imperatively after these checks rather than
through the native autoplay attribute, which could prematurely start media.

Native modal dialogs contain focus and support Escape. `useDialog` restores the
invoker and previous page overflow. Project previews are brief study summaries;
there are no individual project pages yet.

## Site structure and navigation

`src/router/paths.ts` names every route and `src/router/navigation.ts` groups them
(Works, Studio, Products, Contact). The header, menu, footer sitemap, section
tabs, and tests all read that one structure. `SiteLayout` owns the fixed header,
the site menu (state shared with the hero through `SiteMenuContext` so media
pauses while it is open), and route focus: on navigation the page scrolls to the
top and `#main-content` receives focus. `PageLayout` adds the main landmark and
footer for inner pages. Inner pages are lazy-loaded and composed from small
`src/ui/sections/Page/` blocks. Their copy is static presentation content; move
it behind a repository when a CMS arrives.

## Future integration

Replace the repository for a CMS while retaining the validated service contract.
Add runtime configuration only when integrations need it. Avoid global state or
another animation engine without a demonstrated requirement. Routing is
centralized; the homepage is eager for LCP and the fallback route is lazy.

## Immersive Works

`works.repository` → `works.service` → `useHeroWorks` → `WorkExplorer` supplies the
same validated, ordered collection used on Home. No rendering component imports
repository content. `useWorkHover` coordinates hover, keyboard focus, tap, Escape,
and the short pointer gap between a point and its preview.

`useTesseract` owns the canvas lifecycle, input capture, easing, observers, page
visibility, and requestAnimationFrame. `utils/tesseract.ts` projects the 16-vertex,
32-edge hypercube through a fixed 4D perspective (`toSolid`, computed once, so the
shape never deforms) and a 3D rotation. `tesseractScene` batches the 32 edges and
12 faces into one draw call. Nodes use the same projection for DOM hit targets.
Context loss shows a static SVG, and restoration rebuilds resources.

Motion: the cruise factor eases between 0 and 1 over `holdDuration` whenever a
study is pinned, the control has keyboard focus, or the sculpture is paused. A
drag records its velocity, and on release that momentum decays
(`flingDecay`) into the cruise. Arrow keys, Home/Reset, and "bring to front"
(`getFrontAngles`) run eased glides. The frame loop stops once everything is at
rest.

Entrance: after `useAppEntered` (the loader revealing the page, or any later
navigation), `reveal` runs over `traceDuration`. `getTraceSchedule` staggers the
outer cube, the edges reaching inward, and the inner cube. Faces fade in last,
and `data-traced` reveals the points and the first preview.

Focus: each frame, `pickFront` takes the point nearest the viewer, with a margin so
the focus does not flicker. When `getFocusPlacement` finds room beside the
sculpture, the focused study is shown there automatically; otherwise only the
`FocusStepper` names it. The stepper's arrows glide the neighbouring study to the
front, so the control keeps its size for any collection.

`useParticlePreview` owns poster decoding, placement, GPU cleanup, and the
assembly/dispersal timeline. When the requested study changes, the shown one
disperses into its own point before the next assembles from its point. A reusable
canvas draws 5,120 particles on narrow screens or 11,520 on desktop from a 480px
WebP texture. Once assembled, native responsive images or the visibility-aware
video component take over, so settled previews need no particle frames. Failed
textures or contexts fall back to native media.

Spatial ↔ gallery switches run in a view transition (`useWorksView`). The root
crossfades while `works-title` and `works-toggle` glide; without the API, the new
presentation fades in. Both use the ivory canvas.

Sound: `useSoundScene('works')` crossfades the ambient bed to `AMBIENT_WORKS`.
While it is active, `soundEngine` answers hover, click, and switch with
synthesized glass tones, and adds per-point notes (`note`), assembly sparkle
(`shimmer`), and `grab`/`fling` gestures through a shared short reverb.

Offscreen or hidden scenes, and scenes behind menus or dialogs, stop scheduling
frames. Input uses pointer capture with `pan-y`, so touch scrolling remains
available. Reduced motion defaults to the normal gallery. All geometry, shaders,
and CSS arrive with the lazy Works route.

Implementation references: [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
and [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
