import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const CACHE = '.cache/audio';
const OUTPUT = 'src/assets/audio';
const PACKS = {
  'interface-sounds':
    'https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip',
  'ui-audio':
    'https://kenney.nl/media/pages/assets/ui-audio/490d233f68-1677590494/kenney_ui-audio.zip',
};
const SOUNDS = {
  hover: 'ui-audio/Audio/rollover2.ogg',
  click: 'interface-sounds/Audio/select_002.ogg',
  navigate: 'interface-sounds/Audio/maximize_008.ogg',
  'menu-open': 'interface-sounds/Audio/maximize_006.ogg',
  'menu-close': 'interface-sounds/Audio/minimize_006.ogg',
  switch: 'interface-sounds/Audio/drop_002.ogg',
  detent: 'interface-sounds/Audio/tick_004.ogg',
  'sound-on': 'interface-sounds/Audio/glass_002.ogg',
};
const PEAK_DB = -1;

const run = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

await mkdir(CACHE, { recursive: true });
for (const [pack, url] of Object.entries(PACKS)) {
  if (existsSync(`${CACHE}/${pack}`)) continue;
  const zip = `${CACHE}/${pack}.zip`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${url}`);
  await writeFile(zip, Buffer.from(await response.arrayBuffer()));
  execFileSync('unzip', ['-qo', zip, '-d', `${CACHE}/${pack}`]);
}

await mkdir(OUTPUT, { recursive: true });
const shape =
  'silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-55dB,areverse,lowpass=f=9000,aformat=sample_rates=48000:channel_layouts=mono';
for (const [name, source] of Object.entries(SOUNDS)) {
  const input = `${CACHE}/${source}`;
  const staged = `${CACHE}/${name}.wav`;
  run(['-i', input, '-af', shape, staged]);
  const probe = execFileSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-i', staged, '-af', 'volumedetect', '-f', 'null', '-'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const peak = Number(/max_volume: (-?[\d.]+) dB/.exec(probe)?.[1] ?? 0);
  const filters = `volume=${(PEAK_DB - peak).toFixed(2)}dB,areverse,afade=t=in:d=0.012,areverse`;
  run([
    '-i',
    staged,
    '-af',
    filters,
    '-c:a',
    'libopus',
    '-b:a',
    '48k',
    '-vbr',
    'on',
    `${OUTPUT}/${name}.webm`,
  ]);
  run(['-i', staged, '-af', filters, '-c:a', 'libmp3lame', '-b:a', '64k', `${OUTPUT}/${name}.mp3`]);
}
console.info(`Prepared ${Object.keys(SOUNDS).length} interface sounds in ${OUTPUT}.`);
