import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve('dist');
const { pages } = JSON.parse(await readFile('src/router/pageMeta.json', 'utf8'));
let checked = 0;
const failures = [];

async function inspectAsset(url, source) {
  if (!url.startsWith('/') || url.startsWith('//')) return;
  const pathname = new URL(url, 'https://build.invalid').pathname;
  const path = resolve(root, `.${decodeURIComponent(pathname)}`);
  if (relative(root, path).startsWith('..')) {
    failures.push(`${source}: asset escapes the build directory`);
    return;
  }
  try {
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    checked += 1;
  } catch {
    failures.push(`${source}: missing asset ${pathname}`);
  }
}

for (const route of [...Object.keys(pages), '/404']) {
  const file =
    route === '/404' ? '404.html' : `${route.slice(1)}${route === '/' ? '' : '/'}index.html`;
  try {
    const html = await readFile(resolve(root, file), 'utf8');
    if (!html.includes('id="root"') || !html.includes('type="module"')) {
      failures.push(`${file}: missing application entry`);
    }
    const assets = [...html.matchAll(/(?:src|href)="([^"\s]+)"/gu)]
      .map((match) => match[1])
      .filter((url) => /\.(?:js|css|png|svg|ico|woff2?)(?:\?|$)/u.test(url));
    for (const asset of new Set(assets)) await inspectAsset(asset, file);
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}

async function inspectDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await inspectDirectory(path);
    else if (entry.name.endsWith('.map') || entry.name.startsWith('.env')) {
      failures.push(`Unexpected public build file: ${relative(root, path)}`);
    }
  }
}
await inspectDirectory(root);
const home = await readFile(resolve(root, 'index.html'), 'utf8');
if (!home.includes('rel="canonical"')) {
  console.warn(
    'Set VITE_SITE_URL to the production HTTPS origin before the final Hostinger build.',
  );
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.info(
    `Production output verified: ${Object.keys(pages).length} routes, 404 fallback, ${checked} asset references.`,
  );
}
