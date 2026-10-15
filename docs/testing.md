# Testing

`npm run check` runs formatting, lint, types, unit/component tests, production
build, version alignment, and media audit. FFmpeg/ffprobe are needed for the audit.
Run `npm run test:e2e` after interaction or layout changes.

## Coverage boundaries

Editable site content is checked by `siteContent.service.test.ts`: product status,
four-stage drawing alignment, inquiry kind completeness/uniqueness, blank copy,
empty options, and isolated snapshots. Existing repository tests validate local
work media and featured/full collections after the JSON extraction. UI JSON imports
are blocked by lint. `npm run check` also builds shared metadata from `src/data/`;
`npm run deploy:check` verifies the emitted route shells and asset references.

- Service detail content: complete distinct narratives, malformed/empty content,
  isolated snapshots, complete/unique software platform ids, local media validation, cancellation,
  and repository errors. Browser tests cover all five platform choices, responsive preview
  switching, inquiry/cross-service routes, aligned branding drawers, accessibility,
  reduced motion, and page containment across Chromium and desktop/mobile WebKit.
  Drawers are checked for running open/close motion, equal card heights, rapid
  switching, and keyboard interaction. The CSS time utility covers source and
  minified units (`600ms` / `.6s`). Each page’s illustration is checked for actual motion, manual pause/resume,
  hidden-tab suspension, and offscreen suspension. Static reviews cover
  320/768/1440 px and all five device drawings in Chromium and WebKit.
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
- Appointment controls: native radio arrow-key selection, date validation focus,
  calendar arrows/month navigation, disabled past dates, selection persistence,
  Escape/outside dismissal, modal fallback focus trapping, calendar accessibility,
  and narrow-screen bounds. Calendar service tests cover leap years and month ends.
- Loader/audio: fixed progress totals, required initial-route mounting, downloaded
  and decoded samples, shared preparation, alternate-format fallback, retryable
  failures, and pending audio/page modules beyond the visual readiness timeout.
- Floating contact: composited RGB/hex/transparent backgrounds, forest/ivory
  switching while scrolling and navigating, a persistent contrast edge, keyboard
  focus colours, and the existing Contact destination.
- Navigation: cold route modules retain the current page, scroll/focus reset
  before paint, no route snapshots, and stable fixed-header entry geometry.
- Contact animation: inquiry label clicks open the envelope without requiring
  radio focus; persistent stamp nodes tween/settle across all inquiry types.
  Reduced motion retains visible static symbols. The ambient engine keeps one
  default graph while page feedback scenes change.

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
