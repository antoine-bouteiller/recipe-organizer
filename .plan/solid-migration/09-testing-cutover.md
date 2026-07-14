# §09 — Testing, Cleanup & Cutover

## Testing

**Decision: manual QA on the migration branch — no component-test infra.** There are no component
tests today (the 6 existing tests are pure logic) and no `@testing-library`/DOM-env deps; standing up
a component suite for the migration is out of scope. UI/interaction (drawer animation, keyboard/focus
nav, form submit, primitive open/close) gets eyeballed on the branch — cheaper than harnessing.

- **Vitest** stays (`vp test`). **Pure-logic tests are safe** — `unit-converter`, `scale-quantity`,
  `aggregate-shopping-list`, `assert-owner-or-admin`, `normalize`, `filter`, and the `*.store.test.ts`
  files test framework-neutral code. Port `recent-recipes.store.test.ts` to `solid-store` (same API);
  the rest pass unchanged. Treat any failure as a real regression, not a port artifact.
- **One targeted harness** where manual QA can't catch it: the **Lexical binding round-trip** —
  `importJSON` → edit → `exportJSON` byte-stability on real recipe JSON + the decorator-node disposer
  leak check (§08). This is the only new test.
- Vitest config: if it registered a React transform, point it at the Solid transform (the
  `vite-plugin-solid` from §01 covers app + tests when tests run through Vite+). No
  `@solidjs/testing-library` needed for the above (the harness drives Lexical/DOM directly).
- Add broader component tests only if a reactivity regression actually reaches prod.

## Dead-code / dependency gates

- `knip` — enforces no dead exports in `components/ui/*` (project contract). Re-run after each tier.
- **Grep gates** (fail CI if non-zero), the concrete "done" signal from §00 — **scope to
  `src/**/\*.{ts,tsx}`** (the `.spec.md` docs still cite React until updated below; they're not code):
  - `react`, `react-dom`, `@base-ui/react`, `@lexical/react`, `@vitejs/plugin-react` — zero imports.
  - `className=` in `.tsx` under `src/` — zero (should be `class=`).
  - `\.map(` inside JSX return blocks in `components/ui/*` — zero (should be `<For>`).
  - `const {` destructuring on `props` in `components/ui/*` — zero (should be `splitProps`).
- Remove now-unused hooks: `use-isomorphic-layout-effect.ts` (deleted in §04). Re-audit
  `use-platfom.ts`, `use-options.ts` for React-only leftovers.

## Docs

Specs under `docs/` and the per-feature `*.spec.md` name React/TanStack-React/Base-UI/Lexical-React
explicitly. Update the framework references only (behavior is unchanged):

- `docs/architecture.spec.md`: PLT-001/003/004/005, the "Layered overview" (UI primitives "built on
  Base UI" → "built on Kobalte + corvu"), "Why Lexical" gets an §08 note.
- `CLAUDE.md`: "built on Base UI" → "built on Kobalte (+ corvu drawer)".
- `docs/infrastructure/forms.spec.md`, `routing-ssr.spec.md`, `client-state.spec.md`,
  `server-functions.spec.md`, `auth.spec.md`: rename React→Solid adapters where cited.
- These are doc-only edits; do them at cutover so they describe the shipped state, not aspiration.

## Cutover strategy

The app cannot run half-React/half-Solid — no cheap interop for TanStack Start's SSR entry. So this
is a **branch-and-flip**, not an incremental prod rollout:

0. **Freeze `main` for the duration** — no feature work; only critical hotfixes land, each immediately
   rebased into the migration branch. A full framework rewrite diverging from an active `main` is
   rebase hell; the freeze is the cost of branch-and-flip.
1. Long-lived migration branch. Land §01→§02→§07 (bootable empty app) first.
2. Migrate `ui/*` (§04) + drawer (§05) + forms (§06) — app becomes usable minus the editor.
3. Feature components + routes consume the new UI.
4. §08 editor lands (or ships gated); recipe instructions come back online.
5. Full `vp check` + `vp test` + `wrangler deploy --dry-run` (VAL-001/002/003).
6. Deploy to a preview Worker, smoke the AC list from `docs/architecture.spec.md` (AC-001..007) in a
   real browser (`agent-browser`), including the fresh-no-cache SSR load (regression guard for
   memory S1705).
7. Flip production.

No DB migration unless §08 picks Option B (it shouldn't). Bindings, secrets, service worker, Serwist
config are untouched, so infra needs no coordinated change at flip time.

## Final validation checklist

**Automated gates (done):**

- [x] `vp check` green (fmt + lint + types) — 194 files, 0 errors
- [x] `vp test` green (43 tests: logic + Lexical round-trip harness)
- [x] `knip` clean (exit 0); grep gates all zero (`react`/`@base-ui`/`@lexical/react` = 0 in `src`, `className=` = 0)
- [x] `wrangler deploy --dry-run` succeeds with DB/R2/IMAGES bindings (AC-005)
- [x] Fresh-cache SSR load returns 200 with hydration script (`window._$HY`) present (AC-001, S1705 guard) — verified via dev-server curl
- [x] Docs + `CLAUDE.md` (→ `AGENTS.md` symlink) updated to Solid/Kobalte/corvu
- [x] Browser hydration smoke (agent-browser on dev): app renders, hydrates, nav + interaction work, no uncaught errors

**Human-only — require a preview Worker deploy + real auth/data (do at flip):**

- [ ] Auth guard + admin guard behave (AC-002/003)
- [ ] Recipe create → invalidate + toast (AC-004); image stored as WebP (AC-007)
- [ ] Drawer open/close animates fully in all dismiss paths (memory 7640 guard)
- [ ] PWA still installs; SW registration failure stays silent (AC-006)
- [ ] Flip production (branch-and-flip step 7)

**Known warning to eyeball (non-blocking):** `computations created outside a createRoot or render` fires ~10× on `/shopping-list` (empty list → not per-item; traced in §08 to the DevTools `installHook.js` hook, mitigated via root `HydrationScript`). Confirm it's absent without the browser DevTools extension during human QA.

## ponytail notes

- Manual QA over a component suite — the logic layer is already covered and one Lexical harness guards
  the only mechanically-risky path. Add component tests only when a real bug demands them.
- Doc edits are find-replace of framework names — don't rewrite the specs.
