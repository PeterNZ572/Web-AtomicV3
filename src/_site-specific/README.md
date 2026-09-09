# Site-Specific Code

Everything in this folder belongs to the **consuming website**, not the AtomicCMS platform.

When you create a new site from AtomicCMS (Phase 2: npm package + site template), you will
copy the contents of this folder into the new site's repository and discard the rest.

---

## What lives here vs in the platform

| Location | Purpose |
|---|---|
| `src/_site-specific/` | **This site only** — agency portfolio, brand-specific blocks, dashboard UI |
| `src/collections/` | **Platform** — Users, Media, Pages, FormSubmissions, BackupHistory |
| `src/globals/` | **Platform** — BackupSettings, SiteSettings |
| `src/blocks/` | **Platform** — 14 generic blocks (Text, Image, Gallery, Form, etc.) |
| `src/fields/` | **Platform** — SEO field, content builder field |
| `src/lib/` | **Platform** — access control, utils, types, backup service |
| `src/components/page-builder/` | **Platform** — generic page builder renderers |
| `src/app/(payload)/components/admin/` | **Platform** — BackupManager, BackupNavLink, AtomicBlocksField, etc. |

---

## Files in this folder

### `collections/`
- `Projects.ts` — Atomic Digital agency portfolio collection (client, industry, services, results)
- `Testimonials.ts` — Client testimonials collection

### `blocks/`
- `ProjectCards/config.ts` — Block that displays projects from the Projects collection
- `Testimonials/config.ts` — Block that displays testimonials (requires Testimonials collection)
- `BookingSearchForm/config.ts` — Booking search UI (site-specific external integration)

### `lib/`
- `types.ts` — `ProjectDocument` type (site-specific data shape)
- `content.ts` — `getProjects()`, `getProjectBySlug()`, `getTestimonials()` data fetchers

### `components/admin/`
- `DashboardHero.tsx` — Admin dashboard showing this site's collection stats

---

## How to wire site-specific code into the platform

In `src/payload.config.ts`:
- Import `Projects` and `Testimonials` from `./_site-specific/collections/*`
- Add them to the `collections` array alongside platform collections
- Add `ProjectCardsBlock`, `TestimonialsBlock`, `BookingSearchFormBlock` to `additionalBlocks`
  via `src/fields/content-builder.ts` (or pass to the plugin config in Phase 2)
- Reference `DashboardHero` from `./_site-specific/components/admin/DashboardHero.tsx#DashboardHero`

In `src/components/page-builder/site-content-block-renderer.tsx`:
- Add any site-specific block rendering logic there
- Delegate all generic blocks back to `ContentBlockRenderer`
