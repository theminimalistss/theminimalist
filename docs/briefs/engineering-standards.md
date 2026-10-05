# MASTER ENGINEERING PROMPT
## PROJECT ARCHITECTURE + CODING STANDARDS

Build this project as a production-quality React application.

The implementation must prioritize:

- maintainability
- scalability
- performance
- accessibility
- testability
- clean architecture
- strict TypeScript
- clear separation of concerns
- minimal technical debt
- easy AI/developer handoff

Do not treat this as a prototype.

The final codebase should be suitable for production deployment and continued development by another engineer or AI coding agent.

---

## 01. Tech Stack

Use the latest stable versions available at implementation time.

Core:

- React
- TypeScript
- Vite

Recommended supporting tools:

- React Router
- Vitest
- React Testing Library
- Playwright
- ESLint
- Prettier

Install additional dependencies only when they provide a clear architectural or functional benefit.

Avoid unnecessary packages. Prefer native browser APIs and React capabilities before adding larger dependencies.

---

## 02. Required Architecture

The application must follow this dependency flow:

```text
REPOSITORY
↓
SERVICE
↓
HOOKS
↓
UI
```

Short form:

```text
repo -> service -> hooks -> ui
```

Dependencies must flow in this direction.

Do not allow UI components to bypass these layers.

Correct:

```text
UI -> Hook -> Service -> Repository
```

Incorrect:

```text
UI -> Repository
UI -> fetch()
Component -> business logic -> storage/API
```

The architecture must maintain a clear distinction between:

- data access
- business logic
- application state
- presentation

---

## 03. Repository Layer

Location:

```text
src/repositories/
```

Responsibilities:

- data access
- local JSON/content retrieval
- browser persistence
- API adapters
- remote data access
- media metadata retrieval
- data source abstraction

Repositories should expose clean interfaces to the service layer.

Examples:

- `projects.repository.ts`
- `journal.repository.ts`
- `services.repository.ts`
- `contact.repository.ts`

Example:

```ts
interface ProjectsRepository {
  getAll(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
}
```

Repository implementations should hide where the data comes from.

The service layer should not need to know whether information comes from JSON, REST, GraphQL, a CMS, localStorage, Supabase, or another backend.

Do not perform business logic inside repositories.

---

## 04. Service Layer

Location:

```text
src/services/
```

Services contain application and business logic.

Examples:

- `projects.service.ts`
- `journal.service.ts`
- `contact.service.ts`
- `media.service.ts`

Responsibilities:

- validation
- business rules
- filtering
- sorting
- transformations
- orchestration
- normalization
- application-level decisions

Services consume repositories.

Do not place React-specific logic inside services.

Services must remain testable without React.

---

## 05. Hook Layer

Location:

```text
src/hooks/
```

Hooks connect React to application services.

Examples:

- `useProjects.ts`
- `useProject.ts`
- `useJournal.ts`
- `useContactForm.ts`
- `useSound.ts`
- `useReducedMotion.ts`
- `useMediaQuery.ts`

Responsibilities:

- consuming services
- loading state
- error state
- React state
- lifecycle integration
- exposing application behavior to UI
- browser API subscriptions and cleanup

Hooks should not become large business-logic containers.

Business rules belong in services.

---

## 06. UI Layer

Location:

```text
src/ui/
```

Recommended structure:

```text
src/ui/
├── components/
├── sections/
├── layouts/
├── pages/
└── styles/
```

Responsibilities:

- presentation
- rendering
- user interactions
- layout
- accessibility
- visual state

UI components consume hooks.

UI components must not directly fetch API data, access repositories, contain substantial business logic, duplicate shared transformation logic, or manage infrastructure concerns.

---

## 07. Recommended Project Structure

