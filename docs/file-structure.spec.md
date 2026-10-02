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

| Decision                          | Choice                                                                                                                                                                                                                                                                        | Rationale                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Ownership boundary       | A product domain spans `apps/web/src/features/<feature>/` for UI and query wrappers and `apps/web/routes/api/<feature>/` for Void handlers and `apps/web/server/<feature>/` for server domain utilities; `packages/shared/src/<feature>/` holds only cross-runtime contracts. | Runtime-specific code remains isolated while each domain has explicit ownership.                                            |
| `[KD-2]` Runtime-code placement   | Browser code lives in `apps/web/src/`; Worker routes live in `apps/web/routes/api/` and server libraries in `apps/web/server/`; only actual cross-runtime modules live in `packages/shared/src/`.                                                                             | The top-level directories make runtime boundaries visible before an import is written.                                      |
| `[KD-3]` Route and data placement | Browser routes follow URL hierarchy in `apps/web/src/routes/`; Drizzle schema and history artefacts remain in `apps/web/server/db/schema/` and `apps/web/server/db/migrations/`.                                                                                              | URL and database layouts remain independently navigable and tooling finds generated database artefacts in stable locations. |
| `[KD-4]` Naming and imports       | Files use kebab-case except router dynamic segments; browser imports use `@client/*` and cross-package imports use `@recipe-organizer/<package>/<subpath>`; server imports use `#server/*` and schema imports use `#server/db/schema`.                                        | Filenames match the lint convention and import paths reveal whether a dependency is local or crosses a module boundary.     |
| `[KD-5]` Styling compilation      | Vanilla-extract compiles owner-local `.css.ts` files; the design-system package exports its public `theme` API while components retain private colocated recipes.                                                                                                             | Web, Storybook, and tests share typed theme references without generated utilities or component styling overrides.          |

## 4. Principles & Intents

- `[PI-1]` **Runtime first, then feature** — group product-domain code by feature within each runtime; share modules only when both runtimes need them.
- `[PI-2]` **Runtime boundaries are visible** — code that requires React, the database or Worker bindings never presents as a pure utility.
- `[PI-3]` **Generated artefacts are tool-owned** — route and Worker type outputs are consumed, not edited.
- `[PI-4]` **Public seams are explicit** — features never import other features; routes and app-owned components coordinate them, while genuinely shared hooks live outside features.

## 5. Non-Goals

- `[NG-1]` Defining behaviour inside individual feature, infrastructure or UI modules; their dedicated specs own those contracts.
- `[NG-2]` Prescribing a fixed internal folder count for a feature whose domain does not need every optional category.

## 6. Caveats

- `[C-1]` The generated `apps/web/src/routeTree.gen.ts` and `apps/web/server/worker-configuration.d.ts`, `apps/web/.void/`, and `apps/web/.void-wrangler.jsonc` files are overwritten by their respective tools and do not accept hand edits; tooling excludes the route tree from formatting and linting (`vite.config.ts:48`, `vite.config.ts:188`).
- `[C-2]` Worker-only imports, including `cloudflare:workers`, stay on server execution paths; importing them into client-rendered components breaks the runtime boundary (`apps/web/server/lib/db.ts`).
- `[C-3]` `migrations_tmp/` belongs to Wrangler (`apps/web/server/wrangler.jsonc`), while authored Drizzle schema history belongs in `apps/web/server/db/migrations/`.

## 7. High-Level Components

| Component         | Module type | Responsibility                                                                           | Public API surface                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Repository layout | Convention  | Places application, database, documentation, static assets and tooling by responsibility | Directory contract rooted at `src/`, `docs/`, `public/` and `scripts/` |

## 8. Detailed Design

### 8.1 Repository layout

```text
recipe-organizer/
├── docs/                       # Architecture, layout, and infrastructure specs
├── apps/
│   └── web/                    # Void project root
│       ├── public/             # Static assets and network-only sw.js
│       ├── routes/api/         # Void file routes with named method exports
│       ├── middleware/         # API errors, CSRF, SPA fallback
│       ├── server/             # Worker-side code, imported as #server/*
│       │   ├── db/
│       │   │   ├── migrations/ # Drizzle schema history
│       │   │   └── schema/     # Tables and relation exports
│       │   ├── recipe/         # Recipe parsing and persistence helpers
│       │   ├── shopping-list/  # Shopping-list query helpers
│       │   ├── lib/            # Auth, D1, R2, cache, API errors
│       │   ├── utils/          # Server authorization and utility helpers
│       │   ├── worker-configuration.d.ts # Generated binding types
│       │   └── wrangler.jsonc  # D1/typegen tooling only
│       ├── src/
│       │   ├── components/     # App-owned browser components
│       │   ├── features/       # UI, query wrappers, local state, feature specs
│       │   ├── hooks/          # Shared browser hooks
│       │   ├── lib/            # Browser services and typed API response helper
│       │   ├── routes/         # TanStack browser pages
│       │   ├── stores/         # Cross-feature persisted UI state
│       │   ├── types/          # API types inferred from Void RouteMap
│       │   ├── utils/          # Browser-only helpers
│       │   ├── main.tsx        # Browser SPA entry
│       │   ├── routeTree.gen.ts # Generated TanStack route tree
│       │   └── router.tsx      # Router factory and Query provider
│       ├── .void/              # Generated Worker entry and route types (ignored)
│       ├── .void-wrangler.jsonc # Generated runtime config (ignored)
│       ├── index.html          # Browser document
│       ├── vite.config.ts      # Web plugins and Void local runtime
│       └── void.config.ts      # Worker bindings and deployment configuration
├── packages/
│   ├── shared/src/             # Cross-runtime schemas, constants, units, helpers
│   ├── design-system/src/      # Owned UI, stories, styles, and public theme
│   └── scripts/               # Database and maintenance tooling
├── AGENTS.md                   # Contributor guidance
└── vite.config.ts              # Repository checks, tests, and formatting
```

