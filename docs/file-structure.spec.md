---
title: Repository Layout
status: amended
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
    packages/design-system/styling.spec.md,
  ]
---

## 2. Problem Statement

N/A — this leaf applies the repository-boundary goal [G-4] in the
[architecture umbrella](architecture.spec.md): contributors need one predictable place for each
module so feature ownership and import boundaries remain legible.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                                                                                                                                                                   | Rationale                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Ownership boundary       | A product domain spans `src/client/features/<feature>/` for UI and query wrappers and `src/server/routes/<feature>/` for Hono routes and DB utilities; `src/shared/<feature>/` holds only cross-runtime contracts.                                       | Runtime-specific code remains isolated while each domain has explicit ownership.                                            |
| `[KD-2]` Runtime-code placement   | Browser code lives in `src/client/`; Worker code lives in `src/server/`; only actual cross-runtime modules live in `src/shared/`.                                                                                                                        | The top-level directories make runtime boundaries visible before an import is written.                                      |
| `[KD-3]` Route and data placement | Browser routes follow URL hierarchy in `src/client/routes/`; Drizzle schema and history artefacts remain in `src/db/schema/` and `src/db/migrations/`.                                                                                                   | URL and database layouts remain independently navigable and tooling finds generated database artefacts in stable locations. |
| `[KD-4]` Naming and imports       | Files use kebab-case except TanStack Router dynamic segments; TypeScript imports use `@client/*`, `@server/*`, and `@shared/*` for cross-directory runtime paths, and `@schema` for database schema exports; relative imports remain within a directory. | Filenames match the lint convention and import paths reveal whether a dependency is local or crosses a module boundary.     |
| `[KD-5]` Styling compilation      | Vanilla-extract compiles owner-local `.css.ts` files; the design-system package exports its public `theme` API while components retain private colocated recipes.                                                                                        | Web, Storybook, and tests share typed theme references without generated utilities or component styling overrides.          |

## 4. Principles & Intents

- `[PI-1]` **Runtime first, then feature** — group product-domain code by feature within each runtime; share modules only when both runtimes need them.
- `[PI-2]` **Runtime boundaries are visible** — code that requires React, the database or Worker bindings never presents as a pure utility.
- `[PI-3]` **Generated artefacts are tool-owned** — route and Worker type outputs are consumed, not edited.
- `[PI-4]` **Public seams are explicit** — a feature imports another feature through its public API rather than its implementation directories, refining architecture [PI-5].

## 5. Non-Goals

- `[NG-1]` Defining behaviour inside individual feature, infrastructure or UI modules; their dedicated specs own those contracts.
- `[NG-2]` Prescribing a fixed internal folder count for a feature whose domain does not need every optional category.

## 6. Caveats

- `[C-1]` The generated `src/client/routeTree.gen.ts` and `worker-configuration.d.ts` files are overwritten by their respective tools and do not accept hand edits; tooling excludes the route tree from formatting and linting (`vite.config.ts:48`, `vite.config.ts:188`).
- `[C-2]` Worker-only imports, including `cloudflare:workers`, stay on server execution paths; importing them into client-rendered components breaks the runtime boundary (`src/server/lib/db.ts:2`).
- `[C-3]` `migrations_tmp/` belongs to Wrangler (`wrangler.jsonc:21`), while authored Drizzle schema history belongs in `src/db/migrations/`.

## 7. High-Level Components

| Component         | Module type | Responsibility                                                                           | Public API surface                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Repository layout | Convention  | Places application, database, documentation, static assets and tooling by responsibility | Directory contract rooted at `src/`, `docs/`, `public/` and `scripts/` |

## 8. Detailed Design

### 8.1 Repository layout

