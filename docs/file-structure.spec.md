---
title: File structure & module organization
status: amended
author: Antoine Bouteiller
date: 2026-04-18
related:
  - ./infrastructure/platform.spec.md
  - ./infrastructure/data-layer.spec.md
  - ./infrastructure/routing-ssr.spec.md
---

## 2. Problem Statement

The codebase spans SSR routes, server functions, a Drizzle data layer, rich-text editor nodes, form
primitives, six feature domains, and shared UI. Without a documented layout, contributors (human or agent)
waste time hunting for the "right" folder, duplicate utilities, or cross-import between features in ways that
couple unrelated code. This spec codifies where code lives and why.

- `[G-1]` Give every kind of code a single, predictable home under `src/`.
- `[G-2]` Keep feature domains isolated: no cross-feature imports, no leaky abstractions.
- `[G-3]` Distinguish **shared** primitives (`src/components`, `src/lib`, `src/hooks`) from **feature-owned**
  code (`src/features/<name>/`).
- `[G-4]` Make the difference between routes (URLs), features (domain), and components (UI primitives)
  obvious to newcomers.
- `[G-5]` Document generated files so they are never hand-edited.
- `[G-6]` Serve as the authoritative layout reference for the repo.

## 3. Key Design Decisions

| Decision                                         | Choice                                                                                | Rationale                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `[KD-1]` Feature-folder layout                   | One folder per domain under `src/features/<name>/`                                    | Aligns with `[PI-2]` in `index.spec.md`: each feature owns its API, components, hooks, types. |
| `[KD-2]` Routes folder is URL-shaped only        | `src/routes/` mirrors URL paths (TanStack Start file routes)                          | File path = URL path; no domain logic beyond loaders and the route shell.                     |
| `[KD-3]` Shared UI under `src/components/`       | UI primitives (shadcn-based) + form fields + layout + icons                           | Used by many features; kept feature-agnostic so features never import one another via UI.     |
| `[KD-4]` Shared runtime helpers under `src/lib/` | DB instance, R2 helpers, session, query-keys, cache manager, etc.                     | Cross-cutting runtime concerns that are not React components.                                 |
| `[KD-5]` Shared hooks under `src/hooks/`         | Hooks usable by any feature (`useAppForm`, `useIsMobile`, …)                          | Feature-scoped hooks live under `src/features/<name>/hooks/`.                                 |
| `[KD-6]` Global stores under `src/stores/`       | Zustand stores whose state is consumed across features                                | Cart and `recipe-quantities` are inherently cross-page — see `client-state.spec.md`.          |
| `[KD-7]` No barrel files                         | Every module imports from the file path, not `index.ts`                               | Better tree-shaking; fewer circular-import traps.                                             |
| `[KD-8]` Co-located specs                        | `*.spec.md` lives with the feature; cross-cutting in `docs/` + `docs/infrastructure/` | Specs travel with the code they describe (see `infrastructure/index.spec.md`).                |
| `[KD-9]` Generated files are off-limits          | `routeTree.gen.ts`, `worker-configuration.d.ts`, `migrations/*`                       | Hand edits are overwritten by their generators.                                               |
| `[KD-10]` Specs are the single source of truth   | Architecture/layout knowledge lives exclusively in `docs/**/*.spec.md`                | One canonical tree avoids drift between onboarding prose and living specs.                    |

## 4. Principles & Intents

- `[PI-1]` **Feature isolation** — `src/features/A/` must not import from `src/features/B/`. If two features
  need to share code, promote it to `src/components/`, `src/lib/`, `src/hooks/`, or `src/types/`.
- `[PI-2]` **Routes are thin** — `src/routes/*.tsx` only wires loaders, context, SEO, and renders components
  from `src/features/<name>/components/`. Domain logic belongs in the feature folder.
- `[PI-3]` **Shared means reusable, not generic** — before putting something in `src/lib/`, ask "would a
  second feature use this?" If not, keep it inside the feature.
- `[PI-4]` **Server boundaries live in `api/`** — every feature that talks to D1/R2 exposes its server
  functions in `src/features/<name>/api/`. UI never imports from `src/lib/db/` directly.
- `[PI-5]` **No default exports** — named exports only (see global TypeScript rule). A feature's public
  surface is the set of named exports its consumers actually import.
