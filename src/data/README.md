# Application data

Keep application JSON here. Files are bundled at build time; editing them requires
rebuilding the site. No runtime JSON fetches or extra Hostinger setup are needed.

| File                   | Content                                                                         | Consumer                                                                |
| ---------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `service-details.json` | Software, Website, and Branding detail narratives and illustrative preview copy | Service details repository → validation service → `useServiceDetail`    |
| `works.json`           | Concept studies, ordering, visibility, descriptions, and semantic media keys    | Works repository/media resolver → validation service → collection hooks |
| `templates.json`       | Provisional website template catalog                                            | Templates repository → validation service → `useTemplates`              |
| `testimonials.json`    | Approved testimonial text and identities                                        | Testimonials repository/media adapter → service → `useTestimonials`     |
| `products.json`        | Product introductions, availability, and checklists                             | Site content repository → service → `useSiteContent('products')`        |
| `service-process.json` | Listen / Shape / Build / Launch captions                                        | Site content chain → `useServiceProcess`                                |
| `inquiry.json`         | Inquiry labels, hints, prompts, and choices                                     | Site content chain → `useInquiryForm`                                   |
| `page-intros.json`     | Studio, Services, Products, and Contact overview introductions                  | Site content chain → `useSiteContent('pages')`                          |
| `studio.json`          | Studio point of view, principles, and portal copy                               | Site content chain → `useSiteContent('studio')`                         |
| `contact.json`         | Public email, display hours, and reply guidance                                 | Site content chain; build-time studio metadata                          |
| `founders.json`        | Founder identities and profile links                                            | Portrait adapter; build-time structured data                            |
| `social.json`          | Public social channels and primary-channel selection                            | Social adapter; build-time structured data                              |
| `page-meta.json`       | Route titles, descriptions, and sharing artwork copy                            | Routing metadata adapter; static HTML, sitemap, and share-image scripts |
| `lotus.json`           | Shared brand mark geometry                                                      | Brand adapter; social and email artwork scripts                         |

## Editing

- Preserve existing keys and structure. `src/types/` defines the contracts; run
  `npm run check` after edits. The site content service also rejects blank text,
  empty lists, unknown product statuses, and missing/duplicate inquiry kinds.
- Product status is `available` or `soon`. Inquiry kinds remain `general`, `quote`,
  and `appointment`; meeting values remain `Online` and `In person` because the
  form pairs those values with specific icons. Keep the four process stages in
  their drawing order: Listen, Shape, Build, Launch.
- Software detail platform IDs remain `web`, `mobile`, `desktop`, `api`, and
  `embedded`; the service requires exactly one of each. Their titles, captions,
  and examples are editable. Device drawing geometry stays in TypeScript.
- A work's `asset` is a semantic filename prefix such as `forma` or `still`.
  `works.media.ts` resolves responsive AVIF/WebP images, or WebM/MP4 videos and
  their posters. Use local optimised assets; no remote URLs or generated filenames.
  Keep concept flags explicit and record rights in `docs/media-sources.md`.
- Founder slugs and testimonial media keys must match their TypeScript media
  adapters. Service detail preview assets also remain bundler-managed in code.
- Put plain text in JSON. Keep JSX, route definitions, validation, state,
  interaction messages tied to delivery outcomes, icon selection, asset imports,
  shaders, and motion geometry/timing in their existing modules. Small component
  control labels stay with their controls. Existing navigation, brand, and profile
  adapters are static presentation/configuration exceptions to the content chain.
- Package manifests, TypeScript configuration, backend runtime data, generated
  manifests, and tool settings retain their conventional locations. Never put
  credentials or private contact submissions here.

Run `npm run test:e2e` when changing interactive choices, content structure, or media.
The sharing generators (`media:social`, `media:email-logo`) and deployment audit
read these same files; do not create copies in their previous locations.
