# Phase 4: Development Projects — Frontend Implementation Plan

> **Status:** PLANNING — Awaiting user approval before implementation begins
> **Backend:** All 6 controllers, 5 entities, 5 services, DTOs, seeder, migration — COMPLETE
> **Frontend repo:** `C:\Users\OYALE\Desktop\Project\PIPDC-Frontend`

---

## Overview

Implement the frontend for the **Development Projects** feature — a real-estate project management module where Admins manage projects with units/updates, and Clients can browse and track projects they're interested in.

### What we're building
- **Public pages:** Browse development projects, view project detail
- **Admin section:** CRUD projects, manage units per project, manage updates per project
- **Client section:** Track/untrack projects, view tracked projects
- **Landing page:** Featured projects section

### API endpoints (backend)

| Area | Method | Endpoint | Auth |
|------|--------|----------|------|
| Admin Projects | GET/POST | `/api/development-projects` | Admin |
| Admin Projects | GET/PUT/DELETE | `/api/development-projects/{id}` | Admin |
| Admin Projects | PUT | `/api/development-projects/{id}/featured` | Admin |
| Admin Units | GET/POST | `/api/development-projects/{projectId}/units` | Admin |
| Admin Units | PUT/DELETE | `/api/development-projects/{projectId}/units/{unitId}` | Admin |
| Admin Updates | GET/POST | `/api/development-projects/{projectId}/updates` | Admin |
| Admin Updates | PUT/DELETE | `/api/development-projects/{projectId}/updates/{updateId}` | Admin |
| Public Browse | GET | `/api/development-projects/browse` | None |
| Public Browse | GET | `/api/development-projects/browse/{slug}` | None |
| Public Browse | GET | `/api/development-projects/browse/{id}` | None |
| Client Tracking | GET/POST | `/api/development-tracking` | Auth |
| Client Tracking | DELETE | `/api/development-tracking/{projectId}` | Auth |
| Admin Tracking | GET | `/api/admin/development-tracking` | Admin |
| Admin Tracking | DELETE | `/api/admin/development-tracking/{trackingId}` | Admin |
| Admin Tracking | PUT | `/api/admin/development-tracking/{trackingId}/status` | Admin |

---

## Implementation Steps

### Step 1: Types (`src/types/development.ts`) — NEW FILE

All development project TypeScript types mirroring backend DTOs.

- Status enums as string union types: `DevelopmentProjectStatus`, `DevelopmentUnitStatus`, `DevelopmentTrackingStatus`
- Entity interfaces: `DevelopmentProject`, `DevelopmentProjectDetail`, `DevelopmentUnit`, `DevelopmentUpdate`, `DevelopmentTracking`, `AdminDevelopmentTracking`
- Filter interfaces: `DevelopmentProjectFilters`, `DevelopmentTrackingFilters`
- Pattern: same as `src/types/index.ts`

---

### Step 2: Service (`src/services/developmentService.ts`) — NEW FILE

API service layer with methods for all endpoints. Follows exact pattern from `propertyService.ts`:
- Object literal with named async methods
- `api.get<T>()` with generic types
- `params: filters` for query parameters
- `Record<string, unknown>` payloads for create/update

---

### Step 3: Query hooks (`src/hooks/queries.ts`) — MODIFY

Add to `queryKeys`:
- `developmentProjects(f)`, `featuredDevelopmentProjects`, `developmentProject(slug)`, `developmentProjectById(id)`
- `developmentUnits(projectId)`, `developmentUpdates(projectId)`
- `developmentTracking(f)`, `adminDevelopmentTracking(f)`

Add new hooks: `useDevelopmentProjects`, `useDevelopmentProject`, `useFeaturedDevelopmentProjects`, `useAdminDevelopmentProjects`, `useDevelopmentUnits`, `useDevelopmentUpdates`, `useDevelopmentTracking`, `useAdminDevelopmentTracking`

---

### Step 4: Mutation hooks (`src/hooks/mutations.ts`) — MODIFY

Add 13 mutations following `useInvalidate` pattern:
- Projects: `useCreateDevelopmentProject`, `useUpdateDevelopmentProject`, `useSetDevelopmentFeatured`, `useDeleteDevelopmentProject`
- Units: `useCreateDevelopmentUnit`, `useUpdateDevelopmentUnit`, `useDeleteDevelopmentUnit`
- Updates: `useCreateDevelopmentUpdate`, `useUpdateDevelopmentUpdate`, `useDeleteDevelopmentUpdate`
- Tracking: `useTrackDevelopmentProject`, `useStopDevelopmentTracking`, `useUpdateTrackingStatus`

