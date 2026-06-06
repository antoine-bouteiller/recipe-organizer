---
title: Platform & Deployment Specification (Cloudflare Workers)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, cloudflare, workers, d1, r2, images, deployment]
---

# Introduction

This specification describes how the `recipe-organizer` application runs on Cloudflare's edge platform.
It captures the Worker configuration, runtime bindings (D1, R2, Cloudflare Images), build/deploy lifecycle,
local-development conventions, secret management, caching strategy, and the on-device service worker.
Its scope covers the **execution environment and infrastructure surface** only; data modeling, server
function semantics, and routing are deferred to their own specs (see section 11).

## 1. Purpose & Scope

**Purpose** — Provide a single, authoritative description of the platform contract that the application
must satisfy at runtime. Any change to bindings, compatibility flags, build outputs, or deployment
commands must be reflected in this document.

**Scope (in)**

- Cloudflare Worker definition and observability settings.
- Bindings: D1 database, R2 bucket, Cloudflare Images.
- Build pipeline (Vite + TanStack Start + `@cloudflare/vite-plugin`).
- Service Worker emission and registration.
- Session cookie shape and required secrets.
- Local development workflow and database migration commands.
- HTTP caching strategy for R2-backed media.

**Scope (out)**

- Database schema, query patterns, and Drizzle relations — see [`./data-layer.spec.md`](./data-layer.spec.md).
- Server function/RPC contract — see [`./server-functions.spec.md`](./server-functions.spec.md).
- Routing and SSR — see [`./routing-ssr.spec.md`](./routing-ssr.spec.md).

**Intended audience** — Backend / infrastructure engineers and AI agents performing changes to
`wrangler.jsonc`, `vite.config.ts`, deploy scripts, or platform-touching code in `src/lib/`.

**Assumptions**

- Cloudflare account with Workers Paid plan (required for R2 + Images + D1 production usage).
- `wrangler` CLI v4.x installed locally for migrations and DB import/export.
- Node.js compatible runtime is enabled at the Worker level.

## 2. Definitions

- **Worker** — Cloudflare's V8-isolate runtime executing the deployed Worker entry. Name: `recipe-organizer`.
- **Binding** — A capability injected into the Worker's `env` (typed via `cloudflare:workers`) such as
  `DB`, `R2_BUCKET`, `IMAGES`.
- **D1** — Cloudflare's serverless SQLite. Bound as `DB`.
- **R2** — Cloudflare's S3-compatible object store. Bound as `R2_BUCKET`.
- **Cloudflare Images** — Image transformation API exposed via the `IMAGES` binding.
- **TanStack Start** — Full-stack React framework providing the SSR runtime; entry resolved via the
  package export `@tanstack/react-start/server-entry`.
- **Vite+** — Unified toolchain (`vp` CLI) wrapping pnpm + Vite + Vitest + Oxlint + Oxfmt + tsdown.
- **Serwist** — Service-worker library used to generate the offline-capable client SW.
- **`compatibility_date`** — Pins the Worker runtime feature set; here `2026-01-28`.
- **`nodejs_compat`** — Compatibility flag enabling the Node.js standard-library subset (used by
  `node:crypto` for `randomUUID()`).
- **PROD** — `import.meta.env.PROD === true`, evaluated at build time.

## 3. Requirements, Constraints & Guidelines

### Functional requirements

- **REQ-001** — The Worker MUST be named `recipe-organizer` and use
  `compatibility_date: 2026-01-28` with `compatibility_flags: ['nodejs_compat']`
  (source: `wrangler.jsonc`).
- **REQ-002** — The Worker MUST expose three bindings: `DB` (D1), `R2_BUCKET` (R2), `IMAGES`
  (Cloudflare Images). Any new binding requires updating both `wrangler.jsonc` and
  `worker-configuration.d.ts` (via `pnpm cf-typegen`).
- **REQ-003** — D1 binding `DB` MUST point to database `recipe-organizer`
  (id `542863e2-5f6d-4ef7-9fd0-84b673f76f43`).
