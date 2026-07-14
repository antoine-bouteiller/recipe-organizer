# SolidJS v1 Migration

**Status:** in-progress
**Goal:** Migrate `recipe-organizer` from React 19 + TanStack Start (React) to SolidJS v1 (stable), replace the
Base UI design system with Kobalte, and rebuild the drawer on corvu. Infra (Cloudflare Workers,
D1/Drizzle, R2, Better Auth, Serwist, Tailwind, Vite+) is untouched — only the UI framework and its
component libraries change. TanStack (router/query/form/store) has 1:1 Solid adapters, so those carry
over with renamed imports; the only pieces without drop-in Solid equivalents are Lexical (React-only
binding) and a few Base UI primitives with no Kobalte peer (Toolbar, ScrollArea, Command). Done when
`vp check` + `vp test` are green, `wrangler deploy --dry-run` succeeds, `docs/architecture.spec.md`
VAL-001..005 pass on the Solid build, and zero `react` / `@base-ui` / `@lexical/react` imports remain.

## Context

- Per-phase detail lives in the sibling files (`01-tooling-build.md` … `09-testing-cutover.md`); this
  master tracks status and the step list only.
- **Dependency swaps (exact-pinned to last stable, no carets — repo convention + no compiler safety
  net; lockstep upgrades only):** `react`/`react-dom`→`solid-js@1.9.14`; `@vitejs/plugin-react` +
  react-compiler + babel plugin → `vite-plugin-solid@2.11.12` (drop the React compiler);
  `@tanstack/react-*` → `@tanstack/solid-*` — `solid-router@1.170.18`, `solid-start@1.168.28`,
  `solid-router-ssr-query@1.167.1`, `solid-query@5.101.2`, `solid-form@1.33.2`, `solid-store@0.11.0`
  (adapters track the same version train as the React deps — verified); `@base-ui/react` →
  `@kobalte/core@0.13.12`; `@base-ui/react/drawer` → `@corvu/drawer@0.2.4`; `@phosphor-icons/react` →
  `phosphor-solid@1.1.5` (same Phosphor set, glyph parity guaranteed — **strip the `Icon` suffix** on
  all ~48 icon imports, e.g. `ArrowLeftIcon`→`ArrowLeft`); `@lexical/react` → custom hand-rolled Solid
  binding (keep `lexical@0.46` core + `@lexical/list|rich-text|utils`); `better-auth/react` →
  `better-auth/solid` (client only — **ships in the existing `better-auth@1.6.22`, no bump**).
  `clsx`/`tailwind-merge`/`cva`/valibot/drizzle/wrangler/serwist unchanged.
- **No-Kobalte-peer primitives (§04):** ScrollArea → native `overflow` + `scrollbar-gutter`
  (`scrollFade` kept only if a ~10-line scroll listener reproduces it, else cut — `corvu@0.7.2` has no
  scroll-area, confirmed); Toolbar → hand-rolled `role="toolbar"` + roving-tabindex (~30 lines, keeps
  arrow-key a11y); Command → rebuilt on Kobalte `Combobox` + `Dialog`.
- **Build order = dependency direction** (infra first, leaves last): tooling → TanStack Start/Solid →
  state+query+auth → Kobalte UI → corvu drawer → forms → feature components/routes → editor → cutover.
- **Locked decisions:** editor = keep Lexical core + hand-rolled Solid binding (`lexical-solid` is
  unmaintained — rejected), **no data migration** (persisted JSON unchanged, `DAT-002`); cutover =
  branch-and-flip (no half-React/half-Solid interop for TanStack Start's SSR entry) with **`main`
  frozen** for the duration (hotfixes only, rebased into the migration branch); client-only render mode
  (`defaultSsr: false`, root `ssr: true`) preserved so store-backed components never SSR (CON-004);
  testing = **manual QA on the branch** (no component-test infra) + keep/port the 6 pure unit tests +
  one Lexical round-trip/leak harness.
- **Invariants to preserve verbatim:** isomorphic `getAuthUser` SSR-bypass (memory S1705/7666/7675 —
  fresh no-cache load must return 200); the `data-slot="drawer-*"` values (Tailwind sibling selectors
  depend on them); custom Lexical nodes' `importJSON`/`exportJSON`/`getType`.
- **Top risks (ranked):** ① Lexical binding (schedule driver — start the core round-trip spike week 1,
  the decorator-node disposer glue is the one piece needing a real test); ② Base UI primitives with no
  Kobalte peer (ScrollArea/Toolbar/Command — resolutions locked in Context above); ③ fine-grained
  reactivity bugs (no compiler safety net — §03 rules + manual QA cover it). Retired: adapter maturity
  (v1 adapters track the React version train) and icon parity (phosphor-solid is the same set). Still
  exact-pin everything; do **not** adopt `solid-js@2` (beta — also unsupported by the deps here).
- **Non-goals:** no behavior/feature changes, no infra migration.

## Steps

- [ ] Swap the Vite plugin, deps, tsconfig JSX and lint config so `vp dev` boots a Solid app — see `01-tooling-build.md`
- [ ] Port router + start + `__root` shell to `@tanstack/solid-*`; app routes and SSRs an empty shell (fresh load 200) — see `02-tanstack-start-solid.md`
- [ ] Establish the React→Solid translation rulebook (signals, effects, `splitProps`, control flow) used by all later phases — see `03-component-translation.md`
- [ ] Port state/query/auth to solid-query / solid-store / better-auth/solid; store + query + auth round-trips pass — see `07-state-query-auth.md`
- [ ] Rebuild `src/components/ui/*` on Kobalte bottom-up (primitives → composites); knip clean, keyboard/focus parity — see `04-ui-kobalte.md`
- [ ] Rebuild the drawer + `*.drawer.tsx` variants on corvu; all dismiss paths animate fully (memory 7640 guard) — see `05-drawer-corvu.md`
- [ ] Port forms to `@tanstack/solid-form` (accessor field API); text/file/select forms submit end-to-end (editor field stubbed) — see `06-forms.md`
- [ ] Migrate feature components + routes to consume the rebuilt UI — see build order in `00`-context above
- [ ] Build the custom Lexical Solid binding (composer, decorator nodes, toolbar); round-trip + leak test pass, zero data migration — see `08-editor-lexical.md`
- [ ] Testing, dead-code/grep gates, doc updates, and branch-and-flip cutover; final validation checklist green — see `09-testing-cutover.md`

## Log

- 2026-07-14 Grilling session — folded six decisions into the plan: (1) exact-pin the whole Solid ecosystem to last stable (versions verified via npm); (2) hand-roll the Lexical binding, `lexical-solid` rejected as unmaintained; (3) no-Kobalte-peer primitives → ScrollArea native, Toolbar roving-tabindex, Command on Kobalte Combobox; (4) commit to phosphor-solid + strip `Icon` suffix, drop lucide fallback; (5) branch-and-flip with `main` frozen, import-ban gate scoped to `src/**/*.{ts,tsx}`; (6) manual QA + keep 6 unit tests + one Lexical harness (no component-test infra). Verified: adapter version parity, `better-auth/solid` in 1.6.22, corvu has no scroll-area, VAL-001..005 framework-agnostic.
- 2026-07-14 Retargeted the migration from SolidJS v2 (beta) to v1 (stable): `solid-js@1.9.14`, adapter-maturity dropped off the top-risk list since `@tanstack/solid-*` target Solid 1.x.
- 2026-07-13 Converted the 10-file `solid-migration/` narrative into the `.plan/` folder convention: this master `index.md` tracks status + steps; `00-overview.md` folded into Goal/Context here and removed; phase files `01`–`09` kept as per-phase detail.
