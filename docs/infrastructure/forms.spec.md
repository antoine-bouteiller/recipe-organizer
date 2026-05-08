---
title: Forms Specification (TanStack Form + Zod + Base UI)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, forms, tanstack-form, zod, base-ui, validation]
---

# Introduction

This document specifies the forms infrastructure of the recipe-organizer application. The stack combines
`@tanstack/react-form` (state, validation, field-array support), Zod schemas reused from the matching server-function
file (single source of truth), and Base UI's `Form`/`Field` primitives (DOM-level error wiring, accessibility).
A single application form hook, `useAppForm`, packs every project field component and the submit button so feature
forms only deal with names, defaults, and a Zod schema. Reusable subforms use `withForm`. Two submit patterns are
supported: the page form (route component) and the dialog form (`getFormDialog`). File-bearing payloads round-trip
through `objectToFormData` / `parseFormData` so server functions can reuse the same Zod schema for both JSON and
multipart inputs.

## 1. Purpose & Scope

### 1.1 Purpose

Define the authoritative behavior, contracts, constraints, and acceptance criteria for:

- The `useAppForm` / `withForm` hook factory wired through `createFormHook` + `createFormHookContexts`.
- The catalog of field components registered in the hook (`TextField`, `NumberField`, `SelectField`,
  `ComboboxField`, `CheckboxField`, `ToggleGroupField`, `ImageField`, `VideoField`, `EditorField`) and the Base UI
  `Field` primitives also exposed (`Field`, `FieldControl`, `FieldDescription`, `FieldError`, `FieldLabel`).
- The `FormSubmit` form-component and the `<Form>` wrapper (Base UI) used by every form.
- Validation wiring (`revalidateLogic`, `onDynamic` Zod validator) and error projection
  (`formatFormErrors` -> `<Form errors={...}>`).
- Submission patterns: page forms (`/recipe/new`, `/recipe/edit/$id`) and dialog forms (`getFormDialog`).
- File-aware fields (`ImageField`, `VideoField`) backed by the custom `useFileUpload` hook and the
  `objectToFormData` / `parseFormData` round-trip.
- Dynamic field arrays via `<AppField mode="array">` (used for ingredient groups, ingredients, linked recipes).
- The `defaultValues` + `createFieldMap` convention shared between the form view and the route component.

### 1.2 In Scope

- `src/hooks/use-app-form.ts`, `src/hooks/use-form-context.ts`, `src/hooks/use-file-upload.ts`.
- `src/components/forms/*` (every field component + `FormSubmit`).
- `src/components/ui/form.tsx`, `src/components/ui/field.tsx` (Base UI wrappers).
- `src/components/dialogs/form-dialog.tsx` (`getFormDialog`).
- `src/utils/format-form-errors.ts`, `src/utils/form-data.ts`.
- Real-world wiring in `src/features/recipe/components/recipe-form.tsx`, `src/features/recipe/utils/form.ts`,
  `src/features/ingredients/components/ingredient-form.tsx`, and the `/recipe/new` and `/recipe/edit/$id` routes.

### 1.3 Out of Scope

- Server-side validation, error envelopes, and middleware composition (see `./server-functions.spec.md`).
- Mutation orchestration / cache invalidation (see `./client-state.spec.md`).
- Lexical editor internals (custom nodes, plugins) beyond the `EditorField` props contract.
- Image/video upload to R2 — handled by server functions called after `form.handleSubmit()`.
- Pure (non-form) UI primitives (Input, Select, Combobox, Checkbox, Toggle, NumberInput, Editor, Drawer, Dialog).

## 2. Definitions

| Term                      | Definition                                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| TanStack Form             | `@tanstack/react-form`. Provides `createFormHook`, `createFormHookContexts`, `useStore`, `revalidateLogic`, `createFieldMap`.                 |
| `useAppForm`              | The single application form hook, produced by `createFormHook(...)` in `src/hooks/use-app-form.ts`.                                           |
| `withForm`                | Companion factory from the same `createFormHook` call. Builds reusable subform components that consume an external `form` instance.           |
| Field components          | React components registered in `fieldComponents` of `createFormHook`. Each component reads `useFieldContext<T>()` internally.                 |
| Form components           | React components registered in `formComponents` of `createFormHook`. Currently only `FormSubmit`.                                             |
| `<Form>`                  | `src/components/ui/form.tsx` — wraps `@base-ui/react/form`. Accepts `errors: Record<string, string>` to broadcast field errors.               |
| `<Field>`                 | `src/components/ui/field.tsx` — wraps `@base-ui/react/field`'s `Root`/`Label`/`Control`/`Description`/`Error`/`Validity`.                     |
| `useFieldContext<T>`      | Hook from `createFormHookContexts` used inside field components to read `field.state.value`, `field.handleChange`, `field.state.meta.*`.      |
| `useFormContext`          | Hook from `createFormHookContexts` used inside form components (e.g. `FormSubmit`) to read `form.Subscribe`, `form.state`.                    |
| `revalidateLogic()`       | TanStack Form validation logic that revalidates each field after first submit/touch. Default for every form in the app.                       |
| `onDynamic`               | TanStack Form validator slot. The app uses `validators: { onDynamic: schema }` with the imported Zod schema.                                  |
| `formatFormErrors`        | `src/utils/format-form-errors.ts`. Reduces TanStack's `errors[0]` (`Record<string, StandardSchemaV1Issue[]>`) to `Record<string, string>`.    |
| `objectToFormData`        | `src/utils/form-data.ts`. Builds `FormData` from a values object: `File` -> raw entry, everything else -> JSON-stringified entry.             |
| `parseFormData`           | `src/utils/form-data.ts`. Inverse of `objectToFormData`: parses JSON-stringified entries back to objects/arrays; `File` entries pass through. |
| `useFileUpload`           | `src/hooks/use-file-upload.ts`. Custom hook used by `ImageField`/`VideoField` for drag/drop, paste-from-clipboard, preview URLs, validation.  |
| `FileMetadata`            | `{ id: string; url: string; name?: string; size?: number; type?: string }`. The "already uploaded" representation accepted by file fields.    |
| `getFormDialog`           | `src/components/dialogs/form-dialog.tsx`. Returns a `withForm(...)` component that renders a `ResponsiveDialog` around a form.                |
| `createFieldMap`          | TanStack Form helper. `recipeFormFields = createFieldMap(recipeDefaultValues)` — a typed map of field paths used by subforms.                 |
| `<AppField mode="array">` | The canonical pattern for dynamic field arrays. The render-prop receives a `field` with `pushValue`/`removeValue`/`state.value`.              |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements (REQ)