---

### Step 5: Shared helpers (`src/utils/developmentStatus.ts`) — NEW FILE

Label/color helpers for development status enums (follows `src/utils/enquiryStatus.ts` pattern):
- `developmentStatusLabel(status)` — e.g. "InConstruction" → "In Construction"
- `developmentStatusTone(status)` — maps to Badge tones: forest/gold/red/neutral
- `unitStatusLabel(status)` / `unitStatusTone(status)`
- `trackingStatusLabel(status)` / `trackingStatusTone(status)`

---

### Step 6: Admin Section — DevelopmentsSection (`src/components/dashboard/sections/DevelopmentsSection.tsx`) — NEW FILE

Main admin dashboard section for managing development projects. Follows `PropertiesSection.tsx` pattern:
- Table of projects with name, location, status badge, progress %, unit/update counts, featured toggle, row actions
- `CardTable`/`RowActions`/`LoadingRows`/`TableEmpty` from `shared.tsx`
- Click row → navigate to `/dashboard/developments/{id}` detail page
- `?new=1` URL param support for opening create form
- Mounted via `DashboardSectionPage` with `section="developments"`

---

### Step 7: Admin Project Form (`src/components/forms/DevelopmentProjectForm.tsx`) — NEW FILE

Create/edit project modal. Follows `PropertyForm.tsx` pattern:
- react-hook-form + zod schema
- Fields: name, description (textarea), location, developer, status (select), expectedCompletionDate (date), progressPercentage (number 0-100), featured (checkbox, admin-only), images (newline-joined URL strings)
- Images: `PublicId` field auto-generated as `"manual-{index}"` for URL-based images (no file upload — matches existing pattern)
- Reset on open with existing project data for edit mode
- Modal size="lg"

---

### Step 8: Admin Project Detail Page (`src/pages/dashboard/DevelopmentDetailPage.tsx`) — NEW FILE

Sub-page for managing a single project's units and updates. Accessed via `/dashboard/developments/:projectId`.

Layout:
- Breadcrumb: Dashboard > Developments > {Project Name}
- Project summary card (name, status, progress, location)
- Tabbed or stacked sections:
  - **Units table:** list/add/edit/delete units (CardTable with UnitForm modal)
  - **Updates table:** list/add/edit/delete updates (CardTable with UpdateForm modal)

---

### Step 9: Admin Unit Form (`src/components/forms/DevelopmentUnitForm.tsx`) — NEW FILE

Create/edit unit modal. Fields:
- unitIdentifier (text), unitType (text), status (select), price (number), currency (text, default NGN), description (textarea)
- Follows same react-hook-form + zod pattern

---

### Step 10: Admin Update Form (`src/components/forms/DevelopmentUpdateForm.tsx`) — NEW FILE

Create/edit project update modal. Fields:
- title (text), description (textarea), progressPercentage (number 0-100), updateDate (date), imageUrls (newline-joined textarea)
- Follows same react-hook-form + zod pattern

---

### Step 11: Public Browse Page (`src/pages/DevelopmentsPage.tsx`) — NEW FILE

Public listing page at `/developments`. Follows `PropertiesPage.tsx` pattern:
- Filters in URL search params (keyword, status)
- Paginated grid of DevelopmentProjectCard components
- Pagination component

---

### Step 12: Public Development Card (`src/components/development/DevelopmentCard.tsx`) — NEW FILE

Card component for grid display. Shows:
- Cover image, project name, location, status badge, progress bar, unit count
- Links to `/developments/:slug`
- framer-motion entrance animation

---

### Step 13: Public Detail Page (`src/pages/DevelopmentDetailsPage.tsx`) — NEW FILE

Detail page at `/developments/:slug`. Follows `PropertyDetailsPage.tsx` pattern:
- Gallery (images array with active image state + thumbnails)
- Project info: name, description, location, developer, status, progress bar, expected completion date
- Units table (available units with price)
- Updates timeline (chronological project updates with images)
- Track/Untrack button (auth-gated — redirects to login if unauthenticated)
- Share button (copy URL to clipboard)

---

