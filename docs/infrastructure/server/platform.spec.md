---
title: Worker Platform
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md]
---

## 2. Problem Statement

The product needs a single edge runtime that serves the application, gives server code typed access
to relational and object storage, and keeps consulted content available during unreliable kitchen
connectivity. This leaf refines the architecture umbrella's runtime, storage, image, and offline
decisions [KD-1], [KD-3], [KD-8], and [KD-11].

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                      | Choice                                                                                             | Rationale                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `[KD-1]` Worker runtime       | TanStack Start runs through Cloudflare's Worker server entry.                                      | One deployment serves document shell, RPC, OAuth routes, and media.                          |
| `[KD-2]` Capability bindings  | D1 is `DB`; R2 is `R2_BUCKET`; Images is `IMAGES`.                                                 | Named bindings make provider services available without application-managed credentials.     |
| `[KD-3]` Media representation | Images become WebP at width 1024 and quality 80 before their R2 write; video remains source bytes. | Canonical image bytes limit storage and read transfer while preserving video content.        |
| `[KD-4]` Media delivery       | R2 reads pass through the edge cache with explicit freshness headers.                              | Repeat reads avoid object-store work at an edge and clients can reuse boundedly fresh bytes. |
| `[KD-5]` Offline scope        | Serwist precaches the shell and uses GET response caching as a fallback.                           | This refines architecture [NG-4] by supporting reading rather than offline writes.           |

## 4. Principles & Intents

- `[PI-1]` **Bindings are capabilities** — refine architecture [KD-3]; server utilities obtain
  provider resources from Worker bindings rather than configuration strings.
- `[PI-2]` **Opaque media keys** — random UUID object keys are identifiers, never user filenames.
- `[PI-3]` **Cache bytes, not authorization** — caching belongs only around media responses whose
  handler has selected a key and representation.

## 5. Non-Goals

- `[NG-1]` An origin server, container fleet, or object-store proxy, refining umbrella [NG-1].
- `[NG-2]` Browser-side image transformation or arbitrary rendition negotiation.
- `[NG-3]` Offline write queues, refining `docs/architecture.spec.md` [NG-4].

## 6. Caveats

- `[C-1]` The Worker runtime feature set is pinned by compatibility date and `nodejs_compat`
  (`wrangler.jsonc:4-6`); a change can affect runtime behavior.
- `[C-2]` R2 receives a materialized image buffer because the transformed response needs a known
  length (`src/lib/r2.ts:17-21`).
- `[C-3]` Edge cache entries are local to an edge; the cache header remains the client-visible
  freshness contract.
- `[C-4]` Service-worker caching only applies to GET requests under the selected runtime matcher
  (`src/sw.ts:15-18`).

## 7. High-Level Components

| Component            | Module type        | Responsibility                                     | Public API surface                          |
| -------------------- | ------------------ | -------------------------------------------------- | ------------------------------------------- |
| Worker configuration | JSON configuration | Server entry, compatibility, D1/R2/Images bindings | `wrangler.jsonc`                            |
| Media writer         | Server utility     | UUID keys, image transform, R2 writes              | `uploadFile`, `uploadVideo`, `deleteFile`   |
| Media reader         | Route helper       | Cached GET and HEAD responses from R2              | `createR2GetHandler`, `createR2HeadHandler` |
| Edge cache           | Server utility     | Cache read-through and response metadata           | `cache.getWithCache()`                      |
| Service worker       | Worker script      | Shell precache and offline GET fallback            | `/sw.js`                                    |

## 8. Detailed Design

### 8.1 Worker configuration

The Worker entry is `@tanstack/react-start/server-entry`; the configuration declares the `DB`,
`R2_BUCKET`, and `IMAGES` bindings (`wrangler.jsonc:3-6`, `wrangler.jsonc:15-32`). Observability
records invocation logs while trace ingestion is disabled (`wrangler.jsonc:7-14`). Binding type
changes require regenerated Worker environment types so utility contracts stay typed.

### 8.2 Media write contract

`uploadFile(file)` mints a UUID, transforms the stream to WebP `{ width: 1024, quality: 80 }`,
and writes the resulting bytes with its content type (`src/lib/r2.ts:9-23`). `uploadVideo(file)`
writes the file bytes and supplied MIME type under the same opaque-key rule (`src/lib/r2.ts:28-36`).
Callers persist keys, never public URLs or filename-derived paths.

### 8.3 Media read and cache contract

The GET helper validates `{ id: string }`, returns 404 control flow when R2 has no object, and
responds with object content type or the caller's fallback (`src/lib/r2.ts:42-65`). GET and HEAD
responses use `public, max-age=86400, stale-while-revalidate=604800` (`src/lib/r2.ts:60-61`,
`src/lib/r2.ts:82-84`). The cache wrapper stores successful response work by request URL.

### 8.4 Offline shell

The Serwist worker owns the generated precache manifest and claims clients immediately
(`src/sw.ts:9-25`). Its `NetworkFirst` handling of same-origin server-function GET requests gives
visited content an offline fallback without changing the server mutation contract.

### 8.5 Interaction boundary

Server functions invoke media writers after authorization and validation. File routes use media
read helpers for binary responses; application data remains behind RPC and D1 contracts owned by
sibling leaves.

### 8.6 Response metadata

A media response carries the stored content type when present and uses the helper argument only as
a fallback. This permits the image route to advertise WebP and the video route to preserve its
stored MIME type without asking a client to infer the object representation.

A missing object is not represented as an empty successful response. The helper throws router
not-found control flow before a response is built (`src/lib/r2.ts:51-55`), allowing the route
boundary to render its ordinary missing-resource result.

### 8.7 Cache lifetime boundary

The edge-cache lookup key is the request URL passed to `getWithCache`. Object keys therefore remain
part of the URL path selected by a route, and an object replacement policy must treat cached
responses as potentially available until their stated freshness expires.

Media cache policy does not provide authorization. The route namespace and server application
policy select which media endpoint is reachable; cache behavior only reuses a response selected by
that endpoint.

### 8.8 Runtime configuration boundary

The configuration uses one Worker name and one TanStack Start entry
(`wrangler.jsonc:2-4`). D1, R2, and Images remain separately named capabilities, which permits
the data and media contracts to state exactly which resource they consume.

Runtime secrets do not appear in this configuration. Auth defines their semantic use, while the
Cloudflare deployment environment supplies their values. This prevents build output from becoming
the secret authority.

### 8.9 Failure behavior

Transformation, R2 write, and cache retrieval failures propagate to their server-function or route
caller. The platform helper does not manufacture a successful media key or response after a failed
provider operation, because a persisted key must name bytes that actually exist.

Service-worker registration and cache availability are progressive capabilities. A browser without
them still reaches the Worker online, preserving the same server and media contracts.

### 8.10 Public contract sketch

The media helper contract is intentionally small: `uploadFile(file) -> key`,
`uploadVideo(file) -> key`, and `createR2GetHandler(contentType) -> route handler`. A key is opaque
and is sufficient for server-side persistence and route URL construction.

The service-worker contract is `/sw.js` plus its manifest-driven cache behavior. Page and feature
code do not invoke cache APIs directly, which keeps offline behavior separate from domain state.
The Worker remains the authority when connectivity is available.

## 9. Open Questions

N/A
