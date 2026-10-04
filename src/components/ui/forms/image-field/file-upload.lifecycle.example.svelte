<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'

  import Upload from './file-upload.example.svelte'

  const { accept, maxSize }: { accept?: string; maxSize?: number } = $props()
  let mounted = $state(true)
  let selected = $state('No selection')
</script>

{#if mounted}<Upload {accept} {maxSize} onFilesChange={(files) => (selected = files[0]?.file.name ?? 'No selection')} />{/if}
<Button type="button" onclick={() => (mounted = !mounted)}>{mounted ? 'Destroy upload' : 'Mount upload'}</Button>
<p role="status">{selected}</p>
<label>Paste notes<textarea></textarea></label>
<div contenteditable="true" role="textbox" aria-label="Editable notes" tabindex="0"></div>