- **REQ-004** — R2 binding `R2_BUCKET` MUST point to bucket `recipe-organizer` and is the sole
  storage target for user-uploaded images and videos.
- **REQ-005** — The application MUST generate object keys via `randomUUID()` (`node:crypto`) and never
  use user-supplied filenames as R2 keys (source: `src/lib/r2.ts`).
- **REQ-006** — Image uploads MUST be transformed through the `IMAGES` binding to WebP, quality 80,
  width 1024 before being persisted in R2. Video uploads are stored raw with the client-supplied MIME
  type.
- **REQ-007** — The application MUST emit a service worker at `/sw.js` from `src/sw.ts` via the
  `tanstackSerwistPlugin` defined in `scripts/generate-sw.ts`. The SW is registered client-side from
  `src/routes/__root.tsx` as `new Serwist('/sw.js', { scope: '/', type: 'module' })`.
- **REQ-008** — Session cookies MUST be `httpOnly`, `sameSite=lax`, and `secure` in PROD
  (`import.meta.env.PROD`). The encryption password is the runtime secret `SESSION_SECRET`
  (source: `src/lib/session.ts`).
- **REQ-009** — Observability MUST have `logs.enabled: true` and `invocation_logs: true`.
  Trace ingestion is intentionally disabled (`traces.enabled: false`).

### Constraints

- **CON-001** — The Worker entry is fixed to `@tanstack/react-start/server-entry`
  (`wrangler.jsonc#main`). Build output MUST remain compatible with this resolver — i.e. produced by
  `vp build` running the TanStack Start Vite plugin.
- **CON-002** — R2 PUT operations require known-length bodies. The image pipeline MUST materialize the
  Cloudflare Images result via `.response().arrayBuffer()` before calling `env.R2_BUCKET.put`.
- **CON-003** — `wrangler.jsonc` declares `migrations_dir: migrations_tmp`, which is the staging
  directory used **only** by `wrangler d1 migrations apply`. The canonical Drizzle migration output
  remains `./migrations` (declared in `drizzle.config.ts#out`). The local apply script
  (`scripts/apply-migration-local.ts`) flattens `./migrations/<folder>/*.sql` into `migrations_tmp/`
  and removes it after execution.
- **CON-004** — Service-worker manifest injection (`injectManifest`) only runs on production builds;
  in dev, the SW is rebuilt without a precache manifest.
- **CON-005** — `defineRelations` from `drizzle-orm` is used at module top-level in
  `src/lib/db/index.ts`; `getDb()` reads `cloudflareEnv.DB` lazily so the module can be imported
  outside a request context (e.g. type-checking, tests).
- **CON-006** — The repository pins `pnpm@10.33.0` via `packageManager` and overrides `vite` with
  `npm:@voidzero-dev/vite-plus-core@latest`. Direct invocation of `pnpm`, `vitest`, `oxlint`, etc. is
  prohibited by project policy; use the `vp` wrapper (see `CLAUDE.md`).

### Guidelines

- **GUD-001** — Prefer `caches.default` (via `CacheManager.getWithCache`) for any deterministic,
  immutable byte stream served from R2 — it removes a round-trip to object storage on subsequent
  requests at the same edge.
- **GUD-002** — Long-lived static assets returned from `caches.default` carry
  `Cache-Control: public, max-age=31536000, immutable`. Dynamic R2 reads (which can be invalidated by
  re-upload to the same key) carry `public, max-age=86400, stale-while-revalidate=604800`.
- **GUD-003** — Add new Cloudflare bindings to `wrangler.jsonc` and re-run `pnpm cf-typegen` to
  refresh the typed `Env` interface.
- **GUD-004** — Restart `pnpm dev` after adding/moving routes; the route tree is regenerated at server
  startup.

### Patterns

- **PAT-001 — Lazy DB factory.** Export `getDb()` (not a top-level `db` instance) so the binding is
  read inside the request scope.