- **REQ-001** The application SHALL expose exactly one form hook factory at `src/hooks/use-app-form.ts`. It SHALL be
  built by passing `fieldContext` and `formContext` (from `createFormHookContexts`) to `createFormHook`, and SHALL
  export `useAppForm` and `withForm`. Feature code MUST NOT call `createFormHook` ad hoc.
- **REQ-002** `useAppForm` SHALL register the following field components, available under `form.AppField`'s
  render-prop second argument: `CheckboxField`, `ComboboxField`, `EditorField`, `Field`, `FieldControl`,
  `FieldDescription`, `FieldError`, `FieldLabel`, `ImageField`, `NumberField`, `SelectField`, `TextField`,
  `ToggleGroupField`, `VideoField`.
- **REQ-003** `useAppForm` SHALL register `FormSubmit` as a form component, accessible via `form.AppForm` >
  `form.FormSubmit`.
- **REQ-004** `EditorField` SHALL be lazy-loaded (`React.lazy`) and consumed under a `<Suspense>` boundary by callers
  that mount it in route bundles.
- **REQ-005** Every field component SHALL read its value/meta via `useFieldContext<T>()` and write via
  `field.handleChange(...)` (or `field.setValue(...)` when the underlying primitive cannot drive an event).
- **REQ-006** Every field component SHALL render a `<Field>` root (from `src/components/ui/field.tsx`) and pass
  `name={field.name}`, `dirty={field.state.meta.isDirty}`, `invalid={!field.state.meta.isValid}`,
  `touched={field.state.meta.isTouched}`. It SHALL render `<FieldError />` to surface the message.
- **REQ-007** Every form SHALL be wrapped in `<Form>` (`src/components/ui/form.tsx`). Page forms SHALL pass
  `errors={useStore(form.store, (state) => formatFormErrors(state.errors))}` so Base UI can broadcast errors to
  child fields keyed by `name`. The `<Form>` `onSubmit` handler SHALL call `event.preventDefault()` then
  `void form.handleSubmit()`.
- **REQ-008** Validation SHALL be configured per form with `validationLogic: revalidateLogic()` and
  `validators: { onDynamic: <zodSchema> }`. The Zod schema SHALL be the same one exported by the matching server
  function (e.g. `recipeSchema` exported from `src/features/recipe/api/create.ts`).
- **REQ-009** Each feature form SHALL declare a `defaultValues` constant whose type is `Partial<TFormInput>` (or
  `TFormInput` when every field is required) and SHALL derive `createFieldMap(defaultValues)` for subform consumption.
- **REQ-010** Reusable subforms SHALL be built with `withForm({ defaultValues, props, render })`. The `render`
  function receives `{ form, ...props }` and uses `form.AppField` / `form.Field` to compose fields. Subforms MUST
  NOT instantiate their own `form` via `useAppForm` — the parent owns the form instance.
- **REQ-011** Dynamic field arrays SHALL use `<AppField mode="array" name={path}>` with the render-prop
  `(field) => ...`. Items SHALL be added with `field.pushValue(item)` and removed with `field.removeValue(index)`.
  Each item SHOULD carry a stable client-side `_key` (random string) used as the React `key`, distinct from the
  database `id`.
- **REQ-012** `FormSubmit` (`src/components/forms/form-submit.tsx`) SHALL subscribe via `form.Subscribe` and SHALL
  disable the button while `isSubmitting` is true and render a `<Spinner />` next to its label. It SHALL only be
  rendered inside `<form.AppForm>...</form.AppForm>`.
- **REQ-013** The dialog submit pattern SHALL be implemented by `getFormDialog(defaultValues)`. The returned
  component SHALL render a `ResponsiveDialog` whose body is a `<Form>` calling `form.handleSubmit()` on submit. The
  dialog SHALL pass `errors` derived from `useStore(form.store, (s) => formatFormErrors(s.errors))` to `<Form>`.
- **REQ-014** Dialog forms SHALL reset on successful submission. The standard pattern is to call `form.reset()` and
  `setOpen(false)` from the mutation's `onSuccess` callback (see `src/features/ingredients/components/add-ingredient.tsx`).
- **REQ-015** `ImageField` and `VideoField` SHALL store `File | FileMetadata | undefined` in form state. They SHALL
  use `useFileUpload` configured with `multiple: false`, `maxFiles: 1`, and an optional `initialFiles=[initialImage]`
  / `[initialVideo]`. On change they SHALL call `field.setValue(newFiles[0]?.file)`.
- **REQ-016** `VideoField` SHALL set `accept: 'video/*'` and `maxSize: 100 MiB` (`100 * 1024 * 1024`) when calling
  `useFileUpload`.
- **REQ-017** When a form submission carries any `File`, the route SHALL serialize `value` with
  `objectToFormData(value)` and pass the resulting `FormData` to the mutation (`createRecipe({ data: formData })`).
  The matching server function SHALL parse with `parseFormData` and validate the result with the same Zod schema.
- **REQ-018** `EditorField` SHALL accept a `nodes?: readonly Klass<LexicalNode>[]` prop and an optional
  `extraToolbar` ReactNode so feature-specific nodes (e.g. recipe Magimix/Subrecipe) can be plugged in without
  forking the field component.
