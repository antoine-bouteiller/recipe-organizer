# §04 — UI Design System: Base UI → Kobalte

Rebuild `src/components/ui/*` on `@kobalte/core`. These are **owned** components (project CLAUDE.md:
one file per component, edit directly, `knip` enforces no dead exports). Keep that contract — one
file per component, same export names, same Tailwind classes. Only the primitive under the hood
changes.

Kobalte import style is per-component subpaths: `import { Select } from '@kobalte/core/select'`.
Kobalte parts use `.Root/.Trigger/.Content/...` and an `as` prop for polymorphism.

## Migration order (bottom-up)

Primitives with no dependencies first, composites last, so each file compiles against already-done
pieces.

### Tier 1 — plain markup, no lib (fastest, do first)

These use no Base UI primitive today beyond a styled element. Port = §03 idioms only (`class`,
`splitProps`).

- `button.tsx` — Kobalte `Button` is just a polymorphic `<button>`; keep the `cva` variants. Can
  even stay a plain `<button>` + `cva` (ponytail: no lib needed unless you want the disabled/`as`
  polymorphism — use Kobalte `Button` only if a variant renders as `<a>`).
- `input.tsx`, `badge.tsx`, `card.tsx`, `kbd.tsx`, `skeleton.tsx`, `spinner.tsx`, `item.tsx`,
  `label.tsx` — plain elements + `cva`/`cn`. No Kobalte needed. Kobalte has `Label` but the native
  `<label for>` is enough.

### Tier 2 — direct Kobalte counterpart

| File                | Kobalte primitive                             | Notes                                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs.tsx`          | `@kobalte/core/tabs`                          | keep the `data-active` styling (memory 7753); Kobalte exposes `data-selected` — update the Tailwind selectors from `data-active` → `data-selected`                                                                                           |
| `separator.tsx`     | `@kobalte/core/separator`                     | trivial                                                                                                                                                                                                                                      |
| `toggle.tsx`        | `@kobalte/core/toggle-button`                 | `pressed`/`onChange`                                                                                                                                                                                                                         |
| `toggle-group.tsx`  | `@kobalte/core/toggle-group`                  | single/multiple modes                                                                                                                                                                                                                        |
| `popover.base.tsx`  | `@kobalte/core/popover`                       | anchor/positioning props differ; Kobalte `Popover.Content` handles placement                                                                                                                                                                 |
| `dialog.base.tsx`   | `@kobalte/core/dialog`                        | `Dialog.Root/Trigger/Portal/Overlay/Content/Title/Description/CloseButton`                                                                                                                                                                   |
| `select.base.tsx`   | `@kobalte/core/select`                        | Kobalte Select is `options`-driven with render props for items; the `SelectProps` union (single/multiple) in `select.shared.tsx` maps to Kobalte's `multiple` prop                                                                           |
| `combobox.base.tsx` | `@kobalte/core/combobox`                      | async/filtered options via `options` + `onInputChange`                                                                                                                                                                                       |
| `number-input.tsx`  | `@kobalte/core/number-field`                  | `NumberField.Input/IncrementTrigger/DecrementTrigger`; keep step/format                                                                                                                                                                      |
| `field.tsx`         | `@kobalte/core/text-field` parts **or** plain | `field.tsx` is a generic label+control+error+description wrapper for TanStack Form. Keep it framework-plain (it's consumed by §06); use Kobalte only if you want built-in `aria-describedby` wiring. Recommend plain markup — less coupling. |
| `toast.tsx`         | `@kobalte/core/toast`                         | `ToastProvider`/`toaster`; the `ToastProvider` in `__root.tsx` and `toast-helpers.ts` (`toastManager`) rewire to Kobalte's `toaster.show(...)` API                                                                                           |

### Tier 3 — no Kobalte primitive (decide per component)

- **`scroll-area.tsx`** — Base UI has `ScrollArea` with the custom `scrollFade` prop used by the
  drawer panel. Kobalte has none. Options: (a) native `overflow-auto` + a small CSS mask for the
  fade — **decided**, drops a dependency; (b) `@corvu/scroll-area`? corvu@0.7.2 ships no scroll-area
  (verified) — no. **Decision (a):** native `overflow-y-auto` + `scrollbar-gutter: stable`. Keep
  `scrollFade` **only** if a ~10-line scroll listener (`onScroll` + a signal toggling a `mask-image`
  linear-gradient) reproduces it cleanly; otherwise cut it — it's cosmetic.
- **`toolbar.tsx`** — Base UI `Toolbar`. Kobalte has no Toolbar. It's used by the editor
  (`common/editor`), which is itself blocked (§08). **Decision: hand-roll a `<div role="toolbar">`
  with roving-tabindex** (~30 lines — arrow-key nav across the buttons, one tab stop). Keep the a11y
  behavior; don't drop to a bare div. Built in §08 alongside the editor (its only consumer).
- **`command.tsx`** — a cmdk-style command palette (used by search / combobox). Kobalte has no
  command component. Options: (a) build on Kobalte `Combobox` (it already does filtered listbox +
  keyboard nav) — recommended; (b) a Solid cmdk community port (verify maintenance before adopting).
  **Recommend (a):** fold `command.tsx` onto Kobalte Combobox internals so `search-input` /
  `search-bar` keep working.

### Tier 4 — responsive wrappers (depend on Tier 2 + §05)

`select.tsx`, `dialog.tsx`, `combobox.tsx`, `popover.tsx`, `select.shared.tsx` — these pick
base-vs-drawer at runtime (`useIsMobile` + `lazy`). They don't touch Base UI directly; they compose
the `.base` (§04) and `.drawer` (§05) impls. Port the wrapper idioms (§03: `lazy`/`Suspense`/`Show`
from `solid-js`, accessor reads) and leave the impl swaps to their tiers.

`useIsMobile` (`src/hooks/use-is-mobile.ts`) → `createMediaQuery('(max-width: …)')` from
`@solid-primitives/media`, returning an accessor. `use-platfom.ts`, `use-swipe-tabs.ts` port per
§03. `use-isomorphic-layout-effect.ts` → just `onMount`/`createEffect`; Solid has no
useLayoutEffect split needed — **delete it**.

## Kobalte specifics to watch

- **Controlled value**: Kobalte uses `value`/`onChange` (not `onValueChange`). Rename in the
  wrappers; the public `SelectProps.onValueChange` can stay as the app-facing name, adapting to
  Kobalte's `onChange` inside `select.base`.
- **Portals**: Kobalte portals to `document.body` by default. The current Base UI portal targets
  are fine; verify z-index against the drawer's `z-50`.
- **`data-*` state attributes** differ (`data-selected`, `data-expanded`, `data-highlighted` vs
  Base UI's `data-active`/`data-open`). Grep every `data-active`/`data-open`/`data-starting-style`
  Tailwind selector in `ui/*` and remap. Base UI's `data-starting-style`/`data-ending-style`
  animation hooks become Kobalte's `data-expanded` + CSS transitions (or keep `tw-animate-css`).

## Validation

- Storybook-free: mount each `ui/*` in a scratch route and click through open/close/select/keyboard.
- `knip` clean on `components/ui/*` (no dead exports — the enforced contract).
- Keyboard + focus-trap parity on dialog/select/combobox (Kobalte handles it, but verify Esc,
  arrow keys, and focus return).

## ponytail notes

- Don't reach for Kobalte on Tier 1 — a styled `<button>` with `cva` is the whole component.
- `command.tsx` and `scroll-area.tsx`: reuse Combobox / native CSS instead of adding libs.
- Delete `use-isomorphic-layout-effect.ts` outright.
