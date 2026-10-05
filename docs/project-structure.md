# Project structure

| Location                               | Responsibility                                                 |
| -------------------------------------- | -------------------------------------------------------------- |
| `src/types/work.ts`                    | Discriminated media types and repository contract              |
| `src/repositories/works.content.ts`    | Replaceable concept data/local asset references                |
| `src/repositories/works.repository.ts` | Infrastructure adapter                                         |
| `src/services/works.service.ts`        | Validation, normalization, selection, ordering                 |
| `src/hooks/`                           | Loading, observers, visibility, dialogs, animation integration |
| `src/utils/spiral.ts`                  | Pure spatial math                                              |
| `src/constants/motion.ts`              | Loop timing/geometry constants                                 |
| `src/router/`                          | Routes and lazy fallback                                       |
| `src/ui/sections/Hero/`                | Hero shell, controls, spiral, gallery, statement, footer       |
| `src/ui/components/`                   | Logo, media, metadata, dialogs, error boundary                 |
| `src/ui/styles/`                       | Tokens, typography, global and focused component CSS           |
| `src/assets/`                          | Optimized production media                                     |
| `src/tests/`, colocated tests, `e2e/`  | Fixtures and behavior tests                                    |
| `scripts/`                             | Media acquisition/processing/audit and version checks          |
| `.cache/`, `artifacts/`                | Ignored source cache and QA outputs                            |
| `.agent/`                              | Concise AI handoff records                                     |
| `docs/briefs/`                         | Original user-provided master prompts                          |

Future config/layout modules are added when needed, without empty abstractions.
Imported assets receive content hashes in production.
