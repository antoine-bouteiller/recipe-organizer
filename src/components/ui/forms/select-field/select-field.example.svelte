<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import SelectField from './select-field.svelte'

  const items = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ]
  const {
    disabled = false,
    initialValue = undefined,
    allowClear = false,
    showValue = false,
  }: { disabled?: boolean; initialValue?: string | null; allowClear?: boolean; showValue?: boolean } = $props()
  const options = $derived(allowClear ? [{ label: 'No status', value: null }, ...items] : items)
  let value = $state<string | null | undefined>(untrack(() => initialValue))
</script>

<FormErrors errors={{}}
  ><SelectField name="status" {value} onChange={(next) => (value = next)} {disabled} items={options} label="Status" /></FormErrors
>
{#if showValue}<output aria-label="Status value">{value === undefined ? 'undefined' : value === null ? 'null' : value}</output>{/if}
