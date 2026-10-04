<script lang="ts">
  import type { FileWithPreview } from '@/hooks/use-file-upload.svelte'
  import { useFileUpload } from '@/hooks/use-file-upload.svelte'

  const {
    accept = 'image/*',
    maxSize = Infinity,
    onFilesChange,
  }: { accept?: string; maxSize?: number; onFilesChange: (files: FileWithPreview[]) => void } = $props()
  const [upload, { getInputProps, removeFile }] = useFileUpload(() => ({ accept, maxSize, onFilesChange }))
  const id = $props.id()
</script>

<label for={id}>Upload file</label>
<input {...getInputProps()} {id} />
{#each upload.files as file (file.id)}
  <p>{file.file.name}</p>
  {#if file.file.type?.startsWith('image/')}<img alt="Uploaded preview" src={file.preview} />{/if}
  <button type="button" onclick={() => removeFile(file.id)}>Remove upload</button>
{/each}
{#each upload.errors as error (error)}<p role="alert">{error}</p>{/each}
