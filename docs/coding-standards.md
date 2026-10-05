# Coding standards

- Clarity over cleverness; focused changes and composable components.
- Strict TypeScript includes unchecked-index and exact-optional-property checks.
  External content is unknown until validated.
- UI consumes hooks; hooks consume services; services consume repositories.
  ESLint blocks direct service/repository imports and direct fetch in UI.
- Domain rules stay React-independent; browser subscriptions belong in hooks
  and clean up observers, listeners, and animation frames.
- Use `@/` aliases, configured in both TypeScript and Vite.
- Prefer local state. Avoid blanket memoization, DI containers, and indiscriminate barrels.
- Use shared CSS tokens; calculated per-frame transforms may use inline styles.
- Review files approaching 300–400 lines by responsibility, not just length.
- Follow Prettier; comments explain constraints or intent.
- Commit the lockfile, without secrets, downloads, builds, or local QA outputs.

Dependencies are pinned. TypeScript 6.0.3 is the newest stable compiler supported
by the installed typescript-eslint parser; 7.0.2 was rejected by its peer range.
Upgrade compiler/parser together rather than forcing an unsupported installation.
