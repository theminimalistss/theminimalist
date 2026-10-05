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
- Transform-only continuous movement; no scroll interception or animation library.

Targets: Lighthouse performance 90+, accessibility/best practices/SEO 95+.
Measure the production build with representative mobile throttling and autoplay.
Record actual results separately from targets. Fixed media ratios prevent layout
shift. INP and real-device frame pacing need post-deployment field measurement.
