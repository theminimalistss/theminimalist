# Media sources and usage

Accessed **2026-10-06 (Asia/Manila)**. These are temporary concept illustrations,
not commissioned work. Concept names and editorial treatments are original
placeholder art direction and do not imply brand affiliation.

The [Pexels license](https://www.pexels.com/license/) permits website use and
modification; attribution is appreciated but not required. Images are editorial
illustrations, not trademarks or implied endorsements. Do not redistribute
unaltered assets as a stock library. Review rights when replacing media/context.

| Local prefix                | Type         | Source                                                                                                                     | Creator                    | License / attribution   | Accessed   | Treatment                                     |
| --------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------- | ---------- | --------------------------------------------- |
| `forma-*`                   | Image        | [Minimalist interior, 15867424](https://www.pexels.com/photo/furniture-in-minimalist-interior-design-15867424/)            | Thới Nam Cao               | Pexels; optional credit | 2026-10-06 | Crop/encode; Forma concept                    |
| `still.*`, `still-poster-*` | Video/poster | [Beach waves, 8303087](https://www.pexels.com/video/drone-footage-of-beach-waves-8303087/)                                 | Mikhail Nilov              | Pexels; optional credit | 2026-10-06 | Silent loop/crop/poster; Still concept        |
| `solenne-*`                 | Image        | [Minimal bottle, 7814991](https://www.pexels.com/photo/white-plastic-pump-bottle-with-shadow-on-beige-background-7814991/) | Mikhail Nilov              | Pexels; optional credit | 2026-10-06 | Crop/encode; Solenne concept                  |
| `earth.*`, `earth-poster-*` | Video/poster | [Spinning clay pot, 5633932](https://www.pexels.com/video/close-up-view-of-a-spinning-clay-pot-5633932/)                   | 8 K (profile display name) | Pexels; optional credit | 2026-10-06 | Silent loop/crop/poster; Earth & Hand concept |
| `arc-*`                     | Image        | [Architectural arches, 9530311](https://www.pexels.com/photo/architecture-arches-monochromatic-9530311/)                   | Jan van der Wolf           | Pexels; optional credit | 2026-10-06 | Crop/encode; Arc concept                      |
| `wild.*`, `wild-poster-*`   | Video/poster | [Forest sunlight, 3493297](https://www.pexels.com/video/sunlight-peeking-through-the-leaves-of-trees-in-a-forest-3493297/) | lam loi                    | Pexels; optional credit | 2026-10-06 | Silent loop/crop/poster; Wild Ground concept  |

Download URLs are in `scripts/media-manifest.mjs`. Posters derive from their
videos. Outputs live in `src/assets/images/hero` and `src/assets/videos/hero`.

## Fonts and original assets

Inter Tight and Instrument Serif are self-hosted through pinned Fontsource
packages under the SIL Open Font License. Copies in `public/licenses/` ship with
the deployed font assets.
The lotus mark redraw, favicon, share images, work naming, and UI art direction were
created for this build and are provisional pending studio approval. No Loop
assets, copy, source code, or branding were reused.

## Interface sounds

Downloaded 2026-10-06 from Kenney, **CC0 1.0 (public domain)**; attribution is
not required. Packs: [Interface Sounds](https://kenney.nl/assets/interface-sounds)
and [UI Audio](https://kenney.nl/assets/ui-audio). Processed by
`npm run media:audio` (silence trim, 9 kHz low-pass, mono 48 kHz, peak −1 dB,
short fade-out, Opus 48 kb/s and MP3 64 kb/s).

| Local name   | Source file                         |
| ------------ | ----------------------------------- |
| `hover`      | UI Audio `rollover2.ogg`            |
| `click`      | Interface Sounds `select_002.ogg`   |
| `navigate`   | Interface Sounds `maximize_008.ogg` |
| `menu-open`  | Interface Sounds `maximize_006.ogg` |
| `menu-close` | Interface Sounds `minimize_006.ogg` |
| `switch`     | Interface Sounds `drop_002.ogg`     |
| `detent`     | Interface Sounds `tick_004.ogg`     |
| `sound-on`   | Interface Sounds `glass_002.ogg`    |

The ambient bed, spiral whoosh, and preview swell are synthesized in the browser
and contain no third-party audio.
