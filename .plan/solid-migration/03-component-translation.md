# §03 — React → Solid Component Translation Rules

The mechanical rulebook every component migration in §04–§08 follows. Solid components run **once**
(no re-render); reactivity is fine-grained via signals. Most bugs come from breaking tracking, not
from the API surface.

## Cheat sheet

| React                                | Solid                                     | Trap                                 |
| ------------------------------------ | ----------------------------------------- | ------------------------------------ |
| `useState(x)`                        | `const [v, setV] = createSignal(x)`       | read is a **call**: `v()` not `v`    |
| `useEffect(fn, deps)`                | `createEffect(fn)`                        | no dep array — tracks what it reads  |
| `useEffect(fn, [])`                  | `onMount(fn)`                             | runs once, client-side               |
| cleanup return                       | `onCleanup(fn)` inside effect             |                                      |
| `useMemo(fn, deps)`                  | `createMemo(fn)`                          |                                      |
| `useRef` (DOM)                       | `let el!: HTMLDivElement; <div ref={el}>` | ref is assigned before effects run   |
| `useRef` (mutable box)               | plain `let` / object                      | no `.current`                        |
| `useCallback`                        | plain function                            | not needed — component runs once     |
| `useContext(C)`                      | `useContext(C)`                           | provider value is read reactively    |
| `memo`, `React.memo`                 | delete                                    | no re-render to memoize              |
| `className`                          | `class`                                   |                                      |
| `htmlFor`                            | `for`                                     |                                      |
| `onChange` (input)                   | `onInput`                                 | React's onChange == DOM onInput      |
| `style={{a:1}}`                      | `style={{ a: '1px' }}`                    | string values / use `--var` keys     |
| `{cond && <X/>}`                     | `<Show when={cond()}>`                    | raw `&&` renders `0`/breaks tracking |
| ternary render                       | `<Show when fallback>`                    |                                      |
| `list.map(x => <X/>)`                | `<For each={list()}>{x => <X/>}</For>`    | `map` loses keyed reconciliation     |
| `<>...</>`                           | `<>...</>`                                | fragments OK                         |
| `props.children`                     | `props.children`                          | don't destructure props (below)      |
| `forwardRef`                         | pass `ref` as a normal prop               | Solid has no forwardRef              |
| `dangerouslySetInnerHTML={{__html}}` | `innerHTML={html}`                        |                                      |

## The three rules that cause 90% of bugs

1. **Never destructure props.** `const { class: c } = props` snapshots and kills reactivity.
   Use `props.class`, or `splitProps(props, ['class'])` / `mergeProps(defaults, props)` to keep
   reactivity. Every `ui/*` component currently destructures (`{ className, children, ...props }`)
   — rewrite with `splitProps`.

2. **Signals are getters — call them.** Reading `v` gives the function. In JSX `class={v()}`.
   Passing a value to a child that must stay reactive: pass `v` (the accessor) or an arrow
   `() => v()`, not `v()`.

3. **Effects track, not deps.** `createEffect` re-runs when any signal read _inside_ it changes.
   No dep array, no exhaustive-deps lint. If you read a signal you didn't mean to track, split it
   with `untrack(...)`.

## Prop-forwarding pattern for ui components

Current React pattern:

```tsx
export const DrawerTitle = ({ className, ...props }) => <Primitive.Title className={cn('...', className)} {...props} />
```

Solid equivalent (keeps reactivity, keeps polymorphic spread):

```tsx
export const DrawerTitle = (props: Drawer.TitleProps) => {
  const [local, rest] = splitProps(props, ['class'])
  return <Drawer.Title class={cn('...', local.class)} {...rest} />
}
```

`cn` (`clsx` + `tailwind-merge`) is unchanged.

## Polymorphism / `asChild`

Base UI uses `render`/slot props; Kobalte and corvu use an `as` prop (`<X as="a" href=...>`) or
`<X.Trigger as={Button}>`. Where the code relied on Base UI's `render` prop, translate to the
target lib's `as`. Details per component in §04/§05.

## Context

`createContext` / `useContext` from `solid-js` (not a separate package). `LinkedRecipesContext`
(`src/features/recipe/contexts/linked-recipes-context.tsx`) and the form contexts
(`src/hooks/use-form-context.ts`) port directly — provider value can be a store/signal so consumers
stay reactive.

## Lazy + Suspense

`lazy` and `Suspense` come from `solid-js`. The `Select`/`Dialog` responsive-split pattern
(lazy base vs drawer impl behind `useIsMobile`) ports cleanly — see §04/§05.

## Self-check

For any non-trivial component, after migrating verify: no destructured props, every signal read is
called, no `&&` in JSX, lists use `<For>`. A quick grep gate: `props\.\w+` should appear (not
`const {`), and `\.map(` inside JSX return blocks should be zero in migrated `ui/*` files.
