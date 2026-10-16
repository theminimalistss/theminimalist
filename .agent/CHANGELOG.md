# Changelog

The single changelog for releases and AI implementation sessions. Versions follow
Semantic Versioning (`docs/versioning.md`). Dates use Asia/Manila.

## [0.29.0] — 2026-10-16

### Changed

- Software Solutions has an interactive illustrative workspace with organisation,
  connection, and insight views, plus a forest product-philosophy section.
- Website Templates has a switchable paper layout study, an editorial two-column
  collection, and a concise customisation sequence. Existing filtering/inquiries remain.
- Hardware Products has an original layered object study with animated assembly,
  component selection/captions, and compact purpose/material/experience notes.
- Product narratives live in central JSON through repository → service → hooks → UI.
  Validation requires complete unique illustration choices and complete copy.
  Template filter state/rules move to a hook and pure service.
- Services and Products share native illustration playback lifecycle: entry,
  visibility, intersection, manual pause, and reduced motion. Coming-soon and
  provisional catalog notices remain explicit; no purchase or shipping is implied.

### AI session

Changed: product content/contracts/repository/validation/loading and preview hooks,
three compositions, scoped styles, shared native motion hook, template filtering,
catalog status wording, metadata, domain/browser checks, and documentation.

Reason: Extend the distinct visual approach from Services to the three product
portals while retaining the studio design language, concise copy, and architecture.

Verification: `npm run check` passed with 179 tests, formatting, lint, strict types,
production build, version alignment, and media audit. Deployment audit verified
14 routes, three aliases, 404, and 126 asset references. Focused production browser
runs verified 48 passing cases across Chromium and desktop/mobile WebKit, plus
three expected hover/touch skips. Initial contrast failures were corrected and
passed in the 18-case regression run, which also covered Services playback and
navigation. Eighteen visual/accessibility cases at 320/768/1440 px in both engines
found no overflow or axe violations. Product module: 8.43 KB gzip; shared CSS:
29.45 KB gzip; media unchanged at 10.96 MiB. No new media, dependency, runtime
content request, or hosting publication. Nine additional focused browser checks
passed after aligning the connection-diagram labels within the SVG. Package/lockfile,
README, state, and release records are aligned at 0.29.0.

## [0.28.0] — 2026-10-16

### Changed

- Application JSON is consolidated in `src/data/`, with a file index and editing
  guidance. Works metadata, product descriptions, process captions, inquiry
  choices, overview introductions, and Studio copy now live beside the existing
  service, testimonial, template, and public studio data.
- Editable copy follows repository → service → hook → UI; the service checks
  availability, inquiry kinds, process length, and nonempty copy. Media imports,
  routes, animation settings, and outcome-specific control messages remain code.
  Sharing, artwork, and deployment scripts use the same central source files.
- Service pages are shorter and more visual, with roughly half the copy. Software
  covers web, mobile, desktop, APIs, and embedded systems through five selectable
  original SVG drawings and captions, capability symbols, and a forest system panel.
- Websites pairs a responsive browser illustration with symbolic chapters and a
  launch timeline. Branding uses a floating original identity board, a process strip,
  six aligned paired cards with shared animated detail panels, and a brand guide. No fabricated client work.
- Brand disclosure cards now stay aligned while a full-width panel opens below
  each pair. Height animation handles opening, closing, rapid switches, and resizing;
  symbols trace on interaction. Source and minified CSS time units are normalised
  so deployed animations retain their duration.
- Floating Contact switches between forest and ivory against the underlying CSS
  surface. Focus/pulse colours adapt too; a two-tone edge preserves its silhouette
  over images/boundaries. Measurements are event-driven and suspend in hidden tabs.
- Traced drawings, drifting layers, paper/browser motion, symbols, and content
  reveals animate each composition. `useServiceMotion` owns visibility/entry/
  intersection/pause/reduced-motion lifecycle; CSS owns playback. Each page has
  a pause control. Software directory/sharing descriptions reflect all platforms.

### AI session

Changed: central data directory, site content contracts/repository/service/hook,
content extraction, build-script paths, UI import guard, content docs and checks;
service content/types/repository/validation/hook, three page compositions,
five-platform drawings/symbols, manual preview state, motion lifecycle, shared
animated brand drawers, CSS time normalisation, adaptive Contact contrast, scoped styles,
explicit service route mapping, domain/browser
checks, and architecture documentation. Existing palette, type, icons, overview
process, and optimised media remain authoritative.

Reason: Give the three offerings distinct narratives and visual structures, and
make editable application content discoverable in one folder while preserving
architecture and browser/performance safeguards.

Verification: 27 service/Contact browser cases verified across Chromium and
desktop/mobile WebKit: 24 passed, three drawer timing failures corrected and passed
on rerun. Covers five platforms, device preview, aligned/animated/interruptible
brand drawers, keyboard interaction, accessibility/reduced motion, illustration
play/pause and visibility, and adaptive Contact/focus/navigation. Nine existing
navigation/overview/accessibility cases also passed. All layouts and open drawer
rows reviewed at 320/768/1440 px in both engines: no overflow, paired cards aligned.
The production timing issue (600ms minified to .6s) has a unit regression.
`npm run check` passed with 170 unit tests, strict types, lint, formatting, production
build, version alignment, and media audit. Deployment audit passed: 14 routes,
three aliases, 404, 126 asset references. Lazy service module: 10.13 KB gzip; shared
CSS: 25.99 KB gzip; media unchanged at 10.96 MiB.
No new runtime dependency, media, content request, or hosting publication.
Package/lockfile, README, state, and release records are aligned at 0.28.0.

## [0.27.1] — 2026-10-16

### Changed

- Deployment docs describe the current setup: two Hostinger websites, a website
  built locally with `.env.production.local` (`VITE_SITE_URL`,
  `VITE_CONTACT_ENDPOINT`), and the PHP mail service uploaded from `dist-api/` with
  its `.env` above `public_html`.
- Browser tests build with `VITE_SITE_URL` and `VITE_CONTACT_ENDPOINT` emptied, so
  local production settings never send test messages to the live mail service.

### AI session

Changed: `playwright.config.ts` build environment, `docs/deployment.md`,
`server/README.md`, `.env.example`, and release records.

Reason: The user's website runs on Business Web Hosting (no host-side build), so
public build values must come from a local, git-ignored production env file.

Verification: the local production build embedded the endpoint and the canonical
URL, and `deploy:check` passed. Contact and link-preview browser tests (17) passed
with an endpoint-free test build. `npm run check` and `npm run test:php` passed.

## [0.27.0] — 2026-10-16

### Added

- `server/`: a dependency-free PHP 8.1+ MVC service that delivers Contact messages
  through Brevo's transactional API. The studio receives each message with
  Reply-To set to the visitor; the visitor receives a branded confirmation.
  It checks origin, JSON body size, a hidden spam trap, the same field rules as
  the website, and a per-IP rate limit, then logs Brevo failures without
  exposing them.
- Email designs live in separate `.html` templates (plus plain-text versions)
  using the site's palette, Inter Tight with Instrument Serif accents, the lotus
  logo (`public/email/lotus.png`, `npm run media:email-logo`), and the wordmark.
- Settings come from `.env`, read from the service folder or up to two folders
  above it (the root `.env` locally; beside `public_html` on a host, so redeploys
  keep it). Host variables take precedence. `server/README.md` covers Brevo,
  Hostinger, and GoDaddy setup.
- `npm run build:api` writes `dist-api/`, the service's runtime files for upload to
  a separate PHP subdomain, without tests or secrets.
- Contact sends directly when `VITE_CONTACT_ENDPOINT` is set at build time. The
  form shows sending, sent, failed, and too-many-attempts states, maps server
  field errors, and offers the email app or copying after a failure. Without the
  variable, the email-app hand-off is unchanged.

### AI session

Changed: new `server/` (front controller, controller, models, views, services,
config, tests), inquiry repository/service/hook/form states, envelope status
selectors, email logo script, `build-api` script, npm scripts (`api:dev`, `build:api`,
`test:php`, `media:email-logo`), CI PHP tests, env examples, Prettier ignores, and docs.

Reason: The user asked for MVC PHP email delivery through Brevo with designed
HTML email templates showing the logo, configured by `.env` for Hostinger or
GoDaddy hosting.

Verification: `npm run check` passed with 150 unit tests, lint, strict types,
formatting, production build, version alignment, and unchanged media budgets;
`deploy:check` passed and ships `dist/email/lotus.png`. `npm run test:php` passed 16
PHP tests (validation, `.env` parsing, escaping, template paths, Brevo payload and
errors, rate limiting, controller responses, CORS). Contact browser suite: 36
passed across Chromium and desktop/mobile WebKit (`--workers=1`). Emails were
rendered and reviewed at desktop and mobile widths. Running the Vite dev server
against `php -S` reached Brevo, which refused the key for an unrecognised IP; the
form showed the failure fallback, and a stubbed `202` showed the sent state. No real
email was delivered and nothing was deployed.

## [0.26.2] — 2026-10-15

### Fixed

- Text arrows across page actions, portfolio cards/previews, Contact sending,
  and founder/testimonial navigation now use shared SVGs. Testimonial rating
  stars also use vectors. Symbols keep their ink colour and shape on mobile
  without relying on emoji/font fallback; existing motion targets are preserved.
- Shared inline sizing follows each control's type size. Decorative symbols stay
  out of the accessibility tree and legacy SVG focus order; text labels remain.

### AI session

