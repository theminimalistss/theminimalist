import type { Plugin } from 'vite';
import packageJson from '../package.json' with { type: 'json' };
import founders from '../src/constants/founders.json' with { type: 'json' };
import social from '../src/constants/social.json' with { type: 'json' };
import contact from '../src/constants/contact.json' with { type: 'json' };
import {
  formatPageTitle,
  NOT_FOUND_META,
  PAGE_META,
  SITE,
  type PageMeta,
} from '../src/router/pageMeta.ts';

const START = '<!-- social:start -->';
const END = '<!-- social:end -->';
const IMAGE = { width: 1200, height: 630, type: 'image/png' };

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function normalizeSiteUrl(value: string | undefined) {
  if (!value) return '';
  const url = new URL(value);
  return url.origin + url.pathname.replace(/\/+$/, '');
}

function structuredData(siteUrl: string, image: string) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SITE.title,
        alternateName: SITE.name,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon-512.png`,
        image,
        foundingDate: SITE.established,
        founder: founders.map(({ name, role }) => ({ '@type': 'Person', name, jobTitle: role })),
        sameAs: social.map(({ url }) => url),
        email: contact.email,
      },
      { '@type': 'WebSite', name: SITE.title, url: `${siteUrl}/` },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function socialTags(siteUrl: string, path: string | null, page: PageMeta) {
  const title = escape(path ? formatPageTitle(path) : `${page.title} — ${SITE.name}`);
  const description = escape(page.description);
  const url = siteUrl && path ? `${siteUrl}${path}` : '';
  const image = `${siteUrl}/social/${page.image}.png?v=${packageJson.version}`;
  const alt = escape(`${SITE.title}. ${page.heading.replace(/\n/g, ' ')}`);
  const meta = (key: string, value: string | number, attribute = 'property') =>
    `<meta ${attribute}="${key}" content="${value}" />`;

  return [
    `<title>${title}</title>`,
    meta('description', description, 'name'),
    url && `<link rel="canonical" href="${url}" />`,
    path ? '' : meta('robots', 'noindex', 'name'),
    meta('og:type', 'website'),
    meta('og:site_name', escape(SITE.title)),
    meta('og:locale', SITE.locale),
    meta('og:title', title),
    meta('og:description', description),
    url && meta('og:url', url),
    meta('og:image', image),
    image.startsWith('https://') ? meta('og:image:secure_url', image) : '',
    meta('og:image:type', IMAGE.type),
    meta('og:image:width', IMAGE.width),
    meta('og:image:height', IMAGE.height),
    meta('og:image:alt', alt),
    meta('twitter:card', 'summary_large_image', 'name'),
    meta('twitter:title', title, 'name'),
    meta('twitter:description', description, 'name'),
    meta('twitter:image', image, 'name'),
    meta('twitter:image:alt', alt, 'name'),
    siteUrl && path === '/' ? structuredData(siteUrl, image) : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}

function withTags(html: string, tags: string) {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start < 0 || end < 0) throw new Error('index.html is missing the social meta markers.');
  return `${html.slice(0, start + START.length)}\n    ${tags}\n    ${html.slice(end)}`;
}

export function socialMeta(siteUrl: string): Plugin {
  return {
    name: 'the-minimalist-social-meta',
    enforce: 'post',
    configurePreviewServer(server) {
      server.middlewares.use((request, _response, next) => {
        const [path = '', query] = (request.url ?? '').split('?');
        if (path !== '/' && path in PAGE_META) {
          request.url = `${path}/index.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => withTags(html, socialTags(siteUrl, '/', PAGE_META['/'] ?? NOT_FOUND_META)),
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const index = bundle['index.html'];
        if (index?.type !== 'asset') return;
        const html = String(index.source);
        for (const [path, page] of Object.entries(PAGE_META)) {
          if (path === '/') continue;
          const source = withTags(html, socialTags(siteUrl, path, page));
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}/index.html`, source });
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source });
        }
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: withTags(html, socialTags(siteUrl, null, NOT_FOUND_META)),
        });
        const robots = ['User-agent: *', 'Allow: /', siteUrl && `Sitemap: ${siteUrl}/sitemap.xml`];
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `${robots.filter(Boolean).join('\n')}\n`,
        });
        if (!siteUrl) {
          this.warn(
            'VITE_SITE_URL is not set: share previews use relative image URLs, and canonical URLs and the sitemap are skipped.',
          );
          return;
        }
        const urls = Object.keys(PAGE_META)
          .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
          .join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      },
    },
  };
}
