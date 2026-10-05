# Versioning

Start at **0.1.0** with Semantic Versioning. Before 1.0, minor releases may change
contracts; patches fix compatible issues. After 1.0 use major for breaking
changes, minor for compatible additions, and patch for fixes.

Prepare a local version with `npm version 0.2.1 --no-git-tag-version`. Then add a
dated entry to `.agent/CHANGELOG.md` (release notes plus an “AI session” block),
update `VERSION:` in `.agent/PROJECT_STATE.md`, and run `npm run version:check`
and the quality gates. Package and lockfile versions must match the documentation.

Use Conventional Commits, e.g. `feat(hero): add work gallery`. When authorized,
commit reviewed changes and create an annotated `vMAJOR.MINOR.PATCH` tag. Pushing,
publishing remote releases, and deployment are separate authorized actions.

`.agent/CHANGELOG.md` is the only changelog. Each version lists product behavior
first, then the AI session's changes, intent, and verification. It does not
replace Git history.
