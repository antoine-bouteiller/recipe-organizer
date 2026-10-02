import { useId } from 'react'

import { ImageIcon, XIcon } from '@/components/ui/data-display/icons'
import { Kbd, KbdGroup } from '@/components/ui/data-display/kbd/kbd'
import { useFileUpload } from '@/hooks/use-file-upload'
import type { FileMetadata } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platform'

import { Field, FieldError, FieldLabel } from '../field/field'

import * as styles from './image-field.css'

export interface ImageFieldProps {
  disabled?: boolean
  initialImage?: FileMetadata
  label: string
}

export const ImageField = ({ disabled, initialImage, label }: ImageFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()
  const id = useId()

  const [{ files }, { getInputProps, removeFile }] = useFileUpload({
    accept: 'image/*',
    initialFiles: initialImage ? [initialImage] : [],
    onFilesChange: (newFiles) => {
      field.setValue(newFiles[0]?.file)
    },
  })

  const previewUrl = files[0]?.preview

  return (
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldLabel htmlFor={id} presentation="dropzone-image">
        {previewUrl ? (
          <div className={styles.container}>
            <img alt="Aperçu" className={styles.image} src={previewUrl} />
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div aria-hidden="true" className={styles.uploadPromptIcon}>
              <span className={styles.text}>
                <ImageIcon size="sm" />
              </span>
            </div>
            <p className={styles.uploadPromptText}>Déposez votre image ou cliquez pour parcourir</p>
            <div className={styles.keyboardShortcut}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
        {previewUrl && (
          <div className={styles.removeButton}>
            <button
              aria-label="Supprimer l'image"
              className={styles.element}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeFile(files[0]?.id)
              }}
              type="button"
            >
              <XIcon aria-hidden="true" size="sm" />
            </button>
          </div>
        )}
      </FieldLabel>
      <input className={styles.fileInput} disabled={disabled} id={id} {...getInputProps()} />
      <FieldError />
    </Field>
  )
}
