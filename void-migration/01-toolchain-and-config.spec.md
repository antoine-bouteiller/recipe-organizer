# 01 — Toolchain & Project Config

Covers `package.json`, `vite.config.ts`, `void.json`, `tsconfig.json`,
`env.ts`, `.gitignore`, and scripts. **Pre-requisite** for everything else —
do this phase first.

## `package.json` — dependency churn

### Remove

| Package                            | Reason                                               |
| ---------------------------------- | ---------------------------------------------------- |
| `@cloudflare/vite-plugin`          | Replaced by `voidPlugin()`                           |
| `@tanstack/react-router`           | Replaced by `@void/react` Pages mode                 |
| `@tanstack/react-router-ssr-query` | SSR-Query bridge, irrelevant without Router or Query |
| `@tanstack/react-router-devtools`  | Router devtools, irrelevant                          |
| `@tanstack/react-start`            | Replaced by Pages mode loaders/actions               |
| `@tanstack/react-form`             | Replaced by `useForm` from `@void/react`             |
| `wrangler`                         | Replaced by `void` CLI (unless D5 picks (b))         |
| `@tanstack/devtools-vite`          | Vite plugin specific to TanStack devtools            |
| `@tanstack/react-devtools`         | TanStack devtools UI                                 |

### Conditionally remove (after [07-tanstack-query](./07-tanstack-query.spec.md))

| Package                          | Condition                                    |
| -------------------------------- | -------------------------------------------- |
| `@tanstack/react-query`          | Remove if no retained usage                  |
| `@tanstack/react-query-devtools` | Always removed when `react-query` is removed |

### Add

