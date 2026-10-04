<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  type FormProps = Pick<HTMLFormAttributes, 'action' | 'onsubmit'> & { errors?: Record<string, string>; children: Snippet }
</script>

<script lang="ts">
  import { provideFormErrors } from './form-context.svelte'

  const { action, children, errors, onsubmit }: FormProps = $props()
  provideFormErrors(() => errors)
</script>

<form {action} class="form" data-slot="form" novalidate {onsubmit}>{@render children()}</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
</style>
