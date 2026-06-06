---
title: Recipe Organizer Architecture Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [architecture, overview, tanstack-start, cloudflare, edge]
---

# Introduction

This specification describes the high-level architecture of the `recipe-organizer` application — an isomorphic React app built on **TanStack Start** that runs as a single **Cloudflare Worker**. It is the entry point for understanding how the pieces fit together; every other spec under `docs/`, `docs/infrastructure/`, and `src/features/<name>/` zooms into one slice of this picture.

## 1. Purpose & Scope

- **Audience**: contributors and AI agents who need a holistic view before touching code.
- **Scope**: runtime architecture, data flow, deployment topology, security boundaries, technology choices. Not implementation details (those are in the dedicated specs).
- **Assumption**: reader has read [`./file-structure.spec.md`](./file-structure.spec.md) or is comfortable navigating the repository tree.

## 2. Definitions

| Term                  | Definition                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TanStack Start**    | Full-stack React meta-framework providing SSR, file-based routing, server functions, and isomorphic helpers, built on TanStack Router + Vite.                                  |
| **Server function**   | A callable defined with `createServerFn(...)` from `@tanstack/react-start`. Runs only on the worker; can be invoked from the client (RPC) or from a route loader (in-process). |
| **Worker**            | A Cloudflare Workers V8 isolate executing the SSR + API code on the edge, on demand, with no persistent process.                                                               |
| **D1**                | Cloudflare's serverless SQLite, accessed through the `DB` binding via `drizzle-orm/d1`.                                                                                        |
| **R2**                | Cloudflare's S3-compatible object store, accessed through the `R2_BUCKET` binding for image and video blobs.                                                                   |
| **Cloudflare Images** | Bound as `IMAGES`; used in this app to transform/encode uploads (WebP, width 1024, quality 80) before they hit R2.                                                             |
| **Service Worker**    | A Serwist-generated `/sw.js` providing offline support and runtime caching. Distinct from a Cloudflare Worker.                                                                 |
| **Route context**     | The `{ authUser, queryClient, theme, isAdmin }` object hung off every TanStack Router route after the root `beforeLoad`.                                                       |
| **Edge cache**        | `caches.default` inside the worker; used to cache R2-served responses.                                                                                                         |

## 3. Requirements, Constraints & Guidelines

### Architectural requirements

- **REQ-001**: The application MUST run as a single Cloudflare Worker. The worker entry point is `@tanstack/react-start/server-entry`, configured in `wrangler.jsonc`.
- **REQ-002**: The app runs in client-only render mode: `src/start.ts` sets `defaultSsr: false` and the root route opts into `ssr: true`. The worker renders only the document shell (and resolves auth in the root `beforeLoad`) per request; all page-route content renders on the client. Loaders prefetch data via `context.queryClient.ensureQueryData(...)` (on the client for client-only routes).
- **REQ-003**: The application MUST be a Progressive Web App: a `manifest.json` is linked from the root route, and a Serwist service worker provides offline shell + asset caching.
- **REQ-004**: All persistent data MUST live in Cloudflare D1 (relational data) or R2 (binary blobs: images, videos). No external database.
- **REQ-005**: All cross-cutting concerns (auth, data layer, server functions, forms, client state, routing/SSR, platform) MUST have a corresponding `docs/infrastructure/<topic>.spec.md` and respect the rules therein.
- **REQ-006**: Every feature MUST be self-contained under `src/features/<name>/` and own its server functions, components, and (when needed) stores/contexts. See [`./file-structure.spec.md`](./file-structure.spec.md).
- **REQ-007**: The application MUST authenticate users via Google OAuth 2.0 only. New users land in `pending` state and require admin approval. See [`../src/features/auth/auth.spec.md`](../src/features/auth/auth.spec.md).
- **REQ-008**: Server functions performing writes MUST be guarded by `authGuard()` (or `authGuard('admin')`), and write handlers that touch user-owned rows MUST additionally check `currentRow.createdBy === user.id || user.role === 'admin'`.
- **REQ-009**: Image uploads MUST be transformed to WebP (width 1024, quality 80) via Cloudflare Images before being written to R2. Video uploads are stored raw.
- **REQ-010**: The user-facing language MUST be French (UI strings, validation messages via `z.config(z.locales.fr())` in `src/router.tsx`).

