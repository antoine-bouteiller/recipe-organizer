<script lang="ts">
  import type { Snippet } from 'svelte'

  import { useFormErrors } from '../form/form-context.svelte'
  import { provideField } from './field-context.svelte'

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

<div class="field" data-invalid={isInvalid || undefined} data-slot="field">{@render children()}</div>

<style>
  .field {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
</style>
