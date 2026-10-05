import { readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

let totalBytes = 0;
let failed = false;
const report = [];
for (const directory of ['src/assets/images/hero', 'src/assets/videos/hero']) {
  for (const filename of (await readdir(directory)).sort()) {
    const path = `${directory}/${filename}`;
    const { size } = await stat(path);
    totalBytes += size;
    const video = /\.(mp4|webm)$/u.test(filename);
    if (size > (video ? 1_250_000 : 200_000)) {
      console.error(`Asset exceeds budget: ${path}`);
      failed = true;
    }
    if (video) {
      const metadata = JSON.parse(
        execFileSync(
          'ffprobe',
          ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path],
          { encoding: 'utf8' },
        ),
      );
      if (metadata.streams.some((stream) => stream.codec_type === 'audio')) {
        console.error(`Unexpected audio track: ${path}`);
        failed = true;
      }
      const stream = metadata.streams.find((entry) => entry.codec_type === 'video');
      if (
        !stream ||
        stream.width !== 576 ||
        stream.height !== 720 ||
        Number(metadata.format.duration) > 8.1
      )
        failed = true;
      report.push({
        file: filename,
        KB: Math.round(size / 1024),
        dimensions: `${stream?.width}×${stream?.height}`,
        seconds: metadata.format.duration,
      });
    } else {
      const metadata = await sharp(path).metadata();
      if (![480, 960].includes(metadata.width) || metadata.height !== metadata.width * 1.25)
        failed = true;
      report.push({
        file: filename,
        KB: Math.round(size / 1024),
        dimensions: `${metadata.width}×${metadata.height}`,
        seconds: '—',
      });
    }
  }
}
console.table(report);
console.info(
  `All local media (both format variants): ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`,
);
if (failed) process.exitCode = 1;
