import { useFileUpload, type FileMetadata } from '../../../hooks/use-file-upload'
import { useFieldContext } from '../../../hooks/use-form-context'
import { usePlatform } from '../../../hooks/use-platform'
import { VideoIcon } from '../../data-display/icons/video'
import { XIcon } from '../../data-display/icons/x'
import { Kbd, KbdGroup } from '../../data-display/kbd/kbd'
import { Field, FieldError, FieldLabel } from '../field/field'

import {
  container,
  container2,
  container3,
  text,
  container4,
  text2,
  text3,
  element,
  container5,
  container6,
  text4,
  text5,
  text6,
  container7,
  element2,
} from './video-field.css'

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
          <div className={container}>
            <div className={container2}>
              <div className={container3}>
                <span className={text}>
                  <VideoIcon size="lg" />
                </span>
              </div>
              <div className={container4}>
                <p className={text2}>{videoFile.file.name || 'Video'}</p>
                {videoFile.file.size && <p className={text3}>{formatBytes(videoFile.file.size)}</p>}
              </div>
            </div>
            <button
              aria-label="Remove video"
              className={element}
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
          <div className={container5}>
            <div aria-hidden="true" className={container6}>
              <span className={text4}>
                <VideoIcon size="sm" />
              </span>
            </div>
            <p className={text5}>Déposez votre vidéo ou cliquez pour parcourir</p>
            <p className={text6}>Formats supportés: MP4, WebM, MOV (max 100MB)</p>
            <div className={container7}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
      </FieldLabel>
      <input className={element2} disabled={disabled} type="file" {...getInputProps()} />
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
