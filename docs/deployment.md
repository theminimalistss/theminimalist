# Deployment

Set `VITE_SITE_URL` (for example `https://www.example.com`), then run
`npm ci && npm run build` and publish `dist/` on a static host. The build assumes
a domain-root deployment.

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

Use `npm run preview` locally, not as a public production server. `VITE_SITE_URL`
is the only environment variable; no API keys, contact endpoints, or analytics
are required. `VITE_` values
are public bundle content and must never contain secrets.

Before launch, replace concepts/provisional copy/logo with approved content,
run quality gates, set `VITE_SITE_URL`, and configure HTTPS, immutable caching for hashed assets, and HTML revalidation.
Verify MIME types, video range requests, SPA fallback, and security headers.

Suggested starting CSP:
`default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`.
Inline style allowance supports calculated transforms. Configure headers at the
host. The local workflow performs no deployment, remote push, or release.