- **REQ-019** `formatFormErrors` SHALL operate on the first error map only (`errors[0]`) and SHALL keep the first
  message per path, returning `{}` when the input array is empty/undefined.
- **REQ-020** `<Form>` SHALL set the default layout class `flex w-full flex-col gap-4`. Dialog usages MAY override
  with `className="contents"` to inherit the dialog's grid (see `getFormDialog`).

### 3.2 Constraints (CON)

- **CON-001** A single `createFormHook` call lives at `src/hooks/use-app-form.ts`. Calling `createFormHook` elsewhere
  fragments the field registry and breaks the typed `form.AppField` tuple. New field components MUST be added there.
- **CON-002** Field components MUST read context via `useFieldContext` from `src/hooks/use-form-context.ts`. They
  MUST NOT accept `form` or `field` as props — that bypasses the hook factory's typing.
- **CON-003** `useAppForm` and `withForm` MUST share the same `fieldContext`/`formContext`. The contexts come from a
  single `createFormHookContexts()` call in `src/hooks/use-form-context.ts`.
- **CON-004** Field components produce only the field — no submit, no top-level layout. Submit is `FormSubmit` only.
- **CON-005** `<Form>` MUST wrap the form to receive Base UI errors. Plain `<form>` does not propagate the `errors`
  map to descendant `<Field>` roots.
- **CON-006** Validation is centralized in the Zod schema co-located with the server function. Forms MUST NOT
  duplicate field-level validators (`onChange`, `onBlur`) when `onDynamic` already covers the field.
- **CON-007** `parseFormData` JSON-decodes any string entry that parses successfully. Plain string fields therefore
  travel as JSON-stringified strings (e.g. `'"My recipe"'`), not raw strings. Server schemas MUST account for this
  by validating the parsed value, not the raw entry.
- **CON-008** `objectToFormData` skips `undefined` and `null` values entirely. Schemas that need to express
  "explicitly cleared" SHALL use a sentinel value other than `null`/`undefined` or rely on a server-side default.
- **CON-009** `useFileUpload`'s paste handler ignores paste events when the focused element is a `<textarea>` or has
  `contenteditable`. This is intentional — clipboard pastes inside the rich-text editor must not steal focus to a
  file field.
- **CON-010** `ComboboxField` is generic over `TValue extends number | string | undefined`. `null` is not a valid
  field value; `field.setValue(undefined)` is used to clear the selection.
- **CON-011** `ToggleGroupField` always renders in `multiple` mode and stores `string[]`. Single-select toggle UIs
  use `SelectField` instead.
- **CON-012** `SelectField` items are `{ label: string; value: string }`. Numeric or enum values MUST be cast to
  strings at the boundary.
- **CON-013** `<AppField mode="array">` `field.state.value` may be `undefined` when the form has not yet hydrated
  the array path. Render code MUST guard with `field.state.value?.map(...)`.
