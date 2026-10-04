<script module lang="ts">
  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  export interface ImageFieldProps {
    name: string
    value: File | FileMetadata | undefined
    onChange: (value: File | FileMetadata | undefined) => void
    disabled?: boolean
    required?: boolean
    initialImage?: FileMetadata
    label: string
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'

  import { ImageIcon, XIcon } from '@/components/ui/data-display/icons/svelte'
  import KbdGroup from '@/components/ui/data-display/kbd/kbd-group.svelte'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import { useFileUpload } from '@/hooks/use-file-upload.svelte'
  import { usePlatform } from '@/hooks/use-platform.svelte'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

  import * as styles from './image-field.css'

  const { name, value, onChange, disabled, required, initialImage, label }: ImageFieldProps = $props()
  const platform = usePlatform()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
  const initial = untrack(() => (value && !(typeof File !== 'undefined' && value instanceof File) ? (value as FileMetadata) : initialImage))
  const [upload, { getInputProps, removeFile }] = useFileUpload(() => ({
    accept: 'image/*',
    disabled,
    initialFiles: initial ? [initial] : [],
    onFilesChange: (files) => onChange(files[0]?.file),
  }))
  const file = $derived(upload.files[0])
</script>

<Field {name}>
  <FieldLabel for={id}>{label}</FieldLabel>
  <FieldLabel for={id} presentation="dropzone-image">
    {#if file}
      <div class={styles.container}><img alt="Aperçu" class={styles.image} src={file.preview} /></div>
      <div class={styles.removeButton}>
        <button
          aria-label="Supprimer l'image"
          class={styles.element}
          {disabled}
          onclick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            removeFile(file.id)
          }}
          type="button"><XIcon aria-hidden="true" size="sm" /></button
        >
      </div>
    {:else}
      <div class={styles.uploadPrompt}>
        <div aria-hidden="true" class={styles.uploadPromptIcon}><span class={styles.text}><ImageIcon size="sm" /></span></div>
        <p class={styles.uploadPromptText}>Déposez votre image ou cliquez pour parcourir</p>

        <div class={styles.keyboardShortcut}><KbdGroup><Kbd>{platform.current === 'macOS' ? '⌘' : 'Ctrl'}</Kbd><Kbd>V</Kbd></KbdGroup></div>
      </div>
    {/if}
  </FieldLabel>
  <input
    {...getInputProps()}
    aria-invalid={invalid() || upload.errors.length > 0 || undefined}
    aria-describedby={upload.errors.length ? `${id}-upload-error` : invalid() ? `${id}-error` : undefined}
    class={styles.fileInput}
    {disabled}
    {required}
    {id}
    {name}
  />
  {#if upload.errors.length}<Field invalid><FieldError id={`${id}-upload-error`}>{upload.errors.join(' ')}</FieldError></Field>{/if}
  <FieldError id={`${id}-error`} />
</Field>
