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
    src/styles/styling.spec.md,
  ]
---

## 2. Problem Statement

N/A — this leaf applies the repository-boundary goal [G-4] in the
[architecture umbrella](architecture.spec.md): contributors need one predictable place for each
module so feature ownership and import boundaries remain legible.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                                                                                                                                                                                                           | Rationale                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Ownership boundary       | A product domain spans `src/features/<feature>/client/` for UI and browser-only API readers, `src/features/<feature>/server/` for server domain utilities, isomorphic contracts at the feature root, `pages/` for Void loaders/actions, and `routes/api/<feature>/` for remaining HTTP handlers. | Runtime-specific code remains isolated while each domain has explicit ownership.                                            |
| `[KD-2]` Runtime-code placement   | Page composition lives in `pages/` and Worker HTTP routes in `routes/api/`; all application source lives in `src/`, split into `client/` and `server/` folders inside features and `src/lib/`; only actual cross-runtime modules sit outside those folders.                                      | The folder names make runtime boundaries visible before an import is written.                                               |
| `[KD-3]` Route and data placement | Void pages follow URL hierarchy and layout groups in `pages/`; Drizzle schema and history artefacts remain in `src/db/schema/` and `src/db/migrations/`.                                                                                                                                         | URL and database layouts remain independently navigable and tooling finds generated database artefacts in stable locations. |
| `[KD-4]` Naming and imports       | Files use kebab-case except Void dynamic segments and `_name.tsx` island wrappers; source imports use `@/*` (resolved to `src/`) and same-directory dependencies are relative.                                                                                                                   | Filenames match the lint convention and import paths reveal which runtime folder a dependency belongs to.                   |
| `[KD-5]` Styling compilation      | Vanilla-extract compiles owner-local `.css.ts` files; `src/styles/` exposes the public `theme` API while components retain private colocated recipes.                                                                                                                                            | Web, Storybook, and tests share typed theme references without generated utilities or component styling overrides.          |

## 4. Principles & Intents

- `[PI-1]` **Runtime first, then feature** — group product-domain code by feature within each runtime; share modules only when both runtimes need them.
- `[PI-2]` **Runtime boundaries are visible** — code that requires React, the database or Worker bindings never presents as a pure utility.
- `[PI-3]` **Generated artefacts are tool-owned** — route and Worker type outputs are consumed, not edited.
- `[PI-4]` **Public seams are explicit** — features never import other features; routes and app-owned components coordinate them, while genuinely shared hooks live outside features.

## 5. Non-Goals

- `[NG-1]` Defining behaviour inside individual feature, infrastructure or UI modules; their dedicated specs own those contracts.
- `[NG-2]` Prescribing a fixed internal folder count for a feature whose domain does not need every optional category.

## 6. Caveats

- `[C-1]` Generated `.void/` and `.void-wrangler.jsonc` files are tool-owned and do not accept hand edits; regenerate page/API metadata with `vp exec void prepare`.
- `[C-2]` Worker-only imports, including `cloudflare:workers`, stay on server execution paths; importing them into client-rendered components breaks the runtime boundary (`src/lib/server/db.ts`).
- `[C-3]` `migrations_tmp/` belongs to Wrangler (`tools/wrangler.jsonc`), while authored Drizzle schema history belongs in `src/db/migrations/`.

## 7. High-Level Components

| Component         | Module type | Responsibility                                                                           | Public API surface                                             |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Repository layout | Convention  | Places application, database, documentation, static assets and tooling by responsibility | Root application adapters, `src/` source, and `tools/` tooling |

## 8. Detailed Design

### 8.1 Repository layout

The repository root is the single Void project and deployment. `pages/` and `routes/api/`
compose `@/features/<feature>/server/*` and `@/lib/server/*`; `src/` also owns React feature
presentation and browser services. Server folders never import browser components or the design
system. Isomorphic modules cannot import server implementation.

```text
recipe-organizer/
├── docs/                       # Architecture and infrastructure specs
├── public/                     # Static assets and network-only sw.js
├── pages/
│   ├── (browse)/               # layout.island.tsx; island pages + server companions
│   │   └── _name.tsx           # Relative default-export island entry modules
│   └── (app)/                  # layout.tsx; regular pages + server companions
├── routes/api/                 # Remaining Void HTTP adapters
├── middleware/                 # API/action errors, API CSRF, shared page context
├── src/
│   ├── components/             # App shell, error boundary, navigation, screen layout, not-found
│   │   └── ui/                 # Owned UI component families and stories
│   ├── db/
│   │   ├── schema/             # Drizzle tables and relations
│   │   └── migrations/
│   ├── features/<feature>/
│   │   ├── client/             # Components, catalogue contexts, API readers
│   │   ├── server/             # Queries and aggregate writes
│   │   ├── *.ts                # Cross-runtime schemas and constants
│   │   └── *.spec.md
│   ├── hooks/                  # Shared browser/hydration hooks
│   ├── lib/
│   │   ├── client/             # API response, page action, persistence, theme
│   │   └── server/             # Auth, D1, R2, cache, errors, env.d.ts
│   ├── stores/                 # Durable IDs and quantities
│   ├── styles/                 # Theme, global styles, fonts, styling spec
│   ├── types/                  # Types derived from server projections / HTTP routes
│   └── utils/                  # Cross-runtime helpers and units
├── tools/
│   ├── oxlint/                 # Custom lint rules
│   ├── scripts/                # Local D1 migration
│   └── wrangler.jsonc          # D1 tooling only
├── .storybook/
├── .void/                      # Generated Worker entry and route types (ignored)
├── .wrangler/state/            # Local runtime persistence (ignored)
├── .void-wrangler.jsonc         # Generated runtime config (ignored)
├── env.ts
├── void.config.ts              # Runtime/deploy bindings and document head
├── vite.config.ts              # Void/React plugins, checks, tests, formatting
├── package.json
└── AGENTS.md
```

