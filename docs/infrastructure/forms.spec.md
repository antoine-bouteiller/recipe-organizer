---
title: Form patterns (TanStack Form)
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./server-functions.spec.md
  - ../../agents_doc/forms.md
---

## 2. Problem Statement

The app has a handful of structurally different forms (unique create/edit pages, reusable create+edit forms,
compact dialog-based field groups) that all need consistent validation, type-safety, file upload, and styling.
We standardize on TanStack Form with a thin wrapper (`useAppForm` / `withForm` / `withFieldGroup`) so:

- `[G-1]` Every field is typed end-to-end — schema (Zod) → form values → field component → submit payload.
- `[G-2]` Three usage patterns are first-class: single-use forms, reusable forms shared by create+edit,
  reusable field groups for dialogs.
- `[G-3]` Files (image / video) integrate with the same form via custom field components and FormData
  submission.
- `[G-4]` Validation re-runs on change only after the first submit (`revalidateLogic()`).
- `[G-5]` Errors render via a single conventional error surface (`FieldError`).

## 3. Key Design Decisions

| Decision                                         | Choice                                                                                                  | Rationale                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `[KD-1]` TanStack Form                           | `@tanstack/react-form` via custom `createFormHook(...)`                                                 | Typed, validator-agnostic, headless; interoperates with Zod.                     |
| `[KD-2]` `useAppForm` hook                       | Wraps `createFormHook` with all field components registered                                             | Single import site for every form; zero per-form registration boilerplate.       |
| `[KD-3]` Three patterns, three helpers           | `useAppForm` (single-use) / `withForm` (reusable across contexts) / `withFieldGroup` (dialog field set) | Matches actual reuse shapes in the codebase.                                     |
| `[KD-4]` Zod schemas colocated with mutations    | Each `create.ts` / `update.ts` server fn exports the schema used by both server + client                | Single source of truth for field shapes.                                         |
| `[KD-5]` `revalidateLogic()` validation          | Validate on submit first; re-validate on change afterward                                               | Avoids showing red errors before the user has interacted; feels less accusatory. |
| `[KD-6]` File uploads via FormData               | `objectToFormData(values)` on the client; `parseFormData(formData)` on the server                       | Browser-native multipart; no JSON base64 gymnastics.                             |
| `[KD-7]` `<ComboboxField>` instead of `<Select>` | Explicit codebase rule (forms.md)                                                                       | Comboboxes stay usable at 100+ options (ingredients, recipes as sub-recipes).    |
| `[KD-8]` Rich text via `<EditorField>`           | Lexical editor integrated as a form field                                                               | Recipe instructions are a form field, not a sibling state container.             |

## 4. Principles & Intents

- `[PI-1]` **No `useState` for form state** — always TanStack Form. If a form field lives in component state,
  it's a bug.
- `[PI-2]` **Schemas drive forms** — pick the Zod schema first, derive `defaultValues` and `FormInput` types
  from it.
- `[PI-3]` **Import from `@/hooks/use-app-form`** — never import directly from `@tanstack/react-form` in
  features; the wrapper adds field components.
- `[PI-4]` **Dialogs use `withFieldGroup`** — reuse the same field set across add/edit dialogs; wrap the dialog
  with a shared submit button.
- `[PI-5]` **Arrays use `form.AppField` with iteration** — ingredient groups, linked recipes, etc. use the
  array-field pattern; each row has a `_key` that the client injects for React keying and the server ignores.

## 5. Non-Goals

- `[NG-1]` Formik / React Hook Form interop.
- `[NG-2]` Server-driven forms (dynamic schema fetched at runtime).
- `[NG-3]` Uncontrolled form fields.
- `[NG-4]` Inline `<form>` element beyond what's necessary; submission is wired via `form.handleSubmit()`.
- `[NG-5]` Optimistic UI for form submits (mutations refetch after success; the handful of ms isn't worth the
  complexity).

## 6. Caveats

- `[C-1]` Array fields require a stable `_key` per row so React can diff properly. The server strips these —
  the Zod schema explicitly allows `_key: z.string()` to avoid strict-mode rejections.
- `[C-2]` `ImageField` / `VideoField` store a `File | { id, url }` union in the form state. The server's Zod
  schema uses `z.union([z.instanceof(File), z.object({id, url})])` to handle both "unchanged" and "new upload"
  cases on update.
- `[C-3]` `parseFormData` auto-parses JSON-looking strings. A text field whose value is literal `null` will be
  parsed to `null`. Name text fields accordingly.
- `[C-4]` `revalidateLogic()` hides errors before the first submit. Users may not see required-field errors
  until they submit once — this is the chosen tradeoff.
- `[C-5]` `<EditorField>` emits Lexical `SerializedEditorState` as a JSON string. The server's Zod validator
  uses `z.string()` — no structural validation. See recipe editor spec `[C-1]`.

## 7. High-Level Components