Changed: shared directional/star paths, inline/rating layout, text-icon consumers,
hover selectors, and browser guidance. No runtime dependency or media added.

Reason: Keep the screenshot's plain diagonal arrow and the rest of the interface
consistent across mobile and desktop devices.

Verification: `npm run check` passed with 145 unit tests, lint, strict types,
formatting, production build, version alignment, and unchanged 10.96 MiB media.
Focused production browser suite: 29 passed, one configured mobile-hover skip
across Chromium and desktop/mobile WebKit. Covers page accessibility, founder
arrows, work selection/previews, testimonial dialogs/ratings, products, Contact,
and the 404 return. The desktop/mobile audit checked 11 representative routes:
no remaining icon text, horizontal overflow, or geometry changes under forced
emoji fonts. WebKit hover checks confirmed Contact's (3, -3) px arrow travel and
the study stepper's -2 px travel. Deployment audit passed for 14 routes, three
aliases, the 404 fallback, and 126 asset references. No hosting deployment;
Release records aligned at 0.26.2.

## [0.26.1] — 2026-10-15

### Changed

- Meeting choices are full-width paired cards with original line icons, brief
  descriptions, native radio keyboard behavior, and explicit selection marks.
- Preferred date opens an ivory calendar with a serif month heading, forest
  selection, today marker, clear month navigation, and responsive positioning.
  Past dates remain disabled; the selected date is preserved across opening.
  Arrow/Page/Home/End keys, Escape, outside dismissal, and focus return work with
  native dialogs and the older-browser fallback. Reduced motion stays static.

### AI session

Changed: Contact appointment layout, meeting cards, shared vector icons,
`InquiryDatePicker` → `useDatePicker` → pure calendar service, validation focus,
and service/browser regression checks. No dependency or media added.

Reason: Replace cramped options and inconsistent browser date popups with the
studio's existing palette, typography, and accessible interaction patterns.
The preferred date remains an inquiry detail; selecting it does not book a meeting.

Verification: `npm run check` passed (145 unit tests, formatting, lint, strict
types, production build, version alignment, and unchanged 10.96 MiB media).
Deployment audit passed for 14 routes, three aliases, the 404 fallback, and 126
asset references. All 36 Contact browser checks verified across Chromium and
desktop/mobile WebKit: 32 passed in the final serial run; four existing
loading/clipboard/envelope timing failures passed on isolated rerun. Long local
host/startup stalls also affected earlier runs; no loader timeout was relaxed.
All six new calendar/control checks passed, including an axe calendar scan and
native-dialog fallback. Visual checks at 320/390/768/1440 px found no overflow in
either engine. Prepared as 0.26.1; no hosting deployment performed.

## [0.26.0] — 2026-10-15

### Changed

- A softer shared ambient: warm sustained harmonies, quiet air, and sparse
  felt-key tones. Chords crossfade without pitch slides; the background continues
  uninterrupted through Works and every other page. Removed the separate Works
  music and audio heartbeat scheduler; the visual heart remains.

### Fixed

- Page entry keeps fixed headers and live 3D/WebGL layers steady. Removed the
  startup shell scale and overlapping route snapshot/wrapper fades; ordinary
  navigation uses a short ivory reveal over untransformed live content.
- Route modules resolve before navigation commits, retaining the previous page
  during cold loads. Scroll and focus reset before the destination paints.
- The loader includes all eight audio samples in progress and waits for downloads
  and decoding before exiting. Its visual readiness timeout cannot bypass audio.
  Failed formats fall back to the alternate; failed samples expose Retry audio
  while the page stays inert. Successful samples remain cached on retry.
- Audio prepares in one offline decoder; playback/ambient creation still waits
  for a user gesture. Videos remain optional and can show their local posters.
- Loader progress uses a fixed task total, avoiding an early 100% reading while
  new media/audio tasks are still pending. Initial lazy-page mounting is tracked.
  The loader also waits through a slow initial route load instead of revealing
  an empty shell at its visual timeout; route errors retain a focusable main.
- Contact's envelope opens on actual form interaction, including Safari inquiry
  label clicks that leave focus outside the form. A finite native SVG tween rocks
  the envelope and stamps the new symbol on persistent nodes. It stops when
  hidden/offscreen or under reduced motion; rapid changes cancel the old tween.

### AI session

Changed: audio preparation/cache/timeouts, loader readiness/progress/retry UI,
startup/route presentation, route-level module loading, pre-paint scroll/focus,
shared ambient synthesis, envelope interaction/tween, unit/browser regressions,
and current engineering/handoff records.

Reason: Safari entry combined fixed-header transforms with moving scene snapshots;
its inquiry-label clicks also changed the radio without focusing the form. The
requested direction requires stable page/envelope motion, audio-completion loading,
and one soothing background across all pages. Interaction state now gives each
engine the same envelope behavior without forcing pointer focus. Existing in-page
previews and spatial/gallery morphs retain their transitions. No dependency or
runtime media added.

Verification: `npm run check` passed (142 unit tests, formatting, lint, strict
types, build, version alignment, and media audit). `deploy:check` verified 14
routes, three legacy aliases, the 404 fallback, and 126 asset references. Final
production browser suite: 210 passed, 18 platform/visibility skips across Chromium
and desktop/mobile WebKit; one skip was a random Testimonials arrangement with
no unobscured far frame. Tests cover slow audio/initial modules beyond the visual
timeout, audio retry, fixed-header geometry, cold navigation, inquiry-label
interaction, persistent SVG tweening, reduced motion, and existing scene effects.
The ambient continuity test confirms one graph across page scenes; a 14 s offline
preview had peak 0.0244 and RMS 0.00593 without clipping. Shared CSS: 20.51 KB
gzip; media remains 10.96 MiB. Firefox remains Linux-CI-only on this host.
No hosting publication performed.

## [0.25.0] — 2026-10-14

### Changed

- Contact is one straightforward page: the intro, direct details (email with a
  copy button, hours, replies), and compact social channels sit beside a single
  form that switches between Say hello, Request a quote, and Book a meeting,
  showing only the fields each needs. Sending validates the form and opens the
  visitor's email app with the message composed, with a copy fallback.
- The form resizes smoothly between options. An envelope illustration opens as
  you start, lifts its letter as the message grows, stamps a symbol for each
  option, and folds into a paper plane that flies off when sent. The selected
  option fills with a sweep, and fields stagger in.
- The General inquiry, Request a quote, and Book an appointment sub-pages are
  gone; every quote and appointment link opens Contact with that option chosen,
  and old `/inquiries/*` links redirect there. The menu's Contact group no longer
  lists sub-pages, and the footer column is now Contact.
- Colour consistency: the form card, contact and product materials, and error
  text use palette tokens only; small labels meet contrast on every background.

### Fixed

- The Contact page fills the viewport, so no blank band sits above the footer.
- The More social channels match the main tiles in layout and hover, and open
  smoothly below them instead of stretching sideways.
- Missing or denied clipboard access now exposes the composed message for manual
  copying and gives direct email copying an explicit failure message.
- Rapid form changes resize from the current pose to the natural final height;
  previous animations are cancelled and cleaned up. Envelope motion pauses before
  entry, offscreen, in hidden tabs, and under reduced motion.
- Contact selection and keyboard focus no longer require `:has()`. Collapsed
  social links leave the tab order and accessibility tree even without `inert`.
  Contact/Products have fallback colours and viewport sizing for older engines.
- Legacy inquiry URLs retain generated Contact HTML shells on static hosts.
  Appointment validation rejects malformed and impossible calendar dates.

### AI session

Changed: `ContactPage`, new `InquiryForm`, `ContactDirect`, `ContactChannels`,
and `ContactEnvelope`; `useInquiryForm`, `useCopyText`, and `inquiry.service`
with tests; contact links and legacy redirects in the router; footer, menu, and
page links; share metadata; `contact.css`, `pages.css`, and `products.css`
colour tokens; browser tests.
Release review adds clipboard/resize/visibility fallbacks, date validation,
legacy HTML generation/audit, and browser support documentation.

Reason: The user asked for one straightforward contact page without sub-pages,
with smooth resizing, a better envelope animation, consistent colours, no blank
band, and a fixed More reveal for the social channels.

Verification: `npm run check` passed (136 unit tests, formatting, lint, strict
types, production build, version consistency, and media audit). `deploy:check`
verified 14 current routes, three legacy aliases, the 404 fallback, and 126 asset
references. Full production browser suite: 190 passed, 17 configured skips across
desktop Chromium and desktop/mobile WebKit. Contact was checked at 320, 390,
768, and 1440 px in both engines with no horizontal overflow and confirmed
offscreen motion suspension. Shared CSS is 20.51 KB gzip; local media remains
10.96 MiB. Firefox's local binary cannot launch on this macOS version; the Linux
CI project remains enabled. No hosting publication performed.

## [0.24.0] — 2026-10-14

### Changed

- Products opens with three numbered panels in place of the directory and the
  catalog section. Hovering or focusing a panel expands it in forest green and
  assembles its isometric x-ray drawing into a solid, textured object part by
  part, like a transformer (panes swing in, modules slot into the page, the
  speaker telescopes up and its cap spins down). On touch, the first tap opens a
  panel and the second follows it.
- Software solutions and Hardware products are marked coming soon; Website
  templates is available and lists a filterable grid of templates with schematic
  layout previews (provisional entries until real templates are supplied).

### Fixed

- The Products page no longer leaves a blank band above the footer on tall
  screens; the overview fills the viewport.
- The Founders pause test waits for the name track to settle before comparing.

