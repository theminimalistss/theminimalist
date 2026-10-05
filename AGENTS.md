# The Minimalist — agent instructions

Before editing, read `.agent/PROJECT_STATE.md`, `.agent/DECISIONS.md`, and
`.agent/ARCHITECTURE.md`. Follow the task scope; the current release implements
the Phase 1 landing experience only.

- Keep work data flowing UI → hook → service → repository.
- Preserve the palette and typography in `src/ui/styles/`.
- Browser animation/playback belongs in hooks; domain rules stay in services.
- Do not hotlink media or represent concept studies as commissioned work.
- Run `npm run check`; run `npm run test:e2e` for interaction changes.
- Update `.agent/PROJECT_STATE.md` and `.agent/CHANGELOG.md` (the only changelog) after meaningful work.
- Keep release versions aligned using `docs/versioning.md`.
- Do not push or publish remote releases without the user's authorization.

Original briefs are preserved in `docs/briefs/`. Favor focused changes and concise handoff notes.
