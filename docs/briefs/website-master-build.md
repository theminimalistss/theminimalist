# THE MINIMALIST — WEBSITE MASTER BUILD PROMPT
## Production Engineering Standards + Website Style Foundation + Phase 1 Hero / Landing Experience

> Project: The Minimalist Design Studio website  
> Current scope: Phase 1 — build the landing / hero experience only  
> Tech stack: React + TypeScript + Vite  
> Architecture: repository -> service -> hooks -> UI for application/data behavior  
> Design direction: Warm Contemporary Editorial Minimalism  
> Hero interaction reference: https://loop-agency.framer.website/home-spiral

---

# 0. EXECUTION MODE

Build this as production-quality work, not as a disposable prototype.

Optimize for:

- clarity
- maintainability
- visual fidelity
- scalability
- strict typing
- performance
- accessibility
- testability
- clean architecture
- minimal technical debt
- easy developer / AI handoff

Core principle:

```text
CLARITY > CLEVERNESS
```

Do not overengineer simple frontend concerns. Use abstractions only when they solve a real problem.

For AI coding agents:

- reason carefully before changing architecture
- inspect existing project state before modifying code
- preserve established design tokens and conventions
- avoid rewriting unrelated files
- document meaningful architectural decisions
- run validation / quality gates before declaring the task complete

---

# 1. SOURCE OF TRUTH

This build must combine and preserve the intent of these project references:

1. `VOLUME_Studio_Engineering_Master_Prompt.md`
   - production architecture
   - coding standards
   - testing
   - media engineering
   - accessibility
   - performance
   - documentation
   - AI handoff
   - quality gates

2. `The Minimalist — Website Style Foundation.docx`
   - visual direction
   - color system
   - typography
   - layout
   - shape/UI styling
   - motion
   - portfolio philosophy

3. Hero interaction reference:
   - `https://loop-agency.framer.website/home-spiral`
   - use the interaction concept as inspiration
   - do not create a literal visual clone
   - do not reuse the reference site's branding, copy, assets, or source code

4. Current Phase 1 direction:
   - the hero itself is a moving Selected Works experience
   - work items form a continuous spiral / spatial loop
   - content alternates between image-led and video-led work
   - video media plays while the spiral is moving
   - every work item includes project text / metadata
   - the loop must feel seamless and continuous

When project requirements conflict, prioritize:

```text
project-specific requirements
>
accessibility + production quality
>
design foundation
>
reference-site behavior
```

---

# 2. CURRENT SCOPE — PHASE 1 ONLY

Build the landing / hero page first.

Do not build the full website yet.

The planned website may later include:

- Home
- About
- Works
- Services
- Products
- Founders
- Testimonials
- Contact
- Inquiries / Quote / Appointment

But this implementation should focus only on the landing experience and the reusable foundations required to support it.

Do not prematurely implement the other pages.

It is acceptable to create:

- routing infrastructure
- shared layout shell
- design tokens
- placeholder route targets
- reusable work/media primitives
- documentation needed for future expansion

Do not build full content for pages outside Phase 1.

---

# 3. REQUIRED TECH STACK

Use the latest stable versions available at implementation time.

Core:

- React
- TypeScript
- Vite

Recommended:

- React Router
- Vitest
- React Testing Library
- Playwright
- ESLint
- Prettier

Animation:

Choose one primary animation strategy and document the decision.

Preferred decision order:

1. CSS transforms / requestAnimationFrame for the continuous spatial loop when sufficient
2. a lightweight animation library only if it materially simplifies the implementation
3. GSAP only if the spiral behavior genuinely requires its timeline / transform capabilities

Do not install multiple animation libraries for the same job.

Use native browser APIs where practical.

Do not add dependencies without clear architectural or functional benefit.

---

# 4. APPLICATION ARCHITECTURE

For application behavior and data-driven features, preserve:

```text
REPOSITORY
↓
SERVICE
↓
HOOKS
↓
UI
```

Equivalent dependency direction:

```text
UI -> Hook -> Service -> Repository
```

Do not allow:

```text
UI -> Repository
UI -> fetch()
UI component -> business logic -> persistence/API
```

## Important practical rule

Do not force static presentational content through all four layers merely for ceremony.

Allowed for static presentation:

```text
typed config / design token / local constant
↓
UI
```

Use the full repository -> service -> hooks -> UI path when the feature represents data access, application behavior, future CMS/API content, persistence, normalization, filtering, validation, or business rules.

For the hero Selected Works data, use the full architecture because these projects should be replaceable later by real portfolio data or a CMS.

---

# 5. REQUIRED PROJECT STRUCTURE