### AI session

Changed: Products overview and category pages, layered isometric SVG artwork,
panel interaction hook, template repository and validation service, loading hook,
filterable catalog, browser/unit coverage, and release documentation.

Reason: Release the accumulated Products redesign with the existing palette,
typography, native motion, and repository → service → hook → UI data flow.
No new runtime dependency or media; six catalog entries remain provisional.

Verification: `npm run check` passed (132 unit tests, formatting, lint, strict
types, production build, version consistency, and media audit). `deploy:check`
verified 17 routes, the 404 fallback, and 126 asset references. Full production
browser suite: 169 passed, 17 configured skips across Chromium and desktop/mobile
WebKit, including panel hover/focus, keyboard/touch navigation, template filters,
accessibility, and existing Works/Services/Founders/Testimonials regressions.
Hosting publication remains pending.

## [0.23.0] — 2026-10-14

### Changed

- Branding identity lists a sixth item: add-on applications, from business cards
  to menus and brochures.
- The Services process drawing now shares the Works tesseract's line style:
  crisp lines with a soft glow drawn by the same shaders, three weights (edges,
  lighter details, and dashed trails like the tesseract's tethers), and faint
  tinted faces in place of opaque fills. Stages un-trace and re-trace stroke by
  stroke instead of flying as dots, and the faces fade out and back in with them.
  The SVG fallback uses the same weights.
- Once a Services drawing is complete it keeps a motion of its own: the speech
  bubbles bob in turn, the gem tilts while the pencil sketches and the orbit
  turns, the top cube lifts off the stack and settles, and the paper plane drifts
  and banks. Dashed trails flow and small marks breathe. Faces now render in
  WebGL with their strokes, so they move together.
- The Listen sound waves pass behind the speech bubbles for depth, in WebGL and
  in the SVG fallback.
- Clicking the drawing advances it without pausing the automatic cycle; hovering
  (until you click) and keyboard focus still hold a stage for reading.
- The stage label sits at the drawing's top-right, close to it, and the
  description is centred below the drawing.
- Choose a service shows its own professional images: code on a MacBook at a
  bright minimal desk for Software development, a hand sketching website
  wireframes on a tablet for Website development, and colour swatches with
  identity sketches for Branding identity (local Unsplash stock, natural colour,
  4:3), replacing the borrowed Works posters.

### Added

- A fourteenth testimonial, from Giovanni Yu of Cebu Social Club (5/5), word for
  word, with a local stock video (a hand holding a glass in window light) that
  keeps the image/video rhythm of the field.

### AI session

Changed: `serviceDrawing` (stroke tones, parts, poses, triangulation,
occlusion), `serviceScene` (tesseract line shaders, WebGL faces, idle motion),
`useServiceDrawing`, `ServiceProcess`, `services.css`, `SERVICE_IMAGES` and the
media manifest `aspect` option, `ServiceDirectory`, Branding copy, testimonial
data and media, tests, and records.

Reason: The user asked for the tesseract line style in the Services drawing, idle
motion unique to each drawing, a closer label and lower description, clicks that
keep the cycle running, depth for the Listen sound waves, professional service
images, a Branding add-ons item, and a new testimonial.

Verification: `npm run check` passed (130 unit tests, build, version, and media
audit); `npm run test:e2e`: 160 passed, 14 configured skips across desktop
Chromium, desktop WebKit, and mobile WebKit. Stages, transitions, idle motion,
occlusion, fallback, and the service directory were reviewed in screenshots.

## [0.22.0] — 2026-10-14

### Changed

- Services now pairs the existing intro with a looping process on the right:
  Listen, Shape, Build, and Launch. Original conversation, identity, construction,
  and launch symbols assemble and morph in WebGL with one animated description.
- Stage names and descriptions are floating annotations around the illustration,
  replacing Volume's top tabs and the fixed description row. They drift gently
  and fade in with each new symbol. The requested heading/navigation/pause bars
  are removed; the drawing itself accepts tap/click and keyboard stage navigation.
- Improved illustration depth with matte gradient planes, shaded facets, extruded
  conversation panels, a raised construction plinth, and soft ground shadows.
  Faces assemble with native CSS below the existing bounded GL stroke morph.
- Keyboard/pointer stage selection, hover/focus holding, hidden/offscreen
  suspension, and a static SVG alternative for reduced motion or unavailable/lost
  WebGL. Transitions use 2,048 points, a 30 fps cap, and no steady-state RAF.
- Choose a service moves below the introduction/process, with three larger local
  AVIF/WebP image links replacing the Build/Create/Shape word tiles.
- Production CSS is emitted as one HTML-linked file while route JS stays lazy.
  This avoids the route stylesheet dependency that failed to apply on Hostinger
  Works. Source styles remain scoped; no new runtime dependency or media.

### AI session

Reference: inspected the local `templates/volume-studio` project and its live
process section at port 5174. Retained the staged visual narrative, then designed
new symbols and motion for The Minimalist's palette and typography.
The user's refinement moves the current label and description into the artwork's
space, retaining fine wireframe styling without the reference's top label strip.

Changed: Services composition, process UI/hooks, pure stroke sampling/GPU scene,
GLSL, service image directory, production CSS extraction, interaction/build checks,
and version/handoff docs. Existing staged testimonial/content/media changes were
preserved separately.

Deployment finding: the live `/works/` route downloaded its stylesheet successfully,
but the browser exposed zero CSS rules and an unstyled layout. Refetching the
stylesheet with a cache-busting URL restored it. Bundling CSS into the HTML-linked
asset removes that lazy stylesheet dependency. The underlying CDN/cache cause
was not established; the fix still requires a new deployment.

Verification: `npm run check` passed with 126 unit tests, strict types, lint,
format, production build, version consistency, and the local media audit.
`deploy:check` verified 17 routes plus 404 and 126 asset references; the shared
stylesheet is 17.35 KB gzip. Final Services browser suite: 15 passed across
Chromium and desktop/mobile WebKit, including actual WebGL, looping, selection,
pause/offscreen holding, images/navigation, accessibility, reduced motion,
missing/lost WebGL, and HTML-linked CSS. Works: all 28 applicable regression
checks passed (2 configured mobile skips). Shared Home/Studio/Testimonials checks:
15 passed. Reviewed 320/390/1024/1440 px layouts without overflow. The new build
has not been published to Hostinger; redeployment is required for the live fix.

## [0.21.0] — 2026-10-13

### Changed

- Services, Products, and Contact share Studio's opening directory and forest
  editorial layout, with the existing routes, content hierarchy, and palette.
- Replaced the simple sprig with a layered lotus, curved stem, and veined leaves.
  Native wind animation pauses offscreen; hover/tap gives a springy doodle response.
- Entry no longer waits for optional audio/video. The loader uses wall-clock
  timing; fullscreen WebGL caps its buffer; sequential prefetch follows entry
  and skips reported data-saving/2G connections.
- Added Node 24 configuration, `build:hostinger`, a generated-route/asset audit,
  and Hostinger static frontend deployment instructions.
- Browser tests build and report in per-port directories to avoid shared artifacts.

### Fixed

- A dimmed testimonial no longer intercepts clicks on the focused frame in Safari.
- Touch release keeps the flower's doodle highlight until its tap response settles.

### AI session

Changed: shared overview/editorial sections, three overview pages, native lotus
artwork/motion, loader and prefetch lifecycles, WebGL budgets, deployment output
audit, browser checks, and version/handoff documentation.
The far-frame browser check waits for entrance/pause settling and selects an
unobscured frame instead of sampling a covered or moving bounding box.

Reason: Continue the user's flower/Hostinger work and apply the Studio layout
consistently to Services, Products, and Contact without new runtime dependencies.

Verification: `npm run check` passed (123 unit tests, strict types, lint, format,
production build, version consistency, and media audit). `build:hostinger` passed
under Node 24.21.0; the output audit verified 17 routes plus 404 and 126 entry
asset references. Reviewed desktop/tablet/phone layouts down to 320 px with no
overflow or flower/text overlap.

The isolated full browser suite produced 144 passes, 14 skips, and one far-frame
test failure. Its frame selection was corrected; follow-up checks also found and
fixed Safari click interception and touch-highlight cleanup. Final overview,
flower, and startup checks passed all 12 cases across Chromium and desktop/mobile
WebKit. Final Testimonials regression passed 16 with 2 skips (mobile hover and an
arrangement with no unobscured far frame); the far-frame click passed on both
desktop browsers in the focused fix run. Local checks do not constitute a live
Hostinger deployment. A final WebKit far-frame repeat passed all three runs.
User authorized updating the records/version, then committing
and pushing the accumulated changes to `main`; no hosting publication requested.

## [0.20.0] — 2026-10-13

### Changed

- Studio destinations appear in the opening screen: a compact visual directory
  beside the intro on desktop, and one row of three visual links below it on
  phones/tablets. The heading, font pairing, and intro copy retain their treatment.
- Refined the lower overview with a forest-green studio ethos panel, an editorial
  point of view, a two-column Clarity/Warmth/Character/Care layout, and a Services link.
- Three visual portals lead to Founders, Testimonials, and Works. The founder
  preview uses both real portraits at equal size; Testimonials uses typographic
  artwork; Works previews local posters and describes them as concept studies.
- Responsive layouts, subtle matching hover/focus emphasis, and existing scroll
  reveal and route transitions. Portal media is lazy-loaded and responsive;
  video previews use posters without playback.
- The ethos panel's sprig sways gently in the wind and reacts to mouse movement
  with a springy bend, leaf flutter, and a lightly redrawn stroke. Clicking or
  tapping nudges it. Motion pauses offscreen/when hidden and respects reduced motion.

### AI session

Changed: `AboutPage`, `StudioApproach`, `StudioPortals`, route-specific
`studio.css`, `StudioSprig`/`useStudioSprig`, unused essence styles, navigation
checks, and version/handoff records.

Reason: The user approved the Studio opening and requested a stronger layout for
the remaining overview, making it a portal to Founders, Testimonials, and Works.
The user then requested immediate visibility, so all three destinations moved
into the first screen, ahead of the studio narrative.
The point-of-view section was then tightened around a typographic ethos panel
and numbered principles in response to the user's layout review.

Verification: `npm run check` passed (122 unit tests, production build, formatting,
lint, type checking, version consistency, and local media audit). Isolated Studio
browser checks passed: 9 across Chromium and desktop/mobile WebKit, covering
first-screen visibility and navigation, wind/hover motion, offscreen suspension,
reduced motion, and accessibility. Reviewed desktop/tablet/phone layouts, including
320 px, with no horizontal overflow, plus the hover frame.

The full suite was attempted (118 passed, 14 skipped, 18 failed), but concurrent
browser runs shared reports/server files and caused trace-file collisions and
timeouts. That run is inconclusive; Studio checks were repeated with isolated
outputs and one worker against the development server.

## [0.19.0] — 2026-10-13

### Added

- Testimonials Spatial and Gallery views, like Works.
  - Gallery lays all 13 frames out in a scrollable grid (two columns on phones),
    with the intro as a full-width bar above it; every frame still opens the
    reading panel.
  - Switching flies each frame from where it is to its new place, in a short
    stagger, in both directions; the floor, echoes, and backdrop fade back in on
    return to Spatial.
  - The intro card resizes smoothly between its corner and full-width forms while
    each title, stat, and control glides into place from the first frame; the
    re-wrapped paragraph and the stats rule fade instead of snapping.
  - Hovering a gallery frame expands it toward the centre and dims the rest, like
    the spatial field.
  - Video frames play in the gallery while on screen and pause when scrolled away.
  - Pause shows only in Spatial; reduced motion keeps the gallery alone.
- The spatial field is laid out afresh on every visit (new positions, depths, and
  depth bands), still evenly spaced: the best of several spacing passes is kept.
- Motion polish:
  - Frames rise in from depth as the page appears.
  - The far frames, floor, backdrop words, and glow fade out in place when
    switching to the gallery instead of vanishing; the Pause control fades out
    and back in.
  - Frames that sat under the header's fade start faint and brighten as they
    fly into the gallery.
  - Switching back from a scrolled gallery flies each frame from where it was
    on screen.
  - A frame's depth haze eases on hover and on view switches (a registered
    `--fade`) instead of snapping.
  - Resizing keeps the field's arrangement and glides frames to their new places.
  - Previous and Next slide the reading panel's text in from the matching side
    and fade the new image in.

