---
title: Recipe Step Editor
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: apps/web/src/features/recipe/spec/index.spec.md
related: [docs/infrastructure/client/forms.spec.md, apps/web/src/features/recipe/spec/crud.spec.md]
---

## Why

Instructions used to be one Lexical document with Magimix and sub-recipe decorator nodes: opaque to
the server, detected by string markers, and sliced by counting root nodes. This leaf makes a
recipe's preparation an ordered list of typed steps, serving `index.spec.md` [G-3]. It owns the step
model, the bold-only text format, the form field that edits steps, and the read-only step renderer.

- `[NG-1]` Owning a generic rich-text editor; recipe steps need none.
- `[NG-2]` Calculating recipe flags, refining `crud.spec.md` [KD-3].
- `[NG-3]` Letting a sub-recipe step select a recipe outside the form's linked recipes.
- `[NG-4]` Inline formatting beyond bold (italics, links, lists, headings) or nested bold.
- `[NG-5]` Drag-and-drop reordering; move-up/move-down controls suffice.

## Design

- `[PI-1]` _Superseded by [PI-4]_ (nodes round-trip).
- `[PI-2]` **Read-only stays read-only** — detail and embedded views render steps without mounting
  edit controls or dialogs.
- `[PI-3]` **References remain live** — a sub-recipe step stores an id and range and fetches the
  source steps rather than copying them.
- `[PI-4]` **Data, not markup** — every step field is structured data; bold is the only inline
  formatting; labels, icons, and numbering are renderer choices.

| Decision                           | Choice                                                                                                                         | Rationale                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Domain-node registration  | _Superseded by [KD-5]._                                                                                                        | —                                                                                                               |
| `[KD-2]` Node representation       | _Superseded by [KD-5]._                                                                                                        | —                                                                                                               |
| `[KD-3]` Sub-recipe selection      | A sub-recipe step offers only recipe ids selected in the form's linked-recipe rows; CRUD re-checks it (`crud.spec.md` [KD-5]). | Embedded references stay aligned with the declared recipe relationship, now enforced at the trust boundary.     |
| `[KD-4]` Magimix flag signal       | _Superseded by `crud.spec.md` [KD-3]:_ the flag derives from step kinds; no serialized marker exists.                          | —                                                                                                               |
| `[KD-5]` Polymorphic step model    | Instructions are an ordered `RecipeStep[]`, a Zod discriminated union on `kind`: `text`, `magimix`, `subrecipe`.               | Each kind carries exactly its own data; validation, rendering, and flag derivation switch on one discriminator. |
| `[KD-6]` Bold-only markdown text   | A text step stores a plain string where `**…**` marks bold; nothing else is interpreted.                                       | Readable storage for the one formatting need; a tiny pure parser replaces a document model.                     |
| `[KD-7]` Textarea editing          | A text step is a textarea with a bold toggle (and `⌘B`/`Ctrl+B`) that wraps or unwraps the selection in `**`.                  | Raw markdown stays visible and predictable; recipe editing drops Lexical.                                       |
| `[KD-8]` Sub-recipe step range     | A sub-recipe step stores `recipeId` and an optional inclusive 1-based `fromStep`/`toStep` over the source's steps.             | Ranges use the step numbers a cook sees, replacing hide counts over Lexical root nodes.                         |
| `[KD-9]` Step list as a form field | Steps are a `useAppForm` array field keyed by `_key`; the cook adds a step of any kind, edits it inline, reorders, or removes. | Follows the ingredient-group field-array pattern of `docs/infrastructure/client/forms.spec.md`.                 |

The Magimix constants move from `apps/web/src/features/recipe/types/magimix.ts` to
`packages/shared/src/recipe/` because the server now validates them. The recipe Lexical extensions
(`components/editor/**`, `recipeNodes`) are removed, together with the design-system `editor` and
`editor-field` components whose only consumer was recipe instructions.

## Outcome

- `[SO-1]` Recipe instructions are an ordered list of typed steps — text, Magimix program, or
  sub-recipe — edited through one form field. — demonstrated by `[VC-1]`, `[VC-2]`
- `[SO-2]` Text steps support bold and nothing else, stored as readable markdown. — demonstrated by
  `[VC-3]`, `[VC-4]`
- `[SO-3]` A sub-recipe step embeds a live, optionally ranged slice of a linked recipe's steps, and a
  link cycle cannot recurse. — demonstrated by `[VC-5]`, `[VC-6]`
- `[SO-4]` Recipe code and the design system no longer depend on Lexical. — demonstrated by `[VC-7]`

## Contracts

### `[CT-1]` Step model

```ts
// packages/shared/src/recipe/schemas.ts
const textStepSchema = z.object({
  kind: z.literal('text'),
  text: z.string().trim().min(1), // bold-only markdown, [CT-2]
})

const magimixStepSchema = z.object({
  kind: z.literal('magimix'),
  program: z.enum(magimixProgram),
  rotationSpeed: z.enum(allowedRotationSpeed),
  time: z.number().int().min(1).max(3660), // total seconds; dialog caps minutes and seconds at 60 each
  temperature: z.number().int().min(0).max(200).optional(),
})

const subrecipeStepSchema = z
  .object({
    kind: z.literal('subrecipe'),
    recipeId: z.number().int().positive(),
    fromStep: z.number().int().min(1).optional(), // inclusive, 1-based; default: first step
    toStep: z.number().int().min(1).optional(), //   inclusive, 1-based; default: last step
  })
  .refine((s) => s.fromStep === undefined || s.toStep === undefined || s.fromStep <= s.toStep)

export const recipeStepSchema = z.discriminatedUnion('kind', [textStepSchema, magimixStepSchema, subrecipeStepSchema])
export type RecipeStep = z.infer<typeof recipeStepSchema>

// recipeSchema: `instructions: z.string()` becomes
steps: z.array(recipeStepSchema.and(z.object({ _key: z.string() })))
```