Use this as the baseline:

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
│   ├── media-sources.md
│   └── deployment.md
│
├── public/
├── scripts/
├── src/
│   ├── assets/
│   │   ├── audio/
│   │   ├── fonts/
│   │   ├── images/
│   │   │   └── hero/
│   │   └── videos/
│   │       └── hero/
│   │
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
│
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Suggested Phase 1 modules:

```text
src/
├── repositories/
│   └── works.repository.ts
├── services/
│   └── works.service.ts
├── hooks/
│   ├── useHeroWorks.ts
│   ├── useSpiralLoop.ts
│   ├── useMediaPlayback.ts
│   ├── useReducedMotion.ts
│   └── useMediaQuery.ts
├── types/
│   └── work.ts
└── ui/
    ├── components/
    │   ├── WorkItem.tsx
    │   ├── WorkImage.tsx
    │   ├── WorkVideo.tsx
    │   ├── WorkMeta.tsx
    │   ├── StudioLogo.tsx
    │   └── MenuTrigger.tsx
    ├── sections/
    │   └── Hero/
    │       ├── Hero.tsx
    │       ├── HeroHeader.tsx
    │       ├── WorkSpiral.tsx
    │       ├── HeroStatement.tsx
    │       └── HeroScrollHint.tsx
    └── pages/
        └── HomePage.tsx
```

Names may be adjusted if a cleaner project structure is justified.

---

# 6. TYPESCRIPT STANDARDS

Use strict TypeScript.

Requirements:

- enable strict compiler settings
- avoid `any`
- use `unknown` for unvalidated external data
- define explicit domain types
- validate untrusted data
- prefer discriminated unions when media behavior differs
- no unsafe casting merely to silence compiler errors

Suggested work model:

```ts
type WorkBase = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  href?: string;
  alt: string;
};

type ImageWork = WorkBase & {
  mediaType: "image";
  src: string;
  width: number;
  height: number;
};

type VideoWork = WorkBase & {
  mediaType: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
};

type Work = ImageWork | VideoWork;
```

Do not make UI components depend on unvalidated raw external data.

---

# 7. REPOSITORY LAYER

Location:

```text
src/repositories/
```

Responsibilities:

- retrieve work data
- abstract local JSON / future CMS / future API
- expose clean data access interfaces
- hide infrastructure details from services

For Phase 1, local typed content is acceptable as the repository source.

Example:

```ts
interface WorksRepository {
  getFeaturedWorks(): Promise<Work[]>;
}
```

The repository must not contain animation or presentation logic.

---

# 8. SERVICE LAYER

Location:

```text
src/services/
```

Responsibilities:

- validate / normalize work data
- determine selected / featured work sequence
- guarantee required video poster data
- prevent malformed media entries
- future filtering / sorting / CMS normalization

Services must remain React-independent and unit-testable.

Do not place React lifecycle code inside services.

---

# 9. HOOK LAYER

Location:

```text
src/hooks/
```

Hooks bridge React with application services and browser behavior.

Phase 1 hooks may include:

- `useHeroWorks`
- `useSpiralLoop`
- `useMediaPlayback`
- `useReducedMotion`
- `useMediaQuery`

Responsibilities:

- loading / error state
- React state
- animation lifecycle integration
- viewport / observer subscriptions
- media playback coordination
- cleanup

Do not allow hooks to become containers for large business rules.

---

# 10. UI LAYER

Location:

```text
src/ui/
```

Responsibilities:

- presentation
- rendering
- interaction
- layout
- accessible visual state

UI components may consume hooks and typed presentation config.

UI components must not:

- fetch directly
- access repositories directly
- contain large business rules
- duplicate transformation logic
- manage infrastructure details

Use component composition.

Avoid giant configurable components.

---

# 11. CLEAN CODE / DRY / SOLID

Follow:

- Single Responsibility
- Dependency Inversion where beneficial
- Interface Segregation where beneficial
- DRY without premature abstraction

Prefer clear domain names.

Good:

```text
getFeaturedWorks()
normalizeWorkMedia()
WorkSpiral
WorkVideo
HeroStatement
```

Avoid vague names:

```text
getData()
CardThing()
Helper2()
```

Investigate files approaching roughly 300–400 lines.

Refactor based on responsibility and cognitive complexity, not arbitrary line limits.

Avoid:

- unnecessary factories
- abstract classes without a real need
- service containers
- overbuilt dependency injection
- global state libraries unless complexity genuinely requires them

Use local React state by default.

---

# 12. THE MINIMALIST — VISUAL DIRECTION

## Primary design direction

**Warm Contemporary Editorial Minimalism**

