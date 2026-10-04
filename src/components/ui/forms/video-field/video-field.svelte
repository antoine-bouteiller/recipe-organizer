<script module lang="ts">
  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  interface VideoFieldProps {
    name: string
    value: File | FileMetadata | undefined
    onChange: (value: File | FileMetadata | undefined) => void
    disabled?: boolean
    required?: boolean
    initialVideo?: FileMetadata
    label: string
  }
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const base = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const index = Math.floor(Math.log(bytes) / Math.log(base))
    return `${Number.parseFloat((bytes / base ** index).toFixed(1))} ${sizes[index]}`
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'

  import { VideoIcon, XIcon } from '@/components/ui/data-display/icons'
  import KbdGroup from '@/components/ui/data-display/kbd/kbd-group.svelte'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import { useFileUpload } from '@/hooks/use-file-upload.svelte'
  import { usePlatform } from '@/hooks/use-platform.svelte'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

  import * as styles from './video-field.css'

  const { name, value, onChange, disabled, required, initialVideo, label }: VideoFieldProps = $props()
  const platform = usePlatform()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
  const initial = untrack(() => (value && !(typeof File !== 'undefined' && value instanceof File) ? (value as FileMetadata) : initialVideo))
  const [upload, { getInputProps, removeFile }] = useFileUpload(() => ({
    accept: 'video/*',
    disabled,
    initialFiles: initial ? [initial] : [],
    maxSize: 100 * 1024 * 1024,
    onFilesChange: (files) => onChange(files[0]?.file),
  }))
  const file = $derived(upload.files[0])
</script>

<Field {name}>
  <FieldLabel for={id}>{label}</FieldLabel>
  <FieldLabel for={id} presentation="dropzone-video">
    {#if file}
      <div class={styles.container}>
        <div class={styles.videoDetails}>
          <div class={styles.videoIcon}><span class={styles.text}><VideoIcon size="lg" /></span></div>
          <div class={styles.videoMetadata}>
            <p class={styles.fileName}>{file.file.name || 'Video'}</p>
            {#if file.file.size}<p class={styles.fileSize}>{formatBytes(file.file.size)}</p>{/if}
          </div>
        </div>
        <button
          aria-label="Remove video"
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
        <div aria-hidden="true" class={styles.uploadPromptIcon}><span class={styles.uploadPromptIconGraphic}><VideoIcon size="sm" /></span></div>
        <p class={styles.uploadPromptText}>Déposez votre vidéo ou cliquez pour parcourir</p>
        <p class={styles.formatHint}>Formats supportés: MP4, WebM, MOV (max 100MB)</p>
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