- Array order is step order; persistence stores the 1-based index as `position`
  (`crud.spec.md` [CT-1]).
- `_key` is a form-only identity for stable React keys; it is not persisted.
- The FormData wire carries `steps` as one JSON string, like `ingredientGroups`.

### `[CT-2]` Bold-only text

```ts
type TextSegment = { text: string; bold: boolean }
parseBoldText(text: string): TextSegment[]
```

| Input                    | Segments                                                 |
| ------------------------ | -------------------------------------------------------- |
| `Mélanger **vivement**.` | `Mélanger ` · **`vivement`** · `.`                       |
| `**Four** chaud`         | **`Four`** · ` chaud`                                    |
| `a ** b`                 | `a ** b` (unmatched delimiter is literal)                |
| `ligne 1\nligne 2`       | one plain segment; the renderer preserves the line break |

- `**` pairs toggle bold left to right; bold never nests; `****` yields nothing; a trailing
  unmatched `**` is plain text.
- Every other character, including HTML, is plain text and renders as text, never as markup.
- The server stores the string unparsed.
- Bold toggle: wraps the textarea selection in `**`, or unwraps it when already wrapped; with no
  selection it inserts `****` and places the caret between the delimiters. `⌘B`/`Ctrl+B` is the
  same action.

### `[CT-3]` Steps field

```text
StepsField (withForm, array field `steps`)
├── per step: kind-specific editor · move up · move down · remove
│   ├── text       → textarea + bold toggle            [CT-2]
│   ├── magimix    → program item opening the dialog
│   └── subrecipe  → linked-recipe picker + from/to step numbers
└── add: « Texte » · « Magimix » · « Sous-recette »
```

- **Magimix dialog** keeps the previous validation — supported program and speed, temperature
  0–200, minutes and seconds each 0–60 — and converts the time fields to total seconds.
- **Sub-recipe picker** reads eligible ids and names from `LinkedRecipesProvider`, derived from the
  form's positive linked-recipe ids; placeholder rows are not eligible. Removing a linked recipe that
  a step still references leaves the step invalid: the form shows the field error and CRUD rejects
  the submission (`crud.spec.md` [KD-5]).

### `[CT-4]` Step renderer

```text
RecipeSteps(steps, visited = {currentRecipeId})
├── text       → numbered step, parseBoldText segments (bold → <strong>)
├── magimix    → numbered step, program image, French label, duration, speed, temperature?
└── subrecipe  → section titled with the source name
                 └── RecipeSteps(source.steps[from-1 .. to-1], visited ∪ {source.id})
```

- Text and Magimix steps are numbered in list order; a sub-recipe section keeps the source's own
  numbers, so "étapes 2 à 4" reads the same as in the source.
- The source comes from the instructions projection (`display.spec.md` [KD-1]). The range is clamped
  to the source's current step count; an empty clamped range, or an unavailable source, renders the
  title with no body.
- A nested sub-recipe whose source is already in `visited` renders its title only.
- The renderer mounts no edit control ([PI-2]).

## Acceptance

- `[VC-1]` Given the recipe form, when the cook adds a text, a Magimix, and a sub-recipe step, moves
  the last one up, and removes the first, then the submitted `steps` array has exactly that order
  and those kinds (recipe-form story play function). — demonstrates `[SO-1]`
- `[VC-2]` Given step payloads with a missing field, an unknown `kind`, an out-of-range temperature,
  or `fromStep > toStep`, when parsed with `recipeStepSchema`, then parsing fails; a valid payload of
  each kind parses unchanged (`*.test.ts`). — demonstrates `[SO-1]`
- `[VC-3]` Given the inputs in [CT-2], when passed to `parseBoldText`, then it returns the listed
  segments, and `<b>` in input stays literal text (`*.test.ts`). — demonstrates `[SO-2]`
- `[VC-4]` Given a textarea selection, when the cook presses the bold toggle or `⌘B` twice, then the
  selection is first wrapped in `**` and then unwrapped (steps-field story). — demonstrates `[SO-2]`
- `[VC-5]` Given source recipe B with 5 steps and recipe A with `{ kind: 'subrecipe', recipeId: B,
fromStep: 2, toStep: 4 }`, when A's detail page renders, then B's steps 2–4 appear under B's name;
  after B shrinks to 3 steps, steps 2–3 appear. — demonstrates `[SO-3]`
- `[VC-6]` Given A embeds B and B embeds A, when A renders, then B's section shows and its nested A
  section shows the title only. — demonstrates `[SO-3]`
- `[VC-7]` Given the change, when `vp check` (including knip) runs, then it passes and no `lexical`
  import remains in `apps/web` or `packages/design-system`. — demonstrates `[SO-4]`

## Caveats

- `[C-1]` _Superseded by `crud.spec.md` [KD-3]:_ no compact-JSON marker contract remains.
- `[C-2]` _Superseded by `crud.spec.md` [KD-5]:_ a sub-recipe step has a restricting foreign key, so
  its source cannot be deleted.
- `[C-3]` Embedded steps follow query freshness and can briefly lag behind their source recipe.
- `[C-4]` A literal `**` cannot be written in a text step.
- `[C-5]` A sub-recipe range is not re-validated when its source's steps change; the renderer clamps.

## Open Questions

N/A
