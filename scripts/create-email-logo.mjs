import { mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const lotus = JSON.parse(await readFile('src/data/lotus.json', 'utf8'));
const INK = '#1a3122';
const WIDTH = 46;
const SCALE = 3;
const { viewBox } = lotus;
const height = Math.round((WIDTH * viewBox.height) / viewBox.width);
const pad = lotus.strokeWidth;
const paths = lotus.paths.map((d) => `<path d="${d}"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH * SCALE}" height="${height * SCALE}" viewBox="${viewBox.x - pad} ${viewBox.y - pad} ${viewBox.width + pad * 2} ${viewBox.height + pad * 2}">
<g fill="none" stroke="${INK}" stroke-width="${lotus.strokeWidth * 1.6}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;

await mkdir('public/email', { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/email/lotus.png');
console.log(
  `public/email/lotus.png ${WIDTH * SCALE}×${height * SCALE} (shown at ${WIDTH}×${height})`,
);