### Fixed

- Opening a testimonial now hides its frame while the panel is open, so the morph
  no longer shows the frame shrinking back underneath.
- On touch, a closed testimonial no longer stays expanded; only keyboard focus
  expands a frame.
- A hovered frame no longer drops and re-grabs focus when it lifts out from under
  a still pointer.
- Hovering a frame mid-switch no longer snaps it to its focus pose when the flight
  ends; frames hovered during the entrance or a resize glide focus at once.
- Far echo frames lift above the main field when hovered.

### AI session

Changed: new `useTestimonialView`, `useTestimonialGalleryFocus`, and the shared
`frameFocus` binding (moved out of `useTestimonialRain`); `TESTIMONIAL_VIEW`
timing and `TESTIMONIAL_RAIN.layouts`; `randomSeed`, `flatFocusPose`, and
`spreadScore` in `testimonialField`; `useTestimonialRain` (layout effect, seeded
layout, shared phase across rebuilds); `useTestimonialReader` (lifted frame);
`TestimonialsPage` (intro surface layer, persistent Pause); `TestimonialRain`
(separate scenery layer for echoes and floor); `TestimonialDialog` (step
direction); `testimonials.css`; tests; docs.

Reason: The user asked for a Spatial/Gallery switch on Testimonials, with frames
moving smoothly into place each way, an animated intro resize, playing videos
in the gallery, the spatial hover in the gallery, a random but uncrowded field on
each visit, fixes for the intro snap, the gallery open morph, and frames
staying expanded on phones, then a polish pass for snaps and missing motion.

Verification: lint, typecheck, 122 unit tests (spacing above 0.9 across 120
seeded tablet and desktop layouts), build, version, and media audit pass; the
format check flags only in-progress Studio files outside this work.
`npm run test:e2e`: 131 passed, 14 configured skips; the Home loader and Works
sculpture tests failed under parallel load and passed when rerun alone. Frame by
frame, the intro pieces start from their old places with no snap; no frame
overlap in 24 samples across 12 reloads in Chromium and WebKit; hover held in 16
of 16 runs; every gallery frame opens with a view transition; phone close
leaves no frame expanded. Polish pass: layers fade out and back in (opacity
sampled mid-switch), no horizontal overflow, the first frame stays where it was
seen when leaving a scrolled gallery, haze eases (0.86 at 200 ms), resize glides
13 frames and restores the same arrangement, hovered echoes sit on top, and step
animations run both ways; Testimonials browser tests pass on every project, and
the full suite gave 137 passed, 15 skips, and one load-timing failure (footer
sitemap, WebKit) that passed alone.

## [0.18.1] — 2026-10-13

### Changed

- Architecture: side effects and rules moved out of UI components.
  - `usePrefetchPages` owns the idle page prefetch (was in `SiteLayout`).
  - `useMenuReturnFocus` owns focus after menu navigation (was in `StudioMenu`).
  - `useTestimonialReader` owns the open, close, and step logic for the reading
    panel (was in `TestimonialsPage`).
  - `summarizeTestimonials` in the service owns the client count and average
    rating, which the page used to compute itself.
- Performance:
  - The testimonial field is memoised, so its layout is computed once and its 26
    frames no longer re-render on hover or open.
  - The video visibility check is skipped while the field is offscreen.
  - The Works morph posters are decoded at idle time instead of on arrival.
- Cleanup: removed the unused `initials` helper (left over from the old frame
  design), the placeholder quote-card styles, and the per-band speeds, now one
  `TESTIMONIAL_RAIN.speed`. The test-only spacing measure now lives in its test.

### AI session

Changed: new `usePrefetchPages`, `useMenuReturnFocus`, and
`useTestimonialReader` hooks; `summarizeTestimonials`; `SiteLayout`,
`StudioMenu`, `TestimonialsPage`, and `TestimonialRain`; `useTestimonialRain`
and `useWorksView`; `TESTIMONIAL_RAIN`; `testimonialField`; `pages.css`; tests.

Reason: The user asked for a whole-project review for architecture and
optimization, with no added comments.

Verification: Layer import scan (no UI, service, or repository boundary
violations), a scan for side effects in UI, unused-export and unused-CSS scans,
and a bundle check (the 104 kB shared chunk is React and the router, preloaded
as intended). `npm run check` passes (120 unit tests); Playwright 130 passed,
14 skipped.

## [0.18.0] — 2026-10-13

### Added

- Services section in the header, menu, footer, and sitemap. The overview
  (`/services`) links to Software development (`/services/software`), Website
  development (`/services/websites`), and Branding identity
  (`/services/branding`). Each service page has breadcrumbs and tabs, a lead,
  quote and appointment calls to action, what's included, the shared four-step
  process (Listen, Shape, Build, Launch), and links to Works and Testimonials.
- Share metadata and images for the four new pages. The Testimonials share
  image is regenerated to match its current headline.
- The Services menu preview is a licensed Pexels flat lay (laptop, journals, and
  stationery) for software, websites, and branding at a glance. It is graded warm
  and low in saturation to match the other menu photos. The media script gains a
  per-image crop `position` and an optional `warm` grade.

### AI session

Changed: routes, navigation (`SERVICE_PAGES`), router and page modules,
`ServicesPage`, `ServicePage`, `SERVICE_COPY` and `SERVICE_PROCESS`, the footer,
the menu preview, page metadata and share images, tests, and docs.

Reason: The user noted the site was missing Services, covering software
development, website development, and branding identity.

Verification: Screenshots of a service page, the menu, and the header at 900 px.
Browser tests cover footer navigation to every service and accessibility on the
overview and Branding pages.

## [0.17.0] — 2026-10-13

### Changed

- Testimonial frames are redesigned as editorial portrait cards in the language
  of the Home work cards. Stock media fills each card under a soft scrim, with the
  business and stars on top, a warm serif quotation mark and the excerpt in
  Inter Tight, and the client's name in serif italic with the number and “Read ↗”
  along the bottom. Video frames play while they are on screen.
- The field fills the whole screen and runs under the header, fading out beneath
  it. The intro sits as a frosted card in the bottom-left corner.
- Frames share one falling speed and are spread with best-candidate spacing
  across the full width and the whole loop, so they keep their own space instead
  of drifting into clumps. Depth still reads through size, haze, the floor grid,
  and a slower far layer.
- Hover now pulls a frame forward toward the centre, fully on screen and in front
  of everything. Other frames dim and the intro steps back; focus holds while the
  pointer stays on the frame or its original spot.
- Opening a testimonial uses the same morph and panel layout as the Home and Works
  previews (shared `useWorkPreview`). The reading panel hides its scrollbar and
  fades its text at the edges.
