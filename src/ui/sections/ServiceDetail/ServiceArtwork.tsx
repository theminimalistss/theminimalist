import type { ReactNode } from 'react';
import type { SoftwarePlatform } from '@/types/service';

const SYMBOLS = {
  web: (
    <>
      <rect x="5" y="9" width="38" height="30" rx="2" />
      <path d="M5 17h38M11 13h2m3 0h2M11 23h11v10H11Zm17 0h9m-9 5h9m-9 5h5" />
    </>
  ),
  mobile: (
    <>
      <rect x="14" y="4" width="20" height="40" rx="4" />
      <path d="M20 9h8m-8 29h8M19 17h10v9H19Z" />
    </>
  ),
  desktop: (
    <>
      <rect x="4" y="6" width="40" height="28" rx="2" />
      <path d="M4 28h40M20 34v7m8-7v7m-14 0h20M11 13l7 5-7 5m12 0h10" />
    </>
  ),
  api: (
    <>
      <path d="m17 15-9 9 9 9m14-18 9 9-9 9M27 10l-6 28M4 5h9M4 5v9m40 29h-9m9 0v-9" />
    </>
  ),
  embedded: (
    <>
      <rect x="12" y="12" width="24" height="24" rx="2" />
      <rect x="18" y="18" width="12" height="12" />
      <path d="M18 5v7m6-7v7m6-7v7M18 36v7m6-7v7m6-7v7M5 18h7m-7 6h7m-7 6h7m24-12h7m-7 6h7m-7 6h7" />
    </>
  ),
  layers: (
    <>
      <path d="m24 5 20 11-20 11L4 16Zm-20 19 20 11 20-11M4 32l20 11 20-11" />
    </>
  ),
  shop: (
    <>
      <path d="M6 19h36l-4-12H10Zm3 0v22h30V19M5 19c0 7 9 7 9 0 0 7 10 7 10 0 0 7 10 7 10 0 0 7 9 7 9 0M18 41V29h12v12" />
    </>
  ),
  compass: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="m30 15-3 12-12 6 6-12Zm-6-15v5m0 38v5M0 24h5m38 0h5" />
    </>
  ),
  mark: (
    <>
      <path d="m24 5 17 29H7Zm-17 29 17-10 17 10M24 5v19M24 24v19" />
      <circle cx="24" cy="24" r="4" />
    </>
  ),
  type: (
    <>
      <path d="m6 39 12-30 12 30M10 29h16m8 10V21m0 6c6-10 13-4 7 1-9 0-9 12 0 10l3-2M4 44h40" />
    </>
  ),
  box: (
    <>
      <path d="m24 5 18 10v21L24 46 6 36V15Zm-18 10 18 10 18-10M24 25v21M15 10l18 10v9" />
    </>
  ),
  social: (
    <>
      <rect x="7" y="5" width="34" height="29" rx="2" />
      <path d="m14 34-4 10 17-10M13 12h22M13 18h13M13 24h18" />
    </>
  ),
  print: (
    <>
      <path d="M12 14V5h24v9M12 35H5V15h38v20h-7M12 26h24v17H12Zm6 7h12m-12 5h8M34 21h3" />
    </>
  ),
  book: (
    <>
      <path d="M24 12c-6-6-13-7-20-5v31c7-2 14-1 20 5 6-6 13-7 20-5V7c-7-2-14-1-20 5Zm0 0v31M10 14l8 3m-8 4 8 3m12-7 8-3m-8 10 8-3" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type ServiceSymbolName = keyof typeof SYMBOLS;

export function ServiceSymbol({ name }: { name: ServiceSymbolName }) {
  return (
    <svg
      className="sd-symbol"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {SYMBOLS[name]}
    </svg>
  );
}

const DEVICES: Record<SoftwarePlatform, ReactNode> = {
  web: (
    <>
      <path className="sd-art-shadow" d="m112 92 250-32v155l-250 32Z" />
      <path className="sd-art-plane" d="m91 71 250-32v155L91 226Z" />
      <path className="sd-art-paper sd-trace" pathLength="1" d="m70 50 250-32v155L70 205Z" />
      <path d="m70 79 250-32M84 64l3-.4m7-.8 3-.4m7-.8 3-.4" />
      <path className="sd-art-plane" d="m90 96 88-11v83l-88 11Z" />
      <path d="m195 85 100-13m-100 27 100-13m-100 28 65-8m-65 31 100-13m-100 27 100-13" />
      <path className="sd-art-accent" d="m195 164 48-6v14l-48 6Z" />
      <path className="sd-art-signal sd-ambient" d="M104 239h89l32 31h95" />
      <circle cx="104" cy="239" r="5" />
      <circle cx="320" cy="270" r="5" />
    </>
  ),
  mobile: (
    <>
      <path className="sd-art-shadow" d="m165 43 113 23-24 222-113-23Z" />
      <path className="sd-art-paper sd-trace" pathLength="1" d="m148 29 113 23-24 222-113-23Z" />
      <path className="sd-art-plane" d="m155 49 96 19-19 181-96-19Z" />
      <path d="m188 43 28 5m-43 207 26 5M155 88l78 16m-82 21 78 16m-82 21 78 16m-82 21 49 10" />
      <path className="sd-art-accent" d="m161 68 61 12-1 10-61-12Z" />
      <g className="sd-art-float sd-ambient">
        <path className="sd-art-paper" d="m267 143 64 13v49l-64-13Z" />
        <path d="m280 172 9 12 25-19" />
      </g>
      <path className="sd-art-signal sd-ambient" d="M92 84H60v137h43m177 24h62v-23" />
    </>
  ),
  desktop: (
    <>
      <path className="sd-art-shadow" d="m83 53 265 32v151L83 204Z" />
      <path className="sd-art-paper sd-trace" pathLength="1" d="m70 40 265 32v151L70 191Z" />
      <path className="sd-art-plane" d="m82 55 241 29v115L82 170Z" />
      <path d="m70 175 265 32m-158-3v35m48-29v35m-64-6 81 10-36 14-81-10Z" />
      <path d="m99 79 55 7v54l-55-7Zm76 9 126 15m-126 6 93 11m-93 10 111 14m-111 5 75 9" />
      <path className="sd-art-paper" d="m106 264 205 25 38-18-205-25Z" />
      <path d="m134 261 169 21m-147-29-13 18m43-14-13 18m43-14-13 18m43-14-13 18m43-14-13 18" />
    </>
  ),
  api: (
    <>
      <path
        className="sd-art-signal sd-ambient"
        d="M84 87h88v64h96V85h70M84 238h88v-87m96 0v87h70"
      />
      {[
        [44, 57],
        [288, 55],
        [288, 208],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path className="sd-art-plane" d="m0 12 23-12 65 12-23 13Z" />
          <path className="sd-art-paper" d="m0 12 65 13v46L0 58Z" />
          <path d="m65 25 23-13v46L65 71M15 31l12 8-12 5m23 3 13 3" />
        </g>
      ))}
      <path
        className="sd-art-paper sd-trace"
        pathLength="1"
        d="m121 118 57-24 82 28v70l-57 24-82-28Z"
      />
      <path className="sd-art-plane" d="m121 118 82 28 57-24m-57 24v70" />
      <path d="m140 144 16 15-16 7m30-1 17 6M47 222h59m-59 10h42m-42 10h51" />
    </>
  ),
  embedded: (
    <>
      <path className="sd-art-shadow" d="m71 154 164-78 153 73-164 83Z" />
      <path className="sd-art-plane sd-trace" pathLength="1" d="m57 138 164-78 153 73-164 83Z" />
      <path d="M57 138v15l153 78 164-83v-15M210 216v15" />
      <path
        className="sd-art-signal sd-ambient"
        d="m84 134 45 22 34-17m60-51-36 18m144 28-43 21-30-14m-43 56 37-19 23 11"
      />
      <path className="sd-art-paper" d="m150 123 63-30 62 30v39l-63 31-62-31Z" />
      <path className="sd-art-accent" d="m150 123 62 31 63-31-62-30Z" />
      <path d="M212 154v39m-50-22-19 10m32-4-19 10m32-4-19 10m70-11 19 9m-6-16 19 9m-6-16 19 9M178 110l-19-10m33 3-19-10m63 12 19-10m-6 17 19-10" />
      <circle className="sd-art-led sd-ambient" cx="110" cy="131" r="4" />
      <circle cx="317" cy="137" r="4" />
      <path d="m111 178 21 11m-7-18 21 11m161-69 20-10m-7 17 20-10" />
    </>
  ),
};