| Package       | Reason                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `@void/react` | Pages mode adapter (provides `useForm`, `Link`, `useRouter`, `useShared`, etc.)                 |
| `valibot`     | Action body validators in `.server.ts` (lighter than `zod`; matches Void's documented examples) |

Note: `void` is already in devDependencies (`^0.7.3`). `drizzle-orm` and
`drizzle-kit` are already pinned but Void also re-exports them via `void/db`
— direct imports of `drizzle-orm` outside of `db/schema.ts` should be ported
to `void/db` (see [02-data-layer](./02-data-layer.spec.md#imports-cleanup)).

### Decision: `valibot` vs `zod` for new validators

The codebase currently uses `zod@4.4.3` extensively. Two paths:

- **Migrate to `valibot`** for new server validators (matches Void docs and
  the schema-derived helpers it ships under `void/drizzle-valibot`). Existing
  client-side `zod` usage (e.g. route search params, form parsers) stays
  during the migration; remove `zod` only once nothing imports it.
- **Stay on `zod`** via `void/drizzle-zod`. Lower churn. Both are
  Standard-Schema compliant so `useForm`/`withValidator()` accept either.

**Recommended: stay on `zod`.** The existing schemas are non-trivial
(`recipeSchema`, `unitSlugSchema`, parsers in routes). Migrating the
validator library is a separate, optional task with its own risk.

### Scripts

```jsonc
{
  "scripts": {
    "build": "vp build",
    "dev": "vp dev", // ← drop CLOUDFLARE_ENV=dev, Void manages the dev runtime
    "check": "vp check --fix",
    "serve": "vp preview",
    "knip": "knip",
    "prepare": "vp config && void prepare", // ← void prepare generates .void/*.d.ts before typecheck
    "deploy": "void deploy", // ← new
    "db:generate": "void db generate", // ← replaces drizzle-kit usage
    "db:migrate:local": "void db migrate", // ← replaces apply-migration-local.ts
    "db:migrate:remote": "void db migrate --remote",
    "db:studio": "void db studio",
    "db:reset": "void db reset",
  },
}
```

Remove `cf-typegen`, `migration:apply:local`, `migration:apply:remote`,
`db:dump`, `db:import` from the existing scripts. The `scripts/` directory
holding `apply-migration-local.ts` can be deleted after the data layer is
migrated.

## `vite.config.ts`

Replace the plugin list. The rest of the Vite+ `defineConfig` block
(`lint`, `fmt`, `resolve`, `server`) stays.

```ts
// vite.config.ts (target shape)
import { tanstackSerwistPlugin } from './scripts/generate-sw.ts'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'
import { voidPlugin } from 'void'
import { voidReact } from '@void/react/plugin'

export default defineConfig({
  // … staged / lint / fmt blocks unchanged …
  resolve: { tsconfigPaths: true },
  plugins: [
    voidPlugin(),
    voidReact(), // @void/react bundles @vitejs/plugin-react
    tailwindcss(),
    tanstackSerwistPlugin(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: { port: 3000 },
})
```

Notes:

- `@void/react/plugin` already includes `@vitejs/plugin-react`. Drop the
  standalone `react()` call **unless** the `babel-plugin-react-compiler`
  integration requires it as a separate plugin. Verify at implementation:
  if the React Compiler stops applying, restore `react()` after
  `voidReact()` per the void docs note "Pass framework plugin options via
  `voidReact({ react: { ... } })` if needed".
- The TanStack devtools plugin is removed.
- Remove `cloudflare()` and the `viteEnvironment: { name: 'ssr' }` option.

## `void.json`

New file at project root.

```jsonc
{
  "$schema": "./node_modules/void/schema.json",
  "target": "cloudflare",
  "auth": {
    "providers": ["google"],
  },
  "worker": {
    "compatibility_date": "2026-01-28",
    "compatibility_flags": ["nodejs_compat"],
  },
  "inference": {
    "bindings": { "db": true, "storage": true },
  },
}
```

- `auth.providers: ["google"]` — no email/password.
- `worker.compatibility_date` carried over from `wrangler.jsonc`.
- `inference.bindings` is set explicitly to make the binding contract
  unambiguous; without it, inference scans `src/`, `pages/`, `routes/`,
  `middleware/`. Either works.
- **No** `routing.redirects`/`rewrites` are needed at migration time. The
  current app has no static redirect rules.

If [D5 = (b) keep IMAGES on own Cloudflare](./03-bindings.spec.md#option-b-keep-images-binding-via-wranglerjsonc),
also keep `wrangler.jsonc` and follow the
[Wrangler config merging](https://void.cloud)
behavior documented in `node_modules/void/skills/void/docs/integrations/cloudflare.md`.

## `tsconfig.json`

Current shape (`tsconfig.json`):

```json
{ "extends": "@tsconfig/vite-react/tsconfig.json", "include": ["src"] }
```

Target shape:

```json
{
  "extends": ["@tsconfig/vite-react/tsconfig.json", "./.void/tsconfig.json"],
  "include": ["src", "pages", "routes", "middleware", "db", "env.ts"],
  "compilerOptions": {
    "types": ["void/env"]
  }
}
```

Rationale:

- `./.void/tsconfig.json` is generated by `void prepare` / `vite dev` and
  brings typed bindings, route types, db types, queue types.
- `types: ["void/env"]` augments `Cloudflare.Env` with `DB`/`STORAGE`/etc.
- The `include` list adds the new convention directories.

Run `void init --tsconfig` once if the merge above is non-trivial to
hand-author; the CLI handles `extends` arrays for projects that already use
one (per `node_modules/void/skills/void/docs/reference/cli.md`).

## `env.ts` — typed env schema

New file at project root. Replace ad-hoc reads of `import.meta.env.VITE_*` and
`env.SESSION_SECRET` / `env.GOOGLE_CLIENT_*` from `cloudflare:workers`.

```ts
// env.ts
import { defineEnv, string, url } from 'void/env'

export default defineEnv({
  // public (client-readable)
  VITE_PUBLIC_URL: url(),

  // server-only — auth
  BETTER_AUTH_SECRET: string().secret(),
  AUTH_GOOGLE_CLIENT_ID: string().secret(),
  AUTH_GOOGLE_CLIENT_SECRET: string().secret(),
})
```

- `SESSION_SECRET` is **removed** (Better Auth uses `BETTER_AUTH_SECRET`).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are renamed to the
  `AUTH_GOOGLE_*` form expected by Better Auth via Void.
- `VITE_PUBLIC_URL` keeps its current name and stays public.

Run `void env example` to write the marker-delimited block into `.env.example`.
Run `void secret sync .env.production.local` (or `void secret put ...`) once
to upload prod secrets after first `void project link`.

## `.gitignore`

Add (if not present):

```
.void/
!.void/project.json
```

`.void/project.json` is the project link state — keep it committed so CI/teammates
hit the same Void project.

The `wrangler` artefacts (`.wrangler/`, `worker-configuration.d.ts`) can be
removed entirely once auth migration is verified.

## Files deleted at the end of this phase

- `wrangler.jsonc` (only if D5 = (a) or (c))
- `.wrangler/` directory
- `worker-configuration.d.ts`
- `drizzle.config.ts` (replaced by Void's bundled drizzle-kit + `void db generate`)
- `scripts/apply-migration-local.ts`
- `database.sql` (kept for emergency restore; consider archiving outside the repo)

## Verification gate

This phase is "done" when:

- `vp install` succeeds with the new dependency set
- `void prepare` generates `.void/*.d.ts` without errors
- `vp dev` boots — even if pages 404 — and Vite picks up the new plugins
- `tsc --noEmit` (via `vp check`) does **not** complain about missing types
  for `void/db`, `void/storage`, `void/auth`, `@void/react`

Wire 02–09 only after this gate passes.
