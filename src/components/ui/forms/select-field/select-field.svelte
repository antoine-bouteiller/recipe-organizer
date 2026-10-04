<script lang="ts">
  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'
  import Select from '../select/select.svelte'

  interface SelectFieldProps {
    name: string
    value: string | null | undefined
    onChange: (value: string | null | undefined) => void
    disabled?: boolean
    items: { label: string; value: string | null }[]
    label?: string
  }
  const { name, value, onChange, disabled, items, label }: SelectFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
</script>

<Field {name}
  >{#if label}<FieldLabel id={`${id}-label`}>{label}</FieldLabel>{/if}<Select
    aria-invalid={invalid()}
    aria-describedby={invalid() ? `${id}-error` : undefined}
    {disabled}
    {id}
    {items}
    labelId={label ? `${id}-label` : undefined}
    onValueChange={(next) => onChange(next ?? undefined)}
    title={label}
    value={value ?? null}
  /><FieldError id={`${id}-error`} /></Field
>
