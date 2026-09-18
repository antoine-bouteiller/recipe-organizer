import { useFieldContext } from '@design-system/hooks/use-form-context'
import { useFileUpload, type FileMetadata } from '@recipe-organizer/design-system/hooks/use-file-upload'
import { usePlatform } from '@recipe-organizer/design-system/hooks/use-platform'
import { ImageIcon } from '@recipe-organizer/design-system/icons/image'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import { Kbd, KbdGroup } from '@recipe-organizer/design-system/kbd'

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

  const [{ files }, { getInputProps, removeFile }] = useFileUpload({
    initialFiles: initialImage ? [initialImage] : [],
    onFilesChange: (newFiles) => {
      field.setValue(newFiles[0]?.file)
    },
  })

  const previewUrl = files[0]?.preview

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <FieldLabel>{label}</FieldLabel>
      <FieldLabel presentation="dropzone-image">
        {previewUrl ? (
          <div className={styles.container}>
            <img alt="Aperçu" className={styles.image} src={previewUrl} />
          </div>
        ) : (
          <div className={styles.container2}>
            <div aria-hidden="true" className={styles.container3}>
              <span className={styles.text}>
                <ImageIcon size="sm" />
              </span>
            </div>
            <p className={styles.text2}>Déposez votre image ou cliquez pour parcourir</p>
            <div className={styles.container4}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
        {previewUrl && (
          <div className={styles.container5}>
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
      <input className={styles.element2} disabled={disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}
