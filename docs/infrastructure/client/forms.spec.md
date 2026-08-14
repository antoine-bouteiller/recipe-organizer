---
title: Forms
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/client/client.spec.md
related:
  [
    docs/infrastructure/client/routing-ssr.spec.md,
    docs/infrastructure/client/client-state.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
  ]
---

## 2. Problem Statement

Recipe editing and administration need consistent controls, accessible validation feedback, and a
payload shape that accepts both structured values and files. A shared form boundary prevents each
feature from independently composing field state, error presentation, and submission mechanics.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                         | Rationale                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Form composition    | `useAppForm` and `withForm` are the only application form factories                            | One registry gives all features the same typed fields and form context; the registry is defined in `src/hooks/use-app-form.ts:18-42`. |
| `[KD-2]` Validation contract | Forms use the input schema owned by the corresponding server function                          | Shared shape detects input problems promptly while the Worker remains the trust boundary, refining `client.spec.md` `[PI-3]`.         |
| `[KD-3]` Error projection    | TanStack Form errors are projected into Base UI Form and Field primitives                      | Controls receive consistent field-level accessibility and presentation without feature-specific error plumbing.                       |
| `[KD-4]` File transport      | A values object serialises files as multipart entries and other present values as JSON entries | Multipart carries binary data while JSON preserves nested values for the same server input contract (`src/utils/form-data.ts:1-28`).  |

## 4. Principles & Intents

- `[PI-1]` **One form vocabulary** — refine `client.spec.md` `[PI-3]`: feature forms compose
  registered fields rather than owning form-framework setup.
- `[PI-2]` **Validation is informative, not authoritative** — client errors guide users; server
  functions validate all writes under `../../architecture.spec.md` `[PI-3]`.
- `[PI-3]` **Fields own control wiring** — a field translates its framework context into a UI
  primitive and error slot, keeping feature views declarative.

## 5. Non-Goals

- `[NG-1]` Client-side authorization or persistence of submitted server records; this refines
  `client.spec.md` `[KD-2]`.
- `[NG-2]` A separate schema language for the browser.
- `[NG-3]` Rich-text editor node design; the editor field accepts feature node configuration only.

## 6. Caveats

- `[C-1]` `FormData` omits `undefined` and `null`; an input contract that distinguishes an explicit
  clearing value represents it directly rather than relying on an absent entry (`src/utils/form-data.ts:1-10`).
- `[C-2]` File previews use browser resources and upload acceptance is a user-experience check;
  server validation and storage controls remain required.
- `[C-3]` Nested dialog forms stop submit propagation because a dialog can render within a page
  form (`src/components/dialogs/form-dialog.tsx:29-40`).

## 7. High-Level Components

| Component         | Module type                              | Responsibility                                      | Public API surface                  |
| ----------------- | ---------------------------------------- | --------------------------------------------------- | ----------------------------------- |
| Form factory      | `src/hooks/use-app-form.ts`              | Register fields and form components                 | `useAppForm`, `withForm`            |
| Field components  | `src/components/forms/*`                 | Bind a typed field value to a UI control            | registered `*Field` components      |
| UI wrappers       | `src/components/ui/{form,field}.tsx`     | Associate errors, labels, controls, and messages    | `Form`, `Field`, error slots        |
| File adapter      | `src/hooks/use-file-upload.ts`           | Select, validate, preview, and remove browser files | `useFileUpload`, `FileMetadata`     |
| Dialog adapter    | `src/components/dialogs/form-dialog.tsx` | Place a shared form inside dialog chrome            | `getFormDialog()`                   |
| Transport helpers | `src/utils/form-data.ts`                 | Convert values to and from multipart payloads       | `objectToFormData`, `parseFormData` |

## 8. Detailed Design

### 8.1 Factory and field contract

`useAppForm(options)` returns a form with `AppField`, `AppForm`, and `FormSubmit`; `withForm(config)`
produces a typed reusable form view. The registry includes text, numeric, selection, toggle, file,
and editor fields plus Base UI field slots (`src/hooks/use-app-form.ts:18-40`). A field reads its
value and metadata from field context, updates through the field handler, and renders a named Field
with an error slot; the text implementation demonstrates that boundary (`src/components/forms/text-field.tsx:10-25`).

Feature forms provide typed defaults, a server-owned schema, submit behavior, and reusable child
views. Dynamic collections use the form array-field surface; each row carries a stable browser key
separate from any persisted identifier.

