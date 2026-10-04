<script module lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  export type InputProps = Pick<
    HTMLInputAttributes,
    'aria-invalid' | 'aria-describedby' | 'aria-label' | 'disabled' | 'id' | 'name' | 'oninput' | 'placeholder' | 'required' | 'type' | 'value'
  > & { defaultValue?: HTMLInputAttributes['value'] }
</script>

<script lang="ts">
  import * as surface from './input-surface.css'
  import * as styles from './input.css'

  const { defaultValue, value, ...rest }: InputProps = $props()
</script>

<span class={surface.inputSurface} data-slot="input-control"
  ><input {...rest} value={value ?? defaultValue} class={styles.input} data-slot="input" /></span
>
