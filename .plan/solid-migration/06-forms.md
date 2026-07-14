# §06 — Forms: TanStack React Form → Solid Form

TanStack Form has a first-class Solid variant (`@tanstack/solid-form`) including `createFormHook`,
so the app's form architecture (PAT-003: schema → `withForm` view → dialog/page) survives intact.

## Files

- `src/hooks/use-app-form.ts` (the `createFormHook` registry)
- `src/hooks/use-form-context.ts` (`fieldContext` / `formContext`)
- `src/components/forms/*` (all field components)
- `src/components/dialogs/form-dialog.tsx`, `form-submit.tsx`
- `src/utils/format-form-errors.ts`, `src/utils/form-data.ts` (framework-agnostic — no change)

## use-app-form.ts

`createFormHook` and `createFormHookContexts` come from `@tanstack/solid-form`. The registry shape
is identical:

```ts
import { createFormHook } from '@tanstack/solid-form'
import { lazy } from 'solid-js' // was 'react'

const { useAppForm, withForm } = createFormHook({
  fieldComponents: { CheckboxField, ComboboxField, EditorField, Field /* ... */ },
  fieldContext,
  formComponents: { FormSubmit },
  formContext,
})
export { useAppForm, withForm }
```

`EditorField` stays `lazy(() => import('@/components/forms/editor-field'))` but is **blocked on §08**
— stub it (renders a disabled textarea) until the editor lands, so forms compile and non-recipe
forms work.

## use-form-context.ts

`createFormHookContexts()` from `@tanstack/solid-form` returns `{ fieldContext, formContext,
useFieldContext, useFormContext }`. Direct swap.

## Field components (`components/forms/*`)

Each field reads the field API from context and binds a `ui/*` control. Solid differences:

- Field API values are **accessors** in solid-form: `field().state.value`, `field().handleChange`.
  Update every `field.state.value` → `field().state.value`.
- Bind inputs with `onInput` (not `onChange`) and `value={field().state.value}`.
- Errors: `format-form-errors.ts` output feeds `FieldError` — render with `<Show when={errors()}>`.
- `text-field`, `number-field` (→ Kobalte NumberField), `select-field` (→ §04 Select wrapper),
  `combobox-field`, `toggle-group-field`, `checkbox-field`, `image-field`, `video-field` — each
  wraps its §04 control; port §03 idioms + the accessor change.
- `image-field`/`video-field` use `use-file-upload.ts` — port that hook (§03: signals + `onCleanup`
  for object URLs) and `get-file-url.ts` (pure, no change).

## form-submit.tsx / form-dialog.tsx

- `FormSubmit` reads `form().state.isSubmitting` / `canSubmit` (accessors) to disable the button.
- `getFormDialog(...)` composes the §04 Dialog wrapper (which itself picks Kobalte dialog vs corvu
  drawer). No form-specific change beyond §03 idioms.

## Validation

- One text form (e.g. ingredient create), one file form (recipe image), one select/combobox form
  submit end-to-end: client validation (valibot) fires in French, server `withServerError` errors
  surface via `toastManager`, cache invalidates (§07).
- The recipe form's editor field is stubbed but the rest of the recipe form submits.

## ponytail notes

- Don't refactor the form architecture — it's already the right shape and has a Solid adapter. Pure
  port.
- Stub `EditorField` rather than blocking all forms on §08.