```text
recipe-organizer/
├── docs/
│   ├── architecture.spec.md    # Architecture umbrella
│   ├── file-structure.spec.md  # This repository-layout leaf
│   └── infrastructure/
│       ├── client/             # Routing, forms and client-state specs
│       └── server/             # Platform, data, server-function and auth specs
├── public/                     # Static assets
├── scripts/                    # Build, development, and database tooling
├── packages/
│   └── design-system/           # Reusable UI and owner-local .css.ts styles
│       └── src/theme/
│           ├── index.ts            # Public `theme` API: typed variables and spacing
│           ├── spacing.ts          # CSS `calc(4px * n)` shorthand helper
│           └── tokens.css.ts       # Internal variables and global theme CSS
├── src/
│   ├── client/
│   │   ├── components/         # Browser UI, forms, layout, navigation, and errors
│   │   ├── features/
│   │   │   └── <feature>/      # UI, query wrappers, local state, and colocated feature specs
│   │   ├── hooks/              # Shared React hooks
│   │   ├── lib/                # Browser application services and API client
│   │   ├── routes/             # File-based browser pages
│   │   ├── stores/             # Cross-feature persisted UI state
│   │   ├── styles/             # Global browser styles
│   │   ├── types/              # Frontend-inferred API types
│   │   ├── utils/              # Browser-only helpers
│   │   ├── main.tsx            # Browser SPA entry
│   │   ├── routeTree.gen.ts    # Generated TanStack Router tree
│   │   └── router.tsx          # Router factory and Query provider
│   ├── db/
│   │   ├── migrations/         # Authored Drizzle schema-history artefacts
│   │   └── schema/             # Table modules and relation exports
│   ├── server/
│   │   ├── routes/<feature>/   # Hono routes and feature DB utilities
│   │   ├── lib/                # Auth, D1, R2, cache, and Worker services
│   │   ├── utils/              # Server helpers and authorization checks
│   │   ├── api-context.ts      # Request API context
│   │   ├── api.ts              # Hono API composition
│   │   └── index.ts            # Worker entry
│   └── shared/
│       ├── <feature>/schemas.ts # Cross-runtime feature schemas
│       ├── recipe/constants.ts  # Shared recipe constants
│       ├── ingredients/categories.ts
│       ├── units.ts
│       └── utils/               # Cross-runtime helpers
├── AGENTS.md                   # Contributor guidance
├── tsconfig.json               # TypeScript aliases and compiler configuration
├── vite.config.ts              # Application tooling configuration
└── wrangler.jsonc              # Worker bindings and deployment configuration
```

`apps/web/public/sw.js` is the registered, module service worker at the stable `/sw.js` URL. It
supports the user-required Samsung PWA installation path while forwarding fetches to the network,
without offline support or legacy storage cleanup.

A feature spans runtime-specific directories: `src/client/features/<feature>/` owns its UI,
query/mutation wrappers, and browser-local code; `src/server/routes/<feature>/` owns its Hono route
group and feature DB utilities; `src/shared/<feature>/schemas.ts` owns schemas needed by both. Shared
is not a general reuse bucket: only modules imported by both runtimes belong there. Frontend-inferred
API types remain in `src/client/types/`. Feature specs remain colocated in `src/client/features/` so
one spec tree documents both the browser surface and the matching server feature without crossing the
runtime boundary in code.

Oxlint import restrictions in `vite.config.ts` enforce the runtime boundary: client and server may
import shared modules, but shared imports neither runtime, and server does not import client code.
Client code cannot import database schemas, Worker modules, or server code, except for the type-only
`@server/api` import in `src/client/lib/api-client.ts` used by `hc<typeof api>`. This exception preserves
inferred Hono contracts without including the server implementation in the browser bundle.

`packages/design-system/src/ui/<category>/<component>/` holds repository-owned component families with
colocated `<component>.stories.tsx` files. Desktop, drawer, and shared implementation files stay with
the matching family. Package subpath exports (`@recipe-organizer/design-system/button`, for example)
expose source modules without a separate library build. Generic hooks live in `src/hooks/` and icons
in `src/ui/data-display/icons/` inside the package; it never imports the web app. The combobox option type is shared, while query-backed option
hooks remain app-owned. Vanilla-extract compiles colocated `.css.ts` files through the web,
Storybook, and root test Vite plugins. The design-system package exports typed shared values as
`theme` from `@recipe-organizer/design-system/theme`; the web and Storybook entrypoints load
`@recipe-organizer/design-system/global.css`, which activates the global Vanilla Extract reset/base rules
and shared theme. `src/global.css.ts` defines both reset and base rules, retaining their named
cascade layers. `src/theme/index.ts` combines the internal variables from `tokens.css.ts` with the ordinary
`theme.spacing(...)` helper, which accepts one to four numeric values and returns `calc(4px * n)`
CSS shorthand. The internal token module exports variables only to the public theme index while
emitting global theme CSS. `.css.ts` consumers use typed `theme` references, including template
interpolations, instead of shared raw `var(--…)` strings. Native CSS variables remain appropriate for
component-owned, Base UI, and runtime-owned behavior. No separate generation step or generated utility
directory is required. Component recipes remain colocated with their owners. Route style files use a leading `-` so
TanStack Router excludes them from route generation. Native global CSS remains for owned fonts, theme
activation, safe-area, scrolling, transitions, and runtime-only behavior. Categories are `actions`,
`data-display`, `feedback`, `forms`, `layout`, `navigation`, and `overlays`; each story uses the
matching category as its title prefix. Physical categorization does not change package subpath imports.
`packages/design-system/styling.spec.md` owns the styling and component-ownership guidance.

