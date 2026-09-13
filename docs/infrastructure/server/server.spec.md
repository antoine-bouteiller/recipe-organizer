---
title: Server Infrastructure
kind: umbrella
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/architecture.spec.md
related: []
---

## 2. Problem Statement

The Worker needs a coherent server boundary for persistence, media, Hono RPC, and identity so
feature modules can serve private recipe data without operating a separate backend. This sub-umbrella
refines the Worker, storage, and identity goals in the architecture umbrella [G-1], [G-2], and
[G-3] (`docs/architecture.spec.md:18-22`) into four independently specified responsibilities.

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                         | Choice                                                                                         | Rationale                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `[KD-1]` Server decomposition    | Platform, data layer, Hono API, and auth have separate leaves.                                 | Each has a distinct contract and verification surface while sharing one Worker boundary.            |
| `[KD-2]` Dependency direction    | Platform supplies bindings; data and auth consume them; Hono feature routes compose all three. | A directed dependency chain prevents feature handlers from owning runtime setup or identity policy. |
| `[KD-3]` Feature-facing boundary | Feature modules reach infrastructure through exported helpers and Hono RPC conventions.        | This refines architecture [PI-5] and keeps feature code independent of binding details.             |

## 4. Principles & Intents

- `[PI-1]` **One Worker boundary** — refine architecture [PI-1]: bindings, the direct Worker
  `fetch` handler, Hono RPC, and media routes remain capabilities of the same Worker.
- `[PI-2]` **Trust at the server boundary** — refine architecture [PI-3]: input, membership, role,
  and ownership decisions execute before protected persistence effects.
- `[PI-3]` **Request-scoped resources** — refine architecture [C-1]: factories obtain Worker-bound
  handles in request execution rather than retaining them in module state.

## 5. Non-Goals

- `[NG-1]` A separately deployed API service, refining architecture [NG-1] and [PI-1].
- `[NG-2]` Password, email-link, or provider-specific identity flows beyond Google, refining
  architecture [NG-2].
- `[NG-3]` Offline mutation, refining architecture [NG-4].

## 6. Caveats

- `[C-1]` D1 follows SQLite semantics; related multi-statement work needs the batch contract owned
  by the data-layer leaf.
- `[C-2]` OAuth credentials and session secrets are provisioned outside the application, as stated
  by architecture [C-7].
- `[C-3]` Browser media URLs expose streaming endpoints, not direct bucket access.

## 7. High-Level Components

| Component  | Module type                        | Responsibility                                       | Public API surface                        |
| ---------- | ---------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Platform   | Worker configuration and utilities | Bindings, media transformation, cache, offline shell | bindings, R2 helpers                      |
| Data layer | Library                            | Typed D1 schema, relations, and client               | `getDb()`                                 |
| Hono API   | Convention and library             | Validated RPC, errors, query integration             | Hono routes, API client, option factories |
| Auth       | Library and routes                 | Google identity, sessions, membership guards         | `getAuth()`, `authGuard()`                |

| Leaf                                             | Depends on                                                  | Rationale                                                                |
| ------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`platform`](./platform.spec.md)                 | —                                                           | Establishes the Worker capabilities consumed by the other leaves.        |
| [`data-layer`](./data-layer.spec.md)             | `platform` `[KD-1]`                                         | D1 binding access depends on the runtime contract.                       |
| [`auth`](./auth.spec.md)                         | `data-layer` `[KD-1]`, `platform` `[KD-1]`                  | Identity stores sessions in D1 and reads Worker secrets.                 |
| [`server-functions`](./server-functions.spec.md) | `data-layer` `[KD-1]`, `auth` `[KD-1]`, `platform` `[KD-1]` | Hono feature RPC composes persistence, authorization, and media effects. |

## 8. Detailed Design

| Component  | Specified in                                               |
| ---------- | ---------------------------------------------------------- |
| Platform   | [`./platform.spec.md`](./platform.spec.md)                 |
| Data layer | [`./data-layer.spec.md`](./data-layer.spec.md)             |
| Hono API   | [`./server-functions.spec.md`](./server-functions.spec.md) |
| Auth       | [`./auth.spec.md`](./auth.spec.md)                         |

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                     | Sections affected | Reason                                                                               |
| ---------- | ----------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| 2026-09-13 | Replace feature server functions with Hono RPC routes in the existing Worker. | 2, 3, 4, 7–8      | Record the feature-action transport boundary without introducing a separate service. |
| 2026-09-13 | Make the Hono handler the direct Worker entry.                                | 4                 | Remove the former file-route handler boundary.                                       |