with:

- Swiss Modernist structure
- refined brutalist accents
- warm premium art direction

The site should feel:

**Light · Premium · Editorial · Confident · Alive**

It must not feel:

- cold
- corporate
- generic SaaS
- overly soft lifestyle luxury
- excessively decorative
- aggressively brutalist
- template-like

## Interpretation rule

Swiss Modernism and refined brutalism are primarily structural / compositional influences.

They should influence:

- grid
- alignment
- hierarchy
- metadata
- typographic scale
- controlled asymmetry
- occasional compositional tension

They should not override the warm, inviting brand atmosphere.

---

# 13. VISUAL PRINCIPLES

Use:

- large editorial imagery
- strong typography
- generous whitespace
- asymmetric but controlled compositions
- precise grid and alignment
- warm neutral backgrounds
- deep forest green for strong brand moments
- minimal rounded corners
- thin dividers
- subtle motion
- project-specific colors inside portfolio media

Avoid:

- card-heavy layouts
- large pill buttons
- excessive shadows
- glassmorphism
- unnecessary gradients
- decorative blobs
- excessive corner rounding
- generic agency-template sections
- clutter

Use typography, spacing, imagery, and line work as the primary structural tools.

---

# 14. COLOR FOUNDATION

Use these tokens as the default website palette:

```text
Soft Ivory      #F4EEE5  — primary canvas / main background
Moss Ink        #1D231D  — primary text
Deep Forest     #1A3122  — brand color / strong dark moments
Cashmere Beige  #E8DDD0  — secondary background / surface
Olive Taupe     #726B4E  — supporting accent
Muted Clay      #A46F57  — optional warm accent
```

Core creative rule:

> Ivory is the canvas. Moss Ink is the voice. Deep Forest is the identity.

Usage guidance:

- body text should primarily use Moss Ink
- Deep Forest should be reserved for deliberate brand moments
- Cashmere Beige should act as a secondary surface, not primary text
- Olive Taupe should be used selectively
- Muted Clay should primarily be decorative / accent usage, not normal body text
- project imagery is allowed to introduce its own colors

Do not force studio colors over every project.

---

# 15. TYPOGRAPHY FOUNDATION

Primary:

**Inter Tight**

Editorial accent:

**Instrument Serif**

Use:

```text
Display / Headlines        Inter Tight Medium 500
Body                       Inter Tight Regular 400
Navigation / Buttons       Inter Tight Medium 500
Labels / Metadata          Inter Tight Medium 500
Editorial Statements       Instrument Serif Regular 400
Editorial Emphasis         Instrument Serif Italic 400
```

Target ratio:

```text
~85% Inter Tight
~15% Instrument Serif
```

Instrument Serif is an accent, not the default heading font.

Use it for moments of editorial warmth or emphasis.

Do not turn the entire site into a traditional luxury-serif composition.

---

# 16. GRID / LAYOUT FOUNDATION

Use an underlying responsive grid:

```text
Desktop: 12 columns
Tablet:   8 columns
Mobile:   4 columns
```

Principle:

> Strong alignment underneath expressive compositions.

The website may look asymmetrical while remaining structurally rigorous.

Use generous section spacing.

Allow selected work layouts to intentionally break symmetry while still deriving positions from the grid.

The hero is allowed to use a spatial / perspective system layered over this grid.

---

# 17. SHAPE / UI STYLE

Corners:

```text
mostly 0–4px
```

Borders:

- thin
- restrained
- low visual noise

Avoid:

- large rounded cards
- large pill buttons
- card stacks used only to create structure

Prefer:

- whitespace
- typography
- imagery
- lines
- alignment
- scale

---

# 18. MOTION FOUNDATION

Motion must feel:

**Subtle · Smooth · Intentional**

Allowed uses:

- project movement
- image / video reveals
- project transitions
- hover states
- typography entrances
- gentle parallax
- spatial depth cues

Avoid:

- animation on every element
- excessive bouncing
- novelty transitions
- large spring overshoots
- motion that distracts from work
- scroll hijacking

The hero spiral is the primary expressive motion system.

All secondary animation should remain quieter than the spiral.

Respect `prefers-reduced-motion`.

---

# 19. PORTFOLIO PRINCIPLE

The site should feel like:

> a curated gallery or design publication

not:

> a conventional agency template

Core creative rule:

> The studio provides the structure. The work provides the energy.

The global interface stays restrained.

Individual project media can introduce more color, personality, typography, and motion.

---

# 20. PHASE 1 HERO — CREATIVE CONCEPT

## Concept

Create a full-viewport Selected Works hero inspired by the spatial looping behavior of:

`https://loop-agency.framer.website/home-spiral`

The inspiration is the interaction concept:

- works distributed through a spiral / helix-like spatial composition
- content moves continuously
- the sequence loops seamlessly
- some work items are images
- some work items are videos
- project metadata is integrated with each item
- the work itself becomes the hero experience

Do not copy:

- the original brand identity
- exact type styling
- exact project content
- exact image positions
- exact source code
- exact copy
- proprietary assets

Build an original implementation appropriate for The Minimalist.

---

# 21. HERO EXPERIENCE

The hero should occupy approximately one full dynamic viewport:

```css
min-height: 100svh;
```

The initial visual impression should be:

- spacious
- editorial
- art-directed
- alive
- premium
- visually confident

The Selected Works spiral is the focal point.

The shell around it remains minimal.

Suggested viewport composition:

```text
TOP LEFT                               TOP RIGHT
Studio identity / logo                Menu

                SELECTED WORKS
              SPATIAL LOOP / SPIRAL

        image work        video work
                hero work
    video work                    image work

BOTTOM LEFT                           BOTTOM RIGHT
short studio statement               subtle scroll / motion cue
```

Do not interpret this as fixed pixel placement.

Use it as compositional intent.

---

# 22. HERO COMPONENT MODEL

Build the hero from focused reusable components.

Suggested structure:

```text
HomePage
└── Hero
    ├── HeroHeader
    │   ├── StudioLogo
    │   └── MenuTrigger
    │
    ├── WorkSpiral
    │   ├── WorkItem
    │   │   ├── WorkImage OR WorkVideo
    │   │   └── WorkMeta
    │   ├── WorkItem
    │   ├── WorkItem
    │   └── ...
    │
    ├── HeroStatement
    └── HeroScrollHint
```

Do not place the entire experience in one monolithic `Hero.tsx`.

`WorkItem` must be driven by data.

---

# 23. WORK CONTENT MODEL

Each item should represent a work/project.

Minimum metadata:

- id
- slug
- title
- category
- year
- media type
- media source
- alt text
- width / height or aspect ratio
- poster image for videos
- optional project route

Example categories:

- Brand Identity
- Website Design
- UI/UX
- Digital Product
- Art Direction
- Campaign Design

During Phase 1, use temporary work content if real portfolio assets are not yet available.

Do not imply stock media is final client work.

Keep placeholder/demo data easy to replace.

---

# 24. IMAGE / VIDEO RHYTHM

The spiral should intentionally mix stillness and motion.

Target rhythm:

```text
IMAGE
VIDEO
IMAGE
VIDEO
IMAGE
VIDEO
```

This does not need to be mathematically strict forever.

The purpose is to produce alternating visual energy.

Use video when motion adds value.

Use imagery when a still composition is stronger.

The visitor should immediately understand that The Minimalist works across static brand expression and digital / motion experiences.

---

# 25. PROJECT ITEM TYPOGRAPHY / METADATA

Each media item should contain or be directly paired with minimal project information.

Recommended structure:

```text
top-left:     category
top-right:    year
bottom-left:  project title
```

Alternative metadata placement is acceptable when required by image contrast, but the system must remain consistent.

Use concise labels.

Keep typography integrated into the editorial composition.

Avoid bulky captions or card footers.

The media should remain dominant.

---

# 26. SPIRAL / LOOP BEHAVIOR

The loop must feel continuous and physically coherent.

Required behavior:

- constant slow movement
- seamless repetition
- no visible end
- no snap-back
- no obvious restart
- no empty gap between the end and beginning
- stable frame rate
- controlled spatial depth
- consistent visual rhythm

The movement should resemble an exhibition / orbit / spatial editorial sequence rather than a conventional carousel.

The spiral may use:

- perspective
- translation
- scale
- subtle rotation
- z-depth
- opacity adjustments only when useful

Do not overdo 3D rotation.

Cards must remain readable.

The center / foreground work should naturally appear larger and more important.

Distant works may appear smaller because of depth, not arbitrary styling.

---

# 27. LOOP IMPLEMENTATION STRATEGY

Use an implementation that remains maintainable.

Possible approach:

1. Define a normalized progress value.
2. Give each work item an offset within the repeated sequence.
3. Map each item's normalized position to:
   - x
   - y
   - z
   - scale
   - optional rotation
4. Wrap progress mathematically so items recycle without a visible jump.
5. Render enough repeated items / logical instances to maintain continuity.
6. Keep source work data unique even when visual instances repeat.

Do not duplicate business data unnecessarily merely to fake a loop.

Separate:

```text
work content
from
visual loop instances
```

