import { css } from '@recipe-organizer/design-system/css'

import { useFileUpload, type FileMetadata } from '../../../hooks/use-file-upload'
import { useFieldContext } from '../../../hooks/use-form-context'
import { usePlatform } from '../../../hooks/use-platform'
import { ImageIcon } from '../../data-display/icons/image'
import { XIcon } from '../../data-display/icons/x'
import { Kbd, KbdGroup } from '../../data-display/kbd/kbd'
import { Field, FieldError, FieldLabel } from '../field/field'

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
          <div className={css({ inset: 0, position: 'absolute' })}>
            <img alt="Aperçu" className={css({ height: 'full', objectFit: 'cover', width: 'full' })} src={previewUrl} />
          </div>
        ) : (
          <div
            className={css({
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBlock: '3',
              paddingInline: '4',
              textAlign: 'center',
            })}
          >
            <div
              aria-hidden="true"
              className={css({
                alignItems: 'center',
                backgroundColor: 'background',
                borderRadius: 'full',
                borderWidth: '1px',
                display: 'flex',
                flexShrink: 0,
                height: '11',
                justifyContent: 'center',
                marginBottom: '2',
                width: '11',
              })}
            >
              <span className={css({ opacity: 0.6 })}>
                <ImageIcon size="sm" />
              </span>
            </div>
            <p className={css({ fontSize: 'sm', fontWeight: 'medium', marginBottom: '1.5' })}>Déposez votre image ou cliquez pour parcourir</p>
            <div className={css({ display: 'none', md: { display: 'block' } })}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
        {previewUrl && (
          <div className={css({ position: 'absolute', right: '4', top: '4' })}>
            <button
              aria-label="Supprimer l'image"
              className={css({
                _focusVisible: { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 50%, transparent)' },
                _hover: { backgroundColor: 'black/80' },
                alignItems: 'center',
                backgroundColor: 'black/60',
                borderRadius: 'full',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                height: '8',
                justifyContent: 'center',
                outline: 'none',
                transitionDuration: '150ms',
                transitionProperty: 'color, box-shadow',
                transitionTimingFunction: 'in-out',
                width: '8',
                zIndex: 50,
              })}
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
      <input className={css({ display: 'none' })} disabled={disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}
