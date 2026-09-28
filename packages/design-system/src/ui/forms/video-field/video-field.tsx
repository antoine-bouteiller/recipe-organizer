import { useFieldContext } from '@design-system/hooks/use-form-context'
import { useFileUpload } from '@recipe-organizer/design-system/hooks/use-file-upload'
import type { FileMetadata } from '@recipe-organizer/design-system/hooks/use-file-upload'
import { usePlatform } from '@recipe-organizer/design-system/hooks/use-platform'
import { VideoIcon } from '@recipe-organizer/design-system/icons/video'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import { Kbd, KbdGroup } from '@recipe-organizer/design-system/kbd'
import { useId } from 'react'

import { Field, FieldError, FieldLabel } from '../field/field'

import * as styles from './video-field.css'

export interface VideoFieldProps {
  disabled?: boolean
  initialVideo?: FileMetadata
  label: string
}

export const VideoField = ({ disabled, initialVideo, label }: VideoFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()
  const id = useId()

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
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldLabel htmlFor={id} presentation="dropzone-video">
        {videoFile ? (
          <div className={styles.container}>
            <div className={styles.videoDetails}>
              <div className={styles.videoIcon}>
                <span className={styles.text}>
                  <VideoIcon size="lg" />
                </span>
              </div>
              <div className={styles.videoMetadata}>
                <p className={styles.fileName}>{videoFile.file.name || 'Video'}</p>
                {videoFile.file.size && <p className={styles.fileSize}>{formatBytes(videoFile.file.size)}</p>}
              </div>
            </div>
            <button
              aria-label="Remove video"
              className={styles.element}
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
          <div className={styles.uploadPrompt}>
            <div aria-hidden="true" className={styles.uploadPromptIcon}>
              <span className={styles.uploadPromptIconGraphic}>
                <VideoIcon size="sm" />
              </span>
            </div>
            <p className={styles.uploadPromptText}>Déposez votre vidéo ou cliquez pour parcourir</p>
            <p className={styles.formatHint}>Formats supportés: MP4, WebM, MOV (max 100MB)</p>
            <div className={styles.keyboardShortcut}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        )}
      </FieldLabel>
      <input className={styles.fileInput} disabled={disabled} id={id} {...getInputProps()} />
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
