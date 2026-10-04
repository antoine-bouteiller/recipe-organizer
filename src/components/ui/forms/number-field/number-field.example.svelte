<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import NumberField from './number-field.svelte'

  const { disabled = false, initialValue = undefined, invalid = false }: { disabled?: boolean; initialValue?: number; invalid?: boolean } = $props()
  let value = $state<number | undefined>(untrack(() => initialValue))
</script>

<FormErrors errors={invalid ? { servings: 'Invalid' } : {}}
  ><NumberField name="servings" {value} onChange={(next) => (value = next)} {disabled} label="Servings" min={1} placeholder="4" /></FormErrors
>
