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
changes radius, depth, and rotation; CSS handles other layout differences. Normal
scrolling is never intercepted.

## Media and dialogs

`useMediaPlayback` gates `play()` with intersection, user preference, dialog state,
and page visibility. Autoplay starts imperatively after these checks rather than
through the native autoplay attribute, which could prematurely start media.

Native modal dialogs contain focus and support Escape. `useDialog` restores the
invoker and previous page overflow. Project previews are brief study summaries;
no full project pages are included in Phase 1.

## Future integration

Replace the repository for a CMS while retaining the validated service contract.
Add runtime configuration only when integrations need it. Avoid global state or
another animation engine without a demonstrated requirement. Routing is
centralized; the homepage is eager for LCP and the fallback route is lazy.
