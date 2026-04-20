---
title: Platform (Cloudflare Workers runtime)
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./data-layer.spec.md
  - ./routing-ssr.spec.md
  - ../../src/features/auth/auth.spec.md
  - ../../src/features/recipe/spec/index.spec.md
---

## 2. Problem Statement

Recipe Organizer is a full-stack app that runs as a single Cloudflare Worker, colocating SSR, server functions,
static asset serving, R2 media proxying, and D1 database access. The platform choice constrains every other
decision in this codebase (runtime APIs, bundle size, observability, dev loop).

- `[G-1]` Deploy a single Worker per environment (dev / prod) with D1 + R2 + IMAGES bindings.
- `[G-2]` Run TanStack Start for SSR + server functions + file-based routing against that Worker runtime.
- `[G-3]` Keep bundle size Worker-compatible — no Node-only libraries on the server bundle beyond
  `nodejs_compat`-provided ones.
- `[G-4]` Serve user-uploaded media (images, videos) from R2 via thin handler routes that add `Cache-Control`
  headers.
- `[G-5]` Optimize uploaded images at write time using Cloudflare Images (not at read time).
- `[G-6]` Support offline read via a Serwist service worker for recipe browsing on the go.
- `[G-7]` Use Vite+ as the unified dev toolchain (dev server, lint, format, test, build).

## 3. Key Design Decisions

| Decision                             | Choice                                                                                          | Rationale                                                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Single-Worker deployment    | TanStack Start `@tanstack/react-start/server-entry` as the Worker entry                         | One artifact to build, deploy, and roll back.                                                                                        |
| `[KD-2]` D1 for OLTP                 | `DB` binding, accessed via Drizzle                                                              | Native SQLite on the edge; free tier adequate for a personal cookbook.                                                               |
| `[KD-3]` R2 for media                | `R2_BUCKET` binding; uploaded keys are UUIDs                                                    | S3-compatible object storage without egress fees; keys are opaque.                                                                   |
| `[KD-4]` Cloudflare Images at upload | `env.IMAGES.input(stream).transform({width: 1024}).output({format: 'image/webp', quality: 80})` | Uniform 1024px WebP output keeps R2 bills small and read path simple.                                                                |
| `[KD-5]` `nodejs_compat` enabled     | `compatibility_flags: ["nodejs_compat"]` in `wrangler.jsonc`                                    | Required by a few deps (`node:crypto`, etc.) and keeps Drizzle / TanStack ergonomic.                                                 |
| `[KD-6]` Observability               | Workers logs + invocation logs enabled; traces disabled                                         | Logs give enough signal; traces add noise / cost for a single-user app.                                                              |
| `[KD-7]` Offline read via Serwist    | `@serwist/vite` generates `sw.js` from `src/sw.ts`; Serwist window API in root                  | Caches recipe reads for offline; write paths require network. Silent registration failure (no hard error).                           |
| `[KD-8]` Vite+ toolchain             | `defineConfig` from `vite-plus`; `vp` CLI for dev / lint / format / test / build                | Single dependency that wraps Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt. Project is managed via pnpm (not bun — see user memory). |
| `[KD-9]` Cookie sessions             | `useSession` from `@tanstack/react-start/server` with `env.SESSION_SECRET`                      | No session store; cookie is the state; `SESSION_SECRET` is a Worker secret.                                                          |
| `[KD-10]` Image / video read headers | `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` on R2 GET                 | Aggressive browser caching since keys are content-addressed (UUID).                                                                  |

## 4. Principles & Intents

- `[PI-1]` **Workers-first** — every new dependency must be Workers-compatible (no `fs`, no `child_process`, no
  `node:http` server). If it isn't, find another way.
