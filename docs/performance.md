# Performance

One RAF loop updates transforms without React rendering per frame. Geometry is
measured only initially or on resize. Hidden pages/open dialogs stop animation.

Images have 480px/960px AVIF/WebP variants and explicit 4:5 dimensions. Only the
opening foreground image gets high priority. Videos use `preload="none"`, local
posters, and intersection-gated playback. Browsers fetch a supported format,
not every variant. No remote hotlinks or audio tracks. Latin fonts are local.

Budgets enforced by `npm run media:audit`:

- Image derivative: at most 200,000 bytes.
- Video format: at most 1,250,000 bytes.
- Videos: 576×720, 24 fps, approximately 8 seconds, no audio.
- Transform-only continuous movement; passive wheel steering, no animation library.
- Loader/menu WebGL uses one fullscreen triangle, caps pixel ratio at 1.5 and
  the long buffer edge at 2048 px, and only runs while needed. Works caps its
  buffer at 1800 px; Services caps transition rendering at 30 fps and idle at 20.
- View switches use compositor-friendly WAAPI transform animations; the spiral's
  RAF loop pauses during the flight.

## Sound

- Eight samples total about 16 KB per format; optional fetching does not block
  entry and decoding happens after the first
  gesture. Ambient and synthesized sounds download
  nothing. The audio context suspends when sound is off or the page is hidden.

## Startup and navigation

- The full loader intro (1.8s minimum, 1.5s bloom) plays once per browser
  session; later loads use a brief intro (0.65s minimum, 0.45s bloom). Reduced
  motion uses a 0.4s static loader.
- The menu's WebGL context and shader are prepared in an idle callback (or on
  first open), not during startup. The loader releases its WebGL context after
  it exits.
- Inner pages are lazy chunks prefetched sequentially after entry in idle
  callbacks. Reported data-saving/2G connections skip this optional prefetch.
- The spiral skips unchanged `z-index` writes; the menu cursor cue animates only
  while it is catching up to the pointer.
- Production CSS is HTML-linked in one bundle; route JavaScript stays lazy.
  This removes the late route stylesheet dependency observed on Hostinger.
- Contact artwork uses native SVG/CSS; its idle motion stops before entry,
  offscreen, in hidden tabs, and under reduced motion. Form resizing only runs
  on structural changes, cancels interrupted animation, and uses no RAF loop.

Earlier headless Chromium measurements with software WebGL were approximately
4.2s for first entry and 2.2s for same-session reload. They are historical local
observations, not current Lighthouse scores or real-device guarantees. Release
verification and asset audit results live in `.agent/PROJECT_STATE.md`.

Targets: Lighthouse performance 90+, accessibility/best practices/SEO 95+.
Measure the production build with representative mobile throttling and autoplay.
Record actual results separately from targets. Fixed media ratios prevent layout
shift. INP and real-device frame pacing need post-deployment field measurement.
