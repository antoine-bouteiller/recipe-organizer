---
title: Forms
status: amended
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

| Decision                     | Choice                                                                                     | Rationale                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Form composition    | Server-backed forms use app-owned `createForm`; local Magimix dialogs retain `$state`      | One controlled field vocabulary without a second form framework.                                                    |
| `[KD-2]` Validation contract | API routes validate on the server; browser forms do not run Zod schemas                    | Editable drafts remain intact on failure; the Worker owns the trust boundary.                                       |
| `[KD-3]` Error projection    | `form.errors` uses dotted paths through `provideFormErrors`; controls look up their `name` | Shared field errors and `aria-invalid` without application dependencies in UI components.                           |
| `[KD-4]` File transport      | `createForm` sends structured JSON, or bracket-key multipart when any value is a `File`    | The recipe server reader reconstructs multipart and normalizes only that transport before strict schema validation. |

## 4. Principles & Intents

- `[PI-1]` **One form vocabulary** — refine `client.spec.md` `[PI-3]`: feature forms compose
  controlled fields rather than owning form-framework setup.
- `[PI-2]` **Validation belongs to the server** — Void routes validate all writes under `../../architecture.spec.md` `[PI-3]`.
- `[PI-3]` **Fields own control wiring** — a field translates its controlled value into a UI
  primitive and error slot, keeping feature views declarative.
- `[PI-4]` **Dialog form composition stays private** — the form-aware dialog integration preserves
  form semantics without exposing form-wrapper or panel-styling seams to features.

## 5. Non-Goals

- `[NG-1]` Client-side authorization or persistence of submitted server records; this refines
  `client.spec.md` `[KD-2]`.
- `[NG-2]` A separate schema language for the browser.
- `[NG-3]` Rich-text editor node design; the editor field accepts feature node configuration only.

## 6. Caveats

- `[C-1]` Bracket-key multipart converts numbers to strings, `null`/`undefined` to empty strings, and omits
  empty arrays. The recipe reader restores collections and optional values; JSON validation stays strict.
- `[C-4]` Mutations add no action URL/history entries. Edit success replaces the current entry with
  `/recipe/<id>` rather than using Back; creation replaces it with `/`.
- `[C-5]` User creation calls `reset()` with empty email and the default role after success.
- `[C-2]` File previews use browser resources and upload acceptance is a user-experience check;
  server validation and storage controls remain required.
- `[C-3]` Nested dialog forms stop submit propagation because a dialog can render within a page
  form (`src/components/ui/overlays/form-dialog/form-dialog.svelte`).

## 7. High-Level Components

| Component         | Location                                             | Responsibility                                  | Public API                                               |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Form state        | `src/lib/client/form.svelte.ts` / feature components | Reactive drafts, errors and pending state       | `createForm(initial)`, `$state`                          |
| Controlled fields | `src/components/ui/forms/*-field/`                   | Translate values into accessible controls       | `name`, `value`, `onChange`, existing presentation props |
| UI wrappers       | `src/components/ui/forms/{form,field}/`              | Project dotted-path errors into controls        | `Form`, `provideFormErrors`, `Field`, `useFieldInvalid`  |
| Submit            | `src/components/ui/forms/form-submit/`               | Disable and indicate submission                 | `label`, `pending`                                       |
| File adapter      | `src/hooks/use-file-upload.svelte.ts`                | Select, validate, preview, remove files         | `useFileUpload`, `FileMetadata`                          |
| Dialog            | `src/components/ui/overlays/form-dialog/`            | Private form frame and dialog chrome            | `FormDialog`                                             |
| Recipe transport  | `src/features/recipe/server/recipe-form-data.ts`     | Read JSON or bracket-key multipart and validate | `readRecipeFormData`, `validateRecipeForm`               |

## 8. Detailed Design

### 8.1 Controlled field contract

```svelte
const form = createForm(recipeDefaultValues)
<Form errors={form.errors} onsubmit={submit}>
  <TextField name="name" value={form.data.name ?? ''} onChange={(value) => (form.data.name = value)} label="Nom de la recette" />
  <FormSubmit label="Créer la recette" pending={form.pending} />
</Form>
```

`submit` is a native `onsubmit` handler that prevents default and awaits
`form.submit((body) => mutation.mutateAsync(body))`. Recipe pages
adapt `form.data` to `RecipeFormState` (`data`, `pending`, `setData`), where `setData` assigns `form.data[key]`.

Fields are ordinary controlled components, not registrations or context-bound state owners.
`provideFormErrors` shares a `Record<string, string>` through Svelte context; a `Field` and its control look up a dotted
`name` such as `ingredientGroups.0.ingredients.0.quantity`. Field roots associate labels and errors
with controls, and `useFieldInvalid(name)` supplies control-level `aria-invalid`.

### 8.2 Validation and transport

