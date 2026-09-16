import { useFileUpload, type FileMetadata } from '../../../hooks/use-file-upload'
import { useFieldContext } from '../../../hooks/use-form-context'
import { usePlatform } from '../../../hooks/use-platform'
import { ImageIcon } from '../../data-display/icons/image'
import { XIcon } from '../../data-display/icons/x'
import { Kbd, KbdGroup } from '../../data-display/kbd/kbd'
import { Field, FieldError, FieldLabel } from '../field/field'

import { container, image, container2, container3, text, text2, container4, container5, element, element2 } from './image-field.css'

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
          <div className={container}>
            <img alt="Aperçu" className={image} src={previewUrl} />
          </div>
        ) : (
          <div className={container2}>
            <div aria-hidden="true" className={container3}>
              <span className={text}>
                <ImageIcon size="sm" />
              </span>
            </div>
            <p className={text2}>Déposez votre image ou cliquez pour parcourir</p>
            <div className={container4}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
        {previewUrl && (
          <div className={container5}>
            <button
              aria-label="Supprimer l'image"
              className={element}
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
      <input className={element2} disabled={disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}