`apps/web/src/components/` retains thin `layout/`, `navigation/`, and `error/` adapters,
plus domain-specific ingredient-category presentation. Typed form adapters and their context/registry,
file-input support, rich-text editing, generic dialogs, search input, and all icons live in the design
system, along with screen layout, navigation, and error presentation. App adapters own menus, routing
and exact matching, theme/back actions, footer selection, scroll-restoration IDs, and DEV-only error
detail disclosure. Shared presentation receives slots and callbacks and does not depend on TanStack
Router or application environment policy. Feature schemas, query-backed options, API calls, and
persisted app state do not move.
App-specific React hooks and persisted stores live in `apps/web/src/hooks/` and
`apps/web/src/stores/`. `src/client/lib/` and `src/client/utils/` contain browser application services
and browser-only helpers. `src/server/lib/` contains Worker-bound auth, database, R2, and cache
services. `src/shared/` contains cross-runtime schemas, constants, units, and helpers. Shared media URL
helpers use the common Vite `import.meta.env.DEV` flag; they do not depend on browser or Worker bindings.

`index.html` loads `src/client/main.tsx`, which mounts the browser SPA. Routes use
`src/client/routes/` and mirror their URL segments. A dynamic segment uses the TanStack Router
`$parameter` filename form. The Worker entry is `src/server/index.ts`; it dispatches `/api/*` to Hono
rather than using route files as HTTP handlers. Route files do not become feature internals: they
compose a feature's public UI surface.

Database table modules live under `src/db/schema/`, which exports the schema and relations; generated
schema-history artefacts live under `src/db/migrations/`. Root configuration and tool-owned directories
remain at the repository root, separating deployment and build configuration from application code.

All ordinary filenames use kebab-case (`vite.config.ts:120`). `.ts` identifies modules without JSX and
`.tsx` identifies modules that contain JSX. Specs use the `.spec.md` suffix. Cross-directory
application imports use `@client/*`, `@server/*`, and `@shared/*` for runtime paths, and `@schema` for database schema exports (`tsconfig.json:26-29`); same-directory dependencies use relative imports. Feature-to-feature imports use the owning feature's public API and do not reach into another feature's private implementation directories.

## 9. Open Questions

N/A.

## Changelog

| Date       | Amendment                                                                                            | Sections affected | Reason                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| 2026-09-13 | Document feature Hono routes, separate schemas, and typed query wrappers.                            | 8.1               | Reflect the migrated feature API layout.                                |
| 2026-09-13 | Add the SPA entry and direct Hono Worker handler boundary.                                           | 8.1               | Remove route-file HTTP handler placement.                               |
| 2026-09-13 | Separate client, server, and shared modules with enforced import boundaries.                         | 3, 4, 6, 8.1      | Make runtime ownership explicit without adding packages or deployments. |
| 2026-09-13 | Rename the server feature directory to `routes`.                                                     | 3, 8.1            | Match the server route layout.                                          |
| 2026-09-15 | Extract owned UI, supporting hooks/icons, styles, and colocated stories to `packages/design-system`. | 8.1               | Share UI independently of the web app and provide Storybook examples.   |

| 2026-09-15 | Extract app-shell presentation behind app adapters and group UI folders/stories by category. | 8.1 | Keep business logic in web while making presentation discoverable and reusable. |
| 2026-09-16 | Record Panda generated-workspace placement and private component-recipe ownership. | 3, 8.1 | Keep shared generation discoverable without exposing styling overrides. |
| 2026-09-17 | Replace generated utilities with owner-local vanilla-extract styles and shared pixel tokens. | 3, 8.1 | Mechanically migrate styling without changing component ownership. |
| 2026-09-17 | Replace public token exports with the combined typed `theme` API. | 3, 8.1 | Keep token variables internal while standardizing `.css.ts` consumers. |
| 2026-09-17 | Move shared reset/base rules into global Vanilla Extract styles. | 8.1 | Keep layered global rules typed and activate them from both entrypoints. |
| 2026-09-17 | Consolidate reset/base rules in `src/global.css.ts`. | 8.1 | Use one module and public entrypoint for shared global styles. |
