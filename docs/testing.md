# Testing

`npm run check` runs formatting, lint, types, unit/component tests, production
build, version alignment, and media audit. FFmpeg/ffprobe are needed for the audit.
Run `npm run test:e2e` after interaction or layout changes.

## Coverage boundaries

- Repository: valid collection, isolated snapshots, cancellation.
- Service: unknown input, media types, text, local URLs, posters, dimensions/flags,
  duplicate identity, empty data, featured selection, ordering, failures.
- Hooks: loading/success/error/retry, abort, visible/offscreen playback,
  autoplay denial, observer cleanup.
- Spatial math: depth, periodicity, compact geometry, finite values, and recycling
  entirely outside the clipping region.
- UI: meaningful names, metadata, selection, failed-image fallback.
- Templates: known layouts, page counts, required content, duplicate identities,
  and category derivation through the repository/service boundary.
- Browser: production page, console errors, motion/pause, menu, dialogs/focus,
  keyboard foregrounding, live reduced-motion changes, overflow, 404, axe scans.
- Products: expanding panels on hover/focus, keyboard navigation, two-step touch
  navigation, accessibility, template filtering, and category availability labels.
- Contact: kind-specific fields and validation, legacy route HTML/redirects,
  missing/denied/successful clipboard access, manual copying, interrupted resizing,
  reduced motion, and collapsed channel tab order without native `inert`.

Playwright runs Chromium desktop, WebKit desktop, and WebKit mobile against a
production build; CI adds Firefox (set `E2E_FIREFOX=1` to include it locally).
Install browsers with `npx playwright install chromium firefox webkit`; add
`--with-deps` on Linux. Browser tests also cover link-preview HTML fetched
without JavaScript, campaign links, real sound playback (Chromium), and the
remembered sound toggle. Failures retain screenshots and traces in ignored output folders.

Use `E2E_PORT=4210 npm run test:e2e` when the default port is occupied. Each port
uses an isolated production build in `.cache/e2e/<port>` and separate reports in
`test-results/<port>` and `playwright-report/<port>`.

Browser syntax targets are separate from verified support. See
[browser support](browser-support.md); local Firefox cannot currently launch on
this macOS version and remains enabled in the Linux CI matrix.

## Visual and performance review

Inspect desktop, tablet, narrow mobile, gallery, menu, and project preview after
fonts/media settle. Inspect the loop at several phases; avoid screenshot tests
tied to a moving frame. Local review screenshots go in ignored `artifacts/`.

`npm run test:coverage` reports services, hooks, and math. Coverage supports
review rather than replacing behavior tests or real-device measurement.