- **PAT-002 — Cached R2 read-through.** Wrap R2 fetches in `cache.getWithCache(request.url)(...)`
  to dedupe origin reads at the edge; emit `CF-Cache-Status: HIT|MISS` for visibility.
- **PAT-003 — Worker-side image transform.** Run `env.IMAGES.input(stream).transform(...).output(...)`
  before persisting to R2, so the canonical bytes are already optimized.

## 4. Interfaces & Data Contracts

### 4.1 Worker bindings (typed via `cloudflare:workers`)

| Binding     | Kind              | Resource           | Notes                                                                                             |
| ----------- | ----------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| `DB`        | D1 database       | `recipe-organizer` | id `542863e2-5f6d-4ef7-9fd0-84b673f76f43`; accessed via `drizzle-orm/d1`.                         |
| `R2_BUCKET` | R2 bucket         | `recipe-organizer` | Stores image (WebP) and video objects keyed by UUIDv4.                                            |
| `IMAGES`    | Cloudflare Images | n/a                | `env.IMAGES.input(...).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })`. |

### 4.2 Runtime environment variables / secrets

| Name                     | Phase     | Purpose                                                              |
| ------------------------ | --------- | -------------------------------------------------------------------- |
| `SESSION_SECRET`         | Runtime   | Encrypts `app-session` and `oauth-session` cookies via `useSession`. |
| `GOOGLE_CLIENT_ID`       | Runtime   | Google OAuth client identifier.                                      |
| `GOOGLE_CLIENT_SECRET`   | Runtime   | Google OAuth client secret.                                          |
| `VITE_PUBLIC_URL`        | Build     | Public origin baked into the SSR/client bundle.                      |
| `CLOUDFLARE_ENV`         | Local dev | Set to `dev` by `pnpm dev` before invoking `vp dev`.                 |
| `CLOUDFLARE_ACCOUNT_ID`  | CLI       | Drizzle-Kit `d1-http` driver credential.                             |
| `CLOUDFLARE_DATABASE_ID` | CLI       | Drizzle-Kit `d1-http` driver credential.                             |
| `CLOUDFLARE_D1_TOKEN`    | CLI       | Drizzle-Kit `d1-http` driver credential.                             |

Production secrets are managed via `wrangler secret put`. `VITE_PUBLIC_URL` is consumed at
`vp build` time and embedded in the bundle; rotating it requires a redeploy.

### 4.3 HTTP cache contract for R2 media

| Layer                            | Header                                                                |
| -------------------------------- | --------------------------------------------------------------------- |
| Edge cache (`caches.default`)    | `Cache-Control: public, max-age=31536000, immutable` (default)        |
| Response to client (R2 GET/HEAD) | `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` |
| Cache hit indicator              | `CF-Cache-Status: HIT` or `MISS`                                      |
| Default `Content-Type` (image)   | `image/webp`                                                          |

### 4.4 Session cookies

| Cookie          | `httpOnly` | `sameSite` | `secure` (PROD) | `maxAge`            |
| --------------- | ---------- | ---------- | --------------- | ------------------- |
| `app-session`   | true       | lax        | true            | 60 × 60 × 24 × 30 s |
| `oauth-session` | true       | lax        | true            | (session)           |

Both cookies are encrypted with `SESSION_SECRET` via `useSession` from
`@tanstack/react-start/server`.

### 4.5 Vite plugin chain (`vite.config.ts`)

Order matters; the chain is:

1. `tanstackStart()` — TanStack Start SSR/route plumbing.
2. `react()` — `@vitejs/plugin-react` v6.
3. `cloudflare({ viteEnvironment: { name: 'ssr' } })` — `@cloudflare/vite-plugin`, binds the Cloudflare
   environment to the `ssr` Vite environment.
4. `tailwindcss()` — `@tailwindcss/vite` v4.
5. `tanstackSerwistPlugin()` — custom plugin in `scripts/generate-sw.ts` that emits `dist/client/sw.js`
   on `closeBundle` and runs `injectManifest` only in production.