- A subtle backdrop gives the page personality: words from the testimonials
  (“smooth”, “patient”, “classy”, “100/10”…) drift faintly behind the frames,
  beside a large warm quotation mark and a soft glow.

### Fixed

- Far frames can be hovered and clicked. A transparent full-size layer at the
  front of the 3D scene was catching every pointer event.
- `useWorkPreview` falls back when WebKit stalls a view transition, so previews
  always open and close on every page.

### AI session

Changed: testimonial frame, media view, rain, dialog, backdrop, page, and
styles; `useTestimonialRain` (shared loop, `spreadFrames`, `focusPose`,
on-screen video playback); `useWorkPreview` (generic type, source element,
`show`, stall fallback); `TESTIMONIAL_RAIN`; tests; and docs.
`useTestimonialDetail` was removed.

Reason: The user found the frames dry and the focus off-centre, saw empty space
and clumping, wanted the Home expand effect, the far frames interactive, no
scrollbar, more personality in the background (kept subtle), and videos that play
as they fall.

Verification: Screenshots at rest, in focus, mid-morph, and open, and a 9 s
sample confirming stable spacing. A Chromium and WebKit probe confirmed every
on-screen video plays. Unit tests cover the spacing and the focus pose; browser
tests cover far-frame clicks, on-screen focus bounds, and video playback.

## [0.16.0] — 2026-10-13

### Added

- Testimonials page with the 13 supplied client testimonials, word for word
  (repository → validation service → hook). Ratings appear where the source had
  them; the average and client count sit in the intro.
- An immersive field of falling testimonial frames in three depth bands, with a
  faint far layer behind them and a floor grid receding to a horizon. Perspective
  makes far frames smaller, slower, and paler, like objects down a railway line.
  Frames are spaced evenly across each band so they never stack.
- Each frame carries a licensed Pexels image or video with the business name, a
  serif monogram, the stars, and an excerpt. Videos play only on the frame in
  focus or in the open panel.
- Hovering or focusing a frame eases the whole field to a stop, dims the rest,
  and lifts that frame forward. Clicking morphs the frame into a reading panel
  with the media header, the full testimonial, the client, and the rating.
  Previous/Next (and arrow keys) step through all 13. A Pause control stops the
  field; reduced motion shows a still grid.

### AI session

Changed: testimonial types, JSON content and media map, repository, service
(validation and excerpts), `useTestimonials`, `useTestimonialRain`,
`useTestimonialDetail`, the field utils (`placeFloats`, `placeEchoes`,
`toWorld`), Testimonials UI and styles, the media manifest and script (asset
groups), the media audit, share metadata, tests, and docs.

Reason: The user supplied the testimonials and asked for an immersive,
Matrix-like rain of frames at varied depths, with a hover focus, a click to
expand, perspective that reads as distance, even spacing, and stock image and
video media, downloaded and optimized.

Verification: Screenshots of the field at rest, in focus, and opened; a stock
contact sheet; the media audit within budget (10.4 MiB in both formats). Distant
frames fade their surface, not their text, so text keeps WCAG AA contrast.
WebKit can stall a view transition started from a dialog's Escape. The morph now
skips a transition whose update has not run within 400 ms, so the dialog always
closes.

## [0.15.0] — 2026-10-13

### Changed

- Founders now swap by sliding right to left: the portrait and its scrolling
  name leave to the left as the next founder arrives from the right, with an
  ease-in-out start and stop (1.3 s). Going back slides the other way.
- Hovering the portrait keeps the depth tilt and holds the automatic swap, but the
  background name keeps scrolling; only Pause stops it.

### Added

- Manual swap cues. On devices that hover, frosted pills (an arrow plus
  “Previous / Next” and the founder's name) appear beside the portrait, with a
  “Drag to swap” hint, only while the pointer is over the portrait or the
  background name; keyboard focus also reveals them. The Next arrow nudges every
  few seconds, and pill widths ease to fit each name. On touch screens compact
  arrows and “Swipe to swap” stay visible.
- Dragging or swiping the stage changes founder (left for next, right for previous).

### AI session

Changed: `useFounderShowcase` (directional slide, swipe, hover cue, label
measuring), `FounderShowcase`, `FounderPortrait` (non-draggable image),
`FOUNDER_SHOWCASE` slide constants, page styles, and navigation tests.

Reason: The user asked for a sliding, stop-and-go swap (later changed to right to
left), a background name that keeps moving on hover, and a hover-only cue for
manual swapping, with name-fitting resizing.

Verification: Recordings of the slide in both directions and of the hover state;
desktop and phone screenshots. The cue reveal uses a stage attribute instead of
`:has(:hover)`, which did not restyle in WebKit. Tests cover the arrows, the
next-name label, the slide finishing, the swipe, and reduced motion.

## [0.14.1] — 2026-10-12

### Changed

- A single founder portrait sits in front of an oversized full name scrolling
  smoothly from right to left. Portrait, name, and profile details crossfade
  together every seven seconds in the studio's ivory and forest palette.
- Direct founder buttons and a visible Play/Pause control. Hovering the portrait
  or focusing the profile link holds playback; hidden tabs and offscreen sections
  suspend it. Reduced motion disables automatic switching and moving names.
- Added a soft portrait shadow and mouse-driven perspective tilt, translation,
  and lift. A stable hit area prevents edge jitter; the portrait settles on leave.
  Depth is disabled for touch and reduced motion. The pause control clears the
  floating contact button.
- Replaced the drum and segmented images with flat responsive local AVIF/WebP
  portraits. The desktop composition fills the viewport; mobile stacks the intro,
  portrait scene, details, and controls.

### AI session

Changed: `FounderShowcase`, `FounderPortrait`, `useFounderShowcase`,
`useFounderDepth`, motion constants, page styles,
interaction tests, architecture notes, and aligned 0.14.1 version records.

Reason: Follow the user's final direction: foreground portrait, continuously
scrolling name behind it, and periodic founder swaps, without drum rotation.

Verification: `npm run check` passed (105 unit tests, build, versions, media
and static checks). Full Playwright run for the slideshow: 111 passed, 12 skips.
After pointer depth and pause-control clearance: focused Founders and page
accessibility checks passed (11 passed, 1 touch-only skip). Covered timed swaps,
marquee pause, keyboard selection, reduced motion, hover tilt, and return to rest.
Reviewed desktop and mobile visuals, including hover; no overflow at 390 px.
Firefox remains a CI check.

## [0.14.0] — 2026-10-12

### Changed

- The Founders page opens on a full-screen founders hero. The portrait of the
  partner in front sits centre stage, with the full name scrolling slowly right to
  left behind it (“— Daisy Nuique ·”). The intro sits bottom-left, the partner's
  title, role, and LinkedIn bottom-right, and the controls along the bottom.
- The two portraits are attached to a large drum behind the screen that turns
  every 7 s. The outgoing portrait drops away underneath; the next comes from far
  behind, over the top, and settles into place. Portraits bend with the drum while
  it turns and flatten once they land. A thin progress line shows the next turn.
  Pointer movement tilts the portrait slightly.
- Name buttons switch partners directly. A pause button stops the rotation and the
  name, and hovering the portrait or focusing LinkedIn holds it. Reduced motion
  disables automatic rotation, the bend, and the scrolling name.
- The duplicated founder cards and the separate intro block were removed; the next
  steps (About, Book an appointment) remain.

### AI session

Changed: `FoundersPage`, new `FounderShowcase` and `useFounderOrbit`,
`FOUNDER_ORBIT`, `pages.css` (founders hero; unused profile-card styles removed),
navigation tests, and documentation.

Reason: The user shared a reference with the portrait in front of a scrolling
name, asked for the two founders to swap on a rotating cylinder (stickers turning
with it, not billboards, flat at rest), and asked for an immersive, non-redundant
layout in the site's design language.

Verification: Frame recordings at 1440×900 of an automatic turn and a manual
switch, plus screenshots at 390, 900, and 1440 px. Browser tests cover both
partners' role, LinkedIn, and portrait label, the pause and resume, and
accessibility.

Tests: `npm run check` passes (105 unit tests); Playwright 108 passed, 12 skipped
(Firefox in CI; desktop-only checks on touch).

## [0.13.1] — 2026-10-07

### Changed

- The Works points sit outside the cube on a wider orbit (radius 1.85), so twelve
  studies no longer crowd the inner cube. They still turn with the cube, and a
  faint dashed tether ties each to its edge midpoint, growing out at the end of
  the trace.
  The orbit stays within the cube's own projected corners.
- Below 1,100 px the bottom controls use two rows: the view toggle and the
  pause/reset buttons, then a centred stepper (up to 560 px). The sculpture is
  drawn at 88 % at these widths so its points clear the controls.

### Fixed

- The stepper no longer overlaps the view toggle and the study count on tablets
  and smaller desktops.
- The contact button no longer covers “Reset view”; its raised position was
  being overridden by the general Works rule.

### AI session

Changed: `TESSERACT.orbit`/`compactScale`, `getTethers`, `getSculptureScale`, the
tesseract scene (tethers, shared line helper), the focus slot, `works-explorer.css`,
tests, and documentation.

Reason: The user asked for less crowded points (outside the cube, still relative
to it), with subtler, dashed connecting lines. They then reported the bottom controls
overlapping on tablet and smaller desktop sizes, and the contact button covering
Reset view.

Verification: Screenshots at 1440×900, 1024×768, 900×700, and 820×1180, plus a
2× close-up of the tethers. Unit tests cover the orbit, the tether endpoints,
on-screen bounds at every rotation, and slot clearance.

## [0.13.0] — 2026-10-07

### Added

- The header logo doodles wherever it appears. On hover, the lotus re-sketches its
  strokes and its lines wobble like hand-drawn animation. On click, short
  hand-drawn emphasis strokes pop out as the mark squashes and stretches and the
  diamond hops. Scrolling, or the wheel on Home, sways the lotus on a soft spring
  and briefly sets its lines wobbling. All of this is off under reduced motion.
- Works shows twelve studies; Home keeps its six featured ones. The six new
  concept studies alternate image and video like the first six: Terra (packaging &
  identity), Lumen (software product, video), Folio (editorial website), Grain
  (brand & website, video), Linnea (e-commerce), and Haven (booking platform,
  video). Their media are licensed Pexels assets, stored and optimized locally.
  On the sculpture, twelve studies sit at the midpoints of the cube's edges, with
  the first nearest the viewer.

### Changed

- A cross-browser and mobile pass, with behaviour preserved. The logo uses plain
  transforms (Chrome 90–103 ignore the individual `rotate`/`scale`/`translate`
  properties), and the stepper keyframes no longer use them. A guarded
  `:focus-visible` check no longer throws in Safari 15.0–15.3. The hover re-sketch
  is limited to devices that can hover, so it does not stick after a tap.
- Lighter work per frame. The logo's wobble filter updates only on its boil steps,
  and CSS variables are written only when they change. The wheel no longer forces
  a layout read. Slow idle cruising draws at about 30 fps (interaction and easing
  stay at full rate). The resize glide reads each box once per resize, and the
  particle flight uses fewer particles when more than six studies fly.

### AI session

Changed: `StudioLogo`, a new `useLogoDoodle` hook, `LOGO_DOODLE` in `motion.ts`,
`site.css`; the works content, repository (`getWorks`), service
(`getCollectionWorks`), and hooks (`useCollectionWorks`); a new `ink` art
direction; 12-point anchors; media manifest and script (named assets, per-image
quality); `useTesseract`, `useLayoutGlide`, and `useWorksView` optimizations; tests
and handoff documentation.

Reason: The user asked for hover, click, and scroll animation on the logo across
the site, in a doodle style, and then asked to remove the underline that had been
added. They then asked for a review of the recent work for optimization across
browsers and mobile, with behaviour preserved, and for twelve studies on Works
(six new, alternating image and video) while Home keeps six.

Verification: 2× screenshots of the hover sketch and wobble, the click pop, and
scroll sway settling back to a clean mark. A wheel probe on Home showed the spring
(about 1° peak, settling with a soft overshoot) without scrolling the page. The
browser test covers all three triggers.

Tests: `npm run check` passes (103 unit tests); Playwright 108 passed, 12 skipped
(Firefox in CI; desktop-only checks on touch).

## [0.12.0] — 2026-10-07

### Added

- A heartbeat at the centre of the Works sculpture: a forest dot beats “lub-dub”
  once a second with a faint ripple. It starts once the sculpture has been drawn.
- Spatial → gallery: the sculpture un-draws itself (the trace in reverse) while
  each point streams particles that land on its gallery image; the real cards then
  fade in. Gallery → spatial: the images dissolve into particles that fly into the
  points as the sculpture traces back in.
- New Works music: a warm pad that changes every four beats, a plucked melody that
  wanders over it, and a quiet heartbeat at 60 BPM. The music and the visual heart
  share one clock, so they beat together.
- The idle rotation wanders: every 9–16 s it takes a new heading (a new speed,
  sometimes reversed, and a drift toward a new tilt), blended in over 2.5 s.
- Dragging the window across a breakpoint glides any control or gallery card that
  would jump; continuous resizing is left alone. When the side slot closes, the
  docked preview dissolves where it is.

### Changed

- The floating preview (phones and narrow windows) sits on a sand surface panel
  like the site's cards, keeps clear of the bottom controls, and the contact button
  steps aside while it is open.
- The mobile stepper thumbnail is lifted with a hairline edge, soft shadow, and a
  slight tilt so it stands off the bar.

### Fixed

- Reset, the stepper, and arrow-key glides no longer leave the sculpture stopped;
  the cruise resumes afterwards.

### AI session

Changed: Works page, stage, explorer, preview, and stepper UI; `useTesseract`,
`useParticlePreview`, `useWorksView`, `useHeartbeat`, and `useLayoutGlide`; the
particle scene (texture slots), trace/heading/point utils, the pulse scheduler and
the Works ambient preset; styles, tests, and handoff documentation. The comments
added during the session were removed at the user's request.

Reason: The user asked for a heartbeat at the sculpture's centre (a circle, with
subtle audio beats), particles that carry the works between the sculpture and the
gallery while the sculpture un-draws, new Works music, a wandering rotation, smooth
breakpoint resizing, framing consistent with the design language, and a fix for
rotation stopping after Reset.

