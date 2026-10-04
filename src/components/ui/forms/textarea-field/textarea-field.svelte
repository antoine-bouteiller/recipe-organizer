<script module lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  type TextareaFieldProps = Pick<HTMLTextareaAttributes, 'aria-label' | 'disabled' | 'onkeydown' | 'placeholder' | 'required'> & {
    name: string
    value: string
    onChange: (value: string) => void
    label?: string
    ref?: HTMLTextAreaElement
  }
</script>

<script lang="ts">
  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

  import * as surface from '../input/input-surface.css'
  import * as styles from './textarea-field.css'

  let {
    name,
    value,
    onChange,
    disabled,
    required,
    label,
    onkeydown,
    placeholder,
    ref = $bindable(),
    'aria-label': ariaLabel,
  }: TextareaFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
</script>

<Field {name}>
  {#if label}<FieldLabel for={id}>{label}</FieldLabel>{/if}
  <span class={surface.inputSurface} data-slot="textarea-control"
    ><textarea
      aria-invalid={invalid() || undefined}
      aria-describedby={invalid() ? `${id}-error` : undefined}
      aria-label={ariaLabel}
      class={styles.textarea}
      data-slot="textarea"
      {disabled}
      {required}
      {id}
      {name}
      oninput={(event) => onChange(event.currentTarget.value)}
      {onkeydown}
      {placeholder}
      bind:this={ref}
      {value}></textarea></span
  >
  <FieldError id={`${id}-error`} />
</Field>
