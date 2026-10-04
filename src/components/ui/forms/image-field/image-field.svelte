<script module lang="ts">
  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  interface ImageFieldProps {
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

  import { ImageIcon, XIcon } from '@/components/ui/data-display/icons'
  import KbdGroup from '@/components/ui/data-display/kbd/kbd-group.svelte'
  import Kbd from '@/components/ui/data-display/kbd/kbd.svelte'
  import { useFileUpload } from '@/hooks/use-file-upload.svelte'
  import { usePlatform } from '@/hooks/use-platform.svelte'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

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
      <div class="container"><img alt="Aperçu" class="image" src={file.preview} /></div>
      <div class="remove-button">
        <button
          aria-label="Supprimer l'image"
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
        <div aria-hidden="true" class="upload-prompt-icon"><span class="text"><ImageIcon size="sm" /></span></div>
        <p class="upload-prompt-text">Déposez votre image ou cliquez pour parcourir</p>

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
    inset: 0px;
    position: absolute;
  }

  .image {
    height: 100%;
    object-fit: cover;
    width: 100%;
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

  .text {
    opacity: 0.6;
  }

  .upload-prompt-text {
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
    margin-bottom: 6px;
  }

  .keyboard-shortcut {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .keyboard-shortcut {
      display: block;
    }
  }

  .remove-button {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .element {
    align-items: center;
    background-color: color-mix(in srgb, var(--colors-scrim) 60%, transparent);
    border-radius: var(--radius-full);
    color: var(--colors-inverse-foreground);
    cursor: pointer;
    display: flex;
    height: 32px;
    justify-content: center;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition-duration: 150ms;
    transition-property: color, box-shadow;
    transition-timing-function: var(--easings-in-out);
    width: 32px;
    z-index: 50;
  }

  .element:is(:focus-visible, [data-focus-visible]) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  @media (hover: hover) and (pointer: fine) {
    .element:hover {
      background-color: color-mix(in srgb, var(--colors-scrim) 80%, transparent);
    }
  }

  .file-input {
    display: none;
  }
</style>
