<script module lang="ts">
  interface NumberFieldProps {
    name: string
    value: number | undefined
    onChange: (value: number | undefined) => void
    disabled?: boolean
    required?: boolean
    label?: string
    max?: number
    min?: number
    placeholder?: string
  }
  const parse = (text: string): number | undefined => {
    const value = Number(text.replace(',', '.'))
    return text.trim() === '' || Number.isNaN(value) ? undefined : value
  }
</script>

<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { MinusIcon, PlusIcon } from '@/components/ui/data-display/icons'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

  import * as styles from './number-field.css'

  const { name, value, onChange, disabled, required, label, max = Infinity, min = -Infinity, placeholder }: NumberFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
  let text = $state('')
  const displayed = $derived(parse(text) === value ? text : String(value ?? ''))
  const clamp = (next: number) => Math.min(max, Math.max(min, next))
  const commit = (next: number) => {
    text = String(next)
    onChange(next)
  }
</script>

<Field {name}>
  {#if label}<FieldLabel for={id}>{label}</FieldLabel>{/if}
  <div class={styles.group} data-disabled={disabled || undefined} data-slot="number-field-group">
    <Button
      aria-label="Decrease"
      disabled={disabled || (value ?? 0) <= min}
      onclick={() => commit(clamp((value ?? 0) - 1))}
      size="stretch"
      type="button"
      variant="ghost"><MinusIcon /></Button
    >
    <input
      aria-invalid={invalid() || undefined}
      aria-describedby={invalid() ? `${id}-error` : undefined}
      autocomplete="off"
      class={styles.input}
      data-slot="number-field-input"
      {disabled}
      {required}
      {id}
      {name}
      inputmode="decimal"
      onblur={() => {
        if (value !== undefined) commit(clamp(value))
      }}
      oninput={(event) => {
        const next = event.currentTarget.value
        if (!/^-?\d*[.,]?\d*$/.test(next)) {
          event.currentTarget.value = displayed
          return
        }
        text = next
        onChange(parse(next))
      }}
      {placeholder}
      value={displayed}
    />
    <Button
      aria-label="Increase"
      disabled={disabled || (value ?? 0) >= max}
      onclick={() => commit(clamp((value ?? 0) + 1))}
      size="stretch"
      type="button"
      variant="ghost"><PlusIcon /></Button
    >
  </div>
  <FieldError id={`${id}-error`} />
</Field>