| Component             | Module type | Responsibility                                                                                                                             | Public API surface                                                                       |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `useAppForm`          | Hook        | TanStack Form hook pre-registered with every app field component                                                                           | `useAppForm`, `withForm` from `src/hooks/use-app-form.ts`                                |
| `withFieldGroup`      | HOC         | Reusable group of fields usable inside dialogs (ingredient/unit/user forms)                                                                | `withFieldGroup` — via `@tanstack/react-form`, wired by `getFormDialog` (common wrapper) |
| Field components      | React       | `TextField`, `NumberField`, `ComboboxField`, `SelectField`, `CheckboxField`, `ToggleGroupField`, `ImageField`, `VideoField`, `EditorField` | `src/components/forms/*`                                                                 |
| Form shell primitives | React       | `<Field>`, `<FieldLabel>`, `<FieldControl>`, `<FieldError>`, `<FieldDescription>`                                                          | `src/components/ui/field.tsx`                                                            |
| `<FormSubmit>`        | React       | Styled submit button with pending state                                                                                                    | `src/components/forms/form-submit.tsx`                                                   |
| FormData utilities    | Helpers     | `objectToFormData` / `parseFormData`                                                                                                       | `src/utils/form-data.ts`                                                                 |
| Field map / defaults  | Convention  | Per-form file (e.g., `src/features/recipe/utils/form.ts`) with `defaultValues` + `fieldMap`                                                | Feature-local                                                                            |
| `formatFormErrors`    | Helper      | Turn TanStack Form error arrays into display-friendly strings                                                                              | `src/utils/format-form-errors.ts`                                                        |

## 8. Detailed Design

| Concern                          | Entry point                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form hook                        | `src/hooks/use-app-form.ts`                                                                                                                             |
| Field components                 | `src/components/forms/`                                                                                                                                 |
| Form shell primitives            | `src/components/ui/field.tsx`                                                                                                                           |
| Form context bridges             | `src/hooks/use-form-context.ts`                                                                                                                         |
| File upload hook                 | `src/hooks/use-file-upload.ts`                                                                                                                          |
| Example: direct `useAppForm`     | Route components under `src/routes/settings/*`                                                                                                          |
| Example: `withForm` reusable     | `src/features/recipe/components/recipe-form.tsx`                                                                                                        |
| Example: `withFieldGroup` dialog | `src/features/ingredients/components/ingredient-form.tsx`, `src/features/units/components/unit-form.tsx`, `src/features/users/components/user-form.tsx` |
| FormData helpers                 | `src/utils/form-data.ts`                                                                                                                                |
| Detailed docs (user-written)     | `agents_doc/forms.md`                                                                                                                                   |

Three canonical shapes (from `agents_doc/forms.md`):

```typescript
// 1. Direct useAppForm (single-use form)
const form = useAppForm({
  defaultValues, validators: { onDynamic: schema }, validationLogic: revalidateLogic(),
  onSubmit: async ({ value }) => { await mutateAsync({ data: value }) },
})

// 2. withForm (reusable across create + edit)
export const RecipeForm = withForm({ defaultValues, render: ({ form }) => <>...</> })

// 3. withFieldGroup (dialog field set)
const UserFormGroup = withFieldGroup({
  defaultValues: userDefaults,
  props: { ... },
  render: ({ group }) => <>...</>,
})
```

Submission with files (see `src/features/recipe/components/recipe-form.tsx`):

```typescript
onSubmit: async ({ value }) => {
  await mutateAsync({ data: objectToFormData(value) })
}
```

## 9. Verification Criteria

- `[VC-1]` No feature imports `useForm` from `@tanstack/react-form` directly; all go through
  `src/hooks/use-app-form.ts`.
- `[VC-2]` No `useState<string>` / `useState<number>` for form field values outside of `useAppForm`.
- `[VC-3]` Every form uses `validationLogic: revalidateLogic()` so errors surface after first submit.
- `[VC-4]` Every Zod schema backing a form is colocated with the server mutation (create.ts / update.ts) and
  imported by the form component (not duplicated).
- `[VC-5]` File uploads use `objectToFormData` on the client side and the server uses
  `.inputValidator((fd: FormData) => schema.parse(parseFormData(fd)))`.
- `[VC-6]` Select-like dropdowns use `<ComboboxField>` for ingredient / unit / linked-recipe pickers.
- `[VC-7]` Array fields use a `_key` per row and the Zod schema allows `_key: z.string()` (or optional).
- `[VC-8]` `pnpm lint` + `pnpm typecheck` pass. Form submit handlers produce the right payload type from the
  schema.

## 10. Open Questions

- `[OQ-1]` Should `parseFormData` become explicit about which fields are JSON vs strings, to eliminate the
  literal-`null` footgun (`[C-3]`)?
- `[OQ-2]` Is there a shared "dialog form" helper that would let us retire the per-feature `getFormDialog`
  construction?
