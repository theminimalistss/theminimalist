# Deployment

Set `VITE_SITE_URL` (for example `https://www.example.com`), then run
`npm ci && npm run build:hostinger` and publish `dist/` on a static host. The build assumes
a domain-root deployment.

## Hostinger web hosting (current)

The website and the contact mail service are two separate Hostinger websites on
Business Web Hosting, each with its own `public_html`. Hostinger does not build
the website; it is built locally and uploaded.

1. Put the public build settings in `.env.production.local` (git-ignored; Vite
   reads it for `npm run build`):
   ```
   VITE_SITE_URL=https://<website domain>
   VITE_CONTACT_ENDPOINT=https://<mail service domain>/
   ```
2. Run `npm run build:hostinger`, replace the website's `public_html` contents
   with the contents of `dist/`, and clear the Hostinger cache.
3. Run `npm run build:api` and upload `dist-api/` to the mail service as described
   in [Contact mail service](#contact-mail-service).

Browser tests build with both variables emptied (`playwright.config.ts`), so
local production settings never reach test builds or the live mail service.

## Hostinger Web Apps (alternative)

Use Hostinger's **Vite frontend** preset with **Node.js 24**, installation command
`npm ci`, build command `npm run build:hostinger`, and output directory **`dist`**.
The `.nvmrc` file pins Node 24 for local parity. This app is a static frontend;
it needs no persistent Node server, start command, or server entry file. Do not
use `vite preview` as the production server.

Production CSS is extracted into one hashed file linked directly by every route's
HTML (`build.cssCodeSplit: false`); JavaScript routes remain lazy. This costs one
shared stylesheet download and ensures route geometry/styles are ready before
the page appears. It removes the lazy Works stylesheet dependency that was seen
downloading without applying on the deployed Hostinger page. After rebuilding,
redeploy the complete output/source and refresh any stale HTML/CDN cache. Do not
copy a new JS bundle alongside old HTML or styles.

Connect the GitHub source or upload a ZIP of the source (omit `node_modules`,
`.cache`, and local `.env` files). Set `VITE_SITE_URL` to the actual HTTPS origin
in the build environment before deploying. Vite embeds it during the build;
changing it requires a rebuild. No domain is assumed in the repository.

Hostinger manages its frontend routing and `.htaccess` on every deployment.
Keep that configuration managed by the platform. Configure caching and headers
through supported host/CDN settings, and repeat the checks below after redeploying.
See [Hostinger's Web Apps deployment guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

`deploy:check` verifies that each known route has HTML and that its referenced
entry scripts, styles, icons, and images exist in the production output. It also
rejects public source maps and environment files. Without `VITE_SITE_URL` it
prints a reminder; development builds can still be checked.

After a deployment, verify:

- Open and refresh `/about`, `/services/software`, `/products/templates`, and
  `/contact` directly; check their titles and previews. `/inquiries/quote` should
  land on `/contact?inquiry=quote`. Unknown routes
  should show the app's 404, while missing media must return 404 rather than HTML.
- Confirm scripts and styles have correct MIME types, fonts/media load over HTTPS,
  and videos support byte-range requests. The app uses local optimized media.
- Check Works, Testimonials view switching, Founders depth, the flower hover/tap,
  menu, and loader on desktop Chrome and real iOS Safari. Repeat with reduced
  motion, a hidden tab, slow networking, and WebGL disabled.
- Check Products panel expansion with mouse/keyboard and two-step navigation
  on touch. Confirm template filters and coming-soon category pages work after
  a direct load and browser refresh.
- Check all three legacy inquiry URLs with direct refresh, including their
  generated HTML shells. With `VITE_CONTACT_ENDPOINT`, send a real message and
  confirm the studio email and visitor confirmation arrive with the logo; without
  it, confirm the mail-app hand-off and the manual-copy fallback.
- Check HTML revalidation and immutable caching for hashed `/assets/` files;
  public icons, manifests, and route HTML must update after a new release.

The flower's idle motion uses native browser animations and pauses offscreen or
when the tab is hidden. Its pointer response runs only during interaction and
settling. Loader/menu buffers are capped at 1.5× DPR and a 2048 px edge; the Works
sculpture has its own 1800 px cap. Audio samples download and decode before the loader exits; failed audio requires
retry. Video buffering remains optional. Route prefetch waits until entry, runs sequentially, and skips reported
data-saving/2G connections. These behaviours are client-side and need no special
Hostinger process or animation service.

Local production-preview tests verify browser behaviour and generated output;
they cannot verify a Hostinger account's live routing, cache, or headers.

Routing: serve existing files first. Every page has `dist/<route>/index.html` and
`dist/<route>.html`, so clean URLs (`/about`) return HTML with that page's share
tags on Netlify, Cloudflare Pages, Vercel (`cleanUrls`), GitHub Pages, or nginx
(`try_files $uri $uri.html $uri/index.html /index.html`). Unknown paths should
fall back to `index.html` (the app renders its 404) or `404.html`.

## Browser support

Builds target Chrome/Edge 90+, Firefox 90+, and Safari/iOS 15+ (including
in-app browsers built on them). Newer features degrade gracefully: View
Transitions, WebGL, `:has()`, and `inert` are enhancements with fallbacks.
Serve `.webm` audio/video as `audio/webm`/`video/webm` and `.mp3` as
`audio/mpeg`.

## Link previews and ads

Crawlers for Facebook/Instagram/Threads, LinkedIn, X, Reddit, WhatsApp, Slack,
and ad review read the HTML only. After deploying, check pages with the Facebook
Sharing Debugger (also “Scrape Again” after changes), the LinkedIn Post
Inspector, and a generic Open Graph previewer. Share images are 1200×630 PNG
(≈20–35 KB) at `/social/<page>.png?v=<version>`; keep them publicly reachable
without authentication, cookies, or bot blocking. Campaign parameters (`utm_*`,
`fbclid`, `gclid`, …) are ignored by routing and shorten the intro. Regenerate
images with `npm run media:social` after changing `pageMeta.json`.

Use `npm run preview` locally, not as a public production server. Build-time
variables are `VITE_SITE_URL` and the optional `VITE_CONTACT_ENDPOINT`. `VITE_`
values are public bundle content and must never contain secrets; the Brevo key
belongs only in the PHP host's `server/.env`.

## Contact mail service

`server/` is a PHP 8.1+ service deployed separately from the static site, on its
own PHP website or subdomain (Hostinger or GoDaddy cPanel). `npm run build:api`
writes the upload folder `dist-api/`. Put its `.env` above that site's
`public_html`, authorise the host's IP in Brevo, then build the website with
`VITE_CONTACT_ENDPOINT` set to the service URL (`.env.production.local`, or a Web
App's build environment) and redeploy it. The CSP's `connect-src` must allow that origin. Full steps
are in `server/README.md`.

Before launch, replace concepts/provisional copy/logo with approved content,
run quality gates, set `VITE_SITE_URL`, and configure HTTPS, immutable caching for hashed assets, and HTML revalidation.
Verify MIME types, video range requests, SPA fallback, and security headers.

Suggested starting CSP:
`default-src 'self'; connect-src 'self' https://api.example.com; img-src 'self' data:; media-src 'self'; font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`.
Inline style allowance supports calculated transforms. Configure headers at the
host. The local workflow performs no deployment, remote push, or release.