- `[PI-6]` **File names are kebab-case; React components are camelCase** — aligns with the global TS rule.

## 5. Non-Goals

- `[NG-1]` Defining a `src/api/` top-level folder. All API declarations live inside features
  (`src/features/<name>/api/`).
- `[NG-2]` Introducing a monorepo (`packages/`, `apps/`). This is a single Cloudflare Worker + Vite+ project.
- `[NG-3]` Enforcing the layout via path-based lint rules. The Oxlint stack does not ship a
  `no-restricted-imports` equivalent (see `[C-6]`); convention + code review carry the invariant.
- `[NG-4]` Documenting every file. This spec describes the folder contract; individual files are self-explanatory
  via names + types.

## 6. Caveats

- `[C-1]` `src/components/forms/editor/` and `src/features/recipe/components/editor/` both exist. The former
  hosts the shared Lexical editor host (`<EditorField>` and Lexical plugins usable by any form); the latter
  hosts recipe-specific decorator nodes (Magimix, Subrecipe). Do not collapse them — see
  `recipe/spec/editor.spec.md`.
- `[C-2]` `src/features/recipe/spec/` is a directory (not a single `recipe.spec.md`) because the Recipe spec
  was split per `spec.md` "Splitting a spec" rule. Other features have a single `*.spec.md`.
- `[C-3]` Generated files — **do not edit**:
  - `src/routeTree.gen.ts` (TanStack Router route generation)
  - `worker-configuration.d.ts` (Wrangler bindings)
  - `migrations/*.sql` (Drizzle migrations — produced by `drizzle-kit generate`)
- `[C-4]` `migrations_tmp/` is a Wrangler dev-only pointer; `migrations/` is canonical. See
  `infrastructure/platform.spec.md` `[C-1]`.
- `[C-5]` `src/utils/` holds tiny pure helpers (`cn`, `is-null-or-undefined`, `number`, `string`, …). If a
  helper grows runtime dependencies (DB, R2, fetch), promote it to `src/lib/`.
- `[C-6]` Oxlint (the linter Vite+ bundles) ships no `no-restricted-imports` rule. Feature isolation
  (`[PI-1]`) and the import-direction invariant (`[VC-2]`) are enforced by convention; machine enforcement
  waits on upstream support.

## 7. High-Level Components

### Top-level directory tree (repo root)

```text
recipe-organizer/
├── docs/
│   ├── file-structure.spec.md  # This spec
│   └── infrastructure/         # Cross-cutting specs (platform, data-layer, forms, …)
├── migrations/                 # D1 migrations (generated by Drizzle; canonical)
├── migrations_tmp/             # Wrangler dev-only migrations pointer (see infrastructure/platform.spec.md [C-1])
├── public/                     # Static assets served verbatim by the Worker
├── src/                        # Application source (see below)
├── scripts/                    # One-off scripts (e.g. Lexical migration)
├── AGENTS.md                   # Agent-facing project entry (symlinked to CLAUDE.md)
├── CLAUDE.md                   # Project entry for Claude (symlink target of AGENTS.md)
├── wrangler.jsonc              # Cloudflare Worker bindings + compat flags
├── vite.config.ts              # Vite+ config
└── package.json
```

### `src/` tree

```text
src/
├── components/          # Shared, feature-agnostic UI
│   ├── ui/              # shadcn primitives (button, dialog, drawer, select, …)
│   ├── forms/           # Form field wrappers used by `useAppForm`
│   │   └── editor/      # Lexical editor host + shared plugins
│   ├── dialogs/         # Reusable dialog shells (delete-dialog, form-dialog)
│   ├── error/           # Error boundaries, not-found, offline banner
│   ├── layout/          # Theme provider, screen layout
│   ├── navigation/      # Navbar, tabbar, nav constants
│   └── icons/           # App icon set
├── features/            # Feature domains (see below)
├── hooks/               # Shared hooks (useAppForm, useIsMobile, useFileUpload, …)
├── lib/                 # Cross-cutting runtime helpers
│   ├── db/              # Drizzle schema + getDb() entry point
│   ├── r2.ts            # R2 upload/delete + route handler factories
│   ├── session.ts       # App + OAuth cookie sessions
│   ├── query-keys.ts    # Centralized TanStack Query keys
│   ├── cache-manager.ts # HTTP cache headers for R2 routes
│   ├── toast-helpers.ts # Toast singleton helpers
│   └── theme.ts
├── routes/              # TanStack Start file routes (URLs only)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── search.tsx
│   ├── settings.tsx
│   ├── shopping-list.tsx
│   ├── api/             # HTTP route handlers (image/$id, video/$id)
│   ├── auth/            # OAuth callback routes
│   ├── recipe/          # $id, new, edit.$id
│   └── settings/        # account, ingredients, units, users
├── stores/              # Zustand stores used across features
├── styles/              # Global CSS, theme tokens
├── types/               # Shared domain types (ingredient, recipe)
├── utils/               # Tiny pure helpers (cn, number, string, array, …)
├── router.tsx           # Router factory (called by TanStack Start)
├── routeTree.gen.ts     # GENERATED — do not edit
└── sw.ts                # Serwist service worker source
```

