# 06 — Forms (`@tanstack/react-form` → `useForm` from `@void/react`)

Per [D4](./00-decisions.spec.md#d4--tanstack-form): replace TanStack Form
with `@void/react`'s `useForm` hook. The hook itself is straightforward;
the **work** is rebuilding the composed form components that wrap inputs,
error display, and field groups.

## Current form surfaces

- **Recipe form** (`src/features/recipe/components/recipe-form.tsx`) —
  the largest. Includes:
  - `ingredient-group-field.tsx` — dynamic add/remove of ingredient groups
    and rows within groups
  - `quantity-controls.tsx` — small numeric input with steppers
  - Image upload, video upload
  - Linked recipes (recipe-to-recipe references with quantity ratios)
  - Tag multi-select
- **User form** (`src/features/users/components/user-form.tsx`) — admin
  invite (email only)
- **Generic form components** in `src/components/forms/` (12 files —
  inspect on implementation: input, textarea, select, checkbox, file,
  switch, etc.)
- **Hooks** — `src/hooks/use-app-form.ts`, `src/hooks/use-form-context.ts`,
  `src/hooks/use-file-upload.ts`
- **Utils** — `src/features/recipe/utils/form.ts`,
  `src/utils/format-form-errors.ts`, `src/utils/form-data.ts`

## Library mapping

| TanStack Form concept                 | `@void/react` `useForm` equivalent                                              |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `useForm({ defaultValues, … })`       | `useForm(url, defaultValues, { params? })`                                      |
| `form.handleSubmit`                   | `<form action={form.post}>` (React) or `form.post()`/`form.put()` programmatic  |
| `form.Field({ name })` render-prop    | Controlled inputs reading `form.data.foo` + `form.setData('foo', value)`        |
| `form.Subscribe(...)`                 | Read reactive `form.data` / `form.errors` / `form.pending` directly             |
| `validators: { onChange: zodSchema }` | Server-side via `defineHandler.withValidator({ body: schema })`                 |
| `form.state.values`                   | `form.data`                                                                     |
| `form.state.errors`                   | `form.errors` (field-level) + `form.error` (call-site-level)                    |
| `form.useStore(...)`                  | n/a — `form.data` is reactive directly                                          |
| Field array push/remove               | Hand-managed: `form.setData('groups', [...form.data.groups, newGroup])`         |
| Submit-on-button-press disabled state | `disabled={form.pending}` or `useFormStatus().pending` for native React Actions |

Key difference: TanStack Form is **client-validation-first**; Void's
`useForm` is **server-validation-first** with optimistic client state. The
server's `withValidator` schema is the source of truth. Pre-submit client
validation can still happen, but errors come back from the action's
`ValidationError` automatically.

## Submit lifecycle

The current pattern uses TanStack Query's mutation:

```tsx
const mutation = useMutation(createRecipeOptions())
const onSubmit = (values) => mutation.mutate(formData)
```

Void replaces this entirely:

```tsx
const form = useForm('/recipe/new', defaultValues)
// <form action={form.post}>… submits to pages/recipe/new.server.ts action
```

On success, the loader re-runs and the page receives fresh props. The
toast-on-success behavior (e.g. "Recette créée") needs to be reattached.
Three options:

- **`form.recentlySuccessful`** — boolean true for ~2s after submit. Watch
  in `useEffect`, fire toast there.
- **`action()` helper** instead of `useForm` for actions without form state.
  `const result = await action('/recipe/edit/:id?delete', { method: 'DELETE', params: { id } }); if (result.ok) toastSuccess(...)`.
- **Redirect on success** via `c.redirect('/?created=1')` and read the
  search param in the destination page.

**Recommended:**

- For recipe create/update → `action: defineHandler(...)` returns
  `c.redirect('/recipe/:id')`, destination shows a "just-created" toast
  via a one-shot search-param flag.
- For approve/block/delete → use the `action()` helper, fire toast on the
  result.

## File uploads

`useForm` auto-detects `File` / `Blob` / `FileList` values and switches the
request to `multipart/form-data`. On the server, `c.req.parseBody()` gives
back the files.

The current `src/hooks/use-file-upload.ts` is a TanStack-Form-aware hook
that handles preview generation, drag-and-drop, etc. **Keep** the preview
and drag-drop logic, **remove** the TanStack Form bindings — wire the
result to `form.setData('image', file)` instead.

Image transformation (resize to WebP) happens **before** `setData` if
[D5 = Option A](./03-bindings.spec.md#option-a-drop-images-transform-client-side-before-upload)
is picked.

## Recipe form — ingredient groups

The current `ingredient-group-field.tsx` is TanStack Form's `useField` +
array push/remove. Becomes:

```tsx
function IngredientGroups({ form }: { form: ReturnType<typeof useForm<…>> }) {
  const groups = form.data.ingredientGroups
  const setGroups = (next: typeof groups) => form.setData('ingredientGroups', next)
  // … add/remove/edit operations over the array …
}
```

Error display:

```tsx
{
  form.errors['ingredientGroups.0.name'] && <span>…</span>
}
```

Void's `withValidator` flattens errors with dotted-path keys (per Standard
Schema / Better Auth conventions); confirm at implementation that
`form.errors` keys for nested arrays are addressable that way. If not,
serialize the array errors into a single `form.error` and render via a
top-level error block.

## Validation library

Existing schemas (`recipeSchema`, `unitSlugSchema`, etc.) are written in
Zod. They stay as-is and become the server `withValidator` input. No
client-side validator needed unless we want immediate field errors before
submission.

## Components to rebuild

Inventory of files that need a non-trivial rewrite vs. plain-port:

| File                                                        | Change                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/hooks/use-app-form.ts`                                 | DELETE — replaced by `useForm` direct usage                                                    |
| `src/hooks/use-form-context.ts`                             | DELETE — Void's `form` object is passed as prop                                                |
| `src/hooks/use-file-upload.ts`                              | Rewrite — strip TanStack Form bindings, keep DnD/preview logic                                 |
| `src/utils/form-data.ts` (`parseFormData`)                  | Probably DELETE — Void's action body validator parses `multipart/form-data` for us             |
| `src/utils/format-form-errors.ts`                           | Replace with a thin helper that maps `form.errors` (dotted) → field display                    |
| `src/components/forms/*` (input, textarea, select, …)       | Rewrite signatures: drop TanStack `Field`/`Subscribe` props, accept `(value, onChange, error)` |
| `src/features/recipe/components/recipe-form.tsx`            | Rewrite — top-level `useForm` + composition                                                    |
| `src/features/recipe/components/ingredient-group-field.tsx` | Rewrite — array operations on `form.data`                                                      |
| `src/features/recipe/components/quantity-controls.tsx`      | Mostly portable — uses internal state and a controlled value prop                              |
| `src/features/recipe/components/delete-recipe.tsx`          | Rewrite — uses `action()` helper now                                                           |
| `src/features/users/components/user-form.tsx`               | Rewrite — small surface, mostly straight port                                                  |

## Error UX

- **400 / validation** — surfaced on `form.errors`. The current invalid
  state styling on inputs reads from `form.errors[fieldName]`.
- **Network / 500** — caught by Void's React error boundary; the existing
  `OfflineBanner` + toast can still fire on the catch.
- **403 from `requireAuth`** — should navigate to login (Void's handling)
  rather than render an error.

## Verification gate

This phase is "done" when:

- The recipe create form successfully submits (with image upload) and
  routes to the new recipe page
- The recipe edit form pre-fills with current values and persists changes
- The delete button works via `action('/recipe/[id]?delete')`
- Validation errors render inline on the offending field
- The user create form (admin invite) works
- No imports remain from `@tanstack/react-form` in src/