`pages/(browse)/layout.island.tsx` wraps home, search, shopping list, and recipe details.
`pages/(app)/layout.tsx` wraps login, settings/account/ingredients/users, and recipe new/edit.
Groups do not change URLs. Each route is a folder holding `index.tsx` (or `index.island.tsx`) and
`index.server.ts`; `[id]` is a dynamic segment. Island wrappers sit in the folder of the page that
imports them, because island specifiers must be relative and imports may climb at most one level.
Pages export default components, server companions export loaders/actions, and relative
`_name.tsx` entries default-re-export island components for `with { island: ... }` imports
(the reset-shopping-list wrapper owns its small control directly).
Features expose slots/render props so pages attach islands without feature-to-feature imports.

A feature spans `src/features/<feature>/client/` UI and browser-only calls, page composition under
`pages/`, remaining `routes/api/<feature>/` HTTP adapters, `src/features/<feature>/server/`
helpers, and narrowly shared contracts at the feature root. Specs stay at the feature root and
describe both runtimes.
Loaders read server helpers directly; browser runtime imports never reach Worker-bound code.
Type-only imports may derive projection types from server helper return types.
Remaining HTTP clients use typed `void/client` fetch; `vp exec void prepare` regenerates ignored
page/action/API route metadata before clean-tree checks.

The document head in `void.config.ts` owns metadata, manifest/favicon, theme initialization,
service-worker registration, and the backward cross-document transition hook.
`public/sw.js` registers without a fetch handler, offline support, or legacy cleanup.

### Component and styling ownership

`src/components/ui/<category>/<component>/` holds owned component families and
colocated stories, imported by path such as `@/components/ui/actions/button/button`.
Their supporting hooks live in `src/hooks/`, icons in
`src/components/ui/data-display/icons/`. `src/components/ui/` never imports app or feature code;
app-specific presentation (TabBar, ScreenLayout, NotFound) lives directly under `src/components/`.

Vanilla Extract compiles owner-local `*.css.ts` through web, Storybook, and test plugins.
Consumers import the typed `theme` from `@/styles/theme`, including in
template interpolations; raw shared CSS variable strings are not the public API.
`src/styles/theme/index.ts` combines internal `tokens.css.ts` values with
`theme.spacing(...)`; `src/styles/global.css.ts` owns layered reset/base rules.
Layouts and Storybook load `global.css` and `styles.css`. Native styles retain font faces and
layer order; component/app styles are unlayered. Recipes stay private and colocated.
Parent wrappers own external layout. Categories and story title prefixes remain Actions, Data Display,
Feedback, Forms, Layout, Navigation, and Overlays. See
[UI ownership](../src/styles/styling.spec.md) for the full contract.

Pages are unstyled composition: feature sections and app-shell components own markup/styles.
AppHeader owns desktop navigation; `src/components/app-error/` owns the regular-layout React
render-error boundary. DS Button renders `@void/react` `Link` through `asLink` + `href`;
TabBar takes `currentPath` and `href` items. ScreenLayout takes a `backButton` slot;
GoBackButton defaults to `history.back()`. Retained inner/outer scroll IDs do not implement scroll
restoration. Storybook has no router decorator. Pages/layouts compose header search and theme;
feature/auth policy does not move into `src/components/ui/`.

### Import and database boundaries

Ordinary files use kebab-case except framework dynamic segments and island wrappers; `.tsx`
contains JSX and specs use `.spec.md`. Source imports use `@/*` and same-directory
dependencies are relative. Island imports must be relative because Void resolves their specifiers
relative to the importer. Features may import only the root (isomorphic) modules of other features;
pages or app-owned components coordinate their client and server code. Shared browser hooks live
outside features.

Database table modules live in `src/db/schema/`, Drizzle history in
`src/db/migrations/`. Tooling-only Wrangler resource IDs must match `void.config.ts`;
runtime generated files and local persistence remain at root. Worker-only imports such as
`cloudflare:workers` stay on server execution paths.

### 8.2 Outcome and acceptance

- `[SO-1]` Root framework adapters compose client and server source from `src/` without
  introducing another deployment — demonstrated by `[VC-1]` and `[VC-2]`.
- `[VC-1]` Root development and production preview render deep page URLs, health JSON, and
  unknown API JSON 404s — demonstrates `[SO-1]`.
- `[VC-2]` Server modules resolve in API handlers; browser runtime imports do not reach
  server implementation. Drizzle history and local runtime persistence survive relocation — demonstrates `[SO-1]`.

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
| 2026-09-18 | Move router-only reusable web presentation into the design system. | 8.1 | Permit typed DS navigation without moving application policy or feature code. |
| 2026-09-18 | Extract styled sections and containers while retaining route composition. | 8.1 | Keep routes unstyled and component styles colocated with their owners. |
| 2026-09-19 | Inline single-use navbar, error, and command components into app owners. | 8.1 | Keep the DS surface backed by production reuse. |

| 2026-10-02 | Root the Void application and move Worker implementation into `packages/server`. | 3, 8 | Remove single-app nesting while preserving runtime and deployment boundaries. |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration. |
| 2026-10-02 | Remove workspace packages: server, shared, and design system move into `src/` with `client/`/`server/` feature and lib folders; oxlint and scripts move to `tools/`. | 3, 6, 7, 8 | Drop package indirection for a single-deployment app. |
| 2026-10-02 | Fold `src/design-system/` into `src/components/ui/`, `src/hooks/`, `src/utils/`, and `src/styles/`; move TabBar, ScreenLayout, and NotFound back to `src/components/`. | 8.1 | One component root; app-specific presentation sits with the app shell. |
