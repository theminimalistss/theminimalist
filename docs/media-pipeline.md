# Media pipeline

Production media is committed; normal development/deployment needs no source
access or API keys. Regeneration needs Node, Sharp, curl, and FFmpeg/ffprobe with
VP9/H.264 support.

1. Verify usage rights and record the source/creator in `media-sources.md`.
2. Add the semantic name and URL to `scripts/media-manifest.mjs`.
3. Run `npm run media:prepare`; source downloads are cached in ignored `.cache/media/`.
4. Visually review crops and loop motion.
5. Run `npm run media:audit`; update `works.content.ts`.

Images are autorotated, cropped to 4:5, stripped of unnecessary metadata, and
encoded as 480×600 / 960×1200 AVIF and WebP. Attention-based crops need visual
review, especially after replacing assets.

Video uses nine seconds of input, scales/crops to 576×720 at 24 fps, removes
audio, and produces eight-second VP9/WebM and H.264/MP4 loops. The last second
dissolves into the initial second, with the next repeat continuing from the
matching point. Bitrate caps bound water/foliage complexity. MP4 uses faststart.
A frame from the final encoding generates poster variants.

Source downloads never enter Git or the production bundle. Vite hashes local
optimized imports. The browser selects a suitable format and image resolution.

## Interface sounds

`npm run media:audio` downloads the CC0 Kenney packs into ignored `.cache/audio/`
(once), then for each mapped sound trims leading/trailing silence, applies a
9 kHz low-pass, converts to mono 48 kHz, normalizes the peak to −1 dB, adds a
12 ms fade-out, and writes Opus/WebM and MP3 to `src/assets/audio/`. Record any
new source in `media-sources.md`. The audit enforces ≤12 KB, ≤1 s, mono, and a
matching fallback per sound.

## Share images

`npm run media:social` renders `public/social/*.png`, app icons, and the web
manifest from `src/router/pageMeta.json`.
