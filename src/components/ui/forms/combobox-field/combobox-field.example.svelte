<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import ComboboxField from './combobox-field.svelte'
  import type { Option } from './options'

  const defaultOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
  ]
  const {
    disabled = false,
    initialValue = undefined,
    invalid = false,
    label = 'Meal',
    options: items = defaultOptions,
  }: { disabled?: boolean; initialValue?: string; invalid?: boolean; label?: string; options?: Option<string>[] } = $props()
  let value = $state<string | undefined>(untrack(() => initialValue))
</script>

<FormErrors errors={invalid ? { meal: 'Invalid' } : {}}
  ><ComboboxField name="meal" {value} onChange={(next) => (value = next)} {disabled} {label} options={items} /></FormErrors
>
