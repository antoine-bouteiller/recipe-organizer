<script lang="ts">
  import type { Snippet } from 'svelte'

  import { useFormErrors } from '../form/form-context.svelte'
  import { provideField } from './field-context.svelte'

  import * as styles from './field.css'

  const { children, invalid, name }: { children: Snippet; invalid?: boolean; name?: string } = $props()
  const form = useFormErrors()
  const error = $derived(name ? form.errors[name] : undefined)
  const isInvalid = $derived(Boolean(invalid || error))
  provideField({
    get error() {
      return error
    },
    get invalid() {
      return isInvalid
    },
  })
</script>

<div class={styles.field} data-invalid={isInvalid || undefined} data-slot="field">{@render children()}</div>
