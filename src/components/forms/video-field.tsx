import { VideoIcon, XIcon } from '@phosphor-icons/react'

import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { type FileMetadata, useFileUpload } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platfom'

interface VideoFieldProps {
  disabled?: boolean
  initialVideo?: FileMetadata
  label: string
}

export const VideoField = ({ disabled, initialVideo, label }: VideoFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()

  const MAX_VIDEO_SIZE_MB = 100
  const maxVideoSizeBytes = MAX_VIDEO_SIZE_MB * 1024 * 1024

  const [{ files, isDragging }, { getInputProps, removeFile }] = useFileUpload({
    accept: 'video/*',
    initialFiles: initialVideo ? [initialVideo] : [],
    maxFiles: 1,
    maxSize: maxVideoSizeBytes,
    multiple: false,
    onFilesChange: (newFiles) => {
      field.setValue(newFiles[0]?.file)
    },
  })

  const [videoFile] = files

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <FieldLabel>{label}</FieldLabel>
      <FieldLabel
        className="relative flex min-h-32 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-invalid:border-destructive data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
      >
        {videoFile ? (
          <div className="flex w-full items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background">
                <VideoIcon className="size-5 opacity-60" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{videoFile.file.name || 'Video'}</p>
                {videoFile.file.size && <p className="text-xs text-muted-foreground">{formatBytes(videoFile.file.size)}</p>}
              </div>
            </div>
            <button
              aria-label="Remove video"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors outline-none hover:bg-destructive/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeFile(videoFile.id)
              }}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div aria-hidden="true" className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
              <VideoIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Déposez votre vidéo ou cliquez pour parcourir</p>
            <p className="mb-2 text-xs text-muted-foreground">Formats supportés: MP4, WebM, MOV (max 100MB)</p>
            <KbdGroup className="hidden items-center gap-1 md:flex">
              <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd className="aspect-square">V</Kbd>
            </KbdGroup>
          </div>
        )}
      </FieldLabel>
      <FieldControl className="hidden" disabled={disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}

const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const base = 1024
  const dm = Math.max(0, decimals)
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const index = Math.floor(Math.log(bytes) / Math.log(base))

  return `${Number.parseFloat((bytes / base ** index).toFixed(dm))} ${sizes[index]}`
}
