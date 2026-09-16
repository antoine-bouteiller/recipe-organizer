import { css } from '@recipe-organizer/design-system/css'

import { useFileUpload, type FileMetadata } from '../../../hooks/use-file-upload'
import { useFieldContext } from '../../../hooks/use-form-context'
import { usePlatform } from '../../../hooks/use-platform'
import { VideoIcon } from '../../data-display/icons/video'
import { XIcon } from '../../data-display/icons/x'
import { Kbd, KbdGroup } from '../../data-display/kbd/kbd'
import { Field, FieldError, FieldLabel } from '../field/field'

export interface VideoFieldProps {
  disabled?: boolean
  initialVideo?: FileMetadata
  label: string
}

export const VideoField = ({ disabled, initialVideo, label }: VideoFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()

  const MAX_VIDEO_SIZE_MB = 100
  const maxVideoSizeBytes = MAX_VIDEO_SIZE_MB * 1024 * 1024

  const [{ files }, { getInputProps, removeFile }] = useFileUpload({
    accept: 'video/*',
    initialFiles: initialVideo ? [initialVideo] : [],
    maxSize: maxVideoSizeBytes,
    onFilesChange: (newFiles) => {
      field.setValue(newFiles[0]?.file)
    },
  })

  const [videoFile] = files

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <FieldLabel>{label}</FieldLabel>
      <FieldLabel presentation="dropzone-video">
        {videoFile ? (
          <div
            className={css({ alignItems: 'center', display: 'flex', gap: '4', justifyContent: 'space-between', paddingInline: '4', width: 'full' })}
          >
            <div className={css({ alignItems: 'center', display: 'flex', gap: '3' })}>
              <div
                className={css({
                  alignItems: 'center',
                  backgroundColor: 'background',
                  borderRadius: 'full',
                  borderWidth: '1px',
                  display: 'flex',
                  flexShrink: 0,
                  height: '10',
                  justifyContent: 'center',
                  width: '10',
                })}
              >
                <span className={css({ opacity: 0.6 })}>
                  <VideoIcon size="lg" />
                </span>
              </div>
              <div className={css({ display: 'flex', flexDirection: 'column' })}>
                <p className={css({ fontSize: 'sm', fontWeight: 'medium' })}>{videoFile.file.name || 'Video'}</p>
                {videoFile.file.size && <p className={css({ color: 'muted-foreground', fontSize: 'xs' })}>{formatBytes(videoFile.file.size)}</p>}
              </div>
            </div>
            <button
              aria-label="Remove video"
              className={css({
                _focusVisible: { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 50%, transparent)' },
                _hover: { backgroundColor: 'destructive/20' },
                alignItems: 'center',
                backgroundColor: 'destructive/10',
                borderRadius: 'full',
                color: 'destructive',
                cursor: 'pointer',
                display: 'flex',
                flexShrink: 0,
                height: '8',
                justifyContent: 'center',
                outline: 'none',
                transitionDuration: '150ms',
                transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
                transitionTimingFunction: 'in-out',
                width: '8',
              })}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeFile(videoFile.id)
              }}
              type="button"
            >
              <XIcon aria-hidden="true" size="sm" />
            </button>
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
                <VideoIcon size="sm" />
              </span>
            </div>
            <p className={css({ fontSize: 'sm', fontWeight: 'medium', marginBottom: '1.5' })}>Déposez votre vidéo ou cliquez pour parcourir</p>
            <p className={css({ color: 'muted-foreground', fontSize: 'xs', marginBottom: '2' })}>Formats supportés: MP4, WebM, MOV (max 100MB)</p>
            <div className={css({ display: 'none', md: { display: 'block' } })}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
      </FieldLabel>
      <input className={css({ display: 'none' })} disabled={disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
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