6. `devtools({ injectSource: { enabled: false } })` — TanStack Devtools, source injection disabled.
7. `babel({ presets: [reactCompilerPreset()] })` — runs `babel-plugin-react-compiler`.

Dev server listens on port `3000`. Lint config is Oxlint with `typeAware: true` and the
`['typescript', 'react', 'unicorn', 'import']` plugins. Format config is Oxfmt
(`semi: false`, `singleQuote: true`, `printWidth: 150`, `trailingComma: 'es5'`,
`experimentalSortImports`, `experimentalTailwindcss` against `src/styles/app.css`).

## 5. Acceptance Criteria

- **AC-001** — Given a fresh checkout, when the developer runs `pnpm dev`, then the app boots on
  `http://localhost:3000` with `CLOUDFLARE_ENV=dev` and the Cloudflare Vite plugin connects to a
  local Workers runtime exposing the configured bindings.
- **AC-002** — Given an authenticated user uploading an image, when the request reaches
  `uploadFile`, then the file MUST be transformed to WebP @ width 1024, quality 80, persisted to
  `R2_BUCKET` under a UUIDv4 key, and only the key persisted in D1.
- **AC-003** — Given two GET requests within 24h to the same R2 object URL on the same edge, when
  the second request executes, then it MUST return `CF-Cache-Status: HIT` without invoking
  `env.R2_BUCKET.get`.
- **AC-004** — Given a missing R2 object id, when the GET handler runs, then it MUST throw
  `notFound()` and surface a 404 response (no cache write).
- **AC-005** — Given a production build (`vp build`), when the SW plugin's `closeBundle` runs, then
  `dist/client/sw.js` MUST exist and contain a populated `self.__SW_MANIFEST` precache list.
- **AC-006** — Given the SW is served from `/sw.js`, when the client root mounts, then registration
  MUST be attempted with `scope: '/'` and `type: 'module'`; failure MUST be swallowed (no
  user-visible error).
- **AC-007** — Given `pnpm db:migrate:local`, when the script runs to completion, then
  `migrations_tmp/` MUST be removed regardless of success or failure of `wrangler d1 migrations apply`
  (idempotent re-run).
- **AC-008** — Given `pnpm db:migrate:remote`, when invoked with the
  `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_DATABASE_ID` / `CLOUDFLARE_D1_TOKEN` env vars set, then
  Drizzle-Kit MUST apply pending migrations to the production D1 database via the `d1-http` driver.
- **AC-009** — Given a request to a route that requires authentication, when no `app-session` cookie
  is present, then the server function layer MUST treat the request as anonymous (no decryption is
  attempted with a missing/empty `SESSION_SECRET`).

## 6. Test Automation Strategy

- **Test levels** — Unit (Vitest via `vp test`) for pure helpers (`r2.ts`, `cache-manager.ts`,
  session helpers); integration via Wrangler's local Workers runtime where applicable.
- **Frameworks** — Vitest (bundled by Vite+); `@cloudflare/vitest-pool-workers` is **not** currently
  configured — D1/R2/Images-touching code paths are exercised manually or via deploy preview.
- **Test data management** — Local D1 is reset by reapplying migrations
  (`pnpm db:migrate:local`); `wrangler d1 export` / `wrangler d1 execute` (the
  `db:dump` / `db:import` scripts) are used to snapshot/restore.
- **CI/CD** — GitHub Actions runs `vp install`, `vp check`, `vp test`. Production migrations are
  applied during deployment (see commit `c85f857` "ci: apply migrations during deployment").
- **Coverage targets** — Not currently enforced. Critical platform code (R2 key generation, cache
  read-through, session cookie flags) MUST be covered when tests are added.
- **Performance/edge testing** — Manual via deploy preview URL; verify `CF-Cache-Status: HIT` on
  warm reads and inspect `wrangler tail` for invocation logs.

## 7. Rationale & Context

- **Why Cloudflare Workers?** — Edge-deployed SSR with sub-100ms cold-start, native bindings to D1,
  R2, and Images keep the data plane on a single provider (no S3 + RDS sprawl).
