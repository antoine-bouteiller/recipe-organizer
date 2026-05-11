# 03 — Cloudflare Bindings (R2, Images, sessions)

## Binding rename map

| Today                 | After migration               | Source                                                              |
| --------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `env.DB` (D1)         | `db` from `void/db`           | All query call-sites (see [02-data-layer](./02-data-layer.spec.md)) |
| `env.R2_BUCKET` (R2)  | `storage` from `void/storage` | All upload/get/head/delete sites                                    |
| `env.IMAGES`          | **OPEN** — see below          | `src/lib/r2.ts` `uploadFile` only                                   |
| `env.SESSION_SECRET`  | `BETTER_AUTH_SECRET`          | Better Auth replaces sessions (see [04-auth](./04-auth.spec.md))    |
| `env.GOOGLE_CLIENT_*` | `AUTH_GOOGLE_CLIENT_*`        | Better Auth Google provider                                         |

The default Void name for the R2 bucket binding is `STORAGE`. The current
binding is `R2_BUCKET`. Two ways to handle:

- **Option A — Rename binding** to `STORAGE`. Cleanest. Requires producing a
  new R2 bucket (or just updating the binding name in production) and
  re-uploading existing keys, **OR** keeping the same bucket and only
  renaming the binding (object keys stay the same).
- **Option B — Keep custom name** via `void.json`:
  ```json
  { "inference": { "bindings": { "storage": "R2_BUCKET" } } }
  ```

**Recommended: Option A.** R2 object keys are decoupled from the binding
name; only the worker-side env identifier changes. The bucket itself
(`recipe-organizer` in `wrangler.jsonc`) and its objects are unaffected.

## R2 → `void/storage` rewrite

`src/lib/r2.ts` is replaced by direct `void/storage` usage at the call sites.
That file currently exports five helpers:

| Helper                | Replacement                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `uploadFile(file)`    | Inline in the action handler. See [Image transform](#open-question-cloudflare-images) for what replaces the IMAGES pipeline. |
| `uploadVideo(file)`   | Inline `await storage.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })`                      |
| `deleteFile(key)`     | `await storage.delete(key)`                                                                                                  |
| `createR2GetHandler`  | Direct `defineHandler` in `routes/api/image/[id].ts` and `routes/api/video/[id].ts`. See template below.                     |
| `createR2HeadHandler` | Same `defineHandler` file via `export const HEAD = …`                                                                        |

### Cache.getWithCache

The existing `cache-manager.ts` wraps R2 reads in `caches.default` for ISR.
Two replacement options:

- **Inline** — open-code the `caches.default.match`/`put` pattern in each
  route handler (it's ~10 lines).
- **Void ISR** — use `routing.revalidate` in `void.json` to declare
  per-path cache TTLs. Cleaner, but applies at the **page**/asset boundary,
  not custom R2 read responses. So this only replaces ISR for SSR pages,
  not for `routes/api/image/[id].ts` reads.

**Recommended:** keep an inline `caches.default` wrapper for `routes/api/{image,video}/[id].ts`
under `src/lib/cache.ts` (rename to remove the now-misleading `manager`
suffix). The helper has no dependency on Cloudflare-specific env beyond
the `caches` global, which is workerd-provided everywhere Void runs.

### Route file template

```ts
// routes/api/image/[id].ts
import { defineHandler } from 'void'
import { storage } from 'void/storage'
import { cache } from '@/lib/cache'

export const GET = defineHandler(async (c) => {
  const id = c.req.param('id')
  return cache.getWithCache(c.req.url)(async () => {
    const object = await storage.get(id)
    if (!object) return c.notFound()
    return new Response(object.body, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Content-Type': object.httpMetadata?.contentType ?? 'image/webp',
      },
    })
  })
})

export const HEAD = defineHandler(async (c) => {
  const id = c.req.param('id')
  return cache.getWithCache(c.req.url)(async () => {
    const head = await storage.head(id)
    if (!head) return c.notFound()
    return new Response(null, {
      headers: {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Content-Length': head.size.toString(),
        'Content-Type': head.httpMetadata?.contentType ?? 'image/webp',
      },
    })
  })
})
```

The existing routes `src/routes/api/image/$id.ts` and
`src/routes/api/video/$id.ts` are deleted as part of
[05-routing-and-pages](./05-routing-and-pages.spec.md).

## Open question: Cloudflare Images

The current `src/lib/r2.ts` `uploadFile` pipes the upload through
`env.IMAGES.input(...).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })`.

Void's first-class bindings are **DB, KV, STORAGE, AI, SANDBOX, QUEUE\_\***.
**`IMAGES` is not in that set**, per
`node_modules/void/skills/void/docs/integrations/cloudflare.md` and
`reference/resource-inference.md`. There is no `void/images` module.

### Option A — Drop Images, transform client-side before upload

- **How:** Use the browser's `createImageBitmap` + `OffscreenCanvas` (or a
  small lib like `browser-image-compression`) to resize/convert to WebP
  client-side before submitting the form. Server-side, just `storage.put`
  the bytes.
- **Pros:** Removes the Cloudflare-specific binding entirely. Works with
  `void deploy` (Void Cloud) out of the box. Less server CPU.
- **Cons:** Slow / janky on low-end phones; clients see a brief lag during
  encoding. No fallback if the browser doesn't support the requested format
  (modern browsers all do WebP).
- **Migration cost:** Touch `recipe-form.tsx` and any other file upload
  call-site to add a pre-process step. Server code becomes simpler.

### Option B — Keep `IMAGES` binding via `wrangler.jsonc`

- **How:** Add a `wrangler.jsonc` (or keep the existing one) with the
  `images` binding. Void's wrangler-config merge logic
  ([Cloudflare integration docs](https://void.cloud)) preserves
  unrecognized fields. Access via `c.env.IMAGES` in `defineHandler` /
  `loader` / `action` (`c.env` is typed off `Cloudflare.Env` thanks to
  `void/env` types).
- **Pros:** Zero behavior change. Same upload code, just relocated.
- **Cons:** **`void deploy` (Void Cloud) does not currently expose
  arbitrary Cloudflare bindings beyond the first-class set.** Need to
  verify by reading
  `node_modules/void/skills/void/docs/integrations/cloudflare.md` again
  end-to-end and asking Void support if unclear. If unsupported, this
  option forces **deploy via direct `wrangler deploy`** on a private
  Cloudflare account, not `void deploy`. That means [D8 deploy target](./00-decisions.spec.md#d8--deploy-target)
  flips to `wrangler deploy`, with corresponding CI changes
  ([08-deployment](./08-deployment-and-ops.spec.md#alternative-direct-wrangler-deploy)).

### Option C — Server-side transform via Workers AI / external service

- **How:** Run resize on the worker through a JS library (heavy — `sharp`
  doesn't run on workerd) or via a separate service. Workers AI's image
  endpoints are for generation/classification, not arbitrary resizing.
- **Verdict:** Not viable today. Workers don't have a native non-Images
  image transform path.

### Decision criteria

Pick **Option A** if:

- Users mostly upload from modern devices (yes for this app — recipes are
  added on phones with WebP-capable browsers).
- Holding to `void deploy` is a goal (yes — it's why we're migrating).

Pick **Option B** if:

- The image transform pipeline is operationally critical (high concurrency,
  variable formats, server-driven re-encoding) and the resize lag on
  client is unacceptable.
- The team is willing to give up Void Cloud convenience for direct
  Cloudflare deploy.

**Recommended: Option A.** The current transform is a single resize +
WebP encode, well within client capabilities. Net wins: no extra binding,
keep `void deploy`, simpler server code. **Confirmation required from
project owner before implementation.**

### Implementation note for Option A

Add a small `src/utils/resize-image.ts` (client-only):

```ts
export const resizeImageToWebp = async (file: File, maxWidth = 1024, quality = 0.8): Promise<File> => {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width)
  const canvas = new OffscreenCanvas(bitmap.width * scale, bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unsupported')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
}
```

Use it in the form before passing `image` to `useForm.setData` so the action
already receives a transformed File.

## Sessions binding

The current `src/lib/session.ts` uses `useSession` from `@tanstack/react-start/server`
backed by encrypted cookies signed with `SESSION_SECRET`. Better Auth
manages its own session cookie and store. `src/lib/session.ts` is **deleted**.
See [04-auth](./04-auth.spec.md) for the full session handover.

## Verification gate

This phase is "done" when:

- The IMAGES decision is made (A/B/C) and recorded in
  [00-decisions.spec.md → D5](./00-decisions.spec.md#d5--cloudflare-images)
- `routes/api/image/[id].ts` and `routes/api/video/[id].ts` round-trip an
  upload from `vp dev` against local R2 (miniflare)
- No imports remain from `'cloudflare:workers'` in src/, except possibly
  one IMAGES read site if Option B is chosen
- `src/lib/r2.ts`, `src/lib/cache-manager.ts` (renamed/inlined) cleanup
  complete
