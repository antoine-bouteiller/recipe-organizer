# Form Management

**CRITICAL RULES:**

- ALWAYS use TanStack Form (`@tanstack/react-form`) - NEVER use `useState` for form state
- NEVER use Base UI Select components in forms - use `ComboboxField` instead
- Import from `@/hooks/use-app-form` for all form functionality

## Core Hook: `useAppForm`

Located: `src/hooks/use-app-form.ts`

Provides:

- Field components: `TextField`, `NumberField`, `ComboboxField`, `SelectField`, `ImageField`, `TiptapField`
- Helpers: `useAppForm`, `withForm`, `withFieldGroup`

## Form Patterns

### 1. Single-Use Forms (Direct `useAppForm`)

**Use for**: Forms used in only ONE place (e.g., unique create/edit pages)
**Pattern**: Create form directly in component, render fields inline

```typescript
// In route component (e.g., src/routes/settings/profile.tsx)
const ProfilePage = () => {
  const { mutateAsync } = useMutation(updateProfileOptions())

  const form = useAppForm({
    defaultValues: { name: '', email: '' },
    validators: { onDynamic: profileSchema },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await mutateAsync({ data: value })
    },
  })

  return (
    <Form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.AppField name="name">
        {({ TextField }) => <TextField label="Name" />}
      </form.AppField>
      <form.AppField name="email">
        {({ TextField }) => <TextField label="Email" />}
      </form.AppField>
      <form.FormSubmit label="Save" />
    </Form>
  )
}
```

### 2. `withForm` - Reusable Form Components

**Use for**: Forms shared between create AND edit (or multiple contexts)
**Example**: Recipe form used in both create and edit routes

```typescript
// src/features/recipe/components/recipe-form.tsx
export const RecipeForm = withForm({
  defaultValues: recipeDefaultValues,
  props: {} as { initialImage?: FileMetadata },
  render: ({ form }) => (
    <>
      <form.AppField name="name">
        {({ TextField }) => <TextField label="Name" />}
      </form.AppField>
      {/* More fields... */}
    </>
  ),
})

// Usage in create route:
const form = useAppForm({ defaultValues, validators: { onDynamic: schema }, onSubmit })
return <RecipeForm form={form} fields={recipeFormFields} />
```

## Schema & Types

Define in `src/features/{feature}/api/{action}.ts`:

```typescript
const unitSchema = z.object({
  name: z.string().min(2),
  factor: z.number().positive().optional(),
  parentId: z.number().optional(),
})

export type UnitFormValues = z.infer<typeof unitSchema> // After validation
export type UnitFormInput = Partial<z.input<typeof unitSchema>> // Before validation (partial)
```

## Default Values & Field Maps

```typescript
export const unitDefaultValues: UnitFormInput = { name: '', factor: undefined, parentId: undefined }
export const unitFormFields = createFieldMap(unitDefaultValues) // Type-safe field names
```

## Field Components

All accessed via `<AppField name="...">` with render props:

### TextField

```typescript
<AppField name="name">
  {({ TextField }) => <TextField label="Name" placeholder="..." disabled={isSubmitting} />}
</AppField>
```

**Props**: `label`, `placeholder`, `disabled`, `className`

### NumberField

```typescript
<AppField name="quantity">
  {({ NumberField }) => <NumberField label="Quantity" min={0} max={100} decimalScale={2} disabled={isSubmitting} />}
</AppField>
```

**Props**: `label`, `min`, `max`, `step`, `decimalScale`, `placeholder`, `disabled`
**Features**: Auto-adjusting step, drag-to-scrub on label

### ComboboxField (Use for searchable selects)

```typescript
<AppField name="parentId">
  {({ ComboboxField }) => (
    <ComboboxField
      label="Parent"
      options={options}
      placeholder="Select..."
      searchPlaceholder="Search..."
      disabled={isSubmitting}
      nested  // Optional: for grouped options
    />
  )}
</AppField>
```