```text
/
├── .agent/
│   ├── README.md
│   ├── PROJECT_STATE.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── CHANGELOG.md
│   └── TODO.md
│
├── docs/
│   ├── architecture.md
│   ├── project-structure.md
│   ├── coding-standards.md
│   ├── testing.md
│   ├── accessibility.md
│   ├── performance.md
│   ├── media-pipeline.md
│   └── deployment.md
│
├── public/
├── scripts/
├── src/
│   ├── assets/
│   │   ├── audio/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── videos/
│   ├── config/
│   ├── constants/
│   ├── repositories/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── router/
│   ├── ui/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── sections/
│   │   └── styles/
│   ├── tests/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── CHANGELOG.md
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Preserve the core dependency flow:

```text
repository -> service -> hooks -> UI
```

---

## 08. TypeScript Standards

Use strict TypeScript.

- Enable strict compiler settings.
- Avoid `any` unless absolutely unavoidable.
- Prefer `unknown` for unvalidated external data.
- Create explicit domain types.
- Keep types close to the domain they represent.
- Validate untrusted external data before treating it as a domain type.

Example:

```ts
type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
};
```

---

## 09. Clean Code

Follow clean-code principles.

Code should be understandable primarily through naming, structure, typing, and composition rather than comments.

Use descriptive names.

Prefer:

```ts
getProjectBySlug()
```

over:

```ts
getData()
```

Functions and components should have one primary responsibility.

Avoid extremely long files and giant components.

---

## 10. DRY Principle

Follow DRY: Don't Repeat Yourself.

Extract repeated:

- business logic
- transformations
- constants
- hooks
- UI patterns
- configuration

Do not prematurely abstract code.

Prefer meaningful reuse over abstraction for abstraction's sake.

---

## 11. SOLID Principles

Apply SOLID where it improves the architecture, especially:

- Single Responsibility Principle
- Dependency Inversion
- Interface Segregation

Do not force enterprise-style abstractions into simple frontend code.

Avoid unnecessary factories, service containers, decorators, abstract classes, or DI frameworks unless they solve a real problem.

---

## 12. Component Design

Prefer composition.

Avoid giant configurable god components.

Prefer clear domain components such as:

- `ProjectGallery`
- `ProjectCard`
- `ProjectMetadata`

Components should have focused APIs.

Avoid excessive prop drilling, but do not introduce global state solely to avoid passing a few props.

---

## 13. State Management

Use local React state by default.

Use URL state where appropriate.

Use context only for genuinely shared application-level state.

Do not introduce Redux, Zustand, or another global state manager unless complexity genuinely requires it.

---

## 14. Constants

Avoid magic values.

Prefer named constants such as:

```ts
BREAKPOINTS.tablet
TRANSITION_DURATION.pageExit
```

Centralize values when they represent shared application concepts.

---

## 15. Configuration

Keep environment-specific values in environment variables and/or `src/config/`.

Do not hardcode API URLs, secrets, analytics IDs, private keys, or deployment-specific values.

Provide `.env.example` and document required environment variables.

---

## 16. Error Handling

Handle expected errors explicitly.

Do not silently swallow errors.

Services should return or throw meaningful errors.

UI should provide appropriate:

- loading states
- error states
- empty states

Use error boundaries where appropriate.

---

## 17. Routing

Centralize route configuration in:

```text
src/router/
```

Lazy-load route-level pages where beneficial.

Provide a fallback route and custom 404 page.

Avoid scattering route strings throughout the application.

---

## 18. Testing Standard

Testing is mandatory.

Use:

- Vitest
- React Testing Library
- Playwright for critical end-to-end flows

Test business logic thoroughly.

Target 100% meaningful coverage for core service/business logic.

Do not create meaningless tests only to increase coverage numbers.

Test:

- repositories
- services
- hooks
- important reusable UI
- forms
- routing behavior
- validation
- critical interaction logic
- accessibility behavior

---

## 19. Repository Testing

Test:

- successful retrieval
- missing records
- malformed input
- expected mapping behavior
- failure conditions

Mock external dependencies at the repository boundary where appropriate.

---

## 20. Service Testing

Services require comprehensive unit tests.

Test:

- business rules
- filtering
- sorting
- validation
- transformations
- edge cases
- failures
- empty data

Service tests should not require rendering React.

---

## 21. Hook Testing

Test hooks where they contain meaningful behavior.

Verify:

- initial state
- successful state
- error state
- lifecycle behavior
- cleanup

Avoid testing trivial pass-through hooks unnecessarily.

---

## 22. UI Testing

Use React Testing Library.

Prefer semantic queries:

- `getByRole()`
- `getByLabelText()`
- `getByText()`

Avoid excessive `data-testid` usage.

Test user-observable behavior rather than internal implementation details.

---

## 23. End-to-End Testing

Use Playwright for critical journeys such as:

- navigating between main pages
- opening a project
- using navigation
- submitting a form
- handling validation
- mobile menu interaction
- keyboard navigation

---

## 24. Test Commands

Provide scripts similar to:

```bash
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

All should succeed before completion.

---

## 25. Performance Standards

Performance is a first-class requirement.

Use:

- route-level code splitting
- lazy loading
- responsive media
- optimized assets
- dynamic imports for heavy dependencies
- efficient event handling

Avoid unnecessary re-renders.

Do not blindly wrap everything in `useMemo`, `useCallback`, or `memo`.

