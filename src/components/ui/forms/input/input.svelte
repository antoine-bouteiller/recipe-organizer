<script module lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type InputProps = Pick<
    HTMLInputAttributes,
    'aria-invalid' | 'aria-describedby' | 'aria-label' | 'disabled' | 'id' | 'name' | 'oninput' | 'placeholder' | 'required' | 'type' | 'value'
  > & { defaultValue?: HTMLInputAttributes['value'] }
</script>

<script lang="ts">
  const { defaultValue, value, ...rest }: InputProps = $props()
</script>

<span class="input-surface" data-slot="input-control"><input {...rest} value={value ?? defaultValue} class="input" data-slot="input" /></span>

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

  .input {
    background-color: transparent;
    border-radius: var(--radius-lg);
    height: 34px;
    line-height: 34px;
    min-width: 0px;
    outline: none;
    padding-inline: 11px;
    transition: background-color 5000000s ease-in-out 0s;
    width: 100%;
  }

  .input::-webkit-search-cancel-button,
  .input::-webkit-search-decoration,
  .input::-webkit-search-results-button,
  .input::-webkit-search-results-decoration {
    appearance: none;
    -webkit-appearance: none;
  }

  .input::file-selector-button {
    background-color: transparent;
    color: var(--colors-foreground);
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
    margin-inline-end: 12px;
  }

  .input[type='file'] {
    color: var(--colors-muted-foreground);
  }

  .input::placeholder,
  .input[data-placeholder] {
    color: color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent);
  }

  @media screen and (min-width: 640px) {
    .input {
      height: 30px;
      line-height: 30px;
    }
  }
</style>