- **Why `nodejs_compat`?** — `node:crypto.randomUUID()` is used to mint R2 keys. The flag also
  unlocks libraries that probe Node built-ins during SSR.
- **Why `migrations_dir: migrations_tmp`?** — `wrangler d1 migrations apply` requires a flat directory
  of `.sql` files, while Drizzle-Kit emits a nested `<timestamp>/migration.sql` shape. The local
  script flattens into `migrations_tmp/` so wrangler can consume it without rewriting Drizzle's
  output layout. Production uses `drizzle-kit migrate` directly via `d1-http`, bypassing the
  flattening step.
- **Why a custom Serwist plugin?** — `@serwist/vite` does not natively integrate with TanStack
  Start's build environments; the custom plugin runs a follow-up Vite library build scoped to the
  `client` environment in `closeBundle`, then `injectManifest` rewrites `__SW_MANIFEST` in place.
- **Why edge `caches.default` in addition to HTTP `Cache-Control`?** — `caches.default` is per-edge
  and shaves the R2 round-trip; the response `Cache-Control` (24h + 7d SWR) controls browser/CDN
  freshness for R2 objects that _can_ be replaced at the same key.
- **Why `import.meta.env.PROD` for cookie `secure`?** — The local dev server runs on `http://`, where
  `secure` cookies would be dropped by browsers. The flag is evaluated at build time and gated by
  Vite's mode.

## 8. Dependencies & External Integrations

### External systems

- **EXT-001 — Cloudflare D1.** Serverless SQLite, primary relational store. Accessed via the `DB`
  binding through `drizzle-orm/d1` + `defineRelations`. Production migrations applied via
  `drizzle-kit migrate` (`d1-http` driver).
- **EXT-002 — Cloudflare R2.** Object storage for images and videos. Accessed via the `R2_BUCKET`
  binding (`put`, `get`, `head`, `delete`).
- **EXT-003 — Cloudflare Images.** Image transformation API. Accessed via the `IMAGES` binding;
  pipeline: `input(stream).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })`.
- **EXT-004 — Google OAuth 2.0.** User authentication. Requires `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` runtime secrets.

### Third-party services

- **SVC-001 — Cloudflare global edge network.** All Worker requests, D1 queries, R2 reads, and
  edge cache lookups are served from Cloudflare's global PoPs. The Worker has no fixed region.

### Infrastructure dependencies

- **INF-001 — Wrangler v4.x.** Required locally and in CI for `wrangler d1 migrations apply`,
  `wrangler d1 export`, `wrangler d1 execute`, `wrangler types`, and (optionally) `wrangler deploy`.
- **INF-002 — pnpm 10.33.0.** Pinned via `packageManager`; consumed transparently through `vp`.
- **INF-003 — Bun.** Used to execute `scripts/apply-migration-local.ts`
  (`pnpm db:migrate:local` runs `bun run ./scripts/apply-migration-local.ts`).

### Data dependencies

- **DAT-001 — D1 migrations.** Source of truth in `./migrations/`, generated by Drizzle-Kit from
  `./src/lib/db/schema/index.ts`.

### Technology platform

- **PLT-001 — Cloudflare Workers runtime.** `compatibility_date: 2026-01-28`,
  `compatibility_flags: ['nodejs_compat']`, observability logs enabled, traces disabled.
- **PLT-002 — TanStack Start.** SSR React framework; provides the Worker `main` entry
  `@tanstack/react-start/server-entry` and `useSession` server primitive.
- **PLT-003 — Vite+ (`vp`).** Unified toolchain wrapping Vite, Rolldown, Vitest, tsdown, Oxlint,
  Oxfmt; entry point for all dev/build/lint/format/test commands.
- **PLT-004 — Serwist 9.5.7.** Service-worker library; uses `defaultCache`, `clientsClaim`,
  `navigationPreload`, `skipWaiting`.

### Compliance / regulatory considerations

- **COM-001 — Data location.** All data resides on the Cloudflare global network; D1 is
  primary-region-pinned but read-replicated. No explicit data-residency controls are enforced today.
