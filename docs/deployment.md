# Deployment

Run `npm ci && npm run build` and publish `dist/` on a static host. Configure SPA
fallback to `index.html` for application paths; existing assets must be served
normally. React Router renders the local 404. The build assumes a domain-root
deployment.

Use `npm run preview` locally, not as a public production server. No environment
variables, API keys, contact endpoints, or analytics are required. `VITE_` values
are public bundle content and must never contain secrets.

Before launch, replace concepts/provisional copy/logo with approved content,
run quality gates, add a real canonical origin and absolute Open Graph image URL,
and configure HTTPS, immutable caching for hashed assets, and HTML revalidation.
Verify MIME types, video range requests, SPA fallback, and security headers.

Suggested starting CSP:
`default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`.
Inline style allowance supports calculated transforms. Configure headers at the
host. The local workflow performs no deployment, remote push, or release.