### Security requirements

- **SEC-001**: Sessions MUST be encrypted server-side (TanStack `useSession`, keyed by `SESSION_SECRET`). Cookies MUST be `httpOnly`, `sameSite=lax`, and `secure` in production.
- **SEC-002**: OAuth state MUST be validated against an `oauth-session` cookie before exchanging the code (CSRF defense).
- **SEC-003**: Admin-only operations MUST use `authGuard('admin')`; failing the role check MUST throw `Permission denied`.
- **SEC-004**: User-supplied content MUST be validated server-side with Zod before reaching the database (every `createServerFn` write uses `.inputValidator(schema)`).
- **SEC-005**: R2 file keys MUST be `crypto.randomUUID()` to prevent guessable URLs.
- **SEC-006**: Secrets (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`) MUST be configured as Cloudflare Worker secrets — never committed.

### Constraints

- **CON-001**: The worker has the standard Cloudflare Workers limits — there is no long-running process, no filesystem, and no `Buffer` unless `nodejs_compat` is enabled (it is, per `wrangler.jsonc`).
- **CON-002**: D1 has SQLite semantics (no `RETURNING *` in some flows, integer-only PKs by convention here). Multi-row atomicity uses `getDb().batch([...])`.
- **CON-003**: TanStack Router's route tree is generated at build/dev time (`src/routeTree.gen.ts`). New route files require a dev-server restart.
- **CON-004**: Persistent client state (Zustand `persist`) is `localStorage`-based and therefore client-only. The app renders all route content client-only (`src/start.ts` `defaultSsr: false`; root `ssr: true`), so consumers render directly — no `<ClientOnly>` boundary or `client-only` directive is used.
- **CON-005**: `compatibility_date` is `2026-01-28` with `nodejs_compat` enabled; do not regress these without auditing the Worker runtime APIs the app relies on (e.g. `node:crypto`).

### Guidelines

- **GUD-001**: Prefer reads via TanStack Query loaders; prefer writes via mutations with `mutationOptions(...)` factories that handle cache invalidation and toasts in one place.
- **GUD-002**: Keep server functions thin: validation → DB → optional R2 → return. Push expensive logic to dedicated helpers in `src/lib/`.
- **GUD-003**: Don't duplicate server data in Zustand. Stores hold ids/selections; the actual data comes back from queries keyed by those ids.
- **GUD-004**: Use the relational query API (`getDb().query.<table>.findMany({ with, columns, where, orderBy })`) instead of hand-rolling joins. Keep relations in `defineRelations` in sync.
- **GUD-005**: Surface user-visible errors via `toastManager`; let server function failures bubble up as plain `Error("Une erreur est survenue")` thanks to `withServerError(...)`.

### Patterns

- **PAT-001**: Feature module pattern — `api/`, `components/`, optional `hooks/`/`contexts/`/`utils/`/`types/`/`lib/`, and a colocated spec.
- **PAT-002**: Server-function-per-file pattern — each `api/<verb>.ts` exports both the bare `createServerFn(...)` and a TanStack Query `*Options()` factory.
- **PAT-003**: Form pattern — Zod schema in the API file → `withForm(...)` view → wrap in `getFormDialog(...)` (modal) or use directly in a route (page form). Errors flow through `formatFormErrors`.
- **PAT-004**: Authoring pattern for cross-cutting infra — add helper to `src/lib/<topic>.ts`, document in `docs/infrastructure/<topic>.spec.md`, link from this file.

## 4. Interfaces & Data Contracts

### Runtime topology

```
            ┌────────────────────────────────────────────────────────┐
            │                  Cloudflare Edge POP                   │
            │                                                        │
   Browser  │   ┌──────────────────────────────────────────────┐     │
  ───HTTP──▶│   │   Worker (recipe-organizer)                  │     │
            │   │                                              │     │
            │   │   • TanStack Start SSR (server-entry)        │     │
            │   │   • TanStack Router (file-based)             │     │
            │   │   • createServerFn handlers (RPC + loaders)  │     │
            │   │   • useSession (encrypted cookies)           │     │
            │   │                                              │     │
            │   │   bindings:  DB  ─────▶ Cloudflare D1        │     │
            │   │              R2_BUCKET ─▶ Cloudflare R2      │     │
            │   │              IMAGES   ─▶ Cloudflare Images   │     │
            │   │   caches.default ──▶ Edge HTTP cache         │     │
            │   └──────────────────────────────────────────────┘     │
            └────────────────────────────────────────────────────────┘
                       ▲
                       │ Google OAuth 2.0 (token + userinfo)
                       ▼
            ┌────────────────────────────────────────┐
            │ accounts.google.com / oauth2.googleapis.com │
            └────────────────────────────────────────┘
```

### Layered overview

| Layer                   | Lives in                                                    | Responsibility                                                                                  |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **UI primitives**       | `src/components/ui/`                                        | Base UI (Base UI / Shadcn-flavored) — buttons, dialogs, fields. No data dependencies.           |
| **Form fields**         | `src/components/forms/`                                     | TanStack Form-aware fields built on UI primitives.                                              |
| **Layout / Navigation** | `src/components/layout/`, `src/components/navigation/`      | Mobile/desktop chrome (`ScreenLayout`, `Navbar`, `TabBar`).                                     |
| **Feature components**  | `src/features/<name>/components/`                           | Feature-specific UI: forms, dialogs, lists, editors.                                            |
| **Hooks & contexts**    | `src/hooks/`, `src/features/<name>/{hooks,contexts}/`       | Cross-cutting hooks (forms, file upload, swipe), feature-scoped contexts (e.g. linked recipes). |
| **Server functions**    | `src/features/<name>/api/`                                  | Validation + DB/R2 + cache invalidation.                                                        |
| **Data layer**          | `src/lib/db/`                                               | Drizzle schema, relations, `getDb()`.                                                           |
| **Platform helpers**    | `src/lib/{r2,session,cache-manager,theme,toast-helpers}.ts` | R2 upload/download + edge cache, session helpers, theme/toast plumbing.                         |
| **Stores**              | `src/stores/`                                               | Persistent client-only Zustand stores (shopping list, recipe quantities).                       |
| **Routes**              | `src/routes/`                                               | File-based pages and API handlers; SSR loaders prefetch queries.                                |

### Cross-feature data flow (page render)

1. Client requests `/recipe/$id`.
2. Worker invokes `__root.tsx` `beforeLoad` → fetches `authUser` (cookie-based session) and `theme` (cookie). Adds `isAdmin` to context.
3. Router resolves `recipe/$id.tsx`:
   - `loader` calls `context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))`.
   - That option is backed by `getRecipe` (a `createServerFn`) which queries D1 via Drizzle and returns a serialized recipe.
4. Worker renders the React tree to HTML and ships it back along with the query cache as a serialized payload.
5. Client hydrates and runs the (client-only) route loader/component: `useQuery(getRecipeDetailsOptions(id))` and `useShoppingListStore` (Zustand) are read directly on the client — no `<ClientOnly>` needed, since the route never rendered on the server.
6. User actions (add to shopping list, update quantity) write to Zustand stores; `localStorage` persists the change.

### Cross-feature data flow (mutation)

1. User submits a recipe via TanStack Form.
2. Client calls `objectToFormData(value)` and invokes the `createRecipeOptions` mutation.
3. Worker enters `createRecipe`: `authGuard()` middleware validates session → input validator parses FormData → handler uploads image to R2 (via Cloudflare Images), computes auto-tags, inserts rows in D1.
4. On success, the mutation `onSuccess` invalidates `queryKeys.recipeLists()`, fires a success toast, and the router redirects.

### Service worker / offline

- `tanstackSerwistPlugin` (in `scripts/generate-sw.ts`) emits `/sw.js` from `src/sw.ts` at build time.
- Client registers `new Serwist('/sw.js', { scope: '/', type: 'module' })` from the root route.
- Defaults: `clientsClaim`, `navigationPreload`, `skipWaiting`, Serwist `defaultCache`. Page navigations return a per-request, auth-dependent shell and are not publicly cacheable; R2 asset responses under `/api/*` still set `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.

## 5. Acceptance Criteria

- **AC-001**: Given a fresh browser, When the user opens any non-auth page, Then SSR HTML is served with the route's loader-prefetched data and the page renders before hydration completes.
- **AC-002**: Given an unauthenticated user, When they navigate to `/recipe/new`, `/recipe/edit/$id`, or `/settings`, Then the route's `beforeLoad` redirects them to `/auth/login`.
- **AC-003**: Given a non-admin user, When they call any admin server function (users CRUD, ingredient delete), Then the request fails with "Permission denied".
- **AC-004**: Given a recipe creation, When the request succeeds, Then `queryKeys.recipeLists()` is invalidated and a success toast is shown.
- **AC-005**: Given a deployed worker, When inspecting `wrangler.jsonc`, Then bindings `DB` (D1), `R2_BUCKET` (R2), and `IMAGES` (Cloudflare Images) are present.
- **AC-006**: Given a service worker registration failure, When it occurs, Then the app continues to work (silent failure in `__root.tsx`).
- **AC-007**: Given an image upload, When the server function persists it, Then the stored object is `image/webp` (output of the Images transform).

## 6. Test Automation Strategy

- **Test Levels**: lint (`vp lint`), format (`vp fmt`), type-check (`vp check`), unit/integration via Vitest (`vp test`), manual smoke (browser).
- **Frameworks**: Oxlint (with TS + React + Unicorn + Import plugins), Oxfmt, Vitest (`vite-plus/test`), Wrangler `dev` for local Worker emulation.
- **Test Data Management**: D1 dump/restore via `pnpm db:dump` / `pnpm db:import` (`wrangler d1 export/execute`).
- **CI/CD Integration**: GitHub Actions with `voidzero-dev/setup-vp@v1`, `vp install`, `vp check`, `vp test`. Migrations applied to remote D1 during deploy (`pnpm migration:apply:remote` → `drizzle-kit migrate`).
- **Coverage Requirements**: not enforced; cover unit-converter, shopping list aggregation, auth guard.
- **Performance Testing**: not in scope; observability comes from Cloudflare Worker logs (`observability.logs.enabled = true`).

## 7. Rationale & Context

- **Why TanStack Start + Cloudflare Workers**: same TS code on edge SSR and client; no separate API service. Loaders + Query make optimistic SSR cheap. D1/R2/Images keep all infra in one provider.
- **Why D1 + Drizzle**: SQLite at the edge avoids cold-start connections. Drizzle gives type-safe relational queries with `defineRelations`. `batch([...])` provides multi-statement atomicity.
- **Why Zustand for selected client state**: we need persisted UI state (shopping list, per-recipe servings). React Query is for server state, not for "this user picked these recipes". The two never overlap (PAT-005 in client-state spec).
- **Why Cloudflare Images for uploads**: zero-effort WebP conversion + resize at the edge. Avoids storing huge JPEGs in R2 and serves the optimization tax once at upload time.
- **Why Lexical for instructions**: rich-text editor with first-class custom-node support, used to embed Magimix programs and subrecipes inside instructions.
- **Why French-only UI**: the app targets French-speaking users (Pelico domain context). All copy and validation messages are localized.
- **Why no separate API service**: every server-side concern (RPC, OAuth callback, image streaming) is reachable through TanStack Router's `server.handlers` or `createServerFn`. The Worker is the API.

### Trade-offs

- D1 is the primary storage; running large analytical queries is not its strength. If reporting is added, prefer pulling data into a separate analytics store rather than scaling D1.
- The shopping-list cache key includes the array of recipe ids. Adding/removing recipes mints a new key and re-fetches; acceptable for ≤~50 entries, would need a different cache strategy at higher scale.
- DEV bypass in `getAuthUser` returns a fake admin in development (`import.meta.env.DEV`). Useful for local UI work, but means dev builds skip OAuth entirely.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: Google OAuth 2.0 (`accounts.google.com`, `oauth2.googleapis.com/token`, `www.googleapis.com/oauth2/v2/userinfo`) — sole identity provider.

### Third-Party Services

- **SVC-001**: Cloudflare Workers — application runtime, request routing, edge cache.
- **SVC-002**: Cloudflare D1 — relational storage (SQLite). Binding `DB`.
- **SVC-003**: Cloudflare R2 — object storage. Binding `R2_BUCKET`.
- **SVC-004**: Cloudflare Images — input/output image transformation. Binding `IMAGES`.

### Infrastructure Dependencies

- **INF-001**: Cloudflare account with D1, R2, and Images enabled.
- **INF-002**: GitHub Actions for CI; `voidzero-dev/setup-vp@v1` action.

### Data Dependencies

- **DAT-001**: Google userinfo response shape (`id`, `email`, `name`, `picture`); the app stores `id` and `email`.
- **DAT-002**: Recipe instructions are persisted as Lexical JSON strings (used by `EditorField` and the tag detector that searches for `"types":"magimixProgram"`).

### Technology Platform Dependencies

- **PLT-001**: TanStack Start + Router (1.16x) + React Query (5.99) + React 19.
- **PLT-002**: Drizzle ORM 1.0 beta + Drizzle Kit 1.0 beta (D1 dialect).
- **PLT-003**: Vite+ 0.1.18 (wrapping Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt).
- **PLT-004**: TypeScript 6, React 19.2, Tailwind 4.2, Zustand 5, Zod 4.
- **PLT-005**: Lexical 0.43 (rich-text editor) + Vidstack 1.12 (video player).

### Compliance Dependencies

- **COM-001**: Personally-identifiable data stored: user `id` (Google sub), `email`, role, status. No passwords. Cookies are encrypted; storage is on Cloudflare's global network.

## 9. Examples & Edge Cases

### Example: end-to-end recipe creation

```
[Client]
  RecipeForm → objectToFormData(values) → mutate(createRecipeOptions)
                                              │
                                              ▼
[Worker]
  createServerFn({ method:'POST' })
    .middleware([authGuard()])
    .inputValidator((fd) => recipeSchema.parse(parseFormData(fd)))
    .handler(async ({ data, context }) => {
      const imageKey = await uploadFile(data.image)         // R2 + IMAGES
      // …compute autoTags…
      const [createdRecipe] = await getDb().insert(recipe).values({...}).returning()
      // …insert ingredient groups + linked recipes…
    })
                                              │
                                              ▼
[Client]
  onSuccess → invalidate queryKeys.recipeLists() → toastSuccess → router.navigate('/')
```

### Edge: persistent stores under client-only rendering

`QuantityControls` reads from `useRecipeQuantitiesStore` (`localStorage`). Because the app runs in client-only render mode (`src/start.ts` `defaultSsr: false`; only the root shell is SSR'd), `QuantityControls` and other store-backed components never render on the server — they render directly on the client with no `<ClientOnly>` wrapper and no hydration mismatch.

### Edge: Worker stateless lifetime

`getDb()` is called per request and returns a fresh drizzle client bound to `cloudflareEnv.DB`. Holding a reference across requests is unsupported; isolates may be recycled at any time.

### Edge: image streaming

`/api/image/$id` is a `server.handlers.GET` route. It pulls from R2, wraps the body in a `Response` with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`, and stores the response in `caches.default` via `CacheManager.getWithCache(...)` so subsequent worker invocations bypass R2 entirely on cache hit.

## 10. Validation Criteria

- **VAL-001**: `vp check` passes — type-check, lint, format are green.
- **VAL-002**: `vp test` passes.
- **VAL-003**: `wrangler deploy --dry-run` succeeds with the configured bindings.
- **VAL-004**: A fresh local checkout can run `vp install`, `pnpm migration:apply:local`, `pnpm dev`, and serve `/` without errors.
- **VAL-005**: All sibling specs referenced under §11 exist and validate against the spec template (front matter + 11 sections).

## 11. Related Specifications / Further Reading

- [Folder Structure](./file-structure.spec.md)
- [Platform (Cloudflare Workers)](./infrastructure/platform.spec.md)
- [Data Layer (Drizzle + D1)](./infrastructure/data-layer.spec.md)
- [Server Functions](./infrastructure/server-functions.spec.md)
- [Routing & SSR](./infrastructure/routing-ssr.spec.md)
- [Forms](./infrastructure/forms.spec.md)
- [Client State Layering](./infrastructure/client-state.spec.md)
- [Auth Feature](../src/features/auth/auth.spec.md)
- [Ingredients Feature](../src/features/ingredients/ingredients.spec.md)
- [Recipe Feature (index)](../src/features/recipe/spec/index.spec.md)
- [Shopping List Feature](../src/features/shopping-list/shopping-list.spec.md)
- [Users Feature](../src/features/users/users.spec.md)
- TanStack Start: <https://tanstack.com/start>
- Cloudflare Workers + D1 + R2 + Images: <https://developers.cloudflare.com/>
- Drizzle ORM: <https://orm.drizzle.team/>
