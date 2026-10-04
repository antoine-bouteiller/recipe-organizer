<script lang="ts">
  import { untrack } from 'svelte'

  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  import FormErrors from '../form/form-errors.svelte'
  import VideoField from './video-field.svelte'

  const { disabled = false, initialVideo = undefined }: { disabled?: boolean; initialVideo?: FileMetadata } = $props()
  let value = $state<File | FileMetadata | undefined>(untrack(() => initialVideo))
</script>

<FormErrors errors={{}}
  ><VideoField name="video" {value} onChange={(next) => (value = next)} {disabled} {initialVideo} label="Recipe video" /></FormErrors
>
