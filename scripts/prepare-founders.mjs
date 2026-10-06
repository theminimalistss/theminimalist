import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = '.cache/founders';
const OUTPUT = 'src/assets/images/founders';
const CROPS = {
  'daisy-nuique': { x: 0.196, y: 0.39, width: 0.569 },
  'rex-pinili': { x: 0.133, y: 0.39, width: 0.569 },
};

await mkdir(OUTPUT, { recursive: true });
for (const [name, crop] of Object.entries(CROPS)) {
  const source = `${SOURCE}/${name}.png`;
  const { width = 0, height = 0 } = await sharp(source).metadata();
  const box = {
    left: Math.round(width * crop.x),
    top: Math.round(height * crop.y),
    width: Math.round(width * crop.width),
    height: Math.round(width * crop.width * 1.25),
  };
  for (const size of [480, 960]) {
    const portrait = sharp(source)
      .rotate()
      .extract(box)
      .resize(size, Math.round(size * 1.25));
    await portrait
      .clone()
      .avif({ quality: 55, effort: 5 })
      .toFile(`${OUTPUT}/${name}-${size}.avif`);
    await portrait.clone().webp({ quality: 78 }).toFile(`${OUTPUT}/${name}-${size}.webp`);
  }
}
console.info(`Prepared founder portraits in ${OUTPUT}.`);