### Feature folder shape (`src/features/<name>/`)

```text
src/features/<feature>/
├── api/             # Server functions (createServerFn entry points)
├── components/      # React components scoped to this feature
├── contexts/        # React contexts scoped to this feature
├── hooks/           # Hooks scoped to this feature
├── types/           # Local types (if not promoted to src/types/)
├── utils/           # Local utils
├── lib/             # Feature-scoped non-UI helpers (rare; e.g. auth/lib)
└── <feature>.spec.md  # OR spec/ dir if split per spec.md rules
```

Not every feature uses every subfolder. Inventory:

| Feature         | Subfolders present                                               | Spec shape                       |
| --------------- | ---------------------------------------------------------------- | -------------------------------- |
| `auth`          | `api/`, `lib/`                                                   | `auth.spec.md`                   |
| `ingredients`   | `api/`, `components/`, `hooks/`, `utils/`                        | `ingredients.spec.md`            |
| `units`         | `api/`, `components/`                                            | `units.spec.md`                  |
| `users`         | `api/`, `components/`                                            | `users.spec.md`                  |
| `shopping-list` | `api/`, `components/`, `hooks/`, `utils/`                        | `shopping-list.spec.md`          |
| `recipe`        | `api/`, `components/`, `contexts/`, `hooks/`, `types/`, `utils/` | `spec/` dir (index + 3 subspecs) |

### Component inventory (this spec's own module surface)

| Component             | Module type                | Responsibility                                                               | Public surface                                                      |
| --------------------- | -------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Repo layout           | Directory contract         | Top-level folders (src, docs, migrations, public, scripts, wrangler)         | Directory tree above                                                |
| `src/` layout         | Directory contract         | Split between shared UI / runtime / routes / features / stores / utils       | Tree above                                                          |
| Feature folder shape  | Convention                 | `<feature>/api`, `components`, `hooks`, `utils`, `types`, `lib`, `*.spec.md` | Tree above                                                          |
| Routes mapping        | TanStack Start file routes | Route paths mirror URL structure                                             | `src/routes/**/*.tsx` → URLs                                        |
| Generated file ledger | Documentation              | Enumerates files produced by tooling                                         | `routeTree.gen.ts`, `worker-configuration.d.ts`, `migrations/*.sql` |

## 8. Detailed Design

### Where does X go?