Animation math should live in an animation hook/helper, not inside content components.

---

# 28. MOTION SPEED

Do not make the loop fast.

It should feel like slow exhibition movement.

Users must have time to:

- identify media
- read project titles
- notice video motion
- understand depth

Avoid making the visitor chase moving content.

If interaction modifies speed, changes should be subtle.

Do not add aggressive inertial dragging unless specifically requested later.

---

# 29. VIDEO BEHAVIOR

Video items are visual portfolio media, not traditional players.

Required:

```text
autoplay
muted
loop
playsInline
no default controls
```

Each video must include:

- optimized video source
- poster image
- explicit dimensions / aspect ratio
- accessible fallback behavior

Playback optimization:

- play when visible or near the visible hero region
- pause when sufficiently outside the useful viewport region
- use `IntersectionObserver` where appropriate
- avoid decoding every offscreen loop instance continuously
- do not rely on sound
- do not request autoplay with audio

If autoplay is prevented, poster imagery must preserve the composition.

---

# 30. REDUCED MOTION

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

- do not run the continuous spiral automatically
- provide a stable editorial arrangement or manually scrollable Selected Works presentation
- video autoplay should be disabled or reduced appropriately
- content must remain fully discoverable
- no functionality may depend solely on motion

Accessibility takes priority over exact reference behavior.

---

# 31. HERO HEADER

Use a restrained edge-based header.

Desktop:

- studio identity / logo aligned top-left
- menu trigger aligned top-right
- generous offset from viewport edges
- no heavy navigation bar background

The header should not compete with the spiral.

Use Soft Ivory / transparent integration where appropriate.

The menu control must:

- be keyboard accessible
- have an accessible name
- show a visible focus state
- use semantic `button` behavior

The complete full-site menu does not need to be built in Phase 1 unless required for basic navigation.

---

# 32. HERO STATEMENT

Place a short studio positioning statement toward an edge of the viewport, preferably lower-left on larger screens.

It should be secondary to the work.

Do not use an enormous generic marketing headline that competes with the Selected Works.

Copy should remain concise and easy to replace.

The typography can introduce a small Instrument Serif accent, but Inter Tight should remain dominant.

Temporary copy is allowed until final copy is supplied.

---

# 33. RESPONSIVE BEHAVIOR

Do not merely scale down desktop.

## Desktop

- full spatial spiral
- approximately 5–7 visually present work items depending on viewport
- strong foreground/background depth
- edge-based UI
- generous whitespace

## Tablet

- reduce spiral radius / spatial spread
- reduce simultaneous visual density
- preserve clear focal item
- maintain alternating image/video rhythm
- keep metadata readable

## Mobile

Preserve the concept without forcing a desktop 3D layout into a narrow screen.

Preferred behavior:

- simplified vertical / diagonal spatial loop
- approximately 3–4 visible work items
- one dominant foreground work
- reduced depth and rotation
- stable text readability
- no horizontal overflow
- touch-safe controls

If the full spiral becomes visually or technically compromised, prioritize:

```text
portfolio rhythm
continuous movement
media alternation
editorial composition
```

over exact desktop geometry.

---

# 34. MEDIA SOURCING — TEMPORARY PHASE 1 ASSETS

For now, source temporary images and videos from legitimate online libraries with clear usage rights.

Preferred examples may include:

- Unsplash
- Pexels
- Pixabay
- other reputable sources with explicit commercial-friendly licensing

Do not assume an asset is free merely because it is publicly accessible.

Never scrape random copyrighted portfolio work to populate the site.

For every downloaded external asset:

1. verify its license / allowed usage
2. save the source URL
3. save creator attribution information when available
4. record the date accessed
5. note whether attribution is required
6. document it in:

```text
docs/media-sources.md
```

Temporary stock media must be replaceable later with actual The Minimalist project assets.

---

# 35. DOWNLOAD MEDIA — DO NOT HOTLINK

Do not use remote image/video URLs as production asset URLs.

Workflow:

```text
source online
↓
verify usage
↓
download
↓
rename semantically
↓
optimize
↓
store locally
↓
use optimized local output in website
```

Benefits:

- reliable loading
- control over optimization
- no third-party layout surprises
- no dependence on external hotlinks
- easier deployment
- easier future asset replacement

Use semantic filenames.

Example:

```text
hero-brand-editorial-01.avif
hero-digital-motion-01.webm
hero-digital-motion-01-poster.avif
```

Do not ship original oversized downloads when optimized derivatives exist.

---

# 36. IMAGE OPTIMIZATION

Preferred formats:

1. AVIF
2. WebP fallback when useful