**Props**: `label`, `options`, `placeholder`, `searchPlaceholder`, `noResultsLabel`, `disabled`, `nested`

### SelectField (Simple dropdown)

```typescript
<AppField name="category">
  {({ SelectField }) => <SelectField label="Category" items={[{ label: 'Meat', value: 'meat' }]} disabled={isSubmitting} />}
</AppField>
```

**Props**: `label`, `items: { label, value }[]`, `disabled`

### ImageField

```typescript
<AppField name="image">
  {({ ImageField }) => <ImageField label="Photo" initialImage={initialImage} disabled={isSubmitting} />}
</AppField>
```

**Props**: `label`, `initialImage: { id, url }`, `disabled`
**Returns**: `File` or `FileMetadata` - Use `objectToFormData()` for submission

### TiptapField (Rich text)

```typescript
<AppField name="steps">
  {({ TiptapField }) => <TiptapField label="Steps" disabled={isSubmitting} />}
</AppField>
```

**Props**: `label`, `disabled`
**Returns**: HTML string

## Form Submission

```typescript
const { mutateAsync } = useMutation(createRecipeOptions())

const form = useAppForm({
  defaultValues,
  validators: { onDynamic: recipeSchema },
  validationLogic: revalidateLogic(),  // Validate on change after first submit
  onSubmit: async ({ value }) => {
    // With file uploads:
    await mutateAsync({ data: objectToFormData(value) })

    // JSON only:
    // await mutateAsync({ data: schema.parse(value) })
  },
})

return (
  <Form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} noValidate>
    <RecipeForm form={form} fields={fields} />
    <form.AppForm><form.FormSubmit label="Create" /></form.AppForm>
  </Form>
)
```

## Advanced Patterns

### Array Fields

```typescript
<Field mode="array" name="sections">
  {(field) => (
    <>
      {field.state.value?.map((item, i) => (
        <AppField key={i} name={`sections[${i}]`}>
          {({ Field }) => (
            <Field>
              <AppField name={`sections[${i}].name`}>
                {({ TextField }) => <TextField label="Name" />}
              </AppField>
              <Button onClick={() => field.removeValue(i)}>Remove</Button>
            </Field>
          )}
        </AppField>
      ))}
      <Button onClick={() => field.pushValue({ name: '' })}>Add</Button>
    </>
  )}
</Field>
```

### Conditional Fields

```typescript
<AppField name="parentId">
  {({ ComboboxField, state }) => (
    <>
      <ComboboxField options={units} />
      {state.value && (
        <AppField name="factor">
          {({ NumberField }) => <NumberField label="Factor" />}
        </AppField>
      )}
    </>
  )}
</AppField>
```

### Accessing Form State

```typescript
const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
const errors = useStore(form.store, (state) => formatFormErrors(state.errors))
```

## Decision Tree: Which Pattern to Use?

```
Is the form used in multiple places? (e.g., create AND edit)
├─ YES → Use withForm or withFieldGroup
│   ├─ Full form component? → withForm
│   └─ Small field group/dialog? → withFieldGroup
│
└─ NO (used only once) → Direct useAppForm (inline fields)
```

## Reference Implementation Files

**Single-use form** (direct useAppForm):

- Look for examples in route files where forms are defined inline

**Reusable form** (withForm - used in create + edit):

- Schema: `src/features/recipe/api/create.ts`
- Default values: `src/features/recipe/utils/constants.ts`
- Form component: `src/features/recipe/components/recipe-form.tsx`
- Usage: `src/routes/recipe/new.tsx`

**Reusable field group** (withFieldGroup - dialog):

- Schema: `src/features/units/api/create.ts`
- Form component: `src/features/units/components/unit-form.tsx`
- Usage: `src/features/units/components/edit-unit.tsx`

**Core files**:

- Hook: `src/hooks/use-app-form.ts`
- Field components: `src/components/forms/*.tsx`