- **COM-002 — PII inventory.** Google OAuth identifiers, user emails, and (optionally) display names
  are persisted in D1 (`user` table). Image and video uploads are stored in R2 keyed by random UUID.
  No payment, health, or other regulated data is collected.
- **COM-003 — Secrets handling.** `SESSION_SECRET`, `GOOGLE_CLIENT_SECRET`, and the Drizzle
  `CLOUDFLARE_*` credentials MUST be managed via `wrangler secret put` (production) or `.env.local`
  (development) and MUST NOT be checked into version control.

## 9. Examples & Edge Cases

### Image upload (happy path)

```ts
// src/lib/r2.ts
const key = randomUUID()
const optimizedImage = await env.IMAGES.input(file.stream()).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })

const optimizedBuffer = await optimizedImage.response().arrayBuffer()
await env.R2_BUCKET.put(key, optimizedBuffer, {
  httpMetadata: { contentType: optimizedImage.contentType() },
})
```

### Cached R2 GET handler

```ts
// src/lib/r2.ts
return cache.getWithCache(request.url)(async () => {
  const file = await env.R2_BUCKET.get(id)
  if (!file) throw notFound()
  return new Response(file.body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
    },
  })
})
```

### Edge cases

- **Missing R2 object** — `notFound()` is thrown; the cache layer does not store the 404.
- **Streaming body length unknown** — Cloudflare Images `.response()` is materialized to
  `arrayBuffer()` because `R2.put` requires a known `Content-Length` for streamed uploads in the
  Workers runtime.
- **SW registration failure** — Wrapped in a try/catch in `__root.tsx`; the app continues to function
  without offline support.
- **Local cookie `secure: false`** — In dev, `import.meta.env.PROD === false`, so the session cookie
  is delivered over plain HTTP without being dropped by the browser.
- **Migration re-application** — `apply-migration-local.ts` removes `migrations_tmp/` at start _and_
  end, so partial failures do not leave a stale staging dir.

## 10. Validation Criteria

- **VAL-001** — `wrangler.jsonc` MUST keep `name: "recipe-organizer"`,
  `compatibility_date: "2026-01-28"`, `compatibility_flags: ["nodejs_compat"]`, and the three
  bindings (`DB`, `R2_BUCKET`, `IMAGES`) declared.
- **VAL-002** — `vp check` (format + lint + typecheck) MUST pass before any commit.
- **VAL-003** — `vp build` MUST produce `dist/client/sw.js` containing a populated
  `self.__SW_MANIFEST`.
- **VAL-004** — `pnpm cf-typegen` MUST be re-run whenever `wrangler.jsonc` bindings change; the
  generated `worker-configuration.d.ts` MUST be committed.
- **VAL-005** — `pnpm db:migrate:remote` MUST be run as part of the deploy pipeline; the
  application MUST NOT issue queries against a D1 schema older than the latest committed migration.
- **VAL-006** — `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` MUST be set via
  `wrangler secret put` in production; deploys without them MUST be rejected by smoke tests.
- **VAL-007** — Service worker registration MUST be wrapped in a fail-silent guard
  (`__root.tsx`); a registration error MUST NOT surface to the UI.
- **VAL-008** — Production cookies MUST carry the `Secure` attribute; verifiable with
  `curl -I https://<host>/...`.

## 11. Related Specifications / Further Reading

- [Data Layer Specification](./data-layer.spec.md)
- [Server Functions Specification](./server-functions.spec.md)
- [Routing & SSR Specification](./routing-ssr.spec.md)
- [Architecture Specification](../architecture.spec.md)
- [Project File Structure](../file-structure.spec.md)
- External — [Cloudflare Workers Compatibility Dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)
- External — [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- External — [Cloudflare R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- External — [Cloudflare Images Bindings](https://developers.cloudflare.com/images/transform-images/bindings/)
- External — [TanStack Start Server Entry](https://tanstack.com/start/latest)
- External — [Serwist Documentation](https://serwist.pages.dev/)
