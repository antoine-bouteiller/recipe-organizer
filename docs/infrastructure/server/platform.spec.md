---
title: Worker Platform
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md]
---

## 2. Problem Statement

The product needs a single edge runtime that serves the application and gives server code typed
access to relational and object storage. This leaf refines the architecture umbrella's runtime,
storage, image, and PWA decisions [KD-1], [KD-3], [KD-8], and [KD-11].

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                      | Choice                                                                                            | Rationale                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Worker runtime       | `src/server/index.ts` exports the direct Cloudflare Worker `fetch` handler.                       | One deployment serves the same-origin API, OAuth routes, and media while Cloudflare assets serve the SPA.                           |
| `[KD-2]` Capability bindings  | D1 is `DB`; R2 is `R2_BUCKET`; Images is `IMAGES`.                                                | Named bindings make provider services available without application-managed credentials.                                            |
| `[KD-3]` Media representation | Images become WebP at width 640 and quality 80 before their R2 write; video remains source bytes. | Canonical image bytes limit storage and read transfer while preserving video content.                                               |
| `[KD-4]` Media delivery       | R2 reads pass through the edge cache with explicit freshness headers.                             | Repeat reads avoid object-store work at an edge and clients can reuse boundedly fresh bytes.                                        |
| `[KD-5]` PWA registration     | `/sw.js` remains registered as a minimal module worker and forwards every fetch to the network.   | Registration meets the user-required Samsung PWA installation path without restoring offline caching, replay, or fallback behavior. |

## 4. Principles & Intents

- `[PI-1]` **Bindings are capabilities** — refine architecture [KD-3]; server utilities obtain
  provider resources from Worker bindings rather than configuration strings.
- `[PI-2]` **Opaque media keys** — random UUID object keys are identifiers, never user filenames.
- `[PI-3]` **Cache bytes, not authorization** — caching belongs only around media responses whose
  handler has selected a key and representation.

## 5. Non-Goals

- `[NG-1]` An origin server, container fleet, or object-store proxy, refining umbrella [NG-1].
- `[NG-2]` Browser-side image transformation or arbitrary rendition negotiation.
- `[NG-3]` Offline reads, writes, queues, or fallbacks, refining `docs/architecture.spec.md` [NG-4].

## 6. Caveats

- `[C-1]` The Worker runtime feature set is pinned by compatibility date and `nodejs_compat`
  (`wrangler.jsonc:4-6`); a change can affect runtime behavior.
- `[C-2]` R2 receives a materialized image buffer because the transformed response needs a known
  length (`src/server/lib/r2.ts:17-21`).
- `[C-3]` Edge cache entries are local to an edge; the cache header remains the client-visible
  freshness contract.
- `[C-4]` Normal browser HTTP and TanStack Query caches provide no offline guarantee, though they can yield already-loaded data; server edge media caches remain unchanged.

## 7. High-Level Components

| Component            | Module type          | Responsibility                                                | Public API surface                          |
| -------------------- | -------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| Worker configuration | JSON configuration   | Server entry, compatibility, D1/R2/Images bindings            | `wrangler.jsonc`                            |
| Media writer         | Server utility       | UUID keys, image transform, R2 writes                         | `uploadFile`, `uploadVideo`, `deleteFile`   |
| Media reader         | Route helper         | Cached GET and HEAD responses from R2                         | `createR2GetHandler`, `createR2HeadHandler` |
| Edge cache           | Server utility       | Cache read-through and response metadata                      | `cache.getWithCache()`                      |
| PWA service worker   | Static module worker | Supports Samsung installation and forwards fetches to network | `/sw.js`                                    |

## 8. Detailed Design

### 8.1 Worker configuration

The Worker entry is `src/server/index.ts`, whose default export supplies `fetch`; the
configuration declares the `DB`, `R2_BUCKET`, and `IMAGES` bindings (`wrangler.jsonc:3-8`,
`wrangler.jsonc:20-36`). Cloudflare assets serve the built browser SPA with
`not_found_handling: "single-page-application"`, while `/api` and `/api/*` use
`run_worker_first` so API requests reach Hono. Observability records invocation logs while trace
ingestion is disabled (`wrangler.jsonc:11-18`). Binding type changes require regenerated Worker
environment types so utility contracts stay typed.

### 8.2 Media write contract

`uploadFile(file)` mints a UUID, transforms the stream to WebP `{ width: 640, quality: 80 }`,
and writes the resulting bytes with its content type (`src/server/lib/r2.ts:9-23`). `uploadVideo(file)`
writes the file bytes and supplied MIME type under the same opaque-key rule (`src/server/lib/r2.ts:28-36`).
Callers persist keys, never public URLs or filename-derived paths.

### 8.3 Media read and cache contract

The GET helper validates `{ id: string }`, returns 404 control flow when R2 has no object, and
responds with object content type or the caller's fallback (`src/server/lib/r2.ts:42-65`). Image GET
responses use `public, max-age=31536000, immutable`; video GET and HEAD responses use
`public, max-age=86400, stale-while-revalidate=604800` (`src/server/lib/r2.ts:60-61`,
`src/server/lib/r2.ts:82-84`). The cache wrapper stores successful response work by request URL.

