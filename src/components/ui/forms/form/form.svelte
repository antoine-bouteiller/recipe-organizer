<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  export type FormProps = Pick<HTMLFormAttributes, 'action' | 'onsubmit'> & { errors?: Record<string, string>; children: Snippet }
</script>

<script lang="ts">
  import { provideFormErrors } from './form-context.svelte'

  import * as styles from './form.css'

  const { action, children, errors, onsubmit }: FormProps = $props()
  provideFormErrors(() => errors)
</script>

<form {action} class={styles.form} data-slot="form" novalidate {onsubmit}>{@render children()}</form>
