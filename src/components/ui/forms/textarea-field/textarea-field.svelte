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
  <span class="input-surface" data-slot="textarea-control"
    ><textarea
      aria-invalid={invalid() || undefined}
      aria-describedby={invalid() ? `${id}-error` : undefined}
      aria-label={ariaLabel}
      class="textarea"
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

<style>
  .input-surface {
    background-color: var(--colors-background);
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    border-color: var(--colors-input);
    border-radius: var(--radius-lg);
    border-width: 1px;
    box-shadow: var(--shadows-xs);
    color: var(--colors-foreground);
    display: inline-flex;
    font-size: var(--font-sizes-base);
    position: relative;
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
  }

  .input-surface:has(:autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 4%, transparent);
  }

  .input-surface:has(:disabled) {
    opacity: 0.64;
  }

  .input-surface:has(:disabled, :focus-visible, [aria-invalid]) {
    box-shadow: var(--shadows-none);
  }

  .input-surface:has(:focus-visible) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
    border-width: 1px;
  }

  .input-surface:has(:focus-visible):has([aria-invalid='true']) {
    border-color: color-mix(in srgb, var(--colors-destructive) 64%, transparent);
    box-shadow: var(--shadows-ring-invalid);
  }

  .input-surface:has([aria-invalid='true']) {
    border-color: color-mix(in srgb, var(--colors-destructive) 36%, transparent);
  }

  :global(.dark) .input-surface:has(:autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 8%, transparent);
  }

  :global(.dark) .input-surface {
    background-clip: border-box;
    -webkit-background-clip: border-box;
  }

  @media screen and (min-width: 640px) {
    .input-surface {
      font-size: var(--font-sizes-sm);
    }
  }

  .textarea {
    background-color: transparent;
    border-radius: var(--radius-lg);
    field-sizing: content;
    min-height: 64px;
    min-width: 0px;
    outline: none;
    padding-block: 6px;
    padding-inline: 11px;
    resize: vertical;
    width: 100%;
  }

  .textarea::placeholder {
    color: color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent);
  }
</style>
