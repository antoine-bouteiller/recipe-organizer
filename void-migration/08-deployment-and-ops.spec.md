# 08 — Deployment & Operations

## Deploy flow

**Default (per [D8](./00-decisions.spec.md#d8--deploy-target)):**

```bash
void auth login          # one-time, per machine
void project link        # one-time, links repo to a Void Cloud project
void deploy              # build + deploy
```

`void deploy` runs:

1. Drizzle schema-drift check (refuses to deploy if a pending migration is
   uncommitted — run `void db generate` and commit first).
2. `vite build` (via the Void pipeline).
3. Bundles routes, pages, middleware, crons, queues.
4. Validates `env.ts` schema against `.env.production` + remote secrets.
5. Uploads.
6. Applies migrations on remote D1 (using `db/migrations/*.sql`).

CI sets `VOID_PROJECT=<slug>` (or `--project <slug>`) and uses
`VOID_TOKEN` (saved via `void auth token`) for non-interactive auth.

### Alternative: direct `wrangler deploy`

If [D5 = Option B](./03-bindings.spec.md#option-b-keep-images-binding-via-wranglerjsonc)
ends up the decision (keep Cloudflare Images binding), deploy goes via
direct Cloudflare:

```bash
vite build
wrangler d1 migrations apply DB --remote   # only if Void's flat migration shape works with wrangler
wrangler deploy
```

The Void plugin still merges inferred bindings into the generated
`wrangler.json` under `dist/`, so `wrangler deploy` picks them up. Keep
`wrangler` as a devDependency in this case.

## Secrets

**Local development:**

```
# .env.local (gitignored)
BETTER_AUTH_SECRET=…
AUTH_GOOGLE_CLIENT_ID=…
AUTH_GOOGLE_CLIENT_SECRET=…
VITE_PUBLIC_URL=http://localhost:3000
```

**Production:**

```bash
void secret put BETTER_AUTH_SECRET
void secret put AUTH_GOOGLE_CLIENT_ID
void secret put AUTH_GOOGLE_CLIENT_SECRET
# OR bulk:
void secret sync .env.production.local
```

`void deploy` will hard-fail before upload if any required `env.ts` key is
missing from the union of `.env*` + remote secrets.

Migration-time check: ensure the existing **Cloudflare Workers Secrets**
(`SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are either
re-uploaded under their new names (`BETTER_AUTH_SECRET`, `AUTH_GOOGLE_*`)
or migrated. `SESSION_SECRET` becomes orphaned — delete it after Better
Auth is live to avoid confusion.

## Database migrations

| Command                    | Use                                                                    |
| -------------------------- | ---------------------------------------------------------------------- |
| `void db generate`         | After schema changes — produces `db/migrations/<ts>_<name>.sql`        |
| `void db migrate`          | Apply pending migrations locally                                       |
| `void db migrate --remote` | Apply pending migrations on production D1 (requires `void auth login`) |
| `void db reset`            | Drop + reapply all migrations locally (dev only)                       |
| `void db seed`             | Reset + run `db/seed.ts` or `db/seed.sql`                              |
| `void db studio`           | Open Drizzle Studio on local DB                                        |
| `void db export`           | Dump local DB as SQL (replacement for current `db:dump`)               |

For the **initial** migration from the legacy `migrations/<dir>/migration.sql`
shape, see [02-data-layer → Migrating the deployed D1](./02-data-layer.spec.md#migrating-the-deployed-d1).

## Logs

`console.log/warn/error` from worker code reach Cloudflare Tail. To pull
them locally:

```bash
void project logs --range 1h
void project logs --level error --range 24h
void project logs --filter recipe
```

The current app uses `console` directly in several places (search via
`grep -rn 'console\.' src/`) — those continue to work without changes.

Errors caught and persisted only to the DB are **invisible** to Tail; if any
exist (search for `try { … } catch { /* db write only */ }` patterns),
wrap with `console.error(...)` or `import { logger } from 'void/log'` so
they show in `void project logs --level error`.

## Lint of `no-console`

The current ESLint config has `'no-console': 'error'`. If migrating to
explicit `logger.*` from `void/log`, that rule stays in place and forbids
inline `console`. If keeping the existing tolerance, the rule already
matches reality.

**Recommended:** keep `'no-console': 'error'` and adopt `void/log`'s
`logger` for the few places we need observability. Lower cost than
refactoring later.

## CI

Existing CI (in `.github/workflows/`):

- Replace `wrangler deploy` step with `npx void deploy --project <slug>`
- Add `npx void env check --remote` as a pre-deploy gate
- Authenticate with `VOID_TOKEN` env variable (CI secret)

```yaml
# .github/workflows/deploy.yml (sketch)
- run: pnpm install --frozen-lockfile
- run: pnpm run prepare # vp config + void prepare
- run: pnpm run check # vp check
- run: pnpm run test # vp test (if applicable)
- run: npx void env check --remote
  env:
    VOID_TOKEN: ${{ secrets.VOID_TOKEN }}
- run: npx void deploy --project recipe-organizer
  env:
    VOID_TOKEN: ${{ secrets.VOID_TOKEN }}
```

Use `void init --github` to scaffold this if there's no existing workflow.

## Rollback

`void project rollback [deployId]` rolls back to a prior deployment by
KV-routing swap. Free plan retains 1 deployment, solo 5, pro 25 (per
`reference/cli.md`). Verify what plan we're on.

If running on direct `wrangler deploy`, rollback is via redeploying a
previous tagged build.

## Local dev parity

`vp dev` boots:

- Miniflare for D1, R2 (`STORAGE`), KV
- The Void Vite plugin handles route discovery, page hydration
- Auth runs against local Better Auth tables in the local D1
- Hot reload works for `pages/`, `routes/`, `middleware/`, `src/`

To test against **remote** D1/R2 from local dev:

```json
// void.json
{ "remote": true }
```

…or `VOID_REMOTE=1 pnpm dev`. Requires `void auth login` + linked project.
Useful for debugging prod-only data. **Do not** commit `remote: true`.

## Domain / DNS

If a custom domain is configured on Cloudflare today, it needs to be:

- Re-added via `void domain add <hostname>` on the Void Cloud project, or
- Kept on Cloudflare if using direct `wrangler deploy` (D5 Option B)

The current routes file `wrangler.jsonc` doesn't list a `routes` block,
so there's probably no custom domain in play yet. Confirm.

## Verification gate

This phase is "done" when:

- A `void deploy` to a **preview** Void Cloud project succeeds end-to-end
- The deployed app:
  - Renders all pages
  - Signs in with Google
  - Persists a new recipe with an image upload (full round-trip through
    R2 / IMAGES as configured)
  - Shows up under `void project logs` for at least one info log
- CI runs `void env check --remote` and `void deploy` non-interactively
- All references to `wrangler` are either removed from `package.json` and
  CI **or** explicitly retained for the D5-B scenario with the reason
  recorded in [00-decisions](./00-decisions.spec.md)
