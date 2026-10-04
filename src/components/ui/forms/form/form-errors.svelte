<script lang="ts">
  import type { Snippet } from 'svelte'

  import { provideFormErrors } from './form-context.svelte'

  const { errors, children }: { errors?: Record<string, string>; children: Snippet } = $props()
  provideFormErrors(() => errors)
</script>

{@render children()}