For each image:

- crop intentionally for the intended work frame
- preserve sufficient quality for large editorial display
- avoid unnecessary oversized dimensions
- generate responsive variants where beneficial
- define intrinsic dimensions
- prevent layout shift
- strip unnecessary metadata when appropriate

Do not use a 5000–8000px source directly in the browser just because it exists.

The optimized target should be based on actual rendered dimensions and high-DPI needs.

Use scripts so the process is repeatable.

Document the pipeline in:

```text
docs/media-pipeline.md
```

---

# 37. VIDEO OPTIMIZATION

Preferred:

```text
WebM
MP4 fallback when appropriate
```

For hero videos:

- remove audio track unless it is genuinely required
- use web-appropriate codec settings
- reduce excessive bitrate
- use dimensions appropriate to the rendered frame
- generate a poster image
- keep duration reasonable for a looping visual
- avoid huge source files
- make loop endpoints visually clean when possible

Create a repeatable media optimization script in `scripts/`.

Do not manually optimize in an undocumented one-off workflow.

---

# 38. MEDIA PERFORMANCE

The hero is media-heavy, so performance is a first-class requirement.

Required:

- define media dimensions / aspect ratio
- lazy-load assets that are not immediately needed
- prioritize only the media required for the opening composition
- avoid downloading every possible source variant immediately
- pause irrelevant offscreen videos
- avoid multiple videos decoding invisibly
- use `IntersectionObserver`
- use responsive image sources where beneficial
- avoid cumulative layout shift

Use a poster or preview strategy so the composition appears immediately even before all videos are ready.

---

# 39. PERFORMANCE ENGINEERING

Use:

- route-level code splitting where useful
- lazy loading
- optimized assets
- efficient animation loops
- transform / opacity for animated properties
- requestAnimationFrame when implementing custom animation
- event cleanup on unmount
- observers instead of noisy scroll listeners where possible

Avoid:

- layout thrashing
- animating expensive layout properties
- unnecessary re-renders
- blind `useMemo` / `useCallback`
- continuously decoding hidden videos
- duplicate animation loops

Target approximately:

```text
Lighthouse Performance     90+
Accessibility              95+
Best Practices             95+
SEO                        95+
```

Monitor:

- LCP
- CLS
- INP

Do not sacrifice maintainability for negligible benchmark improvements.

---

# 40. ACCESSIBILITY

Accessibility is mandatory.

Use:

- semantic HTML
- correct heading hierarchy
- keyboard navigation
- visible focus states
- meaningful media alt text
- accessible menu controls
- skip-to-content
- sufficient color contrast
- ARIA only when needed
- reduced-motion support

Decorative media should not create noisy screen-reader output.

Project links must have meaningful accessible names.

Do not encode essential project information only inside images.

---

# 41. CSS / DESIGN TOKENS

Create centralized design tokens.

At minimum:

- colors
- typography
- spacing
- grid
- breakpoints
- motion duration
- easing
- z-index
- corner radius
- border styles

Prefer CSS custom properties.

Example naming direction:

```css
:root {
  --color-canvas: #f4eee5;
  --color-text: #1d231d;
  --color-brand: #1a3122;
  --color-surface: #e8ddd0;
  --color-accent: #726b4e;
  --color-warm-accent: #a46f57;
}
```

Do not scatter raw hex values throughout components.

Avoid:

- excessive inline style objects
- monolithic global stylesheet
- deeply nested selectors
- `!important` except for genuine edge cases

Animation transforms may use calculated inline CSS custom properties when that is the cleanest solution.

---

# 42. RESPONSIVE ENGINEERING

Use mobile-first responsive implementation where practical.

Do not use JavaScript for layout differences that CSS can handle.

Use JavaScript media queries only when behavior must change, not simply layout.

Examples of valid behavior changes:

- reducing loop instance count
- changing animation geometry
- disabling autoplay
- reduced-motion mode

---

# 43. ROUTING

Centralize routing in:

```text
src/router/
```

For Phase 1:

- `/` -> HomePage
- project links may remain disabled / placeholder if project pages do not yet exist
- do not scatter hardcoded route strings throughout components

Provide a basic fallback route / 404 structure if routing is installed.

---

# 44. ERROR / EMPTY / LOADING STATES

Even a visual hero needs resilient states.

Handle:

- works loading
- invalid work data
- empty work list
- image load failure
- video failure
- autoplay failure

Fallback behavior should preserve the visual composition.

Do not show broken media icons.

Use poster / fallback media where appropriate.

---

# 45. TESTING STANDARD

Testing is mandatory.

Use:

- Vitest
- React Testing Library
- Playwright for critical browser behavior

## Repository tests

Test:

- successful work retrieval
- missing data
- malformed work entry
- expected mapping behavior

## Service tests

Test:

- normalization
- media-type validation
- required poster validation for video
- empty data
- ordering / featured selection

## Hook tests

Where meaningful, verify:

- initial state
- loading / successful state
- cleanup
- reduced-motion behavior
- media playback observer cleanup

## UI tests

Test:

- semantic rendering
- accessible work links
- image/video branching
- menu button accessibility
- reduced-motion fallback where practical

## E2E

At minimum:

- homepage loads
- opening hero renders without console errors
- keyboard can reach interactive controls
- video elements are muted / playsInline
- responsive mobile experience does not overflow
- reduced-motion mode remains usable

Do not write meaningless tests solely to inflate coverage.

---

# 46. SECURITY

- never commit secrets
- never expose private keys
- validate external data
- avoid unsafe HTML injection
- keep dependencies updated
- do not use `dangerouslySetInnerHTML` without a valid sanitized requirement

No API keys should be required merely to load temporary stock assets because those assets are downloaded and stored locally.

---

# 47. IMPORTS / ALIASES

Configure readable path aliases consistently in TypeScript and Vite.

Suggested:

```text
@/repositories/
@/services/
@/hooks/
@/ui/
@/types/
@/utils/
@/config/
@/constants/
```

Avoid circular dependencies.

Use barrel files only when they improve a real public module API.

Do not create `index.ts` everywhere automatically.

---

# 48. DOCUMENTATION

Create and maintain:

```text
docs/
├── architecture.md
├── project-structure.md
├── coding-standards.md
├── testing.md
├── accessibility.md
├── performance.md
├── media-pipeline.md
├── media-sources.md
└── deployment.md
```

`media-sources.md` should include a table such as:

```text
Filename | Type | Source URL | Creator | License / Usage | Accessed | Notes
```

Documentation should explain why major decisions exist, not merely repeat code.

---

# 49. README

Create a professional `README.md` including:

- project overview
- current project phase
- requirements
- tech stack
- architecture
- folder structure
- setup / installation
- development
- commands
- testing
- build
- media optimization workflow
- deployment
- environment variables
- versioning
- AI handoff workflow

---

# 50. .GITIGNORE

Include:

- node_modules
- dist
- coverage
- .env
- .env.*
- logs
- OS-generated files
- editor files
- cache
- temporary files
- temporary media processing output

Do not ignore production media that the deployed website requires.

---

# 51. VERSIONING

Use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Start development at:

```text
0.1.0
```

Maintain version in:

- `package.json`
- `CHANGELOG.md`
- `.agent/PROJECT_STATE.md`

Use Conventional Commit conventions when practical:

- feat
- fix
- refactor
- perf
- test
- docs
- chore

Do not push or publish remote releases without authorization.

---

# 52. AI HANDOFF SYSTEM

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

Keep these concise.

Before a future AI agent changes the project:

1. read `.agent/PROJECT_STATE.md`
2. read `.agent/DECISIONS.md`
3. read `.agent/ARCHITECTURE.md`
4. inspect only files relevant to the task
5. implement the requested change
6. run relevant tests
7. run TypeScript checks
8. run lint
9. update `.agent/PROJECT_STATE.md`
10. add a concise `.agent/CHANGELOG.md` entry

Do not scan or rewrite the entire repository when the context files already identify the relevant modules.

---

# 53. BUILD QUALITY GATES

Before declaring Phase 1 complete, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

When Playwright is configured:

```bash
npm run test:e2e
```

No feature is complete while introducing:

- TypeScript errors
- lint errors
- failing tests
- broken production builds
- uncaught console errors
- broken media
- inaccessible keyboard interactions

---

# 54. PHASE 1 ACCEPTANCE CRITERIA

The Hero / Landing experience is complete only when all of the following are true.

## Visual

- [ ] Soft Ivory is the dominant canvas.
- [ ] Moss Ink is the dominant text color.
- [ ] The interface feels warm, editorial, premium, confident, and alive.
- [ ] The composition uses controlled asymmetry.
- [ ] The selected works are the primary visual focus.
- [ ] The hero does not resemble a SaaS template.
- [ ] The hero does not visually copy Loop's branding.
- [ ] The work provides most of the visual color and energy.

## Spiral

- [ ] Selected works move continuously through a spatial spiral / loop.
- [ ] The loop is seamless.
- [ ] No visible jump or reset occurs.
- [ ] Foreground work naturally appears dominant.
- [ ] Distant work has controlled depth.
- [ ] Text remains readable.
- [ ] Animation is smooth on modern desktop and mobile hardware.