`apps/web/public/sw.js` is the registered, module service worker at the stable `/sw.js` URL. It
supports the user-required Samsung PWA installation path while forwarding fetches to the network,
without offline support or legacy storage cleanup.

A feature spans runtime-specific directories: `apps/web/src/features/<feature>/` owns UI,
query/mutation wrappers, and browser-local code; `apps/web/routes/api/<feature>/` owns Void HTTP
handlers; `apps/web/server/<feature>/` owns server domain utilities; and
`packages/shared/src/<feature>/schemas.ts` owns cross-runtime schemas. Shared is not a general
reuse bucket: only modules imported by both runtimes belong there. API types remain in
`apps/web/src/types/` and derive from generated `RouteMap` in `void/routes`. Feature specs stay
colocated in `apps/web/src/features/` and describe both runtime sides.

Worker-only imports, schemas, and server libraries stay outside browser execution paths.
Typed `void/client` fetch uses generated route metadata, not a browser import of the server
implementation. `vp -C apps/web exec void prepare` regenerates ignored API route types before
clean-tree type checks; CI runs it before `vpr check`.

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
component-owned and runtime-owned behavior. No separate generation step or generated utility
directory is required. Component recipes remain colocated with their owners. `apps/web/src/routes/`
contains route declarations and composition only: no `.css.ts` files or styling imports. Feature sections and containers
own their markup and colocated styles; `apps/web/src/components/app-shell/` owns shell presentation.
Routes construct pages from those styled components and retain cross-feature coordination, such as
recipe create/edit and search, rather than delegating to intermediary page wrappers. Native global CSS remains for owned fonts, theme
activation, safe-area, scrolling, transitions, and runtime-only behavior. Categories are `actions`,
`data-display`, `feedback`, `forms`, `layout`, `navigation`, and `overlays`; each story uses the
matching category as its title prefix. Physical categorization does not change package subpath imports.
`packages/design-system/styling.spec.md` owns the styling and component-ownership guidance.

`apps/web/src/components/` retains domain-specific ingredient-category presentation and app-owned
navigation constants: menus and filtering stay in `navigation/constants.tsx`. Typed form adapters and
their context/registry, file-input support, rich-text editing, generic dialogs, search input, icons,
router-aware screen layout/navigation and not-found presentation live in the design system. Single-use
desktop navigation is inlined into `AppHeader`, and the default error callback is inlined into
`apps/web/src/router.tsx` with colocated `router.css.ts`. The command palette lives in the feature's
`SearchBar`, reusing DS `ScrollArea`. The DS may depend on catalogued TanStack Router but never imports
app or feature code. `TabBar` uses item `label`/`linkProps` (`LinkOptions`) and icons; actual Links retain
navigation semantics. The desktop navbar uses exact matching to `/` only;
`ScreenLayout` calls `router.history.back()` when `withGoBack`, defaults scroll IDs to `screen-inner`/
`screen-outer`, and takes an explicit footer. The router's error renderer and DS not-found component
provide home Links and French messages, with Error details only in development. Pages pass `mobileMenuItems` to TabBar; `__root`
composes theme toggle and search inside styled app-shell containers. Recipe/auth policy remains in the index route. Feature schemas,
query-backed options, API calls, and persisted app state do not move.
App-specific React hooks and persisted stores live in `apps/web/src/hooks/` and
`apps/web/src/stores/`. `apps/web/src/lib/` and `apps/web/src/utils/` contain browser application services
and browser-only helpers. `apps/web/server/lib/` contains Worker-bound auth, database, R2, and cache
services. `packages/shared/src/` contains cross-runtime schemas, constants, units, and helpers. Shared media URL
helpers use the common Vite `import.meta.env.DEV` flag; they do not depend on browser or Worker bindings.

`apps/web/index.html` loads `apps/web/src/main.tsx`, which mounts the SPA. Browser routes in
`apps/web/src/routes/` mirror URL segments and use TanStack's `$parameter` filenames.
Void HTTP routes live separately in `apps/web/routes/api/`: `index.ts` maps a directory root,
`[id]` names a dynamic segment, and `[...path].ts` is a catch-all. Each exports named HTTP methods.
Void generates the Worker entry; route handlers import Worker-side helpers from `apps/web/server/`
through the `#server/*` package import. Browser route files compose feature UI rather than becoming feature internals.

Database table modules live under `apps/web/server/db/schema/`, which exports the schema and relations; generated
schema-history artefacts live under `apps/web/server/db/migrations/`. Worker build/deploy configuration and generated Void files belong to the web project root;
repository check/test configuration stays at the repository root. The tooling-only Wrangler
configuration must keep resource IDs in sync with `apps/web/void.config.ts`.

All ordinary filenames use kebab-case (`vite.config.ts:120`). `.ts` identifies modules without JSX and
`.tsx` identifies modules that contain JSX. Specs use the `.spec.md` suffix. Cross-directory
browser imports use `@client/*`; cross-package dependencies use `@recipe-organizer/<package>/<subpath>`;
server modules use the `#server/*` package import (`#server/db/schema` for schema exports). Same-directory dependencies use relative imports. Feature-to-feature imports are forbidden, including public APIs. Per-feature `no-restricted-imports`
overrides in `vite.config.ts` enforce this for alias and relative imports. Cross-feature composition
belongs in routes or app-owned components; shared browser hooks such as `useIsInShoppingList` live in
`apps/web/src/hooks/`.

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
