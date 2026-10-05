import { execFileSync } from 'node:child_process';
import { mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';
import { images, videos } from './media-manifest.mjs';

const cache = '.cache/media';
const imageDir = 'src/assets/images/hero';
const videoDir = 'src/assets/videos/hero';
for (const directory of [cache, imageDir, videoDir]) await mkdir(directory, { recursive: true });

async function download(url, output) {
  try {
    await access(output);
  } catch {
    execFileSync(
      'curl',
      ['--fail', '--location', '--silent', '--show-error', '--retry', '2', url, '-o', output],
      { stdio: 'inherit' },
    );
  }
}

async function imageVariants(input, name) {
  for (const width of [480, 960]) {
    const crop = sharp(input)
      .rotate()
      .resize(width, Math.round(width * 1.25), { fit: 'cover', position: 'attention' });
    await crop.clone().avif({ quality: 55, effort: 5 }).toFile(`${imageDir}/${name}-${width}.avif`);
    await crop.clone().webp({ quality: 78 }).toFile(`${imageDir}/${name}-${width}.webp`);
  }
}

for (const asset of images) {
  const input = `${cache}/${asset.name}.jpg`;
  await download(asset.url, input);
  await imageVariants(input, asset.name);
  console.info(`Prepared image: ${asset.name}`);
}

for (const asset of videos) {
  const input = `${cache}/${asset.name}.mp4`;
  await download(asset.url, input);
  // A short dissolve joins the closing second to the opening second, avoiding a hard loop cut.
  const filter =
    '[0:v]fps=24,scale=576:720:force_original_aspect_ratio=increase,crop=576:720,setsar=1,split[body][head];[body]trim=start=1:end=9,setpts=PTS-STARTPTS[b];[head]trim=start=0:end=1,setpts=PTS-STARTPTS[h];[b][h]xfade=transition=fade:duration=1:offset=7,format=yuv420p[out]';
  const common = [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    String(asset.start),
    '-t',
    '9',
    '-i',
    input,
    '-filter_complex',
    filter,
    '-map',
    '[out]',
    '-an',
  ];
  execFileSync(
    'ffmpeg',
    [
      ...common,
      '-c:v',
      'libvpx-vp9',
      '-crf',
      '40',
      '-b:v',
      '650k',
      '-maxrate',
      '850k',
      '-bufsize',
      '1700k',
      '-row-mt',
      '1',
      `${videoDir}/${asset.name}.webm`,
    ],
    { stdio: 'inherit' },
  );
  execFileSync(
    'ffmpeg',
    [
      ...common,
      '-c:v',
      'libx264',
      '-crf',
      '28',
      '-maxrate',
      '850k',
      '-bufsize',
      '1700k',
      '-preset',
      'slow',
      '-movflags',
      '+faststart',
      `${videoDir}/${asset.name}.mp4`,
    ],
    { stdio: 'inherit' },
  );
  const poster = `${cache}/${asset.name}-poster.png`;
  execFileSync('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    `${videoDir}/${asset.name}.mp4`,
    '-frames:v',
    '1',
    poster,
  ]);
  await imageVariants(poster, `${asset.name}-poster`);
  console.info(`Prepared video and poster: ${asset.name}`);
}
