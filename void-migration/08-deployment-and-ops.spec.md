# 08 — Deployment & Operations

Per [D8](./00-decisions.spec.md#d8--deploy-target): the project deploys
**directly to its own Cloudflare account via `wrangler deploy`**. Void
Cloud is not used. The `void` CLI is still used for non-deploy concerns
(typegen, local dev, schema scaffolding, env checks).

## Deploy flow

```bash
# one-time
wrangler login

# every deploy
pnpm run check                              # vp check
pnpm run test                               # vp test
wrangler d1 migrations apply DB --remote    # if pending — see below
vite build
wrangler deploy
```

What happens during `vite build`:

1. `voidPlugin()` runs binding inference and merges with `wrangler.jsonc`
   (per Void's documented wrangler-merge behavior). `DB` and `STORAGE`
   in `wrangler.jsonc` keep their real IDs; `IMAGES` passes through
   unchanged.
2. The merged config is written to `dist/wrangler.json`.
3. Static assets are emitted under `dist/client/` and the worker bundle
   under `dist/<worker>`.

`wrangler deploy` then reads `dist/wrangler.json` and ships the worker.

## Database migrations on remote D1

Apply with `wrangler`, which reads the `migrations_dir: "db/migrations"`
field declared in `wrangler.jsonc`:

```bash
wrangler d1 migrations apply DB --remote
```

**Open verification:** confirm at implementation that `wrangler d1 migrations apply`
accepts Void's flat `<timestamp>_<name>.sql` shape. Drizzle-kit also
emits this shape, so it should work. If wrangler's parser requires a
specific naming or metadata format, document the workaround here.

For the **initial cutover** (legacy `migrations/<dir>/migration.sql` →
flat `db/migrations/<ts>_<name>.sql`), the tracking-table reconciliation
on remote D1 is owned by the project owner (D11). See
[02-data-layer → Migrations directory](./02-data-layer.spec.md#migrations-directory).

| Command (local dev) | Use                                                                |
| ------------------- | ------------------------------------------------------------------ |
| `void db generate`  | After schema changes — produces `db/migrations/<ts>_<name>.sql`    |
| `void db migrate`   | Apply pending migrations locally (against the Miniflare-backed D1) |
| `void db reset`     | Drop + reapply all migrations locally                              |
| `void db seed`      | Reset + run `db/seed.ts` or `db/seed.sql`                          |
| `void db studio`    | Open Drizzle Studio on local DB                                    |

`void db migrate --remote` is **not used** — it requires Void Cloud
auth + project link.

## Secrets

`wrangler.jsonc` declares no `vars`. Secrets are pushed individually
via `wrangler secret put`:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put AUTH_GOOGLE_CLIENT_ID
wrangler secret put AUTH_GOOGLE_CLIENT_SECRET
```

`wrangler` reads values from stdin/prompt; for non-interactive CI, pipe:

```bash
echo -n "$BETTER_AUTH_SECRET" | wrangler secret put BETTER_AUTH_SECRET
```

Bulk upload:

```bash
wrangler secret bulk .env.production.local
```

`void env check` (local) still validates `env.ts` against `.env*` files
and is worth running pre-deploy to catch missing keys. It cannot validate
remote secrets in this flow (no Void Cloud secret list to consult).

### Local development

```ini
# .env.local (gitignored)
BETTER_AUTH_SECRET=…
AUTH_GOOGLE_CLIENT_ID=…
AUTH_GOOGLE_CLIENT_SECRET=…
VITE_PUBLIC_URL=http://localhost:3000
```

`vp dev` reads these via Vite's `loadEnv`, which the Void plugin forwards
into the worker's `vars` block at dev time.

### Migration-time cleanup

Existing Cloudflare Workers secrets to retire:

- `SESSION_SECRET` — orphaned once Better Auth is live; delete via
  `wrangler secret delete SESSION_SECRET`.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — re-upload as
  `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET`; delete the old
  names after Better Auth's Google flow is verified on prod.

## Logs

Cloudflare Tail is the source of truth. Use either:

```bash
wrangler tail
wrangler tail --format=pretty
wrangler tail --status error
```

The current app uses `console.*` directly in several places — those
continue to work and show up in `wrangler tail`. Errors caught and only
persisted to the DB are invisible to Tail; surface them with
`console.error(...)` so they're observable.

`void project logs` is **not used** — it queries Void Cloud's log store.

## Logging discipline

Per [D20](./00-decisions.spec.md#d20--logging-discipline):

- `'no-console': 'error'` stays in `vite.config.ts` lint rules.
- Server-side intentional logs use `logger.*` from `void/log`:

  ```ts
  import { logger } from 'void/log'

  logger.error('failed to fetch ingredient', { recipeId, err })
  logger.warn('cache miss spiked', { route })
  logger.info('user signed in', { userId })
  ```

- `void/log` writes via `console.*` on the worker, so output surfaces in
  `wrangler tail` and any Cloudflare log destination configured on the
  account.
- Migration-time sweep: `grep -rn 'console\.' src/` after the cutover;
  every remaining hit is either deleted or replaced with `logger.*`.

## CI

`.github/workflows/deploy.yml` (sketch):

```yaml
name: deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run prepare # vp config && void prepare
      - run: pnpm run check # vp check
      - run: pnpm run test # if applicable
      - run: pnpm exec wrangler d1 migrations apply DB --remote
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      - run: pnpm exec vite build
      - run: pnpm exec wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Secrets needed in CI:

- `CLOUDFLARE_API_TOKEN` — scoped to Workers Scripts Edit + D1 Edit + R2 Edit + Images
- `CLOUDFLARE_ACCOUNT_ID`

`void deploy` is **not** in CI.

## Rollback

`wrangler deploy` doesn't have a built-in rollback. Two patterns:

- **Tag every deploy:** push a git tag on every successful deploy
  (`v<timestamp>`). To roll back, check out the tag and run `wrangler deploy`
  again from that working tree.
- **Cloudflare dashboard rollback:** Workers' deployment history in the
  dashboard supports a click-to-rollback for the worker script (does not
  roll back D1 schema).

D1 schema rollbacks are not automatic. If a deploy includes a destructive
migration, prepare a hand-written reverse migration before the cutover.

## Local dev parity

`vp dev` boots:

- Miniflare for D1, R2 (`STORAGE`), KV — including a local IMAGES emulator
  (verify at implementation; if Miniflare doesn't emulate Cloudflare Images,
  dev needs to either guard the call-site against missing IMAGES or run
  against remote via `wrangler dev --remote`).
- The Void Vite plugin handles route discovery and page hydration.
- Auth runs against local Better Auth tables in local D1.
- Hot reload works for `pages/`, `routes/`, `middleware/`, `src/`.

To run against remote D1/R2/IMAGES from local dev (debug-only):

```bash
wrangler dev --remote
```

`void.json` `remote: true` is **not** applicable here (it routes through
Void Cloud's proxy).

## Domain / DNS

The current `wrangler.jsonc` has no `routes` block, so the worker is
served from the default `<name>.<subdomain>.workers.dev` URL.

To wire a custom domain:

```jsonc
{
  "routes": [{ "pattern": "recipes.example.com", "custom_domain": true }],
}
```

Cloudflare provisions the cert and DNS automatically when the apex zone
is on the same account.

## Verification gate

This phase is "done" when:

- `wrangler deploy` succeeds against a **preview** Worker (different
  `name` or env in `wrangler.jsonc`) with the full app:
  - All pages render
  - Sign in with Google works end-to-end
  - Creating a recipe with an image upload exercises
    `c.env.IMAGES.transform(...)` and persists the WebP to R2
  - Errors show up in `wrangler tail --status error`
- CI runs `wrangler d1 migrations apply DB --remote` + `wrangler deploy`
  non-interactively using `CLOUDFLARE_API_TOKEN`
- `void deploy` / Void Cloud is not referenced anywhere in the build or
  deploy path
- `wrangler` is retained in `devDependencies` (D8)
- The `void` CLI is still used for `void prepare`, `void db generate`,
  `void db studio`, `void env check`, `void env types`
