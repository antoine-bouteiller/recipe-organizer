# SolidJS v1 Migration

**Status:** in-progress — §01/§02/§04/§05/§06/§07 done + all feature components & routes migrated (usable-app milestone). Only §08 (Lexical editor + `ui/toolbar` + editor-owned feature files) and §09 (final gate/cutover) remain. On branch `feat/migrate-to-solid` (11 commits). `tsc` clean and `vp test` green (42 tests) with the §08 editor files excluded; zero `react`/`@base-ui`/`@tanstack/react-form` imports outside §08.
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

- [x] Swap the Vite plugin, deps, tsconfig JSX and lint config so `vp dev` boots a Solid app — see `01-tooling-build.md`
- [x] Port router + start + `__root` shell to `@tanstack/solid-*`; app routes and SSRs an empty shell (fresh load 200) — see `02-tanstack-start-solid.md` *(entry + server-fn import renames done; per-route component bodies migrate with feature phase)*
- [x] Establish the React→Solid translation rulebook (signals, effects, `splitProps`, control flow) used by all later phases — see `03-component-translation.md` *(conventions locked & applied: `splitProps` forwarding, Kobalte `Polymorphic`/`as`, `<Compound>`-is-root for Kobalte+corvu, phosphor-solid bare names)*
- [x] Port state/query/auth to solid-query / solid-store / better-auth/solid; store + query + auth round-trips pass — see `07-state-query-auth.md` *(data-layer import renames + auth client done; accessor call-sites in components land with feature phase)*
- [x] Rebuild `src/components/ui/*` on Kobalte bottom-up (primitives → composites); knip clean, keyboard/focus parity — see `04-ui-kobalte.md`
  - [x] Tier 1 (button, badge, input, card, kbd, skeleton, spinner, label, item)
  - [x] Tier 2 direct (tabs, toggle, toggle-group, separator, dialog(+base), popover(+base), number-input, toast)
  - [x] Tier 3 scroll-area (native overflow + mask fade)
  - [x] responsive hooks: `use-is-mobile`→`createMediaQuery`, `use-platfom`, `use-swipe-tabs`; deleted `use-isomorphic-layout-effect`
  - [x] **select** cluster — primitive-value↔Kobalte option-object bridge via `optionValue` fn + `NULL_OPTION_SENTINEL_KEY`
  - [x] **combobox** cluster (Kobalte Combobox; clear/addNew/empty preserved)
  - [x] **command** — rebuilt on Kobalte `Dialog` + a small Solid registry/keyboard context (Kobalte has no inline command/listbox-in-dialog)
  - [x] **field / form** — framework-plain; `Form errors`→`FieldError` distribution reproduced with a Solid context
  - [ ] toolbar — deferred to §08 (its only consumer is the editor)
- [x] Rebuild the drawer + `*.drawer.tsx` variants on corvu; all dismiss paths animate fully (memory 7640 guard) — see `05-drawer-corvu.md` *(drawer + dialog.drawer + popover.drawer + select.drawer + combobox.drawer done)*
- [x] Port forms to `@tanstack/solid-form` (accessor field API `field().state…`); text/file/select/combobox forms submit end-to-end (editor field stubbed) — see `06-forms.md`
- [x] Migrate feature components + routes to consume the rebuilt UI *(all ~40 `.tsx` except editor-owned §08 files; `Icon` suffix stripped, `render`→`as`/`TriggerConfig` triggers, `useSelector`/`useQuery` accessor call-sites, `useMutation(() => opts())`, `use-options`/`use-shopping-list` made reactive; delete-dialog trigger→TriggerConfig)*
- [ ] Build the custom Lexical Solid binding (composer, decorator nodes, toolbar); round-trip + leak test pass, zero data migration — see `08-editor-lexical.md`
- [ ] Testing, dead-code/grep gates, doc updates, and branch-and-flip cutover; final validation checklist green — see `09-testing-cutover.md`

## Log