```ts
// src/lib/client/form.svelte.ts
export interface AppForm<TData extends Record<string, unknown>> {
  readonly data: TData // deeply reactive $state
  readonly errors: Record<string, string>
  readonly pending: boolean
  submit: (send: (body: FormData | TData) => Promise<unknown>) => Promise<boolean>
  reset: (values?: TData) => void
}
export const createForm: <TData extends Record<string, unknown>>(initial: TData) => AppForm<TData>

// 400 validation response from API writes
type FieldErrors = { error: string; errors: Record<string, string> }
```

`submit` sends JSON unless any nested value is a File; then it produces bracket-key multipart
under [C-1]. `readMultipart` in `src/features/recipe/server/recipe-form-data.ts` reconstructs it.
Recipe handlers keep `readRecipeFormData` and `validateRecipeForm`, validating against
`recipeSchema` / `updateRecipeSchema` after transport-specific normalization. JSON stays strict;
multipart restores numeric fields, omitted collections, blank optional assets, units and Magimix
values. Numeric-looking file metadata IDs remain strings; required empty numbers do not become zero.

`validateRecipeForm` throws `FieldValidationError` from `src/lib/server/http-error.ts`.
API mapping returns the envelope above with dotted body paths. `withValidator` failures project
body-slot issues into the same `errors` record while retaining the existing `error` string.
Browser forms never parse schemas. Typed `void/client` fetch through `readResponse` preserves
validation details for `createForm`; field failures keep drafts editable.

### 8.3 Arrays and local dialogs

The `RecipeFormState` adapter's `setData` accepts top-level keys. Recipe views replace entire nested collections using
immutable `replaceAt`, `removeAt`, and `moveAt` helpers. Unsaved rows carry stable `_key` values,
including linked recipes. The default own-steps group remains first and cannot be removed or moved.
Textarea bold shortcuts retain selection after immutable updates; eligible sub-recipes still derive
from the current positive linked-recipe ids.

The Magimix dialog uses local `$state`, bounded numeric controls, supported program/speed options,
and converts minutes/seconds to total seconds. Recipe submission owns server validation of Magimix
values; the dialog has no API mutation or client Zod validation. Opening an edit dialog restores its current
program data, not stale initial values.

### 8.4 File interaction

Image/video fields expose a browser `File`, retained `{ id, url }` metadata, or `undefined` when
removed. `useFileUpload` retains picker/paste, preview, type and size checks. Paste ignores focused
textareas/contenteditable elements. Browser file acceptance is not authorization or server validation.
`createForm` sends multipart only when a `File` exists anywhere in the form; unchanged assets travel as JSON
metadata otherwise. Existing video removal semantics remain unchanged by this migration.

### 8.5 Submit and error lifecycle

`Form` accepts a native `action` and/or an `onsubmit` handler. `FormDialog` receives
`errors`, `pending`, `action`/`onsubmit`, children, open/setOpen, title, submit label and a
`renderTrigger` snippet. Its private wrapper stops submit propagation, preserving nested
recipe-dialog isolation. Pending state disables submit and cancellation.

`form.submit(send)` resolves true on success. A 400 carrying `errors` fills the field-error
record and resolves false; all other failures reject and callers use `alertError` with the
existing French feature message. Drafts remain editable after validation failure.
Callers await mutations and own closing/navigation. Recipe creation replaces navigation to `/`;
editing replaces it to `/recipe/<id>`; edit Cancel still goes Back.
Settings dialogs close after success; user creation calls `reset()` with empty email/default role.
Button-only approval, blocking and deletion use feature mutation options and key invalidation,
without action URL/history entries. No page-action adapter remains.

### 8.6 Verification

The recipe transport tests cover structured JSON, uploaded binary files with nested bracket keys,
omitted nested collections and optional values, retained numeric-looking metadata ids, and strict
JSON rejection projected to dotted errors. Field/dialog stories cover controlled interaction, Enter
submission, pending dismissal prevention, and file selection/removal. Visual design remains a browser
review concern; tests do not assert CSS or geometry.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                             | Sections affected | Reason                                              |
| ---------- | --------------------------------------------------------------------- | ----------------- | --------------------------------------------------- |
| 2026-09-13 | Align form schemas and submission transport with Hono feature routes. | 3, 4, 8.2         | Preserve multipart support while migrating actions. |

| 2026-09-15 | Move reusable fields, form registry/context, file support, and dialog adapters to the design-system package. | 3, 6–8 | Share form presentation without depending on feature schemas or app services. |
| 2026-09-16 | Make the form-aware dialog composition a private styling/render boundary. | 4, 8.6 | Preserve form behavior without reopening Dialog or Form customization APIs. |
| 2026-09-28 | Describe native Form and Field error projection after removing Base UI. | 3, 8.1, 8.3 | Base UI is no longer a dependency. |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration. |

| 2026-10-03 | Replace TanStack form state with Void page forms and controlled fields; retain local React forms for API ingredients/Magimix. | 3, 6–8 | One form vocabulary with server validation and native Void transport. |
| 2026-10-04 | Migrate form composition to Svelte: `useForm` from `@void/svelte`, native `onsubmit`, `$state` dialogs. | 3, 7–8 | Match the shipped Svelte file/API conventions. |
