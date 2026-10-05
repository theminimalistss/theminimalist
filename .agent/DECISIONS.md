# Architecture decisions

## 2026-10-06 — Native spatial animation

Decision: One RAF loop, normalized math, CSS transforms, ResizeObserver.

Reason: Continuous depth/wrapping needs no timeline library.

Impact: No animation dependency or per-frame React renders; testable geometry,
clean suspension for paused/hidden states.

## 2026-10-06 — Compatible current toolchain

Decision: Stable pinned dependencies and TypeScript 6.0.3.

Reason: TypeScript 7.0.2 is outside typescript-eslint 8.71.0's supported
`>=4.8.4 <6.1.0` range. Do not force unsupported peer dependencies.

Impact: Upgrade compiler and parser together when support arrives.

## 2026-10-06 — Concept collection and local media

Decision: Six labeled concepts with licensed, optimized, locally stored Pexels media.

Reason: No approved portfolio assets were supplied; the brief permits placeholders
and forbids hotlinking/false client claims.

Impact: Replace content in one module; source provenance and regeneration are documented.

## 2026-10-06 — Accessible alternate presentation

Decision: Gallery/pause controls, reduced-motion gallery, keyboard foregrounding,
and native dialogs with focus restoration.

Reason: Reading and discovery cannot require chasing moving content.

Impact: Every study remains usable with keyboard, reduced motion, or denied autoplay.

## 2026-10-06 — Validated boundary and version history

Decision: Unknown repository data validated in a React-independent service;
Semantic Versioning from 0.1.0, separate release and AI-session logs.

Reason: Future CMS replacement and efficient developer/AI handoff.

Impact: Tested data contract and automated version consistency checking.
