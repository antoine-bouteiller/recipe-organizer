# 10 — Migration Plan (sequencing, gates, rollback)

How to execute the work without breaking main. Reference for the agent
or human doing the actual migration.

## Branching strategy

Single long-lived branch off `main`:

```
main ──────────────────────────────────────────────────
       \                                              /
        refactor/migrate-to-void  ──── (PR + merge) ──
```

The migration can **not** be split into independent PRs because the
intermediate states (e.g. "data layer migrated but routing still on
TanStack") would be broken builds. The branch already exists
(`refactor/migrate-to-void`, per current git status).

Cap PR size to one branch merge. Reviewer reads
`void-migration/*.spec.md` for context; the actual diff is large but
explained per-section.

## Phase ordering

Phases run sequentially. Each phase has a verification gate (defined in
its spec file). Do not start phase N+1 with phase N's gate red.

```
Phase 0: Resolve blocking decisions       (void-migration/index.spec.md § Open decisions)
   │
Phase 1: Toolchain & config                (01-toolchain-and-config.spec.md)
   │
Phase 2: Data layer                        (02-data-layer.spec.md)
   │
Phase 3: Bindings                          (03-bindings.spec.md)
   │
Phase 4: Auth                              (04-auth.spec.md)
   │
Phase 5: Routing & pages                   (05-routing-and-pages.spec.md)
   │
Phase 6: Forms                             (06-forms.spec.md)
   │
Phase 7: TanStack Query removal            (07-tanstack-query.spec.md)
   │
Phase 8: Deployment                        (08-deployment-and-ops.spec.md)
   │
Phase 9: Misc cleanup                      (09-misc-cleanup.spec.md)
```

### Why this order

- **Phase 0** unblocks Phase 3 (IMAGES) and Phase 4 (data migration) —
  both can have several days of work depending on the choice.
- **Phase 1** must precede everything: no Void runtime, no Void imports.
- **Phase 2** before **Phase 3**: `void/db` import sites are the simpler
  rewrite; touching them early de-risks the bindings work.
- **Phase 4 before Phase 5**: Pages-mode loaders use `requireAuth` /
  `getUser` from `void/auth`. Wiring them after auth means writing
  loaders against the real auth surface, not stubs.
- **Phase 5 and Phase 6 are tightly coupled** — a form lives inside a
  page. Sequence them by feature (recipe list, recipe view, recipe edit,
  recipe new, users, ingredients) so each feature can be verified
  end-to-end before moving on.
- **Phase 7** (Query removal) happens _as part of_ Phase 5+6 in practice;
  it's broken out as its own spec because the decision and the leftover
  cleanup are distinct concerns.
- **Phase 8** can preview-deploy during Phases 5–7 to catch
  configuration drift early.

## Sub-phasing within Phase 5 (Pages)

Migrate routes in this order, each with its own
verify-locally-then-commit cycle:

1. `pages/layout.tsx` + `middleware/01.theme.ts` + `middleware/02.account-status.ts`
   — shell + globals
2. `pages/auth/login.tsx` + `pages/auth/pending.tsx` — auth UI
3. `pages/index.tsx` — read-only list, smallest loader, validates the
   loader+component pattern
4. `pages/search.tsx` — adds query-param validation
5. `pages/recipe/[id].tsx` — relational query, larger loader
6. `routes/api/image/[id].ts` and `routes/api/video/[id].ts` — non-page
   API routes
7. `pages/recipe/new.tsx` — first form (action + useForm)
8. `pages/recipe/edit/[id].tsx` — form with prefill
9. `pages/settings/users.tsx` — multi-action page
10. `pages/settings/ingredients.tsx`, `pages/settings/account.tsx`,
    `pages/shopping-list.tsx`, `pages/settings.tsx`

After step 3, `vp dev` should fully boot. After step 10, the old
`src/routes/` directory can be deleted.

## Branch-local sanity loop

After every spec phase:

```bash
vp install
vp check         # fmt + lint + types
vp test          # if applicable
vp dev           # smoke-test the affected URLs in a browser
```

Once Phase 5 is partway done, also run:

```bash
vite build && wrangler deploy
```

…against a **preview Worker** (separate `name`/env in `wrangler.jsonc`,
separate D1 / R2 / IMAGES resources). This catches deploy-time issues
(binding inference, wrangler merge, migration drift) without touching
production. See
[08-deployment-and-ops](./08-deployment-and-ops.spec.md#deploy-flow).

## Rollback

If the merge has shipped and a regression appears:

- **Tag-and-redeploy:** every successful deploy gets a git tag
  (`deploy-<timestamp>`). To roll back: check out the previous tag,
  `vite build && wrangler deploy`. Cloudflare Workers' dashboard also
  exposes a deployment-history rollback that swaps the live script
  without a rebuild.
- **Git revert:** revert the merge commit. D1 schema must be reverted
  too if the prior deploy doesn't tolerate the new schema (Better Auth
  tables added by the migration replace the legacy `user` table — see
  [04-auth → existing user data migration](./04-auth.spec.md#existing-user-data-migration)).

**Pre-merge gate:** take a `wrangler d1 export` snapshot of production
D1 before running `wrangler d1 migrations apply DB --remote` for the
first time on the live database.

## Risk register

| Risk                                                                        | Mitigation                                                                                                                             |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Better Auth migration loses or corrupts existing users                      | Backfill script tested against a dump of prod D1 before running on live; snapshot first                                                |
| `wrangler d1 migrations apply` rejects Void's flat migration shape          | Validate at Phase 2 against a preview D1; fall back to `wrangler d1 execute` per-file if needed                                        |
| `db.query.*` relational queries not auto-injected under Void's plugin       | Validate at Phase 2 with a single throwaway loader; fall back to `db.select().from(...).leftJoin(...)` rewrites                        |
| `useForm` cannot model nested-array errors (ingredient groups)              | Verify at start of Phase 6 with a tiny prototype; fall back to top-level `form.error` if needed                                        |
| Service worker's precache manifest goes out of date under Void build output | Verify at Phase 9; patch `tanstackSerwistPlugin` glob paths                                                                            |
| TanStack `viewTransition` UX regresses under Void Router                    | Accept temporarily; address as a follow-up using Void's view-transitions docs (`guide/pages-routing/view-transitions.md`)              |
| Flattened migration set drifts from current schema or replays differently   | `void db reset` (clean local replay) + `void db generate` (must emit zero new migrations) gate the flatten before cutover              |
| Production D1 tracking-table reconciliation fails or partially applies      | Snapshot D1 with `wrangler d1 export` immediately before cutover; project owner verifies row count + ordering before `wrangler deploy` |

## Out-of-scope follow-ups

These are explicitly **not** part of the migration. They are good
follow-up PRs:

- Rewrite `docs/architecture.spec.md`, `docs/file-structure.spec.md`,
`docs/infrastructure/*.spec.md`, and per-feature
`src/features/*/spec/*.spec.md` to describe the Void-based reality.
<!-- Zod → Valibot migration already done in advance of the Void migration. -->

- Adopt `routing.revalidate` ISR for read-heavy pages.
<!-- console.* → void/log logger.* covered by D20 in the main migration scope. -->

- Reconsider state stores: Zustand could potentially be replaced by
  `useShared()` for genuinely global state and local component state
  elsewhere.

## "Done" checklist (mirrors [index.spec.md → Success criteria](./index.spec.md#success-criteria))

- [ ] All decisions in [00-decisions.spec.md](./00-decisions.spec.md) are
      resolved (no remaining "OPEN")
- [ ] `vp check` and `vp test` pass on the branch
- [ ] `vp dev` exercises every URL in
      [05 → Route inventory](./05-routing-and-pages.spec.md#route-inventory)
      without errors
- [ ] Preview deployment via `wrangler deploy` against a preview Worker
      succeeds and round-trips a recipe with an image upload through
      `env.IMAGES` + R2
- [ ] Sign-in / pending / blocked / active / admin flows all behave
- [ ] TanStack/CF artefacts (router, start, form, `@cloudflare/vite-plugin`)
      removed from `package.json`; `wrangler` and `wrangler.jsonc` retained
      (D8)
- [ ] Production D1 snapshot taken
- [ ] Production migrated (or scheduled migration window agreed)
- [ ] Merge commit and post-merge `wrangler deploy` to production
