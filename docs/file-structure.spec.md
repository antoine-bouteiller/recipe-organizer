---
title: Repository Layout
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/architecture.spec.md
related:
  [
    docs/infrastructure/server/platform.spec.md,
    docs/infrastructure/server/data-layer.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
    docs/infrastructure/client/routing-ssr.spec.md,
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/client/client-state.spec.md,
  ]
---

## 2. Problem Statement

N/A — this leaf applies the repository-boundary goal [G-4] in the
[architecture umbrella](architecture.spec.md): contributors need one predictable place for each
module so feature ownership and import boundaries remain legible.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                                                                                   | Rationale                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Ownership boundary       | `src/features/<feature>/` contains one product domain's API, UI, local hooks, types and utilities; shared concerns live outside feature directories.                     | A domain change remains discoverable in one directory while dependencies shared by several domains have an explicit home.   |
| `[KD-2]` Shared-code placement    | `src/components/`, `src/hooks/`, `src/lib/`, `src/stores/`, `src/types/` and `src/utils/` separate reusable code by runtime responsibility.                              | The directory names make client, server and pure-code boundaries visible before an import is written.                       |
| `[KD-3]` Route and data placement | Routes follow URL hierarchy in `src/routes/`; Drizzle schema and history artefacts live in `db/schema/` and `db/migrations/`.                                            | URL and database layouts remain independently navigable and tooling finds generated database artefacts in stable locations. |
| `[KD-4]` Naming and imports       | Files use kebab-case except TanStack Router dynamic segments; TypeScript imports use `@/` for cross-directory application paths and relative imports within a directory. | Filenames match the lint convention and import paths reveal whether a dependency is local or crosses a module boundary.     |

## 4. Principles & Intents

- `[PI-1]` **Feature first** — product-domain code remains inside its feature until at least two features need the same abstraction.
- `[PI-2]` **Runtime boundaries are visible** — code that requires React, the database or Worker bindings never presents as a pure utility.
- `[PI-3]` **Generated artefacts are tool-owned** — route and Worker type outputs are consumed, not edited.
- `[PI-4]` **Public seams are explicit** — a feature imports another feature through its public API rather than its implementation directories, refining architecture [PI-5].

## 5. Non-Goals

- `[NG-1]` Defining behaviour inside individual feature, infrastructure or UI modules; their dedicated specs own those contracts.
- `[NG-2]` Prescribing a fixed internal folder count for a feature whose domain does not need every optional category.

## 6. Caveats

- `[C-1]` The generated `src/routeTree.gen.ts` and `worker-configuration.d.ts` files are overwritten by their respective tools and do not accept hand edits; tooling excludes the route tree from formatting and linting (`vite.config.ts:34`, `vite.config.ts:115`).
- `[C-2]` Worker-only imports, including `cloudflare:workers`, stay on server execution paths; importing them into client-rendered components breaks the runtime boundary (`src/lib/db.ts:2`).
- `[C-3]` `migrations_tmp/` belongs to Wrangler (`wrangler.jsonc:21`), while authored Drizzle schema history belongs in `db/migrations/`.

## 7. High-Level Components

| Component         | Module type | Responsibility                                                                           | Public API surface                                                            |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Repository layout | Convention  | Places application, database, documentation, static assets and tooling by responsibility | Directory contract rooted at `src/`, `db/`, `docs/`, `public/` and `scripts/` |

## 8. Detailed Design

### 8.1 Repository layout

```text
recipe-organizer/
├── db/
│   ├── migrations/             # Authored Drizzle schema-history artefacts
│   └── schema/                 # Table modules and relation exports
├── docs/
│   ├── architecture.spec.md    # Architecture umbrella
│   ├── file-structure.spec.md  # This repository-layout leaf
│   └── infrastructure/
│       ├── client/             # Routing, forms and client-state specs
│       └── server/             # Platform, data, server-function and auth specs
├── public/                     # Static assets
├── scripts/                    # Build and development tooling
├── src/
│   ├── components/             # Shared UI, form, layout and error components
│   ├── features/
│   │   └── <feature>/
│   │       ├── api/            # Feature server functions and query options
│   │       ├── components/     # Feature UI
│   │       ├── contexts/       # Feature React contexts
│   │       ├── hooks/          # Feature React hooks
│   │       ├── types/          # Feature-only types
│   │       ├── utils/          # Feature-only helpers
│   │       └── spec/           # Feature specs when the domain has a spec tree
│   ├── hooks/                  # Shared React hooks
│   ├── lib/                    # Binding-, SDK- or application-runtime-dependent code
│   ├── routes/                 # File-based pages and HTTP handlers
│   ├── stores/                 # Cross-feature persisted UI state
│   ├── styles/                 # Global styles
│   ├── types/                  # Types shared by feature domains
│   ├── utils/                  # Pure reusable helpers
│   ├── routeTree.gen.ts        # Generated TanStack Router tree
│   ├── router.tsx              # Router factory
│   └── sw.ts                   # Service-worker entry
├── AGENTS.md                   # Contributor guidance
├── tsconfig.json               # TypeScript aliases and compiler configuration
├── vite.config.ts              # Application tooling configuration
└── wrangler.jsonc              # Worker bindings and deployment configuration
```

A feature owns only the subdirectories that carry its domain code. `api/` holds one server function
per verb-oriented file and its TanStack Query option factory (`src/features/recipe/api/get-all.ts:10`,
`src/features/recipe/api/get-all.ts:47`). `components/`, `contexts/`, `hooks/`, `types/` and `utils/`
hold feature-scoped code. A feature does not carry `lib/`: code coupled to a
binding or SDK belongs under the appropriate `src/lib/` topic.

`src/components/` holds shared presentation by role: `ui/` contains repository-owned Base UI
primitives; `forms/`, `dialogs/`, `layout/`, `navigation/`, `error/` and `icons/` hold their matching
reusable component classes. Shared React hooks live in `src/hooks/`. `src/stores/` contains
cross-feature TanStack Store state, while a feature-local store remains in its feature directory.

`src/utils/` contains helpers without React, DOM, fetch, database or Worker-binding dependencies.
`src/lib/` contains application services and dependencies that need those runtime capabilities,
including authentication, database access, R2 access, cache management and persistence helpers.

Routes use `src/routes/` and mirror their URL segments. A dynamic segment uses the TanStack Router
`$parameter` filename form. Server HTTP handlers also live under this tree, such as `routes/api/`.
Route files do not become feature internals: they compose a feature's public UI and API surface.

Database table modules live under `db/schema/`, which exports the schema and relations; generated
schema-history artefacts live under `db/migrations/`. Root configuration and tool-owned directories remain
at the repository root, separating application code from deployment and build configuration.

All ordinary filenames use kebab-case (`vite.config.ts:74`). `.ts` identifies modules without JSX and
`.tsx` identifies modules that contain JSX. Specs use the `.spec.md` suffix. Cross-directory
application imports use `@/` (`tsconfig.json:26`); same-directory dependencies use relative imports. Feature-to-feature imports use the owning
feature's public API and do not reach into another feature's private implementation directories.

## 9. Open Questions

N/A.
