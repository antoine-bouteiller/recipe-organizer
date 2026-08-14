---
title: Client Infrastructure
kind: umbrella
status: implemented
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

| Decision                 | Choice                                                                            | Rationale                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Client split    | Routing, forms, and client state have separate leaves                             | Each area has a distinct public contract and verification surface, while their boundaries remain explicit.              |
| `[KD-2]` Server boundary | Route and form consumers use the server contracts rather than a browser API layer | This refines the Worker-as-API decision in `docs/architecture.spec.md` `[KD-1]` and keeps access control at the Worker. |

## 4. Principles & Intents

- `[PI-1]` **State follows its owner** — refine `docs/architecture.spec.md` `[PI-4]`: server
  records remain query data; browser state contains only selections and preferences.
- `[PI-2]` **Routes compose contracts** — routes coordinate authentication, query prefetch, and
  layouts without absorbing feature business logic.
- `[PI-3]` **Forms share validation shape** — form interactions use the input contract owned at
  the Worker boundary, refining `docs/architecture.spec.md` `[PI-3]`.

## 5. Non-Goals

- `[NG-1]` A browser-side API, authorization system, or duplicate server-data cache; this refines
  `docs/architecture.spec.md` `[PI-1]` and `[PI-4]`.
- `[NG-2]` Offline mutation, consistent with `docs/architecture.spec.md` `[NG-4]`.

## 6. Caveats

- `[C-1]` Browser persistence is device-local and can be absent or malformed, so persisted values
  require safe fallback behavior.
- `[C-2]` Route render modes and generated route metadata constrain where browser-only state can
  be read.

## 7. High-Level Components

| Leaf                                     | Module type       | Responsibility                                                   | Public API surface                         |
| ---------------------------------------- | ----------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| [`routing-ssr`](./routing-ssr.spec.md)   | Router convention | URL matching, route context, document shell, prefetch            | Route declarations, `getRouter()`          |
| [`forms`](./forms.spec.md)               | Form library      | Typed form composition, validation display, multipart submission | `useAppForm`, `withForm`, field registry   |
| [`client-state`](./client-state.spec.md) | State convention  | Query, persistent UI state, URL and cookie state                 | `queryKeys`, `persistedStore`, store hooks |

Leaf execution order:

| Leaf                                     | Depends on                                                                      | Rationale                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`routing-ssr`](./routing-ssr.spec.md)   | `../server/auth.spec.md`, `../server/server-functions.spec.md`                  | Route context and loaders consume authentication and RPC contracts.         |
| [`forms`](./forms.spec.md)               | `../server/server-functions.spec.md`                                            | Form schemas and submissions meet the Worker validation boundary.           |
| [`client-state`](./client-state.spec.md) | [`routing-ssr`](./routing-ssr.spec.md) `[KD-1]`, `../server/data-layer.spec.md` | Query lifecycle follows router context and represents Worker-owned records. |

## 8. Detailed Design

| Component     | Specified in                                     |
| ------------- | ------------------------------------------------ |
| Routing & SSR | [`routing-ssr.spec.md`](./routing-ssr.spec.md)   |
| Forms         | [`forms.spec.md`](./forms.spec.md)               |
| Client state  | [`client-state.spec.md`](./client-state.spec.md) |

## 9. Open Questions

N/A
