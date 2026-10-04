<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import ToggleGroupField from './toggle-group-field.svelte'

  const items = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
  ]
  const { disabled = false, initialValue = [] }: { disabled?: boolean; initialValue?: string[] } = $props()
  let value = $state<string[]>(untrack(() => initialValue))
</script>

<FormErrors errors={{}}><ToggleGroupField name="meals" {value} onChange={(next) => (value = next)} {disabled} {items} label="Meals" /></FormErrors>
<output aria-label="Meals value">{JSON.stringify(value)}</output>