export function PlatformDrawing({ platform }: { platform: SoftwarePlatform }) {
  return (
    <svg
      className="sd-platform-drawing"
      viewBox="0 0 440 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g className="sd-art-guides">
        <path d="m30 241 196 66 187-87M46 61v207M395 50v192" strokeDasharray="2 6" />
        <ellipse cx="220" cy="240" rx="156" ry="36" />
        <path d="M30 241h12m-6-6v12M402 220h12m-6-6v12" />
      </g>
      <g key={platform} className="sd-device-entry">
        <g className="sd-art-drift sd-ambient">{DEVICES[platform]}</g>
      </g>
    </svg>
  );
}

export function SystemDrawing() {
  return (
    <svg
      className="sd-system-drawing"
      viewBox="0 0 440 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="sd-art-guides"
        d="m34 215 186 60 186-60M45 56v171m350-171v171"
        strokeDasharray="3 6"
      />
      <path className="sd-art-signal sd-ambient" d="M90 92v93l130 43 130-43V92M220 52v176" />
      {[0, 1, 2].map((n) => (
        <g key={n} className="sd-stack-layer sd-ambient" style={{ animationDelay: `${n * -1.5}s` }}>
          <path d={`m90 ${80 + n * 48} 130-43 130 43-130 43Z`} />
          <path d={`m90 ${80 + n * 48}v10l130 43 130-43v-10M220 ${123 + n * 48}v10`} />
          <circle cx="220" cy={80 + n * 48} r="9" />
        </g>
      ))}
    </svg>
  );
}
