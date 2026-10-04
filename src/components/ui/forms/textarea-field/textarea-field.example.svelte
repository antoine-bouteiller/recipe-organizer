<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import TextareaField from './textarea-field.svelte'

  const { disabled = false, initialValue = '', showValue = false }: { disabled?: boolean; initialValue?: string; showValue?: boolean } = $props()
  let value = $state<string>(untrack(() => initialValue))
</script>

<FormErrors errors={{}}
  ><TextareaField name="step" {value} onChange={(next) => (value = next)} {disabled} label="Étape" placeholder="Décrivez l’étape" /></FormErrors
>
{#if showValue}<output aria-label="Step draft">{value}</output>{/if}
