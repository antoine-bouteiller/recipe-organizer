# 07 — TanStack Query removal

Per [D3](./00-decisions.spec.md#d3--tanstack-query): plan removal as the
default. Keep retained usage scoped if it ends up necessary.

## Why Query disappears (mostly)

| Today's pattern                                                        | Pages-mode replacement                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `queryClient.ensureQueryData(getRecipeListOptions())` in `loader`      | The `.server.ts` loader directly returns `{ recipes }` to the page component |
| `useSuspenseQuery(getRecipeOptions({ id }))` in component              | Destructure from page props: `function Page({ recipe }: Props) { … }`        |
| `useMutation(createRecipeOptions())`                                   | `useForm(...)` (re-runs loader, fresh data on success)                       |
| `queryClient.invalidateQueries({ queryKey: queryKeys.recipeLists() })` | Implicit — action without return value re-runs the loader automatically      |
| `staleTime` / `gcTime` per-query caching                               | Server-side `routing.revalidate` ISR (per path); client gets fresh on nav    |
| Optimistic updates                                                     | Manual local state in the component if needed (rare in this app)             |

## Per-call-site removal plan

Use `grep -rln "useSuspenseQuery\|useQuery\|useMutation\|queryClient\." src/` to
get an authoritative list at implementation time. Expected hot spots:

| File                                                          | Today                                                              | Replacement                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `src/routes/__root.tsx`                                       | Wires `queryClient` into router context, `ReactQueryDevtoolsPanel` | Gone (devtools removed, no router context)                                               |
| `src/routes/index.tsx`                                        | `ensureQueryData(getRecipeListOptions())` + `useSuspenseQuery`     | Loader returns recipes; page reads props                                                 |
| `src/routes/search.tsx`                                       | Same pattern with `getRecipeListOptions({ search })`               | Loader returns results                                                                   |
| `src/routes/recipe/$id.tsx`                                   | `useSuspenseQuery(getRecipeOptions({ id }))`                       | Loader returns recipe                                                                    |
| `src/routes/recipe/new.tsx`                                   | `useMutation(createRecipeOptions())`                               | `useForm('/recipe/new', defaultValues)`                                                  |
| `src/routes/recipe/edit.$id.tsx`                              | Mutation + invalidate                                              | `useForm('/recipe/edit/:id', current, { params: { id } })`                               |
| `src/routes/settings/users.tsx`                               | Multiple mutations (approve, block, create) with invalidates       | `action('/settings/users?approve', { data: { id } })` etc.; loader re-runs automatically |
| `src/routes/settings/ingredients.tsx`                         | List query + mutations                                             | Loader + named actions                                                                   |
| `src/features/recipe/api/*.ts` (`getRecipeListOptions`, etc.) | `queryOptions(...)` + `mutationOptions(...)` wrappers              | DELETE — replaced by direct loader/action handlers                                       |
| `src/lib/query-keys.ts`                                       | Centralized key factories                                          | DELETE                                                                                   |

## Retained usage

Scoped exceptions — populate as discovered during implementation. Each
entry must justify why pages-mode primitives are insufficient.

_(empty at spec time; expected to remain empty)_

If after migration this section is still empty:

- Remove `@tanstack/react-query` and `@tanstack/react-query-devtools` from
  `package.json`.
- Remove the `QueryClientProvider` / `QueryClient` wiring from the app
  shell (none should remain — it lives in `__root.tsx` which is deleted).
- Run `pnpm dedupe` and `vp check`.

## Toast-on-mutation pattern

Per [D18](./00-decisions.spec.md#d18--no-success-toasts), **success toasts
are dropped**. The Query mutation `onSuccess` toasts (e.g. "Recette
créée") have no direct replacement — the redirect / loader re-render
delivers the feedback instead.

**Error** toasts still fire:

- For `action()`-style calls, wrap the result:
  ```ts
  const r = await action(...)
  if (!r.ok) toastError(r.error.message)
  ```
- For `useForm`, render `form.error` as an inline banner near the form,
  or watch transitions from `null` to non-null in a `useEffect` and
  toast on those.

Keep `src/lib/toast-helpers.ts` and `src/components/ui/toast.tsx` — they
are independent of Query and are still used for error surfacing.

## SSR-Query bridge

`@tanstack/react-router-ssr-query` is deleted with the rest of TanStack.
Its job (hydrate Query state across SSR/CSR) is irrelevant once Query is
gone.

## Decision point

Re-check this question after [05](./05-routing-and-pages.spec.md) and
[06](./06-forms.spec.md) are implementing call-sites:

- **If zero retained usage** → remove Query and its devtools, mark this
  spec complete.
- **If 1–2 retained sites** → keep Query, but **scope tightly**: no app-wide
  `QueryClientProvider` if avoidable; mount only where used.
- **If many retained sites** → escalate. Either the migration is hitting an
  unanticipated case, or the pages-mode primitives are being underused.
  Re-read the failing call-sites before keeping Query as a crutch.

## Verification gate

This phase is "done" when:

- All routes from the [Route inventory](./05-routing-and-pages.spec.md#route-inventory)
  render data without using `useQuery`/`useSuspenseQuery`/`useMutation`
- The "create / update / delete recipe" flows all show their success/error
  toasts (or a deliberate decision to drop them is recorded)
- `package.json` no longer lists `@tanstack/react-query` and
  `@tanstack/react-query-devtools`, **or** [Retained usage](#retained-usage)
  documents why they stay
