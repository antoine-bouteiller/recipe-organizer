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
  <div class="group" data-disabled={disabled || undefined} data-slot="number-field-group">
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
      class="input"
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

<style>
  .group {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-background);
    border-color: var(--colors-input);
    border-radius: var(--radius-lg);
    border-width: 1px;
    color: var(--colors-foreground);
    display: flex;
    font-size: var(--font-sizes-base);
    justify-content: space-between;
    position: relative;
    outline-color: color-mix(in srgb, var(--colors-ring) 24%, transparent);
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
    --owner-icon-size: 18px;
  }

  .group:focus-within {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  .group:focus-within:has([aria-invalid]) {
    border-color: color-mix(in srgb, var(--colors-destructive) 64%, transparent);
    box-shadow: var(--shadows-invalid);
  }

  .group:has([aria-invalid]) {
    border-color: color-mix(in srgb, var(--colors-destructive) 36%, transparent);
  }

  .group:has(input:-webkit-autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 4%, transparent);
  }

  .group:not([data-disabled], :focus-within, [aria-invalid])::before {
    box-shadow: var(--shadows-edge);
  }

  .group[data-disabled] {
    opacity: 0.64;
    pointer-events: none;
  }

  :global(.dark) .group:focus-within:has([aria-invalid]) {
    box-shadow: var(--shadows-invalid);
  }

  :global(.dark) .group:has(input:-webkit-autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 8%, transparent);
  }

  :global(.dark) .group {
    background-color: color-mix(in srgb, var(--colors-input) 32%, transparent);
  }

  .group::before {
    border-radius: var(--radius-lg);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  @media screen and (min-width: 640px) {
    .group {
      font-size: var(--font-sizes-sm);
      --owner-icon-size: 16px;
    }
  }

  .input {
    background-color: transparent;
    flex-grow: 1;
    font-variant-numeric: tabular-nums;
    height: 34px;
    line-height: 34px;
    min-width: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-inline: 11px;
    text-align: center;
    transition: background-color 5000000s ease-in-out 0s;
    width: 100%;
  }

  @media screen and (min-width: 640px) {
    .input {
      height: 30px;
      line-height: 30px;
    }
  }

  .group :global(svg) {
    flex-shrink: 0;
    pointer-events: none;
  }
</style>