### 8.4 PWA registration

`src/client/main.tsx` progressively registers `apps/web/public/sw.js` at `/sw.js` with
`navigator.serviceWorker.register('/sw.js', { scope: '/', type: 'module' })`. This registered worker
is required by the user for Samsung PWA installation; it is not a claim that every browser requires
a worker to install the manifest. Registration failure does not block application rendering.

The worker calls `skipWaiting()` on install and `clients.claim()` on activation.
It remains registered and does not reload pages or clean up legacy storage. Its fetch handler uses
`event.respondWith(fetch(event.request))`; it does not cache, precache, or provide an offline
fallback, UI, or session fallback. Navigations and API requests therefore require connectivity.

The web manifest and icons remain available for installability. Normal online browser HTTP caching
and TanStack Query caching continue unchanged, while providing no offline guarantee. The Worker edge
media cache and its response freshness headers also remain unchanged.

### 8.5 Interaction boundary

Hono feature routes invoke media writers after authorization and validation. Hono media routes use
read helpers for binary responses; application data remains behind RPC and D1 contracts owned by
sibling leaves.

### 8.6 Response metadata

A media response carries the stored content type when present and uses the helper argument only as
a fallback. This permits the image route to advertise WebP and the video route to preserve its
stored MIME type without asking a client to infer the object representation.

A missing object is not represented as an empty successful response. The helper throws a Hono
`HTTPException(404)` before a response is built (`src/server/lib/r2.ts:51-55`), allowing the shared API
boundary to return its `not_found` error envelope without caching a missing object.

### 8.7 Cache lifetime boundary

The edge-cache lookup key is the request URL passed to `getWithCache`. Object keys therefore remain
part of the URL path selected by a route, and an object replacement policy must treat cached
responses as potentially available until their stated freshness expires.

Media cache policy does not provide authorization. The route namespace and server application
policy select which media endpoint is reachable; cache behavior only reuses a response selected by
that endpoint.

### 8.8 Runtime configuration boundary

The configuration uses one Worker name and the direct API handler entry
(`wrangler.jsonc:3-8`). D1, R2, and Images remain separately named capabilities, which permits
the data and media contracts to state exactly which resource they consume.

Runtime secrets do not appear in this configuration. Auth defines their semantic use, while the
Cloudflare deployment environment supplies their values. This prevents build output from becoming
the secret authority.

### 8.9 Failure behavior

Transformation, R2 write, and cache retrieval failures propagate to their API route caller. The
platform helper does not manufacture a successful media key or response after a failed
provider operation, because a persisted key must name bytes that actually exist.

Service-worker registration is progressive: a registration failure does not block the browser from
reaching the Worker online through normal navigation and requests. The registered worker only forwards
requests to the network, preserving the same server and media contracts without offline behavior.

### 8.10 Public contract sketch

The media helper contract is intentionally small: `uploadFile(file) -> key`,
`uploadVideo(file) -> key`, and `createR2GetHandler(contentType) -> route handler`. A key is opaque
and is sufficient for server-side persistence and route URL construction.

The PWA-worker contract is the stable `/sw.js` URL and the minimal lifecycle in section 8.4.
Page and feature code do not invoke Cache APIs. The Worker remains the authority while connectivity
is available.

### 8.11 Existing-image migration

`scripts/migrate-images.ts` uses Wrangler's remote bindings for the D1, R2, and Images resources
configured in `wrangler.jsonc`. It runs locally with an authenticated Wrangler session; no application
endpoint or deployment is needed.

- `pnpm images:migrate` previews changes without writing D1 or R2.
- `pnpm images:migrate --apply` resizes referenced images wider than 640px to WebP quality 80.
- Pause recipe edits and uploads during application, and back up D1/R2 before running it.

Each replacement gets a fresh UUID URL, bypassing immutable browser and edge caches. One conditional
SQL update replaces every recipe reference still using the original key, then the original R2 object
is deleted. Already-small images and videos are untouched. Only recipe-referenced images are scanned.

The script stops on failure and can be rerun: completed replacements are skipped by their width.
If an upload or database update fails, originals remain intact. An uncertain database result can leave
an extra uploaded object; a failed deletion can leave an unreferenced original. These safe leftovers
are not automatically garbage-collected on retry. Refresh the app after migration to refetch recipe URLs.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                                                    | Sections affected    |
| ---------- | ------------------------------------------------------------------------------------------------------------ | -------------------- |
| 2026-09-12 | Use 640px WebP q80 uploads; define media caches.                                                             | 3, 8                 |
| 2026-09-12 | Add a dry-run-first migration for existing images.                                                           | 8.11                 |
| 2026-09-13 | Route media reads and missing-object errors through Hono for one API boundary.                               | 8.5–8.6              |
| 2026-09-13 | Use a direct Worker entry and SPA assets fallback.                                                           | 3, 8.1, 8.4, 8.8–8.9 |
| 2026-09-14 | Scope precaching to the initial shell graph and isolate public offline caches from sensitive API traffic.    | 3, 6, 8.4            |
| 2026-09-14 | Register a minimal network-only `/sw.js` for Samsung installation without offline support or legacy cleanup. | 2–3, 5–8             |