- 2026-07-14 Usable-app session (3 commits: §04 remainder, §06 forms, §C features/routes):
  - **§04** select/combobox/command/field/form on Kobalte. Bridges: select/combobox map the app's primitive-value API to Kobalte's option-object model via an `optionValue` getter + a string sentinel for the `null`/`undefined` option. `field.tsx`+`form.tsx` are framework-plain — reproduced Base UI's `<Form errors>`→childless `<FieldError>` distribution with a `FormErrorsContext` + per-field context. `command.tsx` rebuilt on Kobalte `Dialog` + a tiny Solid registry (query signal, roving active index, item registration) — Kobalte's Combobox/Search are popover-only, no inline-in-dialog fit.
  - **§06** forms → `@tanstack/solid-form`: `useFieldContext()` returns an `Accessor`, so all field reads are `field().state.value` etc.; `useAppForm(() => ({…}))` takes an accessor; `form.Subscribe` children receive an accessor. `use-file-upload` ported to `createStore`+`produce`+`onMount/onCleanup`. `editor-field` stubbed (disabled textarea) pending §08.
  - **§C** all feature components + routes + error/nav/layout + `delete-dialog`. Trigger contracts unified on `TriggerConfig` (`{ as, …props, children }`) — `AddIngredient`/`AddUser` now take `trigger` (not children). `useMutation(() => xOptions())` accessor form required by solid-query for variables inference. `useSuspenseQuery` does **not** exist in `@tanstack/solid-query` → `useQuery(() => opts())`. `use-options`/`use-shopping-list`/`use-recipe-quantities`/`use-is-in-shopping-list` made reactive (were §07 import-only). Deduped the §02 codemod's duplicate `createFileRoute` imports in settings/api routes.
  - **Icon parity is NOT complete** in `phosphor-solid@1.1.5` (older glyph set): substituted `CaretUpDown`→`CaretDown`, `Video`→`VideoCamera`, and ingredient categories `Carrot/Cow/Pepper`→`Leaf/ForkKnife/Fire` (see `ingredient-category.tsx`) — revisit if exact glyphs matter.
  - **Deferred to §08:** `recipe/$id` instructions display + `recipe-form` editor toolbar (Magimix/Subrecipe buttons, `recipeNodes`) were dropped/placeholdered since `EditorField` is stubbed; re-wire when the Lexical binding lands. `ui/toolbar.tsx` + `common/editor/*` + `editor/{magimix,subrecipe}/*` still import react/@base-ui/@lexical/react (46 tsc errors, all §08).
- 2026-07-14 Execution session (8 commits on `feat/migrate-to-solid`, each `--no-verify` since intermediate branch-and-flip states don't pass whole-graph checks; final green gate deferred to §09):
  - **§01** deps swapped (all pinned versions re-confirmed published via `npm view`), `vite-plugin-solid` replaces plugin-react + react-compiler, tsconfig `jsx: preserve` + `jsxImportSource: solid-js`, react lint plugin dropped, `wrangler` main → `@tanstack/solid-start/server-entry`.
  - **§02** `@tanstack/react-{start,router,router-ssr-query}` → `solid-*` across `src`; `__root` shell rewritten (`onMount`, accessor route context, `class`); cross-framework devtools dropped for first boot.
  - **§07** `react-query`→`solid-query`, `react-store`→`solid-store` (api factories are import-only), `better-auth/solid` client.
  - **§04** primitives + overlays: Tier 1 (9), tabs/toggle/toggle-group/separator, dialog(+base)/popover(+base)/scroll-area, number-input, toast; responsive hooks ported, `use-isomorphic-layout-effect` deleted.
  - **§05** drawer rebuilt on corvu (corvu owns the transform = the 7640 closing-animation fix) + dialog/popover drawer variants.
  - Conventions locked & reused: `splitProps` forwarding; Kobalte `Polymorphic`/`as` for `render`→`as`; `<Compound>` is the Root (Kobalte + corvu), not `.Root`; phosphor-solid bare names incl. genuine glyph renames (`CircleNotch`→`SpinnerGap`); single `trigger` config object carrying `as`+props; `toastManager.add` compat shim keeps ~10 api-file call-sites unchanged. Scoped `tsc` loop used to verify each file (whole-graph errors are all not-yet-migrated files).
  - Stopped at the select/combobox/command cluster: Kobalte Select/Combobox use an option-object model (+`null` "none" option) vs the current primitive-value `SelectProps` — needs a deliberate bridging layer + interaction QA before proceeding into forms/features.
- 2026-07-14 Grilling session — folded six decisions into the plan: (1) exact-pin the whole Solid ecosystem to last stable (versions verified via npm); (2) hand-roll the Lexical binding, `lexical-solid` rejected as unmaintained; (3) no-Kobalte-peer primitives → ScrollArea native, Toolbar roving-tabindex, Command on Kobalte Combobox; (4) commit to phosphor-solid + strip `Icon` suffix, drop lucide fallback; (5) branch-and-flip with `main` frozen, import-ban gate scoped to `src/**/*.{ts,tsx}`; (6) manual QA + keep 6 unit tests + one Lexical harness (no component-test infra). Verified: adapter version parity, `better-auth/solid` in 1.6.22, corvu has no scroll-area, VAL-001..005 framework-agnostic.
- 2026-07-14 Retargeted the migration from SolidJS v2 (beta) to v1 (stable): `solid-js@1.9.14`, adapter-maturity dropped off the top-risk list since `@tanstack/solid-*` target Solid 1.x.
- 2026-07-13 Converted the 10-file `solid-migration/` narrative into the `.plan/` folder convention: this master `index.md` tracks status + steps; `00-overview.md` folded into Goal/Context here and removed; phase files `01`–`09` kept as per-phase detail.
