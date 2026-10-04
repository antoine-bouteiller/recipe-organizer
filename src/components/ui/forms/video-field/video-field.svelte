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
      <div class="container">
        <div class="video-details">
          <div class="video-icon"><span class="text"><VideoIcon size="lg" /></span></div>
          <div class="video-metadata">
            <p class="file-name">{file.file.name || 'Video'}</p>
            {#if file.file.size}<p class="file-size">{formatBytes(file.file.size)}</p>{/if}
          </div>
        </div>
        <button
          aria-label="Remove video"
          class="element"
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
      <div class="upload-prompt">
        <div aria-hidden="true" class="upload-prompt-icon"><span class="upload-prompt-icon-graphic"><VideoIcon size="sm" /></span></div>
        <p class="upload-prompt-text">Déposez votre vidéo ou cliquez pour parcourir</p>
        <p class="format-hint">Formats supportés: MP4, WebM, MOV (max 100MB)</p>
        <div class="keyboard-shortcut"><KbdGroup><Kbd>{platform.current === 'macOS' ? '⌘' : 'Ctrl'}</Kbd><Kbd>V</Kbd></KbdGroup></div>
      </div>
    {/if}
  </FieldLabel>
  <input
    {...getInputProps()}
    aria-invalid={invalid() || upload.errors.length > 0 || undefined}
    aria-describedby={upload.errors.length ? `${id}-upload-error` : invalid() ? `${id}-error` : undefined}
    class="file-input"
    {disabled}
    {required}
    {id}
    {name}
  />
  {#if upload.errors.length}<Field invalid><FieldError id={`${id}-upload-error`}>{upload.errors.join(' ')}</FieldError></Field>{/if}
  <FieldError id={`${id}-error`} />
</Field>

<style>
  .container {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    padding-inline: 16px;
    width: 100%;
  }

  .video-details {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .video-icon {
    align-items: center;
    background-color: var(--colors-background);
    border-radius: var(--radius-full);
    border-width: 1px;
    display: flex;
    flex-shrink: 0;
    height: 40px;
    justify-content: center;
    width: 40px;
  }

  .text {
    opacity: 0.6;
  }

  .video-metadata {
    display: flex;
    flex-direction: column;
  }

  .file-name {
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
  }

  .file-size {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-xs);
  }

  .element {
    align-items: center;
    background-color: color-mix(in srgb, var(--colors-destructive) 10%, transparent);
    border-radius: var(--radius-full);
    color: var(--colors-destructive);
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    height: 32px;
    justify-content: center;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition-duration: 150ms;
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
    transition-timing-function: var(--easings-in-out);
    width: 32px;
  }

  .element:is(:focus-visible, [data-focus-visible]) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  @media (hover: hover) and (pointer: fine) {
    .element:hover {
      background-color: color-mix(in srgb, var(--colors-destructive) 20%, transparent);
    }
  }

  .upload-prompt {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 12px;
    padding-inline: 16px;
    text-align: center;
  }

  .upload-prompt-icon {
    align-items: center;
    background-color: var(--colors-background);
    border-radius: var(--radius-full);
    border-width: 1px;
    display: flex;
    flex-shrink: 0;
    height: 44px;
    justify-content: center;
    margin-bottom: 8px;
    width: 44px;
  }

  .upload-prompt-icon-graphic {
    opacity: 0.6;
  }

  .upload-prompt-text {
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
    margin-bottom: 6px;
  }

  .format-hint {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-xs);
    margin-bottom: 8px;
  }

  .keyboard-shortcut {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .keyboard-shortcut {
      display: block;
    }
  }

  .file-input {
    display: none;
  }
</style>
