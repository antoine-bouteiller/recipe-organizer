# §05 — Drawer: Base UI → corvu

Replace `@base-ui/react/drawer` with **corvu** (`@corvu/drawer`). corvu is Solid-native, unstyled,
and its drawer is the closest match to the current swipe-to-dismiss bottom sheet. This also fixes
the closing-animation bug that was open against the Base UI drawer (memory 7635–7640: Tailwind
transform classes not applying on close) — corvu drives the transform via a reactive
`openPercentage`/CSS var we control, so the animation stops depending on conditional Tailwind class
application.

## Files

- `src/components/ui/drawer.tsx` — the primitive wrapper (rewrite on corvu)
- `src/components/ui/dialog.drawer.tsx`
- `src/components/ui/select.drawer.tsx`
- `src/components/ui/combobox.drawer.tsx`
- `src/components/ui/popover.drawer.tsx`

The `.drawer` variants are the mobile impls the Tier-4 responsive wrappers (§04) lazy-load. Each
renders its content inside the drawer instead of a popover/dialog.

## corvu API mapping

Base UI `Drawer.*` → corvu `Drawer.*` (namespaces differ, concepts align):

| Base UI                             | corvu                                 | Notes                                                             |
| ----------------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `Drawer.Root swipeDirection="down"` | `<Drawer.Root side="bottom">`         | corvu uses `side`; bottom = swipe-down dismiss                    |
| `Drawer.Trigger`                    | `Drawer.Trigger`                      | `as` for polymorphism                                             |
| `Drawer.Close`                      | `Drawer.Close`                        |                                                                   |
| `Drawer.Portal`                     | `Drawer.Portal`                       |                                                                   |
| `Drawer.Backdrop`                   | `Drawer.Overlay`                      | corvu names it Overlay                                            |
| `Drawer.Viewport`                   | (no direct peer)                      | fold the viewport grid layout into `Drawer.Content`'s wrapper     |
| `Drawer.Popup`                      | `Drawer.Content`                      | the sheet itself                                                  |
| `Drawer.Title`                      | `Drawer.Label`                        | corvu: `Drawer.Label` (a11y title)                                |
| `Drawer.Content` (panel/footer)     | plain `<div>` inside `Drawer.Content` | corvu has no sub-content parts; keep the current `data-slot` divs |

### Swipe / transform CSS vars

Base UI exposed `--drawer-swipe-progress`, `--drawer-swipe-movement-y`, `--drawer-swipe-strength`.
corvu exposes reactive values via its context/render props:

- `openPercentage` (0..1) and `isDragging` from `useDrawerContext()` / the `Drawer.Content` render
  callback.
- Map to CSS custom properties you set on `Drawer.Content`:
  `style={{ '--drawer-progress': ctx.openPercentage() }}` etc., then keep the existing Tailwind
  arbitrary-value classes but read `var(--drawer-progress)` instead of `var(--drawer-swipe-progress)`.
- The backdrop opacity `opacity-[calc(1-var(--drawer-swipe-progress))]` becomes
  `opacity-[calc(var(--drawer-progress))]` (corvu's percentage is "how open", invert as needed).

corvu handles the transform on `Drawer.Content` itself via `translate3d`; you may drop the manual
`transform-[translateY(var(--drawer-swipe-movement-y))]` and let corvu drive it, keeping only the
rounded corners / bg / shadow classes. **This is the fix** for the stuck-close animation — no
conditional transform class to mis-apply.

### Rewritten `drawer.tsx` skeleton

```tsx
import Drawer from '@corvu/drawer'
import { splitProps, type ParentProps } from 'solid-js'
import { ScrollArea } from '@/components/ui/scroll-area' // §04 native impl
import { cn } from '@/utils/cn'

export const DrawerRoot = (props: Parameters<typeof Drawer.Root>[0]) => <Drawer.Root side="bottom" {...props} />

export const DrawerTrigger = Drawer.Trigger
export const DrawerClose = Drawer.Close

export const DrawerPopup = (props: ParentProps<{ class?: string }>) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <Drawer.Portal>
      <Drawer.Overlay
        data-slot="drawer-backdrop"
        class="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm"
        style={{ 'transition-duration': '450ms' }}
      />
      <Drawer.Content
        data-slot="drawer-popup"
        class={cn('fixed inset-x-0 bottom-0 z-50 flex max-h-full flex-col rounded-t-2xl border-t bg-popover ...', local.class)}
        {...rest}
      >
        {local.children}
        <div
          aria-hidden
          data-slot="drawer-bar"
          class="absolute inset-x-0 top-0 flex ... before:h-1 before:w-12 before:rounded-full before:bg-input"
        />
      </Drawer.Content>
    </Drawer.Portal>
  )
}
// DrawerHeader / DrawerFooter / DrawerTitle(→Drawer.Label) / DrawerPanel: plain divs + ScrollArea, §03 idioms
```

Keep every `data-slot="drawer-*"` value — the sibling-selector Tailwind classes
(`has-data-[slot=drawer-bar]`, `in-[[data-slot=drawer-popup]:has(...)]`) depend on them and are the
whole layout system. Do **not** rename slots.

## The `.drawer` variants

Each is "render this control's list/panel inside a bottom drawer instead of a popover". Pattern is
identical across the four:

- `select.drawer.tsx` — corvu `Drawer.Root` wrapping a scrollable option list (reuse Kobalte
  `Select`'s listbox items, or a plain `<For>` list since the drawer owns open state). Emits the
  same `onValueChange` the `select.shared` contract expects.
- `combobox.drawer.tsx` — drawer + a search `input` (native) + filtered `<For>` list.
- `dialog.drawer.tsx` — drawer standing in for a modal dialog on mobile; maps `DialogTitle`→`Label`,
  keeps header/footer slots.
- `popover.drawer.tsx` — drawer standing in for a popover on mobile.

All four are lazy-loaded by the Tier-4 wrappers (§04) via `useIsMobile`. Their public props must
match the `.base` sibling exactly so the wrapper can pick either transparently.

## Validation

- Swipe-down dismiss works; backdrop fades with drag.
- **Regression check for the old bug:** open then close via (a) backdrop tap, (b) swipe, (c) Close
  button — the sheet animates fully off-screen every time (memory 7640 was the failure mode).
- `select`/`combobox`/`dialog`/`popover` on a mobile viewport render the drawer variant; on desktop
  render the Kobalte popover/dialog variant.

## ponytail notes

- Let corvu own the transform; delete the hand-rolled `translateY` var plumbing. Less CSS, and it's
  what fixes the animation bug.
- Don't rebuild `Drawer.Viewport` — corvu positions `Content` itself; the grid was a Base UI
  workaround.
