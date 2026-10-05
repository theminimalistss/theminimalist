import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const meta = JSON.parse(await readFile('src/router/pageMeta.json', 'utf8'));
const lotus = JSON.parse(await readFile('src/constants/lotus.json', 'utf8'));
const { site } = meta;
const INK = '#1a3122';
const ACCENT = '#726b4e';
const LINE = '#cfc9bb';
const MAX_LINE = 16;

const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function lotusMark(x, y, width, color, strokeWidth = lotus.strokeWidth) {
  const { viewBox } = lotus;
  const scale = width / viewBox.width;
  const paths = lotus.paths.map((d) => `<path d="${d}"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${scale}) translate(${-viewBox.x} ${-viewBox.y})" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
}

function wrap(heading) {
  if (heading.includes('\n')) return heading.split('\n');
  const lines = [];
  for (const word of heading.split(' ')) {
    const last = lines.at(-1);
    if (last && `${last} ${word}`.length <= MAX_LINE) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  if (lines.length === 1 && lines[0].includes(' ')) {
    const words = lines[0].split(' ');
    return [words.slice(0, -1).join(' '), words.at(-1)];
  }
  return lines;
}

function socialCard(page) {
  const lines = wrap(page.heading);
  const size = lines.length > 2 ? 64 : 76;
  const lineHeight = size * 1.05;
  const top = 330 - ((lines.length - 1) * lineHeight) / 2;
  const text = lines
    .map((line, index) => {
      const accent = index === lines.length - 1;
      const font = accent
        ? `font-family="Georgia,serif" font-style="italic" font-size="${size * 1.08}" letter-spacing="-2"`
        : `font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="500" font-size="${size}" letter-spacing="-3"`;
      return `<text x="600" y="${top + index * lineHeight}" text-anchor="middle" ${font}>${escape(line)}</text>`;
    })
    .join('');
  const sans = 'font-family="Helvetica Neue,Helvetica,Arial,sans-serif"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${site.background}"/>
<g fill="${ACCENT}" ${sans} font-size="15" letter-spacing="5">
<text x="560" y="104" text-anchor="end">EST.</text>
<text x="640" y="104">${site.established}</text>
</g>
${lotusMark(570, 76, 60, INK, 18)}
<text x="600" y="${top - size * 1.15}" text-anchor="middle" fill="${ACCENT}" ${sans} font-size="16" letter-spacing="4">${escape(page.eyebrow.toUpperCase())}</text>
<g fill="${INK}">${text}</g>
<path d="M330 528H870" stroke="${LINE}"/>
<text x="600" y="566" text-anchor="middle" fill="${INK}" ${sans} font-size="15" letter-spacing="5">${escape(site.title.toUpperCase())}</text>
</svg>`;
}

function icon(size, padding) {
  const width = size * (1 - padding * 2);
  const height = (width * lotus.viewBox.height) / lotus.viewBox.width;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="${site.themeColor}"/>
${lotusMark((size - width) / 2, (size - height) / 2, width, site.background, 24)}
</svg>`;
}

const render = (svg, file) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);

await rm('public/social', { recursive: true, force: true });
await mkdir('public/social', { recursive: true });
const images = new Map(Object.values(meta.pages).map((page) => [page.image, page]));
if (!images.has(meta.notFound.image)) throw new Error('The 404 page must reuse an existing image.');
for (const [name, page] of images) await render(socialCard(page), `public/social/${name}.png`);
await render(icon(180, 0.18), 'public/apple-touch-icon.png');
await render(icon(192, 0.2), 'public/icon-192.png');
await render(icon(512, 0.2), 'public/icon-512.png');
await writeFile(
  'public/site.webmanifest',
  `${JSON.stringify(
    {
      name: site.title,
      short_name: site.name,
      start_url: '/',
      display: 'browser',
      background_color: site.background,
      theme_color: site.background,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    null,
    2,
  )}\n`,
);
console.info(`Created ${images.size} social images, app icons, and the web manifest.`);
