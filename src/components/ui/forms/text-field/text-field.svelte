<script module lang="ts">
  interface TextFieldProps {
    name: string
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    required?: boolean
    label?: string
    placeholder?: string
  }
</script>

<script lang="ts">
  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'
  import Input from '../input/input.svelte'

  const { name, value, onChange, disabled, required, label, placeholder }: TextFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
</script>

<Field {name}>
  {#if label}<FieldLabel for={id}>{label}</FieldLabel>{/if}
  <Input
    aria-invalid={invalid() || undefined}
    aria-describedby={invalid() ? `${id}-error` : undefined}
    {disabled}
    {required}
    {id}
    {name}
    oninput={(event) => onChange(event.currentTarget.value)}
    {placeholder}
    {value}
  />
  <FieldError id={`${id}-error`} />
</Field>