- **CON-014** Dialog forms cannot use `event.stopPropagation()` alone to prevent outer form submits — the dialog
  template already calls both `preventDefault` and `stopPropagation` so dialogs can be nested inside an outer page
  form (e.g. `AddIngredient` inside `RecipeForm`'s ingredient combobox).

### 3.3 Guidelines (GUD)

- **GUD-001** Reuse the server function's exported Zod schema and inferred input type. Do not redeclare the schema
  client-side.
- **GUD-002** Define `defaultValues` and `createFieldMap(defaultValues)` next to the schema (typically in
  `src/features/<feature>/utils/form.ts`). Pass `fields={...formFields}` and `form={form}` to subforms even if the
  subform does not yet consume the field map — the prop reserves the call site for future introspection.
- **GUD-003** Surface `isSubmitting` to disable individual fields by reading
  `useStore(form.store, (state) => state.isSubmitting)` once at the top of the subform and passing the boolean down.
- **GUD-004** Prefer `field.handleChange` for events that originate from a primitive's onChange. Use
  `field.setValue` for programmatic updates (e.g. clearing a combobox).
- **GUD-005** Use `_key: Math.random().toString(36).substring(7)` for client-side React keys in dynamic arrays. Do
  not key by database `id` — newly added rows have id `-1` until the server assigns one.
- **GUD-006** Lazy-load `EditorField` (already done in `useAppForm`); always wrap its consumption in `<Suspense>`
  with a sized fallback (e.g. `<Skeleton className="h-64 w-full" />`) to avoid layout shift on first render.
- **GUD-007** For file-bearing forms, build a `FileMetadata` from the loaded entity (`{ id, url }`) and pass it as
  `initialImage` / `initialVideo` so the field shows the existing asset and submits the same `{ id, url }` when the
  user does not change it.
- **GUD-008** Cancel/back buttons in page forms SHOULD honor `form.state.isSubmitting` to prevent navigating away
  mid-mutation. Dialog forms get this for free via `<ResponsiveDialogClose disabled={form.state.isSubmitting} />`.

### 3.4 Patterns (PAT)

- **PAT-001 (Field component skeleton)** `useFieldContext<T>()` -> `<Field name dirty invalid touched>` ->
  underlying primitive driven by `field.state.value` + `field.handleChange` -> `<FieldError />`. See `text-field.tsx`.
- **PAT-002 (Page form)** `const form = useAppForm({ defaultValues, onSubmit, validationLogic, validators })` ->
  `<Form errors={formatFormErrors(form.store)} onSubmit={(e) => { e.preventDefault(); void form.handleSubmit() }}>`
  -> `<Subform form={form} fields={formFields} />` -> `<form.AppForm><form.FormSubmit label=... /></form.AppForm>`.
- **PAT-003 (Dialog form)** `const FormDialog = getFormDialog(defaultValues)` -> in the consumer call
  `useAppForm(...)` and reset on `onSuccess` -> render `<FormDialog form={form} open setOpen submitLabel title trigger>`.
- **PAT-004 (Subform)** `withForm({ defaultValues, props, render: ({ form, ...props }) => ... })`. Inside `render`,
  destructure `const { AppField, Field } = form` and use `<AppField name="...">{({ TextField }) => ...}</AppField>`.
- **PAT-005 (Dynamic array)** `<AppField mode="array" name="path">{(field) => field.state.value?.map(...) +
Add/Remove buttons that call field.pushValue / field.removeValue}</AppField>`.
- **PAT-006 (File-bearing submit)** `const formData = objectToFormData(value); await mutate({ data: formData })` on
  the client; `inputValidator((fd: FormData) => schema.parse(parseFormData(fd)))` on the server.
- **PAT-007 (Error projection)** `const errors = useStore(form.store, (s) => formatFormErrors(s.errors))` ->
  `<Form errors={errors}>`. Base UI matches each `errors[name]` to the matching `<Field name>` and renders it via
  `<FieldError />`.

## 4. Interfaces & Data Contracts

### 4.1 Field Component Catalog

| Component          | Field value type                | Underlying primitive (Base UI / project)                                        | Key props                                                                                                                                       |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `TextField`        | `string`                        | `Input` (`components/ui/input`)                                                 | `label?`, `placeholder?`, `disabled?`, `className?`                                                                                             |
| `NumberField`      | `number \| undefined`           | `NumberInput*` (`components/ui/number-input`)                                   | `label?`, `placeholder?`, `min?`, `max?`, `allowDecimals?` (default `false`, step `0.25` when `true`), `disabled?`                              |
| `SelectField`      | `string \| undefined`           | `Select*` (`components/ui/select`, Base UI Select)                              | `items: { label: string; value: string }[]`, `label?`, `disabled?`                                                                              |
| `ComboboxField`    | `number \| string \| undefined` | `Combobox*` (desktop) / `Drawer*` (mobile)                                      | `options: Option<TValue>[]`, `addNew?: (input: string) => ReactNode`, `label?`, `placeholder?`, `searchPlaceholder?`, `disabled?`, `className?` |
| `CheckboxField`    | `boolean`                       | `Checkbox` (`components/ui/checkbox`)                                           | `label?`, `disabled?`, `className?`                                                                                                             |
| `ToggleGroupField` | `string[]`                      | `ToggleGroup` + `Toggle` (`components/ui/toggle-group`, multi)                  | `items: { label: string; value: string }[]`, `label?`, `disabled?`, `className?`                                                                |
| `ImageField`       | `File \| FileMetadata`          | Native `<input type="file">` via `useFileUpload`                                | `label`, `initialImage?: FileMetadata`, `disabled?`                                                                                             |
| `VideoField`       | `File \| FileMetadata`          | Native `<input type="file" accept="video/*">` via `useFileUpload` (max 100 MiB) | `label`, `initialVideo?: FileMetadata`, `disabled?`                                                                                             |
| `EditorField`      | `string` (Lexical JSON)         | Lexical `Editor` (`components/ui/editor`, lazy)                                 | `label?`, `nodes?: readonly Klass<LexicalNode>[]`, `extraToolbar?: ReactNode`, `disabled?`                                                      |

Base UI Field primitives also exposed under `form.AppField`'s second argument (passthroughs from
`@base-ui/react/field`):

| Component          | Purpose                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `Field`            | Field root. Accepts `name`, `dirty`, `invalid`, `touched`, `className`, `data-slot="field"`. |
| `FieldLabel`       | Label slot. Default classes set medium font, base/sm size.                                   |
| `FieldControl`     | Native control slot (e.g. hidden `<input type="file" />` inside `ImageField`).               |
| `FieldDescription` | Helper text slot.                                                                            |
| `FieldError`       | Error message slot. Reads from `<Form errors>` keyed by the field's `name`.                  |

### 4.2 `useAppForm` / `withForm`

```
// src/hooks/use-app-form.ts
const { useAppForm, withForm } = createFormHook({
  fieldComponents: { CheckboxField, ComboboxField, EditorField, Field, FieldControl,
    FieldDescription, FieldError, FieldLabel, ImageField, NumberField, SelectField,
    TextField, ToggleGroupField, VideoField },
  fieldContext,                  // from createFormHookContexts()
  formComponents: { FormSubmit },
  formContext,                   // from createFormHookContexts()
})
```

Caller surface:

| API                                          | Shape                                                                                              |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `useAppForm(options)`                        | TanStack `useForm` enriched with `AppField`, `Field`, `AppForm`, `FormSubmit`, `Subscribe`, etc.   |
| `withForm({ defaultValues, props, render })` | Returns a React component `(props & { form }) => JSX`. Used for both subforms and `getFormDialog`. |

### 4.3 `<Form>` and `<Field>` (Base UI wrappers)

| Wrapper            | Source                               | Notes                                                                                 |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `Form`             | `@base-ui/react/form`                | Class default `flex w-full flex-col gap-4`. Accepts `errors: Record<string, string>`. |
| `Field` (Root)     | `@base-ui/react/field` `Root`        | Class default `flex flex-col items-start gap-2 w-full`.                               |
| `FieldLabel`       | `@base-ui/react/field` `Label`       | Cursor pointer when wrapping a Checkbox.                                              |
| `FieldControl`     | `@base-ui/react/field` `Control`     | Re-export, no class default.                                                          |
| `FieldItem`        | `@base-ui/react/field` `Item`        | Class default `flex`.                                                                 |
| `FieldDescription` | `@base-ui/react/field` `Description` | Muted helper text.                                                                    |
| `FieldError`       | `@base-ui/react/field` `Error`       | Destructive text.                                                                     |
| `FieldValidity`    | `@base-ui/react/field` `Validity`    | Re-export.                                                                            |

### 4.4 Validation / Error Projection