Verification: Frame recordings in headless Chromium and WebKit covered the morph in
both directions, the un-drawing, and drag-resizing across breakpoints (to 600 px
and back to 1100 px). Phone screenshots covered the preview panel and the
thumbnail. A 32 s sample confirmed the heading changes, a beat test covers the
shared clock, and a browser test confirms motion resumes after Reset. Music levels
still need listening on real speakers.

Tests: `npm run check` passes (100 unit tests); Playwright 103 passed, 11 skipped
(Firefox in CI; desktop-only checks on touch). The page loader wait in tests is
20 s because parallel software WebGL can slow first loads.

## [0.11.0] — 2026-10-07

### Added

- Full-viewport Works sculpture: a rigid WebGL tesseract drawn in forest ink on the
  ivory canvas, with faint glass faces and selectable points. On arrival, whether
  after the loader or a navigation, the edges trace themselves in. The outer cube
  draws first, then the edges reaching inward, then the inner cube; the faces,
  points, and first preview follow.
- The study nearest the viewer is shown automatically. On wide screens it sits in
  a fixed slot beside the sculpture, assembled from particles that stream out of
  its point. When the front point changes, the old study flows back into its point
  and the next assembles from its own.
- Hovering, focusing, or tapping a point shows that study instead. Hovering the
  shown study pins it, and choosing it opens the accessible project dialog.
- A focus stepper (← 03 / 06 Solenne →) replaces the row of every title. The
  arrows glide the next study to the front, and the control keeps its size for any
  number of works; the gallery remains the full list.
- Motion eases rather than stops. Hover, keyboard focus, and pause ease the
  rotation to rest and back (0.9 s). A released drag keeps its momentum and blends
  into the slow cruise; arrow keys, Home, and Reset glide.
- Switching between Spatial and Gallery crossfades in a view transition while the
  title and toggle glide, with no colour change between the two.
- A Works sound scene: a brighter, more spacious ambient bed (glassy voicings,
  high air, bell-like chimes) crossfades in. Glass tones replace the sampled
  hover, click, and switch sounds; each point has its own note. Assembly, grabbing,
  and releasing the sculpture have their own sounds.
- Reduced motion defaults to the gallery and shows previews without particles;
  WebGL failures keep static geometry and native previews.

### AI session

Changed: Works page, explorer, stage, preview, and stepper UI; `useTesseract`,
`useParticlePreview`, `useWorkHover`, `useWorksView`, `useAppEntered`, and
`useSoundScene`; geometry, trace, focus, and placement utils; GPU scenes and
shaders; the sound engine, ambient presets, and glass sounds; styles, tests,
version files, and handoff documentation.

Reason: The user requested an immersive tesseract Works page with particle
previews, then refined it. They asked to remove the corner cubes and keep the shape
from deforming, and to ease hover pauses and drag releases. They wanted the front
study shown automatically, a smooth spatial ↔ gallery switch, a control that
scales beyond six works, and a traced entrance. They doubted the green background
and asked for Works-specific sound.

Verification: Frame recordings in headless Chromium and WebKit covered the
entrance trace (after the loader and after navigation), the study handoff, both
view switches, and drag momentum. Measurements confirmed the hover ease (motion to
zero over 0.7 s) and the release (momentum decaying into the cruise). A
Web Audio probe confirmed the scene change and gesture sounds without errors;
levels still need listening on real speakers.

Tests: `npm run check` passes (97 unit tests); Playwright 101 passed, 10 skipped
(Firefox in CI; hover-only checks on touch). The five-page accessibility sweep is
marked slow because it can time out under parallel WebGL load.

## [0.10.0] — 2026-10-06

### Added

- Resizing across the mobile breakpoint is animated. The spiral blends from its
  desktop shape to its mobile shape (or back) while it keeps moving. Its clip
  window and top/bottom fade animate with it, the hero text glides and scales to
  its new place and size, and gallery cards fly into the new grid.
- Founder cards link to each partner's LinkedIn (opens in a new tab), with the
  same circle-to-square badge morph as the contact channels. Structured data
  lists each profile under the founder's `sameAs`.

### Fixed

- Opening a work preview no longer flattens or shifts the spiral cards in
  Safari. Perspective now lives in each card's transform instead of being
  inherited from the stage, which Safari dropped while snapshotting the page.
- Switching from spiral to gallery no longer pops cards in front of each other
  or snaps their angle on the first frame. Each card keeps its spiral stacking
  order and vanishing point as it leaves.
- Hero text no longer reshapes suddenly when switching views. “Selected” /
  “works.”, “Less, but” / “with feeling.”, the controls, and the footer items
  glide individually into the new arrangement. Only long moves dip in opacity,
  and newly shown text fades in.

