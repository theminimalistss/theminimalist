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
- WebGL effects draw one fullscreen triangle, cap pixel ratio at 2, and run only
  while the loader is shown or the menu is morphing.
- View switches use compositor-friendly WAAPI transform animations; the spiral's
  RAF loop pauses during the flight.

## Sound

- Eight samples total about 16 KB per format; they are fetched while the
  loader shows (so the site is ready to sound) and decoded after the first
  gesture. Ambient and synthesized sounds download
  nothing. The audio context suspends when sound is off or the page is hidden.

## Startup and navigation

- The full loader intro (1.8s minimum, 1.5s bloom) plays once per browser
  session; later loads use a brief intro (0.65s minimum, 0.45s bloom). Reduced
  motion uses a 0.4s static loader.
- The menu's WebGL context and shader are prepared in an idle callback (or on
  first open), not during startup. The loader releases its WebGL context after
  it exits.
- Inner pages are separate chunks (about 0.5–1.5 KB each) prefetched in an idle
  callback, so navigation does not wait on the network or show a fallback.
- The spiral skips unchanged `z-index` writes; the menu cursor cue animates only
  while it is catching up to the pointer.
- Main bundle is about 99 KB gzip, mostly React DOM (~200 KB minified) and React
  Router (~36 KB); application code is about 45 KB minified.

Measured on the production build in headless Chromium with software WebGL:
first load to interactive ≈ 4.2s, same-session reload ≈ 2.2s, 0 chunk requests
and no fallback when navigating after idle. Real devices with GPU are faster.

Targets: Lighthouse performance 90+, accessibility/best practices/SEO 95+.
Measure the production build with representative mobile throttling and autoplay.
Record actual results separately from targets. Fixed media ratios prevent layout
shift. INP and real-device frame pacing need post-deployment field measurement.