```
// /recipe/new
const form = useAppForm({
  defaultValues: recipeDefaultValues,
  onSubmit: async ({ value }) => { ... },
  validationLogic: revalidateLogic(),
  validators: { onDynamic: recipeSchema },           // Zod schema from features/recipe/api/create.ts
})

const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

return (
  <Form errors={errors} onSubmit={(e) => { e.preventDefault(); void form.handleSubmit() }}>
    ...
  </Form>
)
```

`formatFormErrors` (`src/utils/format-form-errors.ts`):

```
export const formatFormErrors = (
  errors: (Record<string, StandardSchemaV1Issue[]> | undefined)[],
): Record<string, string> => {
  if (!errors?.length) return {}
  return Object.entries(errors[0] ?? {}).reduce<Record<string, string>>((acc, [key, [first]]) => {
    if (typeof key === 'string' && !acc[key]) acc[key] = first.message
    return acc
  }, {})
}
```

### 4.5 File Upload Round-Trip

`objectToFormData` / `parseFormData` (`src/utils/form-data.ts`):

```
// client
const formData = new FormData()
for (const [key, value] of Object.entries(object)) {
  if (value instanceof File) formData.append(key, value)
  else if (value !== undefined && value !== null) formData.append(key, JSON.stringify(value))
}

// server
for (const [key, value] of formData.entries()) {
  data[key] = typeof value === 'string' && isJsonString(value) ? JSON.parse(value) : value
}
```

Server function pattern (matches `src/features/recipe/api/create.ts`):

```
.inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
```

Schema unions for file fields (`File | FileMetadata`):

```
image: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })])
video: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]).optional()
```

### 4.6 `useFileUpload` Contract

```
// src/hooks/use-file-upload.ts
const [{ files, isDragging, errors }, { addFiles, clearFiles, removeFile,
  getInputProps, handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
  handleFileChange, openFileDialog, clearErrors }] = useFileUpload({
  accept?: string                  // default '*'
  initialFiles?: FileMetadata[]    // default []
  maxFiles?: number                // default Infinity (only honored when multiple)
  maxSize?: number                 // bytes, default Infinity
  multiple?: boolean               // default false
  onFilesAdded?(files): void
  onFilesChange?(files): void
})
```

Behavior summary:

- Single-mode (`multiple: false`) replaces existing files on each add and exposes `files[0]?.preview`.
- Object URLs are revoked on `removeFile` / `clearFiles` for image-typed files.
- Document-level `paste` listener forwards image paste to `addFiles`; if the clipboard text is an image URL on a
  recognized host (`imgur`, `unsplash`, `pexels`) or ends in `.jpg/.jpeg/.png/.gif/.webp/.svg`, it is fetched and
  added.
- `getInputProps()` returns props for a hidden `<input type="file">` (rendered via `<FieldControl className="hidden" type="file" {...getInputProps()} />`).

### 4.7 `getFormDialog` Contract

```
// src/components/dialogs/form-dialog.tsx
export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: {} as {
      children: ReactNode
      open: boolean
      setOpen: (open: boolean) => void
      submitLabel: string
      title: string
      trigger: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
    },
    render: function Render({ form, children, open, setOpen, submitLabel, title, trigger }) {
      const errors = useStore(form.store, (s) => formatFormErrors(s.errors))
      // <ResponsiveDialog> ... <Form errors={errors} onSubmit={...}>{children}<form.AppForm><form.FormSubmit /></form.AppForm></Form>
    },
  })
```

Submit handler inside the dialog:

```
onSubmit: async (event) => {
  event.preventDefault()
  event.stopPropagation()    // guards nested forms (e.g. AddIngredient inside RecipeForm)
  await form.handleSubmit()
}
```

### 4.8 `FormSubmit`

```
// src/components/forms/form-submit.tsx
export const FormSubmit = ({ label }: { label: string }) => {
  const form = useFormContext()
  return (
    <form.Subscribe>
      {({ isSubmitting }) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
```

Always rendered inside `<form.AppForm>...</form.AppForm>` to gain access to the typed `form` context.

### 4.9 `defaultValues` + `createFieldMap` Convention

```
// src/features/recipe/utils/form.ts
import { createFieldMap } from '@tanstack/react-form'
import { type RecipeFormInput } from '../api/create'

export const recipeDefaultValues: Partial<RecipeFormInput> = { ... }
export const recipeFormFields = createFieldMap(recipeDefaultValues)
```

The route imports both, passes `defaultValues` to `useAppForm` and `fields={recipeFormFields}` to the subform.

## 5. Acceptance Criteria

### 5.1 Hook Factory

- **AC-001** Importing `useAppForm` from `@/hooks/use-app-form` exposes the field components listed in REQ-002 via
  the second argument of an `<AppField>` render-prop.
- **AC-002** Importing `withForm` from `@/hooks/use-app-form` returns components whose `render` receives a typed
  `form` instance and whose props are merged from the `props` placeholder.

### 5.2 Field Components

- **AC-003** Each field component renders a `<Field name>` root that propagates `dirty`, `invalid`, and `touched`
  data attributes consistent with `field.state.meta`.
- **AC-004** When the user edits a `TextField` and the corresponding Zod check fails on `onDynamic`, the
  `<FieldError />` slot displays the first Zod issue message after the field is touched.
- **AC-005** `NumberField` with `allowDecimals: true` advances by `0.25` per increment; with `allowDecimals: false`
  (default) it advances by `1`.
- **AC-006** `ComboboxField` renders the desktop popup on viewports above the mobile breakpoint and the bottom
  drawer otherwise (`useIsMobile`).
- **AC-007** Selecting a previously-selected `ComboboxField` option clears the field (`field.setValue(undefined)`).
- **AC-008** `ImageField` accepts a clipboard paste of an image and writes the resulting `File` to form state. It
  also accepts an image URL paste from a recognized host (imgur/unsplash/pexels) and fetches it.