---

## 26. Event Handling

Avoid uncontrolled global listeners.

Prefer:

- IntersectionObserver
- ResizeObserver
- matchMedia

Clean up listeners and animation instances on unmount.

---

## 27. Animation Engineering

Animation logic must be separated from content/business logic.

Where practical:

```text
UI -> animation hook/helper -> animation library
```

Animations must clean themselves up on unmount.

Prefer GPU-friendly properties such as `transform` and `opacity`.

---

## 28. Media Engineering

Recommended structure:

```text
src/assets/
├── images/
├── videos/
├── audio/
└── fonts/
```

Use optimized formats such as:

- AVIF
- WebP
- WebM
- MP4 fallback

Avoid shipping unnecessarily large source assets.

Lazy-load below-the-fold media and prevent layout shift by defining media dimensions/aspect ratios.

---

## 29. Accessibility Engineering

Accessibility is mandatory.

Use semantic HTML first.

Requirements include:

- keyboard navigation
- visible focus states
- semantic headings
- labels for form controls
- meaningful alt text
- sufficient color contrast
- accessible navigation
- skip-to-content
- ARIA only when needed

Respect `prefers-reduced-motion`.

---

## 30. CSS / Styling Standards

Keep styling organized and predictable.

Avoid:

- excessive inline styles
- duplicated values
- massive monolithic stylesheets
- deeply nested selectors
- `!important` unless genuinely necessary

Create shared design tokens for:

- spacing
- typography
- breakpoints
- colors
- motion timing
- z-index layers

Use CSS custom properties where appropriate.

---

## 31. Responsive Engineering

Use mobile-first responsive implementation where practical.

Do not simply shrink desktop layouts.

Avoid JavaScript for layout changes that CSS can handle.

Use JavaScript media queries only when behavior, not merely layout, must change.

---

## 32. Security

Follow frontend security best practices.

- Never commit secrets.
- Never expose private API keys.
- Sanitize or safely render external/user-generated content.
- Avoid `dangerouslySetInnerHTML` unless required and properly sanitized.
- Validate form data.
- Keep dependencies updated.

---

## 33. Documentation

Create:

```text
docs/
├── architecture.md
├── project-structure.md
├── coding-standards.md
├── testing.md
├── accessibility.md
├── performance.md
├── media-pipeline.md
└── deployment.md
```

Documentation should explain important decisions concisely and focus on why the architecture exists.

---

## 34. README

Create a professional `README.md` including:

- project overview
- requirements
- technology stack
- architecture
- folder structure
- installation
- development
- available commands
- testing
- build
- deployment
- environment variables
- versioning
- AI handoff workflow

---

## 35. .gitignore

Create a complete `.gitignore` covering:

- node_modules
- dist
- coverage
- .env
- .env.*
- logs
- OS-generated files
- editor files
- temporary files
- cache directories
- temporary media processing

Do not ignore production assets required by the website.

---

## 36. Versioning

Use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Start development at:

```text
0.1.0
```

Maintain version information in:

- package.json
- CHANGELOG.md
- .agent/PROJECT_STATE.md

Follow Conventional Commit conventions when practical:

- feat
- fix
- refactor
- perf
- test
- docs
- chore

Do not automatically push commits or create remote releases without authorization.

---

## 37. Changelog

Maintain `CHANGELOG.md`.

Recommended categories:

- Added
- Changed
- Fixed
- Removed
- Performance
- Security

Do not log trivial formatting changes.

---

## 38. AI Handoff System

Create:

```text
.agent/
├── README.md
├── PROJECT_STATE.md
├── ARCHITECTURE.md
├── DECISIONS.md
├── CHANGELOG.md
└── TODO.md
```

Keep these files concise.

They are context optimization files, not full documentation.

---

## 39. .agent / PROJECT_STATE

`PROJECT_STATE.md` should contain:

- PROJECT
- VERSION
- STATUS
- CURRENT TASK
- COMPLETED
- IN PROGRESS
- KNOWN ISSUES
- IMPORTANT FILES
- NEXT RECOMMENDED TASK

Keep this document updated.

---

## 40. .agent / DECISIONS

Record important architectural decisions using this format:

```text
## YYYY-MM-DD — Decision title

Decision:
...

Reason:
...

Impact:
...
```

Do not record trivial implementation details.

---

## 41. .agent / CHANGELOG

Every meaningful AI coding session should add a concise entry.

Example:

```text
## 2026-10-06

Changed:
- ProjectGallery.tsx
- useProjects.ts
- projects.service.ts

Summary:
Added category filtering to the project gallery.

Reason:
Required for project navigation.

Tests:
All passing.
```

