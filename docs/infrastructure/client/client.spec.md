---
title: Client Infrastructure
kind: umbrella
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/architecture.spec.md
related:
  [
    docs/infrastructure/server/data-layer.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
    docs/infrastructure/server/platform.spec.md,
  ]
---

## 2. Problem Statement

Recipe Organizer needs client infrastructure that makes browser navigation, user input, and local
interaction state coherent without creating a second source of truth for Worker-owned data. This
sub-umbrella refines the routing, form, and client-state portions of the architecture's client
boundary while leaving product goals and system-wide principles to
[`docs/architecture.spec.md`](../../architecture.spec.md).

- `[G-1]` Provide predictable browser contracts for routes, forms, and UI state that preserve the
  architecture's server-data and client-state boundary (`docs/architecture.spec.md` `[KD-7]`).

## 3. Key Design Decisions

| Decision                 | Choice                                                                                | Rationale                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Client split    | Routing, forms, and client state have separate leaves                                 | Each area has a distinct public contract and verification surface, while their boundaries remain explicit.               |
| `[KD-2]` Server boundary | Feature query/mutation options use typed Void API fetch; handlers call server helpers | This refines the Worker runtime decision in `docs/architecture.spec.md` `[KD-1]` and keeps access control at the Worker. |

## 4. Principles & Intents

- `[PI-1]` **State follows its owner** — refine `docs/architecture.spec.md` `[PI-4]`: server
  records live only in the in-memory query cache; persistent browser state contains only selections and preferences.
- `[PI-2]` **Routes compose contracts** — routes coordinate client screen guards, cached query data, and
  app-shell composition without absorbing feature business logic.
- `[PI-3]` **Forms share validation shape** — form interactions use the input contract owned at
  the Worker boundary, refining `docs/architecture.spec.md` `[PI-3]`.

## 5. Non-Goals

- `[NG-1]` A second browser-side API abstraction, authoritative authorization system, or duplicate server-record
  store outside the query cache; this refines `docs/architecture.spec.md` `[PI-1]` and `[PI-4]`.
- `[NG-2]` Offline functionality, consistent with `docs/architecture.spec.md` `[NG-4]`.

## 6. Caveats

- `[C-1]` Browser persistence is device-local and can be absent or malformed, so persisted values
  require safe fallback behavior.
- `[C-2]` Void generates API route metadata; existing persisted-store snapshot and mount-gate paths now run only on the client.

## 7. High-Level Components

| Leaf                                     | Module type               | Responsibility                                                         | Public API surface                             |
| ---------------------------------------- | ------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| [`routing-ssr`](./routing-ssr.spec.md)   | Client routing convention | Static mount, URL matching, client guards, preload, scroll/transitions | `routes`, `router`, `preloadLink`              |
| [`forms`](./forms.spec.md)               | Form library              | Typed form composition, validation display, multipart submission       | `createForm`, controlled fields, error context |
| [`client-state`](./client-state.spec.md) | State convention          | Query cache, mutation invalidation, persistent intent, URL and cookies | `queryClient`, `queryKeys`, `persistedStore`   |

Leaf execution order:

| Leaf                                     | Depends on                                                                      | Rationale                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`routing-ssr`](./routing-ssr.spec.md)   | `../server/auth.spec.md`, `../server/server-functions.spec.md`                  | Session queries and API handlers separate screen gates from authorization.  |
| [`forms`](./forms.spec.md)               | `../server/server-functions.spec.md`                                            | Form schemas and Void HTTP submissions meet the Worker validation boundary. |
| [`client-state`](./client-state.spec.md) | [`routing-ssr`](./routing-ssr.spec.md) `[KD-1]`, `../server/data-layer.spec.md` | Query options cache Worker records; stores retain browser intent.           |

## 8. Detailed Design

| Component      | Specified in                                     |
| -------------- | ------------------------------------------------ |
| Client routing | [`routing-ssr.spec.md`](./routing-ssr.spec.md)   |
| Forms          | [`forms.spec.md`](./forms.spec.md)               |
| Client state   | [`client-state.spec.md`](./client-state.spec.md) |

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                              | Sections affected | Reason                                                 |
| ---------- | -------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------ |
| 2026-09-13 | Adopt typed Hono RPC clients as the client server boundary.                            | 3, 5, 7           | Reflect the completed feature-action migration.        |
| 2026-09-13 | Document the browser SPA mount and query provider.                                     | 6–8               | Remove SSR render-mode and document-shell assumptions. |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration.                  |
| 2026-10-03 | Update the routing leaf to SSR and client navigation.                                  | 7–8               | Match the shared render mode.                          |