- **AC-009** `VideoField` rejects files exceeding 100 MiB with an inline error.
- **AC-010** `EditorField` is loaded only when the route bundle reaches the `<Suspense>` boundary (no eager import
  in the `useAppForm` module's main chunk).

### 5.3 Validation & Errors

- **AC-011** A form configured with `validators: { onDynamic: schema }` and `validationLogic: revalidateLogic()`
  displays a field error on first submit attempt and re-validates on subsequent edits.
- **AC-012** `formatFormErrors` returns `{}` when `form.store.state.errors` is empty.
- **AC-013** When two issues exist on the same path, only the first is surfaced (kept-first behavior).
- **AC-014** `<Form errors={errors}>` propagates `errors[name]` to the matching `<Field name>` so `<FieldError />`
  renders even for fields that have not yet been touched.

### 5.4 Submission Patterns

- **AC-015** Page form: `/recipe/new` renders `<Form>` -> `<RecipeForm>` -> `<form.AppForm><form.FormSubmit /></form.AppForm>`.
  Submitting calls `objectToFormData(value)` then `createRecipe({ data: formData })` and navigates to `/`.
- **AC-016** Page form: `/recipe/edit/$id` hydrates `defaultValues` from the recipe payload (mapping image/video
  to `FileMetadata`) and on submit calls `updateRecipe({ data: objectToFormData(value) })` then `router.history.back()`.
- **AC-017** Dialog form: `AddIngredient` renders `getFormDialog(ingredientDefaultValues)` with an `IngredientForm`
  body. On `onSuccess`, the form resets and the dialog closes.
- **AC-018** Submitting a dialog form does not bubble to an enclosing page form (the dialog's submit handler calls
  both `preventDefault` and `stopPropagation`).

### 5.5 Dynamic Arrays

- **AC-019** `<AppField mode="array" name="ingredientGroups">` exposes `field.pushValue` and `field.removeValue`.
  Pushing a new group appends `{ _key, groupName: undefined, ingredients: [] }`; removing the group at index 0 is
  not offered in UI (group 0 is the implicit default).
- **AC-020** `<AppField mode="array" name="linkedRecipes">` allows adding `{ id: -1, ratio: 1 }` entries; each row
  exposes a `ComboboxField` for the recipe id and a `NumberField` for the ratio.
- **AC-021** Removing an item via `field.removeValue(index)` removes the matching React subtree without losing
  state of sibling rows.

### 5.6 File Round-Trip

- **AC-022** `objectToFormData({ name: 'a', image: file, count: 2, missing: undefined, blank: null })` produces a
  `FormData` with three entries: `name = "\"a\""`, `image = <File>`, `count = "2"`. `missing` and `blank` are absent.
- **AC-023** `parseFormData(formData)` round-trips: JSON-stringified entries are parsed back to their original
  scalar/object values; `File` entries are returned as `File`.

### 5.7 `FormSubmit`

- **AC-024** Clicking `<form.FormSubmit label="...">` triggers the parent `<Form onSubmit>`. While `isSubmitting`
  is true, the button is disabled and shows a spinner.

## 6. Test Automation Strategy

### 6.1 Test Levels

- **Unit (Vitest via `vp test`)**:
  - `formatFormErrors`: empty array, single issue, multiple issues per path, multiple paths.
  - `objectToFormData` / `parseFormData`: round-trip with `File`, primitives, nested objects, arrays, `null`/`undefined`.
  - `useFileUpload`: addFiles validates `maxSize` and `accept`; removeFile revokes object URLs for images; paste of
    an image URL fetches and adds; multiple-mode dedupes by `name`+`size`; single-mode replaces previous entries.
- **Component (Vitest + Testing Library)**:
  - Render each field component inside a stub form built from `useAppForm`. Drive it through valid/invalid Zod
    inputs; assert `<FieldError />` text and the `data-invalid` attribute on the `<Field>` root.
  - `FormSubmit` renders `<Spinner>` and `disabled` while `form.state.isSubmitting === true`.
- **Integration**:
  - Page form (`/recipe/new`): mount with mocked `createRecipe`. Submit valid + invalid payloads; assert
    `<Form errors>` propagates issues and the mutation is called with `FormData` carrying `image` as a `File` and
    `ingredientGroups` as a JSON-stringified entry.
  - Dialog form (`AddIngredient`): mount, submit, assert `form.reset()` and `setOpen(false)` ran on `onSuccess`.
  - Dynamic array: programmatically push/remove ingredient rows; assert `state.values.ingredientGroups[i].ingredients`
    matches expectations and that React keys are stable.

### 6.2 Test Doubles

- Mock the matching server function module (`createRecipe`, `updateRecipe`, `createIngredient`) at the module level
  with `vi.mock` so the schema parse runs against `parseFormData(formData)` while the network call is stubbed.
- Provide a deterministic `Math.random` shim to stabilize `_key` values in snapshots.

### 6.3 CI Gates

- `vp check` (oxfmt + oxlint + tsc).
- `vp test` for `src/components/forms/**`, `src/utils/format-form-errors.test.ts`, `src/utils/form-data.test.ts`,
  `src/hooks/use-file-upload.test.ts`, and feature-form integration suites under `src/features/*/components/__tests__`.

### 6.4 Coverage Target

- Lines/branches >= 90% for `src/components/forms/**`, `src/utils/format-form-errors.ts`, `src/utils/form-data.ts`,
  `src/hooks/use-file-upload.ts`, `src/components/dialogs/form-dialog.tsx`.

## 7. Rationale & Context

- **Single hook factory.** `createFormHook` is invoked exactly once so every form receives the same field registry
  and the same field/form contexts. This keeps `<AppField>`'s render-prop tuple typed and prevents "stranger
  context" bugs where a field component instantiated under one provider sees `undefined` from another.
- **Field components own the primitive wiring.** Centralizing `useFieldContext` access inside each component means
  feature code never touches the form store. This protects the schema layer (Zod) as the only place where field
  shape is defined.
- **Errors via Base UI broadcast.** TanStack Form's `state.errors` is a list of issue maps. Reducing it to
  `Record<string, string>` and feeding it to `<Form errors>` lets Base UI handle DOM wiring (`aria-describedby`,
  visibility) without per-field error props. `formatFormErrors` keeps only the first issue because surfacing every
  Zod issue per path produces noisy UIs.
- **Single Zod schema.** Both client and server validate the same payload. The server function defines the schema
  (it is the contract owner) and the form imports it. Adding a `client.ts` schema would force a duplicate.
- **`onDynamic` instead of per-field `onChange`/`onBlur`.** TanStack's `onDynamic` slot validates the entire
  schema on every change (after first touch via `revalidateLogic`). Per-field validators would re-implement the
  cross-field constraints already encoded in the Zod schema (e.g. `linkedRecipes[].id >= 0`).
- **`File` in form state.** Storing a raw `File` (or its `FileMetadata` placeholder) avoids a pre-upload step and
  defers R2 writes to the server function, where errors can be handled inside the same transaction.
- **`objectToFormData` / `parseFormData`.** Forms with files cannot use `application/json`. Round-tripping all
  non-File values as JSON-stringified entries lets the server function reuse a single Zod schema for both nested
  arrays/objects and raw scalars without reconstructing types from form-encoded keys.
- **Dialog form pattern (`getFormDialog`).** Most "Add X" / "Edit X" flows are short enough to reuse a single
  template. Implementing it as a `withForm` factory keeps the dialog typed against the caller's `defaultValues`
  while isolating the dialog chrome (header, panel, footer, close button) from feature code.
- **`createFieldMap`.** Storing a typed map of field paths next to `defaultValues` is the foundation for upcoming
  features (autosave, dirty-field diffing) and currently documents the form shape at a glance.

## 8. Dependencies & External Integrations

### 8.1 Internal

- `@/hooks/use-form-context` (`fieldContext`, `formContext`, `useFieldContext`, `useFormContext`).
- `@/hooks/use-file-upload` (`useFileUpload`, `FileMetadata`).
- `@/components/ui/{form,field,input,number-input,select,combobox,checkbox,toggle-group,editor,toolbar,kbd,spinner,button,separator,skeleton,drawer,responsive-dialog}`.
- `@/utils/format-form-errors`, `@/utils/form-data`, `@/utils/cn`.
- Server-function modules supplying schemas: `src/features/recipe/api/create.ts`, `src/features/recipe/api/update.ts`,
  `src/features/ingredients/api/create.ts`, etc.
- Feature `defaultValues` + `createFieldMap` modules: `src/features/<feature>/utils/form.ts`.

### 8.2 External

- `@tanstack/react-form` (`createFormHook`, `createFormHookContexts`, `useStore`, `revalidateLogic`,
  `createFieldMap`, `withForm`, `StandardSchemaV1Issue`).
- `@base-ui/react/form`, `@base-ui/react/field`.
- `zod` (schemas authored alongside server functions).
- `lexical` (typed `Klass<LexicalNode>` for `EditorField` `nodes` prop).
- `@phosphor-icons/react` (icons inside `ImageField`, `VideoField`, `EditorField` toolbar, dynamic-array buttons).
- `@tanstack/react-router` (route components consuming the page-form pattern).

## 9. Examples & Edge Cases

### 9.1 Building a New Form (Canonical Recipe)

1. **Define the Zod schema in the server-function file** (e.g. `src/features/<feature>/api/create.ts`):
   ```
   export const fooSchema = z.object({ name: z.string().min(2), count: z.number().min(0) })
   export type FooFormInput = z.infer<typeof fooSchema>
   ```
2. **Define `defaultValues` and `createFieldMap`** (e.g. `src/features/<feature>/utils/form.ts`):
   ```
   export const fooDefaultValues: FooFormInput = { name: '', count: 0 }
   export const fooFormFields = createFieldMap(fooDefaultValues)
   ```
3. **Build a `withForm` view** (`src/features/<feature>/components/foo-form.tsx`):
   ```
   export const FooForm = withForm({
     defaultValues: fooDefaultValues,
     props: {} as Record<string, unknown>,
     render: function Render({ form }) {
       const { AppField } = form
       return (
         <>
           <AppField name="name">{({ TextField }) => <TextField label="Nom" />}</AppField>
           <AppField name="count">{({ NumberField }) => <NumberField label="Nombre" min={0} />}</AppField>
         </>
       )
     },
   })
   ```
4. **Pick a submit pattern**:
   - **Page form** — instantiate `useAppForm` in the route, wrap in `<Form errors={...}>`, render `<FooForm />`,
     mount `<form.AppForm><form.FormSubmit label="..." /></form.AppForm>`.
   - **Dialog form** — `const FormDialog = getFormDialog(fooDefaultValues)`. In the consumer call `useAppForm(...)`,
     reset on `onSuccess`, render `<FormDialog form={form} open setOpen submitLabel title trigger><FooForm form={form} /></FormDialog>`.
5. **Pipe errors via `formatFormErrors`** — `const errors = useStore(form.store, (s) => formatFormErrors(s.errors))`,
   pass `errors` to `<Form>`. The Base UI `<Form>` broadcasts each entry to the matching `<Field name>` and its
   `<FieldError />` slot.

### 9.2 Page Form (`/recipe/new`)

```
const form = useAppForm({
  defaultValues: recipeDefaultValues,
  onSubmit: async ({ value }) => {
    const formData = objectToFormData(value)
    await createRecipe({ data: formData })
    await router.navigate({ to: '/' })
  },
  validationLogic: revalidateLogic(),
  validators: { onDynamic: recipeSchema },
})

const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

return (
  <Form className="p-4" errors={errors} noValidate
        onSubmit={(e) => { e.preventDefault(); void form.handleSubmit() }}>
    <RecipeForm fields={recipeFormFields} form={form} />
    <form.AppForm><form.FormSubmit label="Créer la recette" /></form.AppForm>
  </Form>
)
```

### 9.3 Dialog Form (`AddIngredient`)

```
const FormDialog = getFormDialog(ingredientDefaultValues)

const form = useAppForm({
  defaultValues: { ...ingredientDefaultValues, name: defaultValue ?? '' } as IngredientFormInput,
  onSubmit: async ({ value }) => {
    await createMutation.mutateAsync(
      { data: ingredientSchema.parse(value) },
      { onSuccess: () => { form.reset(); setOpen(false) } }
    )
  },
  validationLogic: revalidateLogic(),
  validators: { onDynamic: ingredientSchema },
})

return (
  <FormDialog form={form} open={open} setOpen={setOpen}
              submitLabel="Ajouter" title="Ajouter un ingrédient" trigger={children}>
    <IngredientForm form={form} />
  </FormDialog>
)
```

### 9.4 Dynamic Field Array

```
<AppField mode="array" name="linkedRecipes">
  {(field) => (
    <>
      {field.state.value?.map((linkedRecipe, index) => (
        <div className="flex gap-2" key={linkedRecipe.id}>
          <AppField name={`linkedRecipes[${index}].id`}>
            {({ ComboboxField }) => <ComboboxField options={recipeOptions} ... />}
          </AppField>
          <AppField name={`linkedRecipes[${index}].ratio`}>
            {({ NumberField }) => <NumberField min={0} placeholder="Ratio" />}
          </AppField>
          <Button onClick={() => field.removeValue(index)} variant="destructive-outline">
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button onClick={() => field.pushValue({ id: -1, ratio: 1 })}>
        Ajouter <PlusIcon />
      </Button>
    </>
  )}
</AppField>
```

### 9.5 File-Aware Field Schema

```
image: z.union([
  z.instanceof(File),
  z.object({ id: z.string(), url: z.string() }),
])
```

The server function checks `image instanceof File` to decide between `uploadFile(image)` (new upload) and reusing
the existing `image.id` (no change).

### 9.6 Edge Cases

- **Stale `image.url` after R2 key rotation**: The `FileMetadata` carries `id = url` for D1 rows where image and key
  are identical. After a key rotation the `url` may 404; the form still submits the same `id`, so the server
  reads/serves the stored row regardless of the broken preview.
- **Combobox value cleared on re-select**: Selecting the currently selected option calls `field.setValue(undefined)`.
  This is intentional — clicking the active row clears the selection.
- **Paste handler inside `<EditorField>`**: `useFileUpload` skips paste events when a `<textarea>` or
  `contenteditable` element is focused, so pasting inside the rich-text editor never grabs files for the
  `ImageField`.
- **`undefined` array path**: `field.state.value` for an `<AppField mode="array">` may be `undefined`. Always guard
  with `?.map(...)`.
- **Numeric ids in dynamic arrays**: New rows use `id: -1` until persisted; React keys MUST come from a separate
  client-side `_key` to avoid duplicate-key warnings while the user adds two new rows in a row.
- **Lazy editor + SSR**: `EditorField` is `React.lazy`; the route SSR pass renders the `<Suspense>` fallback. Ensure
  the fallback is sized (e.g. `Skeleton h-64`) to match post-hydration height.
- **`null` vs `undefined`**: `objectToFormData` skips both. To express "explicitly null" on the wire, use a sentinel
  string (e.g. `"__null__"`) and have the schema map it back; otherwise rely on server-side defaults.

## 10. Validation Criteria

- **VAL-001** Every requirement in section 3.1 (REQ-001..020) and constraint in 3.2 (CON-001..014) has at least one
  acceptance criterion in section 5 and at least one automated test in section 6.
- **VAL-002** `vp check` (oxfmt + oxlint + tsc) passes.
- **VAL-003** `vp test` passes for the suites listed in 6.3.
- **VAL-004** `createFormHook` is invoked in exactly one location: `src/hooks/use-app-form.ts`. Static check:
  `grep -r "createFormHook(" src` returns one hit.
- **VAL-005** `createFormHookContexts` is invoked in exactly one location: `src/hooks/use-form-context.ts`.
- **VAL-006** No field component imports `useForm`, `createFormHook`, or `useStore` from `@tanstack/react-form`
  directly to read field state — only `useFieldContext` from `@/hooks/use-form-context`.
- **VAL-007** Every form schema imported by a feature form is the exact identifier exported by the matching server
  function file. Static check: each `useAppForm({ validators: { onDynamic: X } })` import resolves to an
  `src/features/*/api/*.ts` module.
- **VAL-008** Manual verification:
  1. Create a recipe with image + video, ingredient groups, and linked recipes -> server receives `FormData` with
     `image`/`video` as `File` and the rest JSON-encoded.
  2. Edit an existing recipe without changing the image -> `image` round-trips as `{ id, url }`; server skips the
     R2 upload.
  3. Add an ingredient via the inline `AddIngredient` dialog from inside the recipe form -> the inner submit does
     not bubble to the recipe page form.
  4. Submit a recipe with an empty `name` -> the `name` field shows the Zod issue immediately on submit, and
     subsequent edits revalidate.

## 11. Related Specifications / Further Reading

- [Server Functions infrastructure](./server-functions.spec.md)
- [Client State Layering](./client-state.spec.md)
- [Architecture overview](../architecture.spec.md)
- [Recipe feature spec](../../src/features/recipe/spec/index.spec.md)
- [Ingredients feature spec](../../src/features/ingredients/ingredients.spec.md)
- TanStack Form docs: https://tanstack.com/form/latest
- Base UI Form & Field: https://base-ui.com/react/components/form, https://base-ui.com/react/components/field
- Zod docs: https://zod.dev
