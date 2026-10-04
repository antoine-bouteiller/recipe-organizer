<script lang="ts">
  import { untrack } from 'svelte'

  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  import FormErrors from '../form/form-errors.svelte'
  import ImageField from './image-field.svelte'

  const { disabled = false, initialImage = undefined }: { disabled?: boolean; initialImage?: FileMetadata } = $props()
  let value = $state<File | FileMetadata | undefined>(untrack(() => initialImage))
</script>

<FormErrors errors={{}}
  ><ImageField name="image" {value} onChange={(next) => (value = next)} {disabled} {initialImage} label="Recipe image" /></FormErrors
>