### AI session

Changed: `src/utils/{spiral,collectionMorph}.ts`, `src/hooks/{useSpiralLoop,useCollectionMorph}.ts`,
`src/ui/sections/Hero/{Hero,ViewControls,HeroStatement,HeroFooter,WorkCollection}.tsx`,
`src/ui/styles/{hero,hero-responsive,pages}.css`, `src/constants/{founders.json,founders.ts,motion.ts}`,
`src/ui/pages/FoundersPage.tsx`, `scripts/socialMeta.ts`, tests, docs.

Reason: The user reported spiral cards flickering or changing angle when a
preview opens, sudden size and position changes when switching between spiral
and gallery (cards and text), and asked for a smooth resize between mobile and
desktop. They also supplied the founders' LinkedIn profiles.

Verification: Frame-by-frame screen recordings in headless Chromium and WebKit
located the causes: Safari's snapshot flattening, the stacking order and
vanishing point at the start of the gallery flight, and the whole-block text
glide. The same recordings confirmed the fixes and the breakpoint reshape. A
suspected video-poster swap in Safari was a recording artifact and was left
alone.

Tests: Revalidated before the authorized commit and push: `npm run check` passes
(85 unit tests); `npm run test:e2e` has 78 passed and 9 configured skips (Firefox
runs in CI only). The WebKit intro-timing test passed this run but has previously
been flaky under parallel load, including on 0.9.0.

## [0.9.0] — 2026-10-06

### Added

- Contact page “Follow the studio” section. Facebook, Instagram, and LinkedIn
  are main tiles (icon, name, handle); on hover a tile turns deep green and its
  icon badge morphs from a circle into a tilted ivory square. TikTok and
  Behance sit behind a “More” control that morphs from a round pill into a
  square-cornered tray (+ turns to ×) and glides the chips in; hidden links are
  inert until revealed. Links open in a new tab with a screen-reader notice.
- Line icons for Facebook, Instagram, LinkedIn, TikTok, Behance, and “plus”.
- Real contact details: email `theminimalistss@gmail.com` (mailto) and hours
  7:00 AM – 11:00 AM; the location row is removed. Inquiry placeholders now
  offer the email directly.
- Structured data adds `sameAs` (all five profiles) and the studio email.

### Changed

- Hero motion control: both labels share one grid cell, so toggling “In
  motion” / “Motion paused” crossfades without shifting the footer. Pausing
  eases the spiral to a stop and resuming eases it back up (900 ms
  ease-in-out); previews and view switches still freeze it at once.
- Refreshed `.agent` state, architecture, decisions, handoff instructions, and
  remaining tasks for the populated Founders and Contact pages. Release versions
  are aligned at 0.9.0 in the package, lockfile, README, and agent records.

### AI session

Changed: `src/constants/{social,contact}.json`, `src/constants/social.ts`,
`src/ui/sections/Page/SocialLinks.tsx`, `src/ui/pages/{ContactPage,InquiryPage}.tsx`,
`src/ui/components/Icon.tsx`, `src/ui/styles/{pages,hero}.css`, `scripts/socialMeta.ts`,
`src/hooks/useSpiralLoop.ts`, `src/constants/motion.ts`,
`src/ui/sections/Hero/{Hero,HeroFooter,WorkCollection}.tsx`, tests, docs, and
`.agent` handoff records.

Reason: The user supplied social links (with Facebook, Instagram, LinkedIn as
the main channels), an email address, and opening hours, and asked to drop the
location; they also asked for the motion button not to shift the layout and for
a smooth stop and start. A services rewording of “Brand · Digital ·
Experience” was tried and reverted at the user's request. The release handoff
was refreshed and versions checked before the authorized commit and push.

Tests: Revalidated for release on 2026-10-06: `npm run check` passes (81 unit
tests); `npm run test:e2e` has 76 passed and 8 configured skips across desktop
Chromium, desktop WebKit, and mobile WebKit (Firefox runs in CI only).

## [0.8.0] — 2026-10-06

### Added

- Founders page with the real founding partners: Daisy Nuique (Product /
  Visual Designer) and Rex Pinili (Software Engineer). Both carry the same
  “Founding partner” title, equal card sizes, and are listed alphabetically by
  surname, since the studio is a partnership with no hierarchy.
- Founder portraits cropped to matching 4:5 half-length frames and encoded as
  480/960 AVIF and WebP with all metadata (including location) removed;
  reproducible with `npm run media:founders` from `.cache/founders/`.
- Structured data lists both founders; the Founders share description names
  them.

### AI session

Changed: `src/constants/founders.{json,ts}`, `src/ui/pages/FoundersPage.tsx`,
`src/assets/images/founders/`, `scripts/{prepare-founders,audit-media}.mjs`,
`scripts/socialMeta.ts`, `src/router/pageMeta.json`, styles, tests, docs.

Reason: The user supplied founder photos, names, and roles.

## [0.7.0] — 2026-10-06

### Added

- Floating “Let’s talk” button (lower right, every page except Contact and
  inquiries) that opens the Contact page. At rest it is a deep-green circle with
  the lotus and a soft pulse ring; on hover or keyboard focus it morphs into the
  site’s square-cornered shape, reveals “Let’s talk”, and the lotus redraws
  itself while its diamond hops. Touch screens show it as a compact labelled
  pill. It sits above the hero’s bottom rail on the home page.

### AI session

Changed: `src/ui/components/{ContactFab,LotusMark}.tsx`,
`src/ui/layouts/SiteLayout.tsx`, `src/ui/styles/site.css`,
`e2e/navigation.spec.ts`.

Reason: The user first asked for a hero CTA, then a more familiar booking
button, and finally replaced both with a floating contact button with a playful
hover morph. The earlier variants were removed before release.

Tests: `npm run check` passed (79 unit tests). `npm run test:e2e` passed 70,
8 skipped on mobile, including the floating button → Contact test.

## [0.6.0] — 2026-10-06

### Added

- Interface sound: hover, click, page navigation, menu open/close, spiral ↔
  gallery switch, a speed-following whoosh and soft detent ticks while steering
  the spiral, and a soft synthesized swell when a work preview opens or closes.
  Samples are CC0 (Kenney Interface Sounds and UI Audio), trimmed, softened, and
  encoded as Opus/WebM with MP3 fallback (about 1–3.5 KB each).
- Soothing generative ambient bed: slow sine chords in D major drifting every
  36 s, a low “ocean wash”, rare soft chimes, long reverb; fades in over 8 s.
- Header “Sound” toggle (remembered); audio starts only after the first click
  or key press and suspends when hidden or off.
- Work hover/focus feedback: lift shadow, gentle media zoom and dim, title rise,
  and the spiral slows to a fifth of its speed under the pointer.
- The loader now waits for fonts, the page, every sound file, on-screen images,
  and on-screen playing videos (12 s safety cap), and shows a loading indicator
  (hairline progress and counter, exposed as a progress bar).
- `npm run media:audio` reproduces the sound set; the media audit checks audio
  size, length, mono, and format pairs.

### Changed

- Cross-browser: explicit build targets (Chrome/Edge 90, Firefox 90, Safari 15),
  `vh` fallbacks for `svh`, iOS text-size adjustment, `<dialog>` fallback,
  prefixed Web Audio for older Safari, and no `structuredClone`/`throwIfAborted`.
- Firefox joins the browser test matrix in CI (`E2E_FIREFOX=1` locally).

### AI session

Changed: `src/audio/`, `src/constants/sounds.ts`, `src/assets/audio/`,
`src/repositories/preferences.repository.ts`, `src/services/sound.service.ts`,
`src/hooks/{useSound,useInteractionSounds,useSpiralLoop,useWorkPreview,useDialog}.ts`,
`src/ui/components/{SoundToggle,SiteHeader,WorkItem,WorkDialog}.tsx`, styles,
`scripts/{prepare-audio,audit-media}.mjs`, `vite.config.ts`,
`playwright.config.ts`, CI, tests, docs.

Reason: The user asked for tactile, immersive sound on every interaction, a
soothing background bed, gentler preview sounds, hover feedback on works, and
support across browsers.

Tests: `npm run check` passed (79 unit tests, audio audit). `npm run test:e2e`
passed 67 locally (8 skipped on mobile) including real sound playback and a
remembered toggle. Firefox could not launch locally (Playwright Firefox on
macOS 27 cannot create a profile); it runs in CI on Linux.

## [0.5.0] — 2026-10-06

### Added

- Link previews for Facebook, Instagram, Threads, LinkedIn, X, Reddit, WhatsApp,
  Slack, and ad placements: the build writes HTML for every route (`/about`,
  `/about/index.html`, and `/about.html`) with title, description, canonical
  URL, Open Graph, and X card tags, plus `404.html`, `robots.txt`, and (with
  `VITE_SITE_URL`) `sitemap.xml` and Organization/WebSite structured data.
- Per-page 1200×630 share images (center-safe for square crops), an Apple
  touch icon, app icons, and a web manifest (`npm run media:social`).
- Visitors arriving from ads or social campaigns (`utm_*`, `fbclid`, `gclid`,
  and similar) get the brief intro.

### Changed

- Work previews morph with the View Transitions API: the card becomes the
  preview panel, its media becomes the preview image, and the title, tagline,
  and category glide and cross-fade into the preview typography (and back).
- On phones the spiral runs the full screen height, behind the header and
  footer, with a soft fade so headings stay readable.
- Page titles and descriptions come from one source (`src/router/pageMeta.json`).

