<script lang="ts">
  import Select from './select.svelte'

  const items = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ]
  let value = $state<string | null>(null)
</script>

<Select {items} onValueChange={(next) => (value = next)} placeholder="Choose a status" title="Status" {value} />
