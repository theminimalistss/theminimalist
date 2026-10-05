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
resized. It cancels frames while paused, hidden, inspecting, or behind a dialog.
Keyboard-focused work moves to the foreground and holds still. Reduced motion
selects a normal scrolling gallery and prevents video playback. Compact geometry
changes radius, depth, and rotation; CSS handles other layout differences.

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
paused until the flight ends. The clip window animates between the spiral
viewport and the full window so cards never cut off abruptly. The heading,
statement, and footer (`data-morph-chrome`) glide from their old position with
a soft opacity dip instead of fading out and in.

## Loader and menu morph

`usePageReady` waits for the window load event, fonts, and a minimum intro (with
a maximum cap). `PageLoader` keeps the app shell `inert` until then.
`useLoaderScene` paints the lotus mark and “EST. 2020” into a texture
(`lotusArtwork.ts`) and renders `src/shaders/loader.ts`: a bloom from the
flower's base, a shimmer while waiting, then an organic opening onto the hero. A
boot splash in `index.html` matches the loader before JavaScript runs.

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