---

## 42. AI Development Workflow

Before modifying the project, future AI agents should:

1. Read `.agent/PROJECT_STATE.md`
2. Read `.agent/DECISIONS.md`
3. Read `.agent/ARCHITECTURE.md`
4. Inspect only files relevant to the task
5. Implement the requested change
6. Run relevant tests
7. Run TypeScript checks
8. Run linting
9. Update `.agent/PROJECT_STATE.md`
10. Add a concise `.agent/CHANGELOG.md` entry

Do not scan the entire repository if `.agent` already identifies the relevant modules.

---

## 43. Code Comments

Do not clutter the project with comments.

Comments should primarily explain:

- non-obvious decisions
- browser quirks
- performance tradeoffs
- complex algorithms
- external constraints

Prefer comments explaining WHY rather than WHAT.

---

## 44. Import Standards

Keep imports organized consistently.

Prefer configured path aliases where they improve readability:

```text
@/repositories/
@/services/
@/hooks/
@/ui/
@/types/
@/utils/
```

Configure aliases through TypeScript and Vite consistently.

Avoid circular dependencies.

---

## 45. Barrel Files

Use `index.ts` barrel files carefully.

Do not create barrel exports everywhere automatically.

Use them only where they improve public module APIs without hiding dependency direction or creating circular dependencies.

---

## 46. Dependency Rules

Allowed:

- repository -> utilities/types
- service -> repository/types/utilities
- hooks -> services/types
- UI -> hooks/types/UI utilities

Avoid:

- repository -> UI
- service -> UI
- service -> React component
- repository -> React hook
- utilities -> application-specific UI

Architecture should remain directional.

---

## 47. Domain Logic

Keep domain logic outside React whenever possible.

If behavior represents application rules, move it to the service layer.

React should primarily control rendering and interaction.

---

## 48. File Size / Complexity

Avoid enormous files.

As a guideline, investigate files approaching roughly 300–400 lines.

This is not a strict limit.

Refactor based on responsibility and cognitive complexity, not line count alone.

---

## 49. Form Architecture

Forms should follow the same architecture.

Example:

```text
ContactForm.tsx
↓
useContactForm.ts
↓
contact.service.ts
↓
contact.repository.ts
```

Validation belongs primarily in the application/service layer.

Do not put all submission logic directly inside `onSubmit()`.

---

## 50. API Integration

Future external APIs must be accessed through repository implementations.

Example:

```text
ProjectsRepository
        ↑
LocalProjectsRepository

Future:
ProjectsRepository
        ↑
CmsProjectsRepository
```

This allows infrastructure to change without rewriting UI components.

---

## 51. Observability

Production errors should be diagnosable.

Avoid random `console.log()` calls in production.

Remove temporary logs before finalizing features.

If future monitoring is added, expose it through a small abstraction rather than scattering vendor-specific APIs throughout components.

---

## 52. Build Quality Gates

Before declaring a feature complete, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

When appropriate:

```bash
npm run test:e2e
```

No feature should be considered complete while introducing TypeScript errors, linting errors, failing tests, broken production builds, or uncaught console errors.

---

## 53. Performance Quality Targets

Target approximately:

- Lighthouse Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Monitor:

- LCP
- CLS
- INP

Do not sacrifice maintainability for negligible benchmark improvements.

---

## 54. Definition of Done

The implementation is complete only when:

- architecture follows repo -> service -> hooks -> UI
- TypeScript is strict and clean
- no unnecessary `any`
- business logic is tested
- critical UI is tested
- production build succeeds
- lint succeeds
- typecheck succeeds
- tests succeed
- mobile behavior works
- accessibility requirements are addressed
- performance is reasonable
- errors are handled
- media is optimized
- README is current
- documentation is current
- CHANGELOG is current
- semantic version is current
- `.agent` context is current
- no obvious duplicated logic remains
- no temporary debugging code remains
- no secrets are committed
- no unnecessary comments clutter the repository

---

## 55. Core Engineering Principle

Always optimize for:

```text
CLARITY > CLEVERNESS
```

Prefer:

- simple architecture
- clear boundaries
- predictable behavior
- strong typing
- small APIs
- testable logic

Over:

- overengineering
- complex abstraction
- clever one-liners
- premature optimization
- unnecessary frameworks

The project should be understandable by another experienced developer without needing the original author to explain it.

Build software that is easy to:

- READ
- TEST
- CHANGE
- EXTEND
- DEBUG
- HAND OFF