| You're adding…                                       | Put it in…                                                     | Notes                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| A new URL (page)                                     | `src/routes/<path>.tsx`                                        | Re-run `vp dev` to regenerate `routeTree.gen.ts`.          |
| A new feature domain                                 | `src/features/<name>/` + `<name>.spec.md`                      | Follow feature shape above.                                |
| A server function for an existing feature            | `src/features/<feature>/api/<verb>.ts`                         | Use `createServerFn` + `authGuard` + `withServerError`.    |
| A shared shadcn primitive                            | `src/components/ui/`                                           | `vp dlx shadcn@latest add @coss/<name>` where possible.    |
| A form field wrapper                                 | `src/components/forms/<name>-field.tsx`                        | Used by `useAppForm` — see `infrastructure/forms.spec.md`. |
| A Lexical editor plugin shared by any form           | `src/components/forms/editor/`                                 | Shared rich-text host.                                     |
| A Lexical decorator node specific to recipes         | `src/features/recipe/components/editor/`                       | E.g. Magimix, Subrecipe.                                   |
| A cross-cutting helper (DB, R2, session, query keys) | `src/lib/`                                                     | Not a component; not tied to one feature.                  |
| A helper used by one feature                         | `src/features/<feature>/utils/` or `hooks/`                    | Promote to `src/lib/` only when a second feature needs it. |
| A React context scoped to one feature                | `src/features/<feature>/contexts/`                             | E.g. `recipe/contexts/linked-recipes-context.tsx`.         |
| A tiny pure helper (`cn`, `isNullOrUndefined`, …)    | `src/utils/`                                                   | No runtime deps (no DB/R2/fetch).                          |
| A Zustand store used by multiple features            | `src/stores/`                                                  | See `infrastructure/client-state.spec.md`.                 |
| A shared type                                        | `src/types/` if used across features; else `features/*/types/` |                                                            |
| A one-off script (data migration, maintenance)       | `scripts/`                                                     | Not shipped in the Worker bundle.                          |
| A Drizzle schema change                              | `src/lib/db/schema/` + `vp run db:generate`                    | See `infrastructure/data-layer.spec.md`.                   |
| A spec covering one feature                          | `src/features/<feature>/<feature>.spec.md`                     | Split into `spec/` dir when >300 lines / >3 components.    |
| A cross-cutting spec                                 | `docs/infrastructure/<name>.spec.md`                           | Link from `docs/infrastructure/index.spec.md`.             |

### Import direction

```text
routes/   ─────────┐
                   ▼
components/ ◄── features/<X>/ ──┐
                                ├──► lib/, hooks/, stores/, utils/, types/, contexts/
components/ ◄────────────────── ┘
                   ▲
                   │ (never)
features/<Y>/ ─────┘   ⛔  feature-to-feature imports are forbidden
```

- Routes may import from features, components, lib, hooks, stores.
- Features may import from components, lib, hooks, stores, utils, types, contexts.
- Features MUST NOT import from other features.
- `src/components/`, `src/lib/`, `src/hooks/`, `src/utils/` MUST NOT import from `src/features/` or
  `src/routes/`.

### Generated files (do not edit)

| File                        | Generator                            | Regenerate with       |
| --------------------------- | ------------------------------------ | --------------------- |
| `src/routeTree.gen.ts`      | `@tanstack/react-router` Vite plugin | `vp dev` / `vp build` |
| `worker-configuration.d.ts` | `wrangler types`                     | `wrangler types`      |
| `migrations/*.sql`          | `drizzle-kit generate`               | `vp run db:generate`  |

## 9. Verification Criteria

- `[VC-1]` No file under `src/features/<A>/` imports from `src/features/<B>/` (different `<A>`, `<B>`).
  Check: `rg "from ['\"].*src/features/" src/features --glob '!**/*.spec.md'` and inspect cross-feature
  references.
- `[VC-2]` No file under `src/components/`, `src/lib/`, `src/hooks/`, `src/utils/` imports from
  `src/features/` or `src/routes/`.
- `[VC-3]` Every `src/features/<name>/` directory contains a `*.spec.md` file or a `spec/` directory with
  `index.spec.md`.
- `[VC-4]` Every route file under `src/routes/` is either a TanStack Start file route or an API handler —
  no feature domain logic beyond loaders/context wiring.
- `[VC-5]` `src/routeTree.gen.ts` and `worker-configuration.d.ts` have no manual edits (match generator
  output).
- `[VC-6]` `vp check` passes (lint + format + typecheck) with no import-path violations.
- `[VC-7]` `docs/infrastructure/index.spec.md` section 7 links to this spec.
- `[VC-8]` Feature-scoped React contexts live under `src/features/<feature>/contexts/`.

## 10. Open Questions

N/A.

## Changelog

| Date       | Amendment                                                                                                                                                                                                                                                               | Sections affected    | Reason                                                                                                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-18 | Deleted `agents_doc/`; relocated `linked-recipes-context.tsx` from `src/contexts/` to `src/features/recipe/contexts/`; noted Oxlint has no `no-restricted-imports`; stripped historical breadcrumbs from body per spec rule §5 and removed resolved `[OQ-1..3]` per §6. | 2, 3, 5, 6, 7, 9, 10 | Consolidating all layout/architecture knowledge in `docs/**/*.spec.md`; resolving the singleton `src/contexts/` anomaly; recording the linter gap that blocks machine-enforcement of `[PI-1]` / `[VC-2]`. |