### Fixed

- Preview panel no longer shows a scrollbar or translucent half-open state.
- Close requests made during a preview animation are queued, not dropped.

### Removed

- WAAPI preview flight (`useMediaFlight`), the static social preview image, and
  the static `robots.txt` (now generated).

### AI session

Changed: `scripts/{socialMeta.ts,create-social-images.mjs}`, `vite.config.ts`,
`index.html`, `src/router/pageMeta.{json,ts}`, `src/hooks/{useWorkPreview,useDocumentMeta,useDialog}.ts`,
`src/services/visit.service.ts`, `src/ui/components/WorkDialog.tsx`, styles,
`public/` icons and share images, tests, docs.

Reason: The user reported the preview's mid-animation state, asked for a text
and media morph into the preview, a full-bleed mobile spiral, and link previews
that work on every social platform and in ads.

Tests: `npm run check` passed (77 unit tests). `npm run test:e2e` passed 64,
8 skipped on mobile, including crawler-style requests for per-route share tags
and images, and campaign links. Morph frames reviewed in Chromium; mobile
spiral reviewed in WebKit (iPhone 13).

## [0.4.0] — 2026-10-06

### Added

- Menu hover effect inspired by list-style project indexes, drawn in the site's
  own language: the hovered row opens a square Cashmere Beige panel (like the
  link cards), a 4:5 section preview slides in (like the work cards), the title
  shifts, and an eyebrow tag (“Meet the studio ↗”) follows the cursor. Keyboard
  focus shows the same panel. Timing uses the shared reveal/ease tokens.
- Page transitions: the old page lifts and fades (View Transitions API) while the
  header stays put; the new page fades in. Browsers without View Transitions get
  the fade-in only. The menu keeps its own morph.
- Scroll reveal: page intros, section heads, cards, lists, placeholders, Works
  gallery items, and the footer rise into place as they enter the viewport.
- Work previews: the tapped card's media flies into the preview and flies back
  into the card on close, with a fading backdrop and panel.

### Changed

- Studio name is “The Minimalist — Design Studio” everywhere (logo, titles,
  meta, footer, menu, About, share image). Page titles use the page name.
- Router moved to `createBrowserRouter` + `RouterProvider` so links can use view
  transitions; router errors render the studio error page.
- Skip link reads “Skip to main content” now that it serves every page.
- Section tabs use the square radius token instead of pills.

### Fixed

- The spiral now resumes when a work preview closes. Only Tab navigation (not a
  click or programmatic focus) holds and foregrounds a study.
- Loader shine: the sweep now starts after the bloom in both intro lengths, and
  the loader waits for one full sweep before opening; glow strengthened.

### Performance

- Full loader intro plays once per session; repeat loads use a brief intro
  (≈2s faster to interactive in testing).
- Inner page chunks prefetch when idle; navigation no longer waits or shows a
  fallback.
- Menu WebGL is prepared when idle instead of at startup; the loader releases
  its WebGL context after exiting.
- Spiral skips unchanged z-index writes; shared status, index formatting, and
  e2e helpers remove duplication; unused CSS removed.

### AI session

Changed: `src/hooks/{usePointerCue,useIntro,useMenuMorph,useLoaderScene,useSpiralLoop,useHeroWorks}.ts`,
`src/repositories/visit.repository.ts`, `src/services/visit.service.ts`,
`src/router/pageModules.ts`, `src/constants/{menu,motion}.ts`, `src/utils/{idle,format}.ts`,
`src/ui/components/{StudioMenu,CollectionStatus,PageLoader}.tsx`, `src/App.tsx`,
styles, tests, docs.

Reason: The user asked for the grigoletti.ch project-list hover effect (in the
site's design language), an optimization pass, the correct studio name, page
transitions and scroll reveals, a preview media flight, the spiral to resume
after a preview, and the loader shine back.

Tests: `npm run check` passed (69 unit tests, build, version, media audit).
`npm run test:e2e` passed 54 tests, 3 skipped for mobile (keyboard, wheel,
hover), including preview flight + spiral resume, scroll reveal, and axe after
reveal. Hover, shine, flight, and page-transition frames reviewed in Chromium.

## [0.3.0] — 2026-10-06

### Added

- Site structure from the project brief: Works, About, Founders, Testimonials,
  Products (Software solutions, Website templates, Hardware products), Contact,
  and Inquiries (General, Quote, Appointment), each with temporary content.
- Fixed site header with the lotus logo and primary links (Works, Studio,
  Products, Contact); it gains a background once the page scrolls.
- Site menu rebuilt as a full site map with sub-page links and current-page state.
- Footer sitemap, breadcrumbs, and section tabs on sub-pages; page titles per route.
- Shared page blocks: intro, section, link cards, checklist, placeholder.

### Changed

- Spiral ↔ gallery switching keeps the same card, image, and video elements, so
  nothing reloads mid-flight; heading, statement, and footer now glide instead
  of fading out and back in. Slightly longer, softer easing.
- Header logo uses the lotus mark from the brand board.
- Route changes scroll to the top and move focus to the new page's main content.
- Menu no longer switches collection views (the hero controls do).

### AI session

Changed: `src/router/`, `src/ui/layouts/`, `src/ui/pages/`, `src/ui/sections/Page/`,
`src/ui/sections/Hero/{Hero,WorkCollection}.tsx`, `src/ui/components/{SiteHeader,SiteFooter,StudioMenu,StudioLogo,Icon}.tsx`,
`src/hooks/{useSiteMenu,useRouteFocus,useScrolledPast,useDocumentTitle,useSpiralLoop,useCollectionMorph}.ts`,
`src/constants/pages.ts`, styles, tests, docs.

Reason: The user asked for a smoother spiral ↔ grid transition and a clear,
on-brand place for every page in their task list (with temporary content), so
visitors can navigate easily.

Tests: `npm run check` passed (67 unit tests, build, version, media audit).
`npm run test:e2e` passed 43 tests, 2 skipped for mobile (keyboard, wheel),
including footer-sitemap traversal, menu navigation focus, tabs/breadcrumbs,
and axe checks on new pages. Pages and transitions reviewed at desktop and phone
widths.

## [0.2.0] — 2026-10-06

### Added

- WebGL page loader: the lotus mark and “EST. 2020” bloom from the base of the
  flower, shimmer while the page loads, then open onto the hero with an organic
  reveal. A static SVG version covers reduced motion and missing WebGL.
- Boot splash in `index.html`, so the loader colour shows before JavaScript runs.
- WebGL morph for the studio menu: an organic shape grows from the menu button and
  fills the screen, then contracts back on close. Falls back to a CSS clip-path.
- Mouse-wheel steering for the spiral: scrolling boosts its speed, and the scroll
  direction sets its spin direction, easing back to cruising speed.
- Spiral ↔ gallery transition: each card flies from its current position, scale,
  and tilt into the other layout, staggered, while the clipping window grows or
  shrinks with it. Headings, statement, footer, and captions fade into place.

### Changed

- The app shell is inert until the page is ready and eases into place on reveal.
- Menu content waits for the morph to cover the screen; Escape plays the close
  animation before focus returns to the menu button.
- Reduced motion also zeroes animation and transition delays.
- Lotus mark redrawn from the clearer reference: two mirrored strokes that cross
  under the bud, rounded tips, bowl-shaped side petals; softer loader glow.
- Release notes and AI session logs now share this file; the root changelog is gone.

### AI session

Changed: `src/constants/`, `src/shaders/`, `src/utils/{spiral,webgl,easing,lotusArtwork}.ts`,
`src/hooks/{useSpiralLoop,usePageReady,useLoaderScene,useMenuMorph,useCollectionMorph}.ts`,
`src/utils/collectionMorph.ts`,
`src/ui/components/{PageLoader,LotusMark,StudioMenu}.tsx`, `src/App.tsx`, styles,
`index.html`, unit and browser tests, version tooling, docs.

Reason: The user asked for wheel-driven spiral speed and direction, a morphing
menu, an animated WebGL loader based on their lotus “EST. 2020” artwork, a
faithful redraw of that mark, and animated spiral ↔ gallery switching.

Tests: `npm run check` passed (64 unit tests, build, version, media audit).
`npm run test:e2e` passed 31 tests, 2 skipped for mobile (keyboard, wheel).
WebGL renders in Chromium and WebKit; loader, menu, and view-switch frames were
reviewed at desktop and phone widths; the mark was compared against the reference.

## [0.1.0] — 2026-10-06

### Added

- Phase 1 editorial landing page with a continuous spatial selected-work loop.
- Six labeled concept studies alternating images and silent video.
- Gallery, accessible project previews, menu, pause control, and 404 route.
- Reduced-motion gallery, keyboard navigation, focus restoration, media fallbacks.
- Strict React/TypeScript/Vite foundation and repository → service → hooks → UI.
- Local responsive AVIF/WebP images, WebM/MP4 loops, self-hosted fonts, media scripts.
- Unit/component/browser tests, accessibility scans, CI, and version checks.
- `.agent` AI context, engineering documentation, and source briefs.

### Performance

- One transform-only animation loop with no per-frame React state updates.
- Observer-controlled video playback, hidden-tab suspension, and asset budgets.

### AI session

Changed: configuration, `src/`, `scripts/`, `e2e/`, `.github/`, `.agent/`, `docs/`,
and README.

Reason: Implement the two master briefs and the requested documentation, AI logs,
and versioned code while retaining Phase 1 scope.

Tests: Final validation was in progress at handoff.
