# 03 — Cloudflare Bindings (R2, Images, sessions)

## Binding rename map

| Today                 | After migration               | Source                                                              |
| --------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `env.DB` (D1)         | `db` from `void/db`           | All query call-sites (see [02-data-layer](./02-data-layer.spec.md)) |
| `env.R2_BUCKET` (R2)  | `storage` from `void/storage` | All upload/get/head/delete sites (D13)                              |
| `env.IMAGES`          | `c.env.IMAGES` (kept)         | Recipe-create action — binding declared in `wrangler.jsonc` (D5)    |
| `env.SESSION_SECRET`  | `BETTER_AUTH_SECRET`          | Better Auth replaces sessions (see [04-auth](./04-auth.spec.md))    |
| `env.GOOGLE_CLIENT_*` | `AUTH_GOOGLE_CLIENT_*`        | Better Auth Google provider                                         |

The default Void name for the R2 bucket binding is `STORAGE`. The current
binding is `R2_BUCKET`. **Rename to `STORAGE`** (Void's default). Per D13:
the bucket itself (`recipe-organizer`) and its object keys are untouched;
only the worker-side env identifier changes. `import { storage } from 'void/storage'`
then works without overrides in `void.json`.

## R2 → `void/storage` rewrite

`src/lib/r2.ts` is replaced by direct `void/storage` usage at the call sites.
That file currently exports five helpers:

| Helper                | Replacement                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `uploadFile(file)`    | Inline in the action handler. See [Image transform](#open-question-cloudflare-images) for what replaces the IMAGES pipeline. |
| `uploadVideo(file)`   | Inline `await storage.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })`                      |
| `deleteFile(key)`     | `await storage.delete(key)`                                                                                                  |
| `createR2GetHandler`  | Direct `defineHandler` in `routes/api/image/[id].ts` and `routes/api/video/[id].ts` (see template below).                    |
| `createR2HeadHandler` | Same `defineHandler` file via `export const HEAD = …`                                                                        |

### Caching

Per D14: **drop the custom `caches.default` wrapper.** Rely entirely on
the `Cache-Control` response header and the upstream CDN
(Cloudflare/Void's edge) for caching. The previous `src/lib/cache-manager.ts`
is **deleted** — not renamed.

Rationale:

- The current SWR header (`public, max-age=86400, stale-while-revalidate=604800`)
  is already strong; Cloudflare's edge respects it.
- The worker-side `caches.default` round-trip adds ~one runtime dependency
  and one failure mode (cache key collisions on URL variants) for the
  same effective TTL.
- If miss-rate turns out to be a real problem, add an inline cache
  wrapper later — the response shape doesn't change.

### Route file template

```ts
// routes/api/image/[id].ts
import { defineHandler } from 'void'
import { storage } from 'void/storage'

const SHARED_HEADERS = {
  'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
}

export const GET = defineHandler(async (c) => {
  const id = c.req.param('id')
  const object = await storage.get(id)
  if (!object) return c.notFound()
  return new Response(object.body, {
    headers: {
      ...SHARED_HEADERS,
      'Content-Type': object.httpMetadata?.contentType ?? 'image/webp',
    },
  })
})

export const HEAD = defineHandler(async (c) => {
  const id = c.req.param('id')
  const head = await storage.head(id)
  if (!head) return c.notFound()
  return new Response(null, {
    headers: {
      ...SHARED_HEADERS,
      'Accept-Ranges': 'bytes',
      'Content-Length': head.size.toString(),
      'Content-Type': head.httpMetadata?.contentType ?? 'image/webp',
    },
  })
})
```

The existing routes `src/routes/api/image/$id.ts` and
`src/routes/api/video/$id.ts` are deleted as part of
[05-routing-and-pages](./05-routing-and-pages.spec.md).

## Cloudflare Images binding (kept)

Per [D5](./00-decisions.spec.md#d5--cloudflare-images): the `IMAGES`
binding stays. The transform pipeline in the current `src/lib/r2.ts`
`uploadFile` (`env.IMAGES.input(file.stream()).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })`)
is **preserved** — only its location moves.

### `wrangler.jsonc`

Stays in the repo. The `images` block is retained verbatim alongside
the D1 + R2 bindings:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "recipe-organizer",
  "main": "<void-injected — see vite build output>",
  "compatibility_date": "2026-01-28",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "recipe-organizer",
      "database_id": "542863e2-5f6d-4ef7-9fd0-84b673f76f43",
      "migrations_dir": "db/migrations",
    },
  ],
  "r2_buckets": [
    {
      "binding": "STORAGE",
      "bucket_name": "recipe-organizer",
    },
  ],
  "images": {
    "binding": "IMAGES",
  },
}
```

Notes:

- `r2_buckets[].binding` renamed `R2_BUCKET` → `STORAGE` (per D13).
- `d1_databases[].migrations_dir` updated to `db/migrations` so
  `wrangler d1 migrations apply` reads from the new flat shape.
- `main` is set by Void's build (`dist/`-merged `wrangler.json`); the
  source `wrangler.jsonc` does not need to declare it for `wrangler deploy`
  to work after `vite build`.

Void's wrangler-config merge (documented in
`node_modules/void/skills/void/docs/integrations/cloudflare.md`) preserves
the `images` block: Void sees `DB` and `STORAGE` already declared (real
IDs), leaves them alone, and passes `IMAGES` through unchanged into the
build output.

### Action-side access

In the recipe-create action, access the binding via Hono's typed `c.env`:

```ts
// pages/recipe/new.server.ts
import { defineHandler } from 'void'
import { storage } from 'void/storage'

export const action = defineHandler.withValidator({
  /* … */
})(async (c, { body }) => {
  const optimized = await c.env.IMAGES.input(body.image.stream()).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })

  const buf = await optimized.response().arrayBuffer()
  const key = crypto.randomUUID()
  await storage.put(key, buf, {
    httpMetadata: { contentType: optimized.contentType() },
  })
  // … insert into DB with key …
})
```

`c.env` types include `IMAGES` once `wrangler.jsonc` is parsed by the Void
plugin's wrangler merge (the binding flows into `Cloudflare.Env`). If
typing falls short at implementation time, augment `CloudflareBindings`
manually in `src/types/env.ts`.

## Sessions binding

The current `src/lib/session.ts` uses `useSession` from `@tanstack/react-start/server`
backed by encrypted cookies signed with `SESSION_SECRET`. Better Auth
manages its own session cookie and store. `src/lib/session.ts` is **deleted**.
See [04-auth](./04-auth.spec.md) for the full session handover.

## Verification gate

This phase is "done" when:

- `wrangler.jsonc` declares `DB`, `STORAGE`, and `IMAGES` with the new
  names/shape
- `routes/api/image/[id].ts` and `routes/api/video/[id].ts` round-trip
  an upload from `vp dev` against local R2 (Miniflare)
- The recipe-create action successfully calls `c.env.IMAGES.input(...).transform(...).output(...)`
  on a local upload
- No imports remain from `'cloudflare:workers'` in `src/`. (`c.env.IMAGES`
  access goes through Hono's typed context, not the raw module.)
- `src/lib/r2.ts` and `src/lib/cache-manager.ts` are deleted (D14)