- `[PI-2]` **Bindings, not env vars, for stateful resources** — DB, R2_BUCKET, IMAGES are bindings in
  `wrangler.jsonc`. Only secrets (`SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are env vars.
- `[PI-3]` **Optimize at write, not read** — images are transformed to a single canonical WebP size on upload.
  The read path is dumb proxy-to-R2.
- `[PI-4]` **Service worker is non-load-bearing** — the app must work if registration fails. SW is a read-side
  optimization, not a requirement.
- `[PI-5]` **Vite+ commands only** — never invoke pnpm, vitest, oxlint, tsdown directly. Use `vp <command>`.
  Package manager operations go through `vp add / remove / install`.

## 5. Non-Goals

- `[NG-1]` Multi-region DB replication (D1 is the source of truth; read replicas are future work).
- `[NG-2]` Durable Objects, Workers KV, or Queues. Not needed for current scope.
- `[NG-3]` CDN configuration beyond defaults.
- `[NG-4]` Client-rendered SPA mode — the app always SSRs through the Worker.
- `[NG-5]` Background jobs / scheduled workers.
- `[NG-6]` Multi-tenant deployment (one Worker = one tenant).

## 6. Caveats

- `[C-1]` `wrangler.jsonc` pins `migrations_dir: "migrations_tmp"`. Production migrations live in `migrations/`.
  The `migrations_tmp` pointer is a dev-only indirection — treat `migrations/` as canonical.
- `[C-2]` `SESSION_SECRET` rotation invalidates every existing app + OAuth session. Rotate sparingly.
- `[C-3]` R2 objects are soft-orphaned on failed deletes — see recipe-crud spec caveats. No platform-level
  garbage collector runs today.
- `[C-4]` The service worker is built from `dist/` during `vp build`. Changes to `src/sw.ts` require a rebuild
  to take effect in prod.
- `[C-5]` `compatibility_date: "2026-01-28"` — bumping this may change runtime behavior of several APIs.
- `[C-6]` CLAUDE.md references `bun` commands (`bun dev`, `bun test`, etc.) but the project is actually managed
  with pnpm (see `pnpm-lock.yaml`). Use `pnpm` / `vp` — not bun.

## 7. High-Level Components

| Component           | Module type      | Responsibility                                                                | Public API surface                                                                                       |
| ------------------- | ---------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Worker entry        | TanStack Start   | Request-to-route dispatch, SSR, server-function execution                     | `@tanstack/react-start/server-entry` (from `wrangler.jsonc`)                                             |
| Vite build config   | Vite+            | Dev server, lint, format, test, production bundle                             | `vite.config.ts`                                                                                         |
| Wrangler config     | CF manifest      | Bindings (DB, R2_BUCKET, IMAGES), compat flags, observability                 | `wrangler.jsonc`                                                                                         |
| Drizzle DB instance | Server singleton | Typed access to D1 via `getDb()`                                              | `src/lib/db/index.ts` → `getDb`                                                                          |
| R2 media helpers    | Server functions | Upload image (with Images transform), upload video, delete, GET/HEAD handlers | `src/lib/r2.ts` → `uploadFile`, `uploadVideo`, `deleteFile`, `createR2GetHandler`, `createR2HeadHandler` |
| Session cookies     | Server helpers   | App session (30d) + OAuth state (transient)                                   | `src/lib/session.ts` → `useAppSession`, `useOAuthSession`                                                |
| Service worker      | Serwist          | Offline read caching                                                          | `src/sw.ts` → compiled to `/sw.js`; registered from `src/routes/__root.tsx`                              |
| Image/video route   | HTTP routes      | R2 GET/HEAD passthrough with cache headers                                    | `src/routes/api/image/$id.ts`, `src/routes/api/video/$id.ts`                                             |
| Offline banner      | React component  | Shows when `navigator.onLine === false`                                       | `<OfflineBanner />` from `src/components/error/offline-banner`                                           |

## 8. Detailed Design

| Concern               | Entry point                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Wrangler bindings     | `wrangler.jsonc`                                                                             |
| Vite/Vite+ config     | `vite.config.ts`                                                                             |
| Drizzle instance      | `src/lib/db/index.ts`                                                                        |
| Media helpers         | `src/lib/r2.ts`                                                                              |
| Session helpers       | `src/lib/session.ts`                                                                         |
| Service worker source | `src/sw.ts`                                                                                  |
| SW registration       | `src/routes/__root.tsx` (`useEffect`)                                                        |
| R2 image route        | `src/routes/api/image/$id.ts`                                                                |
| R2 video route        | `src/routes/api/video/$id.ts`                                                                |
| Cache manager         | `src/lib/cache-manager.ts`                                                                   |
| Worker types          | `worker-configuration.d.ts` (auto-generated from wrangler)                                   |
| Image optimization    | `env.IMAGES.input(...).transform({width: 1024}).output({format: 'image/webp', quality: 80})` |

Upload flow (image):

```text
Client → POST multipart/form-data → createRecipe handler
  → uploadFile(file):
      1. file.stream()
      2. env.IMAGES.input(stream).transform({width: 1024}).output({...})
      3. R2_BUCKET.put(uuid, arrayBuffer, httpMetadata)
      4. return uuid
  → recipe.image = uuid
```

Read flow (image):

```text
<img src="/api/image/:uuid">
  → createR2GetHandler('image/webp')
  → cache.getWithCache(request.url)(...)
      → env.R2_BUCKET.get(id)
      → Response with Cache-Control
```

## 9. Verification Criteria

- `[VC-1]` `vp build` produces a Worker bundle that deploys via Wrangler without
  `nodejs_compat`-incompatibility warnings.
- `[VC-2]` `wrangler.jsonc` declares exactly three bindings: `DB` (D1), `R2_BUCKET` (R2), `IMAGES`.
- `[VC-3]` An uploaded image lands in R2 as WebP and is ≤1024px wide, keyed by a UUID.
- `[VC-4]` `GET /api/image/:id` returns the R2 object with `Cache-Control: public, max-age=86400,
stale-while-revalidate=604800`.
- `[VC-5]` `HEAD /api/image/:id` returns `Accept-Ranges: bytes` and a correct `Content-Length`.
- `[VC-6]` Service worker registration failure does not break the app; reads still succeed via the network.
- `[VC-7]` `import.meta.env.DEV` is `true` locally and `false` in prod; `import.meta.env.PROD` flips the
  `secure` cookie flag in `src/lib/session.ts`.
- `[VC-8]` `vp check` passes (lint + format + typecheck).

## 10. Open Questions

- `[OQ-1]` Should we split prod and preview environments in `wrangler.jsonc` via `env.*` blocks?
- `[OQ-2]` Should R2 object deletion be backfilled by a scheduled Worker to clean up orphans from failed writes?
- `[OQ-3]` Is `migrations_tmp` vs `migrations` confusing enough to collapse into a single directory?