## Media

- [ ] Image and video works are mixed intentionally.
- [ ] Video works autoplay muted, loop, and use playsInline.
- [ ] Video items have optimized poster images.
- [ ] Offscreen/unneeded videos do not continue wasting resources.
- [ ] Temporary online media is downloaded locally.
- [ ] Temporary media sources and usage rights are documented.
- [ ] Images are optimized.
- [ ] Videos are optimized.
- [ ] No remote hotlinked stock media remains.

## Responsive

- [ ] Desktop composition works.
- [ ] Tablet composition works.
- [ ] Mobile composition preserves the core idea.
- [ ] No accidental horizontal overflow occurs.
- [ ] Controls remain usable by touch.

## Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Media has appropriate alternative text.
- [ ] `prefers-reduced-motion` has a useful fallback.
- [ ] Menu control has an accessible name.
- [ ] Essential information is not encoded only in media.

## Engineering

- [ ] repository -> service -> hooks -> UI is used for work data.
- [ ] animation behavior is isolated from content/business logic.
- [ ] strict TypeScript passes.
- [ ] tests pass.
- [ ] build passes.
- [ ] lint passes.
- [ ] no temporary debug code remains.
- [ ] documentation is updated.
- [ ] `.agent` state is updated.

---

# 55. IMPLEMENTATION ORDER

Follow this sequence.

## Step 1 — Foundation

- initialize / inspect React + TypeScript + Vite project
- configure linting / formatting / strict TypeScript
- configure aliases
- add routing shell
- create design tokens
- install fonts correctly
- create `.agent` and docs structure

## Step 2 — Media pipeline

- identify 6–10 temporary licensed images/videos
- download locally
- document sources
- optimize image assets
- optimize video assets
- create video posters
- verify output dimensions / file sizes

## Step 3 — Work domain

- define `Work` types
- implement local repository
- implement service validation / normalization
- implement `useHeroWorks`
- add unit tests

## Step 4 — Static hero shell

Build:

- `HomePage`
- `Hero`
- `HeroHeader`
- `StudioLogo`
- `MenuTrigger`
- `HeroStatement`
- `HeroScrollHint`

Verify responsive grid and typography before motion.

## Step 5 — Work primitives

Build:

- `WorkItem`
- `WorkImage`
- `WorkVideo`
- `WorkMeta`

Verify media sizing and text contrast.

## Step 6 — Spiral engine

Implement:

- spatial mapping
- continuous progress
- seamless wrapping
- depth / scale
- controlled rotation
- cleanup

Keep animation math outside presentation components.

## Step 7 — Video playback optimization

Implement:

- autoplay/muted/loop/playsInline
- poster fallback
- visibility observer
- pause irrelevant media
- cleanup

## Step 8 — Responsive modes

Tune:

- desktop
- tablet
- mobile
- reduced-motion

Do not blindly reuse one geometry everywhere.

## Step 9 — QA

Run:

- accessibility review
- keyboard testing
- performance review
- media loading review
- tests
- typecheck
- lint
- production build
- e2e where configured

## Step 10 — Documentation / handoff

Update:

- README
- media source log
- media pipeline
- architecture docs
- `.agent/PROJECT_STATE.md`
- `.agent/CHANGELOG.md`
- main CHANGELOG

---

# 56. DO NOT DO

Do not:

- clone the Loop website literally
- reuse Loop assets
- copy Loop's text
- hotlink temporary media
- ship unoptimized source video
- install several animation libraries
- build giant components
- put work data directly in the hero JSX
- fetch directly from UI
- autoplay video with audio
- ignore reduced-motion users
- animate layout-heavy CSS properties unnecessarily
- use excessive rounded cards
- cover the site in gradients
- make Instrument Serif the dominant typeface
- create a generic SaaS hero
- build the remaining website pages before the Phase 1 hero is stable
- mark the feature complete with failing quality gates

---

# 57. FINAL CREATIVE NORTH STAR

The Minimalist hero should feel like:

> a warm, contemporary editorial exhibition where selected work continuously moves through space.

The implementation should combine:

```text
Loop-inspired spatial portfolio behavior
+
The Minimalist's warm premium art direction
+
Swiss grid discipline
+
restrained brutalist compositional tension
+
production-grade React engineering
```

The result must not feel like a carousel.

It must not feel like a generic portfolio grid.

It should feel like the visitor has entered a moving design publication.

The studio interface remains restrained.

The projects provide the visual energy.

Build Phase 1 to a level that can become the stable foundation for the rest of The Minimalist website.