### 8.2 Validation and submission

Forms apply their schema through TanStack Form revalidation and project the first error per path to
`Form errors`. Page submission prevents browser navigation and invokes `form.handleSubmit()`. A
dialog produced by `getFormDialog(defaultValues)` selects errors from form state, disables cancel
while submitting, stops propagation, and supplies its typed submit component
(`src/components/dialogs/form-dialog.tsx:18-54`).

The submit contract is `values -> FormData -> server parser -> schema`. `objectToFormData` appends a
raw `File` and JSON-stringifies other present values; `parseFormData` restores parseable string
entries before server validation (`src/utils/form-data.ts:1-28`). File fields hold either a browser
`File` or `{ id, url }` metadata so an unchanged asset retains its reference.

### 8.3 Field value and UI contract

Every registered field receives its value from form context and reports a value through the matching
field handler. The standard field shape is a named Field root, optional label and description,
control, and FieldError. The root receives dirty, touched, and invalid metadata so Base UI associates
its visual and accessibility state with the same field name. Text fields, number fields, selects,
comboboxes, checkboxes, and toggle groups differ only in the value/control translation.

| Field family             | State value                  | Contract boundary                                                          |
| ------------------------ | ---------------------------- | -------------------------------------------------------------------------- |
| Text and editor          | `string`                     | Control reports textual value; editor receives feature node configuration. |
| Numeric and selection    | number or string value       | UI conversion happens at the field boundary.                               |
| Boolean and multi-select | boolean or string collection | Field preserves the schema's collection shape.                             |
| Image and video          | `File                        | FileMetadata                                                               | undefined` | Selection exposes a browser file or an unchanged asset reference. |
| Array field              | collection of typed items    | Parent form owns add, remove, and stable browser keys.                     |

The editor field is lazy in the registry (`src/hooks/use-app-form.ts:16-33`). A screen placing it in
the form provides a suspense boundary sized for the editor region, so editor loading does not change
the form's structural contract.

### 8.4 Reusable form views and arrays

A feature declares defaults that describe its input shape, then uses `withForm` for a reusable view
that receives the parent form instance. The view uses only its assigned field paths; it does not
instantiate a nested form. This permits the same fields in a page form and a dialog while preserving
one submission lifecycle.

An array field represents a collection whose rows can be inserted and removed before submission.
Each unsaved row has a browser-stable key distinct from a database identifier. The collection value
remains optional until its defaults establish it, so renderers handle an absent collection without
inventing a server record.

### 8.5 File interaction

`useFileUpload` accepts type, size, multiplicity, initial metadata, and change callbacks. It exposes
drag/drop, picker, and removal interactions, rejects unacceptable files, and supplies previews. Its
paste listener ignores focused textareas and contenteditable elements, preserving rich-text editing
(`src/hooks/use-file-upload.ts:181-205`).

A single-file field replaces its selected value. A file metadata value supplies an existing preview
and travels back through form state when the user retains that asset. Image and video fields set the
form value from the first selected file; a feature chooses accept and size limits appropriate to its
server contract. The browser's acceptance result never authorizes an upload.

### 8.6 Error and submit lifecycle

The form observes submission state to disable its submit action and exposes a progress indication.
On an unsuccessful validation pass, errors remain associated with their field paths and the user can
correct values under dynamic revalidation. On a successful server mutation, the owning feature
performs navigation, query invalidation, dialog closing, or form reset according to its domain
contract; the form infrastructure does not choose those effects.

A dialog uses the same lifecycle as a page form but contains it within dialog chrome. It receives
`open`, `setOpen`, title, trigger, child fields, and submit label as view inputs; its form instance
continues to belong to the caller. This keeps close-state local while validation and submission
remain shared.

### 8.7 Form contract summary

| Stage       | Input                         | Output                                      |
| ----------- | ----------------------------- | ------------------------------------------- |
| Defaults    | typed feature input shape     | initial form values and field paths         |
| Edit        | registered field interaction  | typed form-state value and metadata         |
| Validate    | feature schema                | path-indexed user feedback                  |
| Submit      | valid values                  | feature mutation invocation                 |
| File submit | `File` plus structured values | multipart payload with JSON entries         |
| Complete    | mutation result               | feature-owned navigation or local UI effect |

## 9. Open Questions

N/A