### Step 14: Landing Page Section (`src/pages/home/FeaturedDevelopmentsSection.tsx`) — NEW FILE

Featured development projects section on HomePage. Follows `WhyChooseSection` pattern:
- `useFeaturedDevelopmentProjects()` hook
- Grid of DevelopmentCard components (max 3-4)
- framer-motion `whileInView` animation
- "View All Developments" link

---

### Step 15: Navigation & Routing Updates

**`src/components/layouts/Sidebar.tsx`** — MODIFY:
- Add to `adminItems`: `{ label: 'Developments', to: '/dashboard/developments', icon: HardHat }`
- Add to `clientItems`: `{ label: 'Tracked Projects', to: '/dashboard/tracked', icon: Radar }`

**`src/pages/dashboard/DashboardSectionPage.tsx`** — MODIFY:
- Add `'developments'` and `'tracked'` to `DashboardSection` union
- Add config, icons, and section render

**`src/App.tsx`** — MODIFY:
- Add public routes: `/developments` (DevelopmentsPage), `/developments/:slug` (DevelopmentDetailsPage)
- Add dashboard routes:
  - `/dashboard/developments` → `<AdminGuard><DashboardSectionPage section="developments" /></AdminGuard>`
  - `/dashboard/developments/:projectId` → `<AdminGuard><DevelopmentDetailPage /></AdminGuard>`
  - `/dashboard/tracked` → `<DashboardSectionPage section="tracked" />`

---

### Step 16: Client Tracked Section (`src/components/dashboard/sections/TrackedDevelopmentsSection.tsx`) — NEW FILE

Client dashboard section showing tracked projects. Follows `SavedSection.tsx` pattern:
- `useDevelopmentTracking()` hook
- Grid/list of tracked projects with project name, status, tracked date
- Stop tracking button per item
- Links to `/developments/{slug}`

---

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/types/development.ts` | CREATE |
| 2 | `src/services/developmentService.ts` | CREATE |
| 3 | `src/hooks/queries.ts` | MODIFY |
| 4 | `src/hooks/mutations.ts` | MODIFY |
| 5 | `src/utils/developmentStatus.ts` | CREATE |
| 6 | `src/components/dashboard/sections/DevelopmentsSection.tsx` | CREATE |
| 7 | `src/components/forms/DevelopmentProjectForm.tsx` | CREATE |
| 8 | `src/pages/dashboard/DevelopmentDetailPage.tsx` | CREATE |
| 9 | `src/components/forms/DevelopmentUnitForm.tsx` | CREATE |
| 10 | `src/components/forms/DevelopmentUpdateForm.tsx` | CREATE |
| 11 | `src/pages/DevelopmentsPage.tsx` | CREATE |
| 12 | `src/components/development/DevelopmentCard.tsx` | CREATE |
| 13 | `src/pages/DevelopmentDetailsPage.tsx` | CREATE |
| 14 | `src/pages/home/FeaturedDevelopmentsSection.tsx` | CREATE |
| 15 | `src/components/layouts/Sidebar.tsx` | MODIFY |
| 16 | `src/pages/dashboard/DashboardSectionPage.tsx` | MODIFY |
| 17 | `src/App.tsx` | MODIFY |
| 18 | `src/components/dashboard/sections/TrackedDevelopmentsSection.tsx` | CREATE |

**13 new files, 5 modified files**

---

## Implementation Order

1. **Types + Service** (Steps 1-2) — foundation, no dependencies
2. **Queries + Mutations** (Steps 3-4) — data layer
3. **Status helpers** (Step 5) — shared utilities
4. **Admin section** (Steps 6-10) — dashboard management
5. **Public pages** (Steps 11-14) — browsing experience
6. **Navigation + Routing** (Step 15) — wire everything together
7. **Client tracking section** (Step 16) — client-facing feature
8. **Verify** — `npm run build` + `npm run lint`

---

## Design Decisions

1. **No file uploads** — Images use URL strings (consistent with existing property/blog pattern)
2. **Admin detail page** — Units and updates are managed on a per-project sub-page (not in a modal) because projects can have many units/updates
3. **Public detail** — Full project page with gallery, units table, and update timeline
4. **Tracking** — Simple button toggle on public detail page, list view in client dashboard
5. **Slug routing** — Public pages use slug, admin pages use ID
6. **Progress bar** — Visual progress indicator using the `progressPercentage` field
